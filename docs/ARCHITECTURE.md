# Architecture

Hephaestus' Forge is two small services plus one key abstraction.

```
┌────────────────────────── localhost ──────────────────────────┐
│                                                                │
│   frontend (React + Vite)  ──HTTP/SSE──▶  backend (FastAPI)    │
│   :3000 (nginx in Docker)                 :8000 + SQLite       │
│                                              │                 │
│                                   ┌──────────▼───────────┐     │
│                                   │   Engine abstraction │     │
│                                   ├──────────────────────┤     │
│                                   │ ApiEngine   (API)    │     │
│                                   │ OllamaEngine(local)  │     │
│                                   │ CliEngine   (host)   │─────┼─▶ claude / codex / gemini
│                                   └──────────────────────┘     │   (native mode only)
└────────────────────────────────────────────────────────────────┘
```

## Layers

- **`routers/`** — thin HTTP + SSE layer. No business logic. Streaming endpoints return
  `text/event-stream`.
- **`services/`** — logic. `wizard_service` runs the phased interview; `generator_service` runs the
  document pipeline; `export_service` builds the ZIP.
- **`services/engines/`** — the only place that talks to an AI provider. Everything goes through the
  `Engine` interface. See [ENGINES.md](ENGINES.md).
- **`models/`** — SQLModel tables: `projects → sessions → documents`, plus `settings`.
- **`prompts/`** — wizard and generator prompts as Markdown. Behavior is data, not code.

## Streaming (SSE)

Wizard questions and document generation stream token-by-token. Endpoints emit
`data: {json}\n\n` frames; the frontend (`lib/api.ts → streamSSE`) parses them and renders a
typewriter effect. Each stream is cancelable via `AbortController`.

## The host/container boundary

CLI engines wrap binaries that live on the **host**. In Docker the container can't see them, so:

- **Docker mode** → API + Ollama engines.
- **Native mode** (`run.sh`) → all engines, including CLI.

`GET /api/engines/detect` scans `PATH` and reports CLI availability so the UI can disable what isn't
reachable.

## Data flow (happy path)

`create project` → `start session` → `next` (SSE question) ⇄ `answer` → `advance` per phase →
`generate` (SSE, persists Documents, versioned) → `export/zip`.
