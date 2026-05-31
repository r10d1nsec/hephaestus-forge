"""Abstracción de Engine — el núcleo de "Bring Your Own Engine".

Todo acceso a IA pasa por esta interfaz. Nunca llames a un SDK de provider
directamente desde un router o servicio; crea/usa un Engine.
"""
from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import AsyncIterator
from dataclasses import dataclass

# Un mensaje de chat. role ∈ {"system", "user", "assistant"}.
Message = dict[str, str]


@dataclass
class EngineConfig:
    """Configuración serializable de un engine (se guarda en `settings`)."""

    kind: str  # "api" | "ollama" | "cli"
    provider: str  # api: anthropic|openai|gemini|openai-compatible · cli: claude|codex|gemini
    model: str | None = None
    api_key: str | None = None
    base_url: str | None = None

    def redacted(self) -> dict:
        """Versión segura para devolver por la API (sin la key)."""
        return {
            "kind": self.kind,
            "provider": self.provider,
            "model": self.model,
            "base_url": self.base_url,
            "has_key": bool(self.api_key),
        }


class Engine(ABC):
    """Contrato común a todos los engines."""

    def __init__(self, config: EngineConfig) -> None:
        self.config = config

    @abstractmethod
    async def stream(
        self, messages: list[Message], system: str | None = None
    ) -> AsyncIterator[str]:
        """Emite el texto de la respuesta en chunks (para SSE)."""
        raise NotImplementedError
        yield ""  # pragma: no cover  (marca la función como generador async)

    @abstractmethod
    async def test_connection(self) -> tuple[bool, str]:
        """Devuelve (ok, mensaje). No debe lanzar; captura errores y los reporta."""
        raise NotImplementedError

    async def complete(self, messages: list[Message], system: str | None = None) -> str:
        """Helper: acumula el stream en un string completo."""
        chunks: list[str] = []
        async for piece in self.stream(messages, system=system):
            chunks.append(piece)
        return "".join(chunks)


def flatten_to_prompt(messages: list[Message], system: str | None = None) -> str:
    """Aplana una conversación a un único prompt (para engines CLI de un solo turno)."""
    parts: list[str] = []
    if system:
        parts.append(system.strip())
    for m in messages:
        role = m.get("role", "user").upper()
        parts.append(f"{role}: {m.get('content', '').strip()}")
    parts.append("ASSISTANT:")
    return "\n\n".join(parts)
