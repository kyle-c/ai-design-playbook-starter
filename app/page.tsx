import Link from "next/link";
import en from "@/locales/en.json";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-6 py-12">
      <p className="text-small text-text-secondary uppercase tracking-wide">
        {en.home.eyebrow}
      </p>
      <h1 className="text-h1 font-semibold tracking-snug">
        {en.home.headline}
      </h1>
      <p className="text-body text-text-secondary">
        {en.home.body}
      </p>

      <ul className="mt-4 grid gap-3">
        <NavLink href="/design-system" label={en.home.links.designSystem} />
        <NavLink href="/canvas" label={en.home.links.canvas} />
        <NavLink href="/prototype/onboarding" label={en.home.links.prototype} />
      </ul>
    </main>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href as "/design-system" | "/canvas" | "/prototype/onboarding"}
        className="flex min-h-touch items-center justify-between rounded-md border border-subtle bg-surface-raised px-4 py-3 text-body transition-fast hover:border-strong"
      >
        <span>{label}</span>
        <span aria-hidden="true">→</span>
      </Link>
    </li>
  );
}
