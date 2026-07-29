# RepoSurge Design — Vercel-Inspired Minimal

## Architecture

Next.js 14 App Router. Static site with ISR. Data from `data/repos.json` fetched by cron.

## Design Tokens

- Background: `#0A0A0A` (very dark gray, not pure black)
- Card surface: `#111111`, hover: `#1A1A1A`
- Border: `white/[0.06]`, hover: `white/[0.12]`
- Text body: `#E5E5E5`, muted: `#888888`
- Accent: `#5B7FFF` (UI elements)
- Positive: `#34D399`, Negative: `#F87171`
- Surge glow: Amber `shadow-[0_0_8px_rgba(217,119,6,0.15)]`
- Live dot: `w-2 h-2 rounded-full bg-[#34D399] animate-surge-pulse`
- Border radius: `rounded-xl`
- Transition: `cubic-bezier(0.32,0.72,0,1)`

## Component Structure

- `app/layout.tsx` — Clean top bar (RS logo + nav links), simple footer
- `components/NavLinks.tsx` — Active state via text-accent
- `components/MobileNav.tsx` — Hamburger morph + solid overlay
- `components/Header.tsx` — Eyebrow pill + large REPOSURGE heading
- `components/RepoCard.tsx` — Solid card, surge indicator, rank/name/language/gained/stars
- `components/RepoList.tsx` — 3-col grid, search, sort controls, Panel integration
- `components/Panel.tsx` — Slide-in detail panel, solid bg
- `components/RepoDetail.tsx` — Stats grid inside panel
- `components/StarChart.tsx` — SVG sparkline with gradient fill
- `components/ScrollReveal.tsx` — IntersectionObserver fade-up
- `components/SearchInput.tsx` — Search with ⌘K shortcut
- `components/PeriodNav.tsx` — Day/week/month toggle
- `components/LastUpdated.tsx` — Relative time display
- `app/repo/[slug]/page.tsx` — Detail page with stats grid + StarChart

## Data Model

- `data/repos.json` — Array of repos with history, stars, language, etc.
- `lib/db.ts` — Loads data, computes velocity/gained/rank
- `hooks/useStars.ts` — Client-side polling for live star counts

## Surge Detection

- Repo is surging if `gained > 0 || gained7d > 0`
- Triggers live dot (top-right) + amber border glow
- Non-surging repos: no indicators, intentionally quiet

## Responsive

- Desktop: 3-col grid
- Tablet: 2-col
- Mobile: 1-col

## Security

- No auth needed (public data only)
- API route reads local JSON only (no user input)
