# Data shapes

Real type definitions and edge cases for the data the UI renders. This file exists so
designers building screens know what shape to design for — including the unhappy edges.

## Source of truth

When the engineering repo exists, types live there. This file mirrors them so designers
can work offline and so the design repo's screens compile. Keep the two in sync via:

```bash
# In CLAUDE.md session opener
Read ../[engineering-repo]/src/types and tell me what's changed since this file's
last-updated stamp.
```

When the engineering repo doesn't exist yet (this starter), the shapes here are the
*proposal* — designers commit them, engineering ratifies (or amends) on integration.

**Last synced from engineering:** 2026-04-29 (initial proposal — no engineering repo yet)

## Conventions

- Types are `type` aliases, not interfaces, unless declaration-merging is required.
- Optional fields use `?:`, never `| undefined`. Be explicit about which fields are
  guaranteed to be present.
- IDs are branded strings (e.g. `type UserId = string & { __brand: "UserId" }`) when
  the engineering repo brands them. Otherwise plain `string`.
- Dates are ISO 8601 strings on the wire, `Date` objects in app state. Never raw
  timestamps in component props.
- Enums are string union types (`"pending" | "verified" | …`), not TS enums.

## Shapes

### `User`

```ts
type User = {
  id: string;
  email: string;
  name: string | null;
  /** ISO 8601. Set when the verification code is accepted. */
  verifiedAt: string | null;
  /** Per-user feature flags from the server. Always present, may be empty. */
  flags: Record<string, boolean>;
  preferences: NotificationPreferences;
};
```

**Edge cases:**
- `name` is `null` for users mid-onboarding (between `email` and `verify`). Screens
  must handle the unnamed case — fall back to email local-part, never show "Anonymous".
- `verifiedAt === null` means the account exists but the user hasn't completed the email
  loop. Treat as "logged in but not active" — show the verify screen, not the dashboard.
- `flags` is always an object. Never `null` or `undefined`. Missing flag = `false`.

### `OnboardingStep`

```ts
type OnboardingStep = "welcome" | "email" | "verify" | "ready";

type OnboardingState = {
  step: OnboardingStep;
  email: string | null;
  /** Server-side step the backend last accepted. May lag the client step
      while the user is mid-flight. */
  serverStep: OnboardingStep;
  /** Set if the verify step has been attempted with the wrong code. */
  lastError: { kind: "incorrect" | "expired" | "rateLimited" } | null;
};
```

**Edge cases:**
- The user can refresh the page mid-flow. The screen must derive `step` from the
  URL or from `serverStep`, never trust client-only state.
- `lastError.kind === "rateLimited"` requires showing a 60-second countdown,
  not a generic error. See `<VerifyScreen />`.

### `NotificationPreferences`

```ts
type NotificationPreferences = {
  emailDigest: boolean;
  push: boolean;
  marketing: boolean;
  sound: boolean;
};
```

**Edge cases:**
- All fields default to `false` for new users. The settings screen must show
  the actual values — never assume "on by default" without checking.
- `push` is a request, not a guarantee — the OS-level permission may be denied.
  When the toggle flips on but the OS denies, show an inline alert (state pattern:
  *Error* → recovery action = "Open system settings").

### `Session`

```ts
type Session = {
  userId: string;
  /** ISO 8601 expiry. Refresh fires at expiry minus 5 minutes. */
  expiresAt: string;
  /** Set true after the user has successfully completed sign-out everywhere. */
  invalidated: boolean;
};
```

**Edge cases:**
- An expired session shows the `errors.auth.expired` string and routes to the
  email screen — never to a generic `/signin`.
- `invalidated === true` after the user clicks "Sign out everywhere" in
  `<DangerZoneScreen />`. Other tabs detect this on next request and route out.

## When this drifts

The cost of this file getting stale isn't theoretical — when designers design for
shapes that don't exist, the work doesn't ship. Re-sync rules:

- **Every Monday session opener:** `git log -p ../[engineering-repo]/src/types --since
  "1 week ago"` — Claude reads, summarizes diff, designer updates this file.
- **On every PR that adds a new shape:** include the shape here in the same PR. No
  separate "docs PR" later.
- **On every type change in engineering:** the engineering PR notifies CODEOWNERS of
  this file (configured in `/.github/CODEOWNERS`). Designer reviews, updates, merges.

If a shape is too speculative to commit (a feature still in spec), put it under a
`## Speculative` heading at the bottom of this file with a link to the design doc. Don't
let speculation pretend to be canonical — it poisons the well.
