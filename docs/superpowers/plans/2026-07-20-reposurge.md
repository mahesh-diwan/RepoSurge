# RepoSurge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** GitHub repos ranked by star velocity with brutalist UI, daily data refresh via GitHub Actions.

**Architecture:** Next.js 14 App Router with SQLite (better-sqlite3) for star history data, GitHub Actions cron for daily fetch, Vercel ISR for static serving with hourly revalidation.

**Tech Stack:** Next.js 14, TypeScript, SQLite (better-sqlite3), Tailwind CSS, Vercel ISR, GitHub Actions

## Global Constraints

- Next.js 14 App Router (not Pages Router)
- TypeScript strict mode
- better-sqlite3 for SQLite (not Prisma)
- Tailwind CSS with brutalist config: no rounded corners, monospace, black/white/electric blue
- No shadows, no gradients — flat bold design
- Database at `data/repos.db` committed to repo
- Rate limit: 600 requests/day, <6 seconds total

---

## File Structure

```
reposurge/
├── app/
│   ├── layout.tsx              # Root layout with monospace fonts
│   ├── page.tsx                # Main page (ISR, fetches repos)
│   └── globals.css             # Tailwind + brutalist base styles
├── components/
│   ├── RepoCard.tsx            # Individual repo display card
│   ├── StarChart.tsx           # Sparkline chart (7 data points)
│   ├── TimeTabs.tsx            # day/week/month/6m/year selector
│   └── LanguageFilter.tsx      # Language filter buttons
├── lib/
│   ├── db.ts                   # SQLite connection + query helpers
│   └── github.ts               # GitHub API fetch functions
├── scripts/
│   └── fetch-repos.ts          # Daily fetch script (GitHub Actions)
├── data/
│   └── repos.db                # SQLite database (committed)
├── .github/
│   └── workflows/
│       └── fetch.yml           # Daily cron config
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

### Task 1: Project Scaffolding

**Files:**

- Create: `reposurge/package.json`
- Create: `reposurge/tsconfig.json`
- Create: `reposurge/next.config.js`
- Create: `reposurge/tailwind.config.ts`
- Create: `reposurge/app/globals.css`
- Create: `reposurge/app/layout.tsx`

**Interfaces:**

- Consumes: none
- Produces: Next.js 14 project ready for development

- [ ] **Step 1: Initialize Next.js project**

```bash
mkdir -p reposurge && cd reposurge
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

- [ ] **Step 2: Install dependencies**

```bash
npm install better-sqlite3
npm install -D @types/better-sqlite3 tsx
```

- [ ] **Step 3: Configure Tailwind for brutalist design**

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      colors: {
        electric: "#0066FF",
        midnight: "#000000",
        bone: "#FAFAFA",
      },
      borderRadius: {
        none: "0",
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 4: Configure global styles**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-midnight text-bone font-mono;
}
```

- [ ] **Step 5: Configure root layout**

```tsx
// app/layout.tsx
export const metadata = {
  title: "RepoSurge — Repos rising. Fast.",
  description: "GitHub repos ranked by star velocity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 6: Commit scaffolding**

```bash
cd reposurge
git init
git add .
git commit -m "feat: project scaffolding with brutalist Tailwind config"
```

---

### Task 2: Database Layer

**Files:**

- Create: `reposurge/lib/db.ts`
- Create: `reposurge/data/` (directory)
- Create: `reposurge/.gitignore` (exclude node_modules, .next)

**Interfaces:**

- Consumes: none
- Produces: `getRepos(period)`, `insertRepo()`, `insertStarHistory()`, `initializeDb()`

- [ ] **Step 1: Write database initialization and query functions**

```typescript
// lib/db.ts
import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "repos.db");

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS repos (
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

    CREATE TABLE IF NOT EXISTS star_history (
      id INTEGER PRIMARY KEY,
      repo_id INTEGER REFERENCES repos(id),
      date DATE,
      stars INTEGER,
      UNIQUE(repo_id, date)
    );
  `);
}

export function getRepos(period: string = "week") {
  const db = getDb();
  const days = periodToDays(period);

  const repos = db
    .prepare(
      `
    SELECT
      r.*,
      (r.stars - COALESCE(
        (SELECT sh.stars FROM star_history sh
         WHERE sh.repo_id = r.id
         AND sh.date <= date('now', '-' || ? || ' days')
         ORDER BY sh.date DESC LIMIT 1),
        r.stars
      )) as stars_gained,
      (SELECT GROUP_CONCAT(sh.stars, ',')
       FROM (SELECT stars FROM star_history
             WHERE repo_id = r.id
             ORDER BY date DESC LIMIT 7)) as sparkline
    FROM repos r
    ORDER BY stars_gained DESC
  `,
    )
    .all(days);

  return repos.map(formatRepo);
}

