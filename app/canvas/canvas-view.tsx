"use client";

import * as React from "react";
import type { FlowMeta } from "./canvas-shell";
import { ZoomDock, useZoomPan, type ZoomPan } from "./zoom-pan";

const SCREEN_W = 390;
const SCREEN_H = 844;
const SCREEN_GAP = 40;
const FLOW_GAP = 96;
const LABEL_HEIGHT = 36;

export function CanvasView({
  flows,
  screensByKey,
}: {
  flows: FlowMeta[];
  screensByKey: Map<string, React.ReactNode>;
}) {
  /* Compute the bounding box of all flows so we can fit-to-screen. */
  const contentBox = React.useMemo(() => {
    const widest = Math.max(
      0,
      ...flows.map((f) => f.screens.length * SCREEN_W + Math.max(0, f.screens.length - 1) * SCREEN_GAP)
    );
    const totalHeight =
      flows.length * (SCREEN_H + LABEL_HEIGHT) +
      Math.max(0, flows.length - 1) * FLOW_GAP;
    return { width: widest, height: totalHeight };
  }, [flows]);

  const { containerRef, transform, controls, cursor } = useZoomPan({
    contentBox,
    minScale: 0.05,
    maxScale: 4,
  });

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-chrome-canvas"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        cursor,
      }}
    >
      <World transform={transform}>
        <Wall flows={flows} screensByKey={screensByKey} />
      </World>

      <ZoomDock controls={controls} scale={transform.scale} />
    </div>
  );
}

function World({
  transform,
  children,
}: {
  transform: ZoomPan;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute left-0 top-0 origin-top-left will-change-transform"
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
      }}
    >
      {children}
    </div>
  );
}

function Wall({
  flows,
  screensByKey,
}: {
  flows: FlowMeta[];
  screensByKey: Map<string, React.ReactNode>;
}) {
  let yCursor = 0;
  return (
    <div
      className="relative"
      style={{ width: 1, height: 1 /* size irrelevant; children are abs-positioned */ }}
    >
      {flows.map((flow, i) => {
        const top = yCursor;
        yCursor += SCREEN_H + LABEL_HEIGHT + (i < flows.length - 1 ? FLOW_GAP : 0);
        return (
          <div
            key={flow.id}
            className="absolute left-0"
            style={{ top }}
          >
            <div
              className="mb-2 flex items-baseline gap-3 text-white/60"
              style={{ fontSize: 18, lineHeight: `${LABEL_HEIGHT}px` }}
            >
              <span className="font-medium text-white/85">{flow.label}</span>
              <span style={{ fontSize: 13 }}>
                {flow.screens.length} screens
                {flow.entry ? " · entry" : ""}
              </span>
            </div>
            <div className="flex" style={{ gap: SCREEN_GAP }}>
              {flow.screens.map((s) => (
                <ScreenFrame
                  key={s.id}
                  label={s.label}
                  width={SCREEN_W}
                  height={SCREEN_H}
                >
                  {screensByKey.get(`${flow.id}/${s.id}`)}
                </ScreenFrame>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ScreenFrame({
  label,
  width,
  height,
  children,
}: {
  label: string;
  width: number;
  height: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <div
        className="overflow-hidden rounded-2xl bg-surface-default ring-1 ring-white/10"
        style={{
          width,
          height,
          /* pointer-events:none so drag-to-pan always works on the canvas. */
          pointerEvents: "none",
        }}
      >
        {children}
      </div>
      <div
        className="text-white/55"
        style={{ fontSize: 13 }}
      >
        {label}
      </div>
    </div>
  );
}
