# Examples — real output from Hephaestus' Forge

[English](README.md) · [简体中文](README.zh.md)

These packs were **generated end-to-end by Hephaestus' Forge** using the **Claude Code CLI engine**
(`claude -p`) in native mode — no API key, 100% local. Each started from a single sentence and a
short interview, and produced a PRD, a Technical Spec, and an Estimation report in ~2–3 minutes.

| Example | Idea (input) | Output |
|---|---|---|
| [`streakly/`](streakly/) | "An AI habit tracker that turns any big goal into adaptive daily micro-tasks and reschedules when you miss a day." | [PRD](streakly/prd.md) · [Tech Spec](streakly/tech_spec.md) · [Estimation](streakly/estimation.md) |
| [`dianxiaoer/`](dianxiaoer/) | "A WeChat mini-program that aggregates a small restaurant's orders across delivery platforms and predicts daily stock with AI." (Chinese) | [PRD](dianxiaoer/prd.md) · [Tech Spec](dianxiaoer/tech_spec.md) · [Estimation](dianxiaoer/estimation.md) |

## What stands out

**1. It interrogates, then specifies.** The wizard asked sharp questions (problem, user,
differentiation, MVP scope, out-of-scope, platform) before writing a word of the spec — so the PRD
reflects *decisions*, not guesses.

**2. The output is genuinely build-ready.** The Streakly PRD ships an Executive Summary, a named
persona, prioritized user stories (P0/P1/P2) with acceptance criteria, explicit non-goals, and KPIs.
The Tech Spec recommends a justified stack, a data model, API routes, and a deployment strategy.

**3. Honest estimation.** The Estimation report gives min/max ranges per module, total hours, a
dedication-based timeline, and **named risk factors** — not a single optimistic number.

**4. It speaks the user's language.** The 聚单宝 example was driven entirely in Chinese and the whole
pack came back in fluent, domain-accurate Chinese (it even proposed a product name).

## Reproduce it yourself

```bash
./run.sh                      # native mode → CLI engines available
# In the UI: Engines → Test + Use "Claude Code" → New idea → run the wizard → Generate → Export ZIP
```

> Screenshots of these documents rendered in the app: [`../docs/screenshots/`](../docs/screenshots/).
