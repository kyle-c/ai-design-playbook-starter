import * as React from "react";
import type { Flow } from "@/app/flows.config";

/**
 * Render a flow's screens as React nodes wrapped in divs tagged with
 * `data-flow-id` + `data-screen-id`. Both /canvas and /prototype/[flow]
 * use this exact shape so their client shells can rebuild a Map<key,
 * node> via `useChildrenMap` (see `/lib/use-children-map.ts`).
 *
 * Returns ReactNode[] (not a Fragment) so callers can `.flatMap()` over
 * multiple flows, as /canvas does.
 */
export function flowScreenNodes(flow: Flow): React.ReactNode[] {
  return flow.screens.map((s) => (
    <div
      key={`${flow.id}/${s.id}`}
      data-flow-id={flow.id}
      data-screen-id={s.id}
      className="h-full w-full"
    >
      <s.Component />
    </div>
  ));
}
