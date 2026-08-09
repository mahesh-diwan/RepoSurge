# Animation Audit — RepoSurge

Audit date: 2026-08-02  
Commit: `1642b03`  
Effort: standard

## Findings

| # | Severity | Category | Location | Finding | Fix summary |
|---|----------|----------|----------|---------|-------------|
| 1 | HIGH | Performance | Multiple | `transition-all` on 15+ elements animates unintended properties off-GPU | Replace with explicit `transition` on `transform` + `opacity` only |
| 2 | HIGH | Purpose | `components/LiveIndicator.tsx` | `animate-ping` runs 24/7 on every page — constant motion, no purpose | Remove ping; use static dot or CSS-only pulse with `prefers-reduced-motion` gate |
| 3 | MEDIUM | Easing & duration | `app/page.tsx`, `components/StatsBar.tsx` | `duration-500 ease-out-expo` on KPI hover — exceeds 300ms UI budget | Reduce to `duration-200` for hover state changes |
| 4 | MEDIUM | Easing & duration | `components/ForecastBar.tsx` | `duration-1000 ease-out-expo` — exceeds 300ms UI budget | Reduce to `duration-300` with `--ease-spring` |
| 5 | MEDIUM | Cohesion | Multiple | Inconsistent press scales: `0.95`, `0.97`, `0.98` | Standardize to `scale(0.97)` everywhere |
| 6 | MEDIUM | Physicality | `components/MobileNav.tsx` | Menu appears from nowhere — should originate from hamburger | Add `transform-origin` near hamburger + scale-from-corner entrance |
| 7 | LOW | Cohesion | `app/globals.css` | 4 different easing tokens, some unused | Consolidate to `--ease-spring` (default) + `--ease-out-expo` (entrances) |
| 8 | LOW | Accessibility | `components/LiveIndicator.tsx` | `animate-ping` not gated by `prefers-reduced-motion` | Add `@media (prefers-reduced-motion: reduce)` override |

## Missed opportunities

- **Number tick animation**: Rank and star-gained values teleport between sorts. A quick `transition` on the number position would feel alive.
- **List reordering**: When sort changes, rows teleport. FLIP-style row repositioning would show motion.
- **Rank change arrows**: The ▲▼ glyphs could animate in (scale + fade) when they appear.

## Plans

- [ ] [001-replace-transition-all.md](001-replace-transition-all.md) — Replace `transition-all` with explicit properties
- [ ] [002-remove-constant-ping.md](002-remove-constant-ping.md) — Remove `animate-ping` from LiveIndicator
- [ ] [003-reduce-hover-duration.md](003-reduce-hover-duration.md) — Reduce hover durations to < 300ms
- [ ] [004-standardize-press-scale.md](004-standardize-press-scale.md) — Standardize press feedback to `scale(0.97)`
- [ ] [005-mobile-menu-origin.md](005-mobile-menu-origin.md) — Add spatial origin to mobile menu
