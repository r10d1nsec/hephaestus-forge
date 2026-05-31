# Design Brief — Hephaestus' Forge

Context for Claude Design (and any designer/agent). Goal: a **more refined, professional,
premium** interface for both the **landing** (Astro) and the **app** (React + Tailwind v4),
**without losing the forge identity**.

## Brand

- **Name:** Hephaestus' Forge (Hephaestus = Greek god of the forge, craftsmanship, invention).
- **Tagline:** "Forge a vague idea into a build-ready spec — with the AI engine you already have."
- **Personality:** craftsman precision · local-first / private · developer-trust · warm molten
  accents on cold steel. Think **Linear / Vercel / Resend** level of polish, with a forge soul.
- **Feeling we want:** "a master's workshop" — dark, focused, premium, a little molten glow, not a
  flashy SaaS. Confidence and restraint over decoration.

## Current visual language (keep & elevate, don't discard)

Design tokens (from `frontend/src/index.css`):

| Token | Value | Use |
|---|---|---|
| `forge-bg` | `#0c0a09` | page background (near-black warm) |
| `forge-panel` | `#1c1917` | cards, sidebar, surfaces |
| `forge-border` | `#292524` | borders, dividers |
| `forge-ember` | `#f97316` | primary accent (molten orange) |
| `forge-ember-soft` | `#fdba74` | secondary accent / highlights |
| `forge-steel` | `#a8a29e` | muted text |
| text | `#e7e5e4` / `#fafaf9` | body / headings |

- Accent gradient idea: molten `#f97316 → #fb923c → #fdba74` (use sparingly).
- Icon set: **lucide-react** (Flame is the brand mark). Keep line-icons.
- Mood: dark, warm-neutral (stone/zinc family), single ember accent. Avoid cold blues/purples.

## What "more refined and professional" means here

Elevate, specifically:
- **Typography:** a stronger type scale and rhythm. Consider a refined display face for headings
  (e.g. a tight grotesk / serif accent) + clean sans for body. Better line-height & tracking.
- **Depth & material:** subtle, tasteful — soft shadows, 1px hairline borders, faint inner glows on
  ember elements, a barely-there forge texture/grain. No heavy glassmorphism, no neon.
- **Spacing & hierarchy:** more generous, consistent spacing; clearer primary/secondary hierarchy.
- **Micro-interactions:** hover/focus states, ember "heat" on primary actions, smooth streaming/
  typewriter feel in the wizard, progress that feels crafted.
- **Components:** premium buttons (primary = molten, secondary = steel outline), refined inputs,
  cards with intentional elevation, polished empty states, elegant tabs.
- **Accessibility:** WCAG AA contrast, visible focus rings, reduced-motion friendly.

Avoid: generic AI-SaaS purple gradients, stock hero blobs, clutter, more than one accent hue.

## Tech (so generated code maps back to the repo)

- **App:** React 18 + TypeScript + **Tailwind CSS v4** (`@theme` tokens) + **Zustand** + **lucide-react**.
  Multilingual (EN/中文/ES/FR/DE) via `useT()` — keep text in translation keys, not hardcoded.
- **Landing:** **Astro** static, scoped `<style>`, i18n (5 locales), deploys to GitHub Pages.

## Screens to design

**Landing** (single page, 5 locales): hero (with the BYO-Engine hook + 3-step terminal), "Bring
Your Own Engine" three-card section, "How it works", product screenshot showcase, examples
(Streakly / 聚单宝), documentation grid, contributor CTA, footer. Language switcher in the nav.

**App:**
1. **Sidebar / shell** — brand, nav (Dashboard, Engines), language selector, version.
2. **Dashboard** — project cards, "New idea" primary, empty state, "configure engine" nudge.
3. **New idea** — large idea input + example chips + start.
4. **Wizard** — 5-phase progress (Discovery·Audience·Solution-Fit·Scope·Constraints), chat bubbles,
   streaming question with typewriter, "I have enough → generate".
5. **Documents** — left doc list (Blueprint, PRD, Tech Spec, Estimation), premium Markdown viewer,
   Export ZIP / Regenerate.
6. **Engines (BYO-Engine)** — tabs CLI / API / Ollama; CLI rows with status (not found / detected—
   unverified / verified ✓); Test + Use; active-engine banner.

## Reference (current state)

"Before" screenshots live in `docs/screenshots/`: `landing-en.png`, `dashboard.png`,
`dashboard-zh.png`, `blueprint.png`, `engines.png`, `docs-en.png`, `new-idea.png`. Drag these into
Claude Design as the baseline to refine.
