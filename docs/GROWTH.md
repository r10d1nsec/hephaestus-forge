# Growth strategy (internal, honest)

> The stated north star is 100K GitHub stars. Be clear-eyed: that's a top-0.01% outcome. Only a
> handful of projects ever reach it, and they do it by **creating a category**, being **local-first**,
> and catching a **timing + community** wave (OpenClaw, Dify). The PRD-generator niche is crowded and
> stalled — GTPlanner sits at ~287★ and dozens of clones live under ~300★. So a "PRD generator with
> Docker" is **not** enough.

## The wedge

Our one non-obvious bet: **Bring Your Own Engine — including the CLI coding agents people already
have (Claude Code / Codex / Gemini CLI).** Nobody in this niche does it. It reframes the product from
"another PRD tool" to "the local planning layer that runs on your existing agent." That's the line
that earns a share.

## Realistic milestones

| Horizon | Honest target | What it means |
|---|---|---|
| Launch week | 200–1,000★ | A successful Show HN / Reddit / PH day |
| Month 1–3 | 1k–3k★ | Real traction; people self-host it |
| Breakout (uncertain) | 10k★+ | Requires a viral moment + sustained contribution |
| Moonshot | 100k★ | Category capture + luck. Design for it, don't promise it. |

## Launch checklist

- [ ] 20–30s demo GIF in the README (idea → wizard → PRD → ZIP). **This is the single highest-ROI asset.**
- [ ] Landing live on GitHub Pages (EN + 中文 first).
- [ ] Show HN: lead with "runs on the Claude Code / Codex / Gemini CLI you already have, 100% local."
- [ ] Reddit: r/LocalLLaMA (Ollama angle), r/ChatGPTCoding, r/selfhosted.
- [ ] 中文 community: V2EX, 掘金, 少数派 — translations + a localized post (highest star ROI per OpenClaw/Dify).
- [ ] X/Twitter thread + short screen recording.
- [ ] PRs to awesome-lists: awesome-selfhosted, awesome-ai-tools, awesome-claude.
- [ ] Product Hunt once the demo is polished.
- [ ] Seed 8–12 `good first issue`s (new engines, locales, prompt tweaks) so drive-by stars convert to contributors.

## Compounding loops

- **Engine contributions**: each new engine = a new audience (the users of that tool).
- **Translations**: each locale = a new community + SEO surface.
- **Prompt packs**: shareable outputs that mention Hephaestus.

## What to measure

Stars are a vanity proxy. Track: self-host installs (Docker pulls), Engines configured, docs
generated, and contributor count. Those predict durable stars.
