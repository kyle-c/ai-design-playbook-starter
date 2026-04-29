/**
 * Unit tests for audit-copy.mjs — the placeholder + character-limit
 * scanner that runs in CI. Tests are written against the exported
 * helpers, not the CLI.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import {
  flattenLocale,
  scanForPlaceholders,
  checkLimit,
} from "../audit-copy.mjs";

test("flattenLocale walks nested keys and skips $-prefixed metadata", () => {
  const out = flattenLocale({
    $description: "skip me",
    home: { eyebrow: "Hi", links: { canvas: "Open" } },
    errors: { network: "Down" },
  });
  assert.deepEqual(out, [
    { key: "home.eyebrow", text: "Hi" },
    { key: "home.links.canvas", text: "Open" },
    { key: "errors.network", text: "Down" },
  ]);
});

test("scanForPlaceholders catches Lorem, TODO, TBD, and bracketed", () => {
  assert.deepEqual(
    scanForPlaceholders("Lorem ipsum dolor"),
    ["lorem ipsum"]
  );
  assert.deepEqual(scanForPlaceholders("TODO: copy"), ["TODO"]);
  assert.deepEqual(scanForPlaceholders("Status TBD"), ["TBD"]);
  assert.deepEqual(
    scanForPlaceholders("[Button label]"),
    ["[bracketed placeholder]"]
  );
});

test("scanForPlaceholders allows real copy that happens to use brackets", () => {
  /* Allow real copy with short or all-lowercase bracket content
     (e.g. citations, "[fr]" markers). The pattern targets the obvious
     placeholder shape `[Capitalized phrase]`. */
  assert.deepEqual(scanForPlaceholders("Welcome back!"), []);
  assert.deepEqual(scanForPlaceholders("See [1]"), []);
  assert.deepEqual(scanForPlaceholders("hello [world]"), []);
});

test("checkLimit enforces button max 20", () => {
  assert.equal(checkLimit("home.cta.submit", "Save"), null);
  const over = checkLimit("home.cta.submit", "Use a different email");
  assert.equal(over.rule, "button");
  assert.equal(over.max, 20);
  assert.equal(over.actual, 21);
});

test("checkLimit enforces title and toast limits", () => {
  /* 60-char title boundary. */
  assert.equal(checkLimit("home.headline", "x".repeat(60)), null);
  assert.ok(checkLimit("home.headline", "x".repeat(61)));

  /* Toast limit 48. */
  assert.equal(checkLimit("foo.success", "x".repeat(48)), null);
  assert.ok(checkLimit("foo.success", "x".repeat(49)));
});

test("checkLimit returns null for keys that don't match a rule", () => {
  assert.equal(checkLimit("home.body", "x".repeat(500)), null);
});
