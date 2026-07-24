# Leaderboard Legend, Robustness & Polish — Implementation Plan

> **For agentic workers:** Use subagent-driven-development or executing-plans. Checkbox syntax.

**Goal:** Add homepage legend/tooltips, error handling, and visual polish to RepoSurge.

**Architecture:** Server components for static info + tooltips; extend useLiveStars hook for error state; expand API config.

**Tech Stack:** Next.js 14 App Router, Tailwind v3.4, TypeScript

## Global Constraints

- Terminal-brutalist palette only: `terminal`, `midnight`, `bone`, `dim`
- JetBrains Mono via `next/font`
- No new dependencies
- All interactive elements must have `title` and `focus-visible:` states
- `toLocaleString("en-US")` for number formatting

---

### Task 1: Tooltips across components

**Files:**

- Modify: `components/RepoCard.tsx`
- Modify: `components/StarChart.tsx`
- Modify: `components/PeriodNav.tsx`
- Modify: `components/SearchInput.tsx`

- [ ] **Add `title` attributes** to all interactive and informational elements

**RepoCard.tsx:**

- Rank number: `title="Rank"`
- Repo name Link already has `title={full_name}` — keep
- Gained value: `title={stars_gained > 0 ? "Stars gained this period" : stars_gained < 0 ? "Stars lost this period" : "No change this period"}`
- Live delta: `title="Live star gain since page load"`

**StarChart.tsx:**

- Container: `title="Star history: 7 data points across this period"`

**PeriodNav.tsx:**

- Active span: `title="Current view"`
- `daily` link: `title="View daily leaderboard"`
- `weekly` link: `title="View weekly leaderboard"`
- `monthly` link: `title="View monthly leaderboard"`

**SearchInput.tsx:**

- `title="Type to filter repos"` on input

- [ ] **Verify build passes**

Run: `npm run build` — expect 0 errors.

- [ ] **Commit**

```bash
git add components/RepoCard.tsx components/StarChart.tsx components/PeriodNav.tsx components/SearchInput.tsx
git commit -m "feat: add title tooltips across components"
```

---

### Task 2: LeaderboardInfo component + homepage

**Files:**

- Create: `components/LeaderboardInfo.tsx`
- Modify: `app/page.tsx`

- [ ] **Create `components/LeaderboardInfo.tsx`**

```tsx
export default function LeaderboardInfo() {
  return (
    <p className="text-dim text-xs leading-relaxed border-b border-terminal/5 pb-4 mb-2">
      15 repos ranked by stars gained this period. <span title="Rank">#</span>{" "}
      position &middot; <span title="Stars gained this period">gained</span>{" "}
      stars earned &middot; <span title="Star count trend">sparkline</span>{" "}
      trend &middot; <span title="Live polling from GitHub API">● live</span>{" "}
      from github
    </p>
  );
}
```

- [ ] **Add LeaderboardInfo to `app/page.tsx`**

Insert `<LeaderboardInfo />` between `PeriodNav` and `RepoList`.

```tsx
import LeaderboardInfo from "@/components/LeaderboardInfo";

// Inside Home(), between <PeriodNav> and <RepoList>:
<ScrollReveal delay={0.05}>
  <LeaderboardInfo />
</ScrollReveal>;
```

- [ ] **Verify build**

Run: `npm run build`

- [ ] **Commit**

```bash
git add components/LeaderboardInfo.tsx app/page.tsx
git commit -m "feat: add leaderboard info legend to homepage"
```

---

### Task 3: Expand star-counts API to 15 repos

**Files:**

- Modify: `app/api/star-counts/route.ts`

- [ ] **Add missing 4 repos to REPOS list**

```ts
const REPOS = [
  { owner: "anomalyco", name: "opencode" },
  { owner: "graphify-labs", name: "graphify" },
  { owner: "n8n-io", name: "n8n" },
  { owner: "shubhamsaboo", name: "awesome-llm-apps" },
  { owner: "koala73", name: "worldmonitor" },
  { owner: "diegosouzapw", name: "omniroute" },
  { owner: "tirth8205", name: "code-review-graph" },
  { owner: "trycua", name: "cua" },
  { owner: "1jehuang", name: "jcode" },
  { owner: "ibelick", name: "ui-skills" },
  { owner: "codecrafters-io", name: "build-your-own-x" },
  { owner: "vercel", name: "next.js" },
  { owner: "shadcn-ui", name: "ui" },
  { owner: "langgenius", name: "dify" },
  { owner: "astral-sh", name: "ruff" },
];
```

