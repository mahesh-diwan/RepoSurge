# REPØSURGE

GitHub repos ranked by **star velocity**. Brutalist. Fast.

## What it does

Fetches top 100 repos across 6 languages (JS, Python, Rust, Go, TS, Java)
daily, stores star history in SQLite, and ranks by velocity:

```
velocity = (stars_gained / baseline_stars) * 1000
```

Filter by time window (day/week/month/6mo/year) and language. Sparklines show
recent trajectory; arrows show trend (↑ ↓ →).

## Stack

- Next.js 14 (App Router) + TypeScript
- SQLite via `better-sqlite3`
- Tailwind CSS (brutalist: monospace, black/white/electric blue, no rounded corners)
- Vercel ISR (`revalidate = 3600`)
- GitHub Actions daily fetch (`cron 0 0 * * *`)

## Layout

```
app/            layout, page (ISR), globals.css
components/     TimeTabs, LanguageFilter, StarChart, RepoCard
lib/            db.ts (sqlite + velocity query), github.ts (API client)
scripts/        fetch-repos.ts (daily snapshot)
.github/        fetch.yml (cron + commit db)
```

## Local dev

```bash
npm install
export GITHUB_TOKEN=ghp_xxx        # optional, raises rate limit
npm run fetch                      # seed data/repos.db
npm run dev                        # http://localhost:3000
```

> `better-sqlite3` needs a native build (Node 20+). Local Node 26 may fail to
> compile; Vercel (Node 20) builds it fine.

## Deploy (Vercel)

```bash
npx vercel --prod
```

Set `GITHUB_TOKEN` in repo secrets so the daily Action can fetch.

## Data

- `repos` — current snapshot of each repo
- `star_history` — daily `(repo_id, stars, recorded_at)` rows

Velocity = latest stars minus oldest row within the selected window.
