# States

One consistent pattern per state type. A screen that shows different patterns for the same
state across flows is the leading indicator that the system is drifting.

## The four states

Every screen that loads, mutates, or filters data must be designed for **all four**, not just
the happy path. If you ship without an explicit answer for the other three, you've shipped
three bugs.

### Loading

**Pattern:** Skeleton placeholders that match the final layout.

**Component:** `<Skeleton />` from `/components/ui/skeleton.tsx`.

**Rules:**

- Use skeletons, not spinners, for content that has a known shape (lists, cards, profile
  blocks). Spinners are only for unknown-duration actions inside an interactive control
  (e.g. button while submitting).
- Don't skeleton chrome (headers, nav). Only the content region.
- Match the skeleton's geometry to the real content — same heights, similar widths.
  Anything else creates layout shift on swap.
- Hold the skeleton ≥ 300ms so it doesn't flash. Below that, render nothing.

**Don't:** Don't show "Loading…" text. Don't show full-page spinners. Don't mix skeletons
and spinners in the same view.

### Error

**Pattern:** Inline `<Alert variant="destructive">` with a recovery action.

**Component:** `<Alert />` + `<AlertTitle />` + `<AlertDescription />` from
`/components/ui/alert.tsx`.

**Structure:**

1. **Title** — what failed, in user terms ("We couldn't reach the server")
2. **Description** — what they can do next ("Check your connection and try again")
3. **Action** — one button labeled with the recovery verb (`Try again`, not `OK`)

**Rules:**

- Errors should feel calm, not alarming. Token: `--color-feedback-danger-fg` on
  `--color-feedback-danger-bg`. No exclamation marks.
- Always include a next step. An error without a recovery action is a dead end.
- Inline-near-the-cause beats global toasts for form errors. Reserve toasts for
  ambient failures the user didn't directly trigger.
- Network and validation errors use the same shape — only the copy differs.

**Reference:** see `/locales/en.json` → `errors` for the canonical strings
(`auth.expired`, `form.required`, `network.unreachable`).

### Empty

**Pattern:** Centered illustration / icon + headline + body + single primary action.

**Structure:**

1. **Icon or small illustration** — 64×64, `--color-text-tertiary`
2. **Headline** — `text-h3`, calm and specific ("No notifications yet")
3. **Body** — `text-body text-text-secondary`, one sentence on why it's empty and what
   creates the first item
4. **CTA** — primary button if there's an action that fills it; omit if not (e.g. inbox
   that fills passively)

**Rules:**

- "Empty" doesn't mean "broken." Copy never apologizes for the empty state — it
  describes the next step.
- Don't show empty UI for transient empty (just-loaded). Use the loading state
  until the request resolves.
- One CTA, never two. The whole point of empty is to focus on the single first action.

**Don't:** Don't ship `Lorem ipsum` placeholder content as a fake-empty workaround.

### Success

**Pattern:** Inline confirmation that points at the next step, never a celebration page.

**Structure:** depends on context.

- **Form submission:** the form disappears, replaced by a one-line confirmation +
  link to the resulting object ("Saved. View profile.")
- **Async action:** brief toast (`--color-feedback-success-bg`) with the
  past-tense verb ("Notifications updated"). Auto-dismiss at 4s.
- **Onboarding completion:** dedicated screen — see `<ReadyScreen />` for the
  pattern (eyebrow + headline + body + single CTA into the next experience).

**Rules:**

- Past tense ("Saved", "Sent", "Updated"), not present ("Saving…").
- Never block the user with a modal "Success!" dialog. Confirmation should not require
  dismissal.
- Don't over-celebrate small wins. A toast for `Notifications updated` is calm.
  A confetti burst for changing a checkbox is corporate cringe.

## State transitions

The state machine for any data-driven screen is:

```
idle → loading → (success | error | empty)
```

`empty` is a *kind of success* — the request succeeded, the result was zero. Render
empty differently from error; don't conflate the two.

Mutations add an `optimistic` lane: the UI shows the new state immediately and rolls
back on error. Pair with the error pattern above for the rollback messaging.

## Where this lives in the codebase

- `/components/ui/skeleton.tsx` — Loading
- `/components/ui/alert.tsx` — Error (and informational)
- `/locales/en.json` → `errors.*` — canonical error strings
- `/components/screens/onboarding/email.tsx` — example of inline form-error pattern
- `/components/screens/onboarding/verify.tsx` — example of optimistic + error rollback
- `/components/screens/onboarding/ready.tsx` — example of success-as-screen

If a new state pattern shows up that doesn't fit one of the four, log it to
`/decisions/log.json` before letting it spread.
