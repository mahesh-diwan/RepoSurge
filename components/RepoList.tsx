"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { RepoWithVelocity } from "@/lib/db";
import SearchInput from "./SearchInput";
import MobileRepoCard from "./MobileRepoCard";
import DesktopRepoRow from "./DesktopRepoRow";
import RepoBottomSheet from "./RepoBottomSheet";
import { ToastProvider, useToast } from "./Toast";
import ShortcutsModal from "./ShortcutsModal";

function exportCSV(repos: RepoWithVelocity[]) {
  function csvEscape(v: string) {
    return v.includes(",") || v.includes('"') || v.includes("\n")
      ? `"${v.replace(/"/g, '""')}"`
      : v;
  }
  const headers = ["repo", "stars", "gained", "velocity", "rank_change"];
  const rows = repos.map((r) => [
    csvEscape(r.full_name),
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

export default function RepoList({ repos, defaultPeriod }: { repos: { day: RepoWithVelocity[]; week: RepoWithVelocity[]; month: RepoWithVelocity[] }; defaultPeriod?: "day" | "week" | "month" }) {
  return (
    <ToastProvider>
      <RepoListContent repos={repos} defaultPeriod={defaultPeriod} />
    </ToastProvider>
  );
}

function RepoListContent({ repos, defaultPeriod }: { repos: { day: RepoWithVelocity[]; week: RepoWithVelocity[]; month: RepoWithVelocity[] }; defaultPeriod?: "day" | "week" | "month" }) {
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<RepoWithVelocity | null>(null);
  const [period, setPeriod] = useState<"day" | "week" | "month">(defaultPeriod ?? "week");

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
  const [isMobile, setIsMobile] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
        case "rank": return (a.rank - b.rank) * dir;
        case "name": return a.full_name.localeCompare(b.full_name) * dir;
        case "gained": return ((a.stars_gained ?? 0) - (b.stars_gained ?? 0)) * dir;
        case "stars": return (a.stars - b.stars) * dir;
        case "velocity": return ((a.velocity ?? 0) - (b.velocity ?? 0)) * dir;
        case "gainedPrev": return ((a.gainedPrev ?? 0) - (b.gainedPrev ?? 0)) * dir;
        case "accel": return ((a.accel ?? 0) - (b.accel ?? 0)) * dir;
        case "forecast": return ((a.forecast ?? "").localeCompare(b.forecast ?? "")) * dir;
        default: return 0;
      }
    });
  }, [searchFiltered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else { setSortKey(null); setSortDir("asc"); }
    } else { setSortKey(key); setSortDir("asc"); }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setShortcutsOpen(prev => !prev); return; }
      if (e.key === "Escape") { if (shortcutsOpen) { setShortcutsOpen(false); return; } setSelectedRepo(null); return; }
      if (selectedRepo) return;
      if ((e.metaKey || e.ctrlKey) && e.key === "c" && focusedIndex >= 0) {
        e.preventDefault();
        navigator.clipboard.writeText(sorted[focusedIndex].full_name).then(() => { toast({ type: "info", message: `Copied "${sorted[focusedIndex].full_name}"` }); });
        return;
      }
      if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIndex(i => Math.min(i + 1, sorted.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setFocusedIndex(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && focusedIndex >= 0) { setSelectedRepo(sorted[focusedIndex]); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selectedRepo, sorted, focusedIndex, shortcutsOpen, toast]);

  const arrow = (key: SortKey) => sortKey === key ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : "";

  return (
    <>
      <div className="px-4 md:px-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex bg-surface border border-border rounded-xl p-1 self-start">
            {(["day", "week", "month"] as const).map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${period === p ? "bg-accent/10 text-accent" : "text-text-muted hover:text-text-body"}`}>
                {p}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-md">
            <SearchInput value={search} onChange={setSearch} autoFocus />
          </div>
        </div>

        {period === "week" && sorted.length > 0 && (() => {
          const top = sorted[0];
          return (
            <div className="mb-6 bg-surface border border-accent/20 rounded-2xl px-5 py-4">
              <p className="text-text-body font-semibold text-sm">
                {top.full_name} <span className="text-accent">+{top.stars_gained?.toLocaleString("en-US")}</span> stars this week
                {top.rankChange != null && top.rankChange > 0 && <span className="text-positive ml-2">▲{top.rankChange}</span>}
              </p>
            </div>
          );
        })()}

        {(allCategories.length > 0 || allLanguages.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => { setCatFilter(null); setLangFilter(null); }}
              className={`px-3 py-2.5 text-xs rounded-full border transition-colors min-h-[44px] ${catFilter === null && langFilter === null ? "bg-accent/10 border-accent/30 text-accent" : "border-border text-text-muted hover:border-border/80"}`}>
              all
            </button>
            {allCategories.map(cat => (
              <button key={cat} onClick={() => setCatFilter(cat === catFilter ? null : cat)}
                className={`px-3 py-2.5 text-xs rounded-full border transition-colors min-h-[44px] ${catFilter === cat ? "bg-accent/10 border-accent/30 text-accent" : "border-border text-text-muted hover:border-border/80"}`}>
                #{cat}
              </button>
            ))}
            {allLanguages.map(lang => (
              <button key={lang} onClick={() => setLangFilter(lang === langFilter ? null : lang)}
                className={`px-3 py-2.5 text-xs rounded-full border transition-colors min-h-[44px] ${langFilter === lang ? "bg-accent/10 border-accent/30 text-accent" : "border-border text-text-muted hover:border-border/80"}`}>
                {lang}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mb-3">
          <button onClick={() => { setCompareMode(prev => { if (!prev) setCompareSet([]); return !prev; }); }}
            className="font-mono text-text-muted text-[10px] hover:text-accent transition-colors">
            {compareMode ? "done comparing" : "compare"}
          </button>
          <span className="text-text-muted/20">·</span>
          <button onClick={() => exportCSV(sorted)}
            className="font-mono text-text-muted text-[10px] hover:text-accent transition-colors">
            export data ↓
          </button>
        </div>

        {!isMobile && (
          <div className="hidden md:grid grid-cols-[40px_1fr_90px_100px_100px_140px_70px] gap-4 px-4 py-2 text-text-muted text-xs border-b border-border">
            <button onClick={() => handleSort("rank")} className="text-left hover:text-accent">#{arrow("rank")}</button>
            <button onClick={() => handleSort("name")} className="text-left hover:text-accent">repo{arrow("name")}</button>
            <button onClick={() => handleSort("stars")} className="text-right hover:text-accent">stars{arrow("stars")}</button>
            <button onClick={() => handleSort("gained")} className="text-right hover:text-accent">gained{arrow("gained")}</button>
            <button onClick={() => handleSort("velocity")} className="text-right hover:text-accent">velocity{arrow("velocity")}</button>
            <div className="text-right">trend</div>
            <button onClick={() => handleSort("rank")} className="text-right hover:text-accent">rank{arrow("rank")}</button>
          </div>
        )}

        {searchFiltered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-text-muted text-sm">no repos match &ldquo;{search}&rdquo;</p>
            <button onClick={() => { setSearch(""); setLangFilter(null); }} className="text-accent text-xs mt-2 hover:underline">
              clear filters
            </button>
          </div>
        ) : (
          <div ref={listRef} className={isMobile ? "flex flex-col gap-3" : "flex flex-col"}>
            {sorted.slice(0, showAll ? sorted.length : 25).map((repo, i) => (
              isMobile ? (
                <MobileRepoCard key={repo.slug} repo={repo} index={i} onSelect={setSelectedRepo} />
              ) : (
                <DesktopRepoRow key={repo.slug} repo={repo} index={i} />
              )
            ))}
            {sorted.length > 25 && (
              <div className="flex justify-center mt-4">
                <button onClick={() => setShowAll(prev => !prev)} className="font-mono text-accent text-[11px] hover:underline">
                  {showAll ? "show top 25" : `show all ${sorted.length} repos`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {compareMode && compareSet.length >= 2 && (
        <div className="mx-4 md:mx-6 mt-6 bg-surface border border-border rounded-2xl p-4">
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
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ["#D97706", "#34D399", "#F87171"][idx] }} />
                {repo.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {isMobile ? (
        <RepoBottomSheet repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      ) : (
        selectedRepo && (
          <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4" onClick={() => setSelectedRepo(null)}>
            <div className="bg-surface border border-border rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-5" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-text-body">{selectedRepo.full_name}</h3>
                <button onClick={() => setSelectedRepo(null)} className="text-text-muted hover:text-text-body">✕</button>
              </div>
              <p className="text-text-muted text-sm">{selectedRepo.description || "No description"}</p>
            </div>
          </div>
        )
      )}

      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </>
  );
}
