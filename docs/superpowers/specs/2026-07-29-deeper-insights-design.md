# Deeper Insights — RepoSurge Data Depth & Presentation

> Terminal dashboard with richer data columns, sparklines, categories, comparison, and content expansion.

## Core Principles

1. No bloat — every addition is one column, one badge, or one filter
2. Pure math on existing history — no new data sources
3. Static-first — everything compiles at build time
4. Each addition independently deployable

## 1. New Data Columns

Three new computed fields in the comparison table, derived from existing history:

| Column       | Computation                                                                                                                                                    | Display                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| **vs LAST**  | `stars_gained[current_period] - stars_gained[previous_period]`                                                                                                 | `+2,312` (green) or `-589` (red)        |
| **ACCEL**    | `velocity / previous_velocity` (ratio), or null if previous_velocity = 0                                                                                       | `▲1.4x` (accel) / `▼0.7x` (decel) / `—` |
| **FORECAST** | Linear least-squares on recent history points → slope. `days_to_target = (target_stars - current_stars) / slope`. Next milestone = next 1K/10K/100K threshold. | `200K ~7d` or `—` if insufficient data  |

All live in `lib/db.ts` as new fields on `RepoWithVelocity`. Sortable via the existing `handleSort` mechanism.

## 2. Mini Sparklines Inline

One `<svg>` per row, 50px wide, 14px tall, placed as rightmost column (hidden on mobile). Same design as before: single `<path>` in amber `rgba(217,119,6,0.3)` across recent N data points.

## 3. Sticky Repo Name Column

CSS `position: sticky; left: 0; z-index: 2; bg-midnight` applied to the repo name `<span>` in each table row, and the header row's repo `<button>`. Only at the `sm:` breakpoint and above. Keeps the repo name visible during horizontal scroll.

## 4. "New This Period" Badge

Small `● NEW` amber dot next to repo name for repos that weren't in the previous fetch. Detection:

- `fetch-repos.ts`: after reading existing `repos.json`, compute a `Set` of known `full_name` values before fetching. After fetching, compare — any repo whose `full_name` wasn't in the old set gets `isNew: true`.
- `db.ts`: pass `isNew` through `RepoWithVelocity`
- `RepoList.tsx`: show `● NEW` in amber next to the repo name

## 5. Remove the 25-Cap

- `getRepos(period)`: remove the `.slice(0, 25)` call
- `RepoList.tsx`: change `sorted.slice(0, 25)` to `sorted.slice(0, showAll ? sorted.length : 25)` with a "show all N repos" toggle button at the bottom
- Stats bar already uses all repos — no change

## 6. Category Collections

Auto-tag repos by keyword matching on description/topics:

- `fetch-repos.ts`: define a map of `{ category: [keywords] }` (e.g., `ai: ["gpt", "llm", "transformer", "neural", "machine learning"]`, `database: ["sql", "database", "db", "postgres", "redis", "mongodb"]`). Match repo `description` (or `topics` when added to the GitHub API call) against each keyword list. First match wins. Store as `category: string | null`.
- `db.ts`: pass `category` through `RepoWithVelocity`
- `RepoList.tsx`: new filter row between language pills and the table — category pills (`#ai`, `#database`, `#devtools`, etc.). Same visual as language pills.

## 7. Comparison Mode

"Compare" checkbox on each table row (visible only when "compare mode" is active). Max 3 selected. Selected repos rendered as overlaid sparklines in a shared mini-chart below the table (or in the Panel).

- State: `compareMode: boolean`, `compareSet: RepoWithVelocity[]`
- Toggle: "compare" button next to "export data ↓"
- Shared chart: `Panel` or inline `<div>`, renders one SVG line per selected repo in different colors (amber, positive, negative)
- Clicking a row still opens detail Panel

## Files to Change

| File                      | Change                                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `lib/db.ts`               | Add `gainedPrev`, `accel`, `forecast`, `isNew`, `category` to `RepoWithVelocity` and `computeAllRepos()` |
| `components/RepoList.tsx` | Add new table columns, sticky name, sparklines, compare mode, 25-cap toggle, category pills              |
| `components/RepoList.tsx` | Add `SortKey` for `gainedPrev`, `accel`, `forecast`                                                      |
| `scripts/fetch-repos.ts`  | Save previous repo set for `isNew` detection, add category keyword matching                              |
| `app/page.tsx`            | Pass `showAll` or remove 25-cap logic                                                                    |

## Decomposition for Parallel Implementation

| Sub-project                              | Files                                         | Independent?                     |
| ---------------------------------------- | --------------------------------------------- | -------------------------------- |
| A. Data depth (vs LAST, ACCEL, FORECAST) | `lib/db.ts`, `RepoList.tsx`                   | Independent                      |
| B. Sparklines + sticky column            | `RepoList.tsx`                                | Independent                      |
| C. "New this period" badge               | `fetch-repos.ts`, `lib/db.ts`, `RepoList.tsx` | Independent (new field addition) |
| D. Remove 25-cap                         | `lib/db.ts`, `RepoList.tsx`                   | Independent                      |
| E. Category collections                  | `fetch-repos.ts`, `lib/db.ts`, `RepoList.tsx` | Independent (new field addition) |
| F. Comparison mode                       | `RepoList.tsx`, optional: `Panel`             | Pure UI, independent             |
