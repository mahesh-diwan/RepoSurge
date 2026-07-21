# RepoSurge Redesign: Star Velocity Rankings

## Goal

Redesign RepoSurge to rank repos by star velocity (stars gained per period) instead of all-time stars. Add separate daily/weekly/monthly pages, enhance repo detail pages, and adopt a brutalist + opencode.ai visual style.

## Design Read

Content-first ranking site for developers, dark-tech/brutalist aesthetic (monospace, zero border-radius, electric blue accent on midnight), opencode.ai-inspired minimal layout. Dials: VARIANCE: 7 | MOTION: 1 | DENSITY: 5.

## Architecture

Static pre-rendered pages. Each period (/daily, /weekly, /monthly) generated at build time via `getStaticProps`. Data is stale between daily fetches, matching the fetch cadence. No ISR, no SSR.

## Pages & Routes

```
/                    — Home: minimal hero + weekly rankings (default)
/daily               — Daily top movers
/weekly              — Weekly top movers
/monthly             — Monthly top movers
/repo/[slug]         — Repo detail: full stats + star chart
/about               — Methodology (existing, keep as-is)
```

Navigation: HOME | DAILY | WEEKLY | MONTHLY | ABOUT

## Data Layer

### Fetch Script Changes

- Fetch top 500 repos from GitHub sorted by stars (across all languages)
- No language filtering, no language-based grouping
- Store daily snapshots in `history[]`
- Add `created_at` field to detect new repos

### Ranking Logic (`lib/db.ts`)

- `getRepos("day")` — rank by stars gained in last 24h, descending
- `getRepos("week")` — rank by stars gained in last 7 days, descending
- `getRepos("month")` — rank by stars gained in last 30 days, descending
- Each returns top 50

### Trending Detection

- "Biggest movers" = repos with highest absolute `stars_gained` in the period
- Homepage shows top 3 trending repos in a separate section above rankings

## Homepage Design

### Hero

- Title: `REPØSURGE` (big, bold, monospace)
- Subtitle: `repos rising. fast.`
- Below: 3 stat blocks — "X repos tracked" | "Y stars monitored" | "Z languages"
- Minimal, no gradient mesh, no animations. Clean opencode.ai feel.

### Trending Section

- 3 cards in a row showing biggest movers (absolute stars gained)
- Each card: repo name, stars gained (+N), velocity, mini sparkline
- Electric blue accent on hover

### Rankings

- Period tabs: DAILY | WEEKLY | MONTHLY (link to /daily, /weekly, /monthly)
- Default view on `/` is weekly
- List of top 50 repos ranked by star velocity
- Each row: rank number, repo name, description, stars gained, velocity, sparkline
- Click row → repo detail page

No language filter, no search, no sort dropdown.

## Repo Detail Page

**Route:** `/repo/[slug]`

- Back link → home
- Repo name (big, bold) + description
- "View on GitHub" CTA button
- Stats grid (4 columns): Total Stars | Stars Gained (period) | Velocity | Created Date
- Full star history chart (all available history)
- Period selector to switch the "Stars Gained" stat between day/week/month

No language badge, no contributor count.

## Visual Design (Brutalist + OpenCode.ai)

### Tokens

- `electric: #0066FF`, `midnight: #0A0A0A`, `bone: #F5F5F0`
- JetBrains Mono, zero border-radius, sharp edges

### Homepage Hero

- No gradient mesh, no animations
- Centered text on dark bg, generous whitespace
- 3 stat blocks as simple monospace numbers with labels below
- Period tabs as plain text links with underline on active

### Repo Cards

- Flat rows, no card-glow, no hover animations
- Border-bottom only, clean left-aligned text
- Velocity shown as `+N ★` (stars gained) not `N v`
- Sparkline as tiny CSS bars, no animation

### Repo Detail

- Stats as large monospace numbers with labels
- Star chart as full-width CSS bars, no animation
- Clean, data-forward, no decoration

## What Gets Removed

### Components to Delete

- `FilterBar.tsx` — replaced by period page links
- `SearchBar.tsx` — no search feature
- `SortSelect.tsx` — rankings are the sort
- `ScrollReveal.tsx` — no animations
- `PrefsRestore.tsx` — no localStorage preferences
- `hooks/useLocalStorage.ts` — unused without prefs

### Components to Rewrite

- `Header.tsx` — minimal hero (title + subtitle + 3 stat blocks)
- `RepoCard.tsx` — flat row, velocity as `+N ★`, no card-glow
- `StarChart.tsx` — remove bar-grow animation
- `MobileNav.tsx` — simplify to period links
- `TrustLogos.tsx` — keep as-is

### Pages

- `app/page.tsx` — home with hero + trending + weekly rankings
- `app/daily/page.tsx` — NEW: daily rankings
- `app/weekly/page.tsx` — NEW: weekly rankings
- `app/monthly/page.tsx` — NEW: monthly rankings
- `app/repo/[slug]/page.tsx` — rewrite with new stats
- `app/layout.tsx` — nav with period links

### Globals.css

- Remove: hero-mesh, mesh-drift, reveal, reveal-stagger, card-glow, bar-grow, glass
- Keep: base styles, focus-visible, ::selection

## File Changes Summary

### Delete (6 files)

- `components/FilterBar.tsx`
- `components/SearchBar.tsx`
- `components/SortSelect.tsx`
- `components/ScrollReveal.tsx`
- `components/PrefsRestore.tsx`
- `hooks/useLocalStorage.ts`

### Create (3 files)

- `app/daily/page.tsx`
- `app/weekly/page.tsx`
- `app/monthly/page.tsx`

### Rewrite (6 files)

- `app/page.tsx`
- `app/layout.tsx`
- `app/repo/[slug]/page.tsx`
- `components/Header.tsx`
- `components/RepoCard.tsx`
- `components/StarChart.tsx`
- `app/globals.css`

### Keep As-Is (4 files)

- `components/TrustLogos.tsx`
- `components/MobileNav.tsx` (simplify nav links only)
- `app/about/page.tsx`
- `lib/db.ts` (ranking logic changes only)
- `scripts/fetch-repos.ts` (remove language filter only)
