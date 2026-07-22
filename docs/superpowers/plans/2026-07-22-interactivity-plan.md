# Interactivity Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Add sortable columns and live GitHub star data to RepoSurge

**Architecture:** Sort state in RepoList (client-side sort); live data via `app/api/star-counts/route.ts` (server, 30s cache), polled 60s from `useLiveStars` hook inside RepoList. Live badge + per-repo delta shown in RepoList. GossipFeed unused — skip.

**Tech Stack:** Next.js 14.2 App Router, TypeScript, no new deps

**Global Constraints:**

- Terminal palette: `#00FF41` on `#0A0A0A`, flat rows
- No new npm dependencies
- `"use client"` for interactive components
- 30s in-memory cache on GitHub API route

---

### Task 1: Sortable Columns in RepoList

**Files:**

- Modify: `components/RepoList.tsx`

- [ ] **Step 1: Add sort types, state, and sort logic**

Replace imports at top to include `useMemo`:

```tsx
import { useState, useMemo } from "react";
```

Add after `const [search, setSearch]`:

```tsx
type SortKey = "rank" | "name" | "gained" | "velocity";
type SortDir = "asc" | "desc";

const [sortKey, setSortKey] = useState<SortKey | null>(null);
const [sortDir, setSortDir] = useState<SortDir>("asc");
```

Add after `filtered` computation:

```tsx
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
        return (a.velocity - b.velocity) * dir;
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
```

- [ ] **Step 2: Add header row after search bar**

Insert between `</SearchInput>` and the `filtered.length === 0` ternary:

```tsx
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
```

- [ ] **Step 3: Use `sorted` in map, verify build**

```tsx
{sorted.map((repo, i) => (
```

```bash
npm run build 2>&1 | tail -20
```

Expected: clean build.

- [ ] **Step 4: Commit**

```bash
git add components/RepoList.tsx
git commit -m "feat: sortable columns in RepoList"
```

---

### Task 2: GitHub API Route

**Files:**

- Create: `app/api/star-counts/route.ts`

- [ ] **Step 1: Create the route**

```ts
import { NextResponse } from "next/server";

const REPOS = [
  { owner: "anomalyco", name: "opencode" },
  { owner: "Graphify-Labs", name: "graphify" },
  { owner: "koala73", name: "worldmonitor" },
  { owner: "tirth8205", name: "code-review-graph" },
  { owner: "DiegoSouzaPW", name: "omniroute" },
  { owner: "n8n-io", name: "n8n" },
  { owner: "1jehuang", name: "jcode" },
  { owner: "shubhamsaboo", name: "awesome-llm-apps" },
  { owner: "all-ai", name: "obsidian-tbirth" },
  { owner: "tony-istahockey", name: "pianolab" },
  { owner: "peter-kish", name: "glacier" },
];

const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 30_000;

export async function GET() {
  const now = Date.now();
  const cached = cache.get("stars");
  if (cached && now - cached.ts < CACHE_TTL)
    return NextResponse.json(cached.data);

  try {
    const results = await Promise.allSettled(
      REPOS.map(({ owner, name }) =>
        fetch(`https://api.github.com/repos/${owner}/${name}`, {
          headers: { Accept: "application/vnd.github.v3+json" },
          next: { revalidate: 30 },
        }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      ),
    );

    const repos: { full_name: string; stars: number }[] = [];
    for (const r of results) {
      if (r.status === "fulfilled")
        repos.push({
          full_name: r.value.full_name,
          stars: r.value.stargazers_count,
        });
    }

    const payload = { repos, timestamp: new Date().toISOString() };
    cache.set("stars", { data: payload, ts: Date.now() });
    return NextResponse.json(payload);
  } catch {
    if (cached) return NextResponse.json(cached.data);
    return NextResponse.json(
      { repos: [], timestamp: now.toString() },
      { status: 503 },
    );
  }
}
```

- [ ] **Step 2: Build verify + commit**

```bash
npm run build 2>&1 | tail -20
```

Expected: clean build.

```bash
git add app/api/star-counts/route.ts
git commit -m "feat: star-counts API route with 30s cache"
```

---

### Task 3: Live badge + per-repo delta in RepoList

**Files:**

- Create: `lib/useLiveStars.ts`
- Modify: `components/RepoList.tsx` — integrate hook, show live badge + deltas
- Modify: `components/RepoCard.tsx` — add `stars` to type, accept `liveDelta` prop

- [ ] **Step 1: Create `lib/useLiveStars.ts`**

```ts
"use client";
import { useState, useEffect } from "react";

