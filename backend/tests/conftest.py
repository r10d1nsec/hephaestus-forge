"""Fixtures de test: BD en memoria + engine falso determinista."""
from __future__ import annotations

import os
import sys
from collections.abc import AsyncIterator

import pytest
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

# Permite importar el paquete backend (main, models, services...) sin instalar.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.engines.base import Engine, EngineConfig, Message  # noqa: E402


class FakeEngine(Engine):
    """Engine determinista para tests: hace echo de un texto fijo en chunks."""

    def __init__(self, reply: str = "Hello [[PHASE_COMPLETE]]") -> None:
        super().__init__(EngineConfig(kind="api", provider="fake"))
        self.reply = reply

    async def stream(
        self, messages: list[Message], system: str | None = None
    ) -> AsyncIterator[str]:
        for word in self.reply.split(" "):
            yield word + " "

    async def test_connection(self) -> tuple[bool, str]:
        return True, "fake ok"


@pytest.fixture
def db() -> Session:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture
def fake_engine() -> FakeEngine:
    return FakeEngine()
