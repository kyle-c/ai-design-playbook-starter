import * as React from "react";
import { CopyChip } from "../lib/copy-chip";
import { SubSection } from "../lib/section";

const RAMPS: { title: string; prefix: string; steps: number[] }[] = [
  {
    title: "Neutral",
    prefix: "neutral",
    steps: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950],
  },
  { title: "Brand", prefix: "brand", steps: [50, 100, 400, 500, 600, 700] },
  { title: "Accent", prefix: "accent", steps: [100, 500, 600, 700] },
  { title: "Success", prefix: "success", steps: [100, 500, 600, 700] },
  { title: "Warning", prefix: "warning", steps: [500] },
  { title: "Danger", prefix: "danger", steps: [100, 500, 600, 700] },
];

/**
 * Primitives are the raw color values that semantic tokens point at.
 * Components MUST NOT reference these directly — use the semantic
 * layer above. This panel exists so the relationship is legible.
 */
export function PrimitivesSection() {
  return (
    <div className="space-y-8">
      <p className="rounded-md border border-subtle bg-surface-raised px-4 py-3 text-small text-text-secondary">
        Reference only — components must use semantic tokens (e.g.{" "}
        <code className="font-mono">--color-action-primary</code>), not the
        primitives shown here.
      </p>

      {RAMPS.map((r) => (
        <SubSection key={r.prefix} title={r.title}>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {r.steps.map((s) => (
              <PrimitiveSwatch key={s} prefix={r.prefix} step={s} />
            ))}
          </div>
        </SubSection>
      ))}
    </div>
  );
}

function PrimitiveSwatch({ prefix, step }: { prefix: string; step: number }) {
  const cssVar = `--color-${prefix}-${step}`;
  return (
    <div className="overflow-hidden rounded-md border border-subtle">
      <div
        className="h-12 w-full"
        style={{ background: `var(${cssVar})` }}
      />
      <div className="flex items-center justify-between gap-2 bg-surface-raised px-2 py-1.5">
        <span className="text-micro font-medium text-text-primary">
          {prefix}-{step}
        </span>
        <CopyChip value={`var(${cssVar})`} label={`-${step}`} />
      </div>
    </div>
  );
}
