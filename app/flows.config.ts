/**
 * flows.config.ts — single registry of all flows.
 *
 * /canvas (canvas / prototype / graph views) reads from here.
 * Adding a screen = one entry. Every view updates automatically.
 *
 * Convention: real screens live in /components/screens/[flow]/[screen].tsx
 * and are imported here. Keep this file as a thin registry.
 *
 * To scaffold a new flow + screens automatically:
 *   npm run new-flow -- <flow-id> <screen,screen,screen>
 */

import { WelcomeScreen } from "@/components/screens/onboarding/welcome";
import { EmailScreen } from "@/components/screens/onboarding/email";
import { VerifyScreen } from "@/components/screens/onboarding/verify";
import { ReadyScreen } from "@/components/screens/onboarding/ready";

import { OverviewScreen } from "@/components/screens/settings/overview";
import { NotificationsScreen } from "@/components/screens/settings/notifications";
import { DangerZoneScreen } from "@/components/screens/settings/danger-zone";
/* AUTOFLOWS:IMPORTS — npm run new-flow inserts above this line. Do not move. */

import * as React from "react";

export type Screen = {
  id: string;
  label: string;
  Component: React.ComponentType;
};

export type Flow = {
  /** Unique id (kebab-case or camelCase). Referenced by /canvas?flow=... */
  id: string;
  label: string;
  /** Marks the canonical entry-point flow. Optional. */
  entry?: boolean;
  /** Last screen of this flow can hand off to another flow's entry. */
  nextFlow?: string;
  screens: Screen[];
};

export const flows: Flow[] = [
  {
    id: "onboarding",
    label: "Onboarding",
    entry: true,
    /* `nextFlow` is illustrative — the demo connects Onboarding → Settings so
       the graph view shows the cross-flow indigo arrow. Real flows usually
       hand off based on conditional state; remove or rewire when you build
       your real flows. */
    nextFlow: "settings",
    screens: [
      { id: "welcome", label: "Welcome", Component: WelcomeScreen },
      { id: "email",   label: "Email",   Component: EmailScreen },
      { id: "verify",  label: "Verify",  Component: VerifyScreen },
      { id: "ready",   label: "Ready",   Component: ReadyScreen },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    screens: [
      { id: "overview",      label: "Overview",      Component: OverviewScreen },
      { id: "notifications", label: "Notifications", Component: NotificationsScreen },
      { id: "danger-zone",   label: "Danger zone",   Component: DangerZoneScreen },
    ],
  },
  /* AUTOFLOWS:ENTRIES — npm run new-flow inserts above this line. Do not move. */
];

export const flowById = (id: string): Flow | undefined =>
  flows.find((f) => f.id === id);