type LiveData = {
  repos: { full_name: string; stars: number }[];
  timestamp: string;
};

export function useLiveStars() {
  const [starsMap, setStarsMap] = useState<Record<string, number>>({});
  const [live, setLive] = useState(false);

  useEffect(() => {
    let mounted = true;
    let aborter: AbortController | null = null;

    async function poll() {
      aborter = new AbortController();
      try {
        const res = await fetch("/api/star-counts", { signal: aborter.signal });
        if (!res.ok) return;
        const data: LiveData = await res.json();
        if (!mounted) return;
        const map: Record<string, number> = {};
        for (const r of data.repos) map[r.full_name] = r.stars;
        setStarsMap(map);
        setLive(true);
      } catch {
        if (mounted) setLive(false);
      }
    }

    poll();
    const id = setInterval(poll, 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
      aborter?.abort();
    };
  }, []);

  return { starsMap, live };
}
```

- [ ] **Step 2: Update RepoCardData type to include `stars`**

In `components/RepoCard.tsx`:

```tsx
export type RepoCardData = {
  rank: number;
  full_name: string;
  stars_gained: number;
  sparkline: number[];
  slug: string;
  stars?: number;
  liveDelta?: number;
};
```

Add live delta display after the gained number:

```tsx
{
  liveDelta !== undefined && liveDelta !== 0 && (
    <span className="text-terminal text-[10px] ml-1 align-super">
      +{liveDelta}
    </span>
  );
}
```

- [ ] **Step 3: Wire useLiveStars into RepoList**

Add imports:

```tsx
import { useLiveStars } from "@/lib/useLiveStars";
import { useRef } from "react";
```

Add inside component, after state lines:

```tsx
const { starsMap, live } = useLiveStars();
```

Store initial stars on first render:

```tsx
const initStars = useRef<Record<string, number>>({});
if (repos.length > 0 && Object.keys(initStars.current).length === 0) {
  for (const r of repos) initStars.current[r.full_name] = r.stars ?? 0;
}
```

Replace the standalone `<SearchInput>` wrapper with a flex row including the live badge:

```tsx
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
```

Pass `liveDelta` to each RepoCard:

```tsx
<RepoCard
  rank={repo.rank}
  full_name={repo.full_name}
  stars_gained={repo.stars_gained}
  sparkline={repo.sparkline}
  slug={repo.slug}
  stars={repo.stars}
  liveDelta={(() => {
    const liveStars = starsMap[repo.full_name];
    const initial = initStars.current[repo.full_name];
    if (!liveStars || !initial) return undefined;
    const delta = liveStars - initial;
    return delta > 0 ? delta : undefined;
  })()}
/>
```

- [ ] **Step 4: Build verify**

```bash
npm run build 2>&1 | tail -30
```

Expected: clean build.

- [ ] **Step 5: Commit**

```bash
git add lib/useLiveStars.ts components/RepoList.tsx components/RepoCard.tsx
git commit -m "feat: live star polling with live badge and per-repo deltas"
```

---

### Verification

- [ ] **Start dev server and verify**

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000 | head -50
# manually check: sortable columns render, live badge shows, API route returns data
curl -s http://localhost:3000/api/star-counts | head -5
```

Expected: pages load, columns clickable, API returns JSON with repos + timestamp.