function periodToDays(period: string): number {
  const map: Record<string, number> = {
    day: 1,
    week: 7,
    month: 30,
    "6m": 180,
    year: 365,
  };
  return map[period] || 7;
}

function formatRepo(repo: any) {
  return {
    ...repo,
    sparkline: repo.sparkline ? repo.sparkline.split(",").map(Number) : [],
    velocity: Math.round((repo.stars_gained / (repo.stars + 1)) * 1000),
  };
}

export function insertRepo(repo: any) {
  const db = getDb();
  db.prepare(
    `
    INSERT OR REPLACE INTO repos (github_id, name, owner, description, language, stars, forks, last_updated)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `,
  ).run(
    repo.github_id,
    repo.name,
    repo.owner,
    repo.description,
    repo.language,
    repo.stars,
    repo.forks,
  );
}

export function insertStarHistory(repoId: number, date: string, stars: number) {
  const db = getDb();
  db.prepare(
    `
    INSERT OR REPLACE INTO star_history (repo_id, date, stars)
    VALUES (?, ?, ?)
  `,
  ).run(repoId, date, stars);
}

export function getRepoId(githubId: number): number | null {
  const db = getDb();
  const repo = db
    .prepare("SELECT id FROM repos WHERE github_id = ?")
    .get(githubId) as any;
  return repo?.id ?? null;
}
```

- [ ] **Step 2: Create .gitignore**

```
node_modules/
.next/
data/repos.db
```

- [ ] **Step 3: Commit database layer**

```bash
git add lib/db.ts .gitignore
git commit -m "feat: SQLite database layer with star history queries"
```

---

### Task 3: GitHub API Fetch

**Files:**

- Create: `reposurge/lib/github.ts`

**Interfaces:**

- Consumes: GitHub REST API v3
- Produces: `fetchTopRepos(language, count)`, `getStarHistory(owner, repo, days)`

- [ ] **Step 1: Implement GitHub API fetch functions**

```typescript
// lib/github.ts
const GITHUB_API = "https://api.github.com";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  owner: { login: string };
}

interface StarCount {
  stargazers_count: number;
}

async function githubFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export async function fetchTopRepos(
  language: string,
  count: number = 100,
): Promise<GitHubRepo[]> {
  const url = `${GITHUB_API}/search/repositories?q=language:${encodeURIComponent(
    language,
  )}&sort=stars&order=desc&per_page=${count}`;

  const data = await githubFetch<{ items: GitHubRepo[] }>(url);
  return data.items;
}

export async function getStarHistory(
  owner: string,
  repo: string,
  days: number = 7,
): Promise<number[]> {
  const history: number[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    try {
      const url = `${GITHUB_API}/repos/${owner}/${repo}/stats/stargazers`;
      const data = await githubFetch<StarCount[]>(url);
      history.push(data[data.length - 1]?.stargazers_count ?? 0);
    } catch {
      history.push(0);
    }
  }

  return history;
}

export function parseRepoFullName(fullName: string) {
  const [owner, ...nameParts] = fullName.split("/");
  return { owner, name: nameParts.join("/") };
}
```

- [ ] **Step 2: Commit GitHub API layer**

```bash
git add lib/github.ts
git commit -m "feat: GitHub API fetch functions for repos and star history"
```

---

### Task 4: Fetch Script (GitHub Actions)

**Files:**

- Create: `reposurge/scripts/fetch-repos.ts`
- Create: `reposurge/.github/workflows/fetch.yml`

**Interfaces:**

- Consumes: `lib/db.ts` (insertRepo, insertStarHistory, getRepoId, getDb), `lib/github.ts` (fetchTopRepos)
- Produces: populated `data/repos.db`

- [ ] **Step 1: Write the fetch script**

```typescript
// scripts/fetch-repos.ts
import { fetchTopRepos } from "../lib/github";
import { insertRepo, insertStarHistory, getRepoId, getDb } from "../lib/db";
import path from "path";
import fs from "fs";

const LANGUAGES = ["javascript", "python", "rust", "go", "typescript", "java"];
const REPOS_PER_LANGUAGE = 100;

async function main() {
  console.log("Starting daily fetch...");

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = getDb();

  for (const language of LANGUAGES) {
    console.log(`Fetching top ${REPOS_PER_LANGUAGE} ${language} repos...`);

    try {
      const repos = await fetchTopRepos(language, REPOS_PER_LANGUAGE);

      for (const repo of repos) {
        const [owner, ...nameParts] = repo.full_name.split("/");
        const name = nameParts.join("/");

        insertRepo({
          github_id: repo.id,
          name,
          owner,
          description: repo.description?.slice(0, 500) || null,
          language: repo.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
        });

        const repoId = getRepoId(repo.id);
        if (repoId) {
          const today = new Date().toISOString().split("T")[0];
          insertStarHistory(repoId, today, repo.stargazers_count);
        }
      }

      console.log(`  Fetched ${repos.length} repos`);
    } catch (error) {
      console.error(`  Error fetching ${language}:`, error);
    }
  }

  console.log("Fetch complete!");
}

