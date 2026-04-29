/**
 * Unit tests for compareIgnoringGenerated — the drift helper shared
 * between scripts/build-tokens.mjs and scripts/build-content-inventory.mjs.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { compareIgnoringGenerated } from "../lib/drift.mjs";

test("identical strings compare equal", () => {
  const s = `{\n  "color": "red"\n}`;
  assert.equal(compareIgnoringGenerated(s, s), true);
});

test("differing $generated stamps compare equal", () => {
  const a = `{\n  "$generated": "2026-04-29",\n  "color": "red"\n}`;
  const b = `{\n  "$generated": "2026-04-30",\n  "color": "red"\n}`;
  assert.equal(compareIgnoringGenerated(a, b), true);
});

test("trailing newline difference is ignored", () => {
  const a = `{\n  "color": "red"\n}`;
  const b = `{\n  "color": "red"\n}\n`;
  assert.equal(compareIgnoringGenerated(a, b), true);
});

test("real content drift fails compare", () => {
  const a = `{\n  "$generated": "2026-04-29",\n  "color": "red"\n}`;
  const b = `{\n  "$generated": "2026-04-29",\n  "color": "blue"\n}`;
  assert.equal(compareIgnoringGenerated(a, b), false);
});

test("missing existing file (empty string) detects drift against fresh", () => {
  const fresh = `{\n  "$generated": "2026-04-29",\n  "color": "red"\n}`;
  assert.equal(compareIgnoringGenerated("", fresh), false);
});
