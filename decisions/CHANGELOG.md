# Changelog

> Auto-regenerated from `/decisions/log.json` by `npm run changelog`.
> Do not edit by hand — your edits will be overwritten.

## Week of 2026-04-27

### `token` Add 700-ramp primitives + brand-400; fix component-state contrast failures
Extending /skills/audit-tokens to component-state pairs surfaced 7 real failures: feedback chip text on tinted backgrounds (success/warning/danger fg on bg ~3:1 vs target 4.5:1) and dark-mode focus ring on raised surfaces (2.82:1 vs target 3:1). Added success-700, accent-700, danger-700, brand-400 primitives. Remapped feedback fg tokens to the 700 ramp. Overrode --color-border-focus to brand-400 in dark mode. All 34 pairs now pass.

### `token` Map --color-action-danger to danger-600 (not 500) for AA contrast
White text on danger-500 (#EF4444) yielded 3.76:1 in `npm run tokens:audit` — fails WCAG AA for normal text. danger-600 (#DC2626) yields 4.83:1 and passes. Hover state moved to danger-500 for the brighter feedback. Fixed at the semantic layer; primitives unchanged.

### `token` Placeholder color primitives — replace before first flow
Initial brand palette uses Tailwind/Zinc neutrals + Indigo as a generic-but-WCAG-passing baseline. Real product identity must replace these before any user-facing screens are built; the token-level a11y audit must be re-run after.

### `library` Adopt AI Design Playbook structure
Codebase as single source of truth eliminates the Figma-to-code translation layer. Skill files persist context across Claude sessions; tokens.css enforces consistency at the system level rather than per-component.
