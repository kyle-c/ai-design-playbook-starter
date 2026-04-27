"use client";

import * as React from "react";

export function PrototypeFrame({
  flowLabel,
  screenLabels,
  children,
}: {
  flowLabel: string;
  screenLabels: string[];
  children: React.ReactNode;
}) {
  const screens = React.Children.toArray(children);
  const total = screens.length;
  const [step, setStep] = React.useState(0);

  const next = React.useCallback(
    () => setStep((s) => Math.min(s + 1, total - 1)),
    [total]
  );
  const prev = React.useCallback(
    () => setStep((s) => Math.max(s - 1, 0)),
    []
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-surface-inverse px-6 py-12">
      <div className="text-small text-text-on-inverse opacity-70">
        {flowLabel} · {step + 1} / {total} · {screenLabels[step]}
      </div>

      <button
        type="button"
        onClick={next}
        aria-label="Advance to next screen"
        className="overflow-hidden rounded-xl border border-subtle bg-surface-default shadow-lg"
        style={{ width: 390, height: 844 }}
      >
        {screens[step]}
      </button>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={step === 0}
          className="min-h-touch rounded-md bg-surface-raised px-4 text-body text-text-primary disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={step === total - 1}
          className="min-h-touch rounded-md bg-action-primary px-4 text-body text-text-on-brand disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </main>
  );
}
