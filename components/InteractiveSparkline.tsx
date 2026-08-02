"use client";
import { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function InteractiveSparkline({
  data, width = 120, height = 40, color,
}: { data: number[]; width?: number; height?: number; color?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const prefersReduced = useReducedMotion();
  if (data.length < 2) return <div className="h-10" />;

  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const points = data.map((s, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - 4 - ((s - min) / range) * (height - 8),
    value: s,
  }));

  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;
  const isUp = data.at(-1)! >= data[0];
  const stroke = color || (isUp ? "#34D399" : "#F87171");

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = cx - rect.left;
    const idx = Math.round((x / rect.width) * (data.length - 1));
    setHovered(Math.max(0, Math.min(data.length - 1, idx)));
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseMove={handleMove}
        onMouseLeave={() => setHovered(null)}
        onTouchMove={handleMove}
        onTouchEnd={() => setHovered(null)}
      >
        <motion.path
          d={pathD}
          fill="none" stroke={stroke} strokeWidth="2"
          strokeLinecap="round"
          initial={prefersReduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={prefersReduced ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
        />
        {hovered !== null && (
          <>
            <line x1={points[hovered].x} y1={0} x2={points[hovered].x} y2={height}
              stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx={points[hovered].x} cy={points[hovered].y} r="3.5"
              fill={stroke} stroke="#0a0a0a" strokeWidth="2" />
          </>
        )}
        <circle cx={points.at(-1)!.x} cy={points.at(-1)!.y} r="2.5" fill={stroke} />
      </svg>
      {hovered !== null && (
        <div className="absolute -top-7 bg-surface border border-border text-text-body text-[10px] px-2 py-1 rounded-md pointer-events-none z-10 shadow-lg"
          style={{ left: `${(points[hovered].x / width) * 100}%`, transform: "translateX(-50%)" }}>
          {points[hovered].value.toLocaleString()}
        </div>
      )}
    </div>
  );
}
