import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import en from "@/locales/en.json";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col px-6 py-8">
      <header className="flex items-center justify-between">
        <Image
          src="/logo.svg"
          alt="AI Design Playbook"
          width={200}
          height={32}
          priority
          className="text-text-primary"
        />
        <ThemeToggle />
      </header>

      <section className="flex flex-1 flex-col justify-center gap-6">
        <p className="text-small uppercase tracking-wide text-text-secondary">
          {en.home.eyebrow}
        </p>
        <h1 className="text-display font-semibold tracking-tight text-text-primary">
          {en.home.headline}
        </h1>
        <p className="max-w-xl text-body text-text-secondary">
          {en.home.body}
        </p>

        <div className="mt-2 flex flex-wrap gap-3">
          <Link
            href="/canvas"
            className="inline-flex min-h-touch items-center rounded-md bg-action-primary px-5 text-body font-medium text-text-on-brand hover:bg-action-primary-hover"
          >
            {en.home.links.canvas}
          </Link>
          <Link
            href="/design-system"
            className="inline-flex min-h-touch items-center rounded-md border border-subtle bg-surface-default px-5 text-body font-medium text-text-primary hover:bg-surface-raised"
          >
            {en.home.links.designSystem}
          </Link>
        </div>
      </section>

      <footer className="text-small text-text-tertiary">
        Following the{" "}
        <a
          href="https://ai-design-playbook.vercel.app"
          className="underline hover:text-text-secondary"
        >
          AI Design Playbook
        </a>
        .
      </footer>
    </main>
  );
}
