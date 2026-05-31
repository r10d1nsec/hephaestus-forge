# start.md — Estado del proyecto Hephaestus' Forge

> Documento de handoff para futuras sesiones. Última actualización: 2026-05-31.
> Léelo primero para retomar el contexto sin re-explorar todo.

---

## 1. Qué es

**Hephaestus' Forge** — app open-source y **self-hosted** que convierte una idea difusa en
documentación lista para construir (Blueprint, PRD, Tech Spec, Estimation), usando un wizard guiado
por IA. **Objetivo declarado: 100.000 estrellas en GitHub** (honesto: es top-0.01%, diseñamos para
maximizar la probabilidad, no está garantizado).

**Diferenciador central — "Bring Your Own Engine":** corre sobre la IA que el usuario ya tiene:
agentes CLI (**Claude Code, Codex, Gemini CLI**), **Ollama**, o cualquier **API** (Anthropic,
OpenAI, Gemini, OpenAI-compatible). 100% local; nada sale de la máquina. Ningún competidor del nicho
(PRD generators, todos <300★) hace esto.

---

## 2. Estado actual (qué está hecho y funciona)

✅ **Publicado y en vivo:**
- Repo público: **https://github.com/r10d1nsec/hephaestus-forge** (rama `main`, 4 commits + este doc)
- Landing en vivo: **https://r10d1nsec.github.io/hephaestus-forge/** (GitHub Pages vía Actions)
- **Decisión: NO se usa Vercel.** Solo GitHub Pages. (El workflow `pages.yml` redespliega solo en cada push a `landing/**`.)
- Cuenta GitHub: `r10d1nsec` · contacto: `r10d1n.sec@gmail.com`

✅ **Funciona end-to-end (verificado en vivo con el engine real de Claude):**
- Abstracción de engines: API / Ollama / CLI (factory + detección + test de conexión)
- Wizard guiado de **5 fases** con streaming SSE, en el idioma elegido
- Generación de **4 documentos** (Blueprint primero) en el idioma elegido
- Export ZIP
- App **multilingüe** (EN/中文/ES/FR/DE) con selector; el idioma controla UI + preguntas + documentos
- Backend: ruff limpio, **17 tests** verdes
- Frontend y landing: `npm run build` sin errores

---

## 3. Arquitectura

```
backend/  (Python 3.11 · FastAPI · SQLModel/SQLite)   :8000
frontend/ (React 18 · Vite · TS · Tailwind v4 · lucide · Geist)  dev :5173 / run.sh :3000
landing/  (sitio estático HTML/CSS/JS · i18n por cliente, 5 idiomas)  → GitHub Pages
```

> **Diseño (Claude Design, mayo 2026):** frontend y landing fueron rediseñados a calidad "Linear".
> Tema forge premium (ember `#f97316` único acento, fuentes Geist/Geist Mono, tokens Tailwind v4 en
> `frontend/src/index.css` y clases `.btn-primary`/`.ember-tile`/`.prose-forge`). Brief en
> `docs/DESIGN_BRIEF.md`. El frontend del diseño se adoptó y se **recableó** a la API real.

### Engines (el núcleo) — `backend/services/engines/`
- `base.py` — interfaz `Engine` (`stream()`, `test_connection()`, helper `complete()`, `flatten_to_prompt()`).
- `api.py` — `ApiEngine`. Anthropic usa su SDK nativo; openai/gemini/openai-compatible usan el SDK de OpenAI con `base_url` (Gemini vía su endpoint OpenAI-compatible).
- `ollama.py` — `OllamaEngine` (HTTP a `/api/chat`, `/api/tags`).
- `cli.py` — `CliEngine`: subprocess de `claude -p … --output-format text`, `codex exec …`, `gemini -p …`. `detect_clis()` = `shutil.which`. **Solo en modo nativo** (los binarios viven en el host, no en Docker).
- `__init__.py` — `build_engine(config)` factory + `load_active_engine(db)` (lee el engine activo de la tabla `settings`, key `active_engine`).

