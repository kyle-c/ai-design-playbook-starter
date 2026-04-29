/**
 * Drift-detection helper for `--check` modes of build scripts.
 *
 * Compares two JSON-output strings, ignoring the `$generated`
 * timestamp line and any trailing whitespace. Without this,
 * regenerating an unchanged file on a different day looks like
 * drift.
 *
 * Used by:
 *   scripts/build-tokens.mjs            (--check)
 *   scripts/build-content-inventory.mjs (--check)
 */
export function compareIgnoringGenerated(existing, fresh) {
  const norm = (s) =>
    s.replace(/"\$generated":\s*"[^"]+",?\s*\n/, "").replace(/\s+$/, "");
  return norm(existing) === norm(fresh);
}
