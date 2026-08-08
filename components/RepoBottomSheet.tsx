"use client";
import { useState } from "react";
import InteractiveSparkline from "./InteractiveSparkline";
import { languageColor } from "@/lib/language-color";
import { gainedColor } from "@/lib/gained-color";
import type { RepoWithVelocity } from "@/lib/db";
import { X } from "./icons";

export default function RepoBottomSheet({
  repo,
  onClose,
}: {
  repo: RepoWithVelocity | null;
  onClose: () => void;
}) {
  const [active, setActive] = useState(false);

  // Trigger enter animation on change
  if (repo && !active) setActive(true);

  if (!repo) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-40 animate-fade-in"
        onClick={onClose}
      />
      <div
        className="fixed bottom-0 left-0 right-0 bg-surface-elevated border-t border-border rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto animate-slide-up"
        style={active ? {} : { transform: "translateY(100%)" }}
      >
        <div className="sticky top-0 bg-surface-elevated border-b border-border px-5 py-4 flex items-center justify-between rounded-t-3xl">
          <div>
            <h3 className="font-medium text-text-body text-base">{repo.full_name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
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
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-border/50 transition-colors"
          >
            <X className="w-4 h-4 text-text-dim" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-3">
              <p className="text-text-dim text-[10px] font-mono mb-1">GAINED</p>
              <p
                className={`data-mono text-lg tabular-nums ${gainedColor(repo.stars_gained)}`}
              >
                {repo.stars_gained != null
                  ? `${repo.stars_gained > 0 ? "+" : ""}${repo.stars_gained.toLocaleString()}`
                  : "—"}
              </p>
            </div>
            <div className="card p-3">
              <p className="text-text-dim text-[10px] font-mono mb-1">VELOCITY</p>
              <p className="data-mono text-lg tabular-nums text-text-body">
                {repo.velocity != null ? `${repo.velocity}/d` : "—"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-text-dim text-[10px] font-mono mb-2">TREND</p>
            <InteractiveSparkline data={repo.sparkline} width={300} height={56} />
          </div>

          {repo.forecast && (
            <div className="card p-3">
              <p className="text-text-dim text-[10px] font-mono mb-1">FORECAST</p>
              <p className="data-mono text-sm text-text-body">{repo.forecast}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
