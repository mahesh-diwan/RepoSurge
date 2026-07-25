# RepoSurge: Robustness, Features & Data Precision

**Date:** 2026-07-25
**Status:** Draft

## Scope

Three parallel workstreams:

1. **Robustness** — data pipeline hardening, validation, failure recovery
2. **Features** — pagination, keyboard navigation, sortable stars column
3. **Data Precision** — decimal velocity, missed-day detection, better zero-state

## 1. Pagination

### Behavior

- Initial render: first 50 repos
- "Show 50 more" button at bottom of list
- Button disappears when all repos loaded
- No URL query param — purely client-side state
- Resets to 50 when search filter changes
- State: `visibleCount` in `RepoList`, incremented by 50 on click
- Works with all sort modes (default, name, gained)

### Components

- `RepoList.tsx` — add `visibleCount` state + load-more button
- No new components

### Edge Cases

- Filtered result < visible count → no button shown
- Search + pagination: filter runs on full list, then slice to `visibleCount`
- Sort + pagination: sorted list is sliced, not the other way around

## 2. Keyboard Navigation

### Behavior

- j/k (vim-style) + Up/Down arrows move a selection highlight through visible repo cards
- Enter opens the detail Panel for the selected repo
- Escape closes the Panel
- Selection resets when search changes or pagination loads
- Visual: `.bg-accent/5` background or left border on selected row
- Works only when Panel is closed (no double-binding Escape)

### Implementation

- `selectedIndex` state in `RepoList`
- `onKeyDown` handler on the sorted list container
- Highlight class applied to the selected `RepoCard` wrapper
- Card also clickable (existing behavior)

### Edge Cases

- Selection wraps? No — clamp at 0 and `visibleCount - 1`
- Empty filter results → no-op
- Panel open ignores list key events
- Mouse hover does not affect selection

## 3. Stars Sort

### Behavior

- "stars" column header becomes a sort button (currently static `<div>`)
- Toggles asc/desc like other sortable columns
- `^` / `v` arrow indicator after label
- Default sort (no key) remains by gained

### Implementation

- Add `"stars"` to the `SortKey` union type
- Add sort handler logic for stars
- Change the static `<div>` to a `<button>` matching the pattern of #/repo/gained

## 4. Decimal Velocity

### Behavior

- When velocity < 10: show 1 decimal place (e.g. `4.2`)
- When velocity >= 10: show integer (existing behavior)
- Applies in RepoCard, RepoDetail, and Panel

### Implementation

- Format function `formatVelocity(n: number): string`
- n < 10 → `n.toFixed(1)`, else `Math.round(n).toString()`

## 5. Missed-Day Handling

### Behavior

- Velocity window: 7 days (daily), 7 days (weekly), 30 days (monthly)
- If most recent history entry's age > 48h from the entry before it, flag the window as invalid
- Show `—` for velocity and gained instead of stale data
- Display a small warning: "data gap detected"

### Implementation

- In `db.ts` `getRepos()`: after filtering history to window, check consecutive timestamps
- If gap > 48h exists: set `stars_gained = null`, `velocity = null`
- `RepoCard` / `RepoDetail`: handle null display with `—`

## 6. Zod Validation

### Dependency

- Add `zod` to `dependencies` (not devDependencies — used at runtime in fetch script)

### Schema

```typescript
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

const RepoRecordSchema = z.object({
  full_name: z.string(),
  name: z.string(),
  owner: z.string(),
  description: z.string().nullable(),
  language: z.string().nullable(),
  url: z.string(),
  stars: z.number(),
  created_at: z.string(),
  fetched_at: z.string(),
  history: z.array(
    z.object({
      stars: z.number(),
      recorded_at: z.string(),
    }),
  ),
});
```

### Error Handling

- Validation failure logs the API response + error details, then exits non-zero
- GitHub Action receives exit code 1 → fails the workflow → notification sent

## 7. ISR Tuning

- `app/repo/[slug]/page.tsx`: `revalidate = 3600` (was 86400)
- `app/page.tsx` and period pages: `revalidate = 3600`

## 8. GITHUB_TOKEN

- Update `fetch.yml` to use `secrets.PAT_TOKEN` instead of `secrets.GITHUB_TOKEN`
- Document: user must create a personal access token with `public_repo` scope and add it as `PAT_TOKEN` in repo secrets

## 8b. History Reset

Stale data from July 8 had fabricated star counts (e.g. `vercel/next.js` at 527K, real is 141K). When fresh fetch merged with old history, charts showed impossible star decreases.

**Fix:** Cleaned all history entries (507 repos now have 1 entry from today). Cron will build accurate history over time. Fetch script already handles: new repos get 1 entry, existing repos append.

## 9. Language Accuracy

### Root Cause

- Fetch script only set `language` for new (not existing) repos. Stale data kept wrong or outdated values.
- Null-language repos (awesome lists, docs) showed as blank in the card row, creating a visual gap.

### Fixes

- Fetch script: always update `language` from API response for existing repos
- UI: show `—` for null language in RepoCard, hide badge in RepoDetail (already fine)

## Non-Goals

- Live WebSocket updates (already exists, not changing)
- Topics/tags from GitHub (deferred — data available but need UI design)
- Period tabs on main page (deferred — separate routes work)
- Virtual scrolling (deferred — load-more is simpler, revisit if performance becomes an issue)
- Vercel auto-deploy setup (out of scope — user action)

## Files Changed

| File                          | Change                                     |
| ----------------------------- | ------------------------------------------ |
| `components/RepoList.tsx`     | Pagination, keyboard nav, stars sort       |
| `components/RepoCard.tsx`     | Null-handling for velocity/gained          |
| `components/RepoDetail.tsx`   | Decimal velocity display                   |
| `components/Panel.tsx`        | Decimal velocity display                   |
| `lib/db.ts`                   | Nullable velocity/gained, missed-day check |
| `scripts/fetch-repos.ts`      | Zod validation, PAT token, language update |
| `components/RepoCard.tsx`     | Null language `—`, null gained/velocity    |
| `.github/workflows/fetch.yml` | Token secret name                          |
| `app/repo/[slug]/page.tsx`    | ISR revalidate → 3600                      |
| `package.json`                | Add `zod`                                  |
| `README.md`                   | Badge for manual workflow trigger          |

## Risk

- Zod adds ~20KB to the fetch runner (not user-facing, no impact on bundle)
- Nullable velocity/gained types flow through to UI — need to check every render path
- Keyboard nav must not interfere with search input or PeriodNav
