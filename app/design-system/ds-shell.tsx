"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { useChildrenMap, sectionKey } from "@/lib/use-children-map";

export type DSSection = {
  id: string;
  label: string;
  description?: string;
  source?: string;
};

export type DSStats = {
  semanticTokens: number;
  primitives: number;
  components: number;
  contrastPairs: number;
  lastEdited: string;
};

const REPO_BASE =
  "https://github.com/kyle-c/ai-design-playbook-starter/blob/main";

/**
 * Design system shell — modeled on /canvas/canvas-shell.tsx so the
 * project reads as a project, not a long doc. Sections become "pages"
 * in the left rail; only the active one renders. URL state mirrors
 * the active page so /design-system?section=motion is shareable.
 *
 * Sections are pre-rendered on the server and passed as children
 * tagged with `data-section-id`; the shell groups them into a map
 * and renders the active id. Same pattern canvas-shell uses.
 */
export function DSShell({
  sections,
  stats,
  children,
}: {
  sections: DSSection[];
  stats: DSStats;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useSearchParams();

  const urlSection = params.get("section");
  const initialId =
    urlSection && sections.some((s) => s.id === urlSection)
      ? urlSection
      : sections[0].id;
  const [activeId, setActiveId] = React.useState<string>(initialId);

  /* Mirror state to URL so /design-system?section=… stays shareable. */
  React.useEffect(() => {
    router.replace(
      activeId === sections[0].id
        ? "/design-system"
        : `/design-system?section=${activeId}`,
      { scroll: false }
    );
    /* eslint-disable-next-line react-hooks/exhaustive-deps -- router is stable */
  }, [activeId]);

  const sectionsByKey = useChildrenMap(children, sectionKey);

  const active =
    sections.find((s) => s.id === activeId) ?? sections[0];

  return (
    <div className="flex h-dvh w-full bg-chrome-canvas text-white">
      {/* Left rail — dark chrome, mirrors canvas-shell. Explicit white/*
          opacities (not theme tokens) so dark-mode flip doesn't invert
          the chrome itself. */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-chrome-panel">
        <header className="border-b border-white/10 px-4 py-4">
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-1 text-micro text-white/50 transition-colors hover:text-white"
          >
            <ArrowLeft size={12} />
            Home
          </Link>
          <p className="text-micro uppercase tracking-wide text-white/50">
            Design system
          </p>
          <h1 className="text-h3 font-semibold text-white">Living reference</h1>
          <ul className="mt-3 grid gap-1 text-micro text-white/55">
            <StatRow value={stats.semanticTokens} label="semantic tokens" />
            <StatRow value={stats.primitives} label="primitives" />
            <StatRow value={stats.components} label="components" />
            <StatRow
              value={`${stats.contrastPairs} ✓`}
              label="contrast pairs"
            />
            <StatRow value={stats.lastEdited} label="tokens edited" />
          </ul>
        </header>

        <nav className="flex-1 overflow-y-auto p-2">
          <p className="mt-1 px-3 pb-2 text-micro uppercase tracking-wide text-white/40">
            Pages
          </p>
          {sections.map((s) => (
            <NavItem
              key={s.id}
              label={s.label}
              active={activeId === s.id}
              onClick={() => setActiveId(s.id)}
            />
          ))}
        </nav>

        <footer className="border-t border-white/10 px-4 py-3 text-micro text-white/40">
          /styles/tokens.css
        </footer>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Toolbar title={active.label} source={active.source} />

        <main className="relative flex-1 overflow-y-auto bg-surface-default text-text-primary">
          <div className="mx-auto max-w-5xl px-8 py-10">
            {active.description && (
              <p className="mb-8 max-w-2xl text-body text-text-secondary">
                {active.description}
              </p>
            )}
            {sectionsByKey.get(activeId)}
          </div>
        </main>
      </div>
    </div>
  );
}

function StatRow({
  value,
  label,
}: {
  value: React.ReactNode;
  label: string;
}) {
  return (
    <li className="flex items-baseline gap-1.5">
      <span className="font-medium tabular-nums text-white">{value}</span>
      <span>{label}</span>
    </li>
  );
}

function NavItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block w-full rounded-md px-3 py-1.5 text-left text-small transition-colors",
        active
          ? "bg-white/10 text-white"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

function Toolbar({
  title,
  source,
}: {
  title: string;
  source?: string;
}) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-4 border-b border-white/10 bg-chrome-panel px-4">
      <span className="truncate text-small font-medium text-white">{title}</span>
      <div className="ml-auto flex items-center gap-3">
        {source && (
          <a
            href={`${REPO_BASE}/${source}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-small text-white/50 transition-colors hover:text-white"
          >
            <span className="font-mono">{source.split("/").pop()}</span>
            <ArrowUpRight size={12} />
          </a>
        )}
        <ThemeToggle className="text-white/70 hover:bg-white/10 hover:text-white" />
      </div>
    </header>
  );
}
