# Hephaestus' Forge — Functional Audit (v0.1 → next level)

> Living audit document. Each finding: **status** · description · fix.

## Findings

### 🐛 A1 — Engine detection conflates "installed" with "ready" — **FIXED**
`detect_clis()` uses `shutil.which()`, which only proves the binary is in `PATH`, not that the
agent is **authenticated**. The UI showed a green check (implying "ready") for `codex`/`gemini`
that were installed via npm but never logged in. **Fix:** the UI now distinguishes three states —
`not found` (grey ✗), `detected — unverified` (amber ◌), and `verified ✓` (green, only after a
successful *Test connection*) — plus copy stating **"detected ≠ authenticated."** The *Test* button
runs the real agent, which is the only true readiness check (it surfaces auth failures).

### 🟢 A2 — CLI agents in `-p` mode: verified clean text output — **VERIFIED, no fix needed**
Concern: `claude -p` runs the full agent and might attempt tool use. **Live test:** running the
generator pipeline through `claude -p … --output-format text` produced clean Markdown documents
(PRD/Tech Spec/Estimation) in ~40–70s each, with no tool invocation. Documented the behavior and
kept a generous timeout; revisit only if a specific CLI misbehaves.

### 🐛 A3 — No graceful message when no engine configured — **FIXED**
Generation/wizard endpoints raised a raw 500 when `active_engine` was unset. **Fix:** they now
return a structured SSE error the UI renders, and the dashboard already gates with a banner.

### ➕ A4 — Missing `.dockerignore` (huge build context) — **FIXED**
Added `backend/.dockerignore` and `frontend/.dockerignore` to keep images small and builds fast.

### ➕ A5 — No worked examples — **FIXED**
Added `examples/` with two real, end-to-end generated packs (EN + 中文) produced by the Claude
engine, surfaced in the README and landing.

### ➕ A6 — Landing lacked docs & contributor section — **FIXED**
Added a documentation section, an examples showcase, and a contributors call-to-action to the landing.

## Verified working (live, end-to-end)
- [x] Engine abstraction: API / Ollama / CLI factory + redaction
- [x] CLI engine streams real output from `claude -p` (native mode)
- [x] Wizard: phased questions over SSE, `[[PHASE_COMPLETE]]` detection, phase advance
- [x] Generator: PRD + Tech Spec + Estimation, versioned, over SSE
- [x] Export ZIP
- [x] Frontend build, all routes; Landing build, 5 locales
- [x] 12+ backend tests + integration flow

## Still scaffolded (roadmap, not bugs)
Phases 3–4 of the wizard, User Flows (Mermaid), Prompts Pack, README generator, PDF export,
version-history UI, dashboard stats, inline editor. Tracked in the README roadmap.
