# Interactive Enhancements for RepoSurge

**Date:** 2026-07-22
**Status:** Draft

## Goal

Add meaningful interactivity to the terminal-brutalist GitHub star velocity tracker without bloating the codebase or breaking the aesthetic.

## Success Criteria

- Users can sort the repo ranking table by any column (rank, stars gained, velocity)
- Live indicator and real-time star diffs via GitHub API polling
- GossipFeed generates real events from live API responses
- Zero regressions on existing search, period toggle, detail pages
- All builds clean

## Approach

Two features, independent but complementary:

### 1. Sortable Columns

**Files affected:**

- `components/RepoList.tsx` — add sort state, header row, column click handlers
- `components/RepoCard.tsx` — no change (data already available)
- `app/page.tsx`, `app/daily/page.tsx`, `app/weekly/page.tsx`, `app/monthly/page.tsx` — no change (RepoList owns sort)

**Behavior:**

- Header row appears above repo list with 4 clickable columns: `#` (rank), `repo`, `stars gained`, `velocity`
- Click column to sort asc — click again for desc — click again to clear
- Active column shows terminal `△` (asc) or `▽` (desc) indicator
- Sorting filters through search results (search then sort)
- State resets on period change (new page navigation)
- Uses `useMemo` for sorted list, no external deps

**Design:**

- Header row matches existing text-xs/dim styling
- Sort indicators are CSS `::after` pseudo-elements or inline spans
- Hover effect on headers (text-terminal transition like period links)

### 2. Live Data via GitHub API

**Files affected:**

- `app/api/star-counts/route.ts` — NEW, server-side fetch of current stars
- `components/LiveBadge.tsx` — NEW, green dot + polling indicator
- `components/RepoList.tsx` — integrate live diffs per row
- `components/GossipFeed.tsx` — source events from live API instead of static array

**API Route (`/api/star-counts`):**

- Accepts no params, returns `{ repos: { full_name, stars }[], timestamp: string }`
- Iterates repos from repos.json, calls `GET https://api.github.com/repos/{owner}/{name}` for each
- 30s server-side in-memory cache to avoid rate limits
- Returns stale data gracefully on error
- Response format: `{ repos: [{ full_name: string, stars: number }], timestamp: string }`

**LiveBadge:**

- Small green dot + "live" text in top-right of main content area
- Shows "polling…" on first load, "live" when data arrives, "error" if API fails
- Graceful fallback: if API unavailable, simply doesn't show — no blocking UI

**Live diffs in RepoList:**

- Each repo card gets a `+N` badge if star count increased since page load
- Diff calculated client-side: initial stars (from server props) vs live stars (from API)
- Diff shown as `+N` in terminal color next to existing stars_gained

**GossipFeed:**

- Replace static `EVENTS` array with computed events from live API
- On each poll response, compare with previous snapshot
- Generate "X starred Y" event for each repo that gained stars since last poll
- Fall back to static events if API unavailable

**Polling:**

- `useEffect` with `setInterval(60000)` — 60s interval
- Cleanup on unmount
- Request dedup with AbortController
- No stale-while-revalidate complexity — simple fetch + replace

## Design Constraints

- Terminal-brutalist aesthetic preserved: green `#00FF41` on `#0A0A0A`, flat rows, no decoration
- No new dependencies beyond what Next.js 14.2 provides
- All new client components use `"use client"` — existing page/server contract unchanged
- Loading states use existing text-dim/text-terminal palette

## Out of Scope

- Repo comparison mode (deferred)
- Period switch animation (deferred)
- Star prediction / trend lines (deferred)
- WebSocket or SSE (overkill for polling)
- GitHub auth (unauthenticated API works for public repos)

## Key Decisions

1. **Polling over WebSockets** — simpler, no infra, works with static export
2. **Server cache over per-client** — single API call per 30s vs N calls per page load
3. **Sort in RepoList not router** — keeps page server components clean, avoids URL complexity
4. **No sort persistence** — resets on nav matches user expectation (new period = fresh view)
