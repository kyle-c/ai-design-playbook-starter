#!/usr/bin/env node
/**
 * build-changelog.mjs — regenerates /decisions/CHANGELOG.md from log.json.
 *
 * Run:  npm run changelog
 * Also runs as part of `npm run check` so the file can never drift.
 *
 * Format: most recent week first, entries grouped by ISO week number.
 * Each entry: `### \`<type>\` <title>` followed by the rationale.
 *
 * The CHANGELOG.md is committed (per /skills/decisions.md) so designers
 * can read history without running the build. The check pipeline diffs
 * the regenerated file against the committed copy and fails if they drift.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_PATH = resolve(__dirname, "..", "decisions", "log.json");
const OUT_PATH = resolve(__dirname, "..", "decisions", "CHANGELOG.md");

/* ------------------------------------------------------------------ build */

function isoWeekStart(dateStr) {
  /* Returns the Monday of the ISO week containing `dateStr`, as YYYY-MM-DD.
     Used to bucket entries into "Week of <Monday>" sections. */
  const d = new Date(dateStr + "T00:00:00Z");
  const day = d.getUTCDay() || 7; /* Sun=0 → 7 */
  d.setUTCDate(d.getUTCDate() - (day - 1));
  return d.toISOString().slice(0, 10);
}

function build(log) {
  const entries = (log.entries || []).slice();
  /* Most recent first by id (which is YYYY-MM-DD-NNN, sortable). */
  entries.sort((a, b) => b.id.localeCompare(a.id));

  const groups = new Map();
  for (const e of entries) {
    const week = isoWeekStart(e.date);
    if (!groups.has(week)) groups.set(week, []);
    groups.get(week).push(e);
  }

  const lines = [
    "# Changelog",
    "",
    "> Auto-regenerated from `/decisions/log.json` by `npm run changelog`.",
    "> Do not edit by hand — your edits will be overwritten.",
    "",
  ];

  const weeks = [...groups.keys()].sort().reverse();
  for (const week of weeks) {
    lines.push(`## Week of ${week}`);
    lines.push("");
    for (const e of groups.get(week)) {
      const supSuffix =
        e.status === "superseded"
          ? " ⚠ superseded"
          : e.status === "reversed"
            ? " ⚠ reversed"
            : "";
      lines.push(`### \`${e.type}\` ${e.title}${supSuffix}`);
      lines.push(e.rationale);
      lines.push("");
    }
  }

  return lines.join("\n").replace(/\n+$/, "\n");
}

/* ----------------------------------------------------------------- main */

function main() {
  const raw = readFileSync(LOG_PATH, "utf8");
  let log;
  try {
    log = JSON.parse(raw);
  } catch (e) {
    console.error(`build-changelog: log.json is invalid JSON (${e.message})`);
    process.exit(2);
  }

  const out = build(log);

  /* Check mode: --check exits non-zero if the file would change. Used by CI
     to detect drift between log.json and the committed CHANGELOG.md. */
  if (process.argv.includes("--check")) {
    let current = "";
    try {
      current = readFileSync(OUT_PATH, "utf8");
    } catch {
      /* ignore — will appear as a diff */
    }
    if (current !== out) {
      console.error(
        "build-changelog: /decisions/CHANGELOG.md is stale. Run `npm run changelog` and commit."
      );
      process.exit(1);
    }
    return;
  }

  writeFileSync(OUT_PATH, out);
  console.log(`wrote ${OUT_PATH.replace(process.cwd() + "/", "")}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { build, isoWeekStart };
