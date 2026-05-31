"""Documento generado (Markdown), versionado."""
from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class Document(SQLModel, table=True):
    __tablename__ = "documents"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    project_id: str = Field(foreign_key="projects.id", index=True)
    doc_type: str  # prd | tech_spec | estimation | user_flows | prompts_pack | readme
    content: str = ""
    version: int = 1
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
