"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import type { RepoWithVelocity } from "@/lib/db";
import RepoCard from "./RepoCard";
import SearchInput from "./SearchInput";
import Panel from "./Panel";
import RepoDetail from "./RepoDetail";

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
      if (e.key === "Escape") {
        setSelectedRepo(null);
        return;
      }
      if (selectedRepo) return;
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
  }, [selectedRepo, sorted, focusedIndex]);

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : "";

  return (
    <>
      <div className="flex justify-center gap-0.5 mb-6 bg-surface rounded-lg p-0.5 border border-white/[0.06]">
        {(["day", "week", "month"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
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
            className={`px-2 py-0.5 text-[11px] rounded-full border transition-colors cursor-pointer ${
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
              className={`px-2 py-0.5 text-[11px] rounded-full border transition-colors cursor-pointer ${
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

      <div className="flex items-center gap-3 py-2.5 px-2 text-[10px] sm:text-xs text-text-muted border-b border-border mb-1 sticky top-0 bg-midnight z-10">
        <button
          onClick={() => handleSort("rank")}
          className="w-6 text-right shrink-0 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:text-accent/70 transition-colors cursor-pointer"
          title="Sort by rank"
        >
          #{arrow("rank")}
        </button>
        <button
          onClick={() => handleSort("name")}
          className="flex-1 min-w-0 shrink-0 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:text-accent/70 transition-colors cursor-pointer text-left"
          title="Sort alphabetically"
        >
          repo{arrow("name")}
        </button>
        <button
          onClick={() => handleSort("gained")}
          className="w-20 text-right shrink-0 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:text-accent/70 transition-colors cursor-pointer"
          title="Sort by stars gained"
        >
          gained{arrow("gained")}
        </button>
        <button
          onClick={() => handleSort("stars")}
          className="hidden sm:block shrink-0 w-16 text-right hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:text-accent/70 transition-colors cursor-pointer"
          title="Sort by stars"
        >
          stars{arrow("stars")}
        </button>
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
        <div ref={listRef} className="flex flex-col pb-8">
          {sorted.slice(0, 25).map((repo, i) => {
            return (
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
            );
          })}
        </div>
        </RepoListBoundary>
      )}

      <Panel open={!!selectedRepo} onClose={() => setSelectedRepo(null)}>
        {selectedRepo && <RepoDetail slug={selectedRepo} />}
      </Panel>
    </>
  );
}
