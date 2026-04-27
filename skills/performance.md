# performance.md

> Read before adding dependencies, images, or new routes.

## Budget

| Metric | Target | Hard cap (blocks merge) |
|---|---|---|
| JS bundle (per route, gzipped) | < 150kb | 200kb |
| CSS bundle (gzipped) | < 30kb | 50kb |
| LCP (4G mobile) | < 2.0s | 2.5s |
| CLS | < 0.05 | 0.1 |
| TTI (mid-range device) | < 3.0s | 3.5s |
| INP | < 150ms | 200ms |

## Images

- Format: **WebP or AVIF only.** No raw PNG/JPG in `/public`.
- Max **200kb per image asset.** Hero images allowed up to 400kb if AVIF.
- Always set explicit `width` and `height` (prevents CLS).
- Use `next/image`. Do not use raw `<img>` for content images.
- Lazy load anything below the fold (`loading="lazy"` is automatic with next/image).
- Decorative images: `alt=""` AND `aria-hidden="true"`.

## Fonts

- Self-host via `next/font` (woff2, subset to used characters).
- Max 2 families, max 4 weights total across the system.
- Variable fonts preferred (one file, many weights).
- `font-display: swap` always.

## Dependencies

Before adding any package:

1. Search `/components` and `/app` to confirm no existing solution.
2. Check bundle size at [bundlephobia.com](https://bundlephobia.com).
3. If > 30kb gzipped, search for a lighter alternative.
4. Document the choice in `/decisions/log.json`.

Reject:
- Anything that overlaps with shadcn/ui or Tailwind utilities.
- "Kitchen sink" libraries when one component would do.
- Date utilities heavier than `date-fns` (and prefer native `Intl.DateTimeFormat` first).

## Audit cadence

Run **before every weekly merge** to main:

```bash
# bundle analysis
ANALYZE=true npm run build

# unused dependency scan
npx depcheck

# image audit
npx next-image-audit  # or manual: find ./public -name "*.png" -o -name "*.jpg"
```

Then ask Claude:

> "Audit the build output. Flag any route over 200kb gzipped, any unused dependency, any duplicated functionality (e.g., two date libraries), and any image over 200kb. List as a checklist."

## Things to flag

- Route segment > 200kb gzipped.
- A dependency in `package.json` with no matching import.
- Two libraries doing the same job (e.g., axios + fetch wrapper, lodash + ramda).
- Inline styles duplicating token values.
- Hardcoded colors/spacing (search for `#`, `px`, `rgb`, `rgba` in `.tsx` files).
- Client components that could be server components.
- `'use client'` at the top of files that could push the boundary lower.

## Server vs client

Default to **server components.** Mark `'use client'` only for:
- Interactivity (onClick, onChange, useState, useEffect).
- Browser-only APIs (window, navigator, IntersectionObserver).
- Third-party libs that require it.

Push the `'use client'` boundary as deep as possible. A page can be a server component that imports a small client island.

## Caching

- Static assets: long cache, immutable filenames (Next.js handles this).
- API routes: appropriate `Cache-Control` headers — never `no-store` by default.
- Use `revalidate` and `revalidateTag` for ISR over manual fetching where possible.

## Exceptions

If a budget is breached:
1. Try to fix it (lazy load, dynamic import, code split).
2. If unfixable, log to `/decisions/log.json` with rationale and expiry date.
3. Re-evaluate at next monthly audit.

## What good output looks like

- New route added; bundle delta is < 10kb.
- LCP unchanged after a feature merges.
- `depcheck` returns clean.
- No raw `<img>` or hex colors anywhere in the diff.
