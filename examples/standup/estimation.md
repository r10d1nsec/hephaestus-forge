# Estimation Report — GitHub Standup Bot

## Breakdown por módulo/feature

| Feature | Complejidad | Horas Min | Horas Max | Notes |
|---|---|---|---|---|
| GitHub API integration (commits/PRs last 24h) | Media | 1.5 | 3 | Pagination handling, filtering by merged status |
| LLM summarization per repo | Baja | 1 | 2 | Prompt crafting, streaming tokens, error handling |
| Slack webhook posting & formatting | Baja | 0.5 | 1.5 | Message formatting, retry logic for failed posts |
| Config file parsing (repos, channel, schedule) | Baja | 1 | 2 | YAML/JSON validation, defaults, error messages |
| Scheduling (cron/APScheduler) | Baja | 0.5 | 1.5 | Local scheduling vs. external cron service |
| End-to-end testing & debugging | Media | 2 | 4 | Mocking GitHub/Slack APIs, schedule testing |
| Deployment & documentation | Media | 1.5 | 3 | VPS setup, env var handling, README |
| **TOTAL** | | **8** | **17** | |

## Total estimado

**8 – 17 hours of development**

Realistic expectation for a weekend sprint: **10–12 hours** (assumes blocking on a single task max 1 hour, minimal scope creep).

## Estimación según dedicación

| Dedicación | Horas/semana | Tiempo total |
|---|---|---|
| Full weekend (Sat+Sun, 6 hrs/day) | 12 | 1 weekend (ready to deploy Mon) |
| Weeknights (2 hrs × 3 nights) + weekend | 8 | 1.5–2 weeks |
| Part-time (5 hrs/week) | 5 | 2–3 weeks |

## Factores de riesgo

1. **GitHub API rate limits** (60 req/hr unauthenticated; 5000 auth)
   - Mitigation: Use PAT early, implement caching/conditional requests
   - Impact: +1–2 hrs if underestimated

2. **LLM prompt tuning** (summary quality vs. token cost)
   - Risk: Summaries too verbose or too vague on first iteration
   - Mitigation: Start with a simple template, iterate post-deployment
   - Impact: +2–3 hrs if perfectionistic

3. **Slack webhook edge cases** (rate limiting, connection timeouts)
   - Mitigation: Simple retry logic (exponential backoff)
   - Impact: +0.5–1 hr

4. **Scheduling reliability** (APScheduler vs. system cron on a VPS)
   - Risk: Server restart loses scheduled job if not persisted
   - Mitigation: Use system cron (`crontab -e`) instead; simpler, more reliable
   - Impact: +0.5 hrs if you choose cron over APScheduler

5. **Local testing environment** (no easy way to test 9am trigger)
   - Mitigation: Use environment variable to override time, manual trigger in code
   - Impact: +1 hr for test harness

6. **API key management** (GitHub PAT, Slack webhook URL on VPS)
   - Mitigation: `.env` file (add to `.gitignore`), clear deployment docs
   - Impact: +0.5 hrs for docs/setup

## Recomendaciones para reducir tiempo

1. **Start with system cron** — Don't use APScheduler. Use `crontab -e` on the VPS; it's battle-tested, requires 2 lines of config.

2. **Hardcode repos in config** — YAML is overkill for MVP. A simple Python dict or JSON list is sufficient; add dynamic loading later if needed.

3. **Reuse existing SDK clients** — Use official `PyGithub` (commits/PRs) and `slack-sdk` (posting). Don't roll HTTP clients.

4. **Skip per-repo summaries initially** — Summarize all repos in one batch call; add per-repo breakdown post-MVP if the PM asks.

5. **Test locally with mock data** — Create a fake GitHub JSON file of yesterday's commits; test the full pipeline without calling the real API until the last 30 minutes.

6. **Use a simple LLM prompt** — Don't optimize token count or prompt engineering on day one. A 2–3 sentence template is enough:
   ```
   Summarize these GitHub commits in one sentence per repo, from a PM's perspective (non-technical).
   ```

7. **Post a static example first** — Before integrating the LLM, test Slack posting with a hardcoded message. Decouple concerns.

8. **Deploy to a simple VPS early** — DigitalOcean or Linode droplet ($5/mo). Test cron and API integrations on real infrastructure by end of day 1.

---

## Confidence level

**Medium-High (70%)** — The scope is well-defined, APIs are straightforward, and you're experienced enough to handle Python async/error handling. Main uncertainty is LLM summarization quality and scheduling edge cases on a real VPS, both of which are post-MVP iterations.
