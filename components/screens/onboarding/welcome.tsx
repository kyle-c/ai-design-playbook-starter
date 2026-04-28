"use client";

/* Example screen. Demonstrates the rules for everything outside /components/ui:
   semantic intent classes (bg-surface-default, text-text-primary, action-primary)
   instead of shadcn aliases, copy from /locales/en.json, no hardcoded strings,
   touch targets enforced by min-h-touch on the Button primitive.
   See /skills/components.md for the full naming convention. */

import { Button } from "@/components/ui/button";
import en from "@/locales/en.json";

const t = en.onboarding.welcome;

export function WelcomeScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-surface-default">
      <header className="flex h-14 items-center px-6 text-text-tertiary">
        <Logo />
      </header>

      <div className="flex flex-1 flex-col justify-end gap-12 px-6 pb-10">
        <div className="flex flex-col gap-4">
          <p className="text-small font-medium uppercase tracking-wide text-action-primary">
            {t.eyebrow}
          </p>
          <h1 className="text-h1 font-semibold tracking-snug text-text-primary">
            {t.headline}
          </h1>
          <p className="text-body text-text-secondary">{t.body}</p>
        </div>

        <div className="flex flex-col gap-3">
          <Button size="lg" className="w-full">
            {t.ctaPrimary}
          </Button>
          <Button size="lg" variant="ghost" className="w-full">
            {t.ctaSecondary}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <svg width="80" height="20" viewBox="0 0 200 32" aria-label="Logo">
      <rect x="0" y="3" width="20" height="4" rx="1.5" className="fill-text-secondary" opacity={0.4} />
      <rect x="0" y="10" width="20" height="4" rx="1.5" className="fill-text-secondary" opacity={0.7} />
      <rect x="0" y="17" width="20" height="4" rx="1.5" className="fill-action-primary" />
      <text x="28" y="17" fontSize="14" fontWeight="600" className="fill-text-primary">
        Acme
      </text>
    </svg>
  );
}
