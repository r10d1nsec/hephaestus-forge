"""ApiEngine — providers vía API.

- anthropic            → SDK nativo de Anthropic (streaming)
- openai / gemini /    → SDK de OpenAI con base_url (compatibles con la API de OpenAI)
  openai-compatible      (OpenRouter, Groq, Together, Gemini OpenAI endpoint, ...)
"""
from __future__ import annotations

from collections.abc import AsyncIterator

from services.engines.base import Engine, EngineConfig, Message

# Endpoint OpenAI-compatible de Gemini (Google AI Studio).
_GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/openai/"

_DEFAULT_MODELS = {
    "anthropic": "claude-sonnet-4-6",
    "openai": "gpt-4o",
    "gemini": "gemini-2.0-flash",
    "openai-compatible": "gpt-4o",
}


class ApiEngine(Engine):
    def __init__(self, config: EngineConfig) -> None:
        super().__init__(config)
        self.model = config.model or _DEFAULT_MODELS.get(config.provider, "gpt-4o")

    # --- helpers de cliente ---------------------------------------------------
    def _base_url(self) -> str | None:
        if self.config.provider == "gemini":
            return _GEMINI_BASE
        return self.config.base_url

    async def stream(
        self, messages: list[Message], system: str | None = None
    ) -> AsyncIterator[str]:
        if self.config.provider == "anthropic":
            async for piece in self._stream_anthropic(messages, system):
                yield piece
        else:
            async for piece in self._stream_openai(messages, system):
                yield piece

    async def _stream_anthropic(
        self, messages: list[Message], system: str | None
    ) -> AsyncIterator[str]:
        from anthropic import AsyncAnthropic

        client = AsyncAnthropic(api_key=self.config.api_key)
        convo = [m for m in messages if m.get("role") != "system"]
        async with client.messages.stream(
            model=self.model,
            max_tokens=4096,
            system=system or "",
            messages=convo,  # type: ignore[arg-type]
        ) as stream:
            async for text in stream.text_stream:
                yield text

    async def _stream_openai(
        self, messages: list[Message], system: str | None
    ) -> AsyncIterator[str]:
        from openai import AsyncOpenAI

        client = AsyncOpenAI(api_key=self.config.api_key, base_url=self._base_url())
        convo: list[Message] = []
        if system:
            convo.append({"role": "system", "content": system})
        convo.extend(messages)
        stream = await client.chat.completions.create(
            model=self.model,
            messages=convo,  # type: ignore[arg-type]
            stream=True,
            max_tokens=4096,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta.content if chunk.choices else None
            if delta:
                yield delta

    async def test_connection(self) -> tuple[bool, str]:
        if not self.config.api_key:
            return False, "Falta la API key."
        try:
            out = await self.complete(
                [{"role": "user", "content": "Reply with just: ok"}]
            )
            return True, f"OK · modelo {self.model} respondió ({out.strip()[:40]})"
        except Exception as exc:  # noqa: BLE001 — reportamos cualquier fallo de conexión
            return False, f"{type(exc).__name__}: {exc}"
