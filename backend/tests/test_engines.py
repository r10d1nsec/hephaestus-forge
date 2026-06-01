"""Tests de la abstracción de engines."""
from __future__ import annotations

import pytest

from services.engines import build_engine, detect_clis
from services.engines.api import ApiEngine
from services.engines.base import EngineConfig, flatten_to_prompt
from services.engines.cli import CliEngine
from services.engines.ollama import OllamaEngine


def test_redacted_hides_api_key():
    cfg = EngineConfig(kind="api", provider="anthropic", api_key="secret-123")
    red = cfg.redacted()
    assert "secret-123" not in str(red)
    assert red["has_key"] is True


def test_build_engine_dispatch():
    assert isinstance(build_engine(EngineConfig(kind="api", provider="openai")), ApiEngine)
    assert isinstance(build_engine(EngineConfig(kind="ollama", provider="ollama")), OllamaEngine)
    assert isinstance(build_engine(EngineConfig(kind="cli", provider="claude")), CliEngine)
    assert isinstance(build_engine(EngineConfig(kind="cli", provider="opencode")), CliEngine)


def test_build_engine_rejects_unknown_kind():
    with pytest.raises(ValueError):
        build_engine(EngineConfig(kind="nope", provider="x"))


def test_detect_clis_shape():
    result = detect_clis()
    assert set(result.keys()) == {"claude", "codex", "gemini", "opencode"}
    assert all(isinstance(v, bool) for v in result.values())


def test_flatten_to_prompt_includes_system_and_roles():
    prompt = flatten_to_prompt(
        [{"role": "user", "content": "hola"}], system="Eres Hephaestus"
    )
    assert "Eres Hephaestus" in prompt
    assert "USER: hola" in prompt
    assert prompt.strip().endswith("ASSISTANT:")


def test_cli_engine_rejects_unsupported_provider():
    with pytest.raises(ValueError):
        CliEngine(EngineConfig(kind="cli", provider="not-a-cli"))


async def test_fake_engine_complete(fake_engine):
    out = await fake_engine.complete([{"role": "user", "content": "hi"}])
    assert "Hello" in out
