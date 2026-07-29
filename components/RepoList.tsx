"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import type { RepoWithVelocity } from "@/lib/db";
import SearchInput from "./SearchInput";
import Panel from "./Panel";
import RepoDetail from "./RepoDetail";
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

function exportCSV(repos: RepoWithVelocity[]) {
  const headers = ["repo", "stars", "gained", "velocity", "rank_change"];
  const rows = repos.map((r) => [
    r.full_name,
    r.stars.toString(),
    (r.stars_gained ?? 0).toString(),
    (r.velocity ?? 0).toString(),
    (r.rankChange ?? 0).toString(),
  ]);
  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reposurge-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
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

  type SortKey = "rank" | "name" | "gained" | "stars" | "velocity" | "gainedPrev" | "accel" | "forecast";
  type SortDir = "asc" | "desc";

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const currentRepos = repos[period];

  const allLanguages = useMemo(() => {
    const langs = new Set(currentRepos.map(r => r.language).filter(Boolean));
    return Array.from(langs).sort();
  }, [currentRepos]);

  const [langFilter, setLangFilter] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState<string | null>(null);

  const allCategories = useMemo(() => [...new Set(currentRepos.map(r => r.category).filter(Boolean) as string[])], [currentRepos]);

  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showAll, setShowAll] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSet, setCompareSet] = useState<RepoWithVelocity[]>([]);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const categoryFiltered = catFilter
    ? currentRepos.filter(r => r.category === catFilter)
    : currentRepos;

  const languageFiltered = langFilter
    ? categoryFiltered.filter(r => r.language === langFilter)
    : categoryFiltered;

  const searchFiltered = search
    ? languageFiltered.filter(r => r.full_name.toLowerCase().includes(search.toLowerCase()))
    : languageFiltered;

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
        case "velocity":
          return ((a.velocity ?? 0) - (b.velocity ?? 0)) * dir;
        case "gainedPrev":
          return ((a.gainedPrev ?? 0) - (b.gainedPrev ?? 0)) * dir;
        case "accel":
          return ((a.accel ?? 0) - (b.accel ?? 0)) * dir;
        case "forecast":
          return ((a.forecast ?? "").localeCompare(b.forecast ?? "")) * dir;
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

      {
        period === "week" &&
          sorted.length > 0 &&
          (() => {
            const top = sorted[0];
            return (
              <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-amber-500/[0.04] border border-amber-500/10">
                <span className="text-amber-500 text-xs font-mono">
                  this week's top gainer:
                </span>
                <button
                  onClick={() => setSelectedRepo(top.slug)}
                  className="font-mono text-accent text-xs hover:underline cursor-pointer"
                >
                  {top.name}
                </button>
                <span className="font-mono text-positive text-xs">
                  +{(top.stars_gained ?? 0).toLocaleString("en-US")} stars
                </span>
                {top.rankChange != null && top.rankChange > 0 && (
                  <span className="font-mono text-text-muted text-xs">
                    ▲{top.rankChange} positions
                  </span>
                )}
              </div>
            );
          })()
      }

      {(allCategories.length > 0 || allLanguages.length > 0) && (
        <div className="flex flex-wrap justify-center gap-1 mb-6">
          <button
            onClick={() => { setCatFilter(null); setLangFilter(null); }}
            className={`px-2 py-0.5 text-[11px] rounded-full border transition-colors cursor-pointer active:scale-[0.97] ${
              catFilter === null && langFilter === null
                ? "bg-accent/10 border-accent/30 text-accent"
                : "border-white/[0.06] text-text-muted hover:border-white/[0.12]"
            }`}
          >
            all
          </button>
          {allCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat === catFilter ? null : cat)}
              className={`px-2 py-0.5 text-[11px] rounded-full border transition-colors cursor-pointer active:scale-[0.97] ${
                catFilter === cat
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "border-white/[0.06] text-text-muted hover:border-white/[0.12]"
              }`}
            >
              #{cat}
            </button>
          ))}
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
        </div>
      )}

      <div className="flex justify-center mb-6">
        <SearchInput value={search} onChange={setSearch} autoFocus />
      </div>

      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => { setCompareMode(prev => { if (!prev) setCompareSet([]); return !prev; }); }}
          className="font-mono text-text-muted text-[10px] hover:text-accent transition-colors cursor-pointer"
        >
          {compareMode ? "done comparing" : "compare"}
        </button>
        <span className="text-text-muted/20">·</span>
        <button
          onClick={() => exportCSV(sorted)}
          className="font-mono text-text-muted text-[10px] hover:text-accent transition-colors cursor-pointer"
        >
          export data ↓
        </button>
      </div>

      <div className="flex items-center gap-3 py-2 px-2 text-[10px] font-sans text-text-muted border-b border-border mb-1 sticky top-0 bg-midnight z-10">
        <button onClick={() => handleSort("rank")} className="w-8 text-left hover:text-accent transition-colors cursor-pointer">
          #{arrow("rank")}
        </button>
        <button onClick={() => handleSort("name")} className="flex-1 min-w-0 text-left hover:text-accent transition-colors cursor-pointer sticky left-0 z-[2] bg-midnight">
          repo{arrow("name")}
        </button>
        <button onClick={() => handleSort("stars")} className="w-20 text-right hover:text-accent transition-colors cursor-pointer hidden sm:block">
          stars{arrow("stars")}
        </button>
        <button onClick={() => handleSort("gained")} className="w-20 text-right hover:text-accent transition-colors cursor-pointer">
          gained{arrow("gained")}
        </button>
        <button onClick={() => handleSort("gainedPrev")} className="w-20 text-right hover:text-accent transition-colors cursor-pointer">
          vs LAST{arrow("gainedPrev")}
        </button>
        <button onClick={() => handleSort("velocity")} className="w-16 text-right hover:text-accent transition-colors cursor-pointer hidden sm:block">
          velocity{arrow("velocity")}
        </button>
        <button onClick={() => handleSort("accel")} className="w-14 text-right hover:text-accent transition-colors cursor-pointer hidden sm:block">
          accel{arrow("accel")}
        </button>
        <button onClick={() => handleSort("forecast")} className="w-20 text-right hover:text-accent transition-colors cursor-pointer hidden sm:block">
          forecast{arrow("forecast")}
        </button>
        <div className="w-12 text-right hidden sm:block">Δ rank</div>
        <span className="w-12 shrink-0 hidden sm:block" />
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
        <div ref={listRef}>
          {sorted.slice(0, showAll ? sorted.length : 25).map((repo, i) => {
            const isHot = (repo.stars_gained ?? 0) > 1000;
            function toggleCompare(r: RepoWithVelocity) {
              if (compareSet.find(c => c.full_name === r.full_name)) {
                setCompareSet(prev => prev.filter(c => c.full_name !== r.full_name));
              } else if (compareSet.length >= 3) {
                toast({ type: "info", message: "Max 3 repos for comparison" });
              } else {
                setCompareSet(prev => [...prev, r]);
              }
            }
            return (
              <div
                key={repo.full_name}
                className={`w-full flex items-center gap-3 py-2.5 px-2 border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors ${isHot ? "bg-amber-500/[0.015]" : ""}`}
              >
                {compareMode && (
                  <input
                    type="checkbox"
                    checked={!!compareSet.find(c => c.full_name === repo.full_name)}
                    onChange={() => toggleCompare(repo)}
                    className="accent-accent w-3 h-3"
                  />
                )}
                <span className="font-mono tabular-nums text-text-muted text-xs w-8">
                  {repo.rank}
                </span>
                <button
                  onClick={() => setSelectedRepo(repo.slug)}
                  className="flex-1 min-w-0 font-sans text-text-body text-xs truncate text-left cursor-pointer sticky left-0 z-[2] bg-midnight"
                >
                  {isHot && <span className="text-amber-500 mr-1">🔥</span>}
                  {repo.name}
                  {repo.isNew && <span className="text-amber-500 text-[9px] ml-1 font-mono">● NEW</span>}
                </button>
                <span className="font-mono tabular-nums text-text-muted text-xs w-20 text-right hidden sm:block">
                  {(repo.stars / 1000).toFixed(1)}K
                </span>
                <span
                  className={`font-mono tabular-nums text-xs w-20 text-right ${(repo.stars_gained ?? 0) > 0 ? "text-positive" : "text-text-muted/40"}`}
                >
                  {repo.stars_gained != null
                    ? `${repo.stars_gained > 0 ? "+" : ""}${repo.stars_gained.toLocaleString("en-US")}`
                    : "—"}
                </span>
                <span
                  className={`font-mono tabular-nums text-xs w-20 text-right ${(repo.gainedPrev ?? 0) > 0 ? "text-positive" : (repo.gainedPrev ?? 0) < 0 ? "text-negative" : "text-text-muted/40"}`}
                >
                  {repo.gainedPrev != null
                    ? `${repo.gainedPrev > 0 ? "+" : ""}${repo.gainedPrev.toLocaleString("en-US")}`
                    : "—"}
                </span>
                <span className="font-mono tabular-nums text-text-muted text-xs w-16 text-right hidden sm:block">
                  {repo.velocity != null ? repo.velocity : "—"}
                </span>
                <span className="font-mono tabular-nums text-xs w-14 text-right hidden sm:block text-text-muted/40">
{repo.accel != null
                     ? `${repo.accel > 1 ? "▲" : repo.accel < 1 ? "▼" : "="}${repo.accel.toFixed(1)}x`
                     : "—"}
                </span>
                <span className="font-mono tabular-nums text-text-muted text-xs w-20 text-right hidden sm:block">
                  {repo.forecast ?? "—"}
                </span>
                <span
                  className={`font-mono tabular-nums text-xs w-12 text-right hidden sm:block ${(repo.rankChange ?? 0) > 0 ? "text-positive" : (repo.rankChange ?? 0) < 0 ? "text-negative" : "text-text-muted/40"}`}
                >
                  {repo.rankChange != null && repo.rankChange !== 0
                    ? `${repo.rankChange > 0 ? "▲" : "▼"}${Math.abs(repo.rankChange)}`
                    : "—"}
                </span>
                <span className="w-12 shrink-0 hidden sm:block">
                  {repo.sparkline.length > 1 && (
                    <svg viewBox={`0 0 ${repo.sparkline.length - 1} 12`} className="w-full h-3" preserveAspectRatio="none">
                      <path
                        d={repo.sparkline.map((s, i) => `${i === 0 ? "M" : "L"}${i},${12 - ((s - Math.min(...repo.sparkline)) / (Math.max(...repo.sparkline) - Math.min(...repo.sparkline) || 1)) * 10}`).join(" ")}
                        fill="none" stroke="rgba(217,119,6,0.3)" strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </span>
              </div>
            );
          })}
          {sorted.length > 25 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAll(prev => !prev)}
                className="font-mono text-accent text-[11px] hover:underline cursor-pointer"
              >
                {showAll ? "show top 25" : `show all ${sorted.length} repos`}
              </button>
            </div>
          )}
        </div>
      )}

      {compareMode && compareSet.length >= 2 && (
        <div className="mt-6 bg-surface border border-border rounded-2xl p-4">
          <p className="font-mono text-text-muted text-[10px] mb-3">compare: star trend</p>
          <svg viewBox="0 0 300 60" className="w-full h-16">
            {compareSet.map((repo, idx) => {
              const colors = ["rgba(217,119,6,0.8)", "rgba(52,211,153,0.8)", "rgba(248,113,113,0.8)"];
              const data = repo.sparkline;
              if (data.length < 2) return null;
              const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
              const d = data.map((s, i) => `${i === 0 ? "M" : "L"}${(i / (data.length - 1)) * 300},${60 - ((s - min) / range) * 50}`).join(" ");
              return <path key={repo.full_name} d={d} fill="none" stroke={colors[idx]} strokeWidth="2" />;
            })}
          </svg>
          <div className="flex gap-4 mt-2">
            {compareSet.map((repo, idx) => (
              <span key={repo.full_name} className="font-mono text-[10px] text-text-muted flex items-center gap-1">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: ["#D97706", "#34D399", "#F87171"][idx] }} />
                {repo.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <Panel open={!!selectedRepo} onClose={() => setSelectedRepo(null)}>
        {selectedRepo && <RepoDetail slug={selectedRepo} />}
      </Panel>

      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  );
}
