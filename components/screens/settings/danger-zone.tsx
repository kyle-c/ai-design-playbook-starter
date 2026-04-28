"use client";

import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import en from "@/locales/en.json";

const t = en.settings.dangerZone;

export function DangerZoneScreen() {
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

      <div className="px-6 pb-2">
        <h1 className="text-h1 font-semibold tracking-snug text-text-primary">
          {t.title}
        </h1>
      </div>

      <div className="px-6 pt-4">
        <div
          role="note"
          className="flex items-start gap-3 rounded-md bg-feedback-warning-bg p-3 text-feedback-warning-fg"
        >
          <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p className="text-small">{t.warning}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 px-6">
        <DangerRow
          label={t.signOutEverywhere.label}
          body={t.signOutEverywhere.body}
          cta={t.signOutEverywhere.cta}
          variant="secondary"
        />
        <DangerRow
          label={t.deleteAccount.label}
          body={t.deleteAccount.body}
          cta={t.deleteAccount.cta}
          variant="destructive"
        />
      </div>
    </div>
  );
}

function DangerRow({
  label,
  body,
  cta,
  variant,
}: {
  label: string;
  body: string;
  cta: string;
  variant: "secondary" | "destructive";
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-subtle p-4">
      <p className="text-body font-medium text-text-primary">{label}</p>
      <p className="text-small text-text-secondary">{body}</p>
      <div className="mt-1">
        <Button variant={variant} size="sm">
          {cta}
        </Button>
      </div>
    </div>
  );
}
