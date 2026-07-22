# Terminal Brutalist Redesign + Bugfix

## Goal

Shift from Ethereal Glass to terminal-brutalist aesthetic. Fix bugs. Improve perf and data accuracy.

## Approach

- Brutalist: flat black bg, no decoration, content-only
- Terminal: JetBrains Mono, green (#00FF41) accent, command-prompt styling
- Remove all glassmorphism, mesh gradients, film grain, blur, rounded corners
- Remove framer-motion (keep motion only), simplify ScrollReveal

## Key Decisions

- Accent: #00FF41 terminal green
- BG: #0A0A0A (keep)
- Font: JetBrains Mono (exclusively)
- Cards: flat rows with border-bottom, no backgrounds
- Perf: remove 3 animated mesh orbs, film grain SVG, backdrop-filter blurs
- Data: fix sparkline length per period, fetch script retry + token

## Files Modified (17)

1. package.json - remove framer-motion
2. tailwind.config.ts - green accent, terminal theme
3. app/globals.css - terminal brutalist base
4. app/layout.tsx - terminal nav, no mesh bg
5. components/ScrollReveal.tsx - no blur, minimal
6. components/Header.tsx - terminal hero
7. components/RepoCard.tsx - flat terminal rows
8. components/StarChart.tsx - single color green
9. components/MobileNav.tsx - terminal menu
10. components/TrustLogos.tsx - terminal row
11. app/page.tsx - terminal home
12. app/daily/page.tsx - terminal rankings
13. app/weekly/page.tsx - terminal rankings
14. app/monthly/page.tsx - terminal rankings
15. app/repo/[slug]/page.tsx - fix searchParams
16. app/about/page.tsx - terminal editorial
17. lib/db.ts - fix sparkline per period

## Files Deleted (1)

- components/FilmGrain.tsx

## Verification

- npm run build - 0 errors
