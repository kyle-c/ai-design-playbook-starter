/**
 * Tests for the contrast math in scripts/audit-tokens.mjs.
 * Run via `npm test`.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  hexToRgb,
  relativeLuminance,
  contrast,
} from "../audit-tokens.mjs";

test("hexToRgb parses 6-digit hex", () => {
  assert.deepEqual(hexToRgb("#FFFFFF"), [255, 255, 255]);
  assert.deepEqual(hexToRgb("#000000"), [0, 0, 0]);
  assert.deepEqual(hexToRgb("#4F46E5"), [79, 70, 229]);
});

test("hexToRgb parses 3-digit shorthand", () => {
  assert.deepEqual(hexToRgb("#fff"), [255, 255, 255]);
  assert.deepEqual(hexToRgb("#000"), [0, 0, 0]);
});

test("hexToRgb returns null on invalid input", () => {
  assert.equal(hexToRgb("rgb(0,0,0)"), null);
  assert.equal(hexToRgb("not-a-hex"), null);
  assert.equal(hexToRgb("#GGGGGG"), null);
});

test("relativeLuminance: pure white is 1, pure black is 0", () => {
  assert.equal(relativeLuminance([255, 255, 255]), 1);
  assert.equal(relativeLuminance([0, 0, 0]), 0);
});

test("contrast: white-on-black is the WCAG max of 21:1", () => {
  const ratio = contrast([255, 255, 255], [0, 0, 0]);
  assert.equal(ratio, 21);
});

test("contrast: identical colors give 1:1", () => {
  assert.equal(contrast([128, 128, 128], [128, 128, 128]), 1);
});

test("contrast is symmetric (order doesn't matter)", () => {
  const a = contrast([79, 70, 229], [255, 255, 255]);
  const b = contrast([255, 255, 255], [79, 70, 229]);
  assert.equal(a, b);
});

test("contrast: indigo brand on white passes WCAG AA for normal text", () => {
  /* #4F46E5 (--color-brand-500) on #FFFFFF should clear 4.5:1. */
  const ratio = contrast([79, 70, 229], [255, 255, 255]);
  assert.ok(ratio >= 4.5, `expected ≥4.5:1, got ${ratio.toFixed(2)}:1`);
});

test("contrast: bright red on white fails WCAG AA — caught in our token audit", () => {
  /* #EF4444 (the original danger-500) on #FFFFFF was the regression we fixed
     by remapping --color-action-danger to danger-600. Locking that math in. */
  const ratio = contrast([239, 68, 68], [255, 255, 255]);
  assert.ok(ratio < 4.5, `expected <4.5:1 (failure), got ${ratio.toFixed(2)}:1`);
});
