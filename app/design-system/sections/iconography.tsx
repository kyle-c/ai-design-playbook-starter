import * as React from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Info,
  Mail,
  Plus,
  Search,
  Settings,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { SubSection } from "../lib/section";

const COMMON: { name: string; Icon: LucideIcon }[] = [
  { name: "ArrowLeft", Icon: ArrowLeft },
  { name: "ArrowRight", Icon: ArrowRight },
  { name: "Check", Icon: Check },
  { name: "X", Icon: X },
  { name: "ChevronDown", Icon: ChevronDown },
  { name: "ChevronRight", Icon: ChevronRight },
  { name: "Plus", Icon: Plus },
  { name: "Search", Icon: Search },
  { name: "Settings", Icon: Settings },
  { name: "User", Icon: User },
  { name: "Mail", Icon: Mail },
  { name: "Bell", Icon: Bell },
  { name: "AlertCircle", Icon: AlertCircle },
  { name: "Info", Icon: Info },
];

const SIZES = [12, 14, 16, 20, 24];

/**
 * Lucide-react is the project's icon library. Icons are line-art at
 * 1.5px stroke; never mix with filled or 2-tone styles. Default size
 * is 16 inside body text, 20 inside buttons, 24 in headers.
 */
export function IconographySection() {
  return (
    <div className="space-y-10">
      <SubSection title="Sizes" hint="Match icon size to surrounding text">
        <div className="flex flex-wrap items-end gap-6 rounded-md border border-subtle bg-surface-raised p-6">
          {SIZES.map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <Settings size={s} className="text-text-primary" />
              <span className="text-micro text-text-tertiary">{s}px</span>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Common icons" hint="From lucide-react">
        <div className="grid gap-2 rounded-md border border-subtle bg-surface-raised p-3 sm:grid-cols-3 lg:grid-cols-4">
          {COMMON.map(({ name, Icon }) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-sm px-2 py-2 text-small text-text-secondary hover:bg-surface-sunken"
            >
              <Icon size={16} className="shrink-0 text-text-primary" />
              <code className="font-mono text-micro">{name}</code>
            </div>
          ))}
        </div>
      </SubSection>
    </div>
  );
}
