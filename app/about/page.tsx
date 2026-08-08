import { type Metadata } from "next";
import { getStats } from "@/lib/db";

export const metadata: Metadata = {
  title: "About - RepoSurge",
  description: "How RepoSurge tracks star velocity on GitHub",
};

export default function AboutPage() {
  const stats = getStats();

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 pt-16">
      <h1 className="text-2xl md:text-3xl font-bold text-text-body tracking-tight mb-2">
        About RepoSurge
      </h1>
      <p className="text-text-muted text-sm mb-10">
        Star velocity leaderboard for GitHub
      </p>

      {/* Stats - asymmetric layout, not 3 identical cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        <div className="card p-4 sm:col-span-1">
          <p className="data-mono text-2xl font-bold text-accent tabular-nums">
            {stats.totalRepos}
          </p>
          <p className="section-label mt-1">Repos tracked</p>
        </div>
        <div className="card p-4">
          <p className="data-mono text-2xl font-bold text-text-body tabular-nums">
            {(stats.totalStars / 1000000).toFixed(1)}M
          </p>
          <p className="section-label mt-1">Total stars</p>
        </div>
        <div className="card p-4 col-span-2 sm:col-span-1">
          <p className="data-mono text-2xl font-bold text-text-body tabular-nums">
            {stats.languages}
          </p>
          <p className="section-label mt-1">Languages</p>
        </div>
      </div>

      {/* Methodology */}
      <div className="space-y-4">
        <div className="card p-5">
          <p className="section-label mb-2">Methodology</p>
          <p className="text-text-muted text-sm leading-relaxed">
            Repos are ranked by star velocity: the number of stars gained per day over a
            given period (24 hours, 7 days, or 30 days). The top 50 repositories by total
            stars are tracked daily, and their star counts are recorded to compute deltas.
          </p>
        </div>

        <div className="card p-5">
          <p className="section-label mb-2">Velocity</p>
          <p className="data-mono text-text-muted text-sm">
            velocity = stars_gained / days_in_period
          </p>
          <p className="text-text-dim text-xs mt-2 leading-relaxed">
            Measured in stars per day. A repo gaining 700 stars over 7 days has a velocity
            of 100/d.
          </p>
        </div>

        <div className="card p-5">
          <p className="section-label mb-2">Forecast</p>
          <p className="text-text-muted text-sm leading-relaxed">
            Uses linear regression on the last 14 days of star history to predict when a
            repo will reach the next power-of-10 milestone. Only shown for repos with a
            consistent upward trend.
          </p>
        </div>

        <div className="card p-5">
          <p className="section-label mb-2">Data</p>
          <p className="text-text-dim text-xs leading-relaxed">
            GitHub API - refreshed daily via GitHub Actions - Next.js 14 - React 18 -
            Tailwind CSS - TypeScript
          </p>
        </div>
      </div>
    </main>
  );
}
