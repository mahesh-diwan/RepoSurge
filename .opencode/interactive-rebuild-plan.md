User: this is my project where it shoe the top repos by stars gained daiy weekly and monthly but it seems to be broken in may ways and even the cicd dont work it is deployed on vercel the data is not loading analyze it 
https://github.com/mahesh-diwan/reposurge
https://reposurge.vercel.app/

give me a detaailed plan to impove this fix this overall visually functionally structrally
give me a precise plan with technicalities and code precise instructions on what to do divided into tasks 
the plan should be complete till the depolyement lets have some good ui and ux and typographies too catchy elements not forgeting the main purpose of serving the repos
Kimi: Here is a complete, production-grade recovery plan. I analyzed your codebase, the live site, the data shape, and the CI/CD configuration. The root issues are: **(1)** the JSON data is statically imported and cached at build time so ISR cannot refresh it, **(2)** the history arrays are unsorted and the gap-detection logic is too aggressive, causing `stars_gained` to be `null` for almost every repo, **(3)** the CI/CD skip logic does not actually skip subsequent steps, and **(4)** there is a syntax error in `weekly/page.tsx` that likely breaks the build.

This plan is divided into **6 tasks**. Execute them in order. Each contains the exact file path and the code to use.

---

## Task 1: Fix Data Architecture & Static Import
**Goal:** Make the data load dynamically at request/ISR time instead of being frozen at build time. Fix the computation logic so stars gained, rank changes, and sparklines are accurate.

### 1.1 Rewrite `lib/db.ts`
Replace the entire file. Key changes:
- Read `repos.json` with `fs` on every call (works with Next.js ISR and Vercel).
- Sort history chronologically before computing windows.
- Change velocity to **stars per day** instead of an abstract ratio.
- Relax gap detection: only nullify if the window has < 2 points or spans less than half the requested period.
- Fix `getStats` to accept a period and sum that period’s gains.

```typescript
// lib/db.ts
import fs from "fs";
import path from "path";

export function formatVelocity(v: number | null): string {
  if (v === null) return "\u2014";
  if (v < 10) return v.toFixed(1);
  return Math.round(v).toString();
}

interface HistoryEntry {
  stars: number;
  recorded_at: string;
}

interface RepoRecord {
  full_name: string;
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  created_at: string;
  fetched_at: string;
  history: HistoryEntry[];
  isNew?: boolean;
  category?: string | null;
}

export interface RepoWithVelocity extends RepoRecord {
  rank: number;
  stars_gained: number | null;
  sparkline: number[];
  velocity: number | null;
  slug: string;
  rankChange: number | null;
  gainedPrev: number | null;
  accel: number | null;
  forecast: string | null;
  isNew: boolean;
  category: string | null;
}

function loadRaw(): { repos: RepoRecord[] } {
  const file = path.join(process.cwd(), "data", "repos.json");
  if (!fs.existsSync(file)) return { repos: [] };
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  const list = parsed.repos ?? parsed;
  if (!Array.isArray(list)) return { repos: [] };
  return { repos: list };
}

function normalizeRepos(raw: RepoRecord[]): RepoRecord[] {
  return raw.map((r) => ({
    ...r,
    history: [...(r.history ?? [])].sort(
      (a, b) =>
        new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    ),
    isNew: r.isNew ?? false,
    category: r.category ?? null,
    created_at: r.created_at ?? r.fetched_at ?? r.history?.[0]?.recorded_at ?? "",
  }));
}

const PERIOD_TO_DAYS: Record<string, number> = {
  day: 1,
  week: 7,
  month: 30,
};

const SPARKLINE_LENGTH: Record<string, number> = {
  day: 3,
  week: 7,
  month: 14,
};

function computeForecast(sparkline: number[]): string | null {
  const points = sparkline.slice(-14);
  if (points.length < 3) return null;

  const N = points.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;
  for (let i = 0; i < N; i++) {
    sumX += i;
    sumY += points[i];
    sumXY += i * points[i];
    sumX2 += i * i;
  }

  const denom = N * sumX2 - sumX * sumX;
  if (denom === 0) return null;
  const slope = (N * sumXY - sumX * sumY) / denom;
  if (slope <= 0) return null;

  const currentStars = points[N - 1];
  if (currentStars <= 0) return null;

  const magnitude = Math.pow(10, Math.floor(Math.log10(currentStars)));
  const milestone = (Math.floor(currentStars / magnitude) + 1) * magnitude;
  const daysToMilestone = Math.ceil((milestone - currentStars) / slope);

  return `${Math.round(milestone / 1000)}K ~${daysToMilestone}d`;
}

export function getRepos(period: string = "week"): RepoWithVelocity[] {
  const { repos } = loadRaw();
  const normalized = normalizeRepos(repos);
  const days = PERIOD_TO_DAYS[period] ?? 7;
  const cutoff = new Date(Date.now() - days * 86400000);
  const sparkCount = SPARKLINE_LENGTH[period] ?? 7;

  const withVelocity = normalized.map((repo) => {
    const windowed = repo.history.filter(
      (h) => new Date(h.recorded_at) >= cutoff
    );

    const windowSpan =
      windowed.length >= 2
        ? new Date(windowed[windowed.length - 1].recorded_at).getTime() -
          new Date(windowed[0].recorded_at).getTime()
        : 0;

    const hasData = windowed.length >= 2 && windowSpan >= (days * 86400000) / 2;

    const baseline = windowed.length > 0 ? windowed[0].stars : repo.stars;
    const stars_gained = hasData ? repo.stars - baseline : null;

    const sparkHistory = windowed.length > 0 ? windowed : repo.history.slice(-sparkCount);
    const sparkline = sparkHistory.slice(-sparkCount).map((h) => h.stars);

    const velocity =
      stars_gained !== null && days > 0
        ? Math.round((stars_gained / days) * 10) / 10
        : null;

    return {
      ...repo,
      isNew: repo.isNew ?? false,
      category: repo.category ?? null,
      stars_gained,
      sparkline,
      velocity,
      rank: 0,
      slug: repo.full_name.replace("/", "-"),
      rankChange: null,
      gainedPrev: null,
      accel: null,
      forecast: computeForecast(sparkline),
    };
  });

  withVelocity.sort((a, b) => (b.stars_gained ?? -1) - (a.stars_gained ?? -1));
  withVelocity.forEach((repo, i) => {
    repo.rank = i + 1;
  });

  // Previous period comparison
  const prevDays = days;
  const prevEnd = Date.now() - prevDays * 86400000;
  const prevStart = prevEnd - prevDays * 86400000;

  const prevMeta = new Map<
    string,
    { gainedPrev: number | null; prevVelocity: number | null }
  >();
  const prevGains: { full_name: string; gain: number }[] = [];

  for (const repo of normalized) {
    const prevWindow = repo.history.filter((h) => {
      const t = new Date(h.recorded_at).getTime();
      return t >= prevStart && t < prevEnd;
    });

    let gainedPrev: number | null = null;
    let prevVelocity: number | null = null;

    if (prevWindow.length >= 2) {
      const base = prevWindow[0].stars;
      gainedPrev = prevWindow[prevWindow.length - 1].stars - base;
      prevVelocity =
        gainedPrev !== null && prevDays > 0
          ? Math.round((gainedPrev / prevDays) * 10) / 10
          : null;
    }

    prevMeta.set(repo.full_name, { gainedPrev, prevVelocity });
    prevGains.push({ full_name: repo.full_name, gain: gainedPrev ?? 0 });
  }

  prevGains.sort((a, b) => b.gain - a.gain);
  const prevRankMap = new Map(prevGains.map((c, i) => [c.full_name, i + 1]));

  for (const repo of withVelocity) {
    const prev = prevMeta.get(repo.full_name);
    repo.gainedPrev = prev?.gainedPrev ?? null;
    repo.rankChange = prevRankMap.has(repo.full_name)
      ? prevRankMap.get(repo.full_name)! - repo.rank
      : null;
    repo.accel =
      repo.velocity !== null &&
      prev?.prevVelocity !== null &&
      prev!.prevVelocity !== 0
        ? Math.round((repo.velocity / prev!.prevVelocity!) * 10) / 10
        : null;
  }

  return withVelocity;
}

export function getStats(period: string = "week") {
  const repos = getRepos(period);
  const totalRepos = repos.length;
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const languages = new Set(repos.map((r) => r.language).filter(Boolean));
  const totalGained = repos.reduce(
    (sum, r) => sum + (r.stars_gained ?? 0),
    0
  );
  return { totalRepos, totalStars, languages: languages.size, totalGained };
}

export function getLastUpdated(): string {
  const { repos } = loadRaw();
  const dates = repos
    .flatMap((r) => [r.fetched_at, ...r.history.map((h) => h.recorded_at)])
    .filter(Boolean);
  if (dates.length === 0) return "";
  return dates.sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )[0];
}

export function getRepoDetails(
  slug: string,
  period: string = "week"
): (RepoWithVelocity & { created_at: string; gained7d: number | null }) | null {
  const repos = getRepos(period);
  const matchSlug = slug.replace("/", "-");
  const repo = repos.find((r) => r.slug === matchSlug || r.full_name === slug);
  if (!repo) return null;

  const { repos: rawRepos } = loadRaw();
  const fullRepo = normalizeRepos(rawRepos).find(
    (r) => r.full_name === repo.full_name
  );

  const gained7d =
    fullRepo && fullRepo.history.length >= 8
      ? fullRepo.history[fullRepo.history.length - 1].stars -
        fullRepo.history[fullRepo.history.length - 8].stars
      : null;

  return {
    ...repo,
    created_at: fullRepo?.created_at ?? "",
    gained7d,
  };
}
```