- [ ] **Verify build**

Run: `npm run build`

- [ ] **Commit**

```bash
git add app/api/star-counts/route.ts
git commit -m "feat: expand star-counts API to all 15 repos"
```

---

### Task 4: Error states and loading skeleton

**Files:**

- Modify: `lib/useLiveStars.ts`
- Modify: `components/RepoList.tsx`

- [ ] **Add error state to useLiveStars** — return `error: string | null`

```tsx
export function useLiveStars() {
  const [starsMap, setStarsMap] = useState<Record<string, number>>({});
  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function poll() {
      try {
        const res = await fetch("/api/star-counts");
        if (!res.ok) {
          if (mounted) {
            setLive(false);
            setError("API returned " + res.status);
          }
          return;
        }
        const body = await res.json();
        if (!mounted) return;
        if (!body.ok) {
          setLive(false);
          setError(body.error?.message ?? "Unknown error");
          return;
        }
        const map: Record<string, number> = {};
        for (const r of body.data.repos) map[r.full_name] = r.stars;
        setStarsMap(map);
        setLive(true);
        setError(null);
      } catch {
        if (mounted) {
          setLive(false);
          setError("Connection failed");
        }
      }
    }

    poll();
    const id = setInterval(poll, 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  return { starsMap, live, error };
}
```

- [ ] **Add error banner + loading to RepoList**

```tsx
const { starsMap, live, error } = useLiveStars();

// Error banner — between search row and sort header:
{
  error && !live && (
    <div className="flex items-center gap-2 mb-3 px-3 py-2 border border-terminal/20 rounded-none text-dim text-[10px]">
      <span>live data unavailable — showing cached data</span>
      <button
        onClick={() => window.location.reload()}
        className="ml-auto text-terminal hover:text-terminal/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal transition-colors underline underline-offset-4"
      >
        retry
      </button>
    </div>
  );
}

// Loading state for sparkline area — while first poll runs and starsMap is empty
// (The sparkline text-bars already show static data, so loading is subtle:
//  we could add a dim "loading..." indicator next to the polling badge.)
// Ponytail: keep it simple — the existing "polling" badge already signals data freshness.
```

- [ ] **Verify build**

Run: `npm run build`

- [ ] **Commit**

```bash
git add lib/useLiveStars.ts components/RepoList.tsx
git commit -m "feat: add API error states and retry"
```

---

### Task 5: Beauty polish

**Files:**

- Modify: `components/Header.tsx`
- Modify: `components/RepoCard.tsx` (gained format)
- Modify: `app/layout.tsx` (footer text)
- Modify: `components/PeriodNav.tsx` (active border)
- Modify: `components/LeaderboardInfo.tsx` (if needed)

- [ ] **Stat symbols in Header.tsx**

```tsx
<p className="text-bone/60 text-xs mt-8">
  <span title="Total repositories" className="tabular-nums">
    {stats.totalRepos.toLocaleString("en-US")}
  </span>{" "}
  ⊞ repos &middot;{" "}
  <span title="Total stars" className="tabular-nums">
    {stats.totalStars.toLocaleString("en-US")}
  </span>{" "}
  ★ stars &middot;{" "}
  <span title="Programming languages" className="tabular-nums">
    {stats.languages.toLocaleString("en-US")}
  </span>{" "}
  ⊞ languages
</p>
```

- [ ] **Footer text in layout.tsx**

Change `"data: github api · refreshed daily"` → `"data: github api · last fetch: ..."` but keep it server-side simple. Actually, keep as `"data: github api · refreshed daily"` since it describes the pipeline cadence. User can change later.

Ponytail: skip footer text change, it's fine as-is.

- [ ] **Active period border in PeriodNav.tsx**

```tsx
// Add border-terminal/30 border to active span:
<span
  key={label}
  className="text-terminal font-bold border border-terminal/30 px-2 py-1"
  aria-current="page"
>
  {label}
</span>
```

- [ ] **Refined gained format in RepoCard.tsx**

Change gained format string to not add star suffix — keep existing format, it's already clean.

Ponytail: skip star suffix change, current format is fine.

- [ ] **Verify build**

Run: `npm run build`

- [ ] **Commit**

```bash
git add components/Header.tsx components/PeriodNav.tsx
git commit -m "style: polish header stats and active period border"
```
