# RepoSurge: Robustness, Features & Data Precision

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add pagination, keyboard nav, stars sort, decimal velocity, missed-day detection, Zod validation, ISR tuning, and data pipeline hardening.

**Architecture:** Tasks ordered by dependency chain: Task 1 (data types) → Task 2 (RepoList features) → Task 3 (infra). Each builds on the previous.

**Tech Stack:** Next.js 14, TypeScript, Tailwind, Zod (new dep)

## Global Constraints

- Tailwind color keys `text-body`, `text-muted` → class `text-text-body`, `text-text-muted`
- `language` field is `string | null` — handle null as `—`
- Fetch script runs via `npx tsx scripts/fetch-repos.ts` in CI
- All 507 repos have 1 history entry (fresh state after history reset)

---

### Task 1: Data Precision (Decimal Velocity + Missed-Day + Null Types)

**Files:**

- Modify: `lib/db.ts`
- Modify: `components/RepoCard.tsx`
- Modify: `components/RepoDetail.tsx`
- Modify: `app/repo/[slug]/page.tsx`
- Modify: `lib/gained-color.ts`

**Interfaces:**

- Produces: `RepoWithVelocity.stars_gained` becomes `number | null`, `velocity` becomes `number | null`
- Produces: `formatVelocity(n: number | null): string`

- [ ] **Step 1: Add formatVelocity + missed-day detection to db.ts**

```tsx
// Add to top of lib/db.ts, after imports:
export function formatVelocity(v: number | null): string {
  if (v === null) return "\u2014";
  if (v < 10) return v.toFixed(1);
  return Math.round(v).toString();
}
```

```tsx
// Update RepoWithVelocity interface in lib/db.ts:
export interface RepoWithVelocity extends RepoRecord {
  rank: number;
  stars_gained: number | null;
  sparkline: number[];
  velocity: number | null;
  slug: string;
}
```

```tsx
// Update getRepos in lib/db.ts — add gap detection + nullable gains:
const windowed = repo.history.filter((h) => new Date(h.recorded_at) >= cutoff);

const hasGap =
  windowed.length >= 2 &&
  (() => {
    for (let i = 1; i < windowed.length; i++) {
      const prev = new Date(windowed[i - 1].recorded_at).getTime();
      const curr = new Date(windowed[i].recorded_at).getTime();
      if (curr - prev > 48 * 3600000) return true;
    }
    return false;
  })();

const baseline = windowed.length > 0 ? windowed[0].stars : repo.stars;
const stars_gained = hasGap ? null : repo.stars - baseline;

const sparkHistory = windowed.length > 0 ? windowed : repo.history;
const sparkline = sparkHistory.slice(-sparkCount).map((h) => h.stars);

const velocity =
  stars_gained === null
    ? null
    : baseline > 0
      ? Math.round((stars_gained / baseline) * 1000)
      : stars_gained;
```

- [ ] **Step 2: Update gained-color to handle null**

```tsx
// lib/gained-color.ts:
export function gainedColor(val: number | null): string {
  if (val === null) return "text-text-muted/50";
  if (val > 0) return "text-positive";
  if (val < 0) return "text-negative";
  return "text-text-muted/50";
}
```

- [ ] **Step 3: Handle null stars_gained in RepoCard**

```tsx
// In RepoCard.tsx, change the gained display block:
{
  gained === null ? (
    <span className="text-text-muted/30 tabular-nums text-sm">&mdash;</span>
  ) : gained === 0 ? (
    <span className="text-text-muted/30 tabular-nums text-sm">&mdash;</span>
  ) : (
    <span className={`${gainedColor} tabular-nums text-sm`}>
      {gainedPrefix}
      {gainedAbs.toLocaleString("en-US")}
    </span>
  );
}
```

```tsx
// Update gained7d — pass as number | null and handle in display
```

```tsx
// Update gainedColor prop type:
gainedColor: string;
// No change needed — gainedColor() already returns string even with null input
```

