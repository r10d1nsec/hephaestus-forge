"""Mapeo de código de idioma → nombre humano para las directivas de prompt."""
from __future__ import annotations

_NAMES = {
    "en": "English",
    "zh": "中文 (Simplified Chinese)",
    "es": "Spanish (Español)",
    "fr": "French (Français)",
    "de": "German (Deutsch)",
}

DEFAULT_LANGUAGE = "English"


def language_name(code_or_name: str | None) -> str:
    """Acepta un código ('en') o ya un nombre ('English') y devuelve el nombre a usar.

    Si llega un nombre desconocido se devuelve tal cual (el frontend ya manda el nombre);
    si llega vacío/None, se usa el idioma por defecto.
    """
    if not code_or_name:
        return DEFAULT_LANGUAGE
    return _NAMES.get(code_or_name.lower(), code_or_name)
