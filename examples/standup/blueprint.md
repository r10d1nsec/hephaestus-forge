# Project Blueprint — Daily Standup Generator

## Recommended Solution Type
- **Recommendation:** Scheduled Python Script (Automation)
- **Why:** Your use case is fully automated, unattended, and runs once per day on a fixed schedule. No user interaction, no web UI, no persistence needed beyond logs. A Python script with cron scheduling is the simplest form that directly fits: lightweight, easy to configure, runs anywhere (VPS, laptop, GitHub Actions), and requires zero overhead. You own the execution, no third-party workflow platform, and total control over cost and behavior.
- **Descartadas:** 
  - Web/mobile app: You explicitly said no UI and no clicking; an app would add unnecessary complexity and ongoing server costs.
  - Workflow automation (n8n/Make/Zapier): Would work, but adds vendor lock-in, costs per-run, and less control over LLM integration.
  - Serverless function (Lambda/Vercel): Overkill for a single daily task; more expensive and harder to debug locally.

## Project Scale
- **Escala:** Small
- **Justificación:** Single script, 3 integrations (GitHub, LLM, Slack), no database, stateless. Estimated 300–400 lines of Python. Fits comfortably in a weekend for a mid-level Python developer.

## Estimated Time
- **Rango total:** 8–16 hours
- **Supuesto de dedicación:** One focused weekend (Saturday/Sunday, 4–8 hours each day).

## Stages / Roadmap

1. **Stage 1 — Foundation & Secrets Setup:** 
   - Objective: Gather and test API credentials.
   - Entregable: `.env` file with GitHub token, Slack webhook URL, LLM API key; test basic auth to each service.
   - Tiempo: 1–2 hours

2. **Stage 2 — GitHub Integration:** 
   - Objective: Fetch commits and merged PRs from yesterday.
   - Entregable: Script that pulls data from GitHub API, groups by repo, filters by date, handles rate limits gracefully.
   - Tiempo: 2–3 hours

3. **Stage 3 — LLM Summarization:** 
   - Objective: Turn commit/PR data into human-readable summaries.
   - Entregable: Prompt template tuned for clarity (avoid jargon for the PM), per-repo grouping, bullet-point format, test summaries locally.
   - Tiempo: 2–3 hours

4. **Stage 4 — Slack Integration & Formatting:** 
   - Objective: Post formatted message to Slack channel.
   - Entregable: Slack message builder (blocks/formatting), webhook POST, test end-to-end with a test message.
   - Tiempo: 1–2 hours

5. **Stage 5 — Scheduling & Deployment:** 
   - Objective: Run automatically every weekday at 9am; handle errors gracefully.
   - Entregable: Cron job (or APScheduler for Windows), logging to file, manual run capability for testing, VPS-ready (systemd service optional).
   - Tiempo: 2–3 hours

## Scope

- **Incluye (MVP):**
  - Fetch commits + merged PRs from GitHub for the past 24 hours.
  - Summarize per repo (grouped output, not a flat commit dump).
  - Post to Slack via webhook every weekday at 9am.
  - Simple YAML/JSON config file for repos, Slack channel, timezone.
  - Error logging (to file or stdout).
  - Manual run capability for testing.

- **Fuera de alcance:**
  - Web dashboard or UI for configuration.
  - Per-user accounts or authentication.
  - Jira, Linear, or other issue tracker integration.
  - Historical analytics or trend tracking.
  - Slack threading or reactions.
  - Multi-team or multi-channel support (v2 feature).

## Recommended Stack

| Component | Choice | Justification |
|-----------|--------|---|
| **Language** | Python 3.9+ | You're comfortable with Python; no extra toolchain setup needed. |
| **GitHub API** | PyGithub | Simple, well-documented, handles pagination and rate limits out of the box. |
| **LLM** | Anthropic SDK (Claude) | Direct API call, fast, good cost for one run per day. Can swap later if needed. |
| **Slack** | requests library | Direct webhook POST; no extra dependency. Slack webhooks are simple and reliable. |
| **Scheduling** | system cron (Linux) or APScheduler (cross-platform) | Cron is simplest on VPS; APScheduler if you test locally on Windows and want identical behavior everywhere. |
| **Config** | YAML (PyYAML) or JSON | Human-readable, easy to edit. No database. Keep secrets in `.env` (python-dotenv). |
| **Logging** | Python logging module | Built-in, no dependency. Write to file for diagnostics. |

## Key Risks

1. **GitHub API rate limits:** If you have many repos or a long history, you may hit 60 requests/hour (unauthenticated) or 5,000/hour (token-authenticated). *Mitigation:* Use pagination, cache data locally, request only 24-hour window.

2. **Slack message formatting & character limits:** Slack messages have a 4,000 character limit for certain block types. If you have very active repos, summaries can get long. *Mitigation:* Implement truncation, multi-message fallback, or link to a log file.

3. **Timezone issues:** User set it to run at 9am, but if the script runs on a remote VPS with a different timezone, "yesterday" is ambiguous. *Mitigation:* Config should specify timezone (e.g., `TZ=America/New_York`); all date logic uses timezone-aware datetimes.

4. **LLM prompt quality:** If summaries are too technical or too verbose for the PM, team adoption stalls. *Mitigation:* Start with v1 prompt, iterate after the first week of feedback, keep examples in the prompt.

5. **VPS availability:** Script only runs if the VPS is up. No built-in retry or health check. *Mitigation:* Use GitHub Actions Scheduler as an alternative (free, reliable), or add systemd timer with auto-restart.
