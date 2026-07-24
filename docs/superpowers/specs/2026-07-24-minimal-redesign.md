# RepoSurge Minimal Redesign Specification

> **Product:** RepoSurge — GitHub repo star velocity tracker
> **Date:** 2026-07-24
> **Status:** Spec

## Overview

Complete visual redesign from CRT amber aesthetic to a clean, minimal dark theme inspired by opencode.ai. Replace the heavy CRT monitor frame, scanlines, and vignette with a modern dark interface featuring a floating nav pill, hero with description, horizontal repo table, and slide-out detail panel with robust sparklines.

## User Stories

- **As a visitor**, I want to understand what RepoSurge does from the homepage hero
- **As a developer**, I want to quickly scan repo rankings, see star growth trends, and drill into a repo for more detail
- **As a mobile user**, I want a clean, scrolling experience that works at small viewports
- **As a power user**, I want to filter repos and understand sparkline data (min/max, trends, daily values)

## Requirements

### Visual Design

- **Theme:** Clean dark background (#0A0A0A or similar very dark), amber primary (#FFB000), white text (#F5F5F0), muted text (#8B6914), minimal surface colors (#1A1200 for cards/panels)
- **Font:** Keep JetBrains Mono (consistent with existing code)
- **No CRT effects** — remove `.crt-frame`, `.crt-sweep`, `.amber-glow`, scanlines, vignette entirely
- **Subtle borders** with reduced opacity (`opacity/15` or `/20`) for section separation
- **Rounded corners** on interactive elements (`rounded-lg` or per-component)
- **Consistent spacing** using Tailwind spacing scale

### Floating Nav Pill

- Fixed position centered at top
- `rounded-xl` (slightly squared with rounded borders as user requested — NOT pill-shaped fully)
- `bg-amber-bg/80` with `backdrop-filter: blur(12px)`
- `border border-amber-primary/20` with subtle `shadow`
- Contains: "RS" logo (or full name) + `home` + `about` links, compact
- Mobile: same pill but logo on left, hamburger on right

### Hero Section

- Large heading: `REPOSURGE` (no Ø gimmick, just clean text)
- 2-line description under heading: "Track GitHub repo velocity in real-time. See which projects are rising fastest, compare star growth, and discover trending repos at a glance." (or similar)
- Stats row: `15 repos · 2.5M stars · 4 languages · updated 20m ago`
- Centered layout, generous spacing

### Search / Filter

- Centered pill between hero and repo list
- `rounded-lg` with `border-amber-muted/20`, `bg-[#1A1200]`
- Prefix `/>` prompt, placeholder `search repos...`
- Keyboard shortcut hint `⌘K` at right
- On mobile: full width, no ⌘K hint

### Repo Table

- Horizontal layout (not stacked cards): `#` | `repo` | `language` | `sparkline` | `gained` | `stars`
- Column headers with sort (current sort behavior preserved)
- Row hover: subtle `bg-amber-primary/5` background
- Sparkline inline in table row (~80px wide, 24px tall)
- Language as text badge (no bg)
- Responsive: hide sparkline at `<md`, hide language at `<sm`

### Sparklines (Robust)

- Always show relative to period range (min → max)
- Y-axis labels: min value left, max value right below bars
- `title` attribute per bar with date and value (hover tooltip)
- Trend indicator: `↑ trending up` / `↓ trending down` below bars
- Color: amber gradient, height proportional to value within visible range
- 7 bars for week period, 3 for day, 14 for month

### Slide-out Panel (Repo Click)

- Click any repo row → panel slides from right edge
- Panel width: `w-80` on mobile, `w-96` on desktop
- `bg-[#1A1200]` with `border-l border-amber-primary/20`
- Contains:
  - Close button (✕) top right
  - Rank number + repo name
  - Language badge
  - Description (from repos.json)
  - Stats grid: stars, gained, 7d gain, created date
  - Inline sparkline (same robust format, slightly larger: h-24)
  - `view on github →` button (amber bg, dark text, target=_blank)
  - `close` button (outlined)
- Backdrop: `bg-black/50` behind panel
- Close on: ✕ click, backdrop click, Escape key
- Focus trap when panel is open

### Page Transitions

- Keep `/repo/[slug]` page as an alternative way to view repo details (bookmarkable)
- Slide-out panel is the primary interaction from homepage
- `/repo/[slug]` detail page simplified (remove CRT frame, update to new theme)

### Mobile

- Slide-out panel becomes full-screen overlay on mobile
- Table collapses: `# repo gained` columns only, sparkline hidden
- Nav pill shrinks: "RS" + hamburger

### Data Fixes

- Verify all 15 repos have valid `url` fields in repos.json
- Ensure `getRepoDetails()` returns `description` and `url` correctly

## Non-Goals

- No real-time polling UI changes
- No new API endpoints
- No testing infrastructure changes
- No dark/light mode toggle
- No SSR streaming changes

## Edge Cases

- Empty search: show "no repos match" message (existing)
- Loading state: existing skeleton is fine
- Error state: existing error banner ok, keep as-is
- Very long repo name: truncate with `...` and `title` tooltip
- Panel open + resize: close panel on viewport resize to avoid layout breakage

## Architecture

### Component Changes

| Component                        | Action                                                                                                                                                              |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`                 | Remove CRT frame wrapper (`crt-frame`, crt-sweep), remove amber-glow-sm from logo, simplify body classes, remove `.superpowers/brainstorm/` refs                    |
| `app/globals.css`                | Remove `.crt-frame`, `.crt-sweep`, `.amber-glow`, `.amber-glow-sm`, scanlines, vignette entirely. Keep focus-visible in amber, keep reduced-motion, keep base layer |
| `tailwind.config.ts`             | Remove `crt-sweep` keyframe + animation. Remove old color aliases (`terminal`, `midnight`, `bone`, `dim`). Keep amber palette only                                  |
| `components/Header.tsx`          | Rewrite: centered layout, heading + 2-line description + stats row. Remove amber-glow-sm on heading. Remove Ø dead-pixel                                            |
| `components/RepoCard.tsx`        | Rewrite as horizontal table row — remove card layout (no bg-amber-bg/30, no border, no px-3 py-2.5). Inline sparkline, inline language badge                        |
| `components/RepoList.tsx`        | Add `selectedRepo` state + slide-out panel rendering. RepoCard click sets selectedRepo. Search moved to top center. Error banner preserved                          |
| `components/SearchInput.tsx`     | Update styling: `rounded-lg`, centered, `⌘K` hint text at right                                                                                                     |
| `components/NavLinks.tsx`        | Styling update for floating pill (remove pill-bg colors, simpler)                                                                                                   |
| `components/MobileNav.tsx`       | Styling update for floating pill integration                                                                                                                        |
| `components/LeaderboardInfo.tsx` | **Delete** — replaced by hero description in Header                                                                                                                 |
| `components/StarChart.tsx`       | Add y-axis labels (min/max), trend indicator (`↑`/`↓`), `title` attr per bar. 24px default height inline                                                            |
| `components/Panel.tsx`           | **Create** — slide-out panel: repo info, stats grid, inline sparkline h-24, GitHub button, close button                                                             |
| `app/page.tsx`                   | Remove LeaderboardInfo, adjust layout (header → search → repo list, no PeriodNav shown at top — kept accessible via other means)                                    |
| `app/repo/[slug]/page.tsx`       | Simplify styling, remove CRT remnants, use updated SparkChart with labels                                                                                           |

### Data Flow

1. Homepage loads → `getRepos("week")` → renders table
2. Sort/filter purely client-side (existing)
3. Click repo row → open `Panel` with full repo data from the sorted list
4. Panel shows sparkline, description, stats, GitHub link
5. Escape/close → panel hides, focus returns to table row

### Testing

- Existing tests should pass (db.ts unchanged, Sparkline UI changes only)
- Visual regression: manual verification of nav, panel, table, sparklines

---

## Success Criteria

- Build: 11/11 pages
- Tests: 9/9 passing
- No CRT CSS remnants (scanlines, crt-frame, crt-sweep, amber-glow classes)
- Slide-out panel opens/closes correctly on all 15 repos
- GitHub link works for all 15 repos in panel
- Sparklines show axis labels and hover values
- Floating nav pill renders correctly at top, fixed position
- Mobile: table usable, panel full-screen, hamburger works
