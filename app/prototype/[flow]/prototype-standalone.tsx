"use client";

import * as React from "react";
import { PrototypeView } from "@/app/canvas/prototype-view";
import type { FlowMeta } from "@/app/canvas/canvas-shell";

/**
 * Client wrapper around PrototypeView for the deep-link
 * /prototype/[flow] route. Builds the screensByKey map from children
 * (the same pattern canvas-shell uses) so server-rendered screens can
 * be passed across the server/client boundary as ReactNodes wrapped
 * in tagged divs.
 */
export function PrototypeStandalone({
  flow,
  children,
}: {
  flow: FlowMeta;
  children: React.ReactNode;
}) {
  const screensByKey = React.useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      const props = child.props as {
        "data-flow-id"?: string;
        "data-screen-id"?: string;
      };
      const f = props["data-flow-id"];
      const s = props["data-screen-id"];
      if (f && s) map.set(`${f}/${s}`, child);
    });
    return map;
  }, [children]);

  return <PrototypeView flows={[flow]} screensByKey={screensByKey} />;
}
