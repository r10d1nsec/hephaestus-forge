"""Pipeline de generación de documentos: Blueprint, PRD, Tech Spec, Estimation."""
from __future__ import annotations

import json
from collections.abc import AsyncIterator

from sqlmodel import Session, select

from models.document import Document
from models.session import WizardSession
from services.engines import Engine
from services.lang import DEFAULT_LANGUAGE, language_name
from services.prompts import load_prompt

# doc_type -> plantilla generadora. El orden importa: blueprint primero (documento cabecera).
# Ampliable (user_flows, prompts_pack, readme).
MVP_DOCUMENTS = {
    "blueprint": "generators/blueprint",
    "prd": "generators/prd",
    "tech_spec": "generators/tech_spec",
    "estimation": "generators/estimation",
}


def _strip_outer_fence(content: str) -> str:
    """Quita un fence ```markdown ... ``` que envuelva TODO el documento (algunos modelos lo añaden)."""
    s = content.strip()
    if s.startswith("```"):
        first_nl = s.find("\n")
        if first_nl != -1 and s.rstrip().endswith("```"):
            s = s[first_nl + 1 :].rstrip()[:-3].rstrip()
    return s


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
    lang: str = DEFAULT_LANGUAGE,
) -> AsyncIterator[str]:
    """Genera UN documento en streaming y lo persiste (versionado)."""
    template = load_prompt(MVP_DOCUMENTS[doc_type])
    transcript = _build_transcript(db, project_id)
    system = template.format(
        raw_idea=raw_idea, transcript=transcript, language=language_name(lang)
    )

    collected: list[str] = []
    async for piece in engine.stream(
        [{"role": "user", "content": "Genera el documento ahora."}], system=system
    ):
        collected.append(piece)
        yield piece

    content = _strip_outer_fence("".join(collected))
    prev = db.exec(
        select(Document)
        .where(Document.project_id == project_id, Document.doc_type == doc_type)
    ).all()
    version = max((d.version for d in prev), default=0) + 1
    db.add(Document(project_id=project_id, doc_type=doc_type, content=content, version=version))
    db.commit()
