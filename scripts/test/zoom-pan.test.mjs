/**
 * Regression test for the canvas pan handler's interactive-element guard.
 *
 * The bug: pointerdown's `e.target` for a click on a Lucide icon inside a
 * dock button is the SVG <path>, which is an Element but NOT an HTMLElement.
 * The original guard checked `instanceof HTMLElement` and skipped the
 * closest() lookup, letting the pan handler steal the pointer and the
 * button's click event never fired.
 *
 * If a future refactor narrows the check to HTMLElement again or drops the
 * closest() lookup, this test fails.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ZOOM_PAN = resolve(__dirname, "..", "..", "app", "canvas", "zoom-pan.tsx");
const src = readFileSync(ZOOM_PAN, "utf8");

test("pointerdown guard uses Element, not HTMLElement", () => {
  /* SVG icons inside the dock buttons are Element but not HTMLElement.
     Narrowing to HTMLElement was the regression. */
  assert.ok(
    /e\.target instanceof Element\b/.test(src),
    "pan handler must check `e.target instanceof Element` so SVG icon clicks are caught"
  );
  assert.ok(
    !/e\.target instanceof HTMLElement\b/.test(src),
    "pan handler must NOT narrow to HTMLElement — SVG <path> is not an HTMLElement"
  );
});

test("pointerdown guard calls closest() with button selector", () => {
  assert.ok(
    /closest\([^)]*['"]button/.test(src),
    "pan handler must call e.target.closest('button, ...') to skip clicks on dock buttons"
  );
});
