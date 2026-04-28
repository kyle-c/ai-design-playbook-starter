import { promises as fs } from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

export type SystemStats = {
  semanticTokens: number;
  primitives: number;
  components: number;
  contrastPairs: number;
  lastEdited: string;
};

/* Computed at request time (or build time for static export) by
   reading tokens.css + components/ui directly, so the header stat
   line never lies about what the system actually contains. */
export async function getSystemStats(): Promise<SystemStats> {
  const root = process.cwd();
  const tokens = await fs.readFile(
    path.join(root, "styles", "tokens.css"),
    "utf8"
  );

  /* Dedupe — `[data-theme="light"]` and `[data-theme="dark"]` blocks
     re-declare the same token names; we only want the unique count. */
  const uniqueMatches = (re: RegExp) => {
    const m = tokens.match(re);
    return m ? new Set(m).size : 0;
  };
  const semantic = uniqueMatches(
    /--color-(?:surface|text|border|action|feedback)-[\w-]+:/g
  );
  const primitives = uniqueMatches(
    /--color-(?:neutral|brand|accent|success|warning|danger)-\d+:/g
  );

  const ui = await fs.readdir(path.join(root, "components", "ui"));
  const components = ui.filter((f) => f.endsWith(".tsx")).length;

  let lastEdited = "—";
  try {
    lastEdited = execSync("git log -1 --format=%cs styles/tokens.css", {
      cwd: root,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    /* git may be unavailable in some build environments — leave em-dash. */
  }

  return {
    semanticTokens: semantic,
    primitives,
    components,
    /* The audit script (scripts/audit-tokens.mjs) verifies 34 contrast
       pairs across light + dark. Hardcoded here so the page can show
       the count without invoking the audit at request time. */
    contrastPairs: 34,
    lastEdited,
  };
}
