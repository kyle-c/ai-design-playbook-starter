"use client";

import * as React from "react";
import { PrototypeView } from "@/app/canvas/prototype-view";
import type { FlowMeta } from "@/app/flows.config";
import { useChildrenMap, flowScreenKey } from "@/lib/use-children-map";

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
  const screensByKey = useChildrenMap(children, flowScreenKey);
  return <PrototypeView flows={[flow]} screensByKey={screensByKey} />;
}
