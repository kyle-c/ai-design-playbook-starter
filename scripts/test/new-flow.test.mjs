/**
 * Tests for the naming helpers in scripts/new-flow.mjs.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { pascal, camel, titleCase } from "../new-flow.mjs";

test("pascal: single word", () => {
  assert.equal(pascal("welcome"), "Welcome");
});

test("pascal: kebab-case → PascalCase", () => {
  assert.equal(pascal("danger-zone"), "DangerZone");
  assert.equal(pascal("multi-word-flow"), "MultiWordFlow");
});

test("camel: single word", () => {
  assert.equal(camel("settings"), "settings");
});

test("camel: kebab-case → camelCase", () => {
  assert.equal(camel("danger-zone"), "dangerZone");
  assert.equal(camel("password-reset"), "passwordReset");
});

test("titleCase: single word capitalizes first letter only", () => {
  assert.equal(titleCase("settings"), "Settings");
});

test("titleCase: multi-word capitalizes only the first word", () => {
  /* Sentence-case, matching /skills/copy.md button-label conventions. */
  assert.equal(titleCase("danger-zone"), "Danger zone");
  assert.equal(titleCase("change-password"), "Change password");
});
