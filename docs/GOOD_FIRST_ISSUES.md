# Good first issues — seed list

Concrete, scoped starter tasks. Each links to where the work happens. When opening the repo,
file these as issues and label them `good first issue` so drive-by stars convert to contributors.

## Engines (highest value — each brings a new audience)
1. **Add a Mistral engine** — follow the walkthrough in [CONTRIBUTING.md](../CONTRIBUTING.md). `backend/services/engines/`
2. **Add a Groq engine** (OpenAI-compatible, very fast) — base_url `https://api.groq.com/openai/v1`.
3. **Add a DeepSeek engine** (OpenAI-compatible) — popular in the 中文 community.
4. **Add an `opencode` / `aider` CLI engine** — extend `_CLI_SPECS` in `services/engines/cli.py`.

## UX / frontend
5. **Per-task engine selector** — let the user pick a different engine per document. `EngineManager` + generate call.
6. **Inline Markdown editor** in the document viewer (Monaco-lite). `frontend/src/pages/Documents.tsx`.
7. **Copy-as-Claude-context button** — concatenate all docs into one system-prompt block.
8. **Light theme** toggle. `frontend/src/index.css` already uses CSS vars.

## Generation / prompts (no code, just Markdown)
9. **Add the User Flows generator** (Mermaid) — new prompt in `backend/prompts/generators/` + wire into `MVP_DOCUMENTS`.
10. **Add the AI Prompts Pack generator** — Claude-ready prompts derived from the spec.
11. **Tune the estimation prompt** to output a sharper risk table.

## i18n
12. **Translate the README** to a new language (`README.<lang>.md`).
13. **Add a landing locale** — extend `landing/src/i18n/index.ts` + add `landing/src/pages/<lang>/index.astro`.

## Infra / docs
14. **Add a healthcheck** to `docker-compose.yml` for the backend.
15. **Add a 20–30s demo GIF** to the README (the highest-ROI launch asset).
