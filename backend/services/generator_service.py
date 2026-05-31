"""Pipeline de generación de documentos. MVP: PRD, Tech Spec, Estimation."""
from __future__ import annotations

import json
from collections.abc import AsyncIterator

from sqlmodel import Session, select

from models.document import Document
from models.session import WizardSession
from services.engines import Engine
from services.prompts import load_prompt

# doc_type -> plantilla generadora. Ampliable (user_flows, prompts_pack, readme).
MVP_DOCUMENTS = {
    "prd": "generators/prd",
    "tech_spec": "generators/tech_spec",
    "estimation": "generators/estimation",
}


def _build_transcript(db: Session, project_id: str) -> str:
    sessions = db.exec(
        select(WizardSession).where(WizardSession.project_id == project_id)
    ).all()
    lines: list[str] = []
    for s in sessions:
        lines.append(f"### Fase: {s.phase}")
        for m in json.loads(s.messages or "[]"):
            who = "IA" if m["role"] == "assistant" else "Usuario"
            lines.append(f"- {who}: {m['content']}")
    return "\n".join(lines) if lines else "(sin transcripción de wizard)"


async def generate_document(
    engine: Engine,
    db: Session,
    project_id: str,
    raw_idea: str,
    doc_type: str,
) -> AsyncIterator[str]:
    """Genera UN documento en streaming y lo persiste (versionado)."""
    template = load_prompt(MVP_DOCUMENTS[doc_type])
    transcript = _build_transcript(db, project_id)
    system = template.format(raw_idea=raw_idea, transcript=transcript)

    collected: list[str] = []
    async for piece in engine.stream(
        [{"role": "user", "content": "Genera el documento ahora."}], system=system
    ):
        collected.append(piece)
        yield piece

    content = "".join(collected).strip()
    prev = db.exec(
        select(Document)
        .where(Document.project_id == project_id, Document.doc_type == doc_type)
    ).all()
    version = max((d.version for d in prev), default=0) + 1
    db.add(Document(project_id=project_id, doc_type=doc_type, content=content, version=version))
    db.commit()
