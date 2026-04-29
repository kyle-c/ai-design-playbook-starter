# Flows

Major user journeys, the screens that compose them, and how flows hand off to one another.

## Source of truth

Flow definitions live in **[`/app/flows.config.ts`](../app/flows.config.ts)**. Add a flow there → it
shows up in `/canvas`, `/prototype/[flow]`, and the graph view automatically. Don't maintain a
parallel registry; this file is the only one.

To scaffold a new flow + screen files in one shot:

```bash
npm run new-flow -- <flow-id> <screen,screen,screen>
```

This inserts entries between the `AUTOFLOWS:IMPORTS` and `AUTOFLOWS:ENTRIES` markers in
`flows.config.ts` and creates the screen files under `/components/screens/<flow-id>/`.

## Current flows

> Update this section when flows are added or retired. The file system is authoritative; this
> section exists so a designer / new contributor can read intent without grepping code.

### onboarding (entry)

The first-run journey. New user → workspace ready.

1. **welcome** — value prop, two CTAs (Get started / I have an account)
2. **email** — single field, format-validated, `Continue` becomes active when valid
3. **verify** — 6-digit code, paste handling, resend with 30s countdown
4. **ready** — confirmation, single CTA into the app

Hand-off: `nextFlow: "settings"` (illustrative — real apps usually drop into a dashboard or
the requested deep link).

### settings

Account configuration. Reachable from the app menu after onboarding.

1. **overview** — list of section links (account / notifications / privacy / billing / help)
2. **notifications** — toggle group; one consistent row pattern with title + body + Switch
3. **danger-zone** — irreversible actions, destructive-styled CTAs, requires confirmation

## Conventions

**One screen, one file.** `/components/screens/<flow>/<screen>.tsx` exports a single
`<ScreenName>Screen` component. Keep the file < 300 lines; split internal helpers into
sibling files if it grows.

**Screens are presentational.** They take no required props. Mock data comes from
`/mocks/*.json` (see `/mocks/README.md`); when wiring real data, the screen takes the
shape it needs as props and the parent fetches.

**Flow handoff is illustrative until proven.** `nextFlow` on a flow definition shows the
graph view a cross-flow arrow. Real handoffs are conditional on state (auth status, plan,
feature flag) and live in the screen's submit handler — not in `flows.config.ts`.

**Entry flows are marked.** Exactly one flow has `entry: true`. The graph view uses this
to pin it leftmost and the canvas uses it as the default when no `?flow=` is set.

## When to split a flow

Split when:

- The flow has a clear branch (e.g. signup vs. signin) that share screens but diverge after
  step 2 — make them sibling flows, share screen components.
- Total screens exceed ~6 — readers can't hold the sequence in their head.
- A subset of screens is reused from a different entry point — extract to its own flow,
  link via `nextFlow`.

## When to retire a flow

Don't delete a flow without logging the decision in `/decisions/log.json`. Removing the
entry from `flows.config.ts` removes the flow from the canvas; the screen files can stay
under `/components/screens/<flow>/` until the next sweep.
