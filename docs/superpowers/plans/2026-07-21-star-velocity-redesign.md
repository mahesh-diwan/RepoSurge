# Star Velocity Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign RepoSurge to rank repos by star velocity per period (daily/weekly/monthly) with a brutalist + opencode.ai visual style.

**Architecture:** Static pre-rendered Next.js pages. Each period (/daily, /weekly, /monthly) generated at build time via `getStaticProps`. Data fetched from GitHub API, stored as daily snapshots. No language filtering.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS 3.4, TypeScript

## Global Constraints

- Next.js 14.2.x (not 15) — `params` is `{ slug: string }`, not `Promise<{ slug: string }>`
- No `motion` library — zero animations
- No language filtering — rankings are purely by star velocity
- Electric `#0066FF`, midnight `#0A0A0A`, bone `#F5F5F0`, JetBrains Mono, zero border-radius
- No em-dashes anywhere visible
- No component has more than one responsibility

---

## File Structure

### Delete (6 files)

- `components/FilterBar.tsx`
- `components/SearchBar.tsx`
- `components/SortSelect.tsx`
- `components/ScrollReveal.tsx`
- `components/PrefsRestore.tsx`
- `hooks/useLocalStorage.ts`

### Create (3 files)

- `app/daily/page.tsx` — daily rankings
- `app/weekly/page.tsx` — weekly rankings
- `app/monthly/page.tsx` — monthly rankings

### Rewrite (7 files)

- `scripts/fetch-repos.ts` — remove language filter, add created_at
- `lib/db.ts` — compute per-period velocities, rank by gained stars
- `app/globals.css` — remove animations, keep base styles
- `app/layout.tsx` — nav with period links, remove client components
- `app/page.tsx` — hero + trending + weekly rankings
- `components/Header.tsx` — minimal hero with stat blocks
- `components/RepoCard.tsx` — flat row, velocity as +N ★
- `components/StarChart.tsx` — remove bar-grow animation
- `app/repo/[slug]/page.tsx` — rewrite with new stats grid

### Keep As-Is

- `components/TrustLogos.tsx`
- `components/MobileNav.tsx` (simplify nav links only)
- `app/about/page.tsx`
- `tailwind.config.ts`
- `postcss.config.mjs`

---

### Task 1: Delete unused components and hooks

**Files:**

- Delete: `components/FilterBar.tsx`
- Delete: `components/SearchBar.tsx`
- Delete: `components/SortSelect.tsx`
- Delete: `components/ScrollReveal.tsx`
- Delete: `components/PrefsRestore.tsx`
- Delete: `hooks/useLocalStorage.ts`

**Interfaces:**

- Consumes: nothing
- Produces: nothing (cleanup only)

- [ ] **Step 1: Delete the 6 files**

```bash
rm components/FilterBar.tsx components/SearchBar.tsx components/SortSelect.tsx components/ScrollReveal.tsx components/PrefsRestore.tsx hooks/useLocalStorage.ts
rmdir hooks 2>/dev/null || true
```

- [ ] **Step 2: Verify no imports reference deleted files**

Run: `grep -r "FilterBar\|SearchBar\|SortSelect\|ScrollReveal\|PrefsRestore\|useLocalStorage" app/ components/ --include="*.tsx" --include="*.ts"`
Expected: no matches (except possibly in app/layout.tsx and app/page.tsx which will be rewritten in later tasks)

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: delete unused components and hooks"
```

---

### Task 2: Rewrite fetch script (remove language filter, add created_at)

**Files:**

- Modify: `scripts/fetch-repos.ts`

**Interfaces:**

- Consumes: nothing
- Produces: repos.json with new `created_at` field, no language filtering

- [ ] **Step 1: Rewrite the fetch script**

Replace entire `scripts/fetch-repos.ts` with:

```typescript
import fs from "fs";
import path from "path";

const GITHUB_API = "https://api.github";
const OUTPUT = path.join(process.cwd(), "src", "content", "repos.json");
const OLD_DATA = path.join(process.cwd(), "data", "repos.json");

const REPOS_TO_FETCH = 500;

