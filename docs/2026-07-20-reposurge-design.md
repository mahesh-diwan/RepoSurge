# RepoSurge — Design Spec

## Goal

GitHub repos ranked by star velocity. Brutalist design. Daily data refresh via GitHub Actions.

## Brand

- **Name:** RepoSurge
- **Tagline:** "Repos rising. Fast."
- **Metaphor:** Momentum, growth, upward velocity
- **Visual:** Raw, heavy, monospace. Black/white primary, electric blue accent.

## Architecture

```
GitHub API v3 → GitHub Actions (daily cron) → SQLite → Repo → Vercel ISR
```

**Components:**
- `lib/github.ts` — fetch trending repos from GitHub API
- `lib/cache.ts` — SQLite cache layer
- `scripts/fetch-repos.ts` — daily fetch script
- `pages/index.tsx` — main page with time tabs
- `components/RepoCard.tsx` — individual repo display
- `components/StarChart.tsx` — star velocity sparkline
- `components/TimeTabs.tsx` — day/week/month/6m/year selector

## UI — Brutalist Design

**Visual language:**
- Monospace headers, no rounded corners
- Black/white primary, electric blue accent
- Visible grid lines, exposed structure
- No shadows, no gradients — flat, bold
- Repo cards: thick borders, raw data prominently displayed
- Star velocity shown as sparkline graphs inline

**Layout:**
```
┌─────────────────────────────────────────────┐
│  REPØSURGE                                  │
│  [day] [week] [month] [6mo] [year]          │
├─────────────────────────────────────────────┤
│  1. react         ████ +12,400 ★            │
│     Next.js framework                       │
│     ▁▂▃▅▇▆▅▃▂▁  ← star velocity sparkline  │
├─────────────────────────────────────────────┤
│  2. deno          ███ +8,200 ★              │
│     Modern JavaScript runtime               │
│     ▁▂▅▇▇▆▅▃▁▂▁                            │
└─────────────────────────────────────────────┘
```

**Repo card content:**
- Rank number
- Repo name + owner
- Description (truncated)
- Language badge
- Stars gained in period (big number)
- Star count sparkline (7 data points)
- Total stars count
- Fork count

## Data Model

**SQLite schema:**
```sql
CREATE TABLE repos (
  id INTEGER PRIMARY KEY,
  github_id INTEGER UNIQUE,
  name TEXT,
  owner TEXT,
  description TEXT,
  language TEXT,
  stars INTEGER,
  forks INTEGER,
  last_updated DATETIME
);

CREATE TABLE star_history (
  id INTEGER PRIMARY KEY,
  repo_id INTEGER REFERENCES repos(id),
  date DATE,
  stars INTEGER,
  UNIQUE(repo_id, date)
);
```

**Caching strategy:**
- Fetch top 100 repos per language (JS, Python, Rust, Go, TS, Java)
- Store daily star snapshots
- Compute velocity: `stars(now) - stars(now - period)`
- Cache TTL: 24 hours
- ISR revalidation: 3600s (1 hour)

## Features

**Star Velocity Chart:**
- Mini sparkline per repo (7 points, one per day)
- Color coded: green = accelerating, red = decelerating
- Hover shows exact numbers

**Velocity Score:**
- Formula: `stars_gained / (total_stars + 1) * 1000`
- Ranks repos by growth velocity, not raw star count
- A small repo gaining 500 stars/day beats a giant gaining 100

**Category Tabs:**
- All, Languages (JS, Python, Rust, Go, TS, Java)
- Topic filters: AI, Web, CLI, DevTools, Games

**Trending Indicator:**
- Up arrow + percentage for repos accelerating
- Down arrow for decelerating
- Flat dash for stable

## Daily Fetch Script

**Architecture:**
```
GitHub Actions cron (daily 00:00 UTC)
  → fetch-top-repos.ts (Node.js script)
    → GitHub API v3 (batched)
    → SQLite database (via better-sqlite3)
    → Push to repo (data.db)
```

**Why push DB to repo:** Free hosting. Vercel reads DB at build time. No separate database service needed.

**Script flow:**
1. Fetch top repos per language (JS, Python, Rust, Go, TS, Java) — ~600 requests
2. Store in SQLite: repo metadata + daily star snapshot
3. Compute velocity: `stars(today) - stars(today - N days)`
4. Commit `data.db` to repo
5. Vercel ISR picks up changes within 1 hour

**Rate limit math:**
- 6 languages × 100 repos = 600 requests
- Batched: 100 requests/second (GitHub allows 30/sec unauthenticated burst, 5000/hour total)
- Total time: ~6 seconds
- Leaves 4400 requests/hour headroom

**GitHub Actions config:**
```yaml
name: Daily Fetch
on:
  schedule:
    - cron: '0 0 * * *'  # Daily midnight UTC
  workflow_dispatch:       # Manual trigger
```

**Database location:** `data/repos.db` committed to repo.

## Tech Stack

- **Framework:** Next.js (React)
- **Database:** SQLite (better-sqlite3)
- **Hosting:** Vercel (ISR)
- **CI/CD:** GitHub Actions
- **Language:** TypeScript
- **Styling:** Tailwind CSS (brutalist config)

## Future Scope (not MVP)

- Email digest
- User watchlist
- Historical comparison
- Public API
