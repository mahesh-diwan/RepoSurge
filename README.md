# RepoSurge

Discover trending GitHub repositories. Static site built with Astro.

## Stack

- Astro 5.x (SSG)
- TypeScript
- Tailwind CSS
- Vanilla JS (no client frameworks)

## Getting Started

```bash
npm install
npm run dev
```

Dev server runs at `http://localhost:4321`.

## Scripts

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start dev server (port 4321)    |
| `npm run build`   | Build static site to `dist/`    |
| `npm run preview` | Preview production build        |
| `npm run fetch`   | Fetch repo data from GitHub API |

## Data Fetching

`npm run fetch` requires a `GITHUB_TOKEN` environment variable:

```bash
GITHUB_TOKEN=ghp_... npm run fetch
```

This writes repo data to `data/repos.json`, which is gitignored.

## Architecture

Static site generation only — no server, no React, no client-side frameworks. Pages are pre-rendered at build time using data from `data/repos.json`.

## Project Structure

```
/
├── src/
│   ├── pages/          # Astro pages
│   ├── components/     # Astro components
│   ├── layouts/        # Page layouts
│   └── styles/         # Global styles
├── public/             # Static assets
├── scripts/            # Build/fetch scripts
└── data/               # Repo data (gitignored)
```
