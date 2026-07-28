"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import type { RepoWithVelocity } from "@/lib/db";
import { gainedColor } from "@/lib/gained-color";
import { useLiveStars } from "@/lib/useLiveStars";
import RepoCard from "./RepoCard";
import ScrollReveal from "./ScrollReveal";
import SearchInput from "./SearchInput";
import Panel from "./Panel";
import RepoDetail from "./RepoDetail";

export default function RepoList({ repos }: { repos: RepoWithVelocity[] }) {
  const [search, setSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const { starsMap, live, error } = useLiveStars();
  const initStars = useRef<Record<string, number>>({});
  useEffect(() => {
    if (Object.keys(initStars.current).length === 0) {
      for (const r of repos) initStars.current[r.full_name] = r.stars ?? 0;
    }
  }, [repos]);

  type SortKey = "rank" | "name" | "gained" | "stars";
  type SortDir = "asc" | "desc";

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [search]);

  const filtered = search
    ? repos.filter((r) =>
        r.full_name.toLowerCase().includes(search.toLowerCase())
      )
    : repos;

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
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
  }, [filtered, sortKey, sortDir]);

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

  const arrow = (key: SortKey) =>
    sortKey === key ? (sortDir === "asc" ? " \u25B2" : " \u25BC") : "";

  function handleKeyDown(e: React.KeyboardEvent) {
    if (selectedRepo) return;
    switch (e.key) {
      case "ArrowDown":
      case "j":
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, sorted.length - 1));
        break;
      case "ArrowUp":
      case "k":
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < sorted.length) {
          setSelectedRepo(sorted[selectedIndex].slug);
        }
        break;
      case "Escape":
        e.preventDefault();
        setSelectedIndex(-1);
        break;
    }
  }

  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} />
          <span className="flex items-center gap-1.5 text-[10px] text-text-muted shrink-0" title="Live data polling status">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                live ? "bg-positive shadow-[0_0_4px_rgba(52,211,153,0.5)]" : "bg-text-muted"
              }`}
            />
            {live ? "live" : "polling"}
          </span>
        </div>
      </div>

      {error && !live && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 border border-border rounded-none text-text-muted text-[10px]">
          <span>live data unavailable — showing cached data</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-auto text-text-muted hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors underline underline-offset-4"
          >
            retry
          </button>
        </div>
      )}

      <div className="flex items-center gap-3 py-2.5 px-2 text-[10px] sm:text-xs text-text-muted border-b border-border mb-1">
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
        <div className="hidden sm:block shrink-0 w-16" />
        <div className="hidden md:block shrink-0 w-20" />
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

      {filtered.length === 0 ? (
        <div className="mt-4">
          <p className="text-text-muted text-xs">no repos match &ldquo;{search}&rdquo;</p>
          <p className="text-text-muted text-xs mt-1">try a different name or clear the filter</p>
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-4"
          onKeyDown={handleKeyDown}
        >
          {sorted.map((repo, i) => {
            const gainedColorStr = gainedColor(repo.stars_gained);
            const gained7d =
              repo.stars_gained !== null && repo.history.length >= 8
                ? repo.history[repo.history.length - 1].stars -
                  repo.history[repo.history.length - 8].stars
                : null;
            const hero = i < 3;
            return (
              <div
                key={repo.full_name}
                className={`${hero ? "md:col-span-6" : "md:col-span-4"} ${
                  i === selectedIndex ? "relative" : ""
                }`}
                onClick={() => setSelectedIndex(i)}
              >
                {i === selectedIndex && (
                  <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-accent rounded-full z-10" />
                )}
                <ScrollReveal delay={Math.min(i * 0.02, 0.3)}>
                  <div className={i === selectedIndex ? "pl-2" : ""}>
                    <RepoCard
                      rank={repo.rank}
                      name={repo.name}
                      slug={repo.slug}
                      stars={repo.stars}
                      gained={repo.stars_gained}
                      gained7d={gained7d}
                      language={repo.language ?? ""}
                      gainedColor={gainedColorStr}
                      liveDelta={(() => {
                        const liveStars = starsMap[repo.full_name];
                        const initial = initStars.current[repo.full_name];
                        if (!liveStars || !initial) return null;
                        const delta = liveStars - initial;
                        return delta > 0 ? delta : null;
                      })()}
                      history={repo.history}
                      onSelect={setSelectedRepo}
                      hero={hero}
                    />
                  </div>
                </ScrollReveal>
              </div>
            );
          })}
        </div>
      )}

      <Panel open={!!selectedRepo} onClose={() => setSelectedRepo(null)}>
        {selectedRepo && <RepoDetail slug={selectedRepo} />}
      </Panel>
    </>
  );
}
