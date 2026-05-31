"""Proyecto / Idea."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Project(SQLModel, table=True):
    __tablename__ = "projects"

    id: str = Field(default_factory=_uuid, primary_key=True)
    title: str
    raw_idea: str = ""
    status: str = "draft"  # draft | refining | complete
    created_at: datetime = Field(default_factory=_now)
    updated_at: datetime = Field(default_factory=_now)
