"""Lógica del wizard: genera la siguiente pregunta de cada fase con el engine activo."""
from __future__ import annotations

import json
from collections.abc import AsyncIterator

from sqlmodel import Session

from models.session import WizardSession
from services.engines import Engine
from services.prompts import load_prompt

# Orden de fases del MVP (las dos últimas quedan como scaffold).
PHASE_ORDER = ["discovery", "scope", "technical", "goals"]
PHASE_COMPLETE_TOKEN = "[[PHASE_COMPLETE]]"


def _format_history(messages: list[dict]) -> str:
    if not messages:
        return "(sin respuestas todavía)"
    lines = []
    for m in messages:
        who = "IA" if m["role"] == "assistant" else "Usuario"
        lines.append(f"- {who}: {m['content']}")
    return "\n".join(lines)


async def next_question(
    engine: Engine,
    session: WizardSession,
    raw_idea: str,
    db: Session,
) -> AsyncIterator[str]:
    """Hace streaming de la siguiente pregunta. Persiste el mensaje del asistente."""
    messages = json.loads(session.messages or "[]")
    template = load_prompt(session.phase if session.phase in PHASE_ORDER else "discovery")
    system = template.format(raw_idea=raw_idea, history=_format_history(messages))

    collected: list[str] = []
    async for piece in engine.stream([{"role": "user", "content": "Continúa."}], system=system):
        collected.append(piece)
        yield piece

    answer = "".join(collected).strip()
    messages.append({"role": "assistant", "content": answer})
    session.messages = json.dumps(messages, ensure_ascii=False)
    db.add(session)
    db.commit()


def record_user_answer(session: WizardSession, content: str, db: Session) -> None:
    """Añade la respuesta del usuario al historial de la sesión."""
    messages = json.loads(session.messages or "[]")
    messages.append({"role": "user", "content": content})
    session.messages = json.dumps(messages, ensure_ascii=False)
    db.add(session)
    db.commit()


def is_phase_complete(text: str) -> bool:
    return PHASE_COMPLETE_TOKEN in text