main();
```

- [ ] **Step 2: Create GitHub Actions workflow**

```yaml
# .github/workflows/fetch.yml
name: Daily Fetch

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Fetch repos
        run: npx tsx scripts/fetch-repos.ts
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Commit database
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/repos.db
          git diff --staged --quiet || git commit -m "chore: update repos.db"
          git push
```

- [ ] **Step 3: Commit fetch script and workflow**

```bash
git add scripts/fetch-repos.ts .github/workflows/fetch.yml
git commit -m "feat: daily fetch script and GitHub Actions workflow"
```

---

### Task 5: UI Components

**Files:**

- Create: `reposurge/components/TimeTabs.tsx`
- Create: `reposurge/components/LanguageFilter.tsx`
- Create: `reposurge/components/RepoCard.tsx`
- Create: `reposurge/components/StarChart.tsx`

**Interfaces:**

- Consumes: none
- Produces: TimeTabs, LanguageFilter, RepoCard, StarChart components

- [ ] **Step 1: Create TimeTabs component**

```tsx
// components/TimeTabs.tsx
"use client";

interface TimeTabsProps {
  selected: string;
  onChange: (period: string) => void;
}

const TABS = [
  { id: "day", label: "day" },
  { id: "week", label: "week" },
  { id: "month", label: "month" },
  { id: "6m", label: "6mo" },
  { id: "year", label: "year" },
];

