"use client";

import Link from "next/link";
import Sparkline from "./Sparkline";
import { languageColor } from "@/lib/language-color";
import { gainedColor } from "@/lib/gained-color";
import type { RepoWithVelocity } from "@/lib/db";
import { TrendingUp, TrendingDown, Minus } from "./icons";
import HotStreak from "./HotStreak";

export default function DesktopRepoRow({ repo, index }: { repo: RepoWithVelocity; index: number }) {
  const isTop = index === 0;

  return (
    <div
      className="animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 12, 240)}ms` }}
    >
      <Link
        href={`/repo/${repo.slug}`}
        className={`group grid grid-cols-[40px_1fr_90px_100px_100px_130px_70px] gap-3 items-center px-4 py-3 rounded-xl transition-all duration-400 ease-out-expo border ${
          isTop
            ? "bg-accent/[0.03] border-accent/20 hover:bg-accent/[0.06]"
            : "border-transparent hover:bg-surface-elevated/60 hover:shadow-[inset_0_0_0_1px_var(--border)]"
        }`}
      >
        {/* Rank */}
        <span className={`data-mono text-sm tabular-nums ${isTop ? "text-accent font-bold" : "text-text-dim"}`}>
          {repo.rank}
        </span>

        {/* Repo info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-body text-sm truncate group-hover:text-accent transition-colors duration-300">
              {repo.full_name}
            </span>
            <HotStreak velocity={repo.velocity} />
            {repo.isNew && (
              <span className="px-1.5 py-0.5 text-[9px] font-mono bg-info/10 text-info border border-info/20 rounded-full">
                NEW
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: languageColor(repo.language) }} />
                <span className="text-text-dim text-[11px]">{repo.language}</span>
              </span>
            )}
            {repo.category && (
              <span className="text-text-dim/50 text-[11px] capitalize">{repo.category}</span>
            )}
          </div>
        </div>

        {/* Stars */}
        <span className="data-mono text-text-body text-sm text-right tabular-nums">
          {(repo.stars / 1000).toFixed(1)}K
        </span>

        {/* Gained */}
        <span className={`data-mono text-sm text-right tabular-nums ${gainedColor(repo.stars_gained)}`}>
          {repo.stars_gained != null
            ? `${repo.stars_gained > 0 ? "+" : ""}${repo.stars_gained.toLocaleString()}`
            : "—"}
        </span>

        {/* Velocity */}
        <span className="data-mono text-text-muted text-sm text-right tabular-nums">
          {repo.velocity != null ? `${repo.velocity}` : "—"}
          <span className="text-text-dim text-[10px] ml-0.5">/d</span>
        </span>

        {/* Sparkline */}
        <div className="flex justify-end">
          <Sparkline data={repo.sparkline} width={110} height={28} variant="inline" />
        </div>

        {/* Rank change */}
        <div className="text-right">
          {repo.rankChange != null ? (
            <span
              className={`inline-flex items-center gap-0.5 data-mono text-xs tabular-nums transition-all duration-500 ease-out-expo ${
                repo.rankChange > 0
                  ? "text-positive"
                  : repo.rankChange < 0
                  ? "text-negative"
                  : "text-text-dim"
              }`}
              style={{
                transform:
                  repo.rankChange > 0
                    ? "translateY(-1px)"
                    : repo.rankChange < 0
                    ? "translateY(1px)"
                    : "translateY(0)",
              }}
            >
              {repo.rankChange > 0 ? (
                <>
                  <TrendingUp className="w-3 h-3" />
                  {repo.rankChange}
                </>
              ) : repo.rankChange < 0 ? (
                <>
                  <TrendingDown className="w-3 h-3" />
                  {Math.abs(repo.rankChange)}
                </>
              ) : (
                <Minus className="w-3 h-3" />
              )}
            </span>
          ) : (
            <span className="text-text-dim/30 data-mono text-xs">—</span>
          )}
        </div>
      </Link>
    </div>
  );
}
