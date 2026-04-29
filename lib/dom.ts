/**
 * True if the event target is a form control or contenteditable
 * element — the canonical "skip my keyboard shortcut while the user
 * is typing" check. Used by canvas-shell + zoom-pan global key
 * handlers.
 */
export function isFormElement(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}
