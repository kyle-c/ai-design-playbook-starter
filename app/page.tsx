import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import en from "@/locales/en.json";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-6xl flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <Image
          src="/logo.svg"
          alt="AI Design Playbook"
          width={180}
          height={28}
          priority
        />
        <ThemeToggle />
      </header>

      <section className="mt-12 flex-1">
        <div className="mb-6 flex items-baseline justify-between">
          <h1 className="text-h2 font-semibold tracking-tight text-text-primary">
            {en.home.title}
          </h1>
          <span className="text-small text-text-tertiary">2 projects</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <ProjectTile
            href="/design-system"
            name={en.home.tiles.designSystem.name}
            meta={en.home.tiles.designSystem.meta}
          >
            <DesignSystemThumb />
          </ProjectTile>
          <ProjectTile
            href="/canvas"
            name={en.home.tiles.exampleProject.name}
            meta={en.home.tiles.exampleProject.meta}
          >
            <ExampleProjectThumb />
          </ProjectTile>
        </div>
      </section>

      <footer className="mt-16 text-small text-text-tertiary">
        Following the{" "}
        <a
          href="https://ai-design-playbook.vercel.app"
          className="underline hover:text-text-secondary"
        >
          AI Design Playbook
        </a>
        .
      </footer>
    </main>
  );
}

function ProjectTile({
  href,
  name,
  meta,
  children,
}: {
  href: Route;
  name: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-lg border border-subtle bg-surface-default transition-colors hover:border-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-action-primary"
    >
      <div className="aspect-[4/3] overflow-hidden border-b border-subtle">
        {children}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span className="text-body font-medium text-text-primary">{name}</span>
        <span className="text-small text-text-tertiary">{meta}</span>
      </div>
    </Link>
  );
}

/* ----- thumbnails ---------------------------------------------------------
   Both thumbnails use the canvas's dark-chrome aesthetic (dotted dark bg)
   to read as "design tool surface." Inside, semantic-token CSS variables
   pull the primitive palette so swatches stay correct in both light and
   dark mode without hardcoding hex in components. */

const SWATCH_VARS = [
  "var(--color-brand-500)",
  "var(--color-success-500)",
  "var(--color-accent-500)",
  "var(--color-danger-500)",
  "var(--color-neutral-900)",
];

function DesignSystemThumb() {
  return (
    <div
      className="relative h-full w-full"
      style={{
        backgroundColor: "#1a1a1a",
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      <div
        className="absolute left-1/2 top-1/2 flex w-[68%] -translate-x-1/2 -translate-y-1/2 flex-col gap-3 rounded-md p-4 shadow-2xl ring-1 ring-white/10"
        style={{ background: "var(--color-neutral-0)" }}
      >
        <div className="flex gap-1.5">
          {SWATCH_VARS.map((c, i) => (
            <div
              key={i}
              className="h-5 w-5 rounded-full"
              style={{ background: c }}
            />
          ))}
        </div>
        <div
          className="text-3xl font-semibold leading-none"
          style={{ color: "var(--color-neutral-900)" }}
        >
          Aa
        </div>
        <div className="flex gap-1.5">
          <div
            className="h-4 w-12 rounded-sm"
            style={{ background: "var(--color-action-primary)" }}
          />
          <div
            className="h-4 w-9 rounded-sm border"
            style={{
              background: "var(--color-neutral-50)",
              borderColor: "var(--color-neutral-200)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ExampleProjectThumb() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        backgroundColor: "#1a1a1a",
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "12px 12px",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center gap-3 px-3">
        {[0, 1, 2, 3].map((i) => (
          <MiniFrame key={i} step={i} />
        ))}
      </div>
    </div>
  );
}

function MiniFrame({ step }: { step: number }) {
  return (
    <div
      className="flex h-32 w-16 flex-col gap-1.5 rounded-md p-2 shadow-xl ring-1 ring-white/10"
      style={{ background: "var(--color-neutral-0)" }}
    >
      <div
        className="h-1.5 w-5 rounded-sm"
        style={{ background: "var(--color-action-primary)" }}
      />
      <div
        className="h-1.5 w-full rounded-sm"
        style={{ background: "var(--color-neutral-200)" }}
      />
      <div
        className="h-1.5 w-3/4 rounded-sm"
        style={{ background: "var(--color-neutral-200)" }}
      />
      {step >= 2 && (
        <div
          className="h-1.5 w-1/2 rounded-sm"
          style={{ background: "var(--color-neutral-200)" }}
        />
      )}
      <div className="mt-auto h-2.5 w-full rounded-sm"
        style={{ background: "var(--color-action-primary)" }}
      />
    </div>
  );
}
