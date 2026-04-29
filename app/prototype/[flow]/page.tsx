import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { flows, flowById } from "@/app/flows.config";
import { PrototypeStandalone } from "./prototype-standalone";

/**
 * Deep-linkable prototype route — `/prototype/<flow-id>`.
 *
 * The article calls this out as its own route (separate from /canvas)
 * so a designer can share a single click-through journey by URL. The
 * /canvas page still hosts the multi-flow / multi-view experience;
 * this route is the prototype-only, shareable version.
 *
 * Design-only: per CLAUDE.md absolute rule #5, this 404s in production.
 */
export function generateStaticParams() {
  return flows.map((f) => ({ flow: f.id }));
}

export default function PrototypeRoutePage({
  params,
}: {
  params: { flow: string };
}) {
  if (process.env.NODE_ENV === "production") notFound();

  const flow = flowById(params.flow);
  if (!flow) notFound();

  const flowMeta = {
    id: flow.id,
    label: flow.label,
    entry: !!flow.entry,
    nextFlow: flow.nextFlow,
    screens: flow.screens.map((s) => ({ id: s.id, label: s.label })),
  };

  return (
    <div className="flex h-dvh w-full flex-col bg-[#1a1a1a] text-white">
      <header className="flex h-12 shrink-0 items-center gap-4 border-b border-white/10 bg-[#141414] px-4">
        <Link
          href="/canvas"
          className="inline-flex items-center gap-1 text-small text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft size={14} />
          Canvas
        </Link>
        <span className="text-small font-medium text-white">{flow.label}</span>
        <span className="ml-auto font-mono text-micro text-white/40">
          /prototype/{flow.id}
        </span>
      </header>
      <div className="flex-1 overflow-hidden">
        <PrototypeStandalone flow={flowMeta}>
          {flow.screens.map((s) => (
            <div
              key={`${flow.id}/${s.id}`}
              data-flow-id={flow.id}
              data-screen-id={s.id}
              className="h-full w-full"
            >
              <s.Component />
            </div>
          ))}
        </PrototypeStandalone>
      </div>
    </div>
  );
}
