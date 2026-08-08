"use client";
import Link from "next/link";
import InteractiveSparkline from "./InteractiveSparkline";
import { languageColor } from "@/lib/language-color";
import { gainedColor } from "@/lib/gained-color";
import type { RepoWithVelocity } from "@/lib/db";
import { TrendingUp, TrendingDown, Minus } from "./icons";
import HotStreak from "./HotStreak";

export default function MobileRepoCard({
  repo,
  index,
  onSelect,
}: {
  repo: RepoWithVelocity;
  index: number;
  onSelect: (r: RepoWithVelocity) => void;
}) {
  const isTop = index === 0;

  return (
    <div className="animate-fade-up" style={{ animationDelay: `${Math.min(index * 25, 200)}ms` }}>
      <Link
        href={`/repo/${repo.slug}`}
        onClick={(e) => {
          if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
            e.preventDefault();
            onSelect(repo);
          }
        }}
      >
        <div className={`card p-4 active:scale-[0.98] transition-all duration-400 ease-out-expo hover:shadow-card-hover ${
          isTop ? "border-accent/20 bg-accent/[0.03]" : ""
        }`}>
          {/* Header row */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className={`data-mono text-xs shrink-0 tabular-nums ${isTop ? "text-accent font-semibold" : "text-text-dim"}`}>
                {repo.rank}
              </span>
              <span className="font-medium text-text-body text-sm truncate">
                {repo.full_name}
              </span>
              <HotStreak velocity={repo.velocity} />
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              {repo.rankChange != null ? (
                repo.rankChange > 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 text-positive" />
                ) : repo.rankChange < 0 ? (
                  <TrendingDown className="w-3.5 h-3.5 text-negative" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-text-dim" />
                )
              ) : null}
              {repo.rankChange != null && repo.rankChange !== 0 && (
                <span
                  className={`data-mono text-[10px] tabular-nums ${repo.rankChange > 0 ? "text-positive" : "text-negative"}`}
                >
                  {repo.rankChange > 0 ? `+${repo.rankChange}` : repo.rankChange}
                </span>
              )}
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-2 mb-3">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: languageColor(repo.language) }}
                />
                <span className="text-text-dim text-[11px]">{repo.language}</span>
              </span>
            )}
            <span className="text-text-dim text-[11px] data-mono">
              {(repo.stars / 1000).toFixed(1)}K
            </span>
            {repo.category && (
              <span className="text-text-dim/50 text-[11px] capitalize">{repo.category}</span>
            )}
          </div>

          {/* Sparkline */}
          <div className="mb-3">
            <InteractiveSparkline data={repo.sparkline} width={120} height={36} />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-dim text-[10px] font-mono">GAINED</p>
              <p
                className={`data-mono text-sm tabular-nums ${gainedColor(repo.stars_gained)}`}
              >
                {repo.stars_gained != null
                  ? `${repo.stars_gained > 0 ? "+" : ""}${repo.stars_gained.toLocaleString()}`
                  : "—"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-dim text-[10px] font-mono">VELOCITY</p>
              <p className="data-mono text-sm tabular-nums text-text-body">
                {repo.velocity != null ? `${repo.velocity}/d` : "—"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
