"use client";

import { useMemo } from "react";

interface ForecastBarProps {
  forecast: string | null;
  currentStars: number;
}

/**
 * Visual progress toward next milestone.
 * Parses forecast string like "200K ~8d" and shows a progress bar.
 */
export default function ForecastBar({ forecast, currentStars }: ForecastBarProps) {
  const parsed = useMemo(() => {
    if (!forecast) return null;
    const match = forecast.match(/(\d+)K\s*~(\d+)d/);
    if (!match) return null;
    const milestone = parseInt(match[1]) * 1000;
    const days = parseInt(match[2]);
    const magnitude = Math.pow(10, Math.floor(Math.log10(milestone)));
    const prevMilestone = (Math.floor(milestone / magnitude)) * magnitude / 2 || magnitude;
    const progress = Math.min(0.95, (currentStars - prevMilestone) / (milestone - prevMilestone));
    return { milestone, days, prevMilestone, progress: Math.max(0.02, progress) };
  }, [forecast, currentStars]);

  if (!parsed) return null;

  const { milestone, days, progress } = parsed;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-[transform,opacity] duration-300 ease-spring"
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, #D97706, #F59E0B)`,
          }}
        />
      </div>
      <span className="text-text-dim text-[9px] font-mono shrink-0">
        {(milestone / 1000).toFixed(0)}K in {days}d
      </span>
    </div>
  );
}