type GitHubRepo = {
  id: number;
  full_name: string;
  name: string;
  owner: { login: string };
  description: string | null;
  language: string | null;
  html_url: string;
  stargazers_count: number;
  created_at: string;
};

type HistoryRow = { stars: number; recorded_at: string };
type RepoRecord = {
  full_name: string;
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  created_at: string;
  fetched_at: string;
  history: HistoryRow[];
};

function githubFetch(apiPath: string): Promise<any> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "RepoSurge",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(`${GITHUB_API}${apiPath}`, { headers }).then((res) => {
    if (!res.ok) throw new Error(`GitHub API ${res.status} for ${apiPath}`);
    return res.json();
  });
}

async function fetchTopRepos(count: number): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  const perPage = 100;
  const pages = Math.ceil(count / perPage);
  for (let page = 1; page <= pages; page++) {
    const data = await githubFetch(
      `/search/repositories?q=stars:>1&sort=stars&order=desc&per_page=${perPage}&page=${page}`,
    );
    repos.push(...data.items);
    if (data.items.length < perPage) break;
  }
  return repos.slice(0, count);
}

function readExisting(): { repos: RepoRecord[] } {
  try {
    return JSON.parse(fs.readFileSync(OUTPUT, "utf8"));
  } catch {
    return { repos: [] };
  }
}

function readOldData(): { repos: RepoRecord[] } {
  try {
    return JSON.parse(fs.readFileSync(OLD_DATA, "utf8"));
  } catch {
    return { repos: [] };
  }
}

