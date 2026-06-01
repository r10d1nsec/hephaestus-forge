"""CliEngine — envuelve agentes de coding instalados en el host como subprocesos.

Soporta Claude Code (`claude -p`), Codex (`codex exec`) y Gemini CLI (`gemini -p`)
en modo no-interactivo, haciendo streaming de stdout.

IMPORTANTE: estos binarios viven en el HOST, no en el contenedor. Por eso los
engines CLI solo funcionan en modo nativo (run.sh). En Docker usa API u Ollama.
"""
from __future__ import annotations

import asyncio
import shutil
from collections.abc import AsyncIterator

from services.engines.base import Engine, EngineConfig, Message, flatten_to_prompt

# provider -> (binario, factoría de args que toma el prompt y devuelve argv extra)
_CLI_SPECS: dict[str, dict] = {
    "claude": {
        "bin": "claude",
        "args": lambda prompt: ["-p", prompt, "--output-format", "text"],
    },
    "codex": {
        "bin": "codex",
        "args": lambda prompt: ["exec", prompt],
    },
    "gemini": {
        "bin": "gemini",
        "args": lambda prompt: ["-p", prompt],
    },
    "opencode": {
        "bin": "opencode",
        "args": lambda prompt: ["run", prompt],
    },
}


def detect_clis() -> dict[str, bool]:
    """Escanea el PATH y reporta qué CLIs están disponibles."""
    return {name: shutil.which(spec["bin"]) is not None for name, spec in _CLI_SPECS.items()}


class CliEngine(Engine):
    def __init__(self, config: EngineConfig) -> None:
        super().__init__(config)
        if config.provider not in _CLI_SPECS:
            raise ValueError(f"CLI no soportado: {config.provider}")
        self.spec = _CLI_SPECS[config.provider]

    def _binary(self) -> str | None:
        return shutil.which(self.spec["bin"])

    async def stream(
        self, messages: list[Message], system: str | None = None
    ) -> AsyncIterator[str]:
        binary = self._binary()
        if not binary:
            raise RuntimeError(
                f"'{self.spec['bin']}' no está en el PATH. Los engines CLI requieren "
                f"modo nativo (run.sh), no Docker."
            )
        prompt = flatten_to_prompt(messages, system)
        argv = [binary, *self.spec["args"](prompt)]
        proc = await asyncio.create_subprocess_exec(
            *argv,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        assert proc.stdout is not None
        try:
            async for raw in proc.stdout:
                yield raw.decode(errors="replace")
        finally:
            if proc.returncode is None:
                proc.terminate()
            await proc.wait()
            if proc.returncode not in (0, None):
                err = (await proc.stderr.read()).decode(errors="replace") if proc.stderr else ""
                if err.strip():
                    yield f"\n[engine error] {err.strip()[:300]}"

    async def test_connection(self) -> tuple[bool, str]:
        binary = self._binary()
        if not binary:
            return False, (
                f"'{self.spec['bin']}' no encontrado en el PATH. Instálalo o usa modo nativo."
            )
        try:
            out = await asyncio.wait_for(
                self.complete([{"role": "user", "content": "Reply with just: ok"}]),
                timeout=120,
            )
            return True, f"OK · {self.spec['bin']} respondió ({out.strip()[:40]})"
        except Exception as exc:  # noqa: BLE001
            return False, f"{type(exc).__name__}: {exc}"
