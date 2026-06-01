# start.md — Estado del proyecto Hephaestus' Forge

> Documento de handoff para futuras sesiones. Última actualización: **2026-06-01 (mañana)**.
> Léelo primero para retomar el contexto sin re-explorar todo.

---

## ▶ RETOMAR ESTA TARDE — Lanzamiento en curso (2026-06-01)

**Dónde estamos:** lanzamos el repo esta mañana. Producto + assets listos; estamos publicando los
posts. Repo en vivo, landing en vivo con rediseño + demo GIF.

**Hecho hoy:**
- ✅ **Engine opencode añadido** (`opencode run "<prompt>"`) — issue #4 cerrado vía **PR #12** (merged). Respondido el review de m13v; multi-turno marcado como **non-goal** en `docs/ENGINES.md` (el filtro real es la forma de salida, no la sesión).
- ✅ Rediseño premium (Claude Design) de **app + landing** aplicado y pusheado (recableado a la API real).
- ✅ **Demo GIF profesional** (Playwright+ffmpeg) en el hero del README y en el showcase de la landing.
- ✅ Imagen de marca como **social card (og/twitter) + banner** en la landing. Para el **social preview del repo**: subir `/home/r10d1n/Descargas/hephaestus-social-preview.jpg` (136 KB) en *Settings → General → Social preview* (la original pesaba >1 MB; esta ya está optimizada).
- ✅ README **EN/中文/ES** ampliados (beneficios, "por qué", comunidad, link a landing).
- ✅ **10 good-first-issues** (#1–#10) + **roadmap fijado** (#11).
- ✅ Pack de lanzamiento: `docs/launch/ANNOUNCEMENT.md` (copys EN+中文, **tuits ≤280**) y `docs/launch/PLAYBOOK.md`.

**Estado de los posts:**
- ✅ **Show HN** — publicado.
- ✅ **X/Twitter** — hilo de 5 tuits (≤280, free-tier). El tuit 1 original se pasaba 31 car.; ya corregido en ANNOUNCEMENT.md §3.
- ⛔ **r/LocalLLaMA** — el **AutoModerator lo retiró en 1 min** (cuenta nueva/poco karma + regla #4 self-promo). **NO repostear ahí.** Acción: modmail pidiendo aprobación (plantilla en el chat).

**⏭️ Pendiente esta tarde (en orden):**
1. **Publicar en subs amables con cuentas nuevas** (rara vez auto-eliminan). Usa el **cuerpo limpio** de ANNOUNCEMENT.md §2 (¡ojo!, en un intento el cuerpo perdió texto: debe decir *"Project Blueprint + PRD + Tech Spec + Estimation you feed to your coding agent"*, no "+ agent"):
   - **r/selfhosted** (PASO 4 del playbook)
   - **r/SideProject** — `I built Hephaestus' Forge — a self-hosted tool that interviews you about an idea and forges a build-ready spec (runs on your Claude Code/Codex/Gemini CLI or Ollama). MIT`
   - **r/coolgithubprojects** — `[Python] Hephaestus' Forge — self-hosted "idea → build-ready spec" tool, runs on your own AI engine (Ollama/Claude Code/Codex). MIT`
   - **r/opensource** — `Hephaestus' Forge — open-source, 100% local tool that turns a vague idea into a build-ready spec, on the AI engine you already have (MIT)`
2. Si la cuenta de Reddit es muy nueva → **calentar karma** comentando antes en r/LocalLLaMA y r/selfhosted; reintentar LocalLLaMA en 1–2 días o esperar el modmail.
3. **Responder TODOS los comentarios** de HN/X/Reddit (ventana crítica = lo que más mueve estrellas). No pedir upvotes. Texto nativo por sub.
4. **Día +1:** r/ChatGPTCoding + PRs a awesome-lists. **Día +2:** 中文 (掘金/V2EX, texto en ANNOUNCEMENT.md §4). **Día +2–3:** Product Hunt.

**Tareas que quedaron ofrecidas (no hechas):**
- ⬜ **Cheat-sheet de respuestas a objeciones** ("¿en qué se diferencia de X?", "¿por qué no un system prompt?", privacidad, etc.) → generar y guardar en `docs/launch/REPLIES.md`.
- ⬜ Actualizar `actions/deploy-pages` (aviso de Node 20→24, no urgente).

**Métricas:** GitHub Insights → Traffic (Referring sites) · [star-history](https://star-history.com/#r10d1nsec/hephaestus-forge). Expectativa honesta: 200–2.000★ en semanas = lanzamiento sólido.

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
- Repo público: **https://github.com/r10d1nsec/hephaestus-forge** (rama `main`, 16 commits). Issues+Discussions activos, roadmap fijado (#11), homepage = landing.
- Landing en vivo (sitio **estático** HTML/CSS/JS, con rediseño + demo GIF + social card): **https://r10d1nsec.github.io/hephaestus-forge/** (GitHub Pages vía `pages.yml`, redespliega en cada push a `landing/**`).
- **Decisión: NO se usa Vercel.** Solo GitHub Pages.
- **Rediseño aplicado** (Claude Design): app React+Tailwind v4 nivel "Linear" (Geist, ember único) recableada a la API real; landing rehecha como sitio estático. Brief en `docs/DESIGN_BRIEF.md`. Zips del diseño en raíz (gitignored).
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
- `cli.py` — `CliEngine`: subprocess de `claude -p … --output-format text`, `codex exec …`, `gemini -p …`, `opencode run …`. `detect_clis()` = `shutil.which`. **Solo en modo nativo** (los binarios viven en el host, no en Docker). El contrato es "prompt → documento por stdout" (forma de salida, no sesión multi-turno → non-goal documentado).
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
