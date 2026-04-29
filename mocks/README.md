# Mocks

Mock data for screens that consume real shapes. Lets designers build the UI without
backend readiness — and forces the boundary between "what data does the screen need"
and "where does that data come from" to stay sharp.

## The convention

1. **Screens take props, never fetch.** A screen component declares the shape it
   needs; the parent (a route, a story, or a real container in production) supplies it.
2. **Mocks live as JSON.** `/mocks/<domain>.json` holds the realistic-but-fake data.
   Keep them small (5–10 rows) and varied (cover the edges from `/skills/data-shapes.md`,
   not just the happy path).
3. **Imports are static.** `import user from "@/mocks/user.json"` — no fetch, no
   network, no flake. The TS compiler verifies the shape.
4. **No mock data ships.** When the screen ships, the parent is rewritten to fetch
   real data; the mock JSON stays in `/mocks` for canvas / prototype views and tests.
5. **Schema mirrors `/skills/data-shapes.md`.** When that file changes, the mock JSON
   has to change too — engineering's review of either change should catch the other.

## Anatomy

```
/mocks
  README.md           — this file
  user.json           — one object, the signed-in user
  notifications.json  — list of notification preferences
  …                   — one file per domain shape
```

## Edges to cover

For each shape, include rows that exercise:

- **Null / nullable fields** (e.g. user mid-onboarding without a `name`)
- **Empty collections** (a user with `flags: {}`)
- **Long strings** (worst-case for layout and char limits)
- **Boundary values** (the user with the rate-limit error in `/skills/data-shapes.md`)

If a shape has fewer than 4 mock rows, you're probably not covering the edges.

## When to delete a mock

When the engineering repo's seed data covers the same shape and is reachable from this
repo (e.g. a Storybook MSW handler or a staging API), the mock here can be deleted.
Don't keep both — they drift.
