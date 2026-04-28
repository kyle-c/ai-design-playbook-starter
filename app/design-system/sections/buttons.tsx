import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { SubSection } from "../lib/section";

type Variant = NonNullable<ButtonProps["variant"]>;
const VARIANTS: Variant[] = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "link",
  "destructive",
];

/**
 * Buttons section. Each variant is shown across all interactive
 * states so a designer can compare default → hover → active →
 * disabled side by side without having to interact with each one.
 *
 * "Hover" and "Active" are simulated with `!`-prefixed token classes
 * that override the variant's default fill, since CSS pseudo-states
 * can't be triggered programmatically.
 */
export function ButtonsSection() {
  return (
    <div className="space-y-10">
      <SubSection title="Variants × states">
        <div className="overflow-hidden rounded-md border border-subtle bg-surface-raised">
          <div className="grid grid-cols-[120px_repeat(4,1fr)] gap-px bg-border-subtle text-small">
            <Cell className="bg-surface-raised text-text-tertiary">Variant</Cell>
            <Cell className="bg-surface-raised text-text-tertiary">Default</Cell>
            <Cell className="bg-surface-raised text-text-tertiary">Hover</Cell>
            <Cell className="bg-surface-raised text-text-tertiary">Active</Cell>
            <Cell className="bg-surface-raised text-text-tertiary">Disabled</Cell>

            {VARIANTS.map((v) => (
              <React.Fragment key={v}>
                <Cell className="bg-surface-raised font-mono text-micro text-text-secondary">
                  {v}
                </Cell>
                <Cell>
                  <Button variant={v}>Save</Button>
                </Cell>
                <Cell>
                  <Button variant={v} className={hoverClass(v)}>
                    Save
                  </Button>
                </Cell>
                <Cell>
                  <Button variant={v} className={activeClass(v)}>
                    Save
                  </Button>
                </Cell>
                <Cell>
                  <Button variant={v} disabled>
                    Save
                  </Button>
                </Cell>
              </React.Fragment>
            ))}
          </div>
        </div>
      </SubSection>

      <SubSection title="Sizes">
        <div className="flex flex-wrap items-end gap-3 rounded-md border border-subtle bg-surface-raised p-6">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Icon button">
            +
          </Button>
        </div>
      </SubSection>

      <SubSection title="Usage">
        <ul className="space-y-2 rounded-md border border-subtle bg-surface-raised p-4 text-small text-text-secondary">
          <li>
            <span className="text-text-primary">Default</span> — the single
            primary action on a screen. Never two on one surface.
          </li>
          <li>
            <span className="text-text-primary">Secondary / Outline</span> —
            companion action when there&rsquo;s a clear primary, e.g. Cancel.
          </li>
          <li>
            <span className="text-text-primary">Ghost / Link</span> — tertiary
            actions that should not compete visually with the primary.
          </li>
          <li>
            <span className="text-text-primary">Destructive</span> — only for
            irreversible actions. Always pair with a confirmation dialog.
          </li>
        </ul>
      </SubSection>
    </div>
  );
}

function Cell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-surface-default px-3 py-4 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/* Force-on the variant's hover/active background so the cell shows
   the resolved style without requiring the user to actually hover. */
function hoverClass(v: Variant): string {
  switch (v) {
    case "default":
      return "!bg-action-primary-hover";
    case "secondary":
      return "!bg-action-secondary-hover";
    case "outline":
      return "!bg-surface-sunken";
    case "ghost":
      return "!bg-surface-sunken";
    case "link":
      return "!underline";
    case "destructive":
      return "!bg-action-danger-hover";
  }
}

function activeClass(v: Variant): string {
  switch (v) {
    case "default":
      return "!bg-action-primary-active";
    default:
      return hoverClass(v);
  }
}
