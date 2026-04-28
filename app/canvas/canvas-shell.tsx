"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Keyboard, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CanvasView } from "./canvas-view";
import { PrototypeView } from "./prototype-view";
import { GraphView } from "./graph-view";

export type FlowMeta = {
  id: string;
  label: string;
  entry: boolean;
  nextFlow?: string;
  screens: { id: string; label: string }[];
};

export type LiveRoute = {
  href: string;
  source: string;
};

type ViewMode = "canvas" | "prototype" | "graph";
type FlowFilter = string | "all";

const VALID_VIEWS: ViewMode[] = ["canvas", "prototype", "graph"];

export function CanvasShell({
  flows,
  liveRoutes,
  children,
}: {
  flows: FlowMeta[];
  liveRoutes: LiveRoute[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useSearchParams();

  /* Read initial state from URL so /canvas?view=prototype&flow=onboarding
     is shareable. */
  const urlView = params.get("view") as ViewMode | null;
  const urlFlow = params.get("flow");
  const initialView: ViewMode =
    urlView && VALID_VIEWS.includes(urlView) ? urlView : "canvas";
  const initialFlow: FlowFilter =
    urlFlow && (urlFlow === "all" || flows.some((f) => f.id === urlFlow))
      ? urlFlow
      : "all";
  /* Group server-rendered screens into a map keyed by flowId/screenId. */
  const screensByKey = React.useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      const props = child.props as {
        "data-flow-id"?: string;
        "data-screen-id"?: string;
      };
      const flowId = props["data-flow-id"];
      const screenId = props["data-screen-id"];
      if (flowId && screenId) {
        map.set(`${flowId}/${screenId}`, child);
      }
    });
    return map;
  }, [children]);

  const [view, setView] = React.useState<ViewMode>(initialView);
  const [flowFilter, setFlowFilter] = React.useState<FlowFilter>(initialFlow);

  /* Mirror state to URL so /canvas?view=...&flow=... stays shareable. */
  React.useEffect(() => {
    const next = new URLSearchParams();
    if (view !== "canvas") next.set("view", view);
    if (flowFilter !== "all") next.set("flow", flowFilter);
    const qs = next.toString();
    router.replace(qs ? `/canvas?${qs}` : "/canvas", { scroll: false });
    /* eslint-disable-next-line react-hooks/exhaustive-deps -- router is stable */
  }, [view, flowFilter]);

  const [helpOpen, setHelpOpen] = React.useState(false);

  /* Keyboard shortcuts at the shell level: 1/2/3 view modes, ? help, Esc close. */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isFormElement(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "1") {
        e.preventDefault();
        setView("canvas");
      } else if (e.key === "2") {
        e.preventDefault();
        setView("prototype");
      } else if (e.key === "3") {
        e.preventDefault();
        setView("graph");
      } else if (e.key === "?") {
        e.preventDefault();
        setHelpOpen((v) => !v);
      } else if (e.key === "Escape") {
        setHelpOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visibleFlows = React.useMemo(
    () => (flowFilter === "all" ? flows : flows.filter((f) => f.id === flowFilter)),
    [flows, flowFilter]
  );

  const totalScreens = flows.reduce((n, f) => n + f.screens.length, 0);
  const visibleCount = visibleFlows.reduce((n, f) => n + f.screens.length, 0);

  return (
    <div className="flex h-dvh w-full bg-[#1a1a1a] text-text-on-inverse">
      {/* Left flow nav */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-white/10 bg-[#141414]">
        <header className="border-b border-white/10 px-4 py-4">
          <p className="text-micro uppercase tracking-wide text-white/50">Design tools</p>
          <h1 className="text-h3 font-semibold">Canvas</h1>
        </header>

        <nav className="flex-1 overflow-y-auto p-2">
          <NavItem
            label="All flows"
            sub={`${totalScreens} screens`}
            active={flowFilter === "all"}
            onClick={() => setFlowFilter("all")}
          />
          <div className="mt-4 px-3 pb-2 text-micro uppercase tracking-wide text-white/40">
            Flows
          </div>
          {flows.map((f) => (
            <NavItem
              key={f.id}
              label={f.label}
              sub={`${f.screens.length} screens${f.entry ? " · entry" : ""}`}
              active={flowFilter === f.id}
              onClick={() => setFlowFilter(f.id)}
            />
          ))}
        </nav>

        <footer className="border-t border-white/10 px-4 py-3 text-micro text-white/40">
          /app/flows.config.ts
        </footer>
      </aside>

      {/* Right: top toolbar + view */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Toolbar
          view={view}
          onChangeView={setView}
          onOpenHelp={() => setHelpOpen(true)}
          title={
            flowFilter === "all"
              ? "All flows"
              : (flows.find((f) => f.id === flowFilter)?.label ?? "")
          }
          screenCount={visibleCount}
        />

        <div className="relative flex-1 overflow-hidden">
          {view === "canvas" && (
            <CanvasView flows={visibleFlows} screensByKey={screensByKey} />
          )}
          {view === "prototype" && (
            <PrototypeView
              flows={visibleFlows}
              screensByKey={screensByKey}
            />
          )}
          {view === "graph" && (
            <GraphView flows={flows} liveRoutes={liveRoutes} highlight={flowFilter} />
          )}
        </div>
      </div>

      {helpOpen && <HelpOverlay onClose={() => setHelpOpen(false)} />}
    </div>
  );
}

function isFormElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

const SHORTCUTS: { key: string; label: string }[] = [
  { key: "1", label: "Canvas view" },
  { key: "2", label: "Prototype view" },
  { key: "3", label: "Graph view" },
  { key: "Drag", label: "Pan canvas" },
  { key: "⌘ + Wheel", label: "Zoom (or pinch)" },
  { key: "Wheel", label: "Pan (two-finger scroll)" },
  { key: "+ / −", label: "Zoom in / out" },
  { key: "0", label: "Reset zoom" },
  { key: "F", label: "Fit to screen" },
  { key: "← / →", label: "Step prototype (in prototype view)" },
  { key: "?", label: "Toggle this help" },
  { key: "Esc", label: "Close" },
];

function HelpOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={onClose}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[26rem] rounded-lg border border-white/10 bg-[#141414] p-5 text-white shadow-2xl"
      >
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-h3 font-semibold">Keyboard shortcuts</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shortcuts"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </header>
        <ul className="grid gap-1.5">
          {SHORTCUTS.map((s) => (
            <li
              key={s.key}
              className="flex items-center justify-between gap-4 rounded px-2 py-1.5 text-small"
            >
              <span className="text-white/70">{s.label}</span>
              <kbd className="rounded border border-white/10 bg-[#0f0f0f] px-2 py-0.5 font-mono text-micro text-white/85">
                {s.key}
              </kbd>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NavItem({
  label,
  sub,
  active,
  onClick,
}: {
  label: string;
  sub?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left transition-colors",
        active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
      )}
    >
      <span className="text-small font-medium">{label}</span>
      {sub && <span className="text-micro text-white/40">{sub}</span>}
    </button>
  );
}

function Toolbar({
  view,
  onChangeView,
  onOpenHelp,
  title,
  screenCount,
}: {
  view: ViewMode;
  onChangeView: (v: ViewMode) => void;
  onOpenHelp: () => void;
  title: string;
  screenCount: number;
}) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-4 border-b border-white/10 bg-[#141414] px-4">
      <div className="flex min-w-0 items-baseline gap-2">
        <span className="truncate text-small font-medium text-white">{title}</span>
        <span className="text-micro text-white/40">{screenCount} screens</span>
      </div>

      <div className="ml-auto inline-flex rounded-md border border-white/10 bg-[#0f0f0f] p-0.5">
        {(["canvas", "prototype", "graph"] as ViewMode[]).map((v, i) => (
          <button
            key={v}
            type="button"
            onClick={() => onChangeView(v)}
            aria-pressed={view === v}
            title={`${v} (${i + 1})`}
            className={cn(
              "rounded px-3 py-1 text-small capitalize transition-colors",
              view === v
                ? "bg-white text-black"
                : "text-white/60 hover:text-white"
            )}
          >
            {v}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenHelp}
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (?)"
        className="inline-flex h-8 w-8 items-center justify-center rounded text-white/60 hover:bg-white/10 hover:text-white"
      >
        <Keyboard size={15} />
      </button>
    </header>
  );
}
