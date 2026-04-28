"use client";

import * as React from "react";
import { CopyChip } from "../lib/copy-chip";
import { SubSection } from "../lib/section";

const DURATIONS = [
  { name: "instant", value: "100ms", note: "Discrete state changes" },
  { name: "fast", value: "150ms", note: "Default — most UI transitions" },
  { name: "medium", value: "200ms", note: "Layout shifts" },
  { name: "slow", value: "300ms", note: "Hero / page-level moments" },
];

const EASINGS = [
  {
    name: "standard",
    value: "cubic-bezier(0.4, 0, 0.2, 1)",
    note: "Default — symmetric ease",
  },
  {
    name: "emphasized",
    value: "cubic-bezier(0.2, 0, 0, 1)",
    note: "Asymmetric — entries / reveals",
  },
];

/**
 * Motion previews. Hover any tile to see the duration applied to a
 * scale + translate. The "play" button drives a one-shot animation
 * for users on touch devices that can't hover. Reduced-motion is
 * respected globally via the `@media (prefers-reduced-motion)`
 * block in tokens.css.
 */
export function MotionSection() {
  const [pulse, setPulse] = React.useState(0);
  const trigger = () => setPulse((n) => n + 1);

  return (
    <div className="space-y-10">
      <SubSection title="Duration" hint="Hover or tap to play">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DURATIONS.map((d) => (
            <div
              key={d.name}
              className="flex flex-col items-center gap-3 rounded-md border border-subtle bg-surface-raised p-4"
            >
              <div className="flex h-20 w-full items-center justify-center overflow-hidden">
                <div
                  key={`${d.name}-${pulse}`}
                  className="h-12 w-12 rounded-md bg-action-primary"
                  style={{
                    transition: `transform var(--duration-${d.name}) var(--easing-standard)`,
                    transform: pulse % 2 === 1 ? "scale(1.4)" : "scale(1)",
                  }}
                />
              </div>
              <div className="grid w-full gap-1 text-center">
                <span className="text-small font-medium text-text-primary">
                  {d.name}
                </span>
                <span className="font-mono text-micro text-text-tertiary">
                  {d.value}
                </span>
                <span className="text-micro text-text-tertiary">{d.note}</span>
              </div>
              <CopyChip
                value={`var(--duration-${d.name})`}
                label={`-${d.name}`}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={trigger}
            className="inline-flex min-h-touch items-center rounded-md bg-action-primary px-5 text-small font-medium text-text-on-brand hover:bg-action-primary-hover"
          >
            Play all
          </button>
        </div>
      </SubSection>

      <SubSection title="Easing">
        <div className="grid gap-3 sm:grid-cols-2">
          {EASINGS.map((e) => (
            <div
              key={e.name}
              className="rounded-md border border-subtle bg-surface-raised p-4"
            >
              <p className="text-small font-medium text-text-primary">
                {e.name}
              </p>
              <p className="mt-1 font-mono text-micro text-text-tertiary">
                {e.value}
              </p>
              <p className="mt-2 text-small text-text-secondary">{e.note}</p>
              <div className="mt-3">
                <CopyChip
                  value={`var(--easing-${e.name})`}
                  label={`-${e.name}`}
                />
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <p className="text-small text-text-tertiary">
        All animations respect{" "}
        <code className="font-mono">prefers-reduced-motion</code> via a global
        override in <code className="font-mono">/styles/tokens.css</code>.
      </p>
    </div>
  );
}
