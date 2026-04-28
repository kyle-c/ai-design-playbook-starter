"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

/**
 * Click-to-copy chip for token names. Designers and engineers want to
 * grab the var(--…) string without retyping it; this is the primary
 * way to interact with the design-system page.
 */
export function CopyChip({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const onClick = () => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      })
      .catch(() => {
        /* clipboard API unavailable (insecure context, sandbox); ignore. */
      });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Copy ${label ?? value}`}
      className="inline-flex max-w-full items-center gap-1 rounded-sm border border-subtle bg-surface-default px-1.5 py-0.5 font-mono text-micro text-text-secondary transition-colors hover:border-medium hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-action-primary"
    >
      <span className="truncate">{label ?? value}</span>
      {copied ? (
        <Check size={11} className="shrink-0 text-feedback-success-fg" />
      ) : (
        <Copy size={11} className="shrink-0 opacity-50" />
      )}
    </button>
  );
}
