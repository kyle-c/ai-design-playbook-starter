# components.md

> Component library documentation. Updated as the system grows.
> **PHASE 1: Mostly empty. Filled in as flows are built.**

## Layers

We have three layers of components — never mix them.

### 1. UI primitives (`/components/ui/*`)
Untouched-structure shadcn components. Themed exclusively through `tokens.css`.

- `button.tsx` — primary, secondary, ghost, destructive variants
- `card.tsx` — header, content, footer subcomponents
- `input.tsx` — text input + label association

> **Rule:** If you need to change behavior, do NOT edit these. Compose them in a feature component (layer 2 or 3).

### 2. Composite components (`/components/placeholder/*`)
Product-specific compositions. Each one combines primitives + tokens for a specific recurring pattern.

> **Phase 1: empty.** Will be populated as flows are built (e.g., `EmptyState`, `FlowHeader`, `FormRow`).

### 3. Feature screens (`/app/[route]/*`)
Whole screens for actual flows. May import composites and primitives.

> **Phase 1: empty.** Will be populated starting Week 2.

## Naming

- **PascalCase** filenames for components: `EmptyState.tsx`.
- **kebab-case** for routes: `/app/sign-up/page.tsx`.
- **Variant prop names** match shadcn conventions: `variant`, `size`, `tone`.

## When to extract a composite

Extract when:
- The same combination appears 3+ times.
- Two screens drift apart and you want to enforce parity.
- A team member would otherwise reinvent it.

Don't extract when:
- It's a one-off layout.
- The "shared" pattern is actually just two things that look similar but have different purposes.

> Premature abstraction is worse than copy-paste. Wait for the third use.

## How to add a new composite

1. Build it inline in the screen first (proof it's needed).
2. Identify the second usage; build it inline again, intentionally similar.
3. On the third usage, extract — and **delete** the inline copies in the same PR.
4. Document here: name, purpose, where it's used, any non-obvious props.

## Patterns to enforce as the system grows

These will become canonical components after their second occurrence:

- **Empty state** — illustration + headline + body + CTA
- **Flow header** — back arrow + step count + title
- **Form row** — label + input + helper text + error
- **Confirmation sheet** — icon + headline + body + primary + secondary
- **Toast** — icon + message + optional action
- **Loading skeleton** — reduced-motion-safe placeholder

## Documentation template

When adding a new composite, append a section here:

```markdown
### EmptyState
**File:** `/components/placeholder/empty-state.tsx`
**Purpose:** Shown when a list, detail view, or section has no content yet.
**Props:** `icon`, `title`, `body`, `action` (optional)
**Used in:** `/app/inbox`, `/app/library`
**Notes:** Always include a CTA — never a dead-end empty state. See `/skills/copy.md` for empty-state tone.
```

## What good output looks like

- New screens compose existing primitives + composites; rarely need to build from scratch.
- Diffing two screens with the same pattern shows identical structure.
- Removing a component from `/components/placeholder` causes screens to break (proves it's actually used).
