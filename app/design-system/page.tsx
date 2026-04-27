import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/**
 * Living style guide. Auto-reflects current values from /styles/tokens.css
 * because every swatch reads its CSS variable directly.
 *
 * Public route (per playbook): no auth required for the team.
 */
export default function DesignSystemPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-12">
        <p className="text-small uppercase tracking-wide text-text-secondary">Design system</p>
        <h1 className="mt-2 text-display font-semibold tracking-tight">Living reference</h1>
        <p className="mt-3 max-w-2xl text-body text-text-secondary">
          Generated from the codebase. Every swatch, every component, every value below
          reflects the current state of the system. To change it, edit{" "}
          <code className="font-mono text-small">/styles/tokens.css</code>.
        </p>
      </header>

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
          <p className="text-body">Body — 16. The brown fox jumped over the lazy dog at a calm, deliberate pace.</p>
          <p className="text-small text-text-secondary">Small — 14. Captions, metadata, helper text.</p>
          <p className="text-micro text-text-tertiary">Micro — 12. Legal, timestamps, dense UI.</p>
        </div>
      </Section>

      <Section title="Spacing scale">
        <div className="space-y-2">
          {[1, 2, 3, 4, 6, 8, 12, 16].map((n) => (
            <div key={n} className="flex items-center gap-3">
              <code className="w-16 font-mono text-small text-text-secondary">space-{n}</code>
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

      <Section title="Card">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Connect your account</CardTitle>
            <CardDescription>One step before you can start.</CardDescription>
          </CardHeader>
          <CardContent>
            We&rsquo;ll only read what you choose. You can disconnect any time.
          </CardContent>
        </Card>
      </Section>

      <Section title="Input">
        <div className="grid max-w-md gap-2">
          <label htmlFor="ds-input" className="text-small font-medium">
            Email
          </label>
          <Input id="ds-input" type="email" placeholder="you@example.com" />
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
          <code className="font-mono">cubic-bezier(0.4, 0, 0.2, 1)</code>. All animations
          respect <code className="font-mono">prefers-reduced-motion</code>.
        </p>
      </Section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12 border-t border-subtle pt-8">
      <h2 className="mb-6 text-h2 font-semibold tracking-snug">{title}</h2>
      {children}
    </section>
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
