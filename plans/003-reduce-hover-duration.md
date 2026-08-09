# 003 — Reduce hover durations to under 300ms

**Severity**: MEDIUM | **Category**: Easing & duration  
**Scope**: `app/page.tsx`, `components/StatsBar.tsx`, `components/ForecastBar.tsx` | **Effort**: Small

## Finding

Per AUDIT.md: "UI animations stay under 300ms." Current violations:
- KPI tiles: `duration-500 ease-out-expo` (hover bg change)
- ForecastBar progress: `duration-1000 ease-out-expo`

## Target

Hover state changes: 150–200ms. Progress bars: 200–300ms.

## Steps

1. In `app/page.tsx`, change KPI tile hover from `transition-all duration-500 ease-out-expo hover:bg-surface` to `transition-colors duration-150 ease-spring hover:bg-surface`.

2. In `components/StatsBar.tsx`, same change for KPI tiles.

3. In `components/ForecastBar.tsx`, change progress bar from `transition-all duration-1000 ease-out-expo` to `transition-all duration-300 ease-spring`.

## Verification

- Hovering KPI tiles should feel snappy (color change completes in ~150ms).
- Forecast bar fills in ~300ms instead of 1s.
- No animation should feel sluggish.
