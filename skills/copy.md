# copy.md

> Read before writing any user-facing string.

## Voice (3 words)

**Calm. Direct. Human.**

Not chirpy. Not corporate. Not apologetic by default.

## Tone by context

| Context | Tone | Example |
|---|---|---|
| Onboarding | Encouraging, low-pressure | "Take a minute. We'll walk through three steps." |
| Empty states | Helpful, points to a path | "Nothing here yet. Connect your account to get started." |
| Errors | Calm, blame-free, actionable | "We couldn't reach the server. Check your connection and try again." |
| Success | Brief, no celebration confetti | "Saved." |
| Destructive confirm | Specific, names the consequence | "Delete this account? This can't be undone." |
| Notifications | Useful, never marketing | "Your invoice is ready." |

## Button labels

- **Verb-first.** Always start with the action.
- **Specific.** "Save changes" beats "OK". "Delete account" beats "Confirm".
- **Sentence case.** Not Title Case, not ALL CAPS.
- **Max 20 chars on mobile.**
- Pair primary + secondary semantically: "Save" / "Cancel" — not "Yes" / "No".

## Error message structure

> **what happened** + **why (if helpful)** + **what to do**

✅ "We couldn't save your changes. Your session expired. Sign in to continue."
❌ "Something went wrong."
❌ "Error 401: Unauthorized."
❌ "Please try again later."

If you ever write "something went wrong" or "please try again later", stop and find out the actual cause.

## Character limits (mobile)

| Surface | Limit |
|---|---|
| Screen title | 24 chars |
| Section header | 32 chars |
| Button | 20 chars |
| Notification | 48 chars |
| Empty state body | 80 chars |
| Toast | 64 chars |

If copy doesn't fit, the limit isn't the problem — the copy is.

## Things to never say

- "Something went wrong"
- "Please try again later"
- "Invalid input"
- "Are you sure?" (without saying what)
- "Oops!"
- "Awesome!", "Great!", any cheerleading
- Lorem ipsum (and other placeholder filler)
- "Click here"
- Any sentence over 20 words
- Apology theatre ("We're so sorry!" before something the user did)

## Implementation rules

1. **All UI copy lives in `/locales/en.json`.** Never hardcode strings in JSX.
2. **Keys are semantic, not descriptive.** `onboarding.cta.primary`, not `getStartedButton`.
3. **Real copy from day one.** Generate the actual string at the same moment as the layout. Placeholder copy distorts spacing and gets shipped.
4. **Pluralization** uses ICU MessageFormat (next-intl handles this).
5. **No string concatenation.** Use full sentence keys; don't piece sentences from fragments — translation will fail.

## Voice/tone per market

Translation is not localization. For each non-English market, create `/skills/copy-[locale].md` documenting:

- Formality register (US English: direct/casual; UK: measured; German: formal; Japanese: deferential).
- Word choices that don't translate (e.g., "track" in US English carries casual connotations that don't survive in DE).
- Cultural sensitivities for tone (humor, urgency, apology norms).

Machine translation is a starting point. Native-speaker review against this brief is required before ship.

## Weekly copy audit

Run on the system branch before merging:

- [ ] No remaining placeholder strings (search for `[`, `Lorem`, `TODO:`).
- [ ] Button labels follow verb-first / sentence-case / 20-char rules.
- [ ] No "something went wrong" or "please try again" anywhere.
- [ ] Every error names a path forward.
- [ ] Character limits hold at 390px.
- [ ] Voice consistent across screens (don't be calm here and chirpy there).

Export `/tokens/content-inventory.json` alongside the design token export.

## What good output looks like

- The product reads like a real person wrote it on their best day.
- Errors feel like a coworker telling you what to fix, not a stack trace.
- Buttons say what they do.
- The user always knows what to do next.
