# Leaderboard Legend, Robustness & Polish

## Goal

Improve RepoSurge homepage with inline documentation (legend + tooltips), better error handling, and visual polish — all within terminal-brutalist design system.

## Changes

### 1. Homepage Legend (new `components/LeaderboardInfo.tsx`)

Compact info line below hero stats bar:

```
15 repos ranked by stars gained this week. # rank · gained stars earned · sparkline trend · ● live from github
```

- Server component, no client JS
- Matches `text-dim text-xs` style
- Wrapped in ScrollReveal for consistency

### 2. Tooltips (`title` attributes)

Add `title` to interactive elements explaining what they do:

- Sort `#` → "sort by rank"
- Sort `repo` → "sort alphabetically"
- Sort `gained` → "sort by stars gained"
- Gained value → "stars earned this period"
- Live dot → "live data: polling github api every 60s"
- Period nav links → "view [daily/weekly/monthly] leaderboard"
- Sparkline container → "star history across this period"

### 3. API Expansion (`app/api/star-counts/route.ts`)

Add 4 missing repos to the polling list:

- `trycua/cua`, `ibelick/ui-skills`, `codecrafters-io/build-your-own-x`, `shadcn-ui/ui`

### 4. Error States (`lib/useLiveStars.ts`, `components/RepoList.tsx`)

- `useLiveStars` returns `error` string in addition to `starsMap`/`live`
- `RepoList` shows error banner when API fails: `"live data unavailable — showing cached data"` with retry button
- Banner style: `text-dim` with `border-terminal/20`, dismissable
- Loading skeleton: `animate-pulse` green bars replacing StarChart while first poll completes

### 5. Beauty Polish

- **Stat symbols**: Header stats bar shows ★ (stars), ⚡ (velocity), ⊞ (languages) instead of plain text
- **Section dividers**: `border-terminal/5` rule between hero/info/data sections
- **Refined gained**: `+1,234 ★` format with star symbol suffix
- **Refined nav**: Current period pill gets subtle `border-terminal/30` border
- **Footer**: "last fetch" instead of "refreshed daily" to match actual behavior

## Files Touched

- `components/LeaderboardInfo.tsx` — new
- `components/RepoList.tsx` — error banner, loading state
- `components/RepoCard.tsx` — tooltips, gained format
- `components/StarChart.tsx` — tooltip
- `components/PeriodNav.tsx` — tooltips, active border
- `components/Header.tsx` — stat symbols
- `components/SearchInput.tsx` — tooltip
- `lib/useLiveStars.ts` — error state
- `app/api/star-counts/route.ts` — add 4 repos
- `app/layout.tsx` — footer text
- `app/page.tsx` — import LeaderboardInfo

## Verification

- Build 11/11
- Tests 9/9
- All 15 repos show live polling
- Error banner renders when API fails
