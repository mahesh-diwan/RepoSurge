"use client";

import { useState, useMemo, useRef } from "react";
import type { RepoCardData } from "./RepoCard";
import { useLiveStars } from "@/lib/useLiveStars";
import RepoCard from "./RepoCard";
import ScrollReveal from "./ScrollReveal";
import SearchInput from "./SearchInput";

export default function RepoList({ repos }: { repos: RepoCardData[] }) {
  const [search, setSearch] = useState("");
  const { starsMap, live } = useLiveStars();
  const initStars = useRef<Record<string, number>>({});
  if (repos.length > 0 && Object.keys(initStars.current).length === 0) {
    for (const r of repos) initStars.current[r.full_name] = r.stars ?? 0;
  }

  type SortKey = "rank" | "name" | "gained";
  type SortDir = "asc" | "desc";

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

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
          return (a.stars_gained - b.stars_gained) * dir;
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

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <SearchInput value={search} onChange={setSearch} />
        <span className="flex items-center gap-1.5 text-[10px] text-dim shrink-0">
          <span
            className={`inline-block w-1.5 h-1.5 rounded-full ${
              live ? "bg-terminal shadow-[0_0_4px_#00FF41]" : "bg-dim"
            }`}
          />
          {live ? "live" : "polling"}
        </span>
      </div>

      <div className="flex items-center gap-4 py-2.5 text-[10px] sm:text-xs text-dim border-b border-terminal/20 mb-1">
        <button
          onClick={() => handleSort("rank")}
          className="w-8 text-right shrink-0 hover:text-terminal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal focus-visible:ring-offset-2 focus-visible:ring-offset-midnight active:text-terminal/70 transition-colors cursor-pointer"
        >
          #{arrow("rank")}
        </button>
        <button
          onClick={() => handleSort("name")}
          className="flex-1 min-w-0 shrink-0 hover:text-terminal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal focus-visible:ring-offset-2 focus-visible:ring-offset-midnight active:text-terminal/70 transition-colors cursor-pointer text-left"
        >
          repo{arrow("name")}
        </button>
        <div className="hidden sm:block shrink-0 w-[52px]" />
        <button
          onClick={() => handleSort("gained")}
          className="w-[80px] text-right shrink-0 hover:text-terminal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal focus-visible:ring-offset-2 focus-visible:ring-offset-midnight active:text-terminal/70 transition-colors cursor-pointer"
        >
          gained{arrow("gained")}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <p className="text-dim text-xs">no repos match &ldquo;{search}&rdquo;</p>
          <p className="text-dim text-xs mt-1">try a different name or clear the filter</p>
        </div>
      ) : (
        <div>
          {sorted.map((repo, i) => (
            <ScrollReveal key={repo.full_name} delay={Math.min(i * 0.02, 0.3)}>
              <RepoCard
                rank={repo.rank}
                full_name={repo.full_name}
                stars_gained={repo.stars_gained}
                sparkline={repo.sparkline}
                slug={repo.slug}
                liveDelta={(() => {
                  const liveStars = starsMap[repo.full_name];
                  const initial = initStars.current[repo.full_name];
                  if (!liveStars || !initial) return undefined;
                  const delta = liveStars - initial;
                  return delta > 0 ? delta : undefined;
                })()}
              />
            </ScrollReveal>
          ))}
        </div>
      )}
    </>
  );
}
