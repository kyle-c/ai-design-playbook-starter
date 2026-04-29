#!/usr/bin/env node
/**
 * build-content-inventory.mjs
 *
 * Reads /locales/*.json and emits /tokens/content-inventory.json — a
 * flat list of every user-facing string with its key path, character
 * count, locale, and example context (the parent key chain).
 *
 * Drives the article's "every user-facing string with context" bullet
 * and is consumed by /scripts/audit-copy.mjs to check character limits.
 *
 *   node scripts/build-content-inventory.mjs
 *   node scripts/build-content-inventory.mjs --check
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, basename } from "node:path";
import { compareIgnoringGenerated } from "./lib/drift.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = resolve(__dirname, "..", "locales");
const OUT = resolve(__dirname, "..", "tokens", "content-inventory.json");

function flatten(node, prefix = []) {
  if (typeof node === "string") {
    return [{ key: prefix.join("."), text: node }];
  }
  if (node && typeof node === "object") {
    return Object.entries(node)
      .filter(([k]) => !k.startsWith("$"))
      .flatMap(([k, v]) => flatten(v, [...prefix, k]));
  }
  return [];
}

function inventoryFor(localeFile) {
  const locale = basename(localeFile, ".json");
  const json = JSON.parse(readFileSync(localeFile, "utf8"));
  return flatten(json).map(({ key, text }) => ({
    locale,
    key,
    text,
    chars: text.length,
    context: key.split(".").slice(0, -1).join(" › ") || locale,
  }));
}

function build() {
  const files = readdirSync(LOCALES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => resolve(LOCALES_DIR, f))
    .sort();

  const items = files.flatMap(inventoryFor);

  return {
    $description:
      "Auto-generated. Every user-facing string in /locales/*.json with key, char count, and context. Regenerate with `npm run content:inventory`.",
    $generated: new Date().toISOString().slice(0, 10),
    locales: Array.from(new Set(items.map((i) => i.locale))),
    count: items.length,
    items,
  };
}

function main() {
  const check = process.argv.includes("--check");
  const inventory = build();
  const out = JSON.stringify(inventory, null, 2);

  if (check) {
    let existing = "";
    try {
      existing = readFileSync(OUT, "utf8");
    } catch {
      existing = "";
    }
    if (!compareIgnoringGenerated(existing, out)) {
      console.error(
        "drift: /tokens/content-inventory.json is out of date with /locales — run `npm run content:inventory`"
      );
      process.exit(1);
    }
    console.log(`ok: content inventory up to date (${inventory.count} strings)`);
    return;
  }

  writeFileSync(OUT, out + "\n");
  console.log(`wrote /tokens/content-inventory.json (${inventory.count} strings)`);
}

main();
