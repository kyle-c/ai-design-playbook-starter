import * as React from "react";
import { CopyChip } from "../lib/copy-chip";

const STEPS = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];

const PX: Record<number, string> = {
  0: "0",
  1: "4",
  2: "8",
  3: "12",
  4: "16",
  5: "20",
  6: "24",
  8: "32",
  10: "40",
  12: "48",
  16: "64",
  20: "80",
  24: "96",
};

export function SpacingSection() {
  return (
    <div className="rounded-md border border-subtle bg-surface-raised p-4">
      <ul className="space-y-2">
        {STEPS.map((n) => (
          <li key={n} className="flex items-center gap-3">
            <code className="w-20 shrink-0 font-mono text-small text-text-secondary">
              space-{n}
            </code>
            <span className="w-10 shrink-0 text-right font-mono text-micro text-text-tertiary">
              {PX[n]}px
            </span>
            <div
              className="h-3 rounded-sm bg-action-primary"
              style={{ width: `var(--space-${n})` }}
            />
            <span className="ml-auto">
              <CopyChip
                value={`var(--space-${n})`}
                label={`-${n}`}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
