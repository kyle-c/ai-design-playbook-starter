import { notFound } from "next/navigation";
import { flowById, flows } from "@/app/flows.config";
import { PrototypeFrame } from "./prototype-frame";

/**
 * Prototype — clickable mobile preview of a single flow.
 *
 * Design-only route. Per /CLAUDE.md absolute rule #5, this 404s in production.
 */
export function generateStaticParams() {
  return flows.map((flow) => ({ flow: flow.id }));
}

export default function PrototypePage({
  params,
}: {
  params: { flow: string };
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const flow = flowById(params.flow);
  if (!flow) notFound();

  /* Pre-render each screen on the server; the client frame just toggles
     which one is visible. Function references can't cross the
     server-to-client boundary, but rendered React elements can. */
  return (
    <PrototypeFrame
      flowLabel={flow.label}
      screenLabels={flow.screens.map((s) => s.label)}
    >
      {flow.screens.map((s) => (
        <s.Component key={s.id} />
      ))}
    </PrototypeFrame>
  );
}
