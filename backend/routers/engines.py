"""API de engines — el corazón de "Bring Your Own Engine".

- GET  /api/engines/detect  → qué CLIs hay en el host + engine activo
- GET  /api/engines         → engine activo (sin secretos)
- POST /api/engines/test    → prueba una config sin guardarla
- PUT  /api/engines/active  → guarda el engine activo
"""
from __future__ import annotations

import json

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session, select

from database import get_session
from models.setting import Setting
from services.engines import (
    ACTIVE_ENGINE_KEY,
    EngineConfig,
    build_engine,
    detect_clis,
)

router = APIRouter(prefix="/api/engines", tags=["engines"])


class EngineConfigIn(BaseModel):
    kind: str  # api | ollama | cli
    provider: str
    model: str | None = None
    api_key: str | None = None
    base_url: str | None = None

    def to_config(self) -> EngineConfig:
        return EngineConfig(**self.model_dump())


def _load_active(db: Session) -> EngineConfig | None:
    row = db.exec(select(Setting).where(Setting.key == ACTIVE_ENGINE_KEY)).first()
    if not row or not row.value:
        return None
    return EngineConfig(**json.loads(row.value))


@router.get("/detect")
def detect(db: Session = Depends(get_session)) -> dict:
    active = _load_active(db)
    return {
        "clis": detect_clis(),  # {"claude": bool, "codex": bool, "gemini": bool}
        "active": active.redacted() if active else None,
    }


@router.get("")
def get_active(db: Session = Depends(get_session)) -> dict:
    active = _load_active(db)
    return {"active": active.redacted() if active else None}


@router.post("/test")
async def test(cfg: EngineConfigIn) -> dict:
    engine = build_engine(cfg.to_config())
    ok, message = await engine.test_connection()
    return {"ok": ok, "message": message}


@router.put("/active")
def set_active(cfg: EngineConfigIn, db: Session = Depends(get_session)) -> dict:
    payload = json.dumps(cfg.model_dump(), ensure_ascii=False)
    row = db.exec(select(Setting).where(Setting.key == ACTIVE_ENGINE_KEY)).first()
    if row:
        row.value = payload
    else:
        row = Setting(key=ACTIVE_ENGINE_KEY, value=payload)
    db.add(row)
    db.commit()
    return {"active": cfg.to_config().redacted()}
