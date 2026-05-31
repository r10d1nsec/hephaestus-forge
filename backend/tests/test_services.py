"""Tests de servicios: wizard, generator y export con un FakeEngine."""
from __future__ import annotations

import json

from models.document import Document
from models.project import Project
from models.session import WizardSession
from services.export_service import build_zip
from services.generator_service import generate_document
from services.wizard_service import is_phase_complete, next_question, record_user_answer


async def test_wizard_records_question_and_detects_completion(db, fake_engine):
    project = Project(title="Test", raw_idea="una app de fitness")
    db.add(project)
    db.commit()
    session = WizardSession(project_id=project.id, phase="discovery")
    db.add(session)
    db.commit()

    chunks = []
    async for piece in next_question(fake_engine, session, project.raw_idea, db):
        chunks.append(piece)
    full = "".join(chunks)

    assert is_phase_complete(full)  # FakeEngine emite el token
    stored = json.loads(db.get(WizardSession, session.id).messages)
    assert stored[-1]["role"] == "assistant"


def test_record_user_answer(db):
    project = Project(title="T", raw_idea="x")
    db.add(project)
    db.commit()
    session = WizardSession(project_id=project.id, phase="discovery")
    db.add(session)
    db.commit()
    record_user_answer(session, "mi respuesta", db)
    stored = json.loads(db.get(WizardSession, session.id).messages)
    assert stored == [{"role": "user", "content": "mi respuesta"}]


async def test_generate_document_persists_versioned(db, fake_engine):
    project = Project(title="T", raw_idea="x")
    db.add(project)
    db.commit()

    async for _ in generate_document(fake_engine, db, project.id, project.raw_idea, "prd"):
        pass
    async for _ in generate_document(fake_engine, db, project.id, project.raw_idea, "prd"):
        pass

    from sqlmodel import select

    docs = db.exec(select(Document).where(Document.project_id == project.id)).all()
    assert len(docs) == 2  # dos versiones del PRD
    assert {d.version for d in docs} == {1, 2}
    data = build_zip(db, project.id)
    assert data[:2] == b"PK"  # firma de ZIP


def test_build_zip_contains_readme(db):
    project = Project(title="Mi Proyecto", raw_idea="idea libre")
    db.add(project)
    db.commit()
    db.add(Document(project_id=project.id, doc_type="prd", content="# PRD\ncontenido"))
    db.commit()
    data = build_zip(db, project.id)
    import io
    import zipfile

    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        names = zf.namelist()
    assert "README.md" in names
    assert "prd.md" in names
