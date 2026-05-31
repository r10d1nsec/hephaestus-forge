# Contributing to Hephaestus' Forge

Thanks for forging with us. 🔥 This project is built in the open and contributions of every size
are welcome — from typos to new engines.

## Ways to contribute

- 🐛 **Report bugs** — open an issue with steps to reproduce.
- ✨ **Add an engine** — the most valuable contribution (see below).
- 🌍 **Translate** — add a `README.<lang>.md` and a landing locale in `landing/src/i18n/`.
- 📝 **Improve prompts** — wizard/generator prompts live in `backend/prompts/` (no code needed).
- 📖 **Docs & examples**.

Look for issues labeled [`good first issue`](https://github.com/angelroldanruiz/hephaestus-forge/labels/good%20first%20issue).

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
4. Expose it in the UI in `frontend/src/components/engines/EngineManager.tsx`.

See [docs/ENGINES.md](docs/ENGINES.md) for the full contract.

## Pull requests

- Branch from `main`, keep PRs focused.
- Run `pytest` (backend) and `npm run build` (frontend) before opening.
- Conventional-ish titles are appreciated (`feat:`, `fix:`, `docs:`).
- Be kind. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
