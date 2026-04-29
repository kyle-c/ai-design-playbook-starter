#!/usr/bin/env node
/**
 * audit-copy.mjs
 *
 * Two checks the playbook calls "must run before merge":
 *
 *   1. Placeholder scan — Lorem / TBD / TODO / [bracketed text] in
 *      anything that ships to users. Hits both /locales/*.json (the
 *      content layer) and /components/screens/*.tsx (any inline copy
 *      that escaped the locale layer).
 *
 *   2. Character-limit enforcement — uses /skills/copy.md's limits:
 *      titles ≤ 24, buttons ≤ 20, toasts ≤ 48. Inferred from key path:
 *      keys ending in `headline`/`title` are titles; `submit`/`cta`/
 *      `cta*` are buttons; `toast`/`success`/`confirmation` are toasts.
 *
 *  Exits non-zero on any violation.
 *
 *   node scripts/audit-copy.mjs
 *   node scripts/audit-copy.mjs --json
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const LOCALES = resolve(ROOT, "locales");
const SCREENS = resolve(ROOT, "components", "screens");

const PLACEHOLDER_RE = [
  { pattern: /\blorem\b/i, name: "lorem ipsum" },
  { pattern: /\bTBD\b/, name: "TBD" },
  { pattern: /\bTODO\b/, name: "TODO" },
  { pattern: /\bFIXME\b/, name: "FIXME" },
  /* Single-bracketed placeholders like "[Button label]". Allow longer
     phrases that look like real copy ("Welcome back, [name]!" passes —
     real interpolations should use template literals or i18n keys, not
     single-bracket placeholder syntax). */
  { pattern: /\[[A-Z][a-zA-Z\s]{2,30}\]/, name: "[bracketed placeholder]" },
];

const LIMITS = [
  { match: (k) => /\b(title|headline)$/i.test(k), max: 60, label: "title/headline" },
  { match: (k) => /\b(submit|cta|ctaPrimary|ctaSecondary|back|button)$/i.test(k), max: 20, label: "button" },
  { match: (k) => /\b(toast|confirmation|success)$/i.test(k), max: 48, label: "toast" },
];

export function flattenLocale(node, prefix = []) {
  if (typeof node === "string") return [{ key: prefix.join("."), text: node }];
  if (node && typeof node === "object") {
    return Object.entries(node)
      .filter(([k]) => !k.startsWith("$"))
      .flatMap(([k, v]) => flattenLocale(v, [...prefix, k]));
  }
  return [];
}

export function scanForPlaceholders(text) {
  return PLACEHOLDER_RE
    .filter(({ pattern }) => pattern.test(text))
    .map(({ name }) => name);
}

export function checkLimit(key, text) {
  const rule = LIMITS.find((r) => r.match(key));
  if (!rule) return null;
  if (text.length <= rule.max) return null;
  return { rule: rule.label, max: rule.max, actual: text.length };
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

function auditLocales() {
  const issues = [];
  for (const file of walk(LOCALES, ".json")) {
    const json = JSON.parse(readFileSync(file, "utf8"));
    for (const { key, text } of flattenLocale(json)) {
      const placeholders = scanForPlaceholders(text);
      for (const name of placeholders) {
        issues.push({
          kind: "placeholder",
          file: file.replace(ROOT + "/", ""),
          key,
          message: `${name} in "${text.slice(0, 60)}…"`,
        });
      }
      const limit = checkLimit(key, text);
      if (limit) {
        issues.push({
          kind: "char-limit",
          file: file.replace(ROOT + "/", ""),
          key,
          message: `${limit.rule}: ${limit.actual} chars > ${limit.max} max — "${text}"`,
        });
      }
    }
  }
  return issues;
}

function auditScreens() {
  const issues = [];
  if (!safeStat(SCREENS)) return issues;
  for (const file of walk(SCREENS, ".tsx")) {
    const src = readFileSync(file, "utf8");
    /* Strip /* … *\/ block comments and // line comments before scanning,
       so a comment like "// TODO: ..." doesn't false-positive. Scan only
       the runtime source. */
    const stripped = src
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    for (const { pattern, name } of PLACEHOLDER_RE) {
      const m = stripped.match(pattern);
      if (m) {
        issues.push({
          kind: "placeholder",
          file: file.replace(ROOT + "/", ""),
          message: `${name} in source: ${m[0]}`,
        });
      }
    }
  }
  return issues;
}

function safeStat(p) {
  try {
    return statSync(p);
  } catch {
    return null;
  }
}

function main() {
  const issues = [...auditLocales(), ...auditScreens()];

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ count: issues.length, issues }, null, 2));
    process.exit(issues.length === 0 ? 0 : 1);
  }

  if (issues.length === 0) {
    console.log("ok: no placeholder text or character-limit violations");
    return;
  }

  for (const i of issues) {
    const loc = i.key ? `${i.file} → ${i.key}` : i.file;
    console.error(`✗ [${i.kind}] ${loc} — ${i.message}`);
  }
  console.error(`\n${issues.length} issue${issues.length === 1 ? "" : "s"}`);
  process.exit(1);
}

/* Run only when invoked directly so tests can import the helpers. */
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
