"use client";

import * as React from "react";
import type { FlowMeta, LiveRoute } from "./canvas-shell";
import { ZoomDock, useZoomPan } from "./zoom-pan";

const NODE_W = 220;
const NODE_H = 64;
const NODE_GAP = 64;
const TRACK_GAP = 160;
const LABEL_HEIGHT = 36;

type Node = {
  flowId: string;
  screenId: string;
  label: string;
  x: number;
  y: number;
  /** Live-route nodes are rendered with muted styling and no edges. */
  live?: boolean;
};

type Edge = {
  from: Node;
  to: Node;
  cross?: boolean;
};

export function GraphView({
  flows,
  liveRoutes,
  highlight,
}: {
  flows: FlowMeta[];
  liveRoutes: LiveRoute[];
  highlight: string | "all";
}) {
  const { nodes, edges, contentBox, liveTrackY } = React.useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let y = 0;

    flows.forEach((flow, fi) => {
      const flowTop = y;
      flow.screens.forEach((s, si) => {
        nodes.push({
          flowId: flow.id,
          screenId: s.id,
          label: s.label,
          x: si * (NODE_W + NODE_GAP),
          y: flowTop + LABEL_HEIGHT,
        });
        if (si > 0) {
          edges.push({
            from: nodes[nodes.length - 2],
            to: nodes[nodes.length - 1],
          });
        }
      });
      if (fi < flows.length - 1) y = flowTop + LABEL_HEIGHT + NODE_H + TRACK_GAP;
    });

    /* Cross-flow links via flow.nextFlow. */
    flows.forEach((flow) => {
      if (!flow.nextFlow) return;
      const target = flows.find((f) => f.id === flow.nextFlow);
      if (!target) return;
      const last = nodes
        .filter((n) => n.flowId === flow.id)
        .at(-1);
      const first = nodes.find((n) => n.flowId === target.id);
      if (last && first) edges.push({ from: last, to: first, cross: true });
    });

    /* Live routes — auto-derived from /app/. Rendered as a muted track below
       the flows so designers can spot drift between intent and implementation. */
    let liveTrackY = 0;
    if (liveRoutes.length > 0) {
      liveTrackY = y + LABEL_HEIGHT + NODE_H + TRACK_GAP;
      liveRoutes.forEach((r, i) => {
        nodes.push({
          flowId: "__live__",
          screenId: r.source,
          label: r.href,
          x: i * (NODE_W + NODE_GAP),
          y: liveTrackY + LABEL_HEIGHT,
          live: true,
        });
      });
    }

    const flowsWidth = Math.max(
      0,
      ...flows.map((f) => f.screens.length * NODE_W + Math.max(0, f.screens.length - 1) * NODE_GAP)
    );
    const liveWidth =
      liveRoutes.length * NODE_W + Math.max(0, liveRoutes.length - 1) * NODE_GAP;
    const widest = Math.max(flowsWidth, liveWidth);

    const totalHeight =
      (liveRoutes.length > 0 ? liveTrackY : y) + LABEL_HEIGHT + NODE_H;
    return {
      nodes,
      edges,
      contentBox: { width: widest, height: totalHeight },
      liveTrackY,
    };
  }, [flows, liveRoutes]);

  const { containerRef, transform, controls, cursor } = useZoomPan({
    contentBox,
    minScale: 0.1,
    maxScale: 3,
  });

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-[#1a1a1a]"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        cursor,
      }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left will-change-transform"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
        }}
      >
        <svg
          width={Math.max(contentBox.width, 1)}
          height={Math.max(contentBox.height, 1)}
          overflow="visible"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 12 12"
              refX="10"
              refY="6"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L12,6 L0,12 z" fill="rgba(255,255,255,0.4)" />
            </marker>
            <marker
              id="arrow-cross"
              viewBox="0 0 12 12"
              refX="10"
              refY="6"
              markerWidth="8"
              markerHeight="8"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L12,6 L0,12 z" fill="rgba(99, 102, 241, 0.9)" />
            </marker>
          </defs>

          {/* Flow track labels */}
          {flows.map((flow) => {
            const firstNode = nodes.find((n) => n.flowId === flow.id);
            if (!firstNode) return null;
            const dim = highlight !== "all" && highlight !== flow.id;
            return (
              <text
                key={`label-${flow.id}`}
                x={0}
                y={firstNode.y - 14}
                fill={dim ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)"}
                fontSize={16}
                fontWeight={500}
                style={{ fontFamily: "var(--font-family-sans)" }}
              >
                {flow.label}
                {flow.entry ? " · entry" : ""}
              </text>
            );
          })}

          {/* Live-routes track label */}
          {liveRoutes.length > 0 && (
            <text
              x={0}
              y={liveTrackY + LABEL_HEIGHT - 14}
              fill="rgba(255,255,255,0.55)"
              fontSize={16}
              fontWeight={500}
              style={{ fontFamily: "var(--font-family-sans)" }}
            >
              Live app routes
              <tspan
                fill="rgba(255,255,255,0.35)"
                fontSize={13}
                fontWeight={400}
                dx={8}
              >
                auto-derived from /app
              </tspan>
            </text>
          )}

          {/* Edges */}
          {edges.map((e, i) => {
            const dim =
              highlight !== "all" &&
              highlight !== e.from.flowId &&
              highlight !== e.to.flowId;
            return (
              <Edge key={i} edge={e} dim={dim} />
            );
          })}

          {/* Nodes */}
          {nodes.map((n) => {
            const dim = highlight !== "all" && highlight !== n.flowId;
            return <NodeRect key={`${n.flowId}/${n.screenId}`} node={n} dim={dim} />;
          })}
        </svg>
      </div>

      <ZoomDock controls={controls} scale={transform.scale} />
    </div>
  );
}

