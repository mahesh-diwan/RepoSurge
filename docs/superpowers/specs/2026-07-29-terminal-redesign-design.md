# Terminal Redesign — RepoSurge

## What

Redesign RepoSurge as a terminal-inspired data dashboard with a curated digest layer. Replace the current list/grid interface with a data-dense comparison table, floating pill navigation, stats bar, and distinctive typography (Chivo + Fragment Mono). Redesign the about page as a stats dashboard.

## Why

The current design is clean but generic — one of many "dark premium" dashboards. A terminal aesthetic differentiates, attracts power users, and makes the data feel more immediate and serious. The digest layer adds daily-visit hooks without the content burden of a full editorial approach.

## Changes

### 1. Navigation — Floating Pill

Replace the current full-width `RS` header + hamburger with a centered floating pill:

```
┌──────────────────────────────────┐
│  [RS]    home   about   compare  │
└──────────────────────────────────┘
```

- Fixed at top, `bg-surface`, `border border-white/[0.06]`, `rounded-full`
- `[RS]` in Fragment Mono (brand wordmark), amber `#D97706`
- Links in Chivo, `text-text-muted`, active state amber underline
- On mobile: same pill, hamburger icon slides out a MobileNav overlay (keep existing MobileNav component)

### 2. Typography — Chivo + Fragment Mono

| Role         | Font          | Details                            |
| ------------ | ------------- | ---------------------------------- |
| Body / UI    | Chivo         | 400/500 weight, 12-14px            |
| Labels / nav | Chivo         | 500 weight, 11px, `tracking-wider` |
| Table data   | Fragment Mono | 400 weight, 11px, all cells        |
| Stats values | Fragment Mono | 700 weight, 18px                   |
| Brand `[RS]` | Fragment Mono | 700 weight, 14px, amber            |

Install `@fontsource/chivo` (400, 500, 700 weights) and `@fontsource/fragment-mono` (400 weight). Factor out JetBrains Mono (Fragment Mono replaces it).

### 3. Homepage Layout

Top-to-bottom structure:

1. **Floating pill nav** (fixed, z-50)
2. **Stats bar** — 4-card grid: `TOTAL REPOS | TOTAL STARS | LANGUAGES | TOTAL GAINED`
   - Values from `getStats()` (repos/stars/languages) + computed total gained (sum of all `stars_gained` across repos — needs addition to `getStats()`)
   - Fragment Mono values, Chivo labels
3. **Period toggle** — same daily/weekly/monthly (active: bg-accent)
4. **Weekly highlight callout** — single amber-accented row: "this week's top gainer: **repo** (+N stars, ▲N positions)". Clickable → opens detail panel. Below period toggle, above filters.
5. **Filters** — language pills + min-stars input + search (same as current)
6. **Comparison table** — grid layout replacing the list/grid toggle:
   ```
   REPO         | STARS    | GAINED    | VELOCITY | Δ RANK
   ─────────────┼──────────┼───────────┼──────────┼───────
   skills       | 193.1K   | +5,867    | 31       | ▲28
   superpowers  | 262.8K   | +2,058    | 8        | ▲14
   ```
   - All cells Fragment Mono
   - Headers sortable (click to toggle asc/desc)
   - "hot" 🔥 prefix on repos with gained > 1000
   - "export data ↓" link top-right of table — downloads table as CSV (name, stars, gained, velocity, rankChange columns)
   - Row click → opens Panel with RepoDetail (same as current)
7. **Removed**: grid/list toggle, column visibility dropdown, header subtitle, `?` help text auto-dismiss

### 4. About Page

Replace current 3-section text with a stats dashboard:

```
┌──────────────────────────────────┐
│  ABOUT REPOSURGE                  │
│  star velocity tracker for github │
│  ┌──────┐ ┌──────┐ ┌──────┐     │
│  │ 50   │ │12.4M │ │ 8    │     │
│  │ repos│ │stars │ │langs │     │
│  └──────┘ └──────┘ └──────┘     │
│  velocity = (gained / baseline)  │
│  × 1000                          │
│  Data: GitHub API · refreshed    │
│  daily                           │
│  Stack: Next.js · React · Tailwind│
│  Fonts: Chivo + Fragment Mono    │
└──────────────────────────────────┘
```

- Stats cards from `getStats()` + computed total gained
- Remove ScrollReveal animation (doesn't fit terminal tone)
- Remove `max-w-2xl` constraint (full width feels more dashboard-like)

### 5. Digest Features (audience layer)

Five small additions on top of the Terminal core:

1. **Weekly highlight callout** — single row above table, amber-bordered card, shows top gainer for current period
2. **Category tags** — maintained as filter chips between stats bar and table (same as current language pills)
3. **Period toggle** — kept unchanged
4. **🔥 hot indicator** — emoji prefix on repos with gained > 1000
5. **Export CSV** — downloads table data as `.csv` file

### 6. What stays unchanged

- Tooltip, Toast, LoadingSkeleton, ErrorBoundary, ShortcutsModal
- Panel + RepoDetail (side panel with stats grid + StarChart)
- RepoCard (used as table row in list view — rename to RepoTableRow)
- Data layer (`lib/db.ts`), `lib/gained-color.ts`
- Dark theme, amber accent, green/negative colors
- All routes, middleware

## Files to Change

| File                       | Change                                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `package.json`             | Remove `@fontsource/outfit`, add `@fontsource/chivo` + `@fontsource/fragment-mono`                                                               |
| `app/layout.tsx`           | Replace Outfit imports with Chivo + Fragment Mono. Update CSS variable. Remove inline `--font-geist` style.                                      |
| `tailwind.config.ts`       | Update `fontFamily.sans` → Chivo, `fontFamily.mono` → Fragment Mono                                                                              |
| `app/globals.css`          | Remove `text-wrap: pretty`, update `.data-mono` if needed                                                                                        |
| `app/page.tsx`             | Add stats bar + highlight callout above RepoList. Pass stats data.                                                                               |
| `app/about/page.tsx`       | Full rewrite — stats cards + explanation                                                                                                         |
| `components/Header.tsx`    | Remove header subtitle, simplify                                                                                                                 |
| `components/RepoList.tsx`  | Replace list/grid with comparison table. Remove grid/list toggle. Remove column visibility. Add export. Add 🔥 indicator. Add highlight callout. |
| `components/NavLinks.tsx`  | Keep for desktop nav inside pill                                                                                                                 |
| `components/MobileNav.tsx` | Keep for mobile hamburger inside pill                                                                                                            |
| `components/RepoCard.tsx`  | Rename or adapt as table row renderer                                                                                                            |
| `app/not-found.tsx`        | Already updated, keep                                                                                                                            |

## Not Changing

- Data model (`lib/db.ts`, `data/repos.json`)
- Panel, RepoDetail, StarChart, Tooltip, Toast, ShortcutsModal, LoadingSkeleton, ErrorBoundary
- Route structure, middleware, sitemap
- Color palette (midnight/surface/amber/green/red)
