# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

**Hephaestus' Forge** — a self-hosted, open-source tool that turns a vague idea into build-ready
project documentation (PRD, tech spec, estimation, user flows, prompt pack). The headline
differentiator is **Bring Your Own Engine**: it runs on whatever AI the user already has —
**Claude Code / Codex / Gemini CLI** (local coding agents), **Ollama** (local models), or any
**API provider** (Anthropic, OpenAI, Gemini, OpenAI-compatible). 100% local; no data leaves the box.

## Commands

Backend (from `backend/`):
- Install: `pip install -r requirements.txt`
- Dev server: `uvicorn main:app --reload --port 8000`
- Tests: `pytest` · single test: `pytest tests/test_engines.py::test_api_engine_stream -q`
- Lint: `ruff check .`

Frontend (from `frontend/`):
- Install: `npm install` · Dev: `npm run dev` (Vite, :5173) · Build: `npm run build`
- Lint: `npm run lint`

Landing (from `landing/`):
- `npm install` · `npm run dev` · `npm run build` (Astro static output → GitHub Pages)

Whole stack:
- Native (enables CLI engines): `./run.sh` → frontend :3000, backend :8000
- Docker (API + Ollama engines only): `docker compose up -d`

## Architecture (the parts that span multiple files)

**Engine abstraction is the core.** All AI access goes through one interface,
`backend/services/engines/base.py` (`Engine.stream()` + `Engine.test_connection()`).
Three implementations, selected at runtime from user config in SQLite:
- `api.py` — Anthropic / OpenAI / Gemini / OpenAI-compatible (`base_url` override).
- `ollama.py` — local HTTP to an Ollama daemon.
- `cli.py` — wraps host CLIs as subprocesses (`claude -p … --output-format stream-json`,
  `codex exec …`, `gemini -p …`) and streams stdout.

**CLI-engine constraint:** the `claude`/`codex`/`gemini` binaries live on the **host**, not in the
container. So CLI engines only work in **native mode** (`run.sh`). Docker mode supports API + Ollama.
`GET /api/engines/detect` scans `PATH` (`which …`) to report which CLIs are available. Keep this
host/container boundary in mind before assuming an engine is reachable.

**Request flow:** `routers/*` (thin HTTP/SSE layer) → `services/*` (logic) → `services/engines/*`
(AI). `wizard_service` runs the 4-phase question flow; `generator_service` runs the document
pipeline. Both **stream over SSE** — endpoints that call an engine return `text/event-stream`, and
the frontend (`frontend/src/lib/api.ts`) consumes it with a typewriter effect. Don't convert these
to plain JSON responses.

**Prompts are data, not code.** Wizard and generator prompts live as Markdown in
`backend/prompts/` and `backend/prompts/generators/`. Edit behavior there before touching service
code. Each generator prompt follows the ROL / CONTEXTO / TAREA / FORMATO / RESTRICCIONES structure.

**Data model** (`backend/models/`): `projects` → `sessions` (wizard messages, JSON) → `documents`
(generated Markdown, versioned). `settings` stores engine config + API keys (local only).

## Conventions

- New AI access must go through an `Engine` implementation — never call a provider SDK directly
  from a router or service.
- Generation/wizard endpoints stream SSE; preserve cancelation support.
- API keys are stored only in local SQLite and must never be logged or returned in API responses.
- Code is self-documenting; inline comments in Spanish are fine (project author preference), but
  user-facing docs/README default to English first, then 中文, then ES/FR/DE.
