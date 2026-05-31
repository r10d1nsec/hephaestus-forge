# PRD — Automated Daily Standup Generator

## Executive Summary

Automated Daily Standup Generator is a lightweight, scheduled service that transforms a developer's Git commits and merged pull requests into human-readable summaries and posts them to Slack each weekday morning at 9 AM. The tool bridges the gap between technical Git history (noisy, non-technical-friendly) and team communication (clear, business-aligned summaries). It solves the problem of manual standup writing (10 minutes daily) and makes Git activity visible to non-technical stakeholders (PM, other teams) without forcing them to parse commit logs. MVP scope is a command-line job that runs on a small VPS, pulls data from GitHub API, summarizes with an LLM, and posts via Slack webhook.

## Problem Statement

**Current State:** Developers manually write daily standups, summarizing their previous day's work. This is time-consuming (≈10 min/day/person), error-prone, and inconsistent in detail and format. Raw Git commit messages are noisy and not understandable to non-engineers, making it hard for PMs and other team members to follow project progress.

**Impact:** 
- Wasted developer time: 50 min/week/person × 5 people = 250 min/week of context-switching just to document work.
- Poor visibility: Commits/PRs exist in GitHub; standups are either missing or disconnected from actual work.
- PM alignment: Non-technical stakeholders don't see what actually shipped, only what was claimed.

**Root Cause:** No automated bridge between Git activity (the source of truth) and team communication (Slack).

## Target User Persona

**Primary:** Mid-level software developer on a 4–5 person engineering team.
- Technically capable (can configure webhooks, manage API keys, run scheduled jobs).
- Works in a Git-based workflow with daily standup culture.
- Wants to save 10 min/day but doesn't want to build a full product.
- Prefers working code over polished UI.

**Secondary:** PM or non-technical team lead reading summaries.
- Non-engineer; reads summaries in plain English.
- Cares about "what shipped," not implementation details.
- Uses Slack daily; won't open a dashboard.

## Goals & Non-Goals

### Goals
- Reduce manual standup time by 100% (fully automated).
- Make Git activity visible to non-technical stakeholders in a format they can understand.
- Be deployable in under 1 hour on a small VPS or scheduled job platform.
- Support configuration via a simple file (no database, no web UI needed).
- Group and summarize work by repository for clarity.

### Non-Goals
- Build a web dashboard or UI for filtering/reviewing past summaries.
- Support per-user accounts, multi-team management, or organization-wide rollup.
- Integrate with Jira, Linear, or other project management tools (future nice-to-have).
- Provide analytics or historical trend analysis.
- Enforce standup format or require manual review before posting.

## Feature List (MVP)

### Feature 1: GitHub Data Ingestion
- **User Story:** As a developer, I want the tool to automatically fetch my commits and merged PRs from GitHub, so I don't have to manually list them.
- **Acceptance Criteria:**
  - Tool retrieves all commits authored by the configured user(s) in the past 24 hours.
  - Tool retrieves all merged PRs authored by or reviewed by the configured user(s) in the past 24 hours.
  - Tool filters by repositories listed in the config file.
  - Tool handles GitHub API rate limits gracefully (no crash; retries or waits).
  - Tool works with both public and private GitHub repositories (requires valid API token).
- **Priority:** P0

### Feature 2: LLM-Based Summarization
- **User Story:** As a PM reading the standup, I want work summarized in plain English per repository, so I understand what shipped without parsing raw commits.
- **Acceptance Criteria:**
  - Tool sends raw commit messages and PR titles to a configured LLM (any provider: Anthropic, OpenAI, etc.).
  - LLM generates a 2–4 sentence summary per repository explaining what was completed.
  - Summary is written for a non-technical audience (no jargon).
  - Tool supports configurable LLM provider and model via config file.
  - Summaries include mention of merged PRs (title, not full description).
- **Priority:** P0

### Feature 3: Slack Posting
- **User Story:** As a developer, I want the standup posted to Slack automatically each weekday at 9 AM, so the team sees it without me doing anything.
- **Acceptance Criteria:**
  - Tool accepts a Slack webhook URL in config file.
  - Tool formats standup as a Slack message (one block per repo, linked to GitHub).
  - Tool posts exactly once per weekday at 9 AM (respects holidays/weekends; does not post on Sat/Sun).
  - Tool uses a fixed channel (no per-team or per-user routing in MVP).
  - Slack message includes a timestamp and a link back to GitHub commits (for easy verification).
