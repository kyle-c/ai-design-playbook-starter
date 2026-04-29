# CLAUDE.md

> Auto-loaded at every Claude Code session. The persistent design voice for this repo.

## Project

**Name:** ai-design-playbook-starter
**One-liner:** A code-first design starter following the AI Design Playbook (https://ai-design-playbook.vercel.app). Codebase is the design system; designers ship via PRs.
**Status:** Phase 1 (setup). No flows built yet. Brand identity is placeholder — replace before first real screen.

## Stack

- Next.js 14 (App Router)
- shadcn/ui (themed via tokens, structure never modified)
- Tailwind CSS + CSS custom properties (tokens.css)
- TypeScript
- Vercel (preview URLs per branch)

## Folder map

```
/app                  Next.js routes
  /design-system      Living style guide (auto-generated from tokens)
  /canvas             Zoomable multi-flow canvas (design-only, never ship)
  /prototype/[flow]   Deep-link mobile prototype (design-only, never ship)
  flows.config.ts     Flow → ordered screens registry
/components
  /ui                 shadcn primitives (theme via tokens; never edit structure; use SHADCN aliases)
  /composites         Product-specific composites (use SEMANTIC names; created on 3rd repetition)
  /screens/[flow]     Whole screens, imported by flows.config (use SEMANTIC names)
/styles
  tokens.css          THE design system. Three layers: primitive → semantic → component
/skills               Persistent context Claude reads before relevant work
  brand.md            Visual identity, type scale, color system, motion
  a11y.md             WCAG rules, focus, touch targets
  copy.md             Voice, tone, button labels, error structure, char limits
  performance.md      Bundle/LCP/CLS budgets
  components.md       Component library docs (filled in as system grows)
  flows.md            User journeys, screen sequences, flow handoff
  states.md           Loading / error / empty / success patterns
  data-shapes.md      Type definitions and edge cases
  decisions.md        How decisions get logged
/mocks                Mock JSON data for screens that consume real shapes
/decisions
  log.json            Structured decision records
  CHANGELOG.md        Human-readable, regenerated weekly
/tokens                 Auto-generated; regenerate via npm run tokens:build / content:inventory
  design-tokens.json          W3C DTCG export (semantic + primitive)
  design-tokens.ios.json      pt units (auto from design-tokens.json)
  design-tokens.android.json  sp/dp units (auto from design-tokens.json)
  content-inventory.json      Every user-facing string with key, char count, context
/locales
  en.json             Content tokens (semantic keys, never hardcoded strings)
/assets
  /icons              SVG icon files
  /illustrations
```

## Read these skill files before relevant tasks

- Any visual or UI work → `/skills/brand.md` AND `/styles/tokens.css`
- Anything interactive, focus, contrast, ARIA → `/skills/a11y.md`
- Any user-facing strings → `/skills/copy.md` AND `/locales/en.json`
- New screens, layouts, components → `/skills/components.md`
- New flows or screen sequences → `/skills/flows.md` AND `/app/flows.config.ts`
- Loading / error / empty / success → `/skills/states.md`
- Anything that consumes or produces real data → `/skills/data-shapes.md`
- Bundle size, images, perf concerns → `/skills/performance.md`
- Logging a decision → `/skills/decisions.md`

If unsure which skills apply, read all of them once at session start.

## Absolute rules (never break)

1. **Never hardcode color or spacing values.** Use CSS variables (`var(--color-*)`, `var(--space-*)`) only. No hex codes in components. No `px` literals for spacing.
2. **Never install npm packages without asking.** Explain why no existing package covers the need before proposing one.
3. **Never modify `/components/ui` structure.** Theme through tokens. Composite behavior belongs in `/components/composites` or a screen file.
4. **Never push to `main`.** All work goes on a feature branch (`design/YYYY-MM-DD-task`) or weekly system branch (`design-system/week-of-YYYY-MM-DD`).
5. **Never ship `/canvas` to production.** Design-only route. Gated by `NODE_ENV !== 'production'` check; don't remove it.
6. **Never accept placeholder copy.** No Lorem ipsum, no `[Button label]`. Generate real copy at the same time as layout.
7. **Always add `prefers-reduced-motion` overrides** to any animation longer than 100ms.
8. **All touch targets ≥ 44×44px on mobile.** No exceptions.

## Designer preferences (taste, not rules)

> These persist across sessions. Update as taste sharpens.

- High contrast, low density. When in doubt, remove rather than add.
- Neutral surfaces dominate (~80% of any screen). Brand color is for action, not decoration.
- Typography hierarchy is established by size + weight, not color.
- Real content beats clever animation.
- Errors should feel calm, not alarming.

## Prompting style

Describe visual feedback in design vocabulary, not technical instructions:
- ❌ "make the title text 32px font-weight 700"
- ✅ "the headline reads equal to the body text — push it up one step in the scale"

For visual problems, **upload a screenshot first**, then say one sentence. Words-only is slow and imprecise.

When stuck after 2-3 iterations, **reframe** instead of refining: "Forget what we built. What's the simplest version that achieves the goal?"

## Deployment

- Vercel auto-deploys every branch as a preview URL.
- Production = `main`. Production builds skip `/canvas` and `/prototype`.
- Design system reference deploys to `/design-system` and is publicly readable.

## Current status (update weekly)

**Week of 2026-04-27 — Phase 1 setup**
- ✅ Repo scaffolded per playbook
- ⏳ Replace placeholder brand identity in `/skills/brand.md` and `/styles/tokens.css`
- ⏳ Run token-level a11y audit before first flow
- ⏳ Pick most critical user journey for week 2

## References

- Playbook: https://ai-design-playbook.vercel.app
- shadcn/ui: https://ui.shadcn.com
- W3C DTCG token spec: https://design-tokens.github.io/community-group/format/