- [ ] **Step 4: Handle null in RepoDetail**

```tsx
// components/RepoDetail.tsx line 41, const gained7d:
const gained7d =
  repo.stars_gained !== null && repo.history.length >= 8
    ? repo.history[repo.history.length - 1].stars -
      repo.history[repo.history.length - 8].stars
    : null;
```

```tsx
// Line 42: display gained7d handling null:
<span
  className={`text-sm font-bold tabular-nums ${gainedColor(repo.stars_gained ?? 0)}`}
>
  {gained7d === null
    ? "\u2014"
    : (gained7d > 0 ? "+" : "") + gained7d.toLocaleString("en-US")}
</span>
```

- [ ] **Step 5: Use formatVelocity in pages where velocity is displayed**

```tsx
// app/repo/[slug]/page.tsx — import formatVelocity:
import { getRepoDetails, formatVelocity } from "@/lib/db";
```

```tsx
// Line 97 — velocity display:
<p
  className={`text-lg font-bold tabular-nums text-text-body ${gainedColor(repo.stars_gained ?? 0)}`}
>
  {formatVelocity(repo.velocity)}
</p>
```

- [ ] **Step 6: Verify build + tests**

Run: `npm run build && npm test`

---

### Task 2: RepoList Features (Pagination + Keyboard + Stars Sort)

**Files:**

- Modify: `components/RepoList.tsx`

**Interfaces:**

- Consumes: `RepoWithVelocity` (now with nullable stars_gained/velocity)
- Produces: `visibleCount` state, `selectedIndex` state, `"stars"` SortKey

- [ ] **Step 1: Add pagination state + load-more button**

```tsx
// In RepoList.tsx, after sort state (line 28):
const [visibleCount, setVisibleCount] = useState(50);
```

```tsx
// After the sorted list closing </div> (after line 162):
{
  visibleCount < sorted.length && (
    <div className="flex justify-center pt-4 pb-6">
      <button
        onClick={() => setVisibleCount((c) => c + 50)}
        className="px-4 py-2 border border-border text-text-muted text-xs hover:text-accent hover:border-accent/30 transition-colors cursor-pointer"
      >
        show 50 more ({sorted.length - visibleCount} remaining)
      </button>
    </div>
  );
}
```

```tsx
// Slice the sorted list — change line 131 from sorted.map to:
sorted.slice(0, visibleCount).map((repo, i) => {
```

```tsx
// Reset visibleCount on search change — add effect after other effects:
useEffect(() => {
  setVisibleCount(50);
}, [search]);
```

- [ ] **Step 2: Add stars sort**

```tsx
// Change SortKey type (line 24):
type SortKey = "rank" | "name" | "gained" | "stars";
```

```tsx
// Add to switch in sorted useMemo (line 40, after "gained"):
case "stars":
  return (a.stars - b.stars) * dir;
```

```tsx
// Change the static <div> for stars label (line 121) to a <button>:
<button
  onClick={() => handleSort("stars")}
  className="hidden sm:block shrink-0 w-16 text-right hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:text-accent/70 transition-colors cursor-pointer"
  title="Sort by stars"
>
  stars{arrow("stars")}
</button>
```

- [ ] **Step 3: Add keyboard navigation state + handlers**

```tsx
// Add after visibleCount:
const [selectedIndex, setSelectedIndex] = useState(-1);
```

```tsx
// Add before return:
const visibleRepos = sorted.slice(0, visibleCount);

function handleKeyDown(e: React.KeyboardEvent) {
  if (selectedRepo) return;
  switch (e.key) {
    case "ArrowDown":
    case "j":
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, visibleRepos.length - 1));
      break;
    case "ArrowUp":
    case "k":
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
      break;
    case "Enter":
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < visibleRepos.length) {
        setSelectedRepo(visibleRepos[selectedIndex].slug);
      }
      break;
    case "Escape":
      e.preventDefault();
      setSelectedIndex(-1);
      break;
  }
}
```

