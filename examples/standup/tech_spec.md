# Technical Spec — Daily Standup Automation via Slack

## Solution Type
**Scheduled Task Automation** — an unattended cron/scheduled-job service that aggregates Git history and publishes summaries. No UI, no interactive component; pure ETL pipeline triggered daily.

---

## Recommended Stack

| Layer | Choice | Justification |
|-------|--------|---------------|
| **Language** | Python 3.11+ | User is mid-level Python; minimal dependencies for quick weekend turnaround. |
| **Scheduler** | APScheduler (in-process) or systemd timer (external) | APScheduler = simple single-file deployment on a VPS. Systemd = cleaner if already managing services. |
| **GitHub Integration** | PyGithub (Python) + GitHub REST API | Well-maintained, zero config beyond a token. Avoids GraphQL complexity. |
| **Slack Integration** | `slack-sdk` (Python) + Webhook | Webhook = no auth management; SDK handles message formatting. |
| **LLM** | Anthropic Claude API | User likely already has credits; Anthropic SDKs are mature. Claude excels at summarization. |
| **Config** | YAML file (`config.yaml`) in repo | Human-editable, version-controlled, no database needed. |
| **Runtime** | Bare VPS (Ubuntu) or lightweight container | systemd service + `cron` on a $5 VPS, or Docker + cron. Avoid Kubernetes (overkill). |
| **Logging** | Python `logging` → syslog or file | Simple file rotation, importable via `systemd` journal. |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│         Systemd Timer / APScheduler                         │
│         (Triggers daily at 9:00 AM)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  standup.py (Main)                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 1. Load config.yaml (repos, Slack channel, LLM key)   │ │
│  │ 2. For each repo:                                      │ │
│  │    a. Fetch yesterday's commits + merged PRs          │ │
│  │       (via PyGithub, filter by timestamp)             │ │
│  │    b. Extract metadata (author, file changes, msgs)   │ │
│  │    c. Summarize via Claude (batched per repo)         │ │
│  │ 3. Format Slack message (per-repo blocks + totals)    │ │
│  │ 4. Post to Slack channel (webhook)                    │ │
│  │ 5. Log result (success/failure)                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
         ▲                          ▼
    config.yaml          Slack Channel (Webhook)
         ▲                          ▼
    (credentials)            Team reads standup
```

**Flow:**
1. Scheduler fires → Python subprocess starts `standup.py`
2. Load configuration (repos, Slack webhook URL, LLM API key)
3. For each repo: fetch commits+PRs from yesterday via GitHub API
4. Batch by repository; summarize each batch with Claude
5. Build Slack message (rich formatting: repo name, bullet points, emoji highlights)
6. POST to Slack webhook
7. Exit; scheduler logs completion status

---

## Data Model

### Configuration (config.yaml)

```yaml
# Which GitHub repos to monitor
repositories:
  - owner: "your-org"
    repo: "repo-name-1"
    branch: "main"
  - owner: "your-org"
    repo: "repo-name-2"
    branch: "main"

# Slack destination
slack:
  webhook_url: "https://hooks.slack.com/services/..."  # from Slack workspace settings
  channel: "#engineering-standup"
  mention_on_error: "@dev-lead"  # optional; notify if standup fails

# LLM configuration
llm:
  provider: "anthropic"  # support for future OpenAI, Ollama, etc.
  model: "claude-opus-4-8"
  api_key: "${ANTHROPIC_API_KEY}"  # read from env var

# Timing
schedule:
  time: "09:00"  # 9 AM local time
  timezone: "UTC"  # or "America/New_York", etc.
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]  # skip weekends

# Logging
logging:
  level: "INFO"
  file: "/var/log/standup.log"
