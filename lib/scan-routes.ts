/**
 * Walks /app/ at server-render time and returns every page.tsx as a *product*
 * route — design-only routes (/canvas, /design-system) are excluded so the
 * graph view doesn't claim tools are user-facing surfaces.
 *
 * Runs in Node (server component context only). Don't import this in a
 * client component — it will fail to bundle.
 */

import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const APP_DIR = "app";

/** Routes that exist for designers/devs only. The graph view should never
 *  list them as live product routes. Keep in sync with the routes that 404
 *  in production via `if (process.env.NODE_ENV === "production") notFound()`. */
export const DESIGN_TOOL_ROUTES = new Set<string>([
  "/canvas",
  "/design-system",
]);

export type RouteEntry = {
  /** URL path, e.g. "/", "/dashboard/[id]" */
  href: string;
  /** Filesystem path relative to /app, e.g. "page.tsx", "dashboard/[id]/page.tsx" */
  source: string;
};

export function scanRoutes(): RouteEntry[] {
  const root = join(process.cwd(), APP_DIR);
  const out: RouteEntry[] = [];
  walk(root, root, out);
  return out
    .filter((r) => !DESIGN_TOOL_ROUTES.has(r.href))
    .sort((a, b) => a.href.localeCompare(b.href));
}

function walk(root: string, dir: string, out: RouteEntry[]) {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }

  for (const name of entries) {
    /* Skip route groups (parens), private folders (underscore), node modules. */
    if (name.startsWith("_") || name.startsWith("(") || name === "node_modules") continue;

    const full = join(dir, name);
    const isDir = statSync(full).isDirectory();

    if (isDir) {
      walk(root, full, out);
      continue;
    }

    if (name === "page.tsx" || name === "page.ts" || name === "page.jsx" || name === "page.js") {
      const rel = relative(root, dir);
      const href = "/" + rel.split(/[\\/]/).filter(Boolean).join("/");
      out.push({
        href: rel === "" ? "/" : href,
        source: relative(root, full).replace(/\\/g, "/"),
      });
    }
  }
}
