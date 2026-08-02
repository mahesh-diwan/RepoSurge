"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import InteractiveSparkline from "./InteractiveSparkline";
import { languageColor } from "@/lib/language-color";
import type { RepoWithVelocity } from "@/lib/db";

export default function RepoBottomSheet({ repo, onClose }: {
  repo: RepoWithVelocity | null; onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {repo && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-surface border border-border rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="sticky top-0 bg-surface border-b border-border px-5 py-4 flex items-center justify-between rounded-t-3xl">
              <div>
                <h3 className="font-medium text-text-body text-base">{repo.full_name}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  {repo.language && (
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: languageColor(repo.language) }} />
                      <span className="text-text-muted text-[11px]">{repo.language}</span>
                    </span>
                  )}
                  <span className="text-text-muted text-[11px]">{(repo.stars / 1000).toFixed(1)}K ★</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-border/50 transition-colors">
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border rounded-xl p-3">
                  <p className="text-text-muted text-xs mb-1">Gained</p>
                  <p className={`font-mono text-lg tabular-nums ${(repo.stars_gained ?? 0) > 0 ? "text-positive" : "text-text-muted"}`}>
                    {repo.stars_gained != null ? `${repo.stars_gained > 0 ? "+" : ""}${repo.stars_gained.toLocaleString()}` : "—"}
                  </p>
                </div>
                <div className="border border-border rounded-xl p-3">
                  <p className="text-text-muted text-xs mb-1">Velocity</p>
                  <p className="font-mono text-lg tabular-nums text-text-body">
                    {repo.velocity != null ? `${repo.velocity}/d` : "—"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-text-muted text-xs mb-2">Trend</p>
                <InteractiveSparkline data={repo.sparkline} width={300} height={60} />
              </div>

              {repo.forecast && (
                <div className="border border-border rounded-xl p-3">
                  <p className="text-text-muted text-xs mb-1">Forecast</p>
                  <p className="font-mono text-sm text-text-body">{repo.forecast}</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
