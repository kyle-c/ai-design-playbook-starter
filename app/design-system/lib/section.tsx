import * as React from "react";

/**
 * Inner grouping label inside a section page (e.g. "Surface", "Text"
 * inside Color). Section-level chrome — title, description, view
 * source — is rendered by the design-system shell, not here.
 */
export function SubSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8 last:mb-0">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-micro font-semibold uppercase tracking-wide text-text-tertiary">
          {title}
        </h3>
        {hint && <span className="text-micro text-text-tertiary">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
