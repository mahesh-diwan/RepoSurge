"use client";
import Link from "next/link";
import InteractiveSparkline from "./InteractiveSparkline";
import { languageColor } from "@/lib/language-color";
import type { RepoWithVelocity } from "@/lib/db";
import { Flame } from "lucide-react";

export default function DesktopRepoRow({ repo, index }: { repo: RepoWithVelocity; index: number }) {
  const isHot = (repo.stars_gained ?? 0) > 1000;
  return (
    <Link
      href={`/repo/${repo.slug}`}
      className="group grid grid-cols-[40px_1fr_90px_100px_100px_140px_70px] gap-4 items-center px-4 py-3 rounded-xl border border-transparent hover:border-border hover:bg-surface/50 transition-all"
      style={{ animationDelay: `${Math.min(index * 30, 600)}ms` }}
    >
      <span className="font-mono text-text-muted text-sm">{repo.rank}</span>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-text-body text-sm truncate group-hover:text-accent transition-colors">
            {repo.full_name}
          </span>
          {isHot && <Flame className="w-3.5 h-3.5 text-accent" />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {repo.language && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: languageColor(repo.language) }} />
              <span className="text-text-muted text-[11px]">{repo.language}</span>
            </span>
          )}
          {repo.category && (
            <span className="text-text-muted/60 text-[11px] capitalize">{repo.category}</span>
          )}
        </div>
      </div>

      <span className="font-mono text-text-body text-sm text-right">{(repo.stars / 1000).toFixed(1)}K</span>

      <span className={`font-mono text-sm text-right ${(repo.stars_gained ?? 0) > 0 ? "text-positive" : "text-text-muted"}`}>
        {repo.stars_gained != null ? `${repo.stars_gained > 0 ? "+" : ""}${repo.stars_gained.toLocaleString()}` : "—"}
      </span>

      <span className="font-mono text-text-muted text-sm text-right">{repo.velocity != null ? `${repo.velocity}/d` : "—"}</span>

      <div className="flex justify-end">
        <InteractiveSparkline data={repo.sparkline} width={120} height={32} />
      </div>

      <div className="text-right">
        {repo.rankChange != null ? (
          <span className={`text-xs font-mono ${repo.rankChange > 0 ? "text-positive" : repo.rankChange < 0 ? "text-negative" : "text-text-muted"}`}>
            {repo.rankChange > 0 ? `▲${repo.rankChange}` : repo.rankChange < 0 ? `▼${Math.abs(repo.rankChange)}` : "—"}
          </span>
        ) : (
          <span className="text-text-muted/30 text-xs">—</span>
        )}
      </div>
    </Link>
  );
}
