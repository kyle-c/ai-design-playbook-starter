"use client";

import * as React from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import en from "@/locales/en.json";

const t = en.onboarding.verify;
const RESEND_SECONDS = 30;
const CORRECT_CODE = "424242";

type Status = "idle" | "loading" | "error";

export function VerifyScreen() {
  const [digits, setDigits] = React.useState<string[]>(Array(6).fill(""));
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [resendIn, setResendIn] = React.useState(RESEND_SECONDS);
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    if (resendIn === 0) return;
    const id = window.setInterval(() => setResendIn((n) => Math.max(0, n - 1)), 1000);
    return () => window.clearInterval(id);
  }, [resendIn]);

  const setDigit = (i: number, v: string) => {
    /* Accept only the last digit when a paste lands. Prefilling is fine. */
    const next = [...digits];
    const cleaned = v.replace(/\D/g, "");
    if (cleaned.length > 1) {
      /* Multi-char paste: fill from current index forward. */
      for (let k = 0; k < cleaned.length && i + k < 6; k++) {
        next[i + k] = cleaned[k];
      }
      const lastFilled = Math.min(5, i + cleaned.length - 1);
      setDigits(next);
      inputs.current[lastFilled]?.focus();
      return;
    }
    next[i] = cleaned;
    setDigits(next);
    if (cleaned && i < 5) inputs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const submit = () => {
    setError(null);
    const code = digits.join("");
    if (code.length < 6) {
      setError(t.errors.incomplete);
      return;
    }
    setStatus("loading");
    window.setTimeout(() => {
      if (code !== CORRECT_CODE) {
        setStatus("error");
        setError(t.errors.incorrect);
      } else {
        setStatus("idle");
        /* In a real flow, navigate to the ready screen. */
      }
    }, 1000);
  };

  const isLoading = status === "loading";

  return (
    <div className="flex h-full w-full flex-col bg-surface-default">
      <header className="flex h-14 items-center px-3">
        <button
          type="button"
          aria-label={t.back}
          className="inline-flex h-11 min-h-touch w-11 min-w-touch items-center justify-center rounded-md text-text-secondary hover:bg-surface-sunken hover:text-text-primary"
        >
          <ArrowLeft size={18} />
        </button>
      </header>

      <div className="flex flex-1 flex-col px-6 pb-10">
        <div className="flex flex-col gap-3 pt-2">
          <h1 className="text-h1 font-semibold tracking-snug text-text-primary">
            {t.headline}
          </h1>
          <p className="text-body text-text-secondary">
            {t.bodyPrefix} <span className="font-medium text-text-primary">you@example.com</span>.
          </p>
        </div>

        <fieldset className="mt-8 flex flex-col gap-3" aria-describedby={error ? "code-error" : undefined}>
          <legend className="text-small font-medium text-text-primary">{t.label}</legend>
          <div className="flex justify-between gap-2" role="group">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={i === 0 ? "one-time-code" : "off"}
                aria-label={`Digit ${i + 1}`}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={onKeyDown(i)}
                maxLength={6 /* allow paste; we trim in setDigit */}
                disabled={isLoading}
                className={
                  "h-12 min-h-touch w-11 rounded-md border bg-surface-default text-center text-h3 tabular-nums text-text-primary " +
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 disabled:opacity-60 " +
                  (error ? "border-feedback-danger-fg" : "border-subtle")
                }
              />
            ))}
          </div>
          {error && (
            <p id="code-error" role="alert" className="text-small text-feedback-danger-fg">
              {error}
            </p>
          )}
        </fieldset>

        <div className="mt-6">
          <button
            type="button"
            disabled={resendIn > 0}
            className="text-small font-medium text-action-primary hover:underline disabled:cursor-not-allowed disabled:text-text-tertiary disabled:no-underline"
          >
            {resendIn > 0
              ? t.resendCountdown.replace("{seconds}", String(resendIn))
              : t.resendIdle}
          </button>
        </div>

        <div className="mt-auto pt-8">
          <Button
            onClick={submit}
            size="lg"
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying…</span>
              </>
            ) : (
              t.submit
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
