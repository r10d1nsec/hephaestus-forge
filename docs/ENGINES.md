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
| `cli.py` | `cli` | `claude`, `codex`, `gemini`, `opencode` | Subprocess wrappers. Native mode only. |

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
| `claude`   | `claude -p "<prompt>" --output-format text` |
| `codex`    | `codex exec "<prompt>"` |
| `gemini`   | `gemini -p "<prompt>"` |
| `opencode` | `opencode run "<prompt>"` |

Detection is `shutil.which(<bin>)`. If a binary isn't on `PATH`, the engine reports it instead of
crashing.

### Non-goal: multi-turn agent sessions

Forge never relies on an agent's own conversation memory. The wizard accumulates phases in our
SQLite, and **every** generation call rebuilds the full transcript (`_build_transcript()`) and
flattens it into a single prompt (`flatten_to_prompt()`) handed to **one** non-interactive
invocation. There is no second turn — each call is stateless and self-contained.

This means a CLI engine only needs to be a one-shot **"prompt in → document text out on stdout"**
process. Agents whose session models differ (aider's chat-history file, opencode's TUI server, ACP)
are never exercised in multi-turn mode, so a per-engine *session adapter* is intentionally **out of
scope**. The real fit test for a new CLI engine is its **output shape**, not its session model:

- **Document-to-stdout agents** (`claude -p`, `gemini -p`, `opencode run`) fit directly — add a
  one-line `_CLI_SPECS` entry.
- **Repo-editor agents** (e.g. `aider --message`) do *not*: they apply file edits and narrate diffs
  on stdout rather than returning a clean document. Supporting them would need a different contract
  (write-to-file, then read back), which Forge does not currently provide.
