"use client";

import { useState, useMemo, useCallback } from "react";
import type { RepoWithVelocity } from "./db";
import { filterByCategory, filterByLanguage, searchRepos, sortRepos, type SortKey, type SortDir } from "./repo-filter";

function applyFilters(repos: RepoWithVelocity[], search: string, langs: string[] | null, cats: string[] | null): RepoWithVelocity[] {
  return searchRepos(filterByLanguage(filterByCategory(repos, cats), langs), search);
}

export type Period = "day" | "week" | "month";

export interface UseRepoListResult {
  // state
  period: Period;
  search: string;
  sortKey: SortKey | null;
  sortDir: SortDir;
  langFilters: string[];
  catFilters: string[];
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
  toggleLangFilter: (lang: string) => void;
  toggleCatFilter: (cat: string) => void;
  clearFilters: () => void;
  setShowAll: (v: boolean) => void;
  setSelectedRepo: (r: RepoWithVelocity | null) => void;
  toggleCompareMode: () => void;
  toggleCompareRepo: (r: RepoWithVelocity) => void;
  setFocusedIndex: (i: number) => void;
  moveFocus: (delta: number) => void;
  toggleShortcuts: () => void;
  closeShortcuts: () => void;
  // derived flags
  compareFull: boolean;
}

export function useRepoList(
  repos: { day: RepoWithVelocity[]; week: RepoWithVelocity[]; month: RepoWithVelocity[] },
  defaultPeriod: Period = "week"
): UseRepoListResult {
  const [period, setPeriod] = useState<Period>(defaultPeriod);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [langFilters, setLangFilters] = useState<string[]>([]);
  const [catFilters, setCatFilters] = useState<string[]>([]);
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
    () => applyFilters(currentRepos, search, langFilters, catFilters),
    [currentRepos, search, langFilters, catFilters]
  );

  const toggleLangFilter = useCallback((lang: string) => {
    setLangFilters((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  }, []);

  const toggleCatFilter = useCallback((cat: string) => {
    setCatFilters((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setLangFilters([]);
    setCatFilters([]);
    setSearch("");
  }, []);

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

  const MAX_COMPARE = 3;

  const toggleCompareRepo = useCallback((repo: RepoWithVelocity) => {
    setCompareSet((prev) => {
      const exists = prev.find((r) => r.slug === repo.slug);
      if (exists) return prev.filter((r) => r.slug !== repo.slug);
      if (prev.length >= MAX_COMPARE) return prev; // limit reached
      return [...prev, repo];
    });
  }, []);

  const compareFull = compareSet.length >= MAX_COMPARE;

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
    langFilters,
    catFilters,
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
    toggleLangFilter,
    toggleCatFilter,
    clearFilters,
    setShowAll,
    setSelectedRepo,
    toggleCompareMode,
    toggleCompareRepo,
    setFocusedIndex,
    moveFocus,
    toggleShortcuts,
    closeShortcuts,
    compareFull,
  };
}
