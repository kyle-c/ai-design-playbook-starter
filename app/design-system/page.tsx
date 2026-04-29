import { Suspense } from "react";

import { DSShell, type DSSection } from "./ds-shell";
import { getSystemStats } from "./lib/stats";

import { ColorSection } from "./sections/color";
import { PrimitivesSection } from "./sections/primitives";
import { TypographySection } from "./sections/typography";
import { SpacingSection } from "./sections/spacing";
import { ElevationSection } from "./sections/elevation";
import { IconographySection } from "./sections/iconography";
import { ButtonsSection } from "./sections/buttons";
import { FormsSection } from "./sections/forms";
import { FeedbackSection } from "./sections/feedback";
import { DisplaySection } from "./sections/display";
import { OverlaysSection } from "./sections/overlays";
import { RadiusSection } from "./sections/radius";
import { MotionSection } from "./sections/motion";

const SECTIONS: DSSection[] = [
  {
    id: "color",
    label: "Color",
    description:
      "Semantic tokens, side-by-side in light and dark themes. Components reference these names — never primitives.",
  },
  {
    id: "primitives",
    label: "Primitives",
    description:
      "Raw color ramps that semantic tokens point at. Reference only.",
  },
  {
    id: "typography",
    label: "Typography",
    description:
      "Size, weight, line-height, and tracking. Body 16 is the reading default.",
  },
  {
    id: "spacing",
    label: "Spacing",
    description: "4px base scale. Always reference the token, never raw px.",
  },
  {
    id: "elevation",
    label: "Elevation",
    description:
      "Borders are preferred for separation; shadows are only for floating surfaces.",
  },
  {
    id: "iconography",
    label: "Iconography",
    description:
      "lucide-react. Line-art only at 1.5px stroke; never mix with filled or 2-tone styles.",
  },
  {
    id: "buttons",
    label: "Buttons",
    description: "One primary action per surface. States shown side-by-side.",
    source: "components/ui/button.tsx",
  },
  {
    id: "forms",
    label: "Forms",
    description:
      "Input states across default, focus, filled, error, and disabled.",
    source: "components/ui/input.tsx",
  },
  {
    id: "feedback",
    label: "Feedback",
    description: "Badges, alerts, and skeletons.",
    source: "components/ui/alert.tsx",
  },
  {
    id: "display",
    label: "Display",
    description: "Cards, avatars, separators.",
    source: "components/ui/card.tsx",
  },
  {
    id: "overlays",
    label: "Overlays",
    description: "Tabs, dialog, tooltip, dropdown menu.",
    source: "components/ui/dialog.tsx",
  },
  {
    id: "radius",
    label: "Radius",
    description: "Six steps. Match radius to the size of the surface.",
  },
  {
    id: "motion",
    label: "Motion",
    description: "Four durations, two easings. Hover or tap to preview.",
  },
];

const SECTION_NODES: Record<string, React.ReactNode> = {
  color: <ColorSection />,
  primitives: <PrimitivesSection />,
  typography: <TypographySection />,
  spacing: <SpacingSection />,
  elevation: <ElevationSection />,
  iconography: <IconographySection />,
  buttons: <ButtonsSection />,
  forms: <FormsSection />,
  feedback: <FeedbackSection />,
  display: <DisplaySection />,
  overlays: <OverlaysSection />,
  radius: <RadiusSection />,
  motion: <MotionSection />,
};

/**
 * Living style guide presented as a project — left rail of "pages",
 * dark chrome, single-section view. Mirrors /canvas's UX so the
 * codebase reads as a coherent set of design tools, not a long doc.
 *
 * Public route per the playbook: no auth required.
 */
export default async function DesignSystemPage() {
  const stats = await getSystemStats();

  return (
    <Suspense fallback={null}>
      <DSShell sections={SECTIONS} stats={stats}>
        {SECTIONS.map((s) => (
          <div key={s.id} data-section-id={s.id} className="contents">
            {SECTION_NODES[s.id]}
          </div>
        ))}
      </DSShell>
    </Suspense>
  );
}
