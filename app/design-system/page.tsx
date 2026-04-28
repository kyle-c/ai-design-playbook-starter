import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ThemeToggle } from "@/components/ui/theme-toggle";

import { DSNav } from "./ds-nav";
import { Section } from "./lib/section";
import { getSystemStats } from "./lib/stats";

import { ColorSection } from "./sections/color";
import { PrimitivesSection } from "./sections/primitives";
import { TypographySection } from "./sections/typography";
import { SpacingSection } from "./sections/spacing";
import { ElevationSection } from "./sections/elevation";
import { IconographySection } from "./sections/iconography";
import { ButtonsSection } from "./sections/buttons";
import { FormsSection } from "./sections/forms";
import { FeedbackSection } from "./sections/feedback";
import { DisplaySection } from "./sections/display";
import { OverlaysSection } from "./sections/overlays";
import { RadiusSection } from "./sections/radius";
import { MotionSection } from "./sections/motion";

/**
 * Living style guide. Server-rendered shell + per-section components
 * (most static, a few client-only for interactive primitives). The
 * shell is server because we want the system-stat header to be
 * accurate at request/build time, computed by reading tokens.css and
 * components/ui directly — never lying about what exists.
 *
 * Public route per the playbook: no auth required.
 */
export default async function DesignSystemPage() {
  const stats = await getSystemStats();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-12 flex items-start justify-between gap-6">
        <div>
          <Link
            href="/"
            className="mb-3 inline-flex items-center gap-1 text-small text-text-tertiary transition-colors hover:text-text-secondary"
          >
            <ArrowLeft size={14} />
            Home
          </Link>
          <p className="text-small uppercase tracking-wide text-text-secondary">
            Design system
          </p>
          <h1 className="mt-2 text-display font-semibold tracking-tight text-text-primary">
            Living reference
          </h1>
          <p className="mt-3 max-w-2xl text-body text-text-secondary">
            Generated from the codebase. Every swatch, every component, every
            value below reflects the current state of the system. To change it,
            edit{" "}
            <code className="font-mono text-small">/styles/tokens.css</code>.
          </p>
          <StatLine stats={stats} />
        </div>
        <ThemeToggle />
      </header>

      <div className="grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)]">
        <DSNav />

        <div>
          <Section
            id="color"
            title="Color"
            description="Semantic tokens, side-by-side in light and dark themes. Components reference these names — never primitives."
          >
            <ColorSection />
          </Section>

          <Section
            id="primitives"
            title="Primitives"
            description="Raw color ramps that semantic tokens point at. Reference only."
          >
            <PrimitivesSection />
          </Section>

          <Section
            id="typography"
            title="Typography"
            description="Size, weight, line-height, and tracking. Body 16 is the reading default."
          >
            <TypographySection />
          </Section>

          <Section
            id="spacing"
            title="Spacing"
            description="4px base scale. Always reference the token, never raw px."
          >
            <SpacingSection />
          </Section>

          <Section
            id="elevation"
            title="Elevation"
            description="Borders are preferred for separation; shadows are only for floating surfaces."
          >
            <ElevationSection />
          </Section>

          <Section
            id="iconography"
            title="Iconography"
            description="lucide-react. Line-art only at 1.5px stroke; never mix with filled or 2-tone styles."
          >
            <IconographySection />
          </Section>

          <Section
            id="buttons"
            title="Buttons"
            description="One primary action per surface. States shown side-by-side."
            source="components/ui/button.tsx"
          >
            <ButtonsSection />
          </Section>

          <Section
            id="forms"
            title="Forms"
            description="Input states across default, focus, filled, error, and disabled."
            source="components/ui/input.tsx"
          >
            <FormsSection />
          </Section>

          <Section
            id="feedback"
            title="Feedback"
            description="Badges, alerts, and skeletons."
            source="components/ui/alert.tsx"
          >
            <FeedbackSection />
          </Section>

          <Section
            id="display"
            title="Display"
            description="Cards, avatars, separators."
            source="components/ui/card.tsx"
          >
            <DisplaySection />
          </Section>

          <Section
            id="overlays"
            title="Overlays"
            description="Tabs, dialog, tooltip, dropdown menu."
            source="components/ui/dialog.tsx"
          >
            <OverlaysSection />
          </Section>

          <Section
            id="radius"
            title="Radius"
            description="Six steps. Match radius to the size of the surface."
          >
            <RadiusSection />
          </Section>

          <Section
            id="motion"
            title="Motion"
            description="Four durations, two easings. Hover or tap to preview."
          >
            <MotionSection />
          </Section>
        </div>
      </div>
    </main>
  );
}

function StatLine({ stats }: { stats: Awaited<ReturnType<typeof getSystemStats>> }) {
  const items = [
    { value: stats.semanticTokens, label: "semantic tokens" },
    { value: stats.primitives, label: "primitives" },
    { value: stats.components, label: "components" },
    { value: `${stats.contrastPairs} ✓`, label: "contrast pairs" },
    { value: stats.lastEdited, label: "tokens edited" },
  ];

  return (
    <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-small text-text-tertiary">
      {items.map((it) => (
        <li key={it.label} className="inline-flex items-baseline gap-1.5">
          <span className="font-medium tabular-nums text-text-primary">
            {it.value}
          </span>
          <span>{it.label}</span>
        </li>
      ))}
    </ul>
  );
}