function NodeRect({ node, dim }: { node: Node; dim: boolean }) {
  const isLive = !!node.live;
  return (
    <g transform={`translate(${node.x}, ${node.y})`} opacity={dim ? 0.35 : 1}>
      <rect
        width={NODE_W}
        height={NODE_H}
        rx={10}
        ry={10}
        fill={isLive ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.05)"}
        stroke={isLive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.18)"}
        strokeDasharray={isLive ? "4 3" : undefined}
        strokeWidth={1}
      />
      <text
        x={NODE_W / 2}
        y={NODE_H / 2 - 6}
        textAnchor="middle"
        fill={isLive ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.9)"}
        fontSize={15}
        fontWeight={500}
        style={{
          fontFamily: isLive
            ? "var(--font-family-mono)"
            : "var(--font-family-sans)",
        }}
      >
        {node.label}
      </text>
      <text
        x={NODE_W / 2}
        y={NODE_H / 2 + 14}
        textAnchor="middle"
        fill="rgba(255,255,255,0.4)"
        fontSize={12}
        style={{ fontFamily: "var(--font-family-mono)" }}
      >
        {isLive ? node.screenId : `${node.flowId}/${node.screenId}`}
      </text>
    </g>
  );
}

function Edge({ edge, dim }: { edge: Edge; dim: boolean }) {
  const x1 = edge.from.x + NODE_W;
  const y1 = edge.from.y + NODE_H / 2;
  const x2 = edge.to.x;
  const y2 = edge.to.y + NODE_H / 2;
  const stroke = edge.cross ? "rgba(99, 102, 241, 0.7)" : "rgba(255,255,255,0.25)";
  const marker = edge.cross ? "url(#arrow-cross)" : "url(#arrow)";

  let d: string;
  if (edge.cross && Math.abs(y2 - y1) > 2) {
    /* Curved S-shape between flows. */
    const dx = Math.max(80, Math.abs(x2 - x1) / 2);
    d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  } else {
    d = `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  return (
    <path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={edge.cross ? 1.75 : 1.25}
      strokeDasharray={edge.cross ? "5 4" : undefined}
      markerEnd={marker}
      opacity={dim ? 0.25 : 1}
    />
  );
}
