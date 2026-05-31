"""Test de integración del flujo HTTP/SSE completo con un engine falso."""
from __future__ import annotations

import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine
from sqlmodel.pool import StaticPool

import database
import routers.documents as documents_router
import routers.sessions as sessions_router
from main import app
from tests.conftest import FakeEngine


@pytest.fixture
def client(monkeypatch):
    # BD en memoria compartida para toda la app durante el test.
    mem = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(mem)
    monkeypatch.setattr(database, "engine", mem)

    # Engine determinista en ambos routers que lo usan.
    fake = FakeEngine("# PRD\nUna spec forjada. [[PHASE_COMPLETE]]")
    monkeypatch.setattr(sessions_router, "load_active_engine", lambda db: fake)
    monkeypatch.setattr(documents_router, "load_active_engine", lambda db: fake)

    with TestClient(app) as c:
        yield c


def test_full_flow(client):
    # 1. crear proyecto
    pid = client.post("/api/projects", json={"title": "App", "raw_idea": "fitness"}).json()["id"]

    # 2. wizard: sesión + pregunta (SSE) + respuesta
    sid = client.post(f"/api/projects/{pid}/sessions").json()["id"]
    r = client.post(f"/api/sessions/{sid}/next")
    assert r.status_code == 200
    assert "data:" in r.text
    assert "phase_complete" in r.text  # el FakeEngine emite el token
    client.post(f"/api/sessions/{sid}/answer", json={"content": "para corredores"})

    # 3. generar documentos (SSE) → persiste PRD/TechSpec/Estimation
    g = client.post(f"/api/projects/{pid}/generate", json={"lang": "English"})
    assert "all_done" in g.text
    docs = client.get(f"/api/projects/{pid}/documents").json()
    assert {d["doc_type"] for d in docs} == {"blueprint", "prd", "tech_spec", "estimation"}

    # 4. export ZIP
    z = client.get(f"/api/projects/{pid}/export/zip")
    assert z.status_code == 200
    assert z.content[:2] == b"PK"