```tsx
// Reset selection when search/visibleCount changes:
useEffect(() => {
  setSelectedIndex(-1);
}, [search, visibleCount]);
```

- [ ] **Step 4: Wire keyboard handler + highlight class in JSX**

```tsx
// Change the sorted list container div to include onKeyDown:
<div onKeyDown={handleKeyDown}>
```

```tsx
// Apply highlight to selected RepoCard wrapper:
<div
  role="button"
  tabIndex={0}
  className={`flex items-center gap-3 py-2.5 px-2 hover:bg-positive/[0.03] transition-colors cursor-pointer border-b border-border last:border-b-0 ${
    i === selectedIndex ? "bg-accent/[0.04] border-l-2 border-l-accent pl-[6px]" : ""
  }`}
  onClick={() => { setSelectedRepo(repo.slug); setSelectedIndex(i); }}
>
```

- [ ] **Step 5: Handle nullable gained in RepoList gained7d calc**

```tsx
// Line 133-137 — gained7d uses nullable stars_gained:
const gained7d =
  repo.stars_gained !== null && repo.history.length >= 8
    ? repo.history[repo.history.length - 1].stars -
      repo.history[repo.history.length - 8].stars
    : null;
```

```tsx
// Pass gained7d to RepoCard — update the prop to accept null
```

- [ ] **Step 6: Verify build**

Run: `npm run build && npm test`

---

### Task 3: Data Pipeline (Zod + ISR + Token + README)

**Files:**

- Modify: `scripts/fetch-repos.ts`
- Modify: `package.json`
- Modify: `.github/workflows/fetch.yml`
- Modify: `app/repo/[slug]/page.tsx`
- Modify: `app/page.tsx`
- Modify: `app/daily/page.tsx`
- Modify: `app/weekly/page.tsx`
- Modify: `app/monthly/page.tsx`
- Modify: `README.md`

- [ ] **Step 1: Add zod dependency**

Run: `npm install zod`

- [ ] **Step 2: Add Zod schemas + validate API response in fetch-repos.ts**

```tsx
// At top of scripts/fetch-repos.ts after fs/path imports:
import { z } from "zod";

const GitHubRepoResponse = z.object({
  id: z.number(),
  full_name: z.string(),
  name: z.string(),
  owner: z.object({ login: z.string() }),
  description: z.string().nullable(),
  language: z.string().nullable(),
  html_url: z.string(),
  stargazers_count: z.number(),
  created_at: z.string(),
});

const GitHubSearchResponse = z.object({
  items: z.array(GitHubRepoResponse),
});

// In fetchTopRepos, after const data = await githubFetch(...):
const parsed = GitHubSearchResponse.safeParse(data);
if (!parsed.success) {
  console.error(
    "GitHub API response validation failed:",
    parsed.error.format(),
  );
  throw new Error("Invalid GitHub API response shape");
}
return parsed.data.items.slice(0, count);
```

- [ ] **Step 3: Update workflow token name**

Change `.github/workflows/fetch.yml` line 21:

```yml
GITHUB_TOKEN: ${{ secrets.PAT_TOKEN }}
```

- [ ] **Step 4: Add ISR revalidate = 3600 to all pages**

```tsx
// app/repo/[slug]/page.tsx line 11: change to
export const revalidate = 3600;

// app/page.tsx: add after imports
export const revalidate = 3600;

// app/daily/page.tsx: add after imports
export const revalidate = 3600;

// app/weekly/page.tsx: add after imports
export const revalidate = 3600;

// app/monthly/page.tsx: add after imports
export const revalidate = 3600;
```

- [ ] **Step 5: Add workflow status badge to README**

```markdown
[![fetch status](https://github.com/OWNER/REPO/actions/workflows/fetch.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/fetch.yml)
```

- [ ] **Step 6: Verify build**

Run: `npm run build && npm test`
