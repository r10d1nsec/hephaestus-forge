# Technical Spec — Streakly

## Recommended Stack

**Frontend — React + Vite PWA (TypeScript)**
The user explicitly wants a *mobile-first PWA*, not native apps. React + Vite gives a fast install-to-home-screen experience with service workers for offline task viewing (a daily feed must work on a flaky commute connection). TypeScript pays off because the AI-generated task schedules are the core data structure and type safety prevents whole classes of rescheduling bugs.

**Backend — Python (FastAPI)**
The product's defensible work is *prompt orchestration + scheduling logic*, both of which live comfortably in Python. FastAPI is async-native (LLM calls are I/O-bound and slow), has first-class Pydantic validation for parsing structured LLM output into tasks, and streams responses for the decomposition step (goal → micro-tasks can take several seconds; the user shouldn't stare at a spinner).

**Database — PostgreSQL**
Tasks, schedules, and streaks are inherently relational and require transactional integrity (rescheduling rewrites many rows atomically). Postgres also gives `jsonb` for storing the raw LLM decomposition alongside normalized task rows, and date/interval types that make streak and "missed day" queries trivial.

**Background jobs — Celery + Redis (or APScheduler if kept simple)**
Rescheduling-on-miss and the daily rollover are time-driven, not request-driven. A scheduled worker that runs at the user's local midnight to detect misses and trigger re-planning is the backbone of the "adaptive" promise.

**LLM — single provider (Anthropic Claude or OpenAI), abstracted behind one interface**
The user committed to *a single LLM provider for MVP*. Wrap it behind a thin client so swapping later costs one file. Use structured output / tool-calling to force tasks into a strict JSON schema — free-text parsing is the #1 source of decomposition failures.

**Auth — Email + OAuth via a managed provider (Clerk / Auth0 / Supabase Auth)**
The user asked for email + OAuth. Don't hand-roll this; a managed provider gets you password resets, OAuth flows, and session security for free, which is meaningless differentiation to build yourself.

**Hosting — Render / Railway / Fly.io (managed Postgres + Redis)**
A small team shipping an MVP should not run Kubernetes. These platforms give managed Postgres, Redis, a worker process, and zero-downtime deploys out of the box.

> **Cost/risk note:** every goal decomposition and every reschedule is a paid LLM call. At scale this is your dominant variable cost. Cache decompositions, batch reschedules, and consider a cheaper model for rescheduling than for initial decomposition.

## Architecture Overview

```
                         ┌──────────────────────────┐
                         │   React PWA (mobile-first)│
                         │  - Goal input             │
                         │  - Daily task feed         │
                         │  - Streak / progress view  │
                         │  Service Worker (offline)  │
                         └────────────┬───────────────┘
                                      │ HTTPS / JSON (SSE for decomposition)
                                      ▼
                         ┌──────────────────────────┐
                         │      FastAPI Backend       │
                         │  Auth │ Goals │ Tasks │ ... │
                         └───┬─────────┬─────────┬─────┘
                             │         │         │
              ┌──────────────┘         │         └───────────────┐
              ▼                        ▼                         ▼
   ┌────────────────┐      ┌────────────────────┐    ┌────────────────────┐
   │  PostgreSQL    │      │  LLM Client (1 prov)│    │  Auth Provider     │
   │ goals, tasks,  │      │  - decompose goal   │    │ (email + OAuth)    │
   │ schedules,     │      │  - reschedule plan  │    └────────────────────┘
   │ streaks        │      └────────────────────┘
   └───────▲────────┘
           │ reads/writes
   ┌───────┴────────────────────────┐
   │  Celery Worker + Redis         │
   │  - daily midnight rollover     │
   │  - detect missed tasks         │
   │  - trigger adaptive reschedule │
   └────────────────────────────────┘
```

**Flow:** A user enters a goal → FastAPI calls the LLM to decompose it into a sequence of micro-tasks with target dates → tasks persisted in Postgres. Each day the user checks tasks off the feed. A scheduled worker runs at the user's local midnight, finds incomplete tasks past due, and either re-plans the remaining tasks via the LLM (adaptive rescheduling) or shifts them deterministically — see risk note below.

## Data Model

**users** (managed largely by auth provider; mirror minimally)
- `id` (PK), `email`, `timezone`, `created_at`
- `timezone` is **load-bearing** — "missed a day" is meaningless without the user's local midnight.

**goals**
- `id` (PK), `user_id` (FK→users), `title`, `description`, `target_horizon` (e.g. weeks), `status` (active/paused/completed/abandoned), `raw_decomposition` (jsonb — the original LLM output), `created_at`

**tasks**
- `id` (PK), `goal_id` (FK→goals), `title`, `description`, `scheduled_date`, `sequence_index`, `status` (pending/done/missed/rescheduled), `completed_at`, `original_scheduled_date`
- `original_scheduled_date` preserves history so the progress view can show slippage honestly.

