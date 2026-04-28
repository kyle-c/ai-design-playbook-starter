/**
 * flows.config.ts — single registry of all flows.
 *
 * /canvas (canvas / prototype / graph views) reads from here.
 * Adding a screen = one entry. Every view updates automatically.
 *
 * Convention: real screens live in /components/screens/[flow]/[screen].tsx
 * and are imported here. Keep this file as a thin registry.
 */

import * as React from "react";

import { WelcomeScreen } from "@/components/screens/onboarding/welcome";
import { EmailScreen } from "@/components/screens/onboarding/email";
import { VerifyScreen } from "@/components/screens/onboarding/verify";
import { ReadyScreen } from "@/components/screens/onboarding/ready";

export type FlowId = "onboarding" | "settings";

export type Screen = {
  id: string;
  label: string;
  Component: React.ComponentType;
};

export type Flow = {
  id: FlowId;
  label: string;
  /** Marks the canonical entry-point flow. Optional. */
  entry?: boolean;
  /** Last screen of this flow can hand off to another flow's entry. */
  nextFlow?: FlowId;
  screens: Screen[];
};

/* Stub component used by the settings flow until those screens are built.
   Keeping this here (rather than inline in flow definitions) lets the lint
   rule about display names stay satisfied. */
const ComingSoon: React.ComponentType<{ label: string }> = ({ label }) =>
  React.createElement(
    "div",
    {
      className:
        "flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-default px-6 text-center",
    },
    React.createElement(
      "p",
      { className: "text-h3 font-semibold text-text-primary" },
      label
    ),
    React.createElement(
      "p",
      { className: "text-small text-text-secondary" },
      "Placeholder. Build the real layout in /components/screens/settings/."
    )
  );
ComingSoon.displayName = "ComingSoon";

const stub = (label: string): React.ComponentType => {
  const Component: React.ComponentType = () =>
    React.createElement(ComingSoon, { label });
  Component.displayName = `StubScreen(${label})`;
  return Component;
};

export const flows: Flow[] = [
  {
    id: "onboarding",
    label: "Onboarding",
    entry: true,
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
      { id: "overview",      label: "Overview",      Component: stub("Overview") },
      { id: "notifications", label: "Notifications", Component: stub("Notifications") },
      { id: "danger-zone",   label: "Danger zone",   Component: stub("Danger zone") },
    ],
  },
];

export const flowById = (id: string): Flow | undefined =>
  flows.find((f) => f.id === id);