async function main() {
  const today = new Date().toISOString();
  const store = readExisting();
  const oldStore = readOldData();

  console.log(`Fetching top ${REPOS_TO_FETCH} repos by stars...`);
  const repos = await fetchTopRepos(REPOS_TO_FETCH);

  for (const repo of repos) {
    const existing = store.repos.find((r) => r.full_name === repo.full_name);
    const old = oldStore.repos.find((r) => r.full_name === repo.full_name);

    if (existing) {
      existing.stars = repo.stargazers_count;
      existing.fetched_at = today;
      existing.history.push({
        stars: repo.stargazers_count,
        recorded_at: today,
      });
    } else {
      const history: HistoryRow[] = old?.history ?? [];
      history.push({ stars: repo.stargazers_count, recorded_at: today });
      store.repos.push({
        full_name: repo.full_name,
        name: repo.name,
        owner: repo.owner.login,
        description: repo.description,
        language: repo.language,
        url: repo.html_url,
        stars: repo.stargazers_count,
        created_at: repo.created_at,
        fetched_at: today,
        history,
      });
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(store, null, 2));
  console.log(`Done. Wrote ${store.repos.length} repos to ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Verify script compiles**

Run: `npx tsc --noEmit scripts/fetch-repos.ts`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add scripts/fetch-repos.ts
git commit -m "feat: rewrite fetch script - remove language filter, add created_at"
```

---

### Task 3: Rewrite lib/db.ts (per-period velocity ranking)

**Files:**

- Modify: `lib/db.ts`

**Interfaces:**

- Consumes: repos.json (with history[] and created_at)
- Produces: `getRepos(period)` returns RepoWithVelocity[] ranked by stars gained, `getRepoBySlug(slug)` returns single repo

- [ ] **Step 1: Rewrite lib/db.ts**

Replace entire `lib/db.ts` with:

```typescript
import path from "path";
import fs from "fs";

const DATA_PATH = path.join(process.cwd(), "src", "content", "repos.json");

type HistoryRow = { stars: number; recorded_at: string };
type RepoRecord = {
  full_name: string;
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  created_at: string;
  fetched_at: string;
  history: HistoryRow[];
};

type Store = { repos: RepoRecord[] };

const PERIOD_TO_DAYS: Record<string, number> = {
  day: 1,
  week: 7,
  month: 30,
};

function readStore(): Store {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf8")) as Store;
  } catch {
    return { repos: [] };
  }
}

export type RepoWithVelocity = {
  full_name: string;
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  created_at: string;
  fetched_at: string;
  rank: number;
  stars_gained: number;
  sparkline: number[];
  velocity: number;
  slug: string;
};

export function getRepos(period: string): RepoWithVelocity[] {
  const days = PERIOD_TO_DAYS[period] ?? 7;
  const cutoff = Date.now() - days * 86400000;
  const store = readStore();

  return store.repos
    .map((r) => {
      const inWindow = r.history.filter(
        (h) => new Date(h.recorded_at).getTime() >= cutoff,
      );
      const baseline = inWindow.length ? inWindow[0].stars : r.stars;
      const stars_gained = r.stars - baseline;
      const sparkline = (inWindow.length ? inWindow : r.history)
        .slice(-7)
        .map((h) => h.stars);
      const velocity =
        baseline > 0
          ? Math.round((stars_gained / baseline) * 1000)
          : stars_gained;
      return {
        full_name: r.full_name,
        name: r.name,
        owner: r.owner,
        description: r.description,
        language: r.language,
        url: r.url,
        stars: r.stars,
        created_at: r.created_at,
        fetched_at: r.fetched_at,
        stars_gained,
        sparkline,
        velocity,
        slug: r.full_name.replace("/", "-"),
      };
    })
    .sort((a, b) => b.stars_gained - a.stars_gained)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}

export function getRepoBySlug(slug: string): RepoWithVelocity | undefined {
  return getRepos("week").find((r) => r.slug === slug);
}

export function getStats() {
  const store = readStore();
  const totalRepos = store.repos.length;
  const totalStars = store.repos.reduce((sum, r) => sum + r.stars, 0);
  const languages = new Set(store.repos.map((r) => r.language).filter(Boolean));
  return { totalRepos, totalStars, languages: languages.size };
}
```

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit`
Expected: no errors related to lib/db.ts

- [ ] **Step 3: Commit**

```bash
git add lib/db.ts
git commit -m "feat: rewrite db.ts - per-period velocity ranking, no language filter"
```

---

### Task 4: Rewrite globals.css (remove animations)

**Files:**

- Modify: `app/globals.css`

**Interfaces:**

- Consumes: nothing
- Produces: CSS with base styles only, no animations

- [ ] **Step 1: Rewrite globals.css**

Replace entire `app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    background: #0a0a0a;
    color: #f5f5f0;
    font-family: "JetBrains Mono", ui-monospace, monospace;
    -webkit-font-smoothing: antialiased;
  }

  * {
    border-radius: 0 !important;
  }

  ::selection {
    background: #0066ff;
    color: #0a0a0a;
  }

  :focus-visible {
    outline: 2px solid #0066ff;
    outline-offset: 2px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | head -20`
Expected: compilation succeeds

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "chore: strip animations from globals.css"
```

---

### Task 5: Rewrite Header.tsx (minimal hero)

**Files:**

- Modify: `components/Header.tsx`

**Interfaces:**

- Consumes: `getStats()` from lib/db.ts
- Produces: hero section with title, subtitle, 3 stat blocks

- [ ] **Step 1: Rewrite Header.tsx**

Replace entire `components/Header.tsx` with:

```tsx
import { getStats } from "@/lib/db";

export default function Header() {
  const stats = getStats();

  return (
    <section className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          REP<span className="text-electric">Ø</span>SURGE
        </h1>
        <p className="text-bone/50 text-sm mt-3">repos rising. fast.</p>

        <div className="flex gap-12 mt-10 text-sm">
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {stats.totalRepos.toLocaleString()}
            </p>
            <p className="text-bone/40 text-xs tracking-widest mt-1">
              REPOS TRACKED
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {stats.totalStars.toLocaleString()}
            </p>
            <p className="text-bone/40 text-xs tracking-widest mt-1">
              STARS MONITORED
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">{stats.languages}</p>
            <p className="text-bone/40 text-xs tracking-widest mt-1">
              LANGUAGES
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | head -20`
Expected: compilation succeeds

- [ ] **Step 3: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: rewrite Header with minimal hero and stat blocks"
```

---

### Task 6: Rewrite RepoCard.tsx (flat row, velocity as +N ★)

**Files:**

- Modify: `components/RepoCard.tsx`

**Interfaces:**

- Consumes: RepoCardData props (rank, full_name, description, language, url, stars, stars_gained, velocity, sparkline, slug, style)
- Produces: flat row with rank, name, description, stars gained, sparkline

- [ ] **Step 1: Rewrite RepoCard.tsx**

Replace entire `components/RepoCard.tsx` with:

```tsx
import Link from "next/link";
import StarChart from "./StarChart";

export type RepoCardData = {
  rank: number;
  full_name: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  stars_gained: number;
  velocity: number;
  sparkline: number[];
  slug: string;
};

export default function RepoCard({
  rank,
  full_name,
  description,
  stars_gained,
  sparkline,
  slug,
  style,
}: RepoCardData & { style?: React.CSSProperties }) {
  const gainedColor =
    stars_gained > 0
      ? "text-electric"
      : stars_gained < 0
        ? "text-red-500"
        : "text-bone/40";

  return (
    <div
      className="flex items-center gap-4 border-b border-bone/10 py-3"
      data-repo-card
      data-repo-name={full_name.toLowerCase()}
      data-repo-desc={(description ?? "").toLowerCase()}
      data-repo-sort-gained={stars_gained}
      style={style}
    >
      <div className="w-8 text-right text-bone/30 tabular-nums text-sm">
        {String(rank).padStart(2, "0")}
      </div>
      <div className="flex-1 min-w-0">
        <Link
          href={`/repo/${slug}`}
          className="text-bone hover:text-electric transition-colors truncate block font-bold"
        >
          {full_name}
        </Link>
        <p className="text-bone/40 text-xs truncate mt-0.5">
          {description ?? "-"}
        </p>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <StarChart data={sparkline} />
        <div className="text-right min-w-[60px]">
          <span className={`text-sm tabular-nums font-bold ${gainedColor}`}>
            {stars_gained > 0 ? "+" : ""}
            {stars_gained.toLocaleString()} ★
          </span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | head -20`
Expected: compilation succeeds

- [ ] **Step 3: Commit**

```bash
git add components/RepoCard.tsx
git commit -m "feat: rewrite RepoCard - flat row, velocity as +N stars"
```

---

### Task 7: Rewrite StarChart.tsx (remove animation)

**Files:**

- Modify: `components/StarChart.tsx`

**Interfaces:**

- Consumes: data: number[]
- Produces: static CSS bar sparkline

- [ ] **Step 1: Rewrite StarChart.tsx**

Replace entire `components/StarChart.tsx` with:

```tsx
export default function StarChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div
      className="flex items-end h-6 gap-px"
      aria-label="star history"
      role="img"
      aria-roledescription="sparkline chart"
    >
      {data.map((value, i) => {
        const height = `${Math.max(10, ((value - min) / range) * 100)}%`;
        const prev = i > 0 ? data[i - 1] : value;
        const color =
          value > prev
            ? "bg-electric"
            : value < prev
              ? "bg-red-500"
              : "bg-bone/30";
        return (
          <div
            key={i}
            className={`w-1.5 ${color}`}
            style={{ height }}
            title={String(value)}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | head -20`
Expected: compilation succeeds

- [ ] **Step 3: Commit**

```bash
git add components/StarChart.tsx
git commit -m "feat: rewrite StarChart - remove animation, static bars"
```

---

### Task 8: Rewrite layout.tsx (nav with period links, remove client components)

**Files:**

- Modify: `app/layout.tsx`

**Interfaces:**

- Consumes: nothing
- Produces: layout with nav (HOME, DAILY, WEEKLY, MONTHLY, ABOUT), footer

- [ ] **Step 1: Rewrite layout.tsx**

Replace entire `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoSurge - repos rising. fast.",
  description: "GitHub repositories ranked by star velocity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <nav className="border-b border-bone/20 sticky top-0 z-40 bg-midnight/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
            <a
              href="/"
              className="text-lg font-bold tracking-tight text-bone hover:text-electric transition-colors"
            >
              REP<span className="text-electric">Ø</span>SURGE
            </a>
            <div className="flex items-center gap-5 text-xs tracking-widest">
              <a
                href="/"
                className="text-bone/70 hover:text-electric transition-colors"
              >
                HOME
              </a>
              <a
                href="/daily"
                className="text-bone/70 hover:text-electric transition-colors"
              >
                DAILY
              </a>
              <a
                href="/weekly"
                className="text-bone/70 hover:text-electric transition-colors"
              >
                WEEKLY
              </a>
              <a
                href="/monthly"
                className="text-bone/70 hover:text-electric transition-colors"
              >
                MONTHLY
              </a>
              <a
                href="/about"
                className="text-bone/70 hover:text-electric transition-colors"
              >
                ABOUT
              </a>
            </div>
          </div>
        </nav>

        {children}

        <footer className="mt-10 text-bone/30 text-xs border-t border-bone/20 pt-4 pb-8">
          <div className="max-w-7xl mx-auto px-4">
            data: github api | refreshed daily
          </div>
        </footer>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | head -20`
Expected: compilation succeeds

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: rewrite layout - nav with period links, remove client components"
```

---

### Task 9: Rewrite home page (hero + trending + weekly rankings)

**Files:**

- Modify: `app/page.tsx`

**Interfaces:**

- Consumes: `getRepos("week")` from lib/db.ts
- Produces: home page with Header, trending section, period tabs, repo list

- [ ] **Step 1: Rewrite app/page.tsx**

Replace entire `app/page.tsx` with:

```tsx
import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import TrustLogos from "@/components/TrustLogos";
import RepoCard from "@/components/RepoCard";

export default function Home() {
  const repos = getRepos("week");
  const trending = [...repos]
    .sort((a, b) => b.stars_gained - a.stars_gained)
    .slice(0, 3);

  return (
    <>
      <Header />
      <TrustLogos />

      <main className="max-w-7xl mx-auto px-4">
        {trending.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs tracking-widest text-bone/40 mb-4">
              TRENDING THIS WEEK
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trending.map((repo) => (
                <a
                  key={repo.full_name}
                  href={`/repo/${repo.slug}`}
                  className="border border-bone/20 p-4 hover:border-electric/30 transition-colors"
                >
                  <p className="font-bold text-sm truncate">{repo.full_name}</p>
                  <p className="text-electric text-lg font-bold tabular-nums mt-2">
                    +{repo.stars_gained.toLocaleString()} ★
                  </p>
                  <p className="text-bone/40 text-xs mt-1">
                    {repo.velocity} velocity
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-6 mb-6 border-b border-bone/20 pb-3">
            <h2 className="text-xs tracking-widest text-bone/40">RANKINGS</h2>
            <div className="flex gap-4 text-xs tracking-widest">
              <a
                href="/daily"
                className="text-bone/50 hover:text-electric transition-colors"
              >
                DAILY
              </a>
              <span className="text-electric">WEEKLY</span>
              <a
                href="/monthly"
                className="text-bone/50 hover:text-electric transition-colors"
              >
                MONTHLY
              </a>
            </div>
          </div>

          {repos.length === 0 ? (
            <p className="py-12 text-center text-bone/40 text-sm">
              no repos data yet. run npm run fetch first.
            </p>
          ) : (
            repos.map((repo, i) => (
              <RepoCard
                key={repo.full_name}
                rank={repo.rank}
                full_name={repo.full_name}
                description={repo.description}
                language={repo.language}
                url={repo.url}
                stars={repo.stars}
                stars_gained={repo.stars_gained}
                velocity={repo.velocity}
                sparkline={repo.sparkline}
                slug={repo.slug}
                style={{ "--stagger": i } as React.CSSProperties}
              />
            ))
          )}
        </section>
      </main>
    </>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | head -20`
Expected: compilation succeeds

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: rewrite home page - hero + trending + weekly rankings"
```

---

### Task 10: Create daily, weekly, monthly ranking pages

**Files:**

- Create: `app/daily/page.tsx`
- Create: `app/weekly/page.tsx`
- Create: `app/monthly/page.tsx`

**Interfaces:**

- Consumes: `getRepos(period)` from lib/db.ts
- Produces: ranking pages for each period

- [ ] **Step 1: Create app/daily/page.tsx**

```tsx
import { getRepos } from "@/lib/db";
import TrustLogos from "@/components/TrustLogos";
import RepoCard from "@/components/RepoCard";

export default function DailyPage() {
  const repos = getRepos("day");

  return (
    <>
      <section className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">Daily</h1>
          <p className="text-bone/50 text-sm mt-2">
            top repos by stars gained in the last 24 hours
          </p>
        </div>
      </section>

      <TrustLogos />

      <main className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 mb-6 border-b border-bone/20 pb-3">
          <h2 className="text-xs tracking-widest text-bone/40">RANKINGS</h2>
          <div className="flex gap-4 text-xs tracking-widest">
            <span className="text-electric">DAILY</span>
            <a
              href="/weekly"
              className="text-bone/50 hover:text-electric transition-colors"
            >
              WEEKLY
            </a>
            <a
              href="/monthly"
              className="text-bone/50 hover:text-electric transition-colors"
            >
              MONTHLY
            </a>
          </div>
        </div>

        {repos.length === 0 ? (
          <p className="py-12 text-center text-bone/40 text-sm">
            no repos data yet. run npm run fetch first.
          </p>
        ) : (
          repos.map((repo) => (
            <RepoCard
              key={repo.full_name}
              rank={repo.rank}
              full_name={repo.full_name}
              description={repo.description}
              language={repo.language}
              url={repo.url}
              stars={repo.stars}
              stars_gained={repo.stars_gained}
              velocity={repo.velocity}
              sparkline={repo.sparkline}
              slug={repo.slug}
            />
          ))
        )}
      </main>
    </>
  );
}
```

- [ ] **Step 2: Create app/weekly/page.tsx**

```tsx
import { getRepos } from "@/lib/db";
import TrustLogos from "@/components/TrustLogos";
import RepoCard from "@/components/RepoCard";

export default function WeeklyPage() {
  const repos = getRepos("week");

  return (
    <>
      <section className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">Weekly</h1>
          <p className="text-bone/50 text-sm mt-2">
            top repos by stars gained in the last 7 days
          </p>
        </div>
      </section>

      <TrustLogos />

      <main className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 mb-6 border-b border-bone/20 pb-3">
          <h2 className="text-xs tracking-widest text-bone/40">RANKINGS</h2>
          <div className="flex gap-4 text-xs tracking-widest">
            <a
              href="/daily"
              className="text-bone/50 hover:text-electric transition-colors"
            >
              DAILY
            </a>
            <span className="text-electric">WEEKLY</span>
            <a
              href="/monthly"
              className="text-bone/50 hover:text-electric transition-colors"
            >
              MONTHLY
            </a>
          </div>
        </div>

        {repos.length === 0 ? (
          <p className="py-12 text-center text-bone/40 text-sm">
            no repos data yet. run npm run fetch first.
          </p>
        ) : (
          repos.map((repo) => (
            <RepoCard
              key={repo.full_name}
              rank={repo.rank}
              full_name={repo.full_name}
              description={repo.description}
              language={repo.language}
              url={repo.url}
              stars={repo.stars}
              stars_gained={repo.stars_gained}
              velocity={repo.velocity}
              sparkline={repo.sparkline}
              slug={repo.slug}
            />
          ))
        )}
      </main>
    </>
  );
}
```

- [ ] **Step 3: Create app/monthly/page.tsx**

```tsx
import { getRepos } from "@/lib/db";
import TrustLogos from "@/components/TrustLogos";
import RepoCard from "@/components/RepoCard";

export default function MonthlyPage() {
  const repos = getRepos("month");

  return (
    <>
      <section className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">Monthly</h1>
          <p className="text-bone/50 text-sm mt-2">
            top repos by stars gained in the last 30 days
          </p>
        </div>
      </section>

      <TrustLogos />

      <main className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 mb-6 border-b border-bone/20 pb-3">
          <h2 className="text-xs tracking-widest text-bone/40">RANKINGS</h2>
          <div className="flex gap-4 text-xs tracking-widest">
            <a
              href="/daily"
              className="text-bone/50 hover:text-electric transition-colors"
            >
              DAILY
            </a>
            <a
              href="/weekly"
              className="text-bone/50 hover:text-electric transition-colors"
            >
              WEEKLY
            </a>
            <span className="text-electric">MONTHLY</span>
          </div>
        </div>

        {repos.length === 0 ? (
          <p className="py-12 text-center text-bone/40 text-sm">
            no repos data yet. run npm run fetch first.
          </p>
        ) : (
          repos.map((repo) => (
            <RepoCard
              key={repo.full_name}
              rank={repo.rank}
              full_name={repo.full_name}
              description={repo.description}
              language={repo.language}
              url={repo.url}
              stars={repo.stars}
              stars_gained={repo.stars_gained}
              velocity={repo.velocity}
              sparkline={repo.sparkline}
              slug={repo.slug}
            />
          ))
        )}
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify build passes**

Run: `npx next build 2>&1 | head -30`
Expected: all pages generated (/, /daily, /weekly, /monthly, /repo/[slug], /about)

- [ ] **Step 5: Commit**

```bash
git add app/daily/page.tsx app/weekly/page.tsx app/monthly/page.tsx
git commit -m "feat: add daily, weekly, monthly ranking pages"
```

---

### Task 11: Rewrite repo detail page

**Files:**

- Modify: `app/repo/[slug]/page.tsx`

**Interfaces:**

- Consumes: `getRepoBySlug(slug)` and `getRepos(period)` from lib/db.ts
- Produces: repo detail page with stats grid + star chart

- [ ] **Step 1: Rewrite repo detail page**

Replace entire `app/repo/[slug]/page.tsx` with:

```tsx
import Link from "next/link";
import { getRepoBySlug, getRepos } from "@/lib/db";
import StarChart from "@/components/StarChart";

export function generateStaticParams() {
  return getRepos("week").map((repo) => ({
    slug: repo.slug,
  }));
}

export default function RepoDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { period?: string };
}) {
  const { slug } = params;
  const period = searchParams.period ?? "week";
  const repo = getRepoBySlug(slug);

  if (!repo) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="text-bone/50 text-sm hover:text-electric transition-colors mb-8 inline-block"
        >
          ← Back
        </Link>
        <p className="text-bone/40">Repo not found.</p>
      </main>
    );
  }

  const periodRepos = getRepos(period);
  const periodRepo = periodRepos.find((r) => r.slug === slug);
  const stars_gained = periodRepo?.stars_gained ?? 0;
  const velocity = periodRepo?.velocity ?? 0;

  const createdDate = new Date(repo.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <Link
        href="/"
        className="text-bone/50 text-sm hover:text-electric transition-colors mb-8 inline-block"
      >
        ← Back
      </Link>

      <div className="border border-bone/20 p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {repo.full_name}
            </h1>
            <p className="text-bone/50 text-sm">{repo.description ?? "-"}</p>
          </div>
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="bg-electric text-midnight px-4 py-2 text-xs tracking-widest hover:bg-electric/80 transition-colors"
          >
            View on GitHub
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-bone/40 text-xs tracking-widest mb-1">
              TOTAL STARS
            </p>
            <p className="text-2xl font-bold tabular-nums">
              {repo.stars.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-bone/40 text-xs tracking-widest mb-1">
              STARS GAINED
            </p>
            <p
              className={`text-2xl font-bold tabular-nums ${stars_gained > 0 ? "text-electric" : stars_gained < 0 ? "text-red-500" : "text-bone/40"}`}
            >
              {stars_gained > 0 ? "+" : ""}
              {stars_gained.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-bone/40 text-xs tracking-widest mb-1">
              VELOCITY
            </p>
            <p className="text-2xl font-bold tabular-nums text-electric">
              {velocity}
            </p>
          </div>
          <div>
            <p className="text-bone/40 text-xs tracking-widest mb-1">CREATED</p>
            <p className="text-2xl font-bold">{createdDate}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 text-xs tracking-widest mb-3">
            <span className="text-bone/40">PERIOD:</span>
            <Link
              href={`/repo/${slug}?period=day`}
              className={
                period === "day"
                  ? "text-electric"
                  : "text-bone/50 hover:text-electric transition-colors"
              }
            >
              DAILY
            </Link>
            <Link
              href={`/repo/${slug}?period=week`}
              className={
                period === "week"
                  ? "text-electric"
                  : "text-bone/50 hover:text-electric transition-colors"
              }
            >
              WEEKLY
            </Link>
            <Link
              href={`/repo/${slug}?period=month`}
              className={
                period === "month"
                  ? "text-electric"
                  : "text-bone/50 hover:text-electric transition-colors"
              }
            >
              MONTHLY
            </Link>
          </div>
        </div>

        <div>
          <p className="text-bone/40 text-xs tracking-widest mb-3">
            STAR HISTORY
          </p>
          <StarChart data={repo.sparkline} />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | head -30`
Expected: all pages generated, repo detail pages for each slug

- [ ] **Step 3: Commit**

```bash
git add app/repo/[slug]/page.tsx
git commit -m "feat: rewrite repo detail page - stats grid, period selector"
```

---

### Task 12: Simplify MobileNav.tsx

**Files:**

- Modify: `components/MobileNav.tsx`

**Interfaces:**

- Consumes: nothing
- Produces: mobile hamburger menu with period links

- [ ] **Step 1: Rewrite MobileNav.tsx**

Replace entire `components/MobileNav.tsx` with:

```tsx
"use client";

import { useRef, useEffect } from "react";

export default function MobileNav() {
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const menu = menuRef.current;
    const toggle = toggleRef.current;
    if (!menu || !toggle) return;

    const handler = () => menu.classList.toggle("hidden");
    toggle.addEventListener("click", handler);
    return () => toggle.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <button
        ref={toggleRef}
        className="md:hidden text-bone hover:text-electric transition-colors"
        aria-label="Toggle menu"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      <div
        ref={menuRef}
        className="hidden md:hidden py-4 border-t border-bone/20"
      >
        <nav className="flex flex-col gap-3 px-4 text-xs tracking-widest">
          <a
            href="/"
            className="text-bone/70 hover:text-electric transition-colors"
          >
            HOME
          </a>
          <a
            href="/daily"
            className="text-bone/70 hover:text-electric transition-colors"
          >
            DAILY
          </a>
          <a
            href="/weekly"
            className="text-bone/70 hover:text-electric transition-colors"
          >
            WEEKLY
          </a>
          <a
            href="/monthly"
            className="text-bone/70 hover:text-electric transition-colors"
          >
            MONTHLY
          </a>
          <a
            href="/about"
            className="text-bone/70 hover:text-electric transition-colors"
          >
            ABOUT
          </a>
        </nav>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build 2>&1 | head -20`
Expected: compilation succeeds

- [ ] **Step 3: Commit**

```bash
git add components/MobileNav.tsx
git commit -m "feat: simplify MobileNav with period links"
```

---

### Task 13: Full build verify + cleanup

**Files:**

- Verify all files

**Interfaces:**

- Consumes: all previous tasks
- Produces: clean build, no errors

- [ ] **Step 1: Clean build**

```bash
rm -rf .next && npx next build
```

Expected: 0 errors, all pages generated:

- `/` (home)
- `/daily`
- `/weekly`
- `/monthly`
- `/repo/[slug]` (3 pages from seed data)
- `/about`
- `/_not-found`

- [ ] **Step 2: Verify no dead imports**

Run: `grep -r "FilterBar\|SearchBar\|SortSelect\|ScrollReveal\|PrefsRestore\|useLocalStorage\|hero-mesh\|card-glow\|bar-grow\|glass\|reveal" app/ components/ --include="*.tsx" --include="*.ts" --include="*.css"`
Expected: no matches

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final cleanup and build verify"
```
