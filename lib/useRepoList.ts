"use client";

import { useState, useMemo, useCallback } from "react";
import type { RepoWithVelocity } from "./db";
import { filterByCategory, filterByLanguage, searchRepos, sortRepos, type SortKey, type SortDir } from "./repo-filter";

function applyFilters(repos: RepoWithVelocity[], search: string, lang: string | null, cat: string | null): RepoWithVelocity[] {
  return searchRepos(filterByLanguage(filterByCategory(repos, cat), lang), search);
}

export type Period = "day" | "week" | "month";

export interface UseRepoListResult {
  // state
  period: Period;
  search: string;
  sortKey: SortKey | null;
  sortDir: SortDir;
  langFilter: string | null;
  catFilter: string | null;
  showAll: boolean;
  selectedRepo: RepoWithVelocity | null;
  compareMode: boolean;
  compareSet: RepoWithVelocity[];
  focusedIndex: number;
  shortcutsOpen: boolean;

  // derived
  currentRepos: RepoWithVelocity[];
  filtered: RepoWithVelocity[];
  sorted: RepoWithVelocity[];
  allLanguages: string[];
  allCategories: string[];

  // actions
  setPeriod: (p: Period) => void;
  setSearch: (s: string) => void;
  handleSort: (key: SortKey) => void;
  setLangFilter: (l: string | null) => void;
  setCatFilter: (c: string | null) => void;
  setShowAll: (v: boolean) => void;
  setSelectedRepo: (r: RepoWithVelocity | null) => void;
  toggleCompareMode: () => void;
  toggleCompareRepo: (r: RepoWithVelocity) => void;
  setFocusedIndex: (i: number) => void;
  moveFocus: (delta: number) => void;
  toggleShortcuts: () => void;
  closeShortcuts: () => void;
}

export function useRepoList(
  repos: { day: RepoWithVelocity[]; week: RepoWithVelocity[]; month: RepoWithVelocity[] },
  defaultPeriod: Period = "week"
): UseRepoListResult {
  const [period, setPeriod] = useState<Period>(defaultPeriod);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [langFilter, setLangFilter] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<RepoWithVelocity | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSet, setCompareSet] = useState<RepoWithVelocity[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const currentRepos = repos[period];

  const allLanguages = useMemo(() => {
    const langs = new Set<string>();
    for (const r of currentRepos) {
      if (r.language) langs.add(r.language);
    }
    return [...langs].sort();
  }, [currentRepos]);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    for (const r of currentRepos) {
      if (r.category) cats.add(r.category);
    }
    return [...cats];
  }, [currentRepos]);

  const filtered = useMemo(
    () => applyFilters(currentRepos, search, langFilter, catFilter),
    [currentRepos, search, langFilter, catFilter]
  );

  const sorted = useMemo(
    () => sortRepos(filtered, sortKey, sortDir),
    [filtered, sortKey, sortDir]
  );

  const handleSort = useCallback(
    (key: SortKey) => {
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
    },
    [sortKey, sortDir]
  );

  const toggleCompareMode = useCallback(() => {
    setCompareMode((prev) => {
      if (!prev) setCompareSet([]);
      return !prev;
    });
  }, []);

  const toggleCompareRepo = useCallback((repo: RepoWithVelocity) => {
    setCompareSet((prev) => {
      const exists = prev.find((r) => r.slug === repo.slug);
      if (exists) return prev.filter((r) => r.slug !== repo.slug);
      return [...prev, repo];
    });
  }, []);

  const moveFocus = useCallback(
    (delta: number) => {
      setFocusedIndex((i) => Math.max(0, Math.min(i + delta, sorted.length - 1)));
    },
    [sorted.length]
  );

  const toggleShortcuts = useCallback(() => {
    setShortcutsOpen((prev) => !prev);
  }, []);

  const closeShortcuts = useCallback(() => {
    setShortcutsOpen(false);
  }, []);

  return {
    period,
    search,
    sortKey,
    sortDir,
    langFilter,
    catFilter,
    showAll,
    selectedRepo,
    compareMode,
    compareSet,
    focusedIndex,
    shortcutsOpen,
    currentRepos,
    filtered,
    sorted,
    allLanguages,
    allCategories,
    setPeriod,
    setSearch,
    handleSort,
    setLangFilter,
    setCatFilter,
    setShowAll,
    setSelectedRepo,
    toggleCompareMode,
    toggleCompareRepo,
    setFocusedIndex,
    moveFocus,
    toggleShortcuts,
    closeShortcuts,
  };
}
