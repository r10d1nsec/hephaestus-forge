"""Configuración clave-valor: engines, API keys (solo locales), preferencias."""
from __future__ import annotations

from sqlmodel import Field, SQLModel


class Setting(SQLModel, table=True):
    __tablename__ = "settings"

    key: str = Field(primary_key=True)
    value: str = ""
