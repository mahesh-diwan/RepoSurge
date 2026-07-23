# Amber CRT Redesign — RepoSurge

> **Goal:** Transform RepoSurge from green terminal-brutalist to full retro-futuristic amber CRT terminal. Dashboard cards replace flat rows. Scanlines, vignette, glow, CRT frame.

## Visual Identity

### Palette

| Token           | Hex       | Usage                                   |
| --------------- | --------- | --------------------------------------- |
| `amber-bg`      | `#1A1200` | Page background, CRT interior           |
| `amber-primary` | `#FFB000` | Primary text, accents, glow base        |
| `amber-dim`     | `#CC8800` | Dim/secondary text                      |
| `amber-muted`   | `#8B6914` | Borders, muted text, inactive elements  |
| `amber-bright`  | `#FFD040` | Highlights, positive gain, hover states |
| `amber-crt-bg`  | `#0D0900` | Outer CRT bezel (near-black)            |

### CRT Effects (Full Retro)

- **Scanlines:** `repeating-linear-gradient` overlay, 1.5px cycle, pointer-events:none, z-index above content
- **Vignette:** `radial-gradient` overlay, darkens edges to 40% opacity
- **Text glow:** 2-3 stacked `text-shadow` layers (small + medium + large blur)
- **CRT monitor frame:** Outer `border-radius: 16px`, thick border in `#8B6914`, inset shadow, outer `box-shadow` amber bloom
- **Boot animation:** `@keyframes crt-sweep` — a horizontal line (1px tall, amber, width 0→100%) sweeps top-to-bottom across the frame over 0.6s, then fades out. Plays once on `DOMContentLoaded`. Uses `::before` pseudo-element on the frame container. Respects `prefers-reduced-motion: reduce` (no sweep).
- **Responsive:** `prefers-reduced-motion: reduce` disables glow animation, boot sweep, scanlines persist but don't animate

### Typography

- JetBrains Mono (existing, via `next/font`) — kept
- Terminal sizing: `text-[10px]` through `text-7xl` hero
- `tabular-nums` on all numeric data
- `tracking-wider` on nav, `tracking-tighter` on hero headings

## Layout

### Page Chrome

The entire main content area wraps inside a CRT monitor frame:

```
┌─ CRT Monitor Frame (rounded 16px, amber border) ─┐
│                                                    │
│  ~ REPOSURGE ~                        period: day  │
│  ─────────────────────────────────────────────     │
│                                                    │
│  [Dashboard Cards × N]                             │
│                                                    │
│  ─────────────────────────────────────────────     │
│  15 repos · 2.5M ★ · data: github api             │
│                                                    │
└────────────────────────────────────────────────────┘
```

- Frame applied to `#main-content` via wrapper div or layout CSS
- Scanlines + vignette inside the frame only (not on the bezel)
- Outer page background `#0D0900` (darker, CRT bezel color)

### Dashboard Cards

Each repo renders as a bordered card with:

```
┌─ repo card ──────────────────────────────────────┐
│ #1  graphify-labs/graphify    🦀 Rust    [+284]  │
│  ▂▃▄▅▆▇██████▇▆▅▄▃▂  (amber glow sparkline)       │
│  12.4k ★  ·  +2.1k / 7d                          │
└───────────────────────────────────────────────────┘
```

**Card structure:**

