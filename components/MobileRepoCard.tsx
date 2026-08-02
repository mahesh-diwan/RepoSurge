"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import InteractiveSparkline from "./InteractiveSparkline";
import { languageColor } from "@/lib/language-color";
import type { RepoWithVelocity } from "@/lib/db";
import { Flame, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MobileRepoCard({ repo, index, onSelect }: {
  repo: RepoWithVelocity; index: number; onSelect: (r: RepoWithVelocity) => void;
}) {
  const isHot = (repo.stars_gained ?? 0) > 1000;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.4 }}>
      <Link href={`/repo/${repo.slug}`} onClick={(e) => {
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); onSelect(repo); }
      }}>
        <div className="bg-surface border border-border rounded-2xl p-4 active:scale-[0.98] transition-transform">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="font-mono text-text-muted text-xs shrink-0">{repo.rank}</span>
              <span className="font-medium text-text-body text-sm truncate">{repo.full_name}</span>
              {isHot && <Flame className="w-3.5 h-3.5 text-accent shrink-0" />}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {repo.rankChange != null ? (
                repo.rankChange > 0 ? <TrendingUp className="w-3.5 h-3.5 text-positive" /> :
                repo.rankChange < 0 ? <TrendingDown className="w-3.5 h-3.5 text-negative" /> :
                <Minus className="w-3.5 h-3.5 text-text-muted" />
              ) : null}
              {repo.rankChange != null && (
                <span className={`text-[10px] font-mono ${repo.rankChange > 0 ? "text-positive" : repo.rankChange < 0 ? "text-negative" : "text-text-muted"}`}>
                  {repo.rankChange > 0 ? `+${repo.rankChange}` : repo.rankChange}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            {repo.language && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: languageColor(repo.language) }} />
                <span className="text-text-muted text-[11px]">{repo.language}</span>
              </span>
            )}
            <span className="text-text-muted text-[11px]">
              {(repo.stars / 1000).toFixed(1)}K ★
            </span>
            {repo.category && (
              <span className="text-text-muted/60 text-[11px] capitalize">{repo.category}</span>
            )}
          </div>

          <div className="mb-3">
            <InteractiveSparkline data={repo.sparkline} width={120} height={40} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-xs">Gained</p>
              <p className={`font-mono text-sm tabular-nums ${(repo.stars_gained ?? 0) > 0 ? "text-positive" : "text-text-muted"}`}>
                {repo.stars_gained != null ? `${repo.stars_gained > 0 ? "+" : ""}${repo.stars_gained.toLocaleString()}` : "—"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-text-muted text-xs">Velocity</p>
              <p className="font-mono text-sm tabular-nums text-text-body">
                {repo.velocity != null ? `${repo.velocity}/d` : "—"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
