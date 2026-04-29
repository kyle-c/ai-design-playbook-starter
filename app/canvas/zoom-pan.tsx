"use client";

import * as React from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import { isFormElement } from "@/lib/dom";

export type ZoomPan = { x: number; y: number; scale: number };

export type ZoomControls = {
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
  fit: () => void;
};

const PADDING = 80;

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function useZoomPan({
  contentBox,
  minScale,
  maxScale,
}: {
  contentBox: { width: number; height: number };
  minScale: number;
  maxScale: number;
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = React.useState<ZoomPan>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setDragging] = React.useState(false);
  const dragRef = React.useRef<{
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  } | null>(null);

  const computeFit = React.useCallback((): ZoomPan => {
    const el = containerRef.current;
    if (!el || contentBox.width <= 0 || contentBox.height <= 0) {
      return { x: 0, y: 0, scale: 1 };
    }
    const w = el.clientWidth - PADDING * 2;
    const h = el.clientHeight - PADDING * 2;
    if (w <= 0 || h <= 0) return { x: 0, y: 0, scale: 1 };
    const scale = clamp(
      Math.min(w / contentBox.width, h / contentBox.height),
      minScale,
      maxScale
    );
    const x = (el.clientWidth - contentBox.width * scale) / 2;
    const y = (el.clientHeight - contentBox.height * scale) / 2;
    return { x, y, scale };
  }, [contentBox.width, contentBox.height, minScale, maxScale]);

  /* Auto-fit on first mount and whenever the content box changes (e.g. flow filter). */
  React.useEffect(() => {
    setTransform(computeFit());
  }, [computeFit]);

  /* Refit when the container resizes. */
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setTransform(computeFit()));
    ro.observe(el);
    return () => ro.disconnect();
  }, [computeFit]);

  /* Wheel: cmd/ctrl/pinch = zoom-toward-cursor; plain = pan. preventDefault
     requires a non-passive native listener — React's onWheel is passive. */
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const isZoom = e.ctrlKey || e.metaKey;
      e.preventDefault();
      if (isZoom) {
        const rect = el.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        setTransform((prev) => {
          const next = clamp(prev.scale * Math.exp(-e.deltaY * 0.0015), minScale, maxScale);
          const factor = next / prev.scale;
          return {
            scale: next,
            x: mx - (mx - prev.x) * factor,
            y: my - (my - prev.y) * factor,
          };
        });
      } else {
        setTransform((prev) => ({ ...prev, x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [minScale, maxScale]);

  /* Drag-to-pan with pointer events. Skip if the pointer landed on an
     interactive child (e.g. the ZoomDock buttons) — otherwise the canvas
     captures the pointer before the button's click event can fire. */
  const onPointerDown = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    /* Skip if the pointer landed on (or inside) an interactive child like
       the ZoomDock buttons. We check Element, not HTMLElement — clicking
       the lucide SVG icon inside a button gives e.target as SVGPathElement,
       which extends Element but NOT HTMLElement. closest() walks the DOM
       up regardless of namespace, so this matches the button parent. */
    if (
      e.target instanceof Element &&
      e.target.closest('button, a, input, select, textarea, [role="button"]')
    ) {
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    setDragging(true);
    setTransform((prev) => {
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        panX: prev.x,
        panY: prev.y,
      };
      return prev;
    });
  }, []);

  const onPointerMove = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d) return;
    setTransform((prev) => ({
      ...prev,
      x: d.panX + (e.clientX - d.startX),
      y: d.panY + (e.clientY - d.startY),
    }));
  }, []);

  const onPointerUp = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    dragRef.current = null;
    setDragging(false);
  }, []);

  /* Wire pointer handlers onto the container automatically by exposing
     an onPointer* prop bag. We attach via ref so the consumer doesn't have to. */
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const down = (e: PointerEvent) => onPointerDown(e as unknown as React.PointerEvent<HTMLDivElement>);
    const move = (e: PointerEvent) => onPointerMove(e as unknown as React.PointerEvent<HTMLDivElement>);
    const up = (e: PointerEvent) => onPointerUp(e as unknown as React.PointerEvent<HTMLDivElement>);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [onPointerDown, onPointerMove, onPointerUp]);

  /* Button controls — anchored at center of viewport. */
  const zoomBy = React.useCallback(
    (factor: number) => {
      const el = containerRef.current;
      if (!el) return;
      const cx = el.clientWidth / 2;
      const cy = el.clientHeight / 2;
      setTransform((prev) => {
        const next = clamp(prev.scale * factor, minScale, maxScale);
        const realFactor = next / prev.scale;
        return {
          scale: next,
          x: cx - (cx - prev.x) * realFactor,
          y: cy - (cy - prev.y) * realFactor,
        };
      });
    },
    [minScale, maxScale]
  );

  const controls: ZoomControls = React.useMemo(
    () => ({
      zoomIn: () => zoomBy(1.25),
      zoomOut: () => zoomBy(1 / 1.25),
      reset: () => {
        const el = containerRef.current;
        if (!el) return;
        setTransform({
          x: (el.clientWidth - contentBox.width) / 2,
          y: (el.clientHeight - contentBox.height) / 2,
          scale: 1,
        });
      },
      fit: () => setTransform(computeFit()),
    }),
    [zoomBy, computeFit, contentBox.width, contentBox.height]
  );

  /* Keyboard shortcuts: 0 reset, f fit, = zoom in, - zoom out.
     Bound at window level but ignored when typing in form fields. */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isFormElement(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "0") {
        e.preventDefault();
        controls.reset();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        controls.fit();
      } else if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        controls.zoomIn();
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        controls.zoomOut();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [controls]);

  const cursor = isDragging ? "grabbing" : "grab";

  return { containerRef, transform, controls, cursor };
}

export function ZoomDock({
  controls,
  scale,
}: {
  controls: ZoomControls;
  scale: number;
}) {
  return (
    <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1 rounded-md border border-white/10 bg-chrome-inset/95 p-1 text-white shadow-lg backdrop-blur">
      <DockButton onClick={controls.zoomOut} ariaLabel="Zoom out">
        <Minus size={14} />
      </DockButton>
      <button
        type="button"
        onClick={controls.reset}
        className="pointer-events-auto min-w-[3.5rem] rounded px-2 py-1 text-small tabular-nums text-white/80 hover:bg-white/10 hover:text-white"
      >
        {Math.round(scale * 100)}%
      </button>
      <DockButton onClick={controls.zoomIn} ariaLabel="Zoom in">
        <Plus size={14} />
      </DockButton>
      <div className="mx-1 h-5 w-px bg-white/10" />
      <DockButton onClick={controls.fit} ariaLabel="Fit to screen">
        <Maximize2 size={14} />
      </DockButton>
    </div>
  );
}

function DockButton({
  onClick,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded text-white/70 hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}