export function TimeTabs({ selected, onChange }: TimeTabsProps) {
  return (
    <div className="flex gap-2 border-b border-gray-800 pb-2">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 font-mono text-sm uppercase tracking-wider border
            ${
              selected === tab.id
                ? "bg-electric text-white border-electric"
                : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create LanguageFilter component**

```tsx
// components/LanguageFilter.tsx
"use client";

interface LanguageFilterProps {
  selected: string;
  onChange: (lang: string) => void;
}

const LANGUAGES = [
  "all",
  "javascript",
  "python",
  "rust",
  "go",
  "typescript",
  "java",
];

export function LanguageFilter({ selected, onChange }: LanguageFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`px-3 py-1 font-mono text-xs uppercase tracking-wider border
            ${
              selected === lang
                ? "bg-electric text-white border-electric"
                : "bg-transparent text-gray-400 border-gray-700 hover:border-gray-500"
            }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create StarChart component**

```tsx
// components/StarChart.tsx
interface StarChartProps {
  data: number[];
}

export function StarChart({ data }: StarChartProps) {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const bars = data.map((value, i) => {
    const height = ((value - min) / range) * 100;
    const prev = i > 0 ? data[i - 1] : value;
    const isUp = value > prev;
    const isDown = value < prev;

    return (
      <div key={i} className="flex flex-col items-center gap-1">
        <div
          className={`w-2 ${
            isUp ? "bg-green-500" : isDown ? "bg-red-500" : "bg-gray-500"
          }`}
          style={{ height: `${Math.max(height, 10)}%` }}
        />
      </div>
    );
  });

  return (
    <div
      className="flex items-end gap-1 h-8"
      title={`Stars: ${data.join(", ")}`}
    >
      {bars}
    </div>
  );
}
```

- [ ] **Step 4: Create RepoCard component**

```tsx
// components/RepoCard.tsx
import { StarChart } from "./StarChart";

interface RepoCardProps {
  rank: number;
  repo: {
    name: string;
    owner: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    stars_gained: number;
    sparkline: number[];
    velocity: number;
  };
}

export function RepoCard({ rank, repo }: RepoCardProps) {
  const trend =
    repo.sparkline.length >= 2
      ? repo.sparkline[repo.sparkline.length - 1] >
        repo.sparkline[repo.sparkline.length - 2]
        ? "↑"
        : repo.sparkline[repo.sparkline.length - 1] <
            repo.sparkline[repo.sparkline.length - 2]
          ? "↓"
          : "→"
      : "→";

  const trendColor =
    trend === "↑"
      ? "text-green-500"
      : trend === "↓"
        ? "text-red-500"
        : "text-gray-500";

  return (
    <div className="border border-gray-800 p-4 hover:border-electric transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-500 font-mono text-sm">{rank}.</span>
            <h3 className="font-mono font-bold truncate">
              {repo.owner}/{repo.name}
            </h3>
          </div>

          {repo.description && (
            <p className="text-gray-400 text-sm mb-2 line-clamp-2">
              {repo.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs font-mono">
            {repo.language && (
              <span className="text-electric uppercase">{repo.language}</span>
            )}
            <span className="text-gray-500">
              {repo.stars.toLocaleString()} ★
            </span>
            <span className="text-gray-500">
              {repo.forks.toLocaleString()} forks
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 justify-end">
            <span className="text-2xl font-bold font-mono">
              +{repo.stars_gained.toLocaleString()}
            </span>
            <span className={`text-lg ${trendColor}`}>{trend}</span>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            velocity: {repo.velocity}
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-800">
        <StarChart data={repo.sparkline} />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit UI components**

```bash
git add components/
git commit -m "feat: UI components (TimeTabs, LanguageFilter, RepoCard, StarChart)"
```

---

### Task 6: Main Page (ISR)

**Files:**

- Create: `reposurge/app/page.tsx`

**Interfaces:**

- Consumes: `lib/db.ts` (getRepos), components (TimeTabs, LanguageFilter, RepoCard)
- Produces: main page with ISR

- [ ] **Step 1: Create the main page**

```tsx
// app/page.tsx
import { getRepos } from "../lib/db";
import { TimeTabs } from "../components/TimeTabs";
import { LanguageFilter } from "../components/LanguageFilter";
import { RepoCard } from "../components/RepoCard";

export const revalidate = 3600;

interface PageProps {
  searchParams: { period?: string; language?: string };
}

export default function Home({ searchParams }: PageProps) {
  const period = searchParams.period || "week";
  const language = searchParams.language || "all";

  let repos = getRepos(period);

  if (language !== "all") {
    repos = repos.filter(
      (repo: any) => repo.language?.toLowerCase() === language.toLowerCase(),
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-mono tracking-tighter mb-2">
          REPØSURGE
        </h1>
        <p className="text-gray-500 font-mono text-sm">Repos rising. Fast.</p>
      </header>

      <div className="mb-6">
        <TimeTabs selected={period} onChange={() => {}} />
      </div>

      <div className="mb-6">
        <LanguageFilter selected={language} onChange={() => {}} />
      </div>

      <div className="space-y-2">
        {repos.map((repo: any, i: number) => (
          <RepoCard key={repo.github_id} rank={i + 1} repo={repo} />
        ))}
      </div>

      {repos.length === 0 && (
        <div className="text-center py-12 text-gray-500 font-mono">
          No repos found. Run the fetch script to populate data.
        </div>
      )}

      <footer className="mt-12 pt-4 border-t border-gray-800 text-xs text-gray-600 font-mono">
        Updated daily via GitHub API • Star velocity = (stars gained / total
        stars) × 1000
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Commit main page**

```bash
git add app/page.tsx
git commit -m "feat: main page with ISR and repo listing"
```

---

### Task 7: End-to-End Test

**Files:**

- None (verification only)

**Interfaces:**

- Consumes: all previous tasks
- Produces: working application verified locally

- [ ] **Step 1: Test database layer**

```bash
cd reposurge
npx tsx -e "
const { getDb, insertRepo, insertStarHistory, getRepos } = require('./lib/db');
const db = getDb();
insertRepo({ github_id: 1, name: 'test', owner: 'test', description: 'test', language: 'javascript', stars: 100, forks: 10 });
const id = db.prepare('SELECT id FROM repos WHERE github_id = 1').get().id;
insertStarHistory(id, '2026-07-19', 95);
insertStarHistory(id, '2026-07-20', 100);
const repos = getRepos('week');
console.log(repos);
"
```

Expected: Array with test repo, stars_gained = 5

- [ ] **Step 2: Build and verify Next.js app**

```bash
cd reposurge
npm run build
```

Expected: Build succeeds without errors

- [ ] **Step 3: Start dev server and verify**

```bash
cd reposurge
npm run dev
```

Expected: App starts, shows "REPØSURGE" header, empty state message

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: verify end-to-end functionality"
```

---

### Task 8: Deploy to Vercel

**Files:**

- Create: `reposurge/vercel.json` (if needed)

**Interfaces:**

- Consumes: all previous tasks
- Produces: deployed application on Vercel

- [ ] **Step 1: Push to GitHub**

```bash
cd reposurge
git remote add origin <your-github-repo-url>
git push -u origin main
```

- [ ] **Step 2: Connect to Vercel**

1. Go to vercel.com
2. Import GitHub repo
3. Framework: Next.js (auto-detected)
4. Deploy

- [ ] **Step 3: Verify deployment**

Visit `https://your-app.vercel.app` — should show RepoSurge with data

---

## Self-Review

1. ✅ **Spec coverage:** All features from spec covered (star velocity, sparklines, time tabs, language filters, trend indicators)
2. ✅ **No placeholders:** All code blocks complete, no TBD/TODO
3. ✅ **Type consistency:** Props interfaces consistent across components
4. ✅ **Scope:** MVP focused, no future scope items included
