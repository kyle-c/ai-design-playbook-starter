import * as React from "react";
import { CopyChip } from "../lib/copy-chip";

const LEVELS = [
  { name: "none", note: "Flat — separated by border alone" },
  { name: "sm", note: "Cards, subtle separation" },
  { name: "md", note: "Dropdowns, popovers" },
  { name: "lg", note: "Dialogs, modals" },
];

/**
 * Tokens.css defines four elevation levels. Borders are preferred
 * for separation in this system; shadows are for floating surfaces
 * specifically (anything that breaks the page's flat plane).
 */
export function ElevationSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {LEVELS.map((l) => (
        <div
          key={l.name}
          className="flex flex-col items-stretch gap-3 rounded-md border border-subtle bg-surface-sunken p-4"
        >
          <div
            className="flex h-24 items-center justify-center rounded-md bg-surface-default text-small text-text-secondary"
            style={{ boxShadow: `var(--shadow-${l.name})` }}
          >
            shadow-{l.name}
          </div>
          <p className="text-micro text-text-tertiary">{l.note}</p>
          <CopyChip
            value={`var(--shadow-${l.name})`}
            label={`--shadow-${l.name}`}
          />
        </div>
      ))}
    </div>
  );
}
