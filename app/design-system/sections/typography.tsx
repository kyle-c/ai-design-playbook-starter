import * as React from "react";
import { CopyChip } from "../lib/copy-chip";
import { SubSection } from "../lib/section";

/* Static class names so Tailwind's content scanner picks them up
   without relying on these literals being used elsewhere. */
const SIZES = [
  { name: "display", className: "text-display", sample: "Display 48", note: "Hero / marketing" },
  { name: "h1", className: "text-h1", sample: "Heading 1 — 32", note: "Page title" },
  { name: "h2", className: "text-h2", sample: "Heading 2 — 24", note: "Section title" },
  { name: "h3", className: "text-h3", sample: "Heading 3 — 20", note: "Sub-section title" },
  { name: "body", className: "text-body", sample: "Body — 16. The default reading size.", note: "Default" },
  { name: "small", className: "text-small", sample: "Small — 14. Captions, metadata.", note: "Helper text" },
  { name: "micro", className: "text-micro", sample: "Micro — 12. Legal, timestamps.", note: "Dense UI" },
];

const WEIGHTS = [
  { name: "regular", value: 400 },
  { name: "medium", value: 500 },
  { name: "semibold", value: 600 },
  { name: "bold", value: 700 },
];

const LINE_HEIGHTS = [
  { name: "tight", value: 1.05, note: "Hero / display" },
  { name: "snug", value: 1.15, note: "Headings" },
  { name: "normal", value: 1.5, note: "Body" },
  { name: "relaxed", value: 1.7, note: "Long-form prose" },
];

const TRACKING = [
  { name: "tight", value: "-0.02em", note: "Display" },
  { name: "snug", value: "-0.01em", note: "Headings" },
  { name: "normal", value: "0", note: "Body" },
  { name: "wide", value: "0.04em", note: "Eyebrows / labels" },
];

export function TypographySection() {
  return (
    <div className="space-y-10">
      <SubSection title="Size scale">
        <div className="space-y-4 rounded-md border border-subtle bg-surface-raised p-4">
          {SIZES.map((s) => (
            <div
              key={s.name}
              className="flex flex-wrap items-baseline justify-between gap-3 border-b border-subtle pb-3 last:border-b-0 last:pb-0"
            >
              <p
                className={`font-semibold tracking-snug text-text-primary ${s.className}`}
              >
                {s.sample}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-micro text-text-tertiary">{s.note}</span>
                <CopyChip
                  value={`var(--font-size-${s.name})`}
                  label={`-${s.name}`}
                />
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Weight">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {WEIGHTS.map((w) => (
            <div
              key={w.name}
              className="rounded-md border border-subtle bg-surface-raised p-4"
            >
              <p
                className="text-h3 text-text-primary"
                style={{ fontWeight: w.value }}
              >
                Aa
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-small text-text-secondary">{w.name}</span>
                <CopyChip
                  value={`var(--font-weight-${w.name})`}
                  label={`${w.value}`}
                />
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Line height">
        <div className="grid gap-3 sm:grid-cols-2">
          {LINE_HEIGHTS.map((lh) => (
            <div
              key={lh.name}
              className="rounded-md border border-subtle bg-surface-raised p-4"
            >
              <p
                className="text-body text-text-primary"
                style={{ lineHeight: lh.value }}
              >
                The brown fox jumped over the lazy dog at a calm, deliberate
                pace.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-small text-text-secondary">
                  {lh.name} · {lh.note}
                </span>
                <CopyChip
                  value={`var(--line-height-${lh.name})`}
                  label={`${lh.value}`}
                />
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Letter spacing">
        <div className="grid gap-3 sm:grid-cols-2">
          {TRACKING.map((t) => (
            <div
              key={t.name}
              className="rounded-md border border-subtle bg-surface-raised p-4"
            >
              <p
                className="text-h3 font-semibold text-text-primary"
                style={{ letterSpacing: t.value }}
              >
                {t.name === "wide" ? "EYEBROW LABEL" : "Heading sample"}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-small text-text-secondary">
                  {t.name} · {t.note}
                </span>
                <CopyChip
                  value={`var(--tracking-${t.name})`}
                  label={t.value}
                />
              </div>
            </div>
          ))}
        </div>
      </SubSection>
    </div>
  );
}