```

### Runtime State

No database. All state is ephemeral:
- Last run timestamp (logged; can be parsed from `standup.log` if needed for debugging)
- Session cache (within a single run): commit list per repo, summary text

### External APIs

**GitHub API** (read-only):
- `GET /repos/{owner}/{repo}/commits?since=<yesterday>&until=<today>`
- `GET /repos/{owner}/{repo}/pulls?state=merged&merged_at=<yesterday..today>`

**Slack Webhook API** (write-only):
- `POST <webhook_url>` with JSON payload

**Anthropic Claude API** (read-only):
- `POST /messages` with commit text; returns summary

---

## API Endpoints

**This is NOT a web service.** No endpoints. The tool is:
- **Triggered by:** systemd timer / cron / APScheduler (local)
- **Outputs to:** Slack webhook (one-way HTTP POST)
- **Inputs from:** GitHub (HTTP GET) and config file (local YAML)

If future iteration requires a dashboard or manual trigger, those would be added later (out of scope MVP).

---

## External Integrations

### 1. GitHub API
- **What:** Fetch commits and merged PRs for a given date range and repository.
- **Auth:** Personal Access Token (GitHub Settings → Developer settings → Personal access tokens).
- **Scope needed:** `repo:read` (public + private repo read; no write).
- **Rate limit:** 5,000 req/hour (token auth). MVP will use << 100 req/run.
- **Error handling:** If GitHub is unreachable, log and post a "GitHub API unavailable" message to Slack (fail loudly so team knows).

### 2. Slack Webhook
- **What:** Post a formatted message to a channel without storing credentials in the app.
- **Setup:** Slack Workspace → App → Incoming Webhooks → Create webhook for target channel.
- **Auth:** Webhook URL (kept in config, not in code).
- **Payload:** Block Kit JSON (rich formatting: sections, bullet lists, context).
- **Error handling:** If webhook fails, exit with non-zero status; systemd logs the error.

### 3. Anthropic Claude API
- **What:** Summarize commits + PR titles per repository.
- **Auth:** API key (from environment variable).
- **Model:** Claude 3.5 Sonnet or Opus (user's choice, adjustable in config).
- **Prompt template:** "Summarize these Git commits and merged PRs in plain English, grouped by feature or theme. Keep it brief (2–4 bullets per repo)."
- **Cost:** Estimated ~0.005 USD per standup (small payload).
- **Error handling:** If API fails, use fallback: raw commit list (not ideal, but ship the standup).

---

## Security Considerations

1. **API Keys & Secrets**
   - GitHub token: read from environment variable `GITHUB_TOKEN` (not hardcoded).
   - Slack webhook URL: in config file (local only, git-ignore `config.yaml.local` with secrets).
   - Anthropic API key: environment variable `ANTHROPIC_API_KEY`.
   - **Risk:** If config file is committed to a public repo, secrets leak. **Mitigation:** `.gitignore` all `.local` variants; document in README that credentials go in env vars or in-repo secret files only on private repos.

2. **GitHub API Tokens**
   - Use a **machine user** token or bot account if possible (not personal token), to avoid binding standup to one person's GitHub life cycle.
   - Token scope: read-only (`repo:read`), no write access.

3. **Slack Webhook URLs**
   - Webhook is channel-specific and can only POST (no read/delete).
   - If leaked, attacker can spam the channel but cannot read history.
   - **Mitigation:** Rotate webhook in Slack if URL is suspected compromised.

4. **Commit Message Privacy**
   - Commit messages are sent to Claude API (Anthropic).
   - If commit messages contain secrets (API keys, passwords), they **will be logged by Anthropic**.
   - **Mitigation:** Educate team to never commit secrets; use `.env` files / secret managers instead. Add pre-commit hooks (git-secrets, gitleaks).

5. **Logs**
   - Standup script logs to file (`/var/log/standup.log`).
   - Logs should NOT contain full commit text or API keys.
   - **Mitigation:** Sanitize logs; only log metadata (commit count, summary length, success/failure).

---

## Deployment Strategy

### Option A: Systemd Timer (Recommended for MVP)
**Simplest; requires no extra dependencies.**

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   # Includes: PyGithub, slack-sdk, anthropic, pyyaml
   ```

2. **Create systemd unit file** (`/etc/systemd/system/standup.service`):
   ```ini
   [Unit]
   Description=Daily Standup Summarizer
   After=network.target

   [Service]
   Type=oneshot
   User=standup
   WorkingDirectory=/opt/standup
   ExecStart=/opt/standup/venv/bin/python standup.py
   EnvironmentFile=/etc/standup/standup.env
   StandardOutput=journal
   StandardError=journal
   ```

3. **Create timer** (`/etc/systemd/system/standup.timer`):
   ```ini
   [Unit]
   Description=Daily Standup Timer
   Requires=standup.service

   [Timer]
   OnCalendar=Mon-Fri 09:00:00
   Persistent=true

   [Install]
   WantedBy=timers.target
   ```

4. **Enable and start:**
   ```bash
   sudo systemctl enable standup.timer
   sudo systemctl start standup.timer
   ```

