"""Wizard: sesiones de preguntas por fase, con streaming SSE."""
from __future__ import annotations

import json
from collections.abc import AsyncIterator

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlmodel import Session, select

from database import get_session
from models.project import Project
from models.session import WizardSession
from services.engines import load_active_engine
from services.wizard_service import (
    PHASE_ORDER,
    is_phase_complete,
    next_question,
    record_user_answer,
)

router = APIRouter(tags=["wizard"])


class AnswerIn(BaseModel):
    content: str


class LangIn(BaseModel):
    lang: str | None = None


def _sse(payload: dict) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


@router.post("/api/projects/{project_id}/sessions")
def start_session(project_id: str, db: Session = Depends(get_session)) -> WizardSession:
    if not db.get(Project, project_id):
        raise HTTPException(404, "Proyecto no encontrado")
    session = WizardSession(project_id=project_id, phase=PHASE_ORDER[0])
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/api/projects/{project_id}/sessions")
def list_sessions(project_id: str, db: Session = Depends(get_session)) -> list[WizardSession]:
    return list(
        db.exec(select(WizardSession).where(WizardSession.project_id == project_id)).all()
    )


@router.post("/api/sessions/{session_id}/answer")
def answer(session_id: str, body: AnswerIn, db: Session = Depends(get_session)) -> dict:
    session = db.get(WizardSession, session_id)
    if not session:
        raise HTTPException(404, "Sesión no encontrada")
    record_user_answer(session, body.content, db)
    return {"ok": True}


@router.post("/api/sessions/{session_id}/next")
async def next_message(
    session_id: str,
    body: LangIn | None = None,
    db: Session = Depends(get_session),
) -> StreamingResponse:
    """Hace streaming de la siguiente pregunta de la IA (SSE)."""
    session = db.get(WizardSession, session_id)
    if not session:
        raise HTTPException(404, "Sesión no encontrada")
    project = db.get(Project, session.project_id)
    engine = load_active_engine(db)
    lang = body.lang if body and body.lang else "English"

    async def gen() -> AsyncIterator[str]:
        buffer: list[str] = []
        try:
            async for piece in next_question(
                engine, session, project.raw_idea if project else "", db, lang=lang
            ):
                buffer.append(piece)
                yield _sse({"delta": piece})
        except Exception as exc:  # noqa: BLE001
            yield _sse({"error": f"{type(exc).__name__}: {exc}"})
            return
        yield _sse({"done": True, "phase_complete": is_phase_complete("".join(buffer))})

    return StreamingResponse(gen(), media_type="text/event-stream")


@router.post("/api/sessions/{session_id}/advance")
def advance(session_id: str, db: Session = Depends(get_session)) -> WizardSession | dict:
    """Crea una sesión para la siguiente fase. Si no hay más, devuelve {finished: true}."""
    session = db.get(WizardSession, session_id)
    if not session:
        raise HTTPException(404, "Sesión no encontrada")
    idx = PHASE_ORDER.index(session.phase) if session.phase in PHASE_ORDER else 0
    if idx + 1 >= len(PHASE_ORDER):
        return {"finished": True}
    nxt = WizardSession(project_id=session.project_id, phase=PHASE_ORDER[idx + 1])
    db.add(nxt)
    db.commit()
    db.refresh(nxt)
    return nxt
