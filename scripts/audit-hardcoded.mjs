#!/usr/bin/env node
/**
 * audit-hardcoded.mjs
 *
 * Enforces CLAUDE.md absolute rule #1: "Never hardcode color or
 * spacing values. Use CSS variables (var(--color-*), var(--space-*))
 * only. No hex codes in components. No px literals for spacing."
 *
 * Scans /app and /components for two violation patterns inside
 * className strings:
 *
 *   1. Arbitrary hex codes — `bg-[#ff0000]`, `text-[#fff]`, etc.
 *   2. px-literal spacing/sizing — `p-[24px]`, `m-[16px]`, `gap-[12px]`,
 *      `w-[200px]`, etc.
 *
 * Allowlist (these surfaces are intentionally hardcoded chrome — see
 * /skills/brand.md): /app/canvas, /app/design-system/ds-shell.tsx,
 * thumbnail blocks in /app/page.tsx.
 *
 * Inline `style={{ width: 390 }}` is JS, not Tailwind, and is allowed —
 * we only police what gets baked into class strings.
 *
 *   node scripts/audit-hardcoded.mjs
 *   node scripts/audit-hardcoded.mjs --json
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SCAN = ["app", "components"].map((d) => resolve(ROOT, d));

/* Files / dirs allowlisted — two reasons:
   1. Dark-chrome design tools (canvas, design-system shell) intentionally
      hardcode their surfaces; that's documented in /skills/brand.md.
   2. /components/ui/* are shadcn primitives. CLAUDE.md absolute rule #3
      says we don't modify their structure — theming happens through
      tokens, not by editing the primitive's default sizes (e.g. the
      1px-hairline separator or 80px-min textarea). */
const ALLOWLIST = [
  "/app/canvas/",
  "/app/prototype/",
  "/app/design-system/ds-shell.tsx",
  /* Home page renders project-tile thumbnails using the same dark canvas
     chrome — same exemption applies. */
  "/app/page.tsx",
  "/components/ui/",
];

const HEX_IN_CLASS = /\b(?:bg|text|border|ring|fill|stroke|from|to|via|outline|decoration|divide|placeholder|caret|accent|shadow)-\[#[0-9a-fA-F]{3,8}\]/g;

const PX_IN_CLASS = /\b(?:p|pt|pr|pb|pl|px|py|m|mt|mr|mb|ml|mx|my|gap|gap-x|gap-y|space-x|space-y|w|h|min-w|min-h|max-w|max-h|inset|top|right|bottom|left|translate-x|translate-y|leading|tracking)-\[\d+(?:\.\d+)?px\]/g;

export function isAllowlisted(file) {
  return ALLOWLIST.some((substring) => file.includes(substring));
}

export function findViolations(src, file) {
  const issues = [];

  /* Find className-attached arbitrary values. Scan only inside
     className="..." or className={`...`} strings to avoid hitting
     example strings inside comments or copy. We do this loosely by
     extracting class-string regions. */
  const classRegions = [
    ...src.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{cn\([^)]*\)\})/g),
    ...src.matchAll(/className=\{(["'`][^"'`]*["'`])\}/g),
  ];
  /* That regex stack is conservative — fall back to scanning the whole
     file for the bracketed-value patterns since arbitrary values appear
     only inside class strings in practice. Lower false-positive risk
     than trying to perfectly extract regions. */

  const hexHits = src.matchAll(HEX_IN_CLASS);
  for (const hit of hexHits) {
    issues.push({
      kind: "hex-in-class",
      match: hit[0],
      file,
    });
  }
  const pxHits = src.matchAll(PX_IN_CLASS);
  for (const hit of pxHits) {
    issues.push({
      kind: "px-in-class",
      match: hit[0],
      file,
    });
  }

  return issues;
}

function walk(dir, ext) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = resolve(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p, ext));
    else if (name.endsWith(ext)) out.push(p);
  }
  return out;
}

function audit() {
  const issues = [];
  for (const dir of SCAN) {
    for (const file of walk(dir, ".tsx")) {
      if (isAllowlisted(file)) continue;
      const src = readFileSync(file, "utf8");
      issues.push(...findViolations(src, file.replace(ROOT + "/", "")));
    }
  }
  return issues;
}

function main() {
  const issues = audit();

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ count: issues.length, issues }, null, 2));
    process.exit(issues.length === 0 ? 0 : 1);
  }

  if (issues.length === 0) {
    console.log("ok: no hardcoded hex or px-literal class values");
    return;
  }

  for (const i of issues) {
    console.error(`✗ [${i.kind}] ${i.file} — ${i.match}`);
  }
  console.error(
    `\n${issues.length} hardcoded value${issues.length === 1 ? "" : "s"} — replace with token classes (bg-action-primary, p-4) or use var(--color-*) inline-style for primitive previews`
  );
  process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
