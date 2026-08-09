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
      style={{ animationDelay: `${Math.min(index * 10, 200)}ms` }}
    >
      <Link
        href={`/repo/${repo.slug}`}
        className={`group grid grid-cols-[36px_1fr_80px_90px_90px_120px_64px] gap-3 items-center px-4 py-2.5 rounded-xl transition-[transform,background-color,box-shadow] duration-200 ease-spring border ${
          isTop
            ? "bg-accent/[0.03] border-accent/20 hover:bg-accent/[0.06]"
            : "border-transparent hover:bg-surface-elevated/50 hover:shadow-[inset_0_0_0_1px_var(--border)]"
        } active:scale-[0.97] active:bg-surface-elevated/40`}
      >
        {/* Rank badge */}
        <span className={`data-mono text-sm tabular-nums w-7 h-7 rounded-lg flex items-center justify-center ${
          isTop
            ? "bg-accent/10 text-accent font-bold"
            : "bg-white/[0.03] text-text-dim"
        }`}>
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
              <span className="px-1.5 py-0.5 text-[9px] font-mono bg-info/10 text-info border border-info/20 rounded-md">
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
          <Sparkline data={repo.sparkline} width={100} height={26} variant="inline" />
        </div>

        {/* Rank change */}
        <div className="text-right">
          {repo.rankChange != null ? (
            <span
              className={`inline-flex items-center gap-0.5 data-mono text-xs tabular-nums transition-[transform,color] duration-200 ease-spring ${
                repo.rankChange > 0
                  ? "text-positive"
                  : repo.rankChange < 0
                  ? "text-negative"
                  : "text-text-dim"
              }`}
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
