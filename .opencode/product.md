# RepoSurge — Vercel-Inspired Redesign

## What

GitHub repo star velocity tracker showing surging repos. Clean, minimal dark design inspired by vercel.com's restraint.

## Who

Developers browsing trending GitHub repos. Quick scan of what's rising fast.

## User Stories

- See 20-25 repos ranked by star velocity at a glance
- Spot surging repos immediately via live dot + amber glow
- Filter by period (day/week/month) to see different time windows
- Search repos by name
- Click repo to see detail stats + sparkline chart

## Acceptance Criteria

- [x] Dark premium aesthetic, no glass/noise/orbs
- [x] 3-col equal grid, all cards same size
- [x] Surging repos have green live dot + amber border glow
- [x] Quiet repos stay dark, no glow
- [x] Clean top bar nav (no floating island pill)
- [x] Mobile hamburger with clean overlay
- [x] Detail page with solid card stats grid + StarChart
- [x] Scroll reveal = plain fade-up (no blur)
- [x] All transitions use custom cubic-bezier
- [x] Reduced motion respected
- [x] All routes respond 200
- [x] Build passes, 9/9 tests pass

## Success Metrics

- Build: clean (0 errors)
- Tests: 9/9 pass
- Routes: all 200
- First Load JS: under 100kB

## Non-Goals

- No pagination (25 repos only)
- No glass morphism, no backdrop blur, no noise textures
- No hero/bento card sizes (all equal)
