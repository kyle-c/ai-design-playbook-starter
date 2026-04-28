"use client";

import * as React from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import en from "@/locales/en.json";

const t = en.onboarding.email;

type Status = "idle" | "loading" | "error";

export function EmailScreen() {
  const [value, setValue] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!value.trim()) {
      setError(t.errors.required);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(value.trim())) {
      setError(t.errors.format);
      return;
    }

    /* Demo: simulate a request. Emails containing "fail" trigger a network
       error path so the screen can demonstrate that state too. */
    setStatus("loading");
    const fail = value.toLowerCase().includes("fail");
    window.setTimeout(() => {
      if (fail) {
        setStatus("error");
        setError(t.errors.network);
      } else {
        setStatus("idle");
        /* In a real flow, this would navigate to the verify screen. */
      }
    }, 1200);
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

      <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col px-6 pb-10">
        <div className="flex flex-col gap-3 pt-2">
          <h1 className="text-h1 font-semibold tracking-snug text-text-primary">
            {t.headline}
          </h1>
          <p className="text-body text-text-secondary">{t.body}</p>
        </div>

        <div className="mt-8 flex flex-col gap-2">
          <label htmlFor="email" className="text-small font-medium text-text-primary">
            {t.label}
          </label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t.placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? "email-error" : undefined}
            disabled={isLoading}
            className={
              error
                ? "border-feedback-danger-fg focus-visible:ring-feedback-danger-fg"
                : ""
            }
          />
          {error && (
            <p
              id="email-error"
              role="alert"
              className="text-small text-feedback-danger-fg"
            >
              {error}
            </p>
          )}
        </div>

        <div className="mt-auto pt-8">
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Sending…</span>
              </>
            ) : (
              t.submit
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
