#!/usr/bin/env node
/**
 * new-flow.mjs — scaffold a new flow.
 *
 *   npm run new-flow -- <flow-id> <screen,screen,screen>
 *
 * Creates:
 *   /components/screens/<flow-id>/<screen>.tsx     (one file per screen)
 *   adds imports + flow entry to /app/flows.config.ts (via AUTOFLOWS markers)
 *   adds locale entries to /locales/en.json
 *
 * Idempotent: refuses to overwrite an existing flow directory or duplicate
 * a flow id in flows.config.ts.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

/* ----------------------------------------- helpers (exported for tests) */

export function pascal(id) {
  return id
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

export function camel(id) {
  const p = pascal(id);
  return p.charAt(0).toLowerCase() + p.slice(1);
}

export function titleCase(id) {
  /* "danger-zone" → "Danger zone" */
  const words = id.split("-");
  return words
    .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/* ---------------------------------------------------------------- main */

function fail(msg) {
  console.error(`new-flow: ${msg}`);
  process.exit(1);
}

function rel(p) {
  return p.replace(ROOT + "/", "");
}

function screenSource(flowId, screenId) {
  const compName = `${pascal(screenId)}Screen`;
  const localeKey = camel(screenId);
  return `"use client";

import en from "@/locales/en.json";

const t = en.${camel(flowId)}.${localeKey};

export function ${compName}() {
  return (
    <div className="flex h-full w-full flex-col bg-surface-default">
      <header className="px-6 pb-2 pt-12">
        <h1 className="text-h1 font-semibold tracking-snug text-text-primary">
          {t.headline}
        </h1>
        <p className="mt-3 text-body text-text-secondary">{t.body}</p>
      </header>

      {/* Replace this placeholder with the real layout. See
          /components/screens/onboarding/welcome.tsx for the full pattern. */}
    </div>
  );
}
`;
}

function buildImportLines(flowId, screenIds) {
  return screenIds
    .map(
      (s) =>
        `import { ${pascal(s)}Screen } from "@/components/screens/${flowId}/${s}";`
    )
    .join("\n");
}

function buildFlowEntry(flowId, screenIds) {
  /* No baseline indent — the regex in patchFlowsConfig captures the marker's
     leading whitespace and prepends it to each line we return. */
  const lines = [
    `{`,
    `  id: "${flowId}",`,
    `  label: "${titleCase(flowId)}",`,
    `  screens: [`,
  ];
  for (const s of screenIds) {
    lines.push(
      `    { id: "${s}", label: "${titleCase(s)}", Component: ${pascal(s)}Screen },`
    );
  }
  lines.push(`  ],`);
  lines.push(`},`);
  return lines.join("\n");
}

function patchFlowsConfig(flowsConfigPath, flowId, screenIds) {
  const src = readFileSync(flowsConfigPath, "utf8");

  if (src.includes(`id: "${flowId}"`)) {
    fail(`flows.config.ts already references id "${flowId}"`);
  }

  const importRe = /^(\s*)\/\* AUTOFLOWS:IMPORTS[^\n]*$/m;
  const entryRe = /^(\s*)\/\* AUTOFLOWS:ENTRIES[^\n]*$/m;
  if (!importRe.test(src) || !entryRe.test(src)) {
    fail(
      "flows.config.ts is missing AUTOFLOWS markers. Restore them or add manually."
    );
  }

  const withImports = src.replace(importRe, (match, indent) => {
    const lines = buildImportLines(flowId, screenIds)
      .split("\n")
      .map((l) => indent + l)
      .join("\n");
    return `${lines}\n${match}`;
  });

  const withEntry = withImports.replace(entryRe, (match, indent) => {
    const lines = buildFlowEntry(flowId, screenIds)
      .split("\n")
      .map((l) => (l ? indent + l : l))
      .join("\n");
    return `${lines}\n${match}`;
  });

  writeFileSync(flowsConfigPath, withEntry);
}

function patchLocales(localesPath, flowId, screenIds) {
  const raw = readFileSync(localesPath, "utf8");
  const json = JSON.parse(raw);
  const flowKey = camel(flowId);

  if (json[flowKey]) {
    fail(`locales/en.json already has key "${flowKey}"`);
  }

  json[flowKey] = {};
  for (const s of screenIds) {
    json[flowKey][camel(s)] = {
      headline: `${titleCase(s)} headline`,
      body: "Replace this placeholder copy with the real string.",
    };
  }

  writeFileSync(localesPath, JSON.stringify(json, null, 2) + "\n");
}

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  if (args.length < 2) {
    fail(
      "usage: npm run new-flow -- <flow-id> <screen-id,screen-id,...>\n" +
        'example: npm run new-flow -- checkout "address,payment,review,confirm"'
    );
  }

  const flowId = args[0].trim();
  const screenIds = args[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!/^[a-z][a-z0-9-]*$/.test(flowId)) {
    fail(`flow id must be lowercase, dashes allowed: got "${flowId}"`);
  }
  if (screenIds.length === 0) fail("at least one screen id is required");
  for (const s of screenIds) {
    if (!/^[a-z][a-z0-9-]*$/.test(s)) {
      fail(`screen id must be lowercase, dashes allowed: got "${s}"`);
    }
  }

  const flowDir = join(ROOT, "components", "screens", flowId);
  const flowsConfigPath = join(ROOT, "app", "flows.config.ts");
  const localesPath = join(ROOT, "locales", "en.json");

  if (existsSync(flowDir)) fail(`directory already exists: ${rel(flowDir)}`);

  mkdirSync(flowDir, { recursive: true });
  for (const s of screenIds) {
    const path = join(flowDir, `${s}.tsx`);
    writeFileSync(path, screenSource(flowId, s));
    console.log(`  created  ${rel(path)}`);
  }

  patchFlowsConfig(flowsConfigPath, flowId, screenIds);
  console.log(`  patched  app/flows.config.ts`);

  patchLocales(localesPath, flowId, screenIds);
  console.log(`  patched  locales/en.json`);

  console.log(`
Done. Next:
  1. Open /canvas — the new flow should appear in the sidebar.
  2. Replace placeholder copy in locales/en.json under "${camel(flowId)}".
  3. Replace the placeholder layouts in components/screens/${flowId}/*.tsx.
  4. Log the decision in /decisions/log.json.`);
}

/* Run only when invoked directly (skip when imported by tests). */
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
