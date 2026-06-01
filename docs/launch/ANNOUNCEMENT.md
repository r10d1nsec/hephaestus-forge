# Launch announcement pack

Ready-to-paste copy for each channel (EN + 中文). Live links:
- **Repo:** https://github.com/r10d1nsec/hephaestus-forge
- **Website / demo:** https://r10d1nsec.github.io/hephaestus-forge/

See [PLAYBOOK.md](PLAYBOOK.md) for *when* and *how* to post.

---

## 1. Show HN (Hacker News)

**Title** (≤80 chars):

> Show HN: Forge an idea into a build-ready spec, on the AI engine you already have

*Alt:* `Show HN: Self-hosted tool that interviews you and forges a build-ready spec`

**URL:** `https://github.com/r10d1nsec/hephaestus-forge`

**First comment (post immediately, as the author):**

```
Hi HN, I'm Angel. I kept opening Claude Code / Cursor with a half-baked idea,
prompting for hours, and ending up in a refactor because the idea was never
actually defined — wrong scope, wrong stack, sometimes the wrong *kind* of
solution (I'd build an app when a 200-line automation would've done it).

Hephaestus' Forge is a self-hosted web app that interviews you about your idea
through a 5-phase wizard (Discovery → Audience → Solution-Fit → Scope →
Constraints), then forges a build-ready doc pack you drop into your AI IDE as
context: a Project Blueprint (recommended solution type, scale, time, stages,
scope) + PRD + Technical Spec + Estimation.

The part I care about most: Bring Your Own Engine. Instead of locking you to
one API key, it runs on the coding agents you already have installed — Claude
Code, Codex, Gemini CLI — plus Ollama and any OpenAI-compatible API. It detects
the CLIs in your PATH and shells out to them. 100% local; your idea and keys
never leave your machine.

A nice side effect of the Solution-Fit phase: for an example like "turn my git
commits into a daily standup in Slack", the Blueprint recommends a scheduled
automation and explicitly *rejects* building a web app. That's the thing I
wanted — stop me before I over-build.

Stack: FastAPI + SQLite backend with a single Engine abstraction (API / Ollama /
CLI subprocess), React + Tailwind frontend, SSE streaming, Docker or a native
run.sh. MIT. Multilingual (EN/中文/ES/FR/DE) — the language you pick also drives
the questions and the generated docs.

It's v0.2 and very much built in the open. Honest caveat: CLI engines only work
in native mode (the binaries live on your host, not in the container).

Demo + docs: https://r10d1nsec.github.io/hephaestus-forge/
Repo: https://github.com/r10d1nsec/hephaestus-forge

Adding a new engine is a ~20-min contribution and I'd genuinely love help and
feedback — especially on the wizard prompts and which engines to support next.
```

---

## 2. Reddit

### r/LocalLLaMA — *(Ollama / local angle)*

**Title:**

> I built a self-hosted "idea → build-ready spec" tool that runs on Ollama (or your Claude Code/Codex/Gemini CLI) — 100% local, MIT

**Body:**

```
Most "PRD generator" tools are SaaS and lock you to one API. I wanted something
fully local that runs on the models/agents I already have.

Hephaestus' Forge interviews you about an idea through a 5-phase wizard, then
generates a Project Blueprint + PRD + Tech Spec + Estimation you feed to your
coding agent. It runs on:

- Ollama (Llama, Mistral, Qwen…) — fully offline
- CLI agents already in your PATH: Claude Code, Codex, Gemini CLI
- any OpenAI-compatible API (OpenRouter, Groq, etc.)

Nothing leaves your machine. The Solution-Fit phase even recommends the *right
kind* of solution — sometimes it tells you to build an automation instead of an
app, which is half the value IMO.

docker compose up -d   (API + Ollama)   ·   ./run.sh   (unlocks the CLI agents)

Demo: https://r10d1nsec.github.io/hephaestus-forge/
Repo (MIT): https://github.com/r10d1nsec/hephaestus-forge

Feedback very welcome — especially on the prompts and which local models work
best for the interview.
```

### r/selfhosted — *(privacy / self-host angle)*

**Title:**

> Hephaestus' Forge — self-hosted, 100% local tool that turns a vague idea into a build-ready project spec (Docker, MIT)

**Body:** open with this, then reuse the r/LocalLLaMA body:

```
Self-hosted, no SaaS account, no telemetry. Your idea and API keys live in a
local SQLite file and never leave the box. One-command Docker, or a native
run.sh that also lets it use the Claude Code / Codex / Gemini CLI already
installed on your host.
```

### r/ChatGPTCoding — *(coding-agent angle — post the next day)*

**Title:**

