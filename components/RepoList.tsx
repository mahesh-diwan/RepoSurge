"use client";

import { useState, useMemo } from "react";
import type { RepoCardData } from "./RepoCard";
import RepoCard from "./RepoCard";
import ScrollReveal from "./ScrollReveal";
import SearchInput from "./SearchInput";

export default function RepoList({ repos }: { repos: RepoCardData[] }) {
  const [search, setSearch] = useState("");

  type SortKey = "rank" | "name" | "gained" | "velocity";
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
        case "velocity":
          return ((a.velocity ?? 0) - (b.velocity ?? 0)) * dir;
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
      <div className="mb-6">
        <SearchInput value={search} onChange={setSearch} />
      </div>

      <div className="flex items-center gap-4 py-1.5 text-[10px] sm:text-xs text-dim border-b border-terminal/10 mb-1">
        <button
          onClick={() => handleSort("rank")}
          className="w-8 text-right shrink-0 hover:text-terminal transition-colors cursor-pointer"
        >
          #{arrow("rank")}
        </button>
        <button
          onClick={() => handleSort("name")}
          className="flex-1 min-w-0 shrink-0 hover:text-terminal transition-colors cursor-pointer text-left"
        >
          repo{arrow("name")}
        </button>
        <div className="hidden sm:block shrink-0 w-[52px]" />
        <button
          onClick={() => handleSort("gained")}
          className="w-[80px] text-right shrink-0 hover:text-terminal transition-colors cursor-pointer"
        >
          gained{arrow("gained")}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-dim text-xs mt-4">no repos match &ldquo;{search}&rdquo;</p>
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
              />
            </ScrollReveal>
          ))}
        </div>
      )}
    </>
  );
}
