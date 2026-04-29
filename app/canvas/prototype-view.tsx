"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FlowMeta } from "./canvas-shell";

export function PrototypeView({
  flows,
  screensByKey,
}: {
  flows: FlowMeta[];
  screensByKey: Map<string, React.ReactNode>;
}) {
  /* Flatten visible flows into a single ordered click-through. */
  const sequence = React.useMemo(
    () =>
      flows.flatMap((f) =>
        f.screens.map((s) => ({
          flowLabel: f.label,
          screenLabel: s.label,
          key: `${f.id}/${s.id}`,
        }))
      ),
    [flows]
  );

  const total = sequence.length;
  const [step, setStep] = React.useState(0);

  /* Reset step when the visible sequence changes (flow filter switched). */
  React.useEffect(() => {
    setStep(0);
  }, [flows]);

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

  if (total === 0) {
    return (
      <div className="flex h-full items-center justify-center text-white/50">
        No screens to preview.
      </div>
    );
  }

  const current = sequence[step];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-chrome-canvas px-6">
      <div className="text-small text-white/60">
        {current.flowLabel} · {step + 1} / {total} · {current.screenLabel}
      </div>

      {/* Keyboard-accessible div, NOT a <button>. The button element applies
          UA defaults (text-align: center, its own font-family) that inherit
          into the screen, making the SAME screen render differently here vs
          /canvas (which wraps in a plain div). role+tabIndex+keydown gives us
          parity in semantics without parity in styling. */}
      <div
        role="button"
        tabIndex={0}
        onClick={next}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            next();
          }
        }}
        aria-label="Advance to next screen"
        className="cursor-pointer overflow-hidden rounded-2xl bg-surface-default ring-1 ring-white/10 shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        style={{ width: 390, height: 844 }}
      >
        {screensByKey.get(current.key)}
      </div>

      <div className="flex items-center gap-2">
        <FrameButton
          onClick={prev}
          disabled={step === 0}
          ariaLabel="Previous screen"
        >
          <ChevronLeft size={16} />
          Back
        </FrameButton>
        <FrameButton
          onClick={next}
          disabled={step === total - 1}
          ariaLabel="Next screen"
          primary
        >
          Next
          <ChevronRight size={16} />
        </FrameButton>
      </div>
    </div>
  );
}

function FrameButton({
  onClick,
  disabled,
  ariaLabel,
  primary,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  ariaLabel: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={
        "inline-flex min-h-touch items-center gap-1 rounded-md px-4 text-small font-medium disabled:opacity-30 " +
        (primary
          ? "bg-white text-black hover:bg-white/90"
          : "bg-white/10 text-white hover:bg-white/15")
      }
    >
      {children}
    </button>
  );
}
