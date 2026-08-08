"use client";

import type { RepoWithVelocity } from "@/lib/db";

const COLORS = ["#D97706", "#34D399", "#F87171", "#60A5FA"];

export default function CompareChart({ repos }: { repos: RepoWithVelocity[] }) {
  if (repos.length < 2) return null;

  // Normalize all datasets to 0-100 scale for fair comparison
  const normalized = repos.map((repo) => {
    const data = repo.sparkline;
    if (data.length < 2) return { repo, points: [] };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((s, i) => ({
      x: (i / (data.length - 1)) * 300,
      y: 60 - ((s - min) / range) * 50,
    }));
    return { repo, points };
  });

  const validDatasets = normalized.filter((d) => d.points.length >= 2);
  if (validDatasets.length < 2) return null;

  // Find winner (highest latest value relative to its own range)
  const winner = validDatasets.reduce((best, current) => {
    const bestGain = best.repo.stars_gained ?? 0;
    const currentGain = current.repo.stars_gained ?? 0;
    return currentGain > bestGain ? current : best;
  });

  return (
    <div className="mx-4 md:mx-6 mt-6 card-shell animate-fade-up">
      <div className="card-core">
        <div className="flex items-center justify-between mb-4">
          <p className="section-label">Compare: star trend</p>
          <p className="text-text-dim text-[10px] font-mono">
            {repos.length} repos
          </p>
        </div>
        <svg viewBox="0 0 300 60" className="w-full h-16">
          {validDatasets.map((dataset, idx) => {
            const d = dataset.points
              .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
              .join(" ");
            const isWinner = dataset.repo.slug === winner.repo.slug;
            return (
              <path
                key={dataset.repo.slug}
                d={d}
                fill="none"
                stroke={COLORS[idx]}
                strokeWidth={isWinner ? 2.5 : 1.5}
                strokeOpacity={isWinner ? 1 : 0.6}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {validDatasets.map((dataset, idx) => {
            const isWinner = dataset.repo.slug === winner.repo.slug;
            return (
              <span
                key={dataset.repo.slug}
                className={`font-mono text-[10px] flex items-center gap-1.5 ${
                  isWinner ? "text-text-body" : "text-text-dim"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[idx] }}
                />
                {dataset.repo.name}
                {isWinner && (
                  <span className="text-positive text-[9px]">▲</span>
                )}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
