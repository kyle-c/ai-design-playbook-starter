#!/usr/bin/env node
/**
 * build-tokens.mjs
 *
 * Reads /tokens/design-tokens.json (W3C DTCG, the canonical web export)
 * and emits two platform-specific siblings:
 *
 *   /tokens/design-tokens.ios.json     — dimensions in pt
 *   /tokens/design-tokens.android.json — dimensions in dp/sp
 *
 * Color values pass through unchanged. Dimensions convert from rem
 * (the web source) to a numeric value with the platform unit:
 *   1rem = 16pt (iOS) = 16dp (Android)
 *
 * Typography sizes map to sp on Android (scalable pixel — respects user
 * font-size preferences). Everything else (radius, spacing) maps to dp.
 *
 *   node scripts/build-tokens.mjs
 *   node scripts/build-tokens.mjs --check   # exit non-zero if outputs are stale
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { compareIgnoringGenerated } from "./lib/drift.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_DIR = resolve(__dirname, "..", "tokens");
const SRC = resolve(TOKENS_DIR, "design-tokens.json");
const IOS = resolve(TOKENS_DIR, "design-tokens.ios.json");
const ANDROID = resolve(TOKENS_DIR, "design-tokens.android.json");

const REM_BASE_PX = 16;

function remToNumber(value) {
  if (typeof value !== "string") return null;
  if (value === "0") return 0;
  if (value.endsWith("rem")) return parseFloat(value) * REM_BASE_PX;
  if (value.endsWith("px")) return parseFloat(value);
  return null;
}

/* Walk the DTCG tree, transform any node where $type === 'dimension'
   using the supplied `xform`. Returns a deep-cloned new tree. */
function transform(node, xform, path = []) {
  if (Array.isArray(node)) return node.map((n, i) => transform(n, xform, [...path, i]));
  if (node && typeof node === "object") {
    if (node.$type === "dimension" && typeof node.$value === "string") {
      return xform(node, path);
    }
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = transform(v, xform, [...path, k]);
    }
    return out;
  }
  return node;
}

/* iOS: every dimension becomes pt. */
function toIOS(node) {
  const num = remToNumber(node.$value);
  return {
    ...node,
    $value: num === null ? node.$value : `${num}pt`,
    $extensions: {
      ...(node.$extensions ?? {}),
      "platform.ios.unit": "pt",
    },
  };
}

/* Android: typography → sp, everything else → dp. The W3C spec doesn't
   distinguish "font size" from "spacing" in $type, so we infer from
   the path: anything under `font-size.*` is sp, otherwise dp. */
function toAndroid(node, path) {
  const num = remToNumber(node.$value);
  const isFontSize = path.some(
    (segment) => segment === "font-size" || segment === "fontSize"
  );
  const unit = isFontSize ? "sp" : "dp";
  return {
    ...node,
    $value: num === null ? node.$value : `${num}${unit}`,
    $extensions: {
      ...(node.$extensions ?? {}),
      "platform.android.unit": unit,
    },
  };
}

function header(platform) {
  return {
    $description: `Auto-generated from /tokens/design-tokens.json. Run \`npm run tokens:build\` to regenerate. ${platform} export.`,
    $generated: new Date().toISOString().slice(0, 10),
  };
}

function main() {
  const check = process.argv.includes("--check");
  const src = JSON.parse(readFileSync(SRC, "utf8"));

  const ios = {
    ...header("iOS"),
    ...transform(src, toIOS),
  };
  const android = {
    ...header("Android"),
    ...transform(src, toAndroid),
  };

  const iosOut = JSON.stringify(ios, null, 2) + "\n";
  const androidOut = JSON.stringify(android, null, 2) + "\n";

  if (check) {
    let drift = false;
    for (const [path, fresh] of [
      [IOS, iosOut],
      [ANDROID, androidOut],
    ]) {
      let existing = "";
      try {
        existing = readFileSync(path, "utf8");
      } catch {
        existing = "";
      }
      if (!compareIgnoringGenerated(existing, fresh)) {
        console.error(
          `drift: ${path.split("/").slice(-2).join("/")} is out of date with /tokens/design-tokens.json — run \`npm run tokens:build\``
        );
        drift = true;
      }
    }
    if (drift) process.exit(1);
    console.log("ok: iOS + Android token exports up to date");
    return;
  }

  writeFileSync(IOS, iosOut);
  writeFileSync(ANDROID, androidOut);
  console.log(`wrote ${IOS.replace(__dirname, "")}`);
  console.log(`wrote ${ANDROID.replace(__dirname, "")}`);
}

main();
