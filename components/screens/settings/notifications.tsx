"use client";

import * as React from "react";
import { ArrowLeft } from "lucide-react";
import en from "@/locales/en.json";

const t = en.settings.notifications;

type ToggleId = "emailDigest" | "push" | "marketing" | "sound";

const ROWS: { id: ToggleId; defaultOn: boolean }[] = [
  { id: "emailDigest", defaultOn: true },
  { id: "push",        defaultOn: true },
  { id: "marketing",   defaultOn: false },
  { id: "sound",       defaultOn: false },
];

export function NotificationsScreen() {
  const [state, setState] = React.useState<Record<ToggleId, boolean>>(() =>
    ROWS.reduce(
      (acc, r) => ({ ...acc, [r.id]: r.defaultOn }),
      {} as Record<ToggleId, boolean>
    )
  );

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

      <ul className="mt-2 flex flex-col gap-1 px-3">
        {ROWS.map(({ id }) => {
          const item = t.items[id];
          const checked = state[id];
          return (
            <li key={id}>
              <label className="flex cursor-pointer items-start gap-4 rounded-md px-3 py-3 transition-colors hover:bg-surface-sunken">
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-body font-medium text-text-primary">
                    {item.label}
                  </span>
                  <span className="text-small text-text-secondary">{item.body}</span>
                </div>
                <Toggle
                  ariaLabel={item.label}
                  checked={checked}
                  onChange={(v) => setState((s) => ({ ...s, [id]: v }))}
                />
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Toggle({
  ariaLabel,
  checked,
  onChange,
}: {
  ariaLabel: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={
        "relative mt-0.5 inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 " +
        (checked ? "bg-action-primary" : "bg-surface-sunken")
      }
    >
      <span
        className={
          "inline-block h-5 w-5 rounded-full bg-text-on-brand shadow-sm transition-transform duration-fast ease-standard " +
          (checked ? "translate-x-[1.125rem]" : "translate-x-0.5")
        }
      />
    </button>
  );
}
