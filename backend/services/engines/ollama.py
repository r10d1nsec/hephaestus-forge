"""OllamaEngine — modelos locales vía el daemon de Ollama (HTTP)."""
from __future__ import annotations

import json
from collections.abc import AsyncIterator

import httpx

from services.engines.base import Engine, EngineConfig, Message


class OllamaEngine(Engine):
    def __init__(self, config: EngineConfig) -> None:
        super().__init__(config)
        self.base_url = (config.base_url or "http://localhost:11434").rstrip("/")
        self.model = config.model or "llama3"

    async def stream(
        self, messages: list[Message], system: str | None = None
    ) -> AsyncIterator[str]:
        convo: list[Message] = []
        if system:
            convo.append({"role": "system", "content": system})
        convo.extend(messages)
        payload = {"model": self.model, "messages": convo, "stream": True}
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                "POST", f"{self.base_url}/api/chat", json=payload
            ) as resp:
                resp.raise_for_status()
                async for line in resp.aiter_lines():
                    if not line.strip():
                        continue
                    data = json.loads(line)
                    piece = data.get("message", {}).get("content", "")
                    if piece:
                        yield piece
                    if data.get("done"):
                        break

    async def test_connection(self) -> tuple[bool, str]:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(f"{self.base_url}/api/tags")
                resp.raise_for_status()
                models = [m["name"] for m in resp.json().get("models", [])]
            if not models:
                return True, "Ollama accesible, pero sin modelos descargados (ollama pull …)."
            return True, f"OK · {len(models)} modelos disponibles: {', '.join(models[:5])}"
        except Exception as exc:  # noqa: BLE001
            return False, f"No se pudo contactar con Ollama en {self.base_url}: {exc}"