**streaks**
- `id` (PK), `user_id` (FK→users), `goal_id` (FK→goals, nullable for global streak), `current_length`, `longest_length`, `last_active_date`

**reschedule_events** (audit / observability)
- `id` (PK), `goal_id` (FK→goals), `triggered_by` (miss/manual), `tasks_affected` (int), `llm_used` (bool), `created_at`

**Relationships:** `users 1—N goals 1—N tasks`; `users 1—N streaks`; `goals 1—N reschedule_events`.

## API Endpoints

**Auth** (mostly delegated to provider; backend validates JWT)
- `POST /auth/callback` — OAuth callback handoff
- `GET  /me` — current user + timezone

**Goals**
- `POST   /goals` — create goal; triggers LLM decomposition (streams via SSE)
- `GET    /goals` — list user's goals with progress summary
- `GET    /goals/{id}` — goal detail + task plan
- `PATCH  /goals/{id}` — pause / resume / abandon
- `DELETE /goals/{id}`

**Tasks**
- `GET   /tasks/today` — the daily feed (core screen)
- `PATCH /tasks/{id}/complete` — check off; updates streak
- `POST  /goals/{id}/reschedule` — manual re-plan trigger

**Progress**
- `GET /goals/{id}/progress` — completion %, slippage, streak
- `GET /streaks` — current + longest streaks

> Decomposition and reschedule endpoints stream partial results (SSE) so the UI can render tasks as they're generated rather than blocking on the full LLM response.

## External Integrations

- **LLM provider (single, MVP):** Anthropic or OpenAI via structured/tool-calling output enforcing a strict task schema.
- **Auth provider:** Clerk / Auth0 / Supabase Auth for email + OAuth (Google/Apple).
- **Email (transactional):** Resend / Postmark for verification and password reset.
- **Push notifications:** explicitly deferred to a later version per scope. Design the task/reschedule model now so notifications can hook in later without a rewrite, but build no push infra in the MVP.
- **Out of scope (confirmed):** social features, rewards store, wearable integrations.

## Security Considerations

- **AuthZ on every resource:** every goal/task query must be scoped by `user_id`. The most likely vulnerability here is an IDOR — `GET /goals/{id}` returning another user's plan. Enforce ownership at the query layer, not just the route.
- **JWT validation:** verify tokens from the auth provider on every request; never trust a `user_id` from the request body.
- **LLM prompt-injection / output trust:** a user's goal text becomes part of an LLM prompt and the output is persisted as their schedule. Never `eval`/execute LLM output; validate it against a Pydantic schema and reject malformed plans. Treat the goal description as untrusted input (length limits, sanitization before display).
- **Rate limiting:** decomposition and reschedule endpoints are expensive paid calls — rate-limit per user to cap both abuse and cost. This is a security *and* a cost control.
- **PII minimization:** goals can reveal sensitive personal context (health, finances). Encrypt at rest (managed Postgres default), don't log goal/task contents, and keep LLM provider data-retention settings to zero-retention if available.
- **Transport:** HTTPS everywhere; secure, httpOnly cookies or proper token storage for the PWA.

## Deployment Strategy

- **Platform:** Render / Railway / Fly.io with three processes — web (FastAPI/Uvicorn), worker (Celery beat + worker), and managed Postgres + Redis add-ons.
- **Frontend:** static PWA build deployed to the same platform or a CDN/static host; service worker for offline task viewing and add-to-home-screen.
- **Environments:** `staging` and `production`, separate databases. Run DB migrations (Alembic) as a release step, not at app boot.
- **CI/CD:** GitHub Actions — lint, tests, build, then deploy on merge to `main` (staging) with manual promotion to production.
- **Scheduled work:** Celery beat triggers the daily rollover; because misses are timezone-relative, the worker queries per-user local midnight rather than running one global cron — verify this logic early, it's the trickiest correctness concern in the system.
- **Observability:** structured logging (no goal contents), error tracking (Sentry), and an LLM-cost dashboard (tokens per decomposition/reschedule) from day one, since spend scales with usage.

---

### Key technical risks (flagged honestly)

1. **"Adaptive rescheduling" is the hardest and vaguest feature.** Re-running the LLM on every miss is expensive, slow, and non-deterministic (the plan can change unpredictably, which erodes user trust). **Recommendation:** make the MVP reschedule *deterministic* (shift remaining tasks forward by the slip, compress the timeline) and reserve LLM re-planning for explicit user request or large deviations. Sell "adaptive" without making every miss a paid, unpredictable LLM round-trip.
2. **Timezone-correct "missed a day" detection** is deceptively hard and central to the whole product. Get the per-user local-midnight rollover right before anything else.
3. **LLM output reliability** — decomposition quality varies wildly by goal vagueness. Constrain with a strict schema, sensible task-count bounds, and a retry/repair step on malformed output.
4. **Unit cost scales with engagement** — your most active (best) users cost the most in LLM calls. Cache, batch, and prefer deterministic logic over LLM calls wherever the quality difference is marginal.
