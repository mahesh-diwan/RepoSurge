"use client";

import type { RepoWithVelocity } from "@/lib/db";

const COLORS = ["#D97706", "#34D399", "#F87171"];

export default function CompareChart({ repos }: { repos: RepoWithVelocity[] }) {
  return (
    <div className="mx-4 md:mx-6 mt-6 bg-surface border border-border rounded-2xl p-4">
      <p className="font-mono text-text-muted text-[10px] mb-3">compare: star trend</p>
      <svg viewBox="0 0 300 60" className="w-full h-16">
        {repos.map((repo, idx) => {
          const data = repo.sparkline;
          if (data.length < 2) return null;
          const min = Math.min(...data);
          const max = Math.max(...data);
          const range = max - min || 1;
          const d = data
            .map((s, i) => `${i === 0 ? "M" : "L"}${(i / (data.length - 1)) * 300},${60 - ((s - min) / range) * 50}`)
            .join(" ");
          return (
            <path
              key={repo.full_name}
              d={d}
              fill="none"
              stroke={COLORS[idx]}
              strokeWidth="2"
            />
          );
        })}
      </svg>
      <div className="flex gap-4 mt-2">
        {repos.map((repo, idx) => (
          <span
            key={repo.full_name}
            className="font-mono text-[10px] text-text-muted flex items-center gap-1"
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[idx] }}
            />
            {repo.name}
          </span>
        ))}
      </div>
    </div>
  );
}
