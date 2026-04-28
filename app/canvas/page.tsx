import { Suspense } from "react";
import { notFound } from "next/navigation";
import { flows } from "@/app/flows.config";
import { scanRoutes } from "@/lib/scan-routes";
import { CanvasShell } from "./canvas-shell";

/**
 * Canvas — design tool with three modes (canvas / prototype / graph).
 *
 * Design-only route. Per /CLAUDE.md absolute rule #5, this 404s in production.
 *
 * Each screen is pre-rendered on the server and handed to the client shell as
 * a child wrapped in a div tagged with `data-flow-id` + `data-screen-id`. The
 * shell groups them into a map and renders the active mode against that data.
 * Function references can't cross the server-to-client boundary, but rendered
 * React elements wrapped in plain divs can.
 */
export default function CanvasPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const flowMeta = flows.map((flow) => ({
    id: flow.id,
    label: flow.label,
    entry: !!flow.entry,
    nextFlow: flow.nextFlow,
    screens: flow.screens.map((s) => ({ id: s.id, label: s.label })),
  }));

  const liveRoutes = scanRoutes();

  return (
    <Suspense fallback={null}>
      <CanvasShell flows={flowMeta} liveRoutes={liveRoutes}>
        {flows.flatMap((flow) =>
          flow.screens.map((s) => (
            <div
              key={`${flow.id}/${s.id}`}
              data-flow-id={flow.id}
              data-screen-id={s.id}
              className="h-full w-full"
            >
              <s.Component />
            </div>
          ))
        )}
      </CanvasShell>
    </Suspense>
  );
}
