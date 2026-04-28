import * as React from "react";
import { ViewSource } from "./view-source";

/* Standardized section header. Eyebrow pattern is removed; every
   section gets the same shape (title + description + optional
   "view source" link). Subsections handle internal grouping. */
export function Section({
  id,
  title,
  description,
  source,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  source?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-20 border-t border-subtle pt-10 pb-10"
    >
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-h2 font-semibold tracking-snug text-text-primary">
            {title}
          </h2>
          {description && (
            <p className="mt-1 max-w-2xl text-small text-text-secondary">
              {description}
            </p>
          )}
        </div>
        {source && <ViewSource path={source} />}
      </header>
      {children}
    </section>
  );
}

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