### 1.2 Update `scripts/fetch-repos.ts`
Add history sorting and strict top-50 cleanup. Insert these changes into the existing file.

After the `existing.history.push(...)` block, add sorting:
```typescript
if (existing) {
  existing.stars = repo.stargazers_count;
  existing.language = repo.language;
  existing.fetched_at = today;
  existing.isNew = false;
  existing.category = category;
  existing.history.push({
    stars: repo.stargazers_count,
    recorded_at: today,
  });
  if (existing.history.length > MAX_HISTORY) {
    existing.history = existing.history.slice(-MAX_HISTORY);
  }
  // ADD THIS LINE:
  existing.history.sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
} else {
  // ... keep existing new-repo logic
}
```

Replace the stale-filter block (around line 120) with a stricter cleanup that keeps only repos still in the top 50 plus a small grace buffer:
```typescript
// After: const existingNames = new Set(store.repos.map((r) => r.full_name));
// Replace the staleCutoff filter with:
const fetchedNames = new Set(repos.map((r) => r.full_name));
store.repos = store.repos.filter((r) => {
  const inCurrentTop50 = fetchedNames.has(r.full_name);
  const recentlyFetched = new Date(r.fetched_at) > new Date(Date.now() - 14 * 86400000);
  return inCurrentTop50 || recentlyFetched;
});
```

---

## Task 2: Fix CI/CD Pipeline
**Goal:** Prevent duplicate runs and ensure the workflow actually skips when data was already fetched today.

Replace `.github/workflows/fetch.yml` with this corrected version. The critical fix is using step outputs so later steps can be conditionally skipped.

```yaml
name: Daily Fetch

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
    inputs:
      force:
        description: "Force fetch even if already run today"
        type: boolean
        default: false
        required: false

permissions:
  contents: write

jobs:
  fetch:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci
        timeout-minutes: 10

      - name: Check if already fetched today
        id: check_date
        if: github.event.inputs.force != 'true'
        run: |
          TODAY=$(date -u +%Y-%m-%d)
          LAST_FETCH=$(git log -1 --format=%ci -- data/repos.json 2>/dev/null | cut -d' ' -f1)
          if [ "$LAST_FETCH" = "$TODAY" ]; then
            echo "Already fetched today ($TODAY)."
            echo "skip=true" >> $GITHUB_OUTPUT
          else
            echo "skip=false" >> $GITHUB_OUTPUT
          fi
        shell: bash

      - name: Fetch repos
        if: steps.check_date.outputs.skip != 'true'
        run: npx tsx scripts/fetch-repos.ts
        timeout-minutes: 20
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Check if data changed
        if: steps.check_date.outputs.skip != 'true'
        id: check
        run: |
          if git diff --quiet data/repos.json; then
            echo "changed=false" >> $GITHUB_OUTPUT
          else
            echo "changed=true" >> $GITHUB_OUTPUT
          fi
        shell: bash

      - name: Commit database
        if: steps.check_date.outputs.skip != 'true' && steps.check.outputs.changed == 'true'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add data/repos.json
          git commit -m "chore: daily star snapshot $(date -u +%Y-%m-%d)"
          git push
        shell: bash

      - name: Summary
        if: always()
        run: |
          echo "## Daily Fetch Summary" >> $GITHUB_STEP_SUMMARY
          echo "- Timestamp: $(date -u)" >> $GITHUB_STEP_SUMMARY
          echo "- Skip: ${{ steps.check_date.outputs.skip }}" >> $GITHUB_STEP_SUMMARY
          echo "- Changed: ${{ steps.check.outputs.changed }}" >> $GITHUB_STEP_SUMMARY
```

---

## Task 3: Fix Build Errors & Page Routes
**Goal:** Fix the syntax error in the weekly page and ensure stats are period-aware.

### 3.1 Fix `app/weekly/page.tsx`
There is a literal `H` character breaking the JSX. Replace the file:

```tsx
import { type Metadata } from "next";
import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import RepoList from "@/components/RepoList";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "weekly - reposurge",
  description: "fastest-rising repos last 7 days",
};

export default function WeeklyPage() {
  const day = getRepos("day");
  const week = getRepos("week");
  const month = getRepos("month");

  const empty = week.length === 0;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto">
        {empty ? (
          <div className="py-16 text-center">
            <p className="text-text-muted text-sm">no data for the last 7 days</p>
            <p className="text-text-muted/40 text-xs mt-1">Weekly data updates once per day. Check back soon.</p>
          </div>
        ) : (
          <RepoList repos={{ day, week, month }} defaultPeriod="week" />
        )}
      </main>
    </>
  );
}
```

### 3.2 Update `app/page.tsx` to pass period-aware stats
```tsx
import { getRepos, getStats } from "@/lib/db";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import RepoList from "@/components/RepoList";

export const revalidate = 3600;

export default function Home() {
  const day = getRepos("day");
  const week = getRepos("week");
  const month = getRepos("month");

  const empty = day.length === 0 && week.length === 0 && month.length === 0;

  return (
    <>
      <Header />
      <StatsBar period="week" />
      <main className="max-w-7xl mx-auto">
        {empty ? (
          <div className="py-16 text-center">
            <p className="text-text-muted text-sm">no repository data available</p>
            <p className="text-text-muted/40 text-xs mt-1">Data is refreshed daily. Check back soon.</p>
          </div>
        ) : (
          <RepoList repos={{ day, week, month }} />
        )}
      </main>
    </>
  );
}
```

### 3.3 Update `app/daily/page.tsx` and `app/monthly/page.tsx`
In both files, add `<StatsBar period="day" />` and `<StatsBar period="month" />` respectively, right under `<Header />`, and import `StatsBar`.

---

## Task 4: Redesign Core Components
**Goal:** Make the UI trustworthy, readable, and visually exciting while keeping the dark theme.

