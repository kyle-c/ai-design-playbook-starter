"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function readInitial(): Theme {
  if (typeof document === "undefined") return "light";
  return (document.documentElement.dataset.theme as Theme) ?? "light";
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = React.useState<Theme>("light");

  /* Sync to whatever the no-flash script set on <html>. */
  React.useEffect(() => {
    setTheme(readInitial());
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* Storage might be unavailable (private mode, sandbox); the in-memory
         state still works for this session. */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={
        "inline-flex h-9 min-h-touch w-9 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary " +
        (className ?? "")
      }
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