5. **Monitor:**
   ```bash
   sudo systemctl list-timers standup.timer
   sudo journalctl -u standup.service -f
   ```

### Option B: Docker + Cron
**If running on a container-managed VPS (e.g., DigitalOcean App Platform):**

1. Build a minimal Docker image:
   ```dockerfile
   FROM python:3.11-slim
   WORKDIR /app
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   COPY . .
   CMD ["python", "standup.py"]
   ```

2. Use `docker-compose` + `cron` to trigger container on schedule, or use a managed scheduler (GitHub Actions, AWS Lambda, etc.).

### Option C: GitHub Actions (Alternative)
**Trigger workflow on schedule; post standup within GitHub's ecosystem:**

```yaml
name: Daily Standup
on:
  schedule:
    - cron: "0 9 * * 1-5"  # 9 AM, Mon–Fri (UTC)
jobs:
  standup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: "3.11"
      - run: pip install -r requirements.txt
      - run: python standup.py
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Trade-off:** Simplest setup (no VPS), but GitHub Actions concurrency limits may delay runs; less control over logs.

### Recommended for This User
**Systemd Timer on a cheap Ubuntu VPS ($5–10/month).**
- Simple, no-frills.
- Full control over logs and timing.
- Minimal dependencies.
- Scales to multiple teams without hitting GitHub Actions quotas.

---

## Implementation Roadmap (Breakdown)

### Phase 1: MVP (1–2 days)
- [x] Config schema (YAML) + loader
- [x] GitHub API client (fetch commits + PRs for yesterday)
- [x] Claude API integration (summarize commits)
- [x] Slack message formatter + webhook post
- [x] Error handling (GitHub down, LLM error, Slack error)
- [x] Local systemd timer or manual test script

### Phase 2: Polish (if time)
- [ ] Markdown output option (save to local file instead of/in addition to Slack)
- [ ] Grouping by author or feature (CLI flag)
- [ ] Retry logic with exponential backoff for transient failures
- [ ] Config validation on startup (fail fast if repos don't exist)

### Phase 3: Future (post-MVP, out of scope)
- [ ] Web dashboard to view past standups
- [ ] Per-user summaries (filter by commit author)
- [ ] Jira/Linear integration to cross-reference tickets
- [ ] Sentiment analysis (highlight risky/blocked work)

---

## Known Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| GitHub API rate limit exhausted | Standup fails if too many repos monitored. | Start with 2–3 repos; monitor API usage in logs. |
| Commit message contains secrets | Secrets leaked to Anthropic API. | Require pre-commit hook (gitleaks); educate team. |
| Claude API outage | Standup uses fallback (raw commits). | Log error; post to Slack with "Summary unavailable." |
| Slack webhook URL leaked | Attacker can spam channel. | Rotate webhook; use org secrets in `.env`. |
| Timezone mismatch | Standup fires at wrong time. | Config includes timezone field; document in README. |
| Large commit volume (1000+ commits/day) | LLM prompt too long; token limit exceeded. | Implement pagination; summarize per-repo in separate API calls. |

---

## Definition of Done (MVP)

- [ ] `standup.py` runs without errors locally.
- [ ] Config file (`config.yaml`) is documented and version-controlled.
- [ ] GitHub API fetches commits + PRs for yesterday.
- [ ] Claude API summarizes and returns text.
- [ ] Slack message posts to the target channel in the expected format.
- [ ] Systemd timer / cron job is set up and tested.
- [ ] One full dry-run on the target server (no live post yet).
- [ ] README includes setup instructions, config example, and troubleshooting.
- [ ] Team receives and validates first live standup Monday morning.

---

## References & Next Steps

1. **Scaffolding repo:** Create `standup-ai/` with structure:
   ```
   standup-ai/
   ├── standup.py
   ├── config.yaml.example
   ├── requirements.txt
   ├── README.md
   └── systemd/
       ├── standup.service
       └── standup.timer
   ```

2. **GitHub token:** [https://github.com/settings/tokens](https://github.com/settings/tokens) (select `repo:read`).

3. **Slack webhook:** [https://api.slack.com/messaging/webhooks](https://api.slack.com/messaging/webhooks).

4. **Anthropic API:** [https://console.anthropic.com](https://console.anthropic.com) (get API key).

5. **Test locally before systemd:**
   ```bash
   export GITHUB_TOKEN=... ANTHROPIC_API_KEY=... SLACK_WEBHOOK_URL=...
   python standup.py
   ```