### Wizard — `backend/services/wizard_service.py`
- `PHASE_ORDER = ["discovery","audience","solution_fit","scope","constraints"]`
- Prompts en `backend/prompts/{discovery,audience,solution_fit,scope,constraints}.md` (placeholders `{raw_idea}`, `{history}`, `{language}`).
- Una pregunta por turno; el modelo emite `[[PHASE_COMPLETE]]` cuando la fase basta.
- `solution_fit` es la fase clave: sondea frecuencia/interacción/desatendido para recomendar **automatización vs agente vs web vs app vs CLI**.

### Generación — `backend/services/generator_service.py`
- `MVP_DOCUMENTS = {blueprint, prd, tech_spec, estimation}` (orden importa: **blueprint primero**).
- Prompts en `backend/prompts/generators/*.md` (placeholders `{raw_idea}`, `{transcript}`, `{language}`).
- **Blueprint** = documento cabecera: Recommended Solution Type + por qué + descartadas, Scale (S/M/L), Estimated Time, Stages/Roadmap, Scope, Stack, Risks.
- `_build_transcript()` mete TODAS las sesiones del wizard en cada generación.
- `_strip_outer_fence()` quita un ` ```markdown ` que envuelva el doc (algunos modelos lo añaden).
- Versionado: cada regeneración crea una nueva versión del `Document`.

### Idioma (puente UI↔backend)
- `backend/services/lang.py` → `language_name(code)` (`en→English`, `zh→中文 (Simplified Chinese)`, …).
- Routers `sessions.py` (`/next`) y `documents.py` (`/generate`) aceptan body opcional `{lang}` (default `"English"`).
- Frontend envía el nombre del idioma vía `streamSSE(path, onEvent, onDone, { lang })`.

### Modelos — `backend/models/`
`projects` → `sessions` (mensajes JSON por fase) → `documents` (Markdown versionado) · `settings` (clave-valor: engine activo, API keys solo locales).

### Frontend — `frontend/src/` (post-rediseño)
- **Navegación por estado** (`App.tsx`, sin react-router): `screen` + `project` + `generateOnEnter`. `Navigate = (s, {project, generate})`.
- **i18n por Context** (no Zustand): `i18n/index.tsx` (`I18nProvider`/`useI18n`) + `i18n/dictionaries.ts` (5 idiomas, `en` define `TranslationKey`). Persiste en `localStorage["hf-app-lang"]`. `lib/lang.ts` → `LANGUAGE_NAMES` (code→nombre para el backend).
- **Pantallas** en `screens/`: `Dashboard`, `NewIdea`, `Wizard` (barra de 5 fases + streaming SSE real), `Documents` (4 pestañas, Blueprint primero, render con `react-markdown` + `.prose-forge`), `Engines`.
- **Componentes**: `Sidebar` (marca + nav + selector idioma), `ui.tsx` (`Button`/`Input`/`Select`/`Tabs`/`Badge`), `ProjectCard`, `EngineRow` (estados `notfound`/`detected`/`verified`).
- `screens/Engines.tsx` — panel BYO-Engine recableado (detect/test/activate reales). **Detectado en PATH ≠ autenticado** → verde solo tras Test.
- `lib/api.ts` — cliente REST + `streamSSE(path, onEvent, onDone, body?)`.

### Landing — `landing/` (sitio estático)
- `index.html` + `styles.css` + `main.js` + `i18n.js` + `assets/`. i18n por cliente (`localStorage["hf-lang"]`, sprite SVG de iconos). Sin build.
- Deploy: `.github/workflows/pages.yml` sube `landing/` directamente a GitHub Pages.

---

## 4. Cómo ejecutarlo

```bash
# Modo nativo (habilita engines CLI: claude/codex/gemini del host)
./run.sh                      # frontend :3000 · backend :8000

# Docker (solo engines API + Ollama; los CLI no están en el contenedor)
docker compose up -d          # http://localhost:3000
docker compose -f docker-compose.full.yml up -d   # + Ollama con GPU
```

**Dev por separado:**
```bash
cd backend && . .venv/bin/activate && uvicorn main:app --reload --port 8000
cd frontend && npm run dev          # :5173
cd landing && python3 -m http.server 4321   # sitio estático, sin build
```

> ⚠️ El backend que arrancamos en sesiones SIN `--reload` no recoge cambios de código:
> hay que reiniciar uvicorn tras editar services/routers.

---

## 5. Desarrollo y verificación

```bash
# Backend
cd backend && . .venv/bin/activate
ruff check .            # lint (debe pasar)
pytest -q               # 17 tests (engines, services, api_flow, flow_config)
pytest tests/test_engines.py::test_build_engine_dispatch -q   # un solo test