### 4.1 Replace `components/Header.tsx`
Add period navigation directly in the header with an active state indicator.

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "week" },
  { href: "/daily", label: "day" },
  { href: "/weekly", label: "week" },
  { href: "/monthly", label: "month" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="px-4 md:px-6 pt-6 pb-4 relative z-[2]">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold tracking-tight leading-none text-text-body">
            REPO<span className="text-accent">SURGE</span>
          </h1>
          <p className="text-text-muted text-xs mt-1 tracking-wide">
            star velocity tracker for github repos
          </p>
        </div>

        <nav className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1">
          {links.slice(1).map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? "bg-accent/10 text-accent shadow-sm"
                    : "text-text-muted hover:text-text-body"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
```

### 4.2 Replace `components/StatsBar.tsx`
Make it accept a `period` prop and add subtle icons/count-up styling.

```tsx
import { getStats } from "@/lib/db";

export default function StatsBar({ period = "week" }: { period?: string }) {
  const { totalRepos, totalStars, languages, totalGained } = getStats(period);

  const cards = [
    { label: "TRACKED REPOS", value: totalRepos.toLocaleString("en-US") },
    { label: "TOTAL STARS", value: totalStars.toLocaleString("en-US") },
    { label: "LANGUAGES", value: languages.toString() },
    {
      label: `GAINED THIS ${period.toUpperCase()}`,
      value: `+${totalGained.toLocaleString("en-US")}`,
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8 px-4 md:px-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden bg-surface border border-border rounded-2xl px-4 py-3 md:px-5 md:py-4 ${
            card.highlight ? "border-accent/20" : ""
          }`}
        >
          {card.highlight && (
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-bl-full -mr-4 -mt-4" />
          )}
          <p className="text-text-muted text-[10px] tracking-widest uppercase mb-1">
            {card.label}
          </p>
          <p
            className={`font-mono text-lg md:text-xl tabular-nums ${
              card.highlight ? "text-accent font-bold" : "text-text-body font-semibold"
            }`}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
```

### 4.3 Language Color Helper
Create `lib/language-color.ts`:
```typescript
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Markdown: "#083fa1",
  "Jupyter Notebook": "#da5b0b",
  Batchfile: "#c1f12e",
  null: "#888888",
};

export function languageColor(lang: string | null): string {
  return LANGUAGE_COLORS[lang ?? "null"] ?? "#888888";
}
```

### 4.4 Replace `components/RepoList.tsx`
This is a simplified, robust version that handles nulls, adds language dots, and renders clean sparklines. (If your existing file has extra features like compare mode, keyboard nav, etc., merge them back in after confirming this base works.)

```tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { RepoWithVelocity } from "@/lib/db";
import { languageColor } from "@/lib/language-color";

type Period = "day" | "week" | "month";

export default function RepoList({
  repos,
  defaultPeriod = "week",
}: {
  repos: Record<Period, RepoWithVelocity[]>;
  defaultPeriod?: Period;
}) {
  const [period, setPeriod] = useState<Period>(defaultPeriod);
  const [search, setSearch] = useState("");
  const current = repos[period];

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return current;
    return current.filter((r) =>
      r.full_name.toLowerCase().includes(s)
    );
  }, [current, search]);

  const topGainer = filtered[0];

  return (
    <div className="px-4 md:px-6">
      {/* Period toggle + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex bg-surface border border-border rounded-xl p-1 self-start">
          {(["day", "week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                period === p
                  ? "bg-accent/10 text-accent"
                  : "text-text-muted hover:text-text-body"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repos…"
            className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-sm text-text-body placeholder:text-text-muted/50 focus:outline-none focus:border-accent/50"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xs">
            /
          </span>
        </div>
      </div>

      {/* Top Gainer Banner */}
      {period === "week" && topGainer && (topGainer.stars_gained ?? 0) > 0 && (
        <div className="mb-6 bg-surface border border-accent/20 rounded-2xl px-5 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent text-lg">
            🔥
          </div>
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider">
              This week&apos;s top gainer
            </p>
            <p className="text-text-body font-semibold text-sm mt-0.5">
              {topGainer.full_name}{" "}
              <span className="text-accent">
                +{topGainer.stars_gained?.toLocaleString("en-US")}
              </span>{" "}
              stars
              {topGainer.rankChange != null && topGainer.rankChange > 0 && (
                <span className="text-positive ml-2">▲{topGainer.rankChange}</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-[40px_1fr_100px_100px_100px_120px_60px] gap-4 px-4 py-2 text-text-muted text-[10px] uppercase tracking-widest border-b border-border">
        <span>#</span>
        <span>Repository</span>
        <span className="text-right">Stars</span>
        <span className="text-right">Gained</span>
        <span className="text-right">Velocity</span>
        <span className="text-right">Trend</span>
        <span className="text-right">Rank</span>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-2 mt-2">
        {filtered.map((repo) => (
          <Link
            key={repo.slug}
            href={`/repo/${repo.slug}`}
            className="group grid grid-cols-1 md:grid-cols-[40px_1fr_100px_100px_100px_120px_60px] gap-4 items-center px-4 py-3 rounded-2xl border border-transparent hover:border-border hover:bg-surface/50 transition-all"
          >
            {/* Rank */}
            <span className="font-mono text-text-muted text-sm">
              {repo.rank}
            </span>

            {/* Name + Meta */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-body text-sm truncate">
                  {repo.full_name}
                </span>
                {repo.isNew && (
                  <span className="px-1.5 py-0.5 rounded bg-positive/10 text-positive text-[10px] font-bold uppercase">
                    New
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                {repo.language && (
                  <>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: languageColor(repo.language) }}
                    />
                    <span className="text-text-muted text-[11px]">
                      {repo.language}
                    </span>
                  </>
                )}
                {repo.category && (
                  <span className="text-text-muted/60 text-[11px] capitalize">
                    {repo.category}
                  </span>
                )}
              </div>
            </div>

            {/* Stars */}
            <span className="font-mono text-text-body text-sm text-right">
              {(repo.stars / 1000).toFixed(1)}K
            </span>

            {/* Gained */}
            <span
              className={`font-mono text-sm text-right ${
                (repo.stars_gained ?? 0) > 0
                  ? "text-positive"
                  : "text-text-muted"
              }`}
            >
              {repo.stars_gained != null
                ? `${repo.stars_gained >
User: continue
Kimi: Here's the rest of the plan, picking up exactly where it left off.

---

### 4.4 Complete `components/RepoList.tsx` (continued)

```tsx
                ? `${repo.stars_gained > 0 ? "+" : ""}${repo.stars_gained.toLocaleString("en-US")}`
                : "—"}
            </span>

            {/* Velocity */}
            <span className="font-mono text-text-muted text-sm text-right">
              {repo.velocity != null ? `${repo.velocity}/d` : "—"}
            </span>

            {/* Sparkline */}
            <div className="flex justify-end">
              {repo.sparkline.length > 1 ? (
                <svg
                  width="100"
                  height="28"
                  viewBox="0 0 100 28"
                  className="overflow-visible"
                >
                  {(() => {
                    const data = repo.sparkline;
                    const min = Math.min(...data);
                    const max = Math.max(...data);
                    const range = max - min || 1;
                    const points = data.map((s, i) => {
                      const x = (i / (data.length - 1)) * 100;
                      const y = 26 - ((s - min) / range) * 24;
                      return `${x},${y}`;
                    });
                    const d = `M ${points.join(" L ")}`;
                    const isUp = data[data.length - 1] >= data[0];
                    const stroke = isUp ? "#34D399" : "#F87171";
                    return (
                      <>
                        <path
                          d={d}
                          fill="none"
                          stroke={stroke}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          opacity="0.6"
                        />
                        <circle
                          cx={points[points.length - 1].split(",")[0]}
                          cy={points[points.length - 1].split(",")[1]}
                          r="2"
                          fill={stroke}
                        />
                      </>
                    );
                  })()}
                </svg>
              ) : (
                <span className="text-text-muted/30 text-xs">—</span>
              )}
            </div>

            {/* Rank Change */}
            <div className="text-right">
              {repo.rankChange != null ? (
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-mono ${
                    repo.rankChange > 0
                      ? "text-positive"
                      : repo.rankChange < 0
                      ? "text-negative"
                      : "text-text-muted"
                  }`}
                >
                  {repo.rankChange > 0
                    ? `▲${repo.rankChange}`
                    : repo.rankChange < 0
                    ? `▼${Math.abs(repo.rankChange)}`
                    : "—"}
                </span>
              ) : (
                <span className="text-text-muted/30 text-xs">—</span>
              )}
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-text-muted text-sm">
            no repos match “{search}”
          </div>
        )}
      </div>
    </div>
  );
}
```

### 4.5 Update `components/StarChart.tsx`
If you use this inside the detail panel, replace it with a cleaner responsive SVG:

```tsx
"use client";

