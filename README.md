# RepoSurge

[![fetch status](https://github.com/mahesh-diwan/RepoSurge/actions/workflows/fetch.yml/badge.svg)](https://github.com/mahesh-diwan/RepoSurge/actions/workflows/fetch.yml)

Top 50 GitHub repos ranked by star velocity. Dark, clean design. Live tracking.

## Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- TypeScript (strict)
- Zod (fetch validation)
- ISR (hourly revalidation)

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Dev server                         |
| `npm run build` | Production build                   |
| `npm start`     | Serve production build             |
| `npm test`      | Run tests                          |
| `npm run fetch` | Fetch top 50 repos from GitHub API |

## Data

A daily GitHub Action (`fetch.yml`) pulls the top 50 repos by stars from the GitHub Search API. Star counts are tracked over time to calculate velocity and gains per day/week/month.

Data lives in `src/content/repos.json`. The fetch script uses Zod to validate the API response shape.

```bash
# Run with a personal token for higher rate limit (5K req/hr)
GITHUB_TOKEN=ghp_... npm run fetch
```

Add the token as `PAT_TOKEN` in repo secrets for the cron job.

## Features

- **Top 50 leaderboard** — sorted by star velocity, sortable by rank/name/gained/stars
- **Keyboard navigation** — j/k or arrow keys to move, Enter to open detail panel, Escape to close
- **Live polling** — `/api/star-counts` polls GitHub every 60s for live star deltas
- **Sparkline charts** — per-repo star history over day/week/month periods
- **Search** — instant client-side filter by repo name
- **ISR** — pages revalidate every hour for fresh data
- **Dark design** — midnight/indigo palette, system-ui font, JetBrains Mono for numeric data

## Pages

| Route          | Type        | Description                                    |
| -------------- | ----------- | ---------------------------------------------- |
| `/`            | ISR (3600s) | Leaderboard with 50 repos                      |
| `/repo/[slug]` | ISR (3600s) | Detail page: stats, sparkline, period selector |
| `/daily`       | ISR (3600s) | Same as `/` with daily period                  |
| `/weekly`      | ISR (3600s) | Same as `/` with weekly period                 |
| `/monthly`     | ISR (3600s) | Same as `/` with monthly period                |
| `/about`       | Static      | Methodology and stack                          |

## Project Structure

```
├── app/
│   ├── api/star-counts/route.ts   # Live star polling endpoint
│   ├── globals.css                # Design tokens + data-mono utility
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Home (ISR)
│   ├── daily/page.tsx             # Daily period
│   ├── weekly/page.tsx            # Weekly period
│   ├── monthly/page.tsx           # Monthly period
│   ├── about/page.tsx             # About page
│   └── repo/[slug]/page.tsx       # Repo detail (ISR)
├── components/
│   ├── RepoList.tsx               # Leaderboard + keyboard nav + sort
│   ├── RepoCard.tsx               # Row with sparkline + gains
│   ├── StarChart.tsx              # Sparkline chart
│   ├── Panel.tsx                  # Slide-out detail panel
│   ├── RepoDetail.tsx             # Panel content
│   ├── Header.tsx                 # Site header + nav
│   ├── NavLinks.tsx               # Period navigation
│   └── SearchInput.tsx            # Instant search
├── lib/
│   ├── db.ts                      # Reads repos.json, computes velocity/gains
│   ├── gained-color.ts            # Color helper for gain values
│   └── useLiveStars.ts            # Live polling hook
├── scripts/
│   └── fetch-repos.ts             # Daily fetch job with Zod validation
├── middleware.ts                  # 308 redirect /repo/owner/repo → /repo/owner-repo
└── src/content/
    └── repos.json                 # Repo data
```

## Design

| Token      | Value          | Use                      |
| ---------- | -------------- | ------------------------ |
| midnight   | `#0A0A0A`      | Background               |
| surface    | `#111111`      | Cards, panels            |
| border     | `#222222`      | Dividers                 |
| text-body  | `#E5E5E5`      | Body text                |
| text-muted | `#888888`      | Secondary text           |
| accent     | `#5B7FFF`      | Interactive elements     |
| positive   | `#34D399`      | Gains, up                |
| negative   | `#F87171`      | Losses, down             |
| Font UI    | system-ui      | Interface                |
| Font data  | JetBrains Mono | Numbers via `.data-mono` |

## Deployment

```bash
npm run build
npm start
```

Deploy anywhere that runs Node.js. Vercel recommended.

## License

MIT
