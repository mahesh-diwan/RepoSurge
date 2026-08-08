"use client";

import { useState, useRef, useMemo, useSyncExternalStore } from "react";
import { scalePoints, pointsToPathD, pointsToFillD } from "@/lib/scale-points";

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

interface SparklineProps {
  data?: number[];
  history?: { stars: number; recorded_at?: string }[];
  period?: string;
  width?: number;
  height?: number;
  color?: string;
  variant?: "inline" | "chart";
}

/**
 * Unified sparkline component.
 * - "inline": small, hoverable, draw-on animation (for table rows)
 * - "chart": larger, with axes + fill gradient (for detail page)
 */
export default function Sparkline({
  data: dataProp,
  history,
  period = "week",
  width = 120,
  height = 40,
  color,
  variant = "inline",
}: SparklineProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Resolve values from either data or history prop
  const values = useMemo(() => {
    if (dataProp) return dataProp;
    if (history && history.length > 0) {
      const counts: Record<string, number> = { day: 3, week: 7, month: 14 };
      const n = counts[period] ?? 7;
      return history.slice(-n).map((h) => h.stars);
    }
    return [];
  }, [dataProp, history, period]);

  if (values.length < 2) return <div style={{ height }} />;

  const isChart = variant === "chart";
  const W = isChart ? 180 : width;
  const H = isChart ? 32 : height;
  const pad = isChart
    ? { top: 2, bottom: 4, left: 32, right: 4 }
    : { top: 4, bottom: 4, left: 0, right: 0 };

  const { points, min, max, range } = scalePoints(values, W, H, pad);
  const pathD = "M " + pointsToPathD(points);
  const isUp = (values.at(-1) ?? 0) >= (values[0] ?? 0);
  const stroke = color || (isUp ? "#34D399" : "#F87171");
  const pathLength = points.length * 20;

  const drawH = H - pad.top - pad.bottom;
  const yPos = (v: number) => pad.top + drawH - ((v - min) / range) * drawH;

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current || isChart) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = cx - rect.left;
    const idx = Math.round((x / rect.width) * (values.length - 1));
    setHovered(Math.max(0, Math.min(values.length - 1, idx)));
  };

  // X-axis labels (chart only)
  const getXLabel = (idx: number): string => {
    if (!history) return "";
    const entry = history[history.length - values.length + idx];
    if (entry?.recorded_at) {
      const d = new Date(entry.recorded_at);
      if (period === "week") return d.toLocaleDateString("en-US", { weekday: "short" });
      if (period === "month") return `${d.getDate()}`;
      return `m${d.getMonth() + 1}`;
    }
    return "";
  };

  const xTickCount = 5;
  const xTickIndices: number[] = [];
  if (values.length <= xTickCount) {
    for (let i = 0; i < values.length; i++) xTickIndices.push(i);
  } else {
    for (let t = 0; t < xTickCount; t++) {
      xTickIndices.push(Math.round((t / (xTickCount - 1)) * (values.length - 1)));
    }
  }

  const abbreviateNumber = (n: number): string => {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return n.toLocaleString("en-US");
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio={isChart ? "xMidYMid meet" : undefined}
        onMouseMove={handleMove}
        onMouseLeave={() => setHovered(null)}
        onTouchMove={handleMove}
        onTouchEnd={() => setHovered(null)}
        role="img"
        aria-roledescription="sparkline chart"
        aria-label={`Star history: ${values.length} data points from ${values[0].toLocaleString()} to ${values[values.length - 1].toLocaleString()}`}
      >
        {isChart && (
          <defs>
            <linearGradient id={`grad-${period}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(91,127,255,0.3)" />
              <stop offset="100%" stopColor="rgba(91,127,255,0)" />
            </linearGradient>
          </defs>
        )}

        {/* Chart axes */}
        {isChart && (
          <>
            {[min, (min + max) / 2, max].map((v) => (
              <line
                key={`grid-${v}`}
                x1={pad.left}
                y1={yPos(v)}
                x2={W - pad.right}
                y2={yPos(v)}
                stroke="rgba(91,127,255,0.06)"
                strokeWidth="0.5"
              />
            ))}
            {[min, (min + max) / 2, max].map((v) => (
              <text
                key={`label-${v}`}
                x={pad.left - 2}
                y={yPos(v) + 1.5}
                textAnchor="end"
                fill="rgba(91,127,255,0.3)"
                fontSize="6"
              >
                {abbreviateNumber(Math.round(v))}
              </text>
            ))}
            {xTickIndices.map((idx) => (
              <text
                key={`tick-${idx}`}
                x={points[idx]?.x ?? 0}
                y={H - 1}
                textAnchor="middle"
                fill="rgba(91,127,255,0.2)"
                fontSize="5"
              >
                {getXLabel(idx)}
              </text>
            ))}
          </>
        )}

        {/* Data points and lines */}
        {isChart &&
          values.map((v, i) => (
            <circle key={i} cx={points[i].x} cy={points[i].y} r="1.2" fill="rgba(91,127,255,0.8)" />
          ))}

        {/* Fill gradient (chart only) */}
        {isChart && <path d={pointsToFillD(points, H)} fill={`url(#grad-${period})`} />}

        {/* Main line */}
        <path
          d={pathD}
          fill="none"
          stroke={stroke}
          strokeWidth={isChart ? 1 : 2}
          strokeLinecap="round"
          style={
            isChart || !values.length || prefersReduced
              ? {}
              : {
                  strokeDasharray: pathLength,
                  strokeDashoffset: pathLength,
                  animation: "draw-line 0.8s ease-out forwards",
                  "--path-length": pathLength,
                } as React.CSSProperties
          }
        />

        {/* Hover interaction (inline only) */}
        {!isChart && hovered !== null && (
          <>
            <line
              x1={points[hovered].x}
              y1={0}
              x2={points[hovered].x}
              y2={H}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle
              cx={points[hovered].x}
              cy={points[hovered].y}
              r="3.5"
              fill={stroke}
              stroke="#0a0a0a"
              strokeWidth="2"
            />
          </>
        )}

        <circle cx={points.at(-1)!.x} cy={points.at(-1)!.y} r={isChart ? 1.2 : 2.5} fill={stroke} />
      </svg>

      {/* Hover tooltip (inline only) */}
      {!isChart && hovered !== null && (
        <div
          className="absolute -top-7 bg-surface border border-border text-text-body text-[10px] px-2 py-1 rounded-md pointer-events-none z-10 shadow-lg"
          style={{
            left: `${(points[hovered].x / W) * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          {points[hovered].value.toLocaleString()}
        </div>
      )}
    </div>
  );
}
