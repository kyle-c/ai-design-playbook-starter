# decisions.md

> How and when to log a decision. Read before consolidating patterns or making token changes.

## What counts as a decision

Log it if it would surprise someone reading the code in 3 months. Specifically:

- **Token additions, renames, or hex changes.**
- **New composite components extracted.**
- **Pattern consolidation** (two divergent treatments merged into one canonical component).
- **Escalations / exceptions** (a budget breach, a guideline waived, a workaround).
- **Library decisions** (chose X over Y; documented why).
- **Removed features or screens** (so we don't accidentally rebuild them later).
- **Naming choices** that aren't obvious.

Not a decision: trivial fixes, cosmetic tweaks, normal feature work.

## Format

Append entries to `/decisions/log.json`. Schema:

```json
{
  "id": "2026-04-27-001",
  "date": "2026-04-27",
  "type": "token | component | pattern | escalation | library | removal | naming",
  "title": "Short imperative phrase",
  "rationale": "Why this and not the alternatives. 2-4 sentences.",
  "alternatives": ["What else we considered, briefly"],
  "affected_files": ["/styles/tokens.css", "/components/ui/button.tsx"],
  "status": "active | superseded | reversed",
  "supersedes": ["2026-03-12-004"],
  "links": ["https://github.com/.../pull/42"]
}
```

ID format: `YYYY-MM-DD-NNN` where NNN is a zero-padded sequence within the day.

## When to log

- **At decision time, not later.** A retrospective entry from memory is worth half as much.
- Always include rationale. "Because the designer said so" is not a rationale; "because users tested confused two CTAs side-by-side" is.
- If you reverse a previous decision, set the old entry's `status: "superseded"` and link via `supersedes`.

## Weekly changelog generation

`/decisions/CHANGELOG.md` is **auto-generated** from `log.json` by `npm run changelog`. Don't edit it by hand — your edits will be overwritten.

The check pipeline (`npm run check`) runs `npm run changelog:check`, which fails CI if the committed CHANGELOG drifts from what `log.json` would produce. So the workflow is:

1. Add an entry to `log.json`.
2. Run `npm run changelog`.
3. Commit both files together.

## Querying decision history

The log becomes more valuable with time. Ask Claude to reason over it:

> "Read `/decisions/log.json`. Find every decision about form patterns. Are any in conflict?"

> "We're about to change the spacing scale. Read the log and flag any past decisions that assumed the current scale — those need re-evaluating."

> "Summarize what we've changed in the color system over the last 90 days."

## What good output looks like

- 3 months in, a new team member reads `CHANGELOG.md` and understands why the system is the way it is.
- No "lost" decisions in Slack DMs.
- Reversed decisions are visible (not silently overwritten).
- Every escalation has an expiry or revisit date.

## What bad output looks like

- "Updated color." (No rationale; useless.)
- A decision logged 3 weeks after it was made (memory has decayed).
- Multiple entries describing the same change (duplicate or update, don't append).
