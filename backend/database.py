"""Configuración de SQLite vía SQLModel. Cero dependencias externas."""
from __future__ import annotations

import os
from collections.abc import Iterator

from sqlmodel import Session, SQLModel, create_engine

from config import settings

# Normaliza la URL y asegura que el directorio de datos existe.
_db_url = settings.database_url
if _db_url.startswith("sqlite"):
    path = _db_url.split("///")[-1]
    if path and path not in (":memory:",):
        os.makedirs(os.path.dirname(os.path.abspath(path)) or ".", exist_ok=True)

engine = create_engine(
    _db_url,
    echo=False,
    connect_args={"check_same_thread": False} if _db_url.startswith("sqlite") else {},
)


def init_db() -> None:
    """Crea las tablas. Importa los modelos para registrarlos en metadata."""
    import models  # noqa: F401  (registra todos los modelos)

    SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    """Dependencia FastAPI: una sesión por request."""
    with Session(engine) as session:
        yield session
