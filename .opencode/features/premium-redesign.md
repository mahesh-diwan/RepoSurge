# RepoSurge Premium Redesign

## Goal

Redesign entire app from minimal/brutalist to awwwards-tier Ethereal Glass aesthetic.

## Approach

- Vibe: Ethereal Glass (OLED black, mesh gradients, glassmorphism)
- Layout: Asymmetrical Bento (home), Editorial (about)
- Motion: Framer Motion scroll reveals, staggered animations, magnetic hovers
- Typography: Geist Sans + Geist Mono
- Architecture: Double-bezel cards, floating pill navbar, film grain overlay

## Key Decisions

- Keep electric blue (#0066FF) accent for continuity
- Install framer-motion for animations
- All cards use double-bezel (outer shell + inner core)
- Custom cubic-bezier: cubic-bezier(0.32, 0.72, 0, 1)
- Film grain: fixed overlay, pointer-events-none, opacity 3%

## Files (17)

1. package.json — add framer-motion
2. tailwind.config.ts — Geist fonts, colors, custom animations
3. app/globals.css — base styles, grain, keyframes
4. app/layout.tsx — floating pill nav, fonts, grain
5. components/FilmGrain.tsx — NEW
6. components/ScrollReveal.tsx — NEW (Framer Motion)
7. components/Header.tsx — mesh gradient hero
8. components/RepoCard.tsx — double-bezel card
9. components/StarChart.tsx — gradient sparkline
10. components/MobileNav.tsx — hamburger morph + stagger
11. components/TrustLogos.tsx — premium logos
12. app/page.tsx — asymmetrical bento
13. app/daily/page.tsx — glass ranking
14. app/weekly/page.tsx — glass ranking
15. app/monthly/page.tsx — glass ranking
16. app/repo/[slug]/page.tsx — premium detail
17. app/about/page.tsx — editorial layout

## Verification

- `npm run build` — 0 errors
- Visual check: glassmorphism, animations, responsive
