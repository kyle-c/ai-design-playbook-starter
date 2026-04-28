import { ArrowUpRight } from "lucide-react";

const REPO_BASE =
  "https://github.com/kyle-c/ai-design-playbook-starter/blob/main";

/**
 * Tiny "view source" link rendered next to each section title so a
 * designer can jump from the rendered example to the actual file.
 * Closes the loop between docs and the code that backs them.
 */
export function ViewSource({ path }: { path: string }) {
  const filename = path.split("/").pop() ?? path;
  return (
    <a
      href={`${REPO_BASE}/${path}`}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-small text-text-tertiary transition-colors hover:text-text-secondary"
    >
      <span className="font-mono">{filename}</span>
      <ArrowUpRight size={12} className="shrink-0" />
    </a>
  );
}
