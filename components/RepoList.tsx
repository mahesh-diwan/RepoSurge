"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import type { RepoWithVelocity } from "@/lib/db";
import RepoCard from "./RepoCard";
import SearchInput from "./SearchInput";
import Panel from "./Panel";
import RepoDetail from "./RepoDetail";
import Tooltip from "./Tooltip";
import { ToastProvider, useToast } from "./Toast";
import ShortcutsModal from "./ShortcutsModal";

class RepoListBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12">
          <p className="text-text-muted text-sm mb-4">Something went wrong</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-zinc-800 text-text-body text-sm rounded hover:bg-zinc-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function RepoList({ repos }: { repos: { day: RepoWithVelocity[]; week: RepoWithVelocity[]; month: RepoWithVelocity[] } }) {
  return (
    <ToastProvider>
      <RepoListContent repos={repos} />
    </ToastProvider>
  );
}

function RepoListContent({ repos }: { repos: { day: RepoWithVelocity[]; week: RepoWithVelocity[]; month: RepoWithVelocity[] } }) {
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");

  type SortKey = "rank" | "name" | "gained" | "stars";
  type SortDir = "asc" | "desc";

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const currentRepos = repos[period];

  const [minStars, setMinStars] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [visibleColumns, setVisibleColumns] = useState({ rank: true, name: true, gained: true, stars: true });
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [columnMenuOpen, setColumnMenuOpen] = useState(false);
  const columnMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowHelp(false), 5000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!columnMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(e.target as Node)) {
        setColumnMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [columnMenuOpen]);

  const allLanguages = useMemo(() => {
    const langs = new Set(currentRepos.map(r => r.language).filter(Boolean));
    return Array.from(langs).sort();
  }, [currentRepos]);

  const [langFilter, setLangFilter] = useState<string | null>(null);

  const languageFiltered = langFilter
    ? currentRepos.filter(r => r.language === langFilter)
    : currentRepos;

  const starFiltered = minStars > 0
    ? languageFiltered.filter(r => r.stars >= minStars)
    : languageFiltered;

  const searchFiltered = search
    ? starFiltered.filter(r => r.full_name.toLowerCase().includes(search.toLowerCase()))
    : starFiltered;

  const sorted = useMemo(() => {
    if (!sortKey) return searchFiltered;
    return [...searchFiltered].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "rank":
          return (a.rank - b.rank) * dir;
        case "name":
          return a.full_name.localeCompare(b.full_name) * dir;
        case "gained":
          return ((a.stars_gained ?? 0) - (b.stars_gained ?? 0)) * dir;
        case "stars":
          return (a.stars - b.stars) * dir;
        default:
          return 0;
      }
    });
  }, [searchFiltered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else {
        setSortKey(null);
        setSortDir("asc");
      }
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShortcutsOpen(prev => !prev);
        return;
      }
      if (e.key === "Escape") {
        if (shortcutsOpen) {
          setShortcutsOpen(false);
          return;
        }
        setSelectedRepo(null);
        return;
      }
      if (selectedRepo) return;
      if ((e.metaKey || e.ctrlKey) && e.key === "c" && focusedIndex >= 0) {
        e.preventDefault();
        const repo = sorted[focusedIndex];
        navigator.clipboard.writeText(repo.full_name).then(() => {
          toast({ type: "info", message: `Copied "${repo.full_name}"` });
        });
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex(i => Math.min(i + 1, sorted.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex(i => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && focusedIndex >= 0) {
        setSelectedRepo(sorted[focusedIndex].slug);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selectedRepo, sorted, focusedIndex, shortcutsOpen, toast]);

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : "";

  return (
    <>
      {showHelp && (
        <div className="text-center mb-4">
          <p className="text-text-muted/50 text-xs">Tip: Press <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[10px] font-mono border border-zinc-600/50">?</kbd> for keyboard shortcuts</p>
        </div>
      )}

      <div className="flex justify-center gap-0.5 mb-6 bg-surface rounded-xl p-0.5 border border-white/[0.06]">
        {(["day", "week", "month"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer active:scale-[0.97] ${
              period === p ? "bg-accent text-midnight" : "text-text-muted hover:text-text-body"
            }`}
          >
            {p === "day" ? "daily" : p === "week" ? "weekly" : "monthly"}
          </button>
        ))}
      </div>

      {allLanguages.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mb-6">
          <button
            onClick={() => setLangFilter(null)}
            className={`px-2 py-0.5 text-[11px] rounded-full border transition-colors cursor-pointer active:scale-[0.97] ${
              langFilter === null
                ? "bg-accent/10 border-accent/30 text-accent"
                : "border-white/[0.06] text-text-muted hover:border-white/[0.12]"
            }`}
          >
            all
          </button>
          {allLanguages.map(lang => (
            <button
              key={lang}
              onClick={() => setLangFilter(lang === langFilter ? null : lang)}
              className={`px-2 py-0.5 text-[11px] rounded-full border transition-colors cursor-pointer active:scale-[0.97] ${
                langFilter === lang
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "border-white/[0.06] text-text-muted hover:border-white/[0.12]"
              }`}
            >
              {lang}
            </button>
          ))}
          <input
            type="number"
            min={0}
            value={minStars}
            onChange={e => setMinStars(Math.max(0, parseInt(e.target.value) || 0))}
            placeholder="min stars"
            aria-label="Minimum stars filter"
            aria-invalid={minStars < 0}
            className={`w-20 px-2 py-0.5 text-[11px] bg-surface border rounded-full text-text-muted placeholder-text-muted/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 ${minStars < 0 ? "border-red-500" : "border-white/[0.06]"}`}
          />
        </div>
      )}

      <div className="flex justify-center mb-6">
        <SearchInput value={search} onChange={setSearch} autoFocus />
      </div>

      <div className="flex items-center justify-between px-2 mb-2">
        <button
          onClick={() => setViewMode(v => v === "list" ? "grid" : "list")}
          className="text-text-muted text-xs hover:text-accent px-2 py-0.5 rounded border border-white/[0.06] hover:border-accent/30 transition-colors cursor-pointer"
          aria-label={viewMode === "list" ? "Switch to grid view" : "Switch to list view"}
        >
          {viewMode === "list" ? "grid" : "list"} view
        </button>
        <div className="relative" ref={columnMenuRef}>
          <button
            onClick={() => setColumnMenuOpen(!columnMenuOpen)}
            className="text-text-muted text-xs hover:text-accent px-2 py-0.5 rounded border border-white/[0.06] hover:border-accent/30 transition-colors cursor-pointer"
            aria-label="Toggle column visibility"
          >
            columns
          </button>
          {columnMenuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-surface border border-zinc-700/50 rounded shadow-lg p-2 z-20 min-w-[120px]">
              <label className="flex items-center gap-2 text-xs text-text-muted py-1 cursor-pointer hover:text-text-body">
                <input type="checkbox" checked={visibleColumns.rank} onChange={e => setVisibleColumns(prev => ({ ...prev, rank: e.target.checked }))} /> #
              </label>
              <label className="flex items-center gap-2 text-xs text-text-muted py-1 cursor-pointer hover:text-text-body">
                <input type="checkbox" checked={visibleColumns.name} onChange={e => setVisibleColumns(prev => ({ ...prev, name: e.target.checked }))} /> Name
              </label>
              <label className="flex items-center gap-2 text-xs text-text-muted py-1 cursor-pointer hover:text-text-body">
                <input type="checkbox" checked={visibleColumns.gained} onChange={e => setVisibleColumns(prev => ({ ...prev, gained: e.target.checked }))} /> Gained
              </label>
              <label className="flex items-center gap-2 text-xs text-text-muted py-1 cursor-pointer hover:text-text-body">
                <input type="checkbox" checked={visibleColumns.stars} onChange={e => setVisibleColumns(prev => ({ ...prev, stars: e.target.checked }))} /> Stars
              </label>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 py-2.5 px-2 text-[10px] sm:text-xs text-text-muted border-b border-border mb-1 sticky top-0 bg-midnight z-10">
        {visibleColumns.rank && (
          <Tooltip label="Sort by rank">
            <button
              onClick={() => handleSort("rank")}
              className="w-6 text-right shrink-0 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:text-accent/70 transition-colors cursor-pointer active:scale-[0.98]"
              aria-label="Sort by rank"
            >
              #{arrow("rank")}
            </button>
          </Tooltip>
        )}
        {visibleColumns.name && (
          <Tooltip label="Sort alphabetically">
            <button
              onClick={() => handleSort("name")}
              className="flex-1 min-w-0 shrink-0 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:text-accent/70 transition-colors cursor-pointer active:scale-[0.98] text-left"
              aria-label="Sort alphabetically"
            >
              repo{arrow("name")}
            </button>
          </Tooltip>
        )}
        {visibleColumns.gained && (
          <Tooltip label="Sort by stars gained">
            <button
              onClick={() => handleSort("gained")}
              className="w-20 text-right shrink-0 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:text-accent/70 transition-colors cursor-pointer active:scale-[0.98]"
              aria-label="Sort by stars gained"
            >
              gained{arrow("gained")}
            </button>
          </Tooltip>
        )}
        {visibleColumns.gained && (
          <Tooltip label="Stars gained over the current period. Calculated as (current stars) - (stars at start of period).">
            <svg className="w-3 h-3 text-text-muted/50 shrink-0 cursor-help" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm0 1.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Zm-.5 4h1v4.5h-1V6.5ZM8 5.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
          </Tooltip>
        )}
        {visibleColumns.stars && (
          <div className="hidden sm:block shrink-0 w-16">
            <Tooltip label="Sort by stars">
              <button
                onClick={() => handleSort("stars")}
                className="w-full text-right hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:text-accent/70 transition-colors cursor-pointer active:scale-[0.98]"
                aria-label="Sort by stars"
              >
                stars{arrow("stars")}
              </button>
            </Tooltip>
          </div>
        )}
      </div>

      {searchFiltered.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-text-muted text-xs">no repos match &ldquo;{search}&rdquo;{langFilter ? ` in ${langFilter}` : ""}</p>
          <button
            onClick={() => { setSearch(""); setLangFilter(null); }}
            className="text-accent text-xs mt-2 hover:underline cursor-pointer"
          >
            clear filters
          </button>
        </div>
      ) : (
        <RepoListBoundary>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4">
              {sorted.slice(0, 25).map((repo, i) => (
                <RepoCard
                  key={repo.full_name}
                  rank={repo.rank}
                  name={repo.name}
                  slug={repo.slug}
                  stars={repo.stars}
                  gained={repo.stars_gained}
                  language={repo.language ?? ""}
                  onSelect={setSelectedRepo}
                  hero={i < 3}
                  description={repo.description}
                  rankChange={repo.rankChange}
                  sparkline={repo.sparkline}
                  compact
                />
              ))}
            </div>
          ) : (
            <div ref={listRef} className="flex flex-col pb-8">
              {sorted.slice(0, 25).map((repo, i) => (
                <RepoCard
                  key={repo.full_name}
                  rank={repo.rank}
                  name={repo.name}
                  slug={repo.slug}
                  stars={repo.stars}
                  gained={repo.stars_gained}
                  language={repo.language ?? ""}
                  onSelect={setSelectedRepo}
                  hero={i < 3}
                  description={repo.description}
                  rankChange={repo.rankChange}
                  sparkline={repo.sparkline}
                />
              ))}
            </div>
          )}
        </RepoListBoundary>
      )}

      <Panel open={!!selectedRepo} onClose={() => setSelectedRepo(null)}>
        {selectedRepo && <RepoDetail slug={selectedRepo} />}
      </Panel>

      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  );
}
