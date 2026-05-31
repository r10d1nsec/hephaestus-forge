"""Factory de engines y resolución de la config activa desde `settings`."""
from __future__ import annotations

import json

from sqlmodel import Session, select

from models.setting import Setting
from services.engines.api import ApiEngine
from services.engines.base import Engine, EngineConfig, Message
from services.engines.cli import CliEngine, detect_clis
from services.engines.ollama import OllamaEngine

__all__ = [
    "Engine",
    "EngineConfig",
    "Message",
    "build_engine",
    "detect_clis",
    "load_active_engine",
    "ACTIVE_ENGINE_KEY",
]

ACTIVE_ENGINE_KEY = "active_engine"


def build_engine(config: EngineConfig) -> Engine:
    """Instancia el engine adecuado según `config.kind`."""
    if config.kind == "api":
        return ApiEngine(config)
    if config.kind == "ollama":
        return OllamaEngine(config)
    if config.kind == "cli":
        return CliEngine(config)
    raise ValueError(f"kind de engine desconocido: {config.kind}")


def load_active_engine(db: Session) -> Engine:
    """Carga el engine activo guardado en `settings`. Lanza si no hay ninguno."""
    row = db.exec(select(Setting).where(Setting.key == ACTIVE_ENGINE_KEY)).first()
    if not row or not row.value:
        raise RuntimeError(
            "No hay engine configurado. Ve a Settings → Engines y configura uno."
        )
    data = json.loads(row.value)
    return build_engine(EngineConfig(**data))
