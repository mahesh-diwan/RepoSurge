# Amber + Cyan Terminal Cyberpunk Redesign

## Product

RepoSurge — GitHub star velocity tracker. Next.js 14 + Tailwind CSS v3.4 + TypeScript.

## Core Design Direction

Current state is amber-on-dark minimal (from the earlier CRT removal). The user found it "cold and greenish" — lacking energy. This spec adds a vibrant **cyan/teal accent** (`#22D3EE`) alongside the warm gold amber (`#FFB000`) to inject life, velocity, and visual excitement.

**Tagline:** Amber is the brand. Cyan is the data coming alive.

## Palette

| Role              | Color         | Hex                    | Current → New                     |
| ----------------- | ------------- | ---------------------- | --------------------------------- |
| Background        | Near-black    | `#0A0A0A`              | `#1A1200` → `#0A0A0A` (pure dark) |
| Amber primary     | Warm gold     | `#FFB000`              | Keep                              |
| Amber dim         | Deeper gold   | `#CC8800`              | Keep                              |
| Amber muted       | Dim gold      | `#8B6914`              | Keep                              |
| Amber muted light | Readable gold | `#CCA060`              | Keep (from polish)                |
| Amber bright      | Bright gold   | `#FFD040`              | Keep                              |
| Cyan accent       | Electric teal | `#22D3EE`              | **New** (Tailwind cyan-400)       |
| Cyan glow         | Cyan shadow   | `rgba(34,211,238,0.3)` | **New**                           |
| Text primary      | Near-white    | `#F5F5F0`              | Keep                              |

## Where Cyan Appears

### Interactive / Data Elements (cyan replaces amber as accent)

- **Sparkline** — stroke changes to cyan (`#22D3EE`), fill gradient to `rgba(34,211,238,0.1)`, dot circles cyan
- **Active nav pill** — bg changes to `bg-cyan-400 text-black`, glow `shadow-[0_0_8px_rgba(34,211,238,0.3)]`
- **Live badge / indicator dot** — amber `bg-amber-bright` → cyan `bg-cyan-400 animate-pulse`
- **Positive gain numbers** — `text-amber-primary` → `text-cyan-400`
- **Trend arrow (positive)** — `text-green-500` → `text-cyan-400`
- **Sort arrows** — amber → cyan on active sort
- **Focus-visible ring** — `ring-cyan-400` (was `ring-amber-primary`)
- **Search input focus border** — `border-cyan-400/40` (was `border-amber-primary/40`)
- **⌘K badge** — `text-cyan-400/60` (was `text-amber-muted/40`)
- **Panel close button hover** — `hover:text-cyan-400` (was `hover:text-amber-primary`)
- **View on GitHub link** — `text-cyan-400/70 hover:text-cyan-400` (was `text-amber-primary/70`)

### What Stays Amber (Structural / Brand)

- Logo "RS" — `text-amber-primary`
- Hero heading "REPOSURGE" — `text-[#F5F5F0]`
- Nav pill border — `border-amber-primary/20`
- Column headers — `text-amber-muted-light`
- Rank numbers — `text-amber-muted/30`
- Language badges — amber dot + text
- Negative trend arrows — `text-red-400` (unchanged)
- Zero gain — `text-amber-muted/50`
- Footer text — `text-amber-muted`

### Panel / Detail Page

- Stat card labels — amber-muted
- Stat values — amber for stars/rank, cyan for 7d gain positive
- Star velocity chart — cyan sparkline
- RepoDetail "Created" date — amber
- Close button hover → cyan

## Effects & Glow

- **Cyan glow** replaces amber glow on interactive: `box-shadow: 0 0 8px rgba(34,211,238,0.3)` on active nav pill, search focus, "view on github" hover
- **Amber glow** removed from everything — amber is structural, not interactive glow
- **Fade-in animation** kept for MobileNav — unaffected

## Files to Change

| File                         | Changes                                                                                                                                                          |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tailwind.config.ts`         | Add `accent: '#22D3EE'` and `'accent-glow': 'rgba(34,211,238,0.3)'` colors; add `fade-in` stays                                                                  |
| `app/globals.css`            | Add `.glow-cyan` utility class if needed                                                                                                                         |
| `components/StarChart.tsx`   | Stroke `rgba(34,211,238,0.9)`, fill `rgba(34,211,238,0.1)`, dots `rgba(34,211,238,0.9)`, y-axis labels `rgba(34,211,238,0.3)`, grid lines `rgba(34,211,238,0.1)` |
| `components/NavLinks.tsx`    | Active: `bg-cyan-400 text-black font-bold`, hover: `bg-cyan-400/10 text-[#F5F5F0]`                                                                               |
| `components/RepoCard.tsx`    | Positive trend arrow cyan, positive gained `text-cyan-400`, live badge `bg-cyan-400`                                                                             |
| `components/Header.tsx`      | Stats amber-muted (unchanged)                                                                                                                                    |
| `components/SearchInput.tsx` | Focus border cyan, ⌘K cyan badge                                                                                                                                 |
| `components/Panel.tsx`       | Close btn hover cyan, View on GitHub link cyan                                                                                                                   |
| `components/RepoDetail.tsx`  | 7d Gain positive → cyan, star chart cyan                                                                                                                         |
| `app/repo/[slug]/page.tsx`   | StarChart cyan (inherits), stat values unchanged                                                                                                                 |
| `components/RepoList.tsx`    | Live indicator dot → cyan                                                                                                                                        |

## Non-Goals

- No animation changes (fade-in stays)
- No layout changes (floating nav, table rows, slide-out panel stay)
- No new components
- No font changes (JetBrains Mono stays)
- No data model changes

## Edge Cases

- **Zero gain**: stays `text-amber-muted/50` — neutral, not negative
- **Negative gain**: stays `text-red-400` — red signals "bad" universally
- **Sparkline empty**: returns null (unchanged)
- **No live data**: dot stays but dims (already handled by poll indicator logic)
- **Reduced motion**: no animations affected (palette/color changes only, no new motion)
