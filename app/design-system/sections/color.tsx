import * as React from "react";
import { CopyChip } from "../lib/copy-chip";
import { SubSection } from "../lib/section";

const GROUPS: { title: string; names: string[] }[] = [
  {
    title: "Surface",
    names: [
      "surface-default",
      "surface-raised",
      "surface-sunken",
      "surface-inverse",
    ],
  },
  {
    title: "Text",
    names: [
      "text-primary",
      "text-secondary",
      "text-tertiary",
      "text-disabled",
      "text-on-brand",
      "text-on-inverse",
    ],
  },
  {
    title: "Border",
    names: [
      "border-subtle",
      "border-default",
      "border-strong",
      "border-focus",
    ],
  },
  {
    title: "Action",
    names: [
      "action-primary",
      "action-primary-hover",
      "action-primary-active",
      "action-secondary",
      "action-secondary-hover",
      "action-danger",
      "action-danger-hover",
    ],
  },
  {
    title: "Feedback",
    names: [
      "feedback-success-bg",
      "feedback-success-fg",
      "feedback-warning-bg",
      "feedback-warning-fg",
      "feedback-danger-bg",
      "feedback-danger-fg",
    ],
  },
];

export function ColorSection() {
  return (
    <div className="space-y-10">
      {GROUPS.map((g) => (
        <SubSection key={g.title} title={g.title}>
          <div className="grid gap-px overflow-hidden rounded-md border border-subtle bg-border-subtle md:grid-cols-2">
            <ThemeColumn theme="light" names={g.names} />
            <ThemeColumn theme="dark" names={g.names} />
          </div>
        </SubSection>
      ))}
    </div>
  );
}

function ThemeColumn({
  theme,
  names,
}: {
  theme: "light" | "dark";
  names: string[];
}) {
  return (
    <div data-theme={theme} className="bg-surface-default p-4">
      <p className="mb-3 text-micro uppercase tracking-wide text-text-tertiary">
        {theme}
      </p>
      <div className="grid gap-2">
        {names.map((n) => (
          <Swatch key={n} name={n} />
        ))}
      </div>
    </div>
  );
}

function Swatch({ name }: { name: string }) {
  const cssVar = `--color-${name}`;
  return (
    <div className="flex items-center gap-3 rounded-sm bg-surface-raised px-2 py-1.5">
      <div
        className="h-7 w-7 shrink-0 rounded-sm border border-subtle"
        style={{ background: `var(${cssVar})` }}
      />
      <span className="flex-1 truncate text-small text-text-primary">
        {name}
      </span>
      <CopyChip value={`var(${cssVar})`} label={cssVar} />
    </div>
  );
}
