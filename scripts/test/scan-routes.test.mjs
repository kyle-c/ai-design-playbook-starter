/**
 * Tests that lib/scan-routes.ts excludes design tools from the live-routes set.
 *
 * The TypeScript module can't be imported directly from a .mjs test without a
 * compile step, so we read the source file and assert structural invariants on
 * its content. This catches regressions where a future refactor removes the
 * filter or drops a tool route from DESIGN_TOOL_ROUTES.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCAN_ROUTES = resolve(__dirname, "..", "..", "lib", "scan-routes.ts");
const src = readFileSync(SCAN_ROUTES, "utf8");

test("scan-routes exports DESIGN_TOOL_ROUTES", () => {
  assert.ok(
    /export const DESIGN_TOOL_ROUTES/.test(src),
    "DESIGN_TOOL_ROUTES is no longer exported"
  );
});

test("DESIGN_TOOL_ROUTES includes /canvas and /design-system", () => {
  assert.ok(/['"]\/canvas['"]/.test(src), "tool route /canvas missing");
  assert.ok(
    /['"]\/design-system['"]/.test(src),
    "tool route /design-system missing"
  );
});

test("scanRoutes filters via DESIGN_TOOL_ROUTES.has", () => {
  /* Future refactors must keep the filter. If the .has() call is removed,
     the graph view will silently start listing design tools as product
     routes again. */
  assert.ok(
    /DESIGN_TOOL_ROUTES\.has/.test(src),
    "scanRoutes is no longer filtering with DESIGN_TOOL_ROUTES.has"
  );
});
