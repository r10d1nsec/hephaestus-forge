# Launch playbook — how to publish and maximize results

Copy lives in [ANNOUNCEMENT.md](ANNOUNCEMENT.md). This is the *when* and *how*.

> **Mindset:** stars follow conversation, not broadcasts. Your job on launch day isn't to post —
> it's to **show up and reply to every comment for the first 4–6 hours.** That single behavior
> moves more than any title tweak.

---

## 0. Pre-launch checklist (do these the day before)

- [x] README is strong, with the demo GIF and a landing link.
- [x] Landing is live: https://r10d1nsec.github.io/hephaestus-forge/
- [x] Issues + Discussions enabled, topics set, repo description + homepage set.
- [ ] **Add a social preview image** → repo *Settings → General → Social preview* (1280×640). Use a frame of the demo or the hero. This is the image that shows when the link is shared on X/Slack/Discord — big CTR difference.
- [ ] **Seed 6–10 `good first issue`s** from [docs/GOOD_FIRST_ISSUES.md](../GOOD_FIRST_ISSUES.md) and label them. Drive-by visitors convert to contributors here.
- [ ] **Pin one issue** like "Roadmap & ideas — tell us what to build next".
- [ ] Do a clean run yourself end-to-end so you can answer "does it actually work?" with confidence.
- [ ] Optional: ask 3–5 friends to **star + watch** beforehand so the repo isn't at 0 when traffic hits (don't ask strangers to upvote — see "what not to do").
- [ ] Accounts ready: an HN account that isn't brand-new; Reddit accounts with enough karma/age for each sub (check each sub's rules — some require karma/age).

---

## 1. Timing

All times are guidance, not gospel. Aim for when the US is waking up + EU is mid-afternoon.

| Channel | Best day | Best time |
|---|---|---|
| **Show HN** | Tue–Thu | ~08:00–10:00 US Eastern (14:00–16:00 CET) |
| **r/LocalLLaMA, r/selfhosted** | Tue–Thu | ~09:00–11:00 US Eastern |
| **r/ChatGPTCoding** | next day | same window |
| **X/Twitter thread** | launch day | same time as HN, then re-share in the evening |
| **掘金 / V2EX** | +1–2 days | ~10:00–12:00 / 20:00–22:00 China time (UTC+8) |
| **Product Hunt** | once you have traction | PH "day" starts 00:01 PT |

---

## 2. Launch-day sequence (hour by hour)

1. **T-0** — Submit **Show HN** (URL = the repo). Immediately post the author first comment from ANNOUNCEMENT.md.
2. **T+5 min** — Post the **X thread**, pin it, and reply to your own thread with the HN link ("also on HN if you want to discuss").
3. **T+15 min** — Post to **r/LocalLLaMA** and **r/selfhosted** (different titles/bodies — do not copy-paste identically).
4. **Next 4–6 hours** — Stay at the keyboard. Reply to **every** HN and Reddit comment fast, technically, and humbly. Thank critics. Turn questions into roadmap items.
5. **Evening** — Re-share the X thread for other timezones.
6. **Day +1** — Post **r/ChatGPTCoding**. Open PRs to **awesome-lists** (blurb in ANNOUNCEMENT.md).
7. **Day +1–2** — Post the **中文** version (掘金/V2EX). The Chinese dev community drove a lot of OpenClaw/Dify's growth.
8. **Day +2–3** — Product Hunt once you have a base of stars and a testimonial or two.

---

## 3. Channel-specific rules

### Hacker News
- Title must start with `Show HN:`. No emoji, no hype words ("revolutionary", "10x"). Plain and specific wins.
- **Never ask for upvotes** anywhere — HN penalizes "voting rings" and it's the fastest way to get flagged/buried.
- Put the *story* (why you built it) in the first comment, not the title.
- If it doesn't get traction in the first hour, that's normal. HN has a **second-chance pool** — you can email hn@ycombinator.com to ask for a repost/boost, or resubmit once after a few days.
- Engage with disagreement genuinely. "Good point, that's a real limitation — tracking it here [issue link]" earns respect and stars.

### Reddit
- **Read each subreddit's rules first.** Some ban self-promotion or require a ratio of non-promo posts. r/selfhosted and r/LocalLLaMA generally allow "I built this" if it's genuinely useful and self-hostable.
- **Don't cross-post the identical text** — write a native title/body per sub (the pack already does).
- Add the right flair (e.g., "Project"/"Release"/"Self Hosting").
- Reply to comments; Reddit rewards OP engagement with visibility.
- Don't post to 5 subs in 5 minutes — space them out, lead with the 2 best-fit subs.

### X / Twitter
- Lead tweet must carry the hook + the demo GIF/video (visual = 3–5× engagement).
- Tag relevant accounts sparingly and only where genuine (e.g., Ollama). Don't spam-tag.
- Reply to your own thread with the repo link (links in replies hurt reach less than in the lead tweet on some setups — test).

### 掘金 / V2EX / 少数派
- 掘金: add tags 开源 / AI / 工具. A clear title + the demo GIF + a "为什么做这个" story performs well.
- V2EX: post in `/go/create` or `/go/programmer`; the community is blunt — be humble and technical.
- Respond in Chinese; the localized UI/docs are a real selling point there.

---

## 4. What NOT to do (these get you buried or banned)

- ❌ Ask anyone to upvote on HN/Reddit/PH (vote manipulation).
- ❌ Post the same copy-pasted text to many subs at once.
- ❌ Overclaim ("AI that builds your whole app"). Underclaim and let the demo speak.
- ❌ Argue defensively with critics. Concede real limitations; convert them to issues.
- ❌ Delete-and-repost repeatedly. One clean shot per channel, then iterate.

---

## 5. Measure what matters

- **GitHub Insights → Traffic** (Views, Unique visitors, **Referring sites**, **Popular content**) tells you which channel actually worked. Check it the next morning.
- **Stars over time** via [star-history.com](https://star-history.com/#r10d1nsec/hephaestus-forge).
- Real signal beyond stars: **Docker pulls / clones, engines configured, issues opened, first external PR.** Those predict durable growth.
- Realistic expectation (see [../GROWTH.md](../GROWTH.md)): 200–2,000 stars in the first weeks is a strong launch. A breakout needs a viral moment *plus* sustained engagement. Design for it; don't promise it.

---

## 6. After launch (compounding)

- Convert every "can it do X?" into a labeled issue. Reply to the asker when it ships.
- Merge the first external PR fast and thank the contributor loudly — it signals a living project.
- Ship a small visible improvement within a week (it gives you a reason to re-post an update).
- Keep PRs to awesome-lists flowing; each is a permanent backlink + new audience.
- Write a short "what I learned launching" post a week later (HN/Reddit/掘金 love retrospectives) and link the repo again.