> Stop feeding half-baked ideas to your coding agent — this interviews you first, then forges the spec (runs on the Claude Code/Codex/Gemini CLI you already have)

---

## 3. X / Twitter (thread)

```
1/ I kept giving my AI coding agent half-baked ideas and ending up in 3-hour
refactors. So I built Hephaestus' Forge 🔥

A self-hosted tool that *interviews* you about your idea, then forges a
build-ready spec. And it runs on the AI you already have. 100% local. MIT.

🌐 r10d1nsec.github.io/hephaestus-forge
[attach demo gif]

2/ The wedge: Bring Your Own Engine.

No vendor lock-in. It runs on the coding agents already in your PATH — Claude
Code, Codex, Gemini CLI — plus Ollama and any OpenAI-compatible API. Your idea
and keys never leave your machine.

3/ A 5-phase wizard (Discovery → Audience → Solution-Fit → Scope → Constraints)
means it can recommend the *right kind* of solution.

For "git commits → daily standup", it tells you to build an automation, not a
web app. It stops you from over-building. 🧭

4/ The output: a Project Blueprint + PRD + Tech Spec + honest Estimation —
clean Markdown, export as ZIP, drop straight into your AI IDE as context.

Multilingual too (EN/中文/ES/FR/DE) — the language you pick drives the questions
AND the docs.

5/ It's open source (MIT) and built in the open. Adding a new engine is a
~20-min PR.

⭐ Repo: github.com/r10d1nsec/hephaestus-forge
Would love your feedback 🙏
```

---

## 4. 中文（掘金 / V2EX / 少数派）

**标题:**

> 我做了个开源工具：把模糊想法"锻造"成可直接开发的规格，还能跑在你已有的 Claude Code / Codex / Gemini CLI 上（100% 本地，MIT）

**正文:**

```
做 AI 编程时我老犯一个错：想法没想清楚就直接丢给 Claude Code / Cursor，结果几小时后
陷入重构——范围错了、技术栈错了，甚至方案形态都错了（明明一个脚本能解决，我却做了个 App）。

于是我做了 Hephaestus' Forge（赫菲斯托斯熔炉）：一个自托管的 Web 应用，通过五阶段访谈
（探索 → 受众 → 方案匹配 → 范围 → 约束）就你的想法提问，然后锻造出一整套可直接开发的文档：
项目蓝图 + PRD + 技术规格 + 诚实的工时估算，可直接作为编程智能体的上下文。

最大的不同——「自带引擎（Bring Your Own Engine）」：
不把你锁死在某个 API 上，而是直接运行在你已经装好的编程智能体上：
- CLI 智能体：Claude Code、Codex、Gemini CLI（自动检测 PATH）
- 本地模型：Ollama（Llama、Mistral、Qwen，完全离线）
- 任意 OpenAI 兼容 API（OpenRouter、Groq…）
想法和密钥只存在本地，绝不离开你的机器。

「方案匹配」阶段还有个惊喜：比如"把 git 提交整理成每日站会发到 Slack"，它会推荐做
**定时自动化而不是网页应用**，直接帮你避免过度设计。

界面与文档全程支持多语言（中文/EN/ES/FR/DE），所选语言同时决定访谈问题和生成文档的语言。

一条命令启动：docker compose up -d（API + Ollama）/ ./run.sh（解锁 CLI 智能体）

演示 + 文档：https://r10d1nsec.github.io/hephaestus-forge/
仓库（MIT，欢迎 Star 和 PR）：https://github.com/r10d1nsec/hephaestus-forge

新增一个引擎大约 20 分钟就能提一个 PR，非常欢迎反馈，尤其是关于访谈提示词和该优先支持哪些引擎。
```

---

## 5. Product Hunt

- **Tagline (≤60):** `Forge a vague idea into a build-ready spec — 100% local`
- **Description:** `Hephaestus' Forge interviews you about your idea, then forges a Project Blueprint, PRD, tech spec and estimation — running on the AI engine you already have (Claude Code, Codex, Gemini CLI, Ollama, or any API). Self-hosted, private, multilingual, open source.`
- **Topics:** Developer Tools · Artificial Intelligence · Open Source · Productivity

---

## 6. awesome-list PR blurb (for awesome-selfhosted, awesome-ai-tools, etc.)

```
[Hephaestus' Forge](https://github.com/r10d1nsec/hephaestus-forge) - Self-hosted
app that interviews you about an idea and forges a build-ready spec (Blueprint,
PRD, tech spec, estimation). Bring Your Own Engine: Claude Code/Codex/Gemini CLI,
Ollama, or any API. 100% local. `MIT` `Docker/Python/React`
```
