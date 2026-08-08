"use client";

import { useEffect, useState } from "react";
import type { RepoWithVelocity } from "@/lib/db";
import { useRepoList } from "@/lib/useRepoList";
import { downloadCSV } from "@/lib/repo-export";
import SearchInput from "./SearchInput";
import MobileRepoCard from "./MobileRepoCard";
import DesktopRepoRow from "./DesktopRepoRow";
import RepoBottomSheet from "./RepoBottomSheet";
import CompareChart from "./CompareChart";
import { ToastProvider, useToast } from "./Toast";
import ShortcutsModal from "./ShortcutsModal";
import type { SortKey } from "@/lib/repo-filter";

export default function RepoList({
  repos,
  defaultPeriod,
}: {
  repos: { day: RepoWithVelocity[]; week: RepoWithVelocity[]; month: RepoWithVelocity[] };
  defaultPeriod?: "day" | "week" | "month";
}) {
  return (
    <ToastProvider>
      <RepoListContent repos={repos} defaultPeriod={defaultPeriod} />
    </ToastProvider>
  );
}

function RepoListContent({
  repos,
  defaultPeriod,
}: {
  repos: { day: RepoWithVelocity[]; week: RepoWithVelocity[]; month: RepoWithVelocity[] };
  defaultPeriod?: "day" | "week" | "month";
}) {
  const { toast } = useToast();
  const list = useRepoList(repos, defaultPeriod ?? "week");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        list.toggleShortcuts();
        return;
      }
      if (e.key === "Escape") {
        if (list.shortcutsOpen) {
          list.closeShortcuts();
          return;
        }
        list.setSelectedRepo(null);
        return;
      }
      if (list.selectedRepo) return;
      if ((e.metaKey || e.ctrlKey) && e.key === "c" && list.focusedIndex >= 0) {
        e.preventDefault();
        navigator.clipboard
          .writeText(list.sorted[list.focusedIndex].full_name)
          .then(() => {
            toast({
              type: "info",
              message: `Copied "${list.sorted[list.focusedIndex].full_name}"`,
            });
          });
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        list.moveFocus(1);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        list.moveFocus(-1);
      }
      if (e.key === "Enter" && list.focusedIndex >= 0) {
        list.setSelectedRepo(list.sorted[list.focusedIndex]);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [list, toast]);

  const arrow = (key: SortKey) =>
    list.sortKey === key ? (list.sortDir === "asc" ? " ▲" : " ▼") : "";

  return (
    <>
      <div className="px-4 md:px-6">
        {/* Search + actions bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <SearchInput value={list.search} onChange={list.setSearch} autoFocus />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={list.toggleCompareMode}
              className={`px-3 py-2 text-[11px] font-mono rounded-lg border transition-all duration-200 ${
                list.compareMode
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "border-border text-text-muted hover:border-border hover:text-text-body"
              }`}
            >
              {list.compareMode ? "DONE" : "COMPARE"}
            </button>
            <button
              onClick={() => downloadCSV(list.sorted)}
              className="px-3 py-2 text-[11px] font-mono rounded-lg border border-border text-text-muted hover:border-border hover:text-text-body transition-all duration-200"
            >
              EXPORT
            </button>
          </div>
        </div>

        {/* Weekly highlight */}
        {list.period === "week" && list.sorted.length > 0 && (
          <div className="mb-6 card border-accent/20 px-5 py-4 animate-fade-up">
            <p className="text-text-body text-sm">
              <span className="font-semibold">{list.sorted[0].full_name}</span>{" "}
              <span className="data-mono text-accent">
                +{list.sorted[0].stars_gained?.toLocaleString("en-US")}
              </span>{" "}
              stars this week
              {list.sorted[0].rankChange != null && list.sorted[0].rankChange > 0 && (
                <span className="text-positive ml-2 data-mono text-xs">
                  ▲{list.sorted[0].rankChange}
                </span>
              )}
            </p>
          </div>
        )}

        {/* Filters */}
        {(list.allCategories.length > 0 || list.allLanguages.length > 0) && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            <button
              onClick={() => {
                list.setCatFilter(null);
                list.setLangFilter(null);
              }}
              className={`px-2.5 py-1.5 text-[11px] font-mono rounded-full border transition-all duration-200 ${
                list.catFilter === null && list.langFilter === null
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "border-border text-text-dim hover:border-border hover:text-text-muted"
              }`}
            >
              ALL
            </button>
            {list.allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => list.setCatFilter(cat === list.catFilter ? null : cat)}
                className={`px-2.5 py-1.5 text-[11px] font-mono rounded-full border transition-all duration-200 ${
                  list.catFilter === cat
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : "border-border text-text-dim hover:border-border hover:text-text-muted"
                }`}
              >
                #{cat}
              </button>
            ))}
            {list.allLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => list.setLangFilter(lang === list.langFilter ? null : lang)}
                className={`px-2.5 py-1.5 text-[11px] font-mono rounded-full border transition-all duration-200 ${
                  list.langFilter === lang
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : "border-border text-text-dim hover:border-border hover:text-text-muted"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        )}

        {/* Desktop column headers */}
        {!isMobile && (
          <div className="grid grid-cols-[36px_1fr_80px_90px_90px_130px_64px] gap-3 px-4 py-2 mb-1">
            <button
              onClick={() => list.handleSort("rank")}
              className="text-left hover:text-accent transition-colors"
            >
              <span className="section-label">#{arrow("rank")}</span>
            </button>
            <button
              onClick={() => list.handleSort("name")}
              className="text-left hover:text-accent transition-colors"
            >
              <span className="section-label">REPO{arrow("name")}</span>
            </button>
            <button
              onClick={() => list.handleSort("stars")}
              className="text-right hover:text-accent transition-colors"
            >
              <span className="section-label">STARS{arrow("stars")}</span>
            </button>
            <button
              onClick={() => list.handleSort("gained")}
              className="text-right hover:text-accent transition-colors"
            >
              <span className="section-label">GAINED{arrow("gained")}</span>
            </button>
            <button
              onClick={() => list.handleSort("velocity")}
              className="text-right hover:text-accent transition-colors"
            >
              <span className="section-label">VEL{arrow("velocity")}</span>
            </button>
            <div className="text-right">
              <span className="section-label">TREND</span>
            </div>
            <button
              onClick={() => list.handleSort("rank")}
              className="text-right hover:text-accent transition-colors"
            >
              <span className="section-label">RK{arrow("rank")}</span>
            </button>
          </div>
        )}

        {/* List or empty state */}
        {list.filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="inline-flex flex-col items-center gap-2">
              <p className="text-text-muted text-sm">
                No repos match &ldquo;{list.search}&rdquo;
              </p>
              <button
                onClick={() => {
                  list.setSearch("");
                  list.setLangFilter(null);
                  list.setCatFilter(null);
                }}
                className="text-accent text-xs hover:underline"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <div className={isMobile ? "flex flex-col gap-3" : "flex flex-col gap-px"}>
            {list.sorted
              .slice(0, list.showAll ? list.sorted.length : 25)
              .map((repo, i) =>
                isMobile ? (
                  <MobileRepoCard
                    key={repo.slug}
                    repo={repo}
                    index={i}
                    onSelect={list.setSelectedRepo}
                  />
                ) : (
                  <DesktopRepoRow key={repo.slug} repo={repo} index={i} />
                )
              )}
            {list.sorted.length > 25 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => list.setShowAll(!list.showAll)}
                  className="text-accent text-xs font-mono hover:underline"
                >
                  {list.showAll ? "Show top 25" : `Show all ${list.sorted.length} repos`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compare chart */}
      {list.compareMode && list.compareSet.length >= 2 && (
        <CompareChart repos={list.compareSet} />
      )}

      {/* Detail panel */}
      {isMobile ? (
        <RepoBottomSheet repo={list.selectedRepo} onClose={() => list.setSelectedRepo(null)} />
      ) : (
        list.selectedRepo && (
          <div
            className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4"
            onClick={() => list.setSelectedRepo(null)}
          >
            <div
              className="card max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-text-body">{list.selectedRepo.full_name}</h3>
                <button
                  onClick={() => list.setSelectedRepo(null)}
                  className="text-text-dim hover:text-text-body transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="text-text-muted text-sm">
                {list.selectedRepo.description || "No description"}
              </p>
            </div>
          </div>
        )
      )}

      <ShortcutsModal open={list.shortcutsOpen} onClose={list.closeShortcuts} />
    </>
  );
}