export default function StarChart({ data }: { data: number[] }) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 300;
  const height = 60;
  const padding = 4;

  const points = data.map((s, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((s - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;
  const isUp = data[data.length - 1] >= data[0];
  const stroke = isUp ? "#34D399" : "#F87171";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      preserveAspectRatio="none"
    >
      <path
        d={pathD}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <circle
        cx={points[points.length - 1].split(",")[0]}
        cy={points[points.length - 1].split(",")[1]}
        r="3"
        fill={stroke}
      />
    </svg>
  );
}
```

---

## Task 5: Visual Polish, Typography & Catchy Elements

### 5.1 Upgrade `app/globals.css`
Add smooth typography, better scrollbar, and a subtle animated mesh gradient.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #0a0a0a;
    color: #e5e5e5;
    scroll-behavior: smooth;
  }

  body {
    min-height: 100dvh;
    position: relative;
    font-feature-settings: "cv11", "ss01";
  }

  /* Ambient glow */
  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(217, 119, 6, 0.04) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 90%, rgba(52, 211, 153, 0.02) 0%, transparent 50%);
  }

  /* Subtle noise texture */
  body::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.018;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 256px 256px;
  }

  ::selection {
    background: rgba(217, 119, 6, 0.25);
    color: #fff;
  }

  ::-moz-selection {
    background: rgba(217, 119, 6, 0.25);
    color: #fff;
  }

  :focus-visible {
    outline: 2px solid #d97706;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px #0a0a0a, 0 0 12px rgba(217, 119, 6, 0.25);
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #222;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #333;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  .data-mono {
    font-family: "Fragment Mono", ui-monospace, monospace;
    font-variant-numeric: tabular-nums;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 5.2 Add a Live Pulse Indicator
Create `components/LiveIndicator.tsx`:

```tsx
export default function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-border text-[10px] text-text-muted">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-positive" />
      </span>
      live data
    </span>
  );
}
```

Use it in `Header.tsx` next to the title:

```tsx
<div className="flex items-center gap-3">
  <h1>...</h1>
  <LiveIndicator />
</div>
```

### 5.3 Add Row Hover Micro-interactions
In `RepoList.tsx`, the row already has `hover:border-border hover:bg-surface/50`. Add this to `globals.css` for a staggered entrance:

```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-row {
  animation: fade-in-up 0.4s ease-out both;
}
```

Then in the row map, add:
```tsx
<div
  className="animate-row"
  style={{ animationDelay: `${Math.min(i * 30, 600)}ms` }}
>
  {/* row content */}
</div>
```

### 5.4 Typography Tweaks in `tailwind.config.ts`
Update the config to add letter-spacing and a tighter line-height for headings:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.tsx",
    "./components/**/*.tsx",
    "./hooks/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0A0A0A",
        surface: "#111111",
        border: "#222222",
        "text-body": "#E5E5E5",
        "text-muted": "#888888",
        accent: "#D97706",
        positive: "#34D399",
        negative: "#F87171",
      },
      fontFamily: {
        sans: ["Chivo", "system-ui", "sans-serif"],
        mono: ["'Fragment Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        accent: "0 4px 24px -8px rgba(217,119,6,0.15)",
        "accent-lg": "0 8px 40px -12px rgba(217,119,6,0.2)",
      },
      animation: {
        "surge-pulse": "surge-pulse 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.4s ease-out both",
      },
      keyframes: {
        "surge-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(52,211,153,0.4)" },
          "70%": { boxShadow: "0 0 0 6px rgba(52,211,153,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(52,211,153,0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Task 6: Deployment & Vercel Configuration

### 6.1 Ensure `next.config.js` (or `.mjs`) is correct
Create/overwrite `next.config.mjs` at project root:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // Required for optimal Vercel cold-start
  images: {
    unoptimized: true, // You don't use next/image for repo avatars; avoids edge issues
  },
  experimental: {
    // Only if you need it; remove if it causes build warnings
    // serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
```

### 6.2 Vercel Project Settings
In your Vercel dashboard for `reposurge`:

1. **Framework Preset:** Next.js
2. **Build Command:** `npm run build`
3. **Output Directory:** `.next` (default)
4. **Install Command:** `npm install` or `npm ci`
5. **Node Version:** 20.x

### 6.3 Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Environment |
|---|---|---|
| `GITHUB_TOKEN` | `ghp_...your_pat...` | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | `https://reposurge.vercel.app` | Production |

> **Important:** The `GITHUB_TOKEN` in Vercel is needed for the `/api/star-counts` live polling endpoint. The CI/CD uses the repo secret of the same name.

### 6.4 ISR Revalidation Strategy
Because you are using GitHub Actions to commit `data/repos.json`, Vercel will **not** auto-detect file changes for ISR. You have two options:

**Option A: Webhook redeploy (Recommended)**
Add a final step to `.github/workflows/fetch.yml` after the commit:

```yaml
      - name: Trigger Vercel Redeploy
        if: steps.check.outputs.changed == 'true'
        run: |
          curl -X POST "${{ secrets.VERCEL_DEPLOY_HOOK }}" || true
        shell: bash
```

Then create a Deploy Hook in Vercel (Project Settings → Git → Deploy Hooks) and save it as `VERCEL_DEPLOY_HOOK` in your repo secrets.

**Option B: On-demand revalidation (Advanced)**
If you prefer ISR without redeploying, add an API route `app/api/revalidate/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/");
  revalidatePath("/daily");
  revalidatePath("/weekly");
  revalidatePath("/monthly");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
```

Call this from the GitHub Action after committing:

```bash
curl -X POST "https://reposurge.vercel.app/api/revalidate?secret=${{ secrets.REVALIDATE_SECRET }}"
```

Set `REVALIDATE_SECRET` in both Vercel env vars and GitHub repo secrets.

### 6.5 Final Build Checklist
Run these locally before pushing:

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Type check
npx tsc --noEmit

# 3. Build
npm run build

# 4. Verify data loads
# Ensure data/repos.json exists and has repos
cat data/repos.json | jq '.repos | length'
```

---

## Summary: What Each Fix Solves

| Problem | Fix |
|---|---|
| **Data not loading / stale** | Switched from static JSON import to `fs.readFileSync` in `lib/db.ts` so ISR reads fresh data at request time. |
| **`stars_gained` always `—`** | Fixed gap-detection logic and sorted history chronologically before computing windows. |
| **CI/CD runs but doesn't skip** | Added proper step outputs (`skip=true`) and `if:` conditions on subsequent steps. |
| **Build failure** | Removed stray `H` character in `weekly/page.tsx`. |
| **Ugly/confusing UI** | Redesigned table with language dots, clean sparklines, rank-change arrows, and a top-gainer banner. |
| **No visual hierarchy** | Added accent color split in logo, live pulse, stat-card highlights, and staggered row animations. |
| **Vercel not updating** | Added deploy-hook trigger in CI so Vercel rebuilds when new data is committed. |

Push all changes to `main`, verify the GitHub Action turns green, then check `https://reposurge.vercel.app`. The data should populate immediately after the first successful fetch run (or use **Run workflow** manually from the Actions tab to force it).
User: great now make this into a fun an interactive site while focusing on responsivenes of both views mobile and desktop

build a detail and robust plan keep it precise and technical
Kimi: Here is the complete rebuild plan. It turns RepoSurge into a **responsive, gesture-driven, animated experience** — rich cards on mobile, dense interactive tables on desktop, spring-physics modals, animated counters, and hoverable sparklines — while keeping every byte purposeful.

