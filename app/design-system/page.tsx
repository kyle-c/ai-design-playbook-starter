"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Info,
  Settings,
  User,
  CreditCard,
  LogOut,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Living style guide. Auto-reflects current values from /styles/tokens.css
 * because every swatch reads its CSS variable directly.
 *
 * Public route (per playbook): no auth required for the team.
 *
 * Note: this page is a client component because the overlay primitives
 * (Dialog, Tooltip, DropdownMenu, Tabs) need interactivity. The route is
 * not perf-sensitive — it's a design-time reference, not a hot path.
 */
export default function DesignSystemPage() {
  return (
    <TooltipProvider>
      <main className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-12 flex items-start justify-between gap-6">
          <div>
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-1 text-small text-text-tertiary transition-colors hover:text-text-secondary"
            >
              <ArrowLeft size={14} />
              Home
            </Link>
            <p className="text-small uppercase tracking-wide text-text-secondary">
              Design system
            </p>
            <h1 className="mt-2 text-display font-semibold tracking-tight">
              Living reference
            </h1>
            <p className="mt-3 max-w-2xl text-body text-text-secondary">
              Generated from the codebase. Every swatch, every component, every
              value below reflects the current state of the system. To change
              it, edit{" "}
              <code className="font-mono text-small">/styles/tokens.css</code>.
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* ---------------------------------------------------------------- */}

        <Section title="Color — semantic tokens">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <Swatch name="surface-default" var="--color-surface-default" />
            <Swatch name="surface-raised"  var="--color-surface-raised" />
            <Swatch name="surface-sunken"  var="--color-surface-sunken" />
            <Swatch name="text-primary"    var="--color-text-primary" />
            <Swatch name="text-secondary"  var="--color-text-secondary" />
            <Swatch name="action-primary"  var="--color-action-primary" />
            <Swatch name="action-danger"   var="--color-action-danger" />
            <Swatch name="border-subtle"   var="--color-border-subtle" />
            <Swatch name="border-focus"    var="--color-border-focus" />
          </div>
        </Section>

        <Section title="Typography">
          <div className="space-y-4">
            <p className="text-display font-semibold tracking-tight">Display 48</p>
            <p className="text-h1 font-semibold tracking-snug">Heading 1 — 32</p>
            <p className="text-h2 font-semibold tracking-snug">Heading 2 — 24</p>
            <p className="text-h3 font-semibold">Heading 3 — 20</p>
            <p className="text-body">
              Body — 16. The brown fox jumped over the lazy dog at a calm,
              deliberate pace.
            </p>
            <p className="text-small text-text-secondary">
              Small — 14. Captions, metadata, helper text.
            </p>
            <p className="text-micro text-text-tertiary">
              Micro — 12. Legal, timestamps, dense UI.
            </p>
          </div>
        </Section>

        <Section title="Spacing scale">
          <div className="space-y-2">
            {[1, 2, 3, 4, 6, 8, 12, 16].map((n) => (
              <div key={n} className="flex items-center gap-3">
                <code className="w-16 font-mono text-small text-text-secondary">
                  space-{n}
                </code>
                <div
                  className="h-3 rounded-sm bg-action-primary"
                  style={{ width: `var(--space-${n})` }}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Save changes</Button>
            <Button variant="secondary">Cancel</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Skip for now</Button>
            <Button variant="link">Learn more</Button>
            <Button variant="destructive">Delete account</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-3">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </Section>

        {/* ---------------------------------------------------------------- */}

        <Section
          title="Forms"
          eyebrow="Label, Input, Textarea, Select, Checkbox, Switch"
        >
          <div className="grid max-w-md gap-6">
            <Field label="Email" htmlFor="ds-email">
              <Input id="ds-email" type="email" placeholder="you@example.com" />
            </Field>

            <Field label="Short bio" htmlFor="ds-bio">
              <Textarea
                id="ds-bio"
                rows={3}
                placeholder="Tell us a little about yourself."
              />
            </Field>

            <Field label="Timezone" htmlFor="ds-tz">
              <Select>
                <SelectTrigger id="ds-tz">
                  <SelectValue placeholder="Pick a timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt">Pacific (PT)</SelectItem>
                  <SelectItem value="mt">Mountain (MT)</SelectItem>
                  <SelectItem value="ct">Central (CT)</SelectItem>
                  <SelectItem value="et">Eastern (ET)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <div className="flex items-start gap-3">
              <Checkbox id="ds-terms" />
              <Label htmlFor="ds-terms" className="font-normal leading-snug">
                I agree to the terms and the privacy policy.
              </Label>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="ds-notif" className="font-normal">
                Email notifications
              </Label>
              <Switch id="ds-notif" defaultChecked />
            </div>
          </div>
        </Section>

        <Section
          title="Feedback & status"
          eyebrow="Badge, Alert, Skeleton"
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Critical</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>

            <div className="grid gap-3">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Heads up</AlertTitle>
                <AlertDescription>
                  This is an informational message. You can dismiss it from settings.
                </AlertDescription>
              </Alert>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Something needs attention</AlertTitle>
                <AlertDescription>
                  Connection lost. Check your network and try again.
                </AlertDescription>
              </Alert>
            </div>

            <div className="space-y-2">
              <p className="text-small text-text-secondary">
                Skeleton (loading placeholder)
              </p>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="grid flex-1 gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Display"
          eyebrow="Card, Avatar, Separator"
        >
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Connect your account</CardTitle>
                <CardDescription>One step before you can start.</CardDescription>
              </CardHeader>
              <CardContent>
                We&rsquo;ll only read what you choose. Disconnect any time.
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="" alt="Kyle Cooney" />
                  <AvatarFallback>KC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-body font-medium">Kyle Cooney</p>
                  <p className="text-small text-text-secondary">
                    kyle@example.com
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-body font-medium">Avery Bell</p>
                  <p className="text-small text-text-secondary">avery@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Overlays"
          eyebrow="Tabs, Dialog, Tooltip, Dropdown menu"
        >
          <div className="flex flex-col gap-8">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="usage">Usage</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              <TabsContent
                value="overview"
                className="mt-4 text-small text-text-secondary"
              >
                Account overview, billing snapshot, and recent activity.
              </TabsContent>
              <TabsContent
                value="usage"
                className="mt-4 text-small text-text-secondary"
              >
                Detailed usage by month, broken down by feature.
              </TabsContent>
              <TabsContent
                value="security"
                className="mt-4 text-small text-text-secondary"
              >
                Active sessions, two-factor authentication, and recovery codes.
              </TabsContent>
            </Tabs>

            <div className="flex flex-wrap gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover for tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>Tooltips clarify; never instruct.</TooltipContent>
              </Tooltip>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete account?</DialogTitle>
                    <DialogDescription>
                      This permanently removes your account and all associated
                      data. It cannot be reversed.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="ghost">Cancel</Button>
                    <Button variant="destructive">Delete account</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Account menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>My account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Section>

        <Section title="Radius & motion">
          <div className="flex flex-wrap gap-3">
            {(["sm", "md", "lg", "xl", "full"] as const).map((r) => (
              <div
                key={r}
                className="flex h-20 w-20 items-center justify-center bg-surface-raised text-small text-text-secondary"
                style={{ borderRadius: `var(--radius-${r})` }}
              >
                {r}
              </div>
            ))}
          </div>
          <p className="mt-4 text-small text-text-secondary">
            Default duration <code className="font-mono">150ms</code>, easing{" "}
            <code className="font-mono">cubic-bezier(0.4, 0, 0.2, 1)</code>. All
            animations respect{" "}
            <code className="font-mono">prefers-reduced-motion</code>.
          </p>
        </Section>
      </main>
    </TooltipProvider>
  );
}

function Section({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 border-t border-subtle pt-8">
      <h2 className="mb-1 text-h2 font-semibold tracking-snug">{title}</h2>
      {eyebrow && (
        <p className="mb-6 text-small text-text-secondary">{eyebrow}</p>
      )}
      {!eyebrow && <div className="mb-6" />}
      {children}
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function Swatch({ name, var: v }: { name: string; var: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-subtle">
      <div className="h-16 w-full" style={{ background: `var(${v})` }} />
      <div className="flex flex-col gap-0.5 bg-surface-raised p-3">
        <span className="text-small font-medium">{name}</span>
        <code className="font-mono text-micro text-text-secondary">{v}</code>
      </div>
    </div>
  );
}
