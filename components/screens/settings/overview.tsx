"use client";

import { Bell, ChevronRight, CreditCard, HelpCircle, Lock, User } from "lucide-react";
import en from "@/locales/en.json";

const t = en.settings.overview;

const SECTIONS = [
  { id: "account",       label: t.sections.account,       icon: User,        href: "#" },
  { id: "notifications", label: t.sections.notifications, icon: Bell,        href: "#" },
  { id: "privacy",       label: t.sections.privacy,       icon: Lock,        href: "#" },
  { id: "billing",       label: t.sections.billing,       icon: CreditCard,  href: "#" },
  { id: "help",          label: t.sections.help,          icon: HelpCircle,  href: "#" },
];

export function OverviewScreen() {
  return (
    <div className="flex h-full w-full flex-col bg-surface-default">
      <header className="px-6 pb-2 pt-12">
        <h1 className="text-h1 font-semibold tracking-snug text-text-primary">
          {t.title}
        </h1>
      </header>

      <ul className="mt-2 flex flex-col px-3">
        {SECTIONS.map(({ id, label, icon: Icon, href }) => (
          <li key={id}>
            <a
              href={href}
              className="flex min-h-touch items-center gap-4 rounded-md px-3 py-3 text-text-primary transition-colors hover:bg-surface-sunken"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-sunken text-text-secondary">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="flex-1 text-body">{label}</span>
              <ChevronRight size={16} className="text-text-tertiary" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
