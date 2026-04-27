import { notFound } from "next/navigation";
import { flows } from "@/app/flows.config";

/**
 * Canvas — zoomable multi-flow overview.
 *
 * Design-only route. Per /CLAUDE.md absolute rule #5, this 404s in production.
 * To use: run `npm run dev` and visit /canvas.
 */
export default function CanvasPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <main className="min-h-dvh bg-surface-sunken">
      <header className="sticky top-0 z-10 border-b border-subtle bg-surface-default/80 px-6 py-4 backdrop-blur">
        <h1 className="text-h3 font-semibold">Canvas</h1>
        <p className="text-small text-text-secondary">
          All screens across all flows. Click any to inspect.
        </p>
      </header>

      <div className="space-y-12 px-6 py-8">
        {flows.map((flow) => (
          <section key={flow.id}>
            <h2 className="mb-4 text-h3 font-semibold">{flow.label}</h2>
            <div className="flex flex-wrap gap-6">
              {flow.screens.map((screen) => (
                <figure key={screen.id} className="flex flex-col items-center gap-2">
                  <div
                    className="overflow-hidden rounded-xl border border-subtle bg-surface-default shadow-sm"
                    style={{ width: 195, height: 422 }}
                  >
                    <div style={{ width: 390, height: 844, transform: "scale(0.5)", transformOrigin: "0 0" }}>
                      <screen.Component />
                    </div>
                  </div>
                  <figcaption className="text-small text-text-secondary">
                    {screen.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
