"""Carga de plantillas de prompt desde backend/prompts/."""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path

_PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


@lru_cache(maxsize=64)
def load_prompt(name: str) -> str:
    """Carga una plantilla por nombre relativo, p.ej. 'discovery' o 'generators/prd'."""
    path = _PROMPTS_DIR / f"{name}.md"
    return path.read_text(encoding="utf-8")
