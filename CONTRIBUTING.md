# Contributing to Hephaestus' Forge

Thanks for forging with us. 🔥 This project is built in the open and contributions of every size
are welcome — from typos to new engines.

## Ways to contribute

- 🐛 **Report bugs** — open an issue with steps to reproduce.
- ✨ **Add an engine** — the most valuable contribution (see below).
- 🌍 **Translate** — add a `README.<lang>.md` and landing strings in `landing/i18n.js`.
- 📝 **Improve prompts** — wizard/generator prompts live in `backend/prompts/` (no code needed).
- 📖 **Docs & examples**.

Look for issues labeled [`good first issue`](https://github.com/r10d1nsec/hephaestus-forge/labels/good%20first%20issue).

## Dev setup

```bash
# Backend
cd backend && python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload          # http://localhost:8000
pytest                             # run tests

# Frontend
cd frontend && npm install
npm run dev                        # http://localhost:5173

# Or both at once (native mode, enables CLI engines)
./run.sh
```

## Adding a new engine

The engine abstraction is intentionally small. To add a provider:

1. Create `backend/services/engines/<name>.py` with a class extending `Engine`
   (implement `stream()` and `test_connection()`).
2. Wire it into the factory in `backend/services/engines/__init__.py`.
3. Add a test in `backend/tests/test_engines.py`.
4. Expose it in the UI in `frontend/src/screens/Engines.tsx`.

See [docs/ENGINES.md](docs/ENGINES.md) for the full contract.

## 🔨 Contributor session: add your first engine in ~20 minutes

A hands-on walkthrough. By the end you'll have added a new provider and seen it stream in the UI.
We'll add a **Mistral** API engine (OpenAI-compatible) as the example.

**1. Implement the engine** — `backend/services/engines/mistral.py`:

```python
from collections.abc import AsyncIterator
from services.engines.base import Engine, EngineConfig, Message

class MistralEngine(Engine):
    def __init__(self, config: EngineConfig) -> None:
        super().__init__(config)
        self.model = config.model or "mistral-large-latest"

    async def stream(self, messages: list[Message], system: str | None = None) -> AsyncIterator[str]:
        from openai import AsyncOpenAI  # Mistral exposes an OpenAI-compatible API
        client = AsyncOpenAI(api_key=self.config.api_key, base_url="https://api.mistral.ai/v1")
        convo = ([{"role": "system", "content": system}] if system else []) + messages
        stream = await client.chat.completions.create(
            model=self.model, messages=convo, stream=True, max_tokens=4096,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta.content if chunk.choices else None
            if delta:
                yield delta

    async def test_connection(self) -> tuple[bool, str]:
        if not self.config.api_key:
            return False, "Missing API key."
        try:
            out = await self.complete([{"role": "user", "content": "Reply with: ok"}])
            return True, f"OK ({out.strip()[:40]})"
        except Exception as exc:  # noqa: BLE001
            return False, f"{type(exc).__name__}: {exc}"
```

**2. Register it** in `backend/services/engines/__init__.py` → `build_engine()`:

```python
if config.kind == "mistral":
    from services.engines.mistral import MistralEngine
    return MistralEngine(config)
```

**3. Test it** — add to `backend/tests/test_engines.py`:

```python
def test_build_engine_mistral():
    from services.engines.mistral import MistralEngine
    assert isinstance(build_engine(EngineConfig(kind="mistral", provider="mistral")), MistralEngine)
```

Run `pytest -q` — green.

**4. Surface it in the UI** — add an entry to `API_PROVIDERS` in
`frontend/src/screens/Engines.tsx` (or a new tab for non-OpenAI-shaped providers).

**5. Try it live** — `./run.sh`, open Engines, paste a key, **Test**, **Use**, run the wizard. 🎉

Open a PR with these four files + a line in `docs/ENGINES.md`. That's a complete, mergeable
contribution — and you now understand the whole architecture.

## Pull requests

- Branch from `main`, keep PRs focused.
- Run `pytest` (backend) and `npm run build` (frontend) before opening.
- Conventional-ish titles are appreciated (`feat:`, `fix:`, `docs:`).
- Be kind. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
