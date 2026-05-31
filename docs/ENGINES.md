# Engines — Bring Your Own Engine

Every AI call in Hephaestus goes through one interface. Adding a provider means implementing it once.

## The contract

```python
# backend/services/engines/base.py
class Engine(ABC):
    async def stream(self, messages: list[Message], system: str | None = None) -> AsyncIterator[str]:
        """Yield the response text in chunks (for SSE)."""

    async def test_connection(self) -> tuple[bool, str]:
        """Return (ok, message). Must not raise — catch and report errors."""
```

`complete()` (accumulate the stream into a string) is provided by the base class.

## Built-in engines

| File | `kind` | `provider` values | Notes |
|---|---|---|---|
| `api.py` | `api` | `anthropic`, `openai`, `gemini`, `openai-compatible` | Anthropic uses its SDK; the rest use the OpenAI SDK with a `base_url`. Gemini uses its OpenAI-compatible endpoint. |
| `ollama.py` | `ollama` | `ollama` | Talks to `OLLAMA_URL` (`/api/chat`, `/api/tags`). |
| `cli.py` | `cli` | `claude`, `codex`, `gemini` | Subprocess wrappers. Native mode only. |

## How config is stored

The active engine is a JSON blob in the `settings` table under `active_engine`:

```json
{ "kind": "api", "provider": "anthropic", "model": "claude-sonnet-4-6", "api_key": "…", "base_url": null }
```

`api_key` is never returned by the API — responses use `EngineConfig.redacted()` (`has_key: bool`).

## Adding an engine in 4 steps

1. **Implement** `backend/services/engines/<name>.py` extending `Engine`.
2. **Register** it in the `build_engine()` factory in `__init__.py`.
3. **Test** it in `backend/tests/test_engines.py` (dispatch + a mocked stream).
4. **Surface** it in `frontend/src/components/engines/EngineManager.tsx`.

### CLI engine specifics

CLI agents take a single prompt, so conversations are flattened via `flatten_to_prompt()`. Each is
invoked non-interactively and streamed from stdout:

| Provider | Command |
|---|---|
| `claude` | `claude -p "<prompt>" --output-format text` |
| `codex`  | `codex exec "<prompt>"` |
| `gemini` | `gemini -p "<prompt>"` |

Detection is `shutil.which(<bin>)`. If a binary isn't on `PATH`, the engine reports it instead of
crashing.
