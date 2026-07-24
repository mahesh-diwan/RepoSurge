# Spec: Clean Dark Redesign — Remove Terminal Vibe, Adopt opencode.ai Aesthetics

**Date:** 2026-07-24
**Status:** Draft — awaiting approval
**Derived from:** Branding brainstorm (see brainstorming notes)

## Objective

Remove the terminal/phosphor green aesthetic from RepoSurge. Adopt opencode.ai's clean dark aesthetic: system sans-serif for UI, JetBrains Mono for data only, flat surfaces, indigo accent (`#5B7FFF`), emerald/rose semantic data colors, no glow, no glassmorphism, no terminal metaphors.

## Context

RepoSurge currently uses:

- Amber (`#FFB000`) as primary brand color on dark (`#1A1200`) background
- JetBrains Mono for all text (including prose and labels)
- Glow effects, terminal metaphors, "leaderboard" framing
- Green-themed naming throughout

The user wants the aesthetics to match opencode.ai: clean, dark, minimal, data-focused, professional. The terminal vibe is removed entirely.

## Design Changes

### Color System

| Role               | Old                | New                         |
| ------------------ | ------------------ | --------------------------- |
| Body bg            | `#1A1200`          | `#0A0A0A`                   |
| Surface bg         | `#1A1200`          | `#111111`                   |
| Primary text       | `#F5F5F0` (Bone)   | `#E5E5E5` (Onyx)            |
| Muted text         | `#999999` (Dim)    | `#888888` (Silver)          |
| Brand primary      | `#FFB000` (Amber)  | `#5B7FFF` (Indigo)          |
| Positive data      | `#22D3EE` (Cyan)   | `#34D399` (Emerald)         |
| Negative data      | `text-amber-muted` | `#F87171` (Rose)            |
| Border             | `#1a1a1a`          | `#222222`                   |
| Focus ring         | `#FFB000`          | `#5B7FFF`                   |
| Active nav         | Amber bg           | Indigo text + bottom border |
| Sparkline gradient | Amber → Amber      | Indigo gradient             |

### Typography

- **Headings and body:** System UI sans-serif (`system-ui, -apple-system, sans-serif`)
- **Labels and buttons:** System UI, `500` weight, `11px`-`15px`
- **Data/numbers:** JetBrains Mono only (`13px`, tabular-nums)
- **Removed:** All "terminal" typography references, JetBrains Mono for prose

### Layout Changes

- **Hero:** Clean centered heading + description + install snippet (like opencode.ai)
- **Stats row:** Simple static numbers, no live counter animations
- **Nav:** Minimal top nav, active = indigo text + bottom border (not pill)
- **Rows:** Flat horizontal, alternating subtle bg tints (no cards)
- **Panel:** Slide-out from right, surface background, no shadow

### Component Changes

- **NavLinks:** Remove `bg-amber-primary` active pill. New: `text-accent` + `border-b-2 border-accent`
- **Header/Stats:** Remove live counters. Static numbers only.
- **SearchInput:** Remove amber theming. New: `border-border`, focus = `border-accent`
- **Panel:** Remove `border-l` side stripe, `shadow-2xl`. New: `bg-surface` only
- **Header:** Remove hero gradient/glow. Clean onyx-on-midnight
- **error.tsx / not-found.tsx:** Remove `amber-glow` class, use onyx text color

### Brand Copy Changes

- **Title tag:** "reposurge - clean star velocity" (was "reposurge - repos rising. fast.")
- **Description tag:** "Track and compare GitHub repo star velocity." (was "terminal velocity tracker")
- **Product name:** Keep "RepoSurge" — it has no terminal connotation on its own
- **Hero heading:** "RepoSurge" (same)
- **Hero description:** "Track which GitHub projects are gaining traction. Compare growth rates, spot rising repos, stay ahead." (was terminal-themed)

## Files Modified

| File                         | Change                                                                   |
| ---------------------------- | ------------------------------------------------------------------------ |
| `DESIGN.md`                  | Complete rewrite for clean dark system                                   |
| `PRODUCT.md`                 | Rewrite — remove terminal framing, add clean dark personality            |
| `tailwind.config.ts`         | Remove amber palette, add indigo accent + surface colors                 |
| `app/globals.css`            | Remove amber background, update selection color, remove amber focus ring |
| `components/Header.tsx`      | Remove live stats counters, clean up hero text                           |
| `components/NavLinks.tsx`    | Active = accent text + bottom border                                     |
| `components/SearchInput.tsx` | Border color → `border-border`, focus → `focus:border-accent`            |
| `components/Panel.tsx`       | Remove border-l + shadow, surface bg only                                |
| `components/RepoList.tsx`    | Row bg → alternating surface tints                                       |
| `components/RepoCard.tsx`    | Sparkline → indigo gradient                                              |
| `components/RepoDetail.tsx`  | Stats → inline, remove uppercase eyebrows                                |
| `app/error.tsx`              | Remove amber-glow, onyx text                                             |
| `app/not-found.tsx`          | Remove amber-glow, onyx text                                             |
| `app/layout.tsx`             | bg → midnight, nav → flat no blur                                        |
| `app/page.tsx`               | Ensure hero matches new spec                                             |
| `components/StarChart.tsx`   | Sparkline → indigo gradient                                              |
| `lib/gained-color.ts`        | Negative = `text-negative` (rose) → already done                         |

## Acceptance Criteria

1. Build compiles with 0 errors, 0 TypeScript warnings
2. All tests pass (9/9)
3. No amber (`#FFB000`) or terminal green (`#00FF41`) colors remain in any source file
4. No `backdrop-blur`, `shadow-lg`, `shadow-xl`, `shadow-2xl` on containers
5. No `uppercase tracking-wider` on labels
6. No `amber-glow` or `bg-amber-bg` class references
7. All labels use system font (not JetBrains Mono)
8. All numeric data uses JetBrains Mono
9. Accent color is `#5B7FFF` (indigo) — used on interactive elements only
10. Semantic data colors: emerald for positive, rose for negative
11. DESIGN.md and PRODUCT.md reflect the new clean dark aesthetic
12. No terminal/phosphor/green metaphors in brand copy, comments, or class names

## Open Questions

- Keep install snippet in hero? (opencode.ai pattern) — assumed yes
- Keep `>` prompt in search input? (terminal remnant) — should be removed, replaced with icon or nothing
- Brand name "RepoSurge" — keep or rename? — keep, no terminal connotation
- Keep JetBrains Mono for sparklines and data only? — yes, data-mono rule
