"""Sesión del wizard: mensajes de preguntas/respuestas por fase."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class WizardSession(SQLModel, table=True):
    __tablename__ = "sessions"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    project_id: str = Field(foreign_key="projects.id", index=True)
    phase: str = "discovery"  # discovery | scope | technical | goals
    # JSON serializado: [{"role": "assistant"|"user", "content": "..."}]
    messages: str = "[]"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