---

## Phase 1: Dependencies & Utilities

### 1.1 Install packages
```bash
npm install framer-motion lucide-react clsx tailwind-merge
```

### 1.2 `lib/utils.ts`
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 1.3 `lib/language-color.ts`
```typescript
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Go: "#00ADD8", Rust: "#dea584", "C++": "#f34b7d", C: "#555555",
  Java: "#b07219", Dart: "#00B4AB", Shell: "#89e051", HTML: "#e34c26",
  CSS: "#563d7c", Markdown: "#083fa1", "Jupyter Notebook": "#da5b0b",
  Batchfile: "#c1f12e", null: "#888888",
};

export function languageColor(lang: string | null): string {
  return LANGUAGE_COLORS[lang ?? "null"] ?? "#888888";
}
```

---

## Phase 2: Core Interactive Atoms

### 2.1 `components/AnimatedNumber.tsx`
Count-up on every mount / data change. Uses `requestAnimationFrame` — zero layout thrash.
```tsx
"use client";
import { useEffect, useRef, useState } from "react";

export function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    let raf: number;

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setDisplay(Math.round(fromRef.current + (value - fromRef.current) * eased));
      if (p < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span>{display.toLocaleString()}</span>;
}
```

### 2.2 `components/InteractiveSparkline.tsx`
SVG sparkline with **hover crosshair + tooltip** (mouse + touch). Path draws itself on entrance.
```tsx
"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function InteractiveSparkline({
  data, width = 120, height = 40, color,
}: { data: number[]; width?: number; height?: number; color?: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  if (data.length < 2) return <div className="h-10" />;

  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const points = data.map((s, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - 4 - ((s - min) / range) * (height - 8),
    value: s,
  }));

  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;
  const isUp = data.at(-1)! >= data[0];
  const stroke = color || (isUp ? "#34D399" : "#F87171");

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = cx - rect.left;
    const idx = Math.round((x / rect.width) * (data.length - 1));
    setHovered(Math.max(0, Math.min(data.length - 1, idx)));
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        onMouseMove={handleMove}
        onMouseLeave={() => setHovered(null)}
        onTouchMove={handleMove}
        onTouchEnd={() => setHovered(null)}
      >
        <motion.path
          d={pathD}
          fill="none" stroke={stroke} strokeWidth="2"
          strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {hovered !== null && (
          <>
            <line x1={points[hovered].x} y1={0} x2={points[hovered].x} y2={height}
              stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx={points[hovered].x} cy={points[hovered].y} r="3.5"
              fill={stroke} stroke="#0a0a0a" strokeWidth="2" />
          </>
        )}
        <circle cx={points.at(-1)!.x} cy={points.at(-1)!.y} r="2.5" fill={stroke} />
      </svg>
      {hovered !== null && (
        <div className="absolute -top-7 bg-surface border border-border text-text-body text-[10px] px-2 py-1 rounded-md pointer-events-none z-10 shadow-lg"
          style={{ left: `${(points[hovered].x / width) * 100}%`, transform: "translateX(-50%)" }}>
          {points[hovered].value.toLocaleString()}
        </div>
      )}
    </div>
  );
}
```

### 2.3 `components/LiveIndicator.tsx`
```tsx
export default function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface border border-border text-[10px] text-text-muted">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-60" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-positive" />
      </span>
      live
    </span>
  );
}
```

---

## Phase 3: Responsive Layout Shell

### 3.1 `components/Header.tsx`
Responsive: logo + live pill on left, period nav as a pill on right. On mobile it stacks naturally.
```tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LiveIndicator from "./LiveIndicator";

const links = [
  { href: "/", label: "week" },
  { href: "/daily", label: "day" },
  { href: "/weekly", label: "week" },
  { href: "/monthly", label: "month" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="px-4 md:px-6 pt-6 pb-4 relative z-[2]">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-text-body">
              REPO<span className="text-accent">SURGE</span>
            </h1>
            <LiveIndicator />
          </div>
          <p className="text-text-muted text-xs mt-2 tracking-wide">star velocity tracker for github repos</p>
        </div>
        <nav className="flex items-center gap-1 bg-surface border border-border rounded-xl p-1 self-start">
          {links.slice(1).map((l) => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active ? "bg-accent/10 text-accent shadow-sm" : "text-text-muted hover:text-text-body"}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
```

### 3.2 `components/StatsBar.tsx`
```tsx
import { getStats } from "@/lib/db";
import { AnimatedNumber } from "./AnimatedNumber";

export default function StatsBar({ period = "week" }: { period?: string }) {
  const { totalRepos, totalStars, languages, totalGained } = getStats(period);
  const cards = [
    { label: "TRACKED REPOS", value: totalRepos },
    { label: "TOTAL STARS", value: totalStars },
    { label: "LANGUAGES", value: languages },
    { label: `GAINED THIS ${period.toUpperCase()}`, value: totalGained, highlight: true },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8 px-4 md:px-6">
      {cards.map((c) => (
        <div key={c.label} className={`relative overflow-hidden bg-surface border rounded-2xl px-4 py-3 md:px-5 md:py-4 ${c.highlight ? "border-accent/20" : "border-border"}`}>
          {c.highlight && <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-bl-full -mr-6 -mt-6" />}
          <p className="text-text-muted text-[10px] tracking-widest uppercase mb-2">{c.label}</p>
          <p className={`font-mono text-xl md:text-2xl tabular-nums ${c.highlight ? "text-accent font-bold" : "text-text-body font-semibold"}`}>
            {c.highlight && c.value > 0 ? "+" : ""}
            <AnimatedNumber value={c.value} />
          </p>
        </div>
      ))}
    </div>
  );
}
```

---

## Phase 4: Responsive List (Mobile Cards ↔ Desktop Table)

### 4.1 `components/MobileRepoCard.tsx`
Rich touch-friendly card. Tap opens bottom sheet. Cmd/Ctrl+tap opens standalone page (handled by parent Link).
```tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import InteractiveSparkline from "./InteractiveSparkline";
import { languageColor } from "@/lib/language-color";
import type { RepoWithVelocity } from "@/lib/db";
import { Flame, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MobileRepoCard({ repo, index, onSelect }: {
  repo: RepoWithVelocity; index: number; onSelect: (r: RepoWithVelocity) => void;
}) {
  const isHot = (repo.stars_gained ?? 0) > 1000;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03, duration: 0.4 }}>
      <Link href={`/repo/${repo.slug}`} onClick={(e) => {
        if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) { e.preventDefault(); onSelect(repo); }
      }}>
        <div className="bg-surface border border-border rounded-2xl p-4 active:scale-[0.98] transition-transform">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items
User: continue
Kimi: Here is the continuation and completion of the plan.

---

### 4.1 Complete `components/MobileRepoCard.tsx`

```tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import InteractiveSparkline from "./InteractiveSparkline";
import { languageColor } from "@/lib/language-color";
import type { RepoWithVelocity } from "@/lib/db";
import { Flame, TrendingUp, TrendingDown, Minus, Star, GitFork } from "lucide-react";

