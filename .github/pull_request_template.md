<!--
  Design PR template — keep this file in sync with /skills/decisions.md.
  Delete sections that don't apply, but don't delete the headings.
-->

## What changed (visually)

<!-- One or two sentences. What does the user see that's different? Drop a
     before/after screenshot or a Vercel preview link. -->

## Why

<!-- The decision behind the change. If this resolves an entry in
     /decisions/log.json, link it. If it creates a new structural
     decision, log it BEFORE merging — see /skills/decisions.md. -->

## Implementation notes for engineering

<!-- Anything an engineer reading the diff needs to know that isn't
     obvious from the code:
     - Token impact (new var? renamed? deprecated?)
     - Composite component changes vs. screen-only changes
     - States that are stubbed and need real data wiring
     - Mocks added in /mocks/ that need replacing
-->

## What to verify

<!-- Bulleted checklist of things a reviewer should poke at. Bias toward
     edge cases and the four states (loading / error / empty / success). -->

- [ ] Loading state holds ≥300ms, doesn't flash
- [ ] Error state has a recovery action
- [ ] Empty state has a clear next step (or is documented as passive-fill)
- [ ] Touch targets ≥44×44 on mobile
- [ ] Works in both light and dark themes (toggle in /design-system)
- [ ] `prefers-reduced-motion` respected

## Decision log impact

<!-- If a decision was logged or a previous one superseded:
     - Linked entry: `/decisions/log.json` → `<id>`
     - Status moved: `under-review` → `accepted`
     - Tokens regenerated: `npm run tokens:build`
-->

## Audits

<!-- Confirm the gates ran clean. CI runs them too — this is the
     designer's pre-flight check. -->

- [ ] `npm run check` passes locally
- [ ] No new placeholders (Lorem / TODO / `[brackets]`) — `npm run audit:copy`
- [ ] No hardcoded hex / px in components — `npm run audit:hardcoded`
- [ ] Token contrast pairs still pass — `npm run tokens:audit`
