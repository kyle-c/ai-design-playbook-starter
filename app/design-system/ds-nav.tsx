"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "color", label: "Color" },
  { id: "primitives", label: "Primitives" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "elevation", label: "Elevation" },
  { id: "iconography", label: "Iconography" },
  { id: "buttons", label: "Buttons" },
  { id: "forms", label: "Forms" },
  { id: "feedback", label: "Feedback" },
  { id: "display", label: "Display" },
  { id: "overlays", label: "Overlays" },
  { id: "radius", label: "Radius" },
  { id: "motion", label: "Motion" },
];

/**
 * Sticky section nav with scroll-spy. The page is ~4500px tall once
 * fully populated; cmd-F is not enough. Active section is detected
 * with IntersectionObserver — the first intersecting section in
 * top-to-bottom order wins. The rootMargin trims the top 15% and
 * bottom 70% of the viewport so the active state flips when a
 * heading reaches the upper third, not the very edge.
 */
export function DSNav() {
  const [active, setActive] = React.useState<string>(SECTIONS[0].id);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Design system sections"
      className="sticky top-8 hidden lg:block"
    >
      <p className="mb-3 text-micro font-semibold uppercase tracking-wide text-text-tertiary">
        Sections
      </p>
      <ul className="space-y-px text-small">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={cn(
                "block rounded px-2 py-1 transition-colors",
                active === s.id
                  ? "bg-surface-sunken text-text-primary"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
