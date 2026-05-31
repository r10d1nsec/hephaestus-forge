"""Documentos: generación (SSE) y consulta."""
from __future__ import annotations

import json
from collections.abc import AsyncIterator

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select

from database import get_session
from models.document import Document
from models.project import Project
from services.engines import load_active_engine
from services.generator_service import MVP_DOCUMENTS, generate_document

router = APIRouter(tags=["documents"])


def _sse(payload: dict) -> str:
    return f"data: {json.dumps(payload, ensure_ascii=False)}\n\n"


@router.get("/api/projects/{project_id}/documents")
def list_documents(project_id: str, db: Session = Depends(get_session)) -> list[Document]:
    return list(db.exec(select(Document).where(Document.project_id == project_id)).all())


@router.get("/api/documents/{document_id}")
def get_document(document_id: str, db: Session = Depends(get_session)) -> Document:
    doc = db.get(Document, document_id)
    if not doc:
        raise HTTPException(404, "Documento no encontrado")
    return doc


@router.post("/api/projects/{project_id}/generate")
async def generate(project_id: str, db: Session = Depends(get_session)) -> StreamingResponse:
    """Genera los documentos del MVP (PRD, Tech Spec, Estimation) en streaming SSE."""
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(404, "Proyecto no encontrado")
    engine = load_active_engine(db)

    async def gen() -> AsyncIterator[str]:
        for doc_type in MVP_DOCUMENTS:
            yield _sse({"doc_start": doc_type})
            try:
                async for piece in generate_document(
                    engine, db, project_id, project.raw_idea, doc_type
                ):
                    yield _sse({"doc_type": doc_type, "delta": piece})
            except Exception as exc:  # noqa: BLE001
                yield _sse({"doc_type": doc_type, "error": f"{type(exc).__name__}: {exc}"})
                continue
            yield _sse({"doc_done": doc_type})
        project.status = "complete"
        db.add(project)
        db.commit()
        yield _sse({"all_done": True})

    return StreamingResponse(gen(), media_type="text/event-stream")
