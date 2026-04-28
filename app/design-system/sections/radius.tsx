import * as React from "react";
import { CopyChip } from "../lib/copy-chip";

const STEPS = [
  { name: "none", note: "Crisp edges, dense UI" },
  { name: "sm", note: "Inputs, badges" },
  { name: "md", note: "Buttons, default" },
  { name: "lg", note: "Cards" },
  { name: "xl", note: "Dialogs, sheets" },
  { name: "full", note: "Pills, avatars" },
];

export function RadiusSection() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {STEPS.map((s) => (
        <div
          key={s.name}
          className="flex flex-col items-center gap-2 rounded-md border border-subtle bg-surface-raised p-4"
        >
          <div
            className="h-16 w-full bg-action-primary"
            style={{ borderRadius: `var(--radius-${s.name})` }}
          />
          <span className="text-small font-medium text-text-primary">
            {s.name}
          </span>
          <span className="text-micro text-text-tertiary">{s.note}</span>
          <CopyChip
            value={`var(--radius-${s.name})`}
            label={`-${s.name}`}
          />
        </div>
      ))}
    </div>
  );
}