# Frontend / landing
cd frontend && npm run build     # tsc -b + vite (type-check incluido)
cd landing && python3 -m http.server 4321   # sitio estático (no requiere build)

# Regenerar los ejemplos con el engine de Claude (consume cuota)
cd backend && . .venv/bin/activate && PYTHONPATH=. python scripts_examples.py streakly
```

**Tests backend:** `test_engines.py`, `test_services.py`, `test_api_flow.py` (flujo HTTP/SSE completo
con FakeEngine), `test_flow_config.py` (5 fases, blueprint, idioma, strip-fence).

---

## 6. Ejemplos reales (en el repo)

Generados end-to-end por el propio Hephaestus con el engine de Claude:
- `examples/streakly/` (EN) — habit tracker IA → PRD + Tech Spec + Estimation
- `examples/dianxiaoer/` (中文) — 聚单宝, gestión de pedidos/inventario para restaurantes
- `examples/README.md` / `README.zh.md` — framing + ventajas
- Capturas del producto: `docs/screenshots/` (blueprint, engines, docs-en/zh, dashboard-zh, landing-en/zh).

---

## 7. Documentación clave del repo
- `README.md` (+ `README.zh.md`, `README.es.md`) — landing del repo, BYO-Engine, comparativa, roadmap.
- `CLAUDE.md` — guía para Claude Code trabajando en el repo.
- `docs/ARCHITECTURE.md`, `docs/ENGINES.md` — arquitectura y contrato de engines.
- `docs/AUDIT.md` — auditoría funcional (bug de detección, fixes).
- `docs/GROWTH.md` — estrategia de crecimiento honesta + checklist de lanzamiento.
- `docs/GOOD_FIRST_ISSUES.md` — 15 tareas semilla para contribuidores.
- `CONTRIBUTING.md` — incluye taller "añade tu primer engine en ~20 min".

---

## 8. Pendiente / próximos pasos (por prioridad)

1. **🎬 GIF demo en el README** — el activo de mayor ROI para estrellas (idea → wizard 5 fases → Blueprint → ZIP). Grabar del flujo real.
2. **Lanzamiento** — textos Show HN / r/LocalLLaMA / r/ChatGPTCoding / V2EX / 掘金 (EN + 中文). Liderar con "runs on the Claude Code/Codex/Gemini CLI you already have, 100% local". PRs a awesome-lists.
3. **Seed de `good first issue`s** en GitHub (ya hay lista en `docs/GOOD_FIRST_ISSUES.md`); etiquetarlos.
4. **v0.3 producto:** User Flows (Mermaid), AI Prompts Pack, editor inline, historial de versiones (UI), export PDF.
5. **Más engines** (Mistral/Groq/DeepSeek — DeepSeek atrae a la comunidad china) + **selector de engine por tarea**.
6. **"Copy as Claude context"** (1 click) y GitHub Gist export.

---

## 9. Restricciones / cosas a recordar

- **Engines CLI = solo modo nativo** (`run.sh`). En Docker: API + Ollama. `GET /api/engines/detect` reporta qué CLIs hay en el PATH (presencia, no auth).
- `claude -p` tarda ~3-60s por llamada; la generación de 4 docs son 4 llamadas (~3-4 min).
- API keys: solo en SQLite local, nunca se devuelven por la API (`EngineConfig.redacted()`).
- Idioma por defecto de la app: **inglés** (repo English-first); selector EN/中文/ES/FR/DE.
- Landing: base raíz por defecto (Vercel/dominio); el workflow de Pages inyecta `LANDING_BASE=/hephaestus-forge`.
- Servidores de dev que se levantan en background hay que arrancarlos con el mecanismo persistente; `nohup` simple no sobrevive.

---

## 10. Arranque rápido para la próxima sesión

```bash
cd "/home/r10d1n/Escritorio/Hephaestus' forge"
git pull
cd backend && . .venv/bin/activate && pytest -q     # confirmar verde
./run.sh   # (desde la raíz) levantar app y probar en localhost:3000
```
Engine recomendado para probar: **Claude Code** (CLI, autenticado en esta máquina) → Settings → Engines → Test → Usar.
