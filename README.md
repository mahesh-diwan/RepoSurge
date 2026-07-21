# RepoSurge

GitHub repositories ranked by star velocity. Brutalist. Fast.

## Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- TypeScript (strict)
- ISR (Incremental Static Regeneration)

## Quick Start

```bash
npm install
npm run dev
```

Dev server: `http://localhost:3000`

## Production

```bash
npm run build   # builds to .next/
npm start       # serves production build on port 3000
```

The production server serves pre-built static pages. No runtime compilation.

## Scripts

| Command         | Description                           |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start dev server (port 3000)          |
| `npm run build` | Build production bundle (`.next/`)    |
| `npm start`     | Serve production build (port 3000)    |
| `npm run fetch` | Fetch fresh repo data from GitHub API |

## Data Fetching

`npm run fetch` pulls top 100 repos across 6 languages (JS, Python, Rust, Go, TypeScript, Java) from GitHub Search API and computes star velocity.

```bash
# Optional: higher rate limit with token
GITHUB_TOKEN=ghp_... npm run fetch
```

Data is written to `src/content/repos.json` (gitignored). Seed data exists for offline dev.

## Pages

| Route          | Type        | Description                                    |
| -------------- | ----------- | ---------------------------------------------- |
| `/`            | ISR (3600s) | Home: hero, filters, search, sort, ranked list |
| `/repo/[slug]` | SSG         | Detail page: stats + star history sparkline    |
| `/about`       | Static      | Methodology, data source, stack                |

## Features

- **Gradient mesh hero** — animated radial gradients via CSS keyframes
- **Scroll reveal** — IntersectionObserver fades content on scroll
- **Staggered list reveal** — 60ms cascade per repo card
- **Card hover glow** — translateY(-2px) + blue box-shadow
- **StarChart animation** — bars grow bottom-up with 40ms stagger
- **Glassmorphism filter bar** — backdrop-blur + semi-transparent bg
- **Client search** — instant filter by name/description/language
- **Client sort** — DOM reorder by gained/velocity/total/name
- **localStorage prefs** — remembers period/language selection
- **Reduced motion** — `@media (prefers-reduced-motion)` disables all animation

## Project Structure

```
/
├── app/
│   ├── globals.css      # Design tokens + animations
│   ├── layout.tsx       # Root layout, nav, footer, scripts
│   ├── page.tsx         # Home (ISR)
│   ├── about/page.tsx   # About page (static)
│   └── repo/[slug]/page.tsx # Repo detail (SSG)
├── components/
│   ├── Header.tsx           # Hero with mesh gradient
│   ├── RepoCard.tsx         # Row card with sparkline
│   ├── StarChart.tsx        # CSS bar chart
│   ├── FilterBar.tsx        # Period tabs + language filter
│   ├── TrustLogos.tsx       # Logo strip (Simple Icons CDN)
│   ├── SearchBar.tsx        # Client search
│   └── SortSelect.tsx       # Client sort
├── lib/
│   ├── db.ts          # Reads src/content/repos.json
│   └── github.ts      # GitHub API client
├── scripts/
│   └── fetch-repos.ts   # Daily fetch job
└── src/content/
    └── repos.json       # Repo data (gitignored)
```

## Design System

| Token         | Value            | Use                            |
| ------------- | ---------------- | ------------------------------ |
| `electric`    | `#0066FF`        | Primary actions, active states |
| `midnight`    | `#0A0A0A`        | Backgrounds                    |
| `bone`        | `#F5F5F0`        | Text, borders                  |
| Font          | `JetBrains Mono` | Everything                     |
| Border-radius | `0`              | Global                         |

All animations respect `prefers-reduced-motion: reduce`.

## Deployment

Any Node.js host (Vercel, Railway, Fly.io, Docker). The build outputs a self-contained `.next/` directory.

```bash
docker build -t reposurge .
docker run -p 3000:3000 reposurge
```

## License

MIT
