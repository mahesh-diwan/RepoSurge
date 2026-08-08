"use client";

import Link from "next/link";
import InteractiveSparkline from "./InteractiveSparkline";
import { languageColor } from "@/lib/language-color";
import { gainedColor } from "@/lib/gained-color";
import type { RepoWithVelocity } from "@/lib/db";
import { Flame, TrendingUp, TrendingDown, Minus } from "./icons";

export default function DesktopRepoRow({ repo, index }: { repo: RepoWithVelocity; index: number }) {
  const isHot = (repo.stars_gained ?? 0) > 1000;

  return (
    <div
      className="animate-fade-up"
      style={{ animationDelay: `${Math.min(index * 15, 300)}ms` }}
    >
      <Link
        href={`/repo/${repo.slug}`}
        className="group grid grid-cols-[36px_1fr_80px_90px_90px_130px_64px] gap-3 items-center px-4 py-3.5 rounded-xl hover:bg-surface-elevated/60 transition-all duration-400 ease-out-expo hover:shadow-[inset_0_0_0_1px_var(--border)]"
      >
        <span className="data-mono text-text-dim text-sm tabular-nums">{repo.rank}</span>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-body text-sm truncate group-hover:text-accent transition-colors duration-300">
              {repo.full_name}
            </span>
            {isHot && <Flame className="w-3.5 h-3.5 text-accent shrink-0" />}
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

        <span className="data-mono text-text-body text-sm text-right tabular-nums">
          {(repo.stars / 1000).toFixed(1)}K
        </span>

        <span className={`data-mono text-sm text-right tabular-nums ${gainedColor(repo.stars_gained)}`}>
          {repo.stars_gained != null
            ? `${repo.stars_gained > 0 ? "+" : ""}${repo.stars_gained.toLocaleString()}`
            : "—"}
        </span>

        <span className="data-mono text-text-muted text-sm text-right tabular-nums">
          {repo.velocity != null ? `${repo.velocity}` : "—"}
          <span className="text-text-dim text-[10px] ml-0.5">/d</span>
        </span>

        <div className="flex justify-end">
          <InteractiveSparkline data={repo.sparkline} width={110} height={28} />
        </div>

        <div className="text-right">
          {repo.rankChange != null ? (
            <span
              className={`inline-flex items-center gap-0.5 data-mono text-xs tabular-nums ${repo.rankChange > 0 ? "text-positive" : repo.rankChange < 0 ? "text-negative" : "text-text-dim"}`}
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
