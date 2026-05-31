"""Export de documentos. MVP: ZIP con todos los .md más recientes."""
from __future__ import annotations

import io
import zipfile

from sqlmodel import Session, select

from models.document import Document
from models.project import Project

_FILENAMES = {
    "prd": "prd.md",
    "tech_spec": "tech_spec.md",
    "estimation": "estimation.md",
    "user_flows": "user_flows.md",
    "prompts_pack": "claude_prompts.md",
    "readme": "project_readme.md",
}


def build_zip(db: Session, project_id: str) -> bytes:
    """Empaqueta la última versión de cada documento del proyecto en un ZIP."""
    project = db.get(Project, project_id)
    docs = db.exec(select(Document).where(Document.project_id == project_id)).all()

    # Quédate con la versión más alta de cada doc_type.
    latest: dict[str, Document] = {}
    for d in docs:
        if d.doc_type not in latest or d.version > latest[d.doc_type].version:
            latest[d.doc_type] = d

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        if project:
            zf.writestr("README.md", f"# {project.title}\n\n{project.raw_idea}\n")
        for doc_type, doc in latest.items():
            zf.writestr(_FILENAMES.get(doc_type, f"{doc_type}.md"), doc.content)
    return buf.getvalue()