- `background: rgba(255,176,0,0.03)` (subtle amber tint)
- `border: 1px solid rgba(139,105,20,0.3)` (amber-muted at 30%)
- `padding: 10px 14px`, `border-radius: 2px` (nearly flat — CRT doesn't do round)
- Hover: `background` lightens, glow increases, cursor pointer

**Row 1 (header):** Rank (#1, #2...) in amber-muted, repo name in amber-primary with glow, language badge in amber-muted, gained delta in amber-bright with glow (positive) or amber-dim (zero/negative)

**Row 2 (sparkline):** 7-bar glow gradient divs, height proportional to value, amber gradient from 30%→10% opacity, peak bar gets `box-shadow` glow

**Row 3 (stats):** Total stars + 7d gain, amber-muted, `font-size: 10px`

**Responsive:**

- `< md`: sparkline row hidden, language badge hidden, card compresses to header + stats
- `< sm`: 7d gain hidden, only rank + name + gained visible

## Data Needs

### Language

`repos.json` currently lacks language data. Approach: add `language` field to each repo entry in `repos.json`. Values determined manually from known repo tech stacks (e.g., `"Rust"`, `"Python"`, `"TypeScript"`, `"Go"`, `"JavaScript"`). Displayed as inline text next to repo name (e.g., `Rust`). Text only — consistent monospace rendering, no emoji dependency.

### 7d Gain

Already computable from existing 90-entry history in `repos.json`. Compute: `history[latest].stars - history[latest - 7].stars`. Add as `gained7d` field returned by `getRepoDetails()` in `lib/db.ts`, or compute inline in the card component.

## Components

| File                             | Action    | Description                                                      |
| -------------------------------- | --------- | ---------------------------------------------------------------- |
| `tailwind.config.ts`             | Modify    | Add amber palette colors, CRT keyframes                          |
| `app/layout.tsx`                 | Modify    | Wrap `#main-content` in CRT frame, update bg to bezel color      |
| `app/globals.css`                | Modify    | Remove green theme remnants, add CRT scanlines/vignette/glow CSS |
| `components/RepoCard.tsx`        | Rewrite   | New card layout with sparkline + language + 7d gain              |
| `components/RepoList.tsx`        | Modify    | Update imports, remove table-like markup                         |
| `components/Header.tsx`          | Modify    | Amber color tokens                                               |
| `components/PeriodNav.tsx`       | Modify    | Amber color tokens                                               |
| `components/NavLinks.tsx`        | Modify    | Amber color tokens                                               |
| `components/MobileNav.tsx`       | Modify    | Amber color tokens                                               |
| `components/LeaderboardInfo.tsx` | Modify    | Amber color tokens                                               |
| `components/ScrollReveal.tsx`    | No change | Already generic                                                  |
| `components/SearchInput.tsx`     | Modify    | Amber focus tokens                                               |
| `components/StarChart.tsx`       | Modify    | Amber gradient bars                                              |
| `components/LastUpdated.tsx`     | Modify    | Amber color tokens                                               |
| `app/page.tsx`                   | No change | Already uses components                                          |
| `app/repo/[slug]/page.tsx`       | Modify    | Amber tokens, sparkline type                                     |
| `src/content/repos.json`         | Modify    | Add `language` field to each repo entry                          |
| `lib/db.ts`                      | Modify    | Optionally add `gained7d` to repo detail data                    |

## Acceptance Criteria

1. **Visual:** Page renders in amber CRT style — scanlines, vignette, glow, CRT frame visible
2. **Cards:** Each repo renders as a card with rank, name, language, gained, sparkline, 7d gain
3. **CRT effects:** Scanlines + vignette overlay present, glow on interactive elements, CRT frame border
4. **Boot animation:** Sweep line plays once on load
5. **Reduced motion:** `prefers-reduced-motion` disables animated effects
6. **Responsive:** Cards compress at `md` and `sm` breakpoints without overflow
7. **Language data:** Each repo in `repos.json` has a `language` field
8. **Build:** `npm run build` succeeds (11/11 pages)
9. **Tests:** `npm test` passes (9/9 tests)
10. **No regressions:** Search, sort, period nav, mobile nav, live polling all work
11. **Color tokens:** No `#00FF41` or `text-terminal` / `bg-terminal` references remain in component code (migrated to amber equivalents)

## Out of Scope

- GitHub API integration for live language data (manual field in `repos.json`)
- Star History chart as interactive SVG (sparkline bars kept)
- Compare mode
- Advanced filters beyond existing search
- Detail page rich redesign (token updates only, keep existing layout structure)
