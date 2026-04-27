#!/usr/bin/env node
/**
 * audit-tokens.mjs
 *
 * Reads /styles/tokens.css, resolves CSS-variable chains for light + dark,
 * and computes WCAG 2.1 contrast ratios for the canonical foreground /
 * background pairs in the semantic layer.
 *
 * Exits non-zero on AA failure so CI can use it as a gate.
 *
 *   node scripts/audit-tokens.mjs
 *   node scripts/audit-tokens.mjs --json
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_PATH = resolve(__dirname, "..", "styles", "tokens.css");

const PAIRS = [
  /* Foreground, background, label, target ratio */
  ["--color-text-primary",   "--color-surface-default", "Body text on default surface",      4.5],
  ["--color-text-primary",   "--color-surface-raised",  "Body text on raised surface",       4.5],
  ["--color-text-primary",   "--color-surface-sunken",  "Body text on sunken surface",       4.5],
  ["--color-text-secondary", "--color-surface-default", "Secondary text on default surface", 4.5],
  ["--color-text-secondary", "--color-surface-raised",  "Secondary text on raised surface",  4.5],
  ["--color-text-tertiary",  "--color-surface-default", "Tertiary text on default surface",  3.0], // large/UI only
  ["--color-text-on-brand",  "--color-action-primary",  "Text on primary action",            4.5],
  ["--color-text-on-brand",  "--color-action-danger",   "Text on danger action",             4.5],
  ["--color-border-focus",   "--color-surface-default", "Focus ring on default surface",     3.0],
];

/* ------------------------------------------------------------------ parse */

function parseBlocks(css) {
  /** Return { ":root": Map, "[data-theme=\"dark\"]": Map } */
  const blocks = {};
  const re = /(:root|\[data-theme="dark"\])\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const selector = m[1];
    const body = m[2];
    const map = blocks[selector] || new Map();
    const declRe = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let d;
    while ((d = declRe.exec(body))) {
      map.set(d[1].trim(), d[2].trim());
    }
    blocks[selector] = map;
  }
  return blocks;
}

function resolve_(name, vars) {
  let value = vars.get(name);
  if (!value) return undefined;
  /* follow var(--x) chains, max 16 hops (cycle guard) */
  for (let i = 0; i < 16; i++) {
    const ref = value.match(/^var\((--[\w-]+)\)$/);
    if (!ref) return value;
    const next = vars.get(ref[1]);
    if (!next) return undefined;
    value = next;
  }
  return undefined;
}

/* ----------------------------------------------------------------- color */

function hexToRgb(hex) {
  const s = hex.replace("#", "").trim();
  const v =
    s.length === 3
      ? s.split("").map((c) => c + c).join("")
      : s;
  if (v.length !== 6) return null;
  const n = parseInt(v, 16);
  if (Number.isNaN(n)) return null;
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function relativeLuminance([r, g, b]) {
  const ch = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}

function contrast(rgbA, rgbB) {
  const la = relativeLuminance(rgbA);
  const lb = relativeLuminance(rgbB);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/* ------------------------------------------------------------------ run */

function audit(theme, vars) {
  const rows = [];
  for (const [fg, bg, label, target] of PAIRS) {
    const fgVal = resolve_(fg, vars);
    const bgVal = resolve_(bg, vars);
    const fgRgb = fgVal && hexToRgb(fgVal);
    const bgRgb = bgVal && hexToRgb(bgVal);
    if (!fgRgb || !bgRgb) {
      rows.push({
        theme,
        label,
        fg,
        bg,
        ratio: null,
        target,
        pass: false,
        error: !fgVal
          ? `unresolved ${fg}`
          : !bgVal
            ? `unresolved ${bg}`
            : `non-hex value (${!fgRgb ? fgVal : bgVal})`,
      });
      continue;
    }
    const ratio = contrast(fgRgb, bgRgb);
    rows.push({
      theme,
      label,
      fg,
      bg,
      ratio: Math.round(ratio * 100) / 100,
      target,
      pass: ratio >= target,
    });
  }
  return rows;
}

function fmt(rows) {
  const dim = (s) => `\x1b[2m${s}\x1b[22m`;
  const red = (s) => `\x1b[31m${s}\x1b[0m`;
  const green = (s) => `\x1b[32m${s}\x1b[0m`;
  const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

  let lines = [];
  let lastTheme = "";
  for (const r of rows) {
    if (r.theme !== lastTheme) {
      lines.push("");
      lines.push(`\x1b[1m${r.theme}\x1b[0m`);
      lastTheme = r.theme;
    }
    if (r.error) {
      lines.push(`  ${yellow("⚠")}  ${r.label}  ${dim(r.error)}`);
    } else {
      const mark = r.pass ? green("✓") : red("✗");
      const ratioStr = `${r.ratio.toFixed(2)}:1`;
      const targetStr = dim(`(target ${r.target}:1)`);
      lines.push(`  ${mark}  ${r.label.padEnd(40)} ${ratioStr.padStart(8)} ${targetStr}`);
    }
  }
  return lines.join("\n");
}

/* ---------------------------------------------------------------- main */

const args = process.argv.slice(2);
const asJson = args.includes("--json");

const css = readFileSync(TOKENS_PATH, "utf8");
const blocks = parseBlocks(css);
const root = blocks[":root"];
const dark = blocks['[data-theme="dark"]'];

if (!root) {
  console.error("Could not find :root block in tokens.css.");
  process.exit(2);
}

const lightVars = root;
const darkVars = new Map(root); /* dark inherits, then overrides */
if (dark) for (const [k, v] of dark) darkVars.set(k, v);

const lightRows = audit("Light theme", lightVars);
const darkRows = audit("Dark theme", darkVars);
const all = [...lightRows, ...darkRows];

if (asJson) {
  console.log(JSON.stringify(all, null, 2));
} else {
  console.log(fmt(all));
  console.log("");
  const failed = all.filter((r) => !r.pass).length;
  const errored = all.filter((r) => r.error).length;
  const passed = all.filter((r) => r.pass).length;
  console.log(
    `${passed} passed, ${failed - errored} failed, ${errored} unresolved (of ${all.length})`
  );
}

process.exit(all.some((r) => !r.pass) ? 1 : 0);
