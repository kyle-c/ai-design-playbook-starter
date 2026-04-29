/**
 * Regression tests for audit-hardcoded.mjs — the hex / px-literal
 * scanner that enforces CLAUDE.md absolute rule #1.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { findViolations, isAllowlisted } from "../audit-hardcoded.mjs";

test("flags hex codes inside arbitrary class values", () => {
  const src = `<div className="bg-[#ff0000] text-[#fff]" />`;
  const issues = findViolations(src, "fake.tsx");
  const matches = issues.filter((i) => i.kind === "hex-in-class").map((i) => i.match);
  assert.deepEqual(matches.sort(), ["bg-[#ff0000]", "text-[#fff]"]);
});

test("flags px-literal spacing classes", () => {
  const src = `<div className="p-[24px] m-[16px] gap-[12px]" />`;
  const issues = findViolations(src, "fake.tsx");
  const kinds = issues.map((i) => i.kind);
  const matches = issues.map((i) => i.match);
  assert.deepEqual(kinds, ["px-in-class", "px-in-class", "px-in-class"]);
  assert.deepEqual(matches.sort(), ["gap-[12px]", "m-[16px]", "p-[24px]"]);
});

test("does not flag rem / % / fr arbitrary values — only hex + px", () => {
  const src = `<div className="w-[20rem] h-[50%] grid-cols-[1fr_2fr] m-[2vw]" />`;
  const issues = findViolations(src, "fake.tsx");
  assert.equal(issues.length, 0);
});

test("does not flag inline JS style props", () => {
  /* `style={{ width: 390 }}` is JavaScript, not a class string. The
     scanner intentionally skips this because numeric props on style
     are typed and stay in JS. */
  const src = `<div style={{ width: 390, height: 844 }} />`;
  const issues = findViolations(src, "fake.tsx");
  assert.equal(issues.length, 0);
});

test("isAllowlisted matches dark-chrome surfaces", () => {
  assert.ok(isAllowlisted("/repo/app/canvas/canvas-shell.tsx"));
  assert.ok(isAllowlisted("/repo/app/canvas/zoom-pan.tsx"));
  assert.ok(isAllowlisted("/repo/app/prototype/[flow]/page.tsx"));
  assert.ok(isAllowlisted("/repo/app/design-system/ds-shell.tsx"));
  assert.ok(isAllowlisted("/repo/app/page.tsx"));
  assert.ok(isAllowlisted("/repo/components/ui/separator.tsx"));
});

test("isAllowlisted does NOT match product surfaces", () => {
  assert.equal(isAllowlisted("/repo/app/design-system/sections/color.tsx"), false);
  assert.equal(isAllowlisted("/repo/components/screens/onboarding/email.tsx"), false);
});
