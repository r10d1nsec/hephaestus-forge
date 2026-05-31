# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security vulnerabilities. Instead, email
**angelroldanruiz@gmail.com** with details and steps to reproduce. We aim to respond within 72 hours.

## Scope & design notes

Hephaestus' Forge is **self-hosted and local-first** by design:

- API keys and engine configuration are stored only in the local SQLite database and are never
  returned in API responses or logs.
- No telemetry. The app makes outbound calls **only** to the AI engine you configure.
- CLI engines execute local binaries (`claude`, `codex`, `gemini`) as subprocesses; they run with
  your user's permissions. Only enable engines you trust.

When deploying beyond `localhost`, put the app behind your own authentication / reverse proxy —
the MVP assumes a single trusted local user.