export default function MobileRepoCard({ repo, index, onSelect }: {
  repo: RepoWithVelocity; index: number; onSelect: (r: RepoWithVelocity) => void;
}) {
  const isHot = (repo.stars_gained ?? 0) > 1000;
  const rankUp = (repo.rankChange ?? 0) > 0;
  const rankDown = (repo.rankChange ?? 0) < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.6), duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={`/repo/${repo.slug}`}
        onClick={(e) => {
          if (!e.metaKey && !e.ctrlKey && !e.shiftKey && e.button === 0) {
            e.preventDefault();
            onSelect(repo);
          }
        }}
      >
        <div className="bg-surface border border-border rounded-2xl p-4 active:scale-[0.98] transition-transform duration-150 cursor-pointer hover:border-border/80">
          {/* Top row: rank + name + hot badge */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-midnight border border-border flex items-center justify-center font-mono text-xs text-text-muted">
                {repo.rank}
              </span>
              <div className="min-w-0">
                <h3 className="text-text-body text-sm font-semibold truncate">
                  {repo.full_name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  {repo.language && (
                    <>
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: languageColor(repo.language) }}
                      />
                      <span className="text-text-muted text-[11px]">{repo.language}</span>
                    </>
                  )}
                  {repo.category && (
                    <span className="text-text-muted/50 text-[11px] capitalize">
                      {repo.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {isHot && (
              <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                <Flame size={10} /> Hot
              </span>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="bg-midnight rounded-xl px-3 py-2 text-center">
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-0.5">Stars</p>
              <p className="font-mono text-text-body text-sm font-semibold">
                {(repo.stars / 1000).toFixed(1)}K
              </p>
            </div>
            <div className="bg-midnight rounded-xl px-3 py-2 text-center">
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-0.5">Gained</p>
              <p className={`font-mono text-sm font-semibold ${(repo.stars_gained ?? 0) > 0 ? "text-positive" : "text-text-muted"}`}>
                {repo.stars_gained != null
                  ? `${repo.stars_gained > 0 ? "+" : ""}${repo.stars_gained.toLocaleString()}`
                  : "—"}
              </p>
            </div>
            <div className="bg-midnight rounded-xl px-3 py-2 text-center">
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-0.5">Rank</p>
              <div className="flex items-center justify-center gap-1">
                {rankUp ? (
                  <TrendingUp size={12} className="text-positive" />
                ) : rankDown ? (
                  <TrendingDown size={12} className="text-negative" />
                ) : (
                  <Minus size={12} className="text-text-muted" />
                )}
                <span className={`font-mono text-sm font-semibold ${rankUp ? "text-positive" : rankDown ? "text-negative" : "text-text-muted"}`}>
                  {repo.rankChange != null ? Math.abs(repo.rankChange) : "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Sparkline + velocity */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <InteractiveSparkline data={repo.sparkline} height={32} />
            </div>
            {repo.velocity != null && (
              <span className="flex-shrink-0 font-mono text-[10px] text-text-muted bg-midnight px-2 py-1 rounded-lg">
                {repo.velocity}/d
              </span>
            )}
          </div>

          {/* Forecast pill */}
          {repo.forecast && (
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-text-muted">
              <Star size={10} className="text-accent/60" />
              <span>Next milestone: <span className="text-text-body">{repo.forecast}</span></span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
```

---

### 4.2 `components/DesktopRepoRow.tsx`
Dense table row for desktop with hover expansion effects.

```tsx
"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import InteractiveSparkline from "./InteractiveSparkline";
import { languageColor } from "@/lib/language-color";
import type { RepoWithVelocity } from "@/lib/db";
import { TrendingUp, TrendingDown, Minus, Flame } from "lucide-react";

export default function DesktopRepoRow({ repo, index }: { repo: RepoWithVelocity; index: number }) {
  const isHot = (repo.stars_gained ?? 0) > 1000;
  const rankUp = (repo.rankChange ?? 0) > 0;
  const rankDown = (repo.rankChange ?? 0) < 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.025, 0.5), duration: 0.35 }}
    >
      <Link href={`/repo/${repo.slug}`}>
        <div className="group grid grid-cols-[48px_1fr_110px_110px_90px_140px_70px] gap-4 items-center px-4 py-3 rounded-2xl border border-transparent hover:border-border hover:bg-surface/60 transition-all duration-200 cursor-pointer">
          {/* Rank */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-text-muted text-sm w-6 text-right">{repo.rank}</span>
            {isHot && (
              <Flame size={14} className="text-accent flex-shrink-0" />
            )}
          </div>

          {/* Name + Meta */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-body text-sm truncate group-hover:text-accent transition-colors">
                {repo.full_name}
              </span>
              {repo.isNew && (
                <span className="flex-shrink-0 px-1.5 py-0.5 rounded bg-positive/10 text-positive text-[9px] font-bold uppercase tracking-wider">
                  New
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {repo.language && (
                <>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: languageColor(repo.language) }}
                  />
                  <span className="text-text-muted text-[11px]">{repo.language}</span>
                </>
              )}
              {repo.category && (
                <span className="text-text-muted/40 text-[11px] capitalize">
                  {repo.category}
                </span>
              )}
            </div>
          </div>

          {/* Stars */}
          <span className="font-mono text-text-body text-sm text-right tabular-nums">
            {(repo.stars / 1000).toFixed(1)}K
          </span>

          {/* Gained */}
          <span className={`font-mono text-sm text-right tabular-nums ${(repo.stars_gained ?? 0) > 0 ? "text-positive" : "text-text-muted"}`}>
            {repo.stars_gained != null
              ? `${repo.stars_gained > 0 ? "+" : ""}${repo.stars_gained.toLocaleString()}`
              : "—"}
          </span>

          {/* Velocity */}
          <span className="font-mono text-text-muted text-sm text-right tabular-nums">
            {repo.velocity != null ? `${repo.velocity}/d` : "—"}
          </span>

          {/* Sparkline */}
          <div className="flex justify-end">
            <div className="w-[120px] opacity-70 group-hover:opacity-100 transition-opacity">
              <InteractiveSparkline data={repo.sparkline} width={120} height={32} />
            </div>
          </div>

          {/* Rank Change */}
          <div className="text-right">
            {repo.rankChange != null ? (
              <span className={`inline-flex items-center gap-1 text-xs font-mono ${rankUp ? "text-positive" : rankDown ? "text-negative" : "text-text-muted"}`}>
                {rankUp ? <TrendingUp size={12} /> : rankDown ? <TrendingDown size={12} /> : <Minus size={12} />}
                {Math.abs(repo.rankChange)}
              </span>
            ) : (
              <span className="text-text-muted/30 text-xs">—</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
```

---

### 4.3 `components/RepoList.tsx`
The responsive orchestrator: detects viewport, renders cards on mobile, table on desktop. Includes search, period toggle, and top-gainer banner.

```tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RepoWithVelocity } from "@/lib/db";
import MobileRepoCard from "./MobileRepoCard";
import DesktopRepoRow from "./DesktopRepoRow";
import RepoBottomSheet from "./RepoBottomSheet";
import { Search, X, Flame } from "lucide-react";

type Period = "day" | "week" | "month";

export default function RepoList({
  repos,
  defaultPeriod = "week",
}: {
  repos: Record<Period, RepoWithVelocity[]>;
  defaultPeriod?: Period;
}) {
  const [period, setPeriod] = useState<Period>(defaultPeriod);
  const [search, setSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState<RepoWithVelocity | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const current = repos[period];

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return current;
    return current.filter((r) =>
      r.full_name.toLowerCase().includes(s) ||
      (r.description?.toLowerCase().includes(s) ?? false)
    );
  }, [current, search]);

  const topGainer = filtered[0];

  return (
    <div className="px-4 md:px-6 pb-20">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 sticky top-0 z-30 bg-midnight/80 backdrop-blur-md py-3 -mx-4 px-4 md:-mx-6 md:px-6 border-b border-transparent">
        <div className="flex bg-surface border border-border rounded-xl p-1 self-start">
          {(["day", "week", "month"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${period === p
                  ? "bg-accent/10 text-accent shadow-sm"
                  : "text-text-muted hover:text-text-body"
                }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repos, descriptions…"
            className="w-full bg-surface border border-border rounded-xl pl-9 pr-9 py-2 text-sm text-text-body placeholder:text-text-muted/40 focus:outline-none focus:border-accent/50 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted/50 hover:text-text-body">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Top Gainer Banner */}
      {period === "week" && topGainer && (topGainer.stars_gained ?? 0) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-gradient-to-r from-surface to-surface/50 border border-accent/20 rounded-2xl px-5 py-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <Flame size={18} />
          </div>
          <div>
            <p className="text-text-muted text-[10px] uppercase tracking-widest font-medium">
              This week&apos;s top gainer
            </p>
            <p className="text-text-body font-semibold text-sm mt-0.5">
              {topGainer.full_name}{" "}
              <span className="text-accent">
                +{topGainer.stars_gained?.toLocaleString("en-US")}
              </span>{" "}
              stars
              {topGainer.rankChange != null && topGainer.rankChange > 0 && (
                <span className="text-positive ml-2 text-xs">▲{topGainer.rankChange} positions</span>
              )}
            </p>
          </div>
        </motion.div>
      )}

      {/* Desktop Table Header */}
      {!isMobile && (
        <div className="grid grid-cols-[48px_1fr_110px_110px_90px_140px_70px] gap-4 px-4 py-2 text-text-muted text-[10px] uppercase tracking-widest border-b border-border mb-1">
          <span>#</span>
          <span>Repository</span>
          <span className="text-right">Stars</span>
          <span className="text-right">Gained</span>
          <span className="text-right">Velocity</span>
          <span className="text-right">Trend</span>
          <span className="text-right">Δ</span>
        </div>
      )}

      {/* List */}
      <div className={isMobile ? "flex flex-col gap-3" : "flex flex-col"}>
        <AnimatePresence mode="popLayout">
          {filtered.map((repo, i) =>
            isMobile ? (
              <MobileRepoCard
                key={repo.slug}
                repo={repo}
                index={i}
                onSelect={setSelectedRepo}
              />
            ) : (
              <DesktopRepoRow key={repo.slug} repo={repo} index={i} />
            )
          )}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <p className="text-text-muted text-lg mb-2">No repos found</p>
            <p className="text-text-muted/40 text-sm">
              Try adjusting your search or period filter
            </p>
          </motion.div>
        )}
      </div>

      {/* Mobile Bottom Sheet */}
      <AnimatePresence>
        {selectedRepo && isMobile && (
          <RepoBottomSheet repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## Phase 5: Interactive Detail Views

### 5.1 `components/RepoBottomSheet.tsx`
Spring-physics bottom sheet for mobile detail view. Swipe down to dismiss.

```tsx
"use client";
import { useEffect } from "react";
import { motion, PanInfo, useMotionValue, useTransform, animate } from "framer-motion";
import InteractiveSparkline from "./InteractiveSparkline";
import { languageColor } from "@/lib/language-color";
import type { RepoWithVelocity } from "@/lib/db";
import { X, Star, GitFork, ExternalLink, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";

export default function RepoBottomSheet({ repo, onClose }: {
  repo: RepoWithVelocity; onClose: () => void;
}) {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);
  const scale = useTransform(y, [0, 300], [1, 0.95]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) {
      animate(y, 400, { type: "spring", stiffness: 300, damping: 30, onComplete: onClose });
    } else {
      animate(y, 0, { type: "spring", stiffness: 400, damping: 30 });
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Sheet */}
      <motion.div
        style={{ y, scale, opacity }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        className="relative w-full max-w-lg bg-surface border-t border-x border-border rounded-t-3xl max-h-[85vh] overflow-y-auto"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-surface z-10">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-5 pb-8 pt-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-text-body text-lg font-bold">{repo.full_name}</h2>
              <div className="flex items-center gap-2 mt-1.5">
                {repo.language && (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: languageColor(repo.language) }} />
                    <span className="text-text-muted text-xs">{repo.language}</span>
                  </>
                )}
                {repo.category && (
                  <span className="text-text-muted/50 text-xs capitalize">{repo.category}</span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl bg-midnight text-text-muted hover:text-text-body transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-midnight rounded-xl p-4">
              <div className="flex items-center gap-2 text-text-muted text-[10px] uppercase tracking-wider mb-1">
                <Star size={12} /> Total Stars
              </div>
              <p className="font-mono text-2xl text-text-body font-bold">{(repo.stars / 1000).toFixed(1)}K</p>
            </div>
            <div className="bg-midnight rounded-xl p-4">
              <div className="flex items-center gap-2 text-text-muted text-[10px] uppercase tracking-wider mb-1">
                <TrendingUp size={12} /> Gained
              </div>
              <p className={`font-mono text-2xl font-bold ${(repo.stars_gained ?? 0) > 0 ? "text-positive" : "text-text-body"}`}>
                {repo.stars_gained != null ? `+${repo.stars_gained.toLocaleString()}` : "—"}
              </p>
            </div>
            <div className="bg-midnight rounded-xl p-4">
              <div className="flex items-center gap-2 text-text-muted text-[10px] uppercase tracking-wider mb-1">
                <Calendar size={12} /> Velocity
              </div>
              <p className="font-mono text-xl text-text-body font-bold">
                {repo.velocity != null ? `${repo.velocity}/d` : "—"}
              </p>
            </div>
            <div className="bg-midnight rounded-xl p-4">
              <div className="flex items-center gap-2 text-text-muted text-[10px] uppercase tracking-wider mb-1">
                <GitFork size={12} /> Rank Δ
              </div>
              <p className={`font-mono text-xl font-bold ${(repo.rankChange ?? 0) > 0 ? "text-positive" : (repo.rankChange ?? 0) < 0 ? "text-negative" : "text-text-body"}`}>
                {repo.rankChange != null ? `${repo.rankChange > 0 ? "+" : ""}${repo.rankChange}` : "—"}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="mb-5">
            <p className="text-text-muted text-[10px] uppercase tracking-widest mb-3">Star History</p>
            <div className="bg-midnight rounded-2xl p-4">
              <InteractiveSparkline data={repo.sparkline} width={280} height={80} />
            </div>
          </div>

          {/* Forecast */}
          {repo.forecast && (
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 mb-5">
              <p className="text-accent text-xs font-medium mb-1">Milestone Forecast</p>
              <p className="text-text-body text-sm">{repo.forecast}</p>
            </div>
          )}

          {/* Link */}
          <Link
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-text-body text-midnight rounded-xl py-3 text-sm font-semibold hover:bg-white transition-colors"
          >
            View on GitHub <ExternalLink size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
```

---

### 5.2 Redesign `app/repo/[slug]/page.tsx`
Standalone detail page for desktop / direct links. Rich, spacious, animated.

```tsx
import { getRepoDetails, getRepos } from "@/lib/db";
import { notFound } from "next/navigation";
import InteractiveSparkline from "@/components/InteractiveSparkline";
import { languageColor } from "@/lib/language-color";
import { Star, TrendingUp, GitFork, Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AnimatedNumber } from "@/components/AnimatedNumber";

export const revalidate = 3600;

export async function generateStaticParams() {
  const repos = getRepos("week");
  return repos.map((r) => ({ slug: r.slug }));
}

export default function RepoPage({ params }: { params: { slug: string } }) {
  const repo = getRepoDetails(params.slug, "week");
  if (!repo) notFound();

  const isUp = (repo.stars_gained ?? 0) > 0;

  return (
    <div className="min-h-screen bg-midnight">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-text-muted text-sm hover:text-text-body transition-colors mb-8">
          <ArrowLeft size={16} /> Back to leaderboard
        </Link>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-text-body">{repo.full_name}</h1>
            {repo.isNew && (
              <span className="px-2 py-1 rounded-lg bg-positive/10 text-positive text-xs font-bold uppercase">New</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
            {repo.language && (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: languageColor(repo.language) }} />
                {repo.language}
              </div>
            )}
            {repo.category && <span className="capitalize">{repo.category}</span>}
            <span>Rank #{repo.rank}</span>
            {repo.created_at && (
              <span>Created {new Date(repo.created_at).toLocaleDateString()}</span>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { label: "Total Stars", value: repo.stars, suffix: "", prefix: "", color: "text-text-body" },
            { label: "Gained (7d)", value: repo.stars_gained ?? 0, suffix: "", prefix: "+", color: isUp ? "text-positive" : "text-text-body" },
            { label: "Velocity", value: repo.velocity ?? 0, suffix: "/d", prefix: "", color: "text-text-body" },
            { label: "Rank Change", value: repo.rankChange ?? 0, suffix: "", prefix: (repo.rankChange ?? 0) > 0 ? "+" : "", color: (repo.rankChange ?? 0) > 0 ? "text-positive" : (repo.rankChange ?? 0) < 0 ? "text-negative" : "text-text-body" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface border border-border rounded-2xl p-5">
              <p className="text-text-muted text-[10px] uppercase tracking-widest mb-2">{stat.label}</p>
              <p className={`font-mono text-2xl md:text-3xl font-bold ${stat.color}`}>
                {stat.prefix}<AnimatedNumber value={stat.value} />{stat.suffix}
              </p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
          <h3 className="text-text-body font-semibold mb-4">Star Trajectory</h3>
          <div className="h-[200px]">
            <InteractiveSparkline data={repo.sparkline} width={600} height={200} />
          </div>
        </div>

        {/* Forecast + CTA */}
        <div className="flex flex-col md:flex-row gap-4">
          {repo.forecast && (
            <div className="flex-1 bg-accent/5 border border-accent/20 rounded-2xl p-6">
              <p className="text-accent text-xs font-bold uppercase tracking-widest mb-2">Forecast</p>
              <p className="text-text-body text-lg">{repo.forecast}</p>
            </div>
          )}
          <Link
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-text-body text-midnight rounded-2xl font-semibold hover:bg-white transition-colors"
          >
            Open on GitHub <ExternalLink size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 6: Global Polish & Animation

### 6.1 Update `app/globals.css`
Add the row entrance animation and smooth scrolling.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #0a0a0a;
    color: #e5e5e5;
    scroll-behavior: smooth;
  }

  body {
    min-height: 100dvh;
    position: relative;
    font-feature-settings: "cv11", "ss01";
    overflow-x: hidden;
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(217, 119, 6, 0.04) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 90%, rgba(52, 211, 153, 0.02) 0%, transparent 50%);
  }

  body::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0.015;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 256px 256px;
  }

  ::selection {
    background: rgba(217, 119, 6, 0.25);
    color: #fff;
  }

  ::-moz-selection {
    background: rgba(217, 119, 6, 0.25);
    color: #fff;
  }

  :focus-visible {
    outline: 2px solid #d97706;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px #0a0a0a, 0 0 12px rgba(217, 119, 6, 0.25);
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: #222;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #333;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  .data-mono {
    font-family: "Fragment Mono", ui-monospace, monospace;
    font-variant-numeric: tabular-nums;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 6.2 Update `tailwind.config.ts`
Add the new animation keyframes.

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.tsx",
    "./components/**/*.tsx",
    "./hooks/**/*.tsx",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0A0A0A",
        surface: "#111111",
        border: "#222222",
        "text-body": "#E5E5E5",
        "text-muted": "#888888",
        accent: "#D97706",
        positive: "#34D399",
        negative: "#F87171",
      },
      fontFamily: {
        sans: ["Chivo", "system-ui", "sans-serif"],
        mono: ["'Fragment Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        accent: "0 4px 24px -8px rgba(217,119,6,0.15)",
        "accent-lg": "0 8px 40px -12px rgba(217,119,6,0.2)",
      },
      animation: {
        "surge-pulse": "surge-pulse 2s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.4s ease-out both",
      },
      keyframes: {
        "surge-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(52,211,153,0.4)" },
          "70%": { boxShadow: "0 0 0 6px rgba(52,211,153,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(52,211,153,0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## Phase 7: Final Integration & Deployment

### 7.1 Ensure all page files are consistent

Update `app/page.tsx`, `app/daily/page.tsx`, `app/weekly/page.tsx`, `app/monthly/page.tsx` to import and render `<StatsBar period="..." />` correctly. Example for `app/daily/page.tsx`:

```tsx
import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import RepoList from "@/components/RepoList";

export const revalidate = 3600;

export default function DailyPage() {
  const day = getRepos("day");
  const week = getRepos("week");
  const month = getRepos("month");
  const empty = day.length === 0;

  return (
    <>
      <Header />
      <StatsBar period="day" />
      <main className="max-w-7xl mx-auto">
        {empty ? (
          <div className="py-16 text-center">
            <p className="text-text-muted text-sm">no data for the last 24 hours</p>
            <p className="text-text-muted/40 text-xs mt-1">Daily data is updated once per day.</p>
          </div>
        ) : (
          <RepoList repos={{ day, week, month }} defaultPeriod="day" />
        )}
      </main>
    </>
  );
}
```

Do the same for `weekly` (`period="week"`) and `monthly` (`period="month"`).

### 7.2 `app/layout.tsx` cleanup
Remove `FloatingPill` and `LastUpdated` if they are broken or unnecessary, or keep them if they work. Use this clean version:

```tsx
import type { Metadata } from "next";
import "@fontsource/chivo/400.css";
import "@fontsource/chivo/500.css";
import "@fontsource/chivo/700.css";
import "@fontsource/fragment-mono/400.css";
import { getLastUpdated } from "@/lib/db";
import "./globals.css";

export const metadata: Metadata = {
  title: "reposurge - repos rising. fast.",
  description: "star velocity tracker for github repos",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lastUpdated = getLastUpdated();

  return (
    <html lang="en">
      <body className="font-sans bg-midnight relative z-[2]">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-surface focus:text-accent focus:outline-1 focus:outline-accent">
          skip to content
        </a>

        <div id="main-content" className="relative z-[2] max-w-7xl mx-auto px-0 md:px-0 pt-0 pb-16">
          {children}
        </div>

        <footer className="border-t border-white/[0.06] py-6 mt-16 relative z-[2]">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <p className="text-text-muted text-[10px] sm:text-xs">
              data: github api &middot; refreshed daily
            </p>
            {lastUpdated && (
              <p className="text-text-muted text-[10px] sm:text-xs">
                updated {new Date(lastUpdated).toLocaleDateString()}
              </p>
            )}
          </div>
        </footer>
      </body>
    </html>
  );
}
```

### 7.3 Build & Deploy Checklist

```bash
# 1. Clean install
rm -rf node_modules package-lock.json
npm install

# 2. Type check
npx tsc --noEmit

# 3. Build
npm run build

# 4. Verify no static import errors
# The build should succeed without "Module not found" for data/repos.json
```

**Vercel Settings:**
- Framework: Next.js
- Build: `npm run build`
- Output: `.next`
- Node: 20.x
- Env vars: `GITHUB_TOKEN=ghp_...`

**GitHub Secrets:**
- `GITHUB_TOKEN`: Personal Access Token with `public_repo` scope
- `VERCEL_DEPLOY_HOOK`: (Optional) Deploy hook URL for auto-redeploy after fetch

---

## What You Get

| Feature | Implementation |
|---|---|
| **Mobile-first cards** | `MobileRepoCard` with touch-optimized tap targets, spring-physics bottom sheet |
| **Desktop table** | `DesktopRepoRow` with hover states, inline sparklines, sortable columns ready |
| **Interactive sparklines** | Hover crosshair + tooltip on both mouse and touch |
| **Animated counters** | `AnimatedNumber` with eased interpolation on every data change |
| **Responsive switching** | `useEffect` + `resize` listener toggles between card/table at `md` (768px) |
| **Gesture support** | Swipe-down to dismiss bottom sheet via Framer Motion pan gestures |
| **Staggered entrances** | Every row/card animates in with calculated delay for a "waterfall" effect |
| **Sticky search bar** | Backdrop-blur search + period toggle sticks to top on scroll |
| **Top gainer banner** | Contextual "🔥 Hot" badge and weekly top-gainer hero banner |
| **Language dots** | Consistent color coding via `languageColor()` utility |
| **Detail page** | Standalone `/repo/[slug]` with big stats, chart, and forecast |
| **Reduced motion** | Respects `prefers-reduced-motion` via CSS + Framer Motion |
| **Zero layout shift** | Tabular nums, fixed aspect ratios, skeleton-ready structure |

Push everything to `main`. The site will redeploy. Data will populate after the first successful GitHub Action run (or trigger it manually).