- **Priority:** P0

### Feature 4: Configuration File
- **User Story:** As an engineer deploying this, I want to configure repos, users, and API keys via a single config file, so setup is fast and repeatable.
- **Acceptance Criteria:**
  - Config is YAML or JSON (human-editable).
  - Config includes: GitHub token, Slack webhook URL, LLM provider & API key, list of repos, list of GitHub usernames to include, target Slack channel.
  - Config supports comments explaining each field.
  - Sensitive fields (API keys) are stored in config but never logged or returned in API responses.
  - Tool validates config on startup (fail fast with clear error messages).
- **Priority:** P0

### Feature 5: Scheduled Job Execution
- **User Story:** As a developer, I want this to run unattended on a schedule, so I don't think about it.
- **Acceptance Criteria:**
  - Tool can be invoked by a cron job (Unix/Linux) or scheduled task (Windows) with a simple command.
  - Tool exits cleanly with status code 0 on success, non-zero on error.
  - Tool logs (stdout/stderr) are minimal and useful for debugging scheduled runs.
  - Tool can be deployed to a small VPS or serverless function (no persistent database required for MVP).
- **Priority:** P0

## Out of Scope

- Web dashboard or UI for browsing past standups.
- Per-user filtering or multi-team rollup in Slack (all users' summaries go to one channel).
- Historical analytics or trend reporting.
- Jira, Linear, GitHub Projects, or other external tool integration.
- Email delivery (Slack only).
- Editing or re-posting past standups.
- AI-powered insights (e.g., "you shipped 20% more code than average").
- Multi-language output (English only in MVP).
- GitHub Enterprise Server support (GitHub.com only).

## Success Metrics / KPIs

| Metric | Target | How Measured |
|--------|--------|--------------|
| **Time Saved per Developer** | 50 min/week (10 min/day × 5 days) | Manual estimate at 4-week mark |
| **Team Adoption** | 100% of dev team receives daily summaries | Check Slack message delivery logs |
| **PM Comprehension** | PM confirms summaries are clear; zero follow-up questions about "what shipped" | PM feedback at 2-week mark |
| **System Reliability** | 99% of scheduled posts succeed (≤ 1 missed standup per 100 runs) | Monitor cron logs / Slack audit logs |
| **Setup Time** | New user can configure and deploy in < 1 hour | Time trial with a beta user |
| **No Manual Intervention** | Tool requires zero manual tweaks per week | Track config changes / manual edits |

## Open Questions

1. **Holiday/Timezone Handling:** How should the tool handle holidays, vacations, or different team member timezones? Should 9 AM be relative to a fixed timezone (e.g., team HQ) or per-developer? Should it skip posting on holidays (Christmas, etc.)? *Assumption for now:* Fixed 9 AM UTC; no holiday skip (can be added later).

2. **Commit Window:** Should commits be from the past 24 hours, past business day (5 PM yesterday to 9 AM today), or past calendar day? *Assumption for now:* Past 24 hours from scheduled run time.

3. **Multi-Repository Grouping:** If a developer touches 10 repos in one day, should each repo get its own Slack message block, or should small/inactive repos be collapsed into a "misc" section? *Assumption for now:* One block per repo, always.

4. **Failure Handling:** If GitHub API is down or LLM API fails, should the tool skip posting that day, post a generic "data unavailable" message, or retry/queue for later? *Assumption for now:* Post an error message to Slack and exit with error code; operator can re-run manually.

5. **Co-Author/Reviewer Attribution:** Should co-authored commits count toward the original author only, or should the tool track co-authors and list them? Should PRs list the primary author only, or all reviewers? *Assumption for now:* Primary author/PR author only; co-authors ignored in MVP.

6. **Sensitive Data in Summaries:** If a commit message includes a password, token, or customer PII, should the tool redact it before sending to the LLM and Slack? *Assumption for now:* No redaction (rely on good Git practices; can add later if needed).

7. **LLM Provider Choice:** Should MVP support only Anthropic (Claude), or be provider-agnostic from day one? *Assumption for now:* Provider-agnostic (config specifies provider and model); ship with Anthropic example.

8. **Slack Message Threading:** Should summaries from different repos on the same day be posted as replies in a thread under a single parent message, or as separate messages? *Assumption for now:* Separate messages (simpler; thread as future UX improvement).
