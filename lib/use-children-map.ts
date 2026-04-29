"use client";

import * as React from "react";

/**
 * Build a Map<string, ReactNode> from `children` by extracting a key
 * from each child's props. Used by canvas-shell, ds-shell, and the
 * prototype standalone wrapper to receive server-rendered subtrees
 * tagged with data-* attributes and look them up by id at render time.
 *
 * `keyOf` should be a stable function reference (defined at module
 * scope) — passing an inline lambda will bust the useMemo cache on
 * every render. The exported `flowScreenKey` and `sectionKey` helpers
 * cover the two callers we have today.
 */
export function useChildrenMap(
  children: React.ReactNode,
  keyOf: (props: Record<string, unknown>) => string | undefined
): Map<string, React.ReactNode> {
  return React.useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      const key = keyOf(child.props as Record<string, unknown>);
      if (key) map.set(key, child);
    });
    return map;
  }, [children, keyOf]);
}

/** Keys children by `${data-flow-id}/${data-screen-id}`. */
export const flowScreenKey = (
  props: Record<string, unknown>
): string | undefined => {
  const f = props["data-flow-id"];
  const s = props["data-screen-id"];
  if (typeof f !== "string" || typeof s !== "string") return undefined;
  return `${f}/${s}`;
};

/** Keys children by `data-section-id`. */
export const sectionKey = (
  props: Record<string, unknown>
): string | undefined => {
  const id = props["data-section-id"];
  return typeof id === "string" ? id : undefined;
};
