"use client";

import type { RepoWithVelocity } from "@/lib/db";

function FlameIcon({ className, color }: { className?: string; color: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

/**
 * Hot streak indicator - scales intensity by velocity.
 * Shows 1-3 flames based on stars gained per day.
 */
export default function HotStreak({ velocity }: { velocity: number | null }) {
  if (!velocity || velocity < 100) return null;

  let intensity: "hot" | "hotter" | "hottest";
  if (velocity >= 1000) intensity = "hottest";
  else if (velocity >= 500) intensity = "hotter";
  else intensity = "hot";

  const colors = {
    hot: { flame: "#D97706", glow: "rgba(217,119,6,0.12)" },
    hotter: { flame: "#F59E0B", glow: "rgba(245,158,11,0.18)" },
    hottest: { flame: "#EF4444", glow: "rgba(239,68,68,0.22)" },
  };

  const { flame, glow } = colors[intensity];

  return (
    <span
      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
      style={{ backgroundColor: glow }}
    >
      {intensity === "hottest" ? (
        <>
          <FlameIcon className="w-3 h-3" color={flame} />
          <FlameIcon className="w-3.5 h-3.5" color={flame} />
          <FlameIcon className="w-3 h-3" color={flame} />
        </>
      ) : intensity === "hotter" ? (
        <>
          <FlameIcon className="w-3 h-3" color={flame} />
          <FlameIcon className="w-3.5 h-3.5" color={flame} />
        </>
      ) : (
        <FlameIcon className="w-3.5 h-3.5" color={flame} />
      )}
    </span>
  );
}
