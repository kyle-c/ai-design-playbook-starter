"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import en from "@/locales/en.json";

const t = en.onboarding.ready;

export function ReadyScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-surface-default">
      <div className="flex h-14" />

      <div className="flex flex-1 flex-col items-start justify-end gap-12 px-6 pb-10">
        <div className="flex flex-col gap-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-feedback-success-bg text-feedback-success-fg">
            <Check size={24} aria-hidden="true" />
          </span>
          <p className="text-small font-medium uppercase tracking-wide text-feedback-success-fg">
            {t.eyebrow}
          </p>
          <h1 className="text-h1 font-semibold tracking-snug text-text-primary">
            {t.headline}
          </h1>
          <p className="text-body text-text-secondary">{t.body}</p>
        </div>

        <Button size="lg" className="w-full">
          {t.ctaPrimary}
        </Button>
      </div>
    </div>
  );
}
