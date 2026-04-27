/**
 * flows.config.ts — single registry of all flows.
 * /canvas and /prototype both read from here.
 * Adding a screen = one entry. Both views update automatically.
 */

import * as React from "react";

export type FlowId = "onboarding";

export type Screen = {
  id: string;
  label: string;
  Component: React.ComponentType;
};

export type Flow = {
  id: FlowId;
  label: string;
  screens: Screen[];
};

const Placeholder: React.ComponentType<{ label: string }> = ({ label }) =>
  React.createElement(
    "div",
    {
      className:
        "flex h-full w-full items-center justify-center bg-surface-raised text-text-secondary text-small",
    },
    label
  );
Placeholder.displayName = "PlaceholderScreen";

const make = (label: string): React.ComponentType => {
  const Component: React.ComponentType = () =>
    React.createElement(Placeholder, { label });
  Component.displayName = `Screen(${label})`;
  return Component;
};

export const flows: Flow[] = [
  {
    id: "onboarding",
    label: "Onboarding",
    screens: [
      { id: "welcome",   label: "Welcome",   Component: make("Welcome") },
      { id: "connect",   label: "Connect",   Component: make("Connect") },
      { id: "configure", label: "Configure", Component: make("Configure") },
      { id: "ready",     label: "Ready",     Component: make("Ready") },
    ],
  },
];

export const flowById = (id: string): Flow | undefined =>
  flows.find((f) => f.id === id);
