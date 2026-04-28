# brand.md

> Foundation for all visual work. Read before any UI task.
> **THIS IS A PLACEHOLDER.** Replace every section before building real screens.
> The starter ships using the placeholder name "Acme" in `/components/screens/onboarding/welcome.tsx` so you can see something real on screen. Find-and-replace it with your actual product name when you're ready.

## Identity

- **Product name:** Acme *(placeholder — replace with your product)*
- **Positioning:** [One sentence. Who is this for, what problem, what makes it different.]
- **Personality (3 words):** [e.g., calm, direct, generous]

## Logo

- **SVG path:** `/assets/icons/logo.svg`
- **Min size:** 24px height
- **Clear space:** 1× cap height on all sides
- **Inversions:** Light variant for dark surfaces (`/assets/icons/logo-light.svg`)
- **Don'ts:** Never recolor, distort, rotate, or place on imagery without scrim.

## Typography

**Families**
- Display / Body: `Inter` (loaded via `next/font/google` in `/app/layout.tsx`, variable `--font-sans`)
- Mono: `JetBrains Mono` (loaded via `next/font/google`, variable `--font-mono`)

> Already wired. Replace either family by editing `/app/layout.tsx` and re-running. Never load fonts via raw `<link>` — that defeats subsetting and causes CLS.

**Type scale (px → token → use)**

| Token | px | Line height | Use |
|---|---|---|---|
| `--font-size-display` | 48 | 1.05 | Hero only |
| `--font-size-h1` | 32 | 1.15 | Top of screen |
| `--font-size-h2` | 24 | 1.25 | Section headers |
| `--font-size-h3` | 20 | 1.3 | Subsections, card titles |
| `--font-size-body` | 16 | 1.5 | Default body |
| `--font-size-small` | 14 | 1.45 | Secondary, captions |
| `--font-size-micro` | 12 | 1.4 | Metadata, legal |

**Letter spacing**
- Display + h1: `-0.02em`
- h2/h3: `-0.01em`
- Body: `0`
- Caps + micro: `0.04em`

**Weights**
- Headings: 600
- Body: 400
- UI / buttons: 500

## Color system

**Primitives** (raw — never used directly in UI; live in tokens.css `:root`):

| Token | Hex | Note |
|---|---|---|
| `--color-neutral-0` | `#FFFFFF` | |
| `--color-neutral-50` | `#FAFAFA` | |
| `--color-neutral-100` | `#F4F4F5` | |
| `--color-neutral-200` | `#E4E4E7` | |
| `--color-neutral-400` | `#A1A1AA` | |
| `--color-neutral-600` | `#52525B` | |
| `--color-neutral-800` | `#27272A` | |
| `--color-neutral-900` | `#18181B` | |
| `--color-brand-500` | `#4F46E5` | Primary brand |
| `--color-brand-600` | `#4338CA` | Hover |
| `--color-accent-500` | `#F59E0B` | Warm accent |
| `--color-success-500` | `#10B981` | |
| `--color-danger-500` | `#EF4444` | |

> Replace these with real brand colors before first flow. Re-run a11y token audit after.

**Semantic tokens** (intent-driven; what UI actually references):

- `--color-surface-default` — page background
- `--color-surface-raised` — cards, sheets
- `--color-surface-sunken` — inputs, code blocks
- `--color-text-primary` — body text
- `--color-text-secondary` — captions, metadata
- `--color-text-on-brand` — text on brand background
- `--color-border-subtle` — dividers
- `--color-border-strong` — focus outlines
- `--color-action-primary` — CTAs
- `--color-action-primary-hover`
- `--color-action-danger`
- `--color-feedback-success`
- `--color-feedback-warning`
- `--color-feedback-danger`

## Color proportions per screen

- **Neutral surfaces: ~80%** (backgrounds, cards, inputs)
- **Brand primary: ~10%** (CTAs, key highlights only)
- **Accent / warm: ~10%** (empty states, illustrations, celebrations)

> Rule: if a screen feels colorful, there's too much brand color.

## Accessibility pairs (verified WCAG AA)

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| `--color-text-primary` | `--color-surface-default` | ≥7:1 | Body |
| `--color-text-secondary` | `--color-surface-default` | ≥4.5:1 | Captions |
| `--color-text-on-brand` | `--color-action-primary` | ≥4.5:1 | Buttons |

> All UI must use a verified pair. Run `/skills/a11y.md` token audit before adding new tokens.

## Iconography

- **Library:** Lucide (`lucide-react`)
- **Stroke weight:** 1.5px
- **Sizes:** 16, 20, 24
- **Color:** inherit `currentColor` (never hardcoded)

## Illustration style

[TBD — describe palette, line style, character treatment, or "no illustrations yet".]

## Photography direction

[TBD — describe subject, lighting, color grading, framing — or "no photography yet".]

## Motion

- **Default duration:** 150ms
- **Default easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- **Long transitions** (route changes, modals): 200ms max
- **Hover/tap feedback:** 100ms
- **Always add `prefers-reduced-motion`** override that drops to 0ms (or replaces transform with opacity only).

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## What good output looks like

- Headlines breathe (line-height 1.1–1.2; ample top margin).
- One primary CTA per view; secondary actions are text or ghost-style.
- Cards use `--color-surface-raised` with `--color-border-subtle`, no shadow.
- All text passes contrast on its surface — both light and dark mode.
- Mobile (390px) is the design width; desktop is a wider variant of the same layout.

## What bad output looks like

- Default shadcn blue still showing through.
- Brand color used as decoration (filled card backgrounds, big swathes).
- Multiple competing CTAs.
- Text-on-image without scrim.
- Border-radius inconsistent within the same screen.
