# High-End Visual Redesign — RepoSurge

**Vibe:** Ethereal Glass (OLED black, glass cards, glowing gradient orbs)
**Layout:** Asymmetrical Bento Grid (varying card sizes)
**Fonts:** Geist (UI/headings) + JetBrains Mono (data/numbers)

## Foundation — Colors & Typography

- **Background:** `#050505` with 2 subtle radial gradient orbs (dim blue/purple, opacity 0.03)
- **Glass surfaces:** `backdrop-blur-2xl` + `bg-midnight/60` + `border border-white/[0.06]`
- **Fixed noise overlay:** `::before` pseudo-element on body, opacity 0.02, pointer-events-none
- **Transitions:** `ease-[cubic-bezier(0.32,0.72,0,1)]` on all interactive elements
- **Palette (unchanged):** midnight `#0A0A0A`, surface `#111111`, border `#222222`, text-body `#E5E5E5`, text-muted `#888888`, accent `#5B7FFF`, positive `#34D399`, negative `#F87171`
- **Selection:** accent bg, midnight text

## Fluid Island Navigation

- Floating glass pill: `top: 1.5rem`, horizontally centered, `rounded-full`
- Outer shell: `p-1` wrapper with glass border + backdrop-blur
- Inner container: nav links + logo + mobile toggle
- Desktop: inline HOME/ABOUT links + RS logo
- Mobile hamburger: 2 thin lines morph to X via `rotate-45` / `-rotate-45` with absolute positioning and `transition-transform duration-400`
- Menu overlay: full-screen, `backdrop-blur-3xl bg-midnight/80`, staggered link reveal (100/150/200ms delays, `translate-y-12 opacity-0` → `translate-y-0 opacity-100`)
- Z-index: 50

## Asymmetrical Bento Grid

- `grid-cols-12 gap-4` on the repo list container
- Top 3 repos: hero cards spanning `col-span-6` (2 per row), elevated visual weight
- Repos 4-50: compact cards spanning `col-span-4` (3 per row)
- Card heights proportional to rank (top 3 taller with embedded sparkline chart)
- Desktop: full 12-column grid
- Tablet (768-1024px): `grid-cols-6`, top 3 `col-span-3`, rest `col-span-2`
- Mobile (<768px): `grid-cols-1`, all `col-span-1`, `gap-3`

## Double-Bezel Repo Cards

Each card is a nested architecture:

- **Outer shell:** `p-[3px] bg-white/[0.03] rounded-[1.25rem] ring-1 ring-white/[0.06]`
- **Inner core:** `bg-surface rounded-[calc(1.25rem-0.375rem)] p-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]`
- **Rank badges:** #1/#2/#3 get accent-colored glow (`shadow-[0_0_12px_rgba(91,127,255,0.3)]`); 4+ get muted
- **Data:** tabular-nums JetBrains Mono for stars/gained
- **Sparkline:** embedded in card, rendered with accent-colored line, thin (1px)
- **Hover:** outer shell brightens to `bg-white/[0.06]`, subtle `scale-[1.01]` on inner core
- **Live delta badge:** green pill `px-1.5 py-0.5 rounded-full text-[10px] bg-positive/10 text-positive` for repos with positive live delta
- **Language badge:** muted pill, `text-[10px] text-text-muted/60`

## StarChart

- Rendered as SVG sparkline inside cards and on detail page
- Line color: `#5B7FFF` (accent) with `stroke-width: 1.5`
- Fill gradient: `url(#sparkline-gradient)` — accent to transparent
- Detail page chart: glass container with inner shadow, larger height (h-40 vs h-32)
- Period indicators: subtle dots on data points

## Detail Page & Panel

- **Stats grid:** `grid-cols-5` with each stat in a double-bezel glass box
- **Star chart:** glass container with inner shadow, larger height
- **Period nav:** inline pill buttons (day/week/month) as glass toggle group
  - Active: solid accent bg with white text
  - Inactive: glass surface with muted text
- **"view on github" button:** pill CTA with button-in-button arrow
  - Main pill: `rounded-full px-6 py-2.5 bg-accent text-white`
  - Arrow icon in its own circle: `w-6 h-6 rounded-full bg-white/15 flex items-center justify-center ml-2`
  - Hover: inward arrow translation via `group-hover:translate-x-0.5 group-hover:-translate-y-0.5`
- **Back link:** subtle glass pill, top-left of content area

## Motion & Scroll

- **Scroll reveal:** IntersectionObserver-based
  - Initial: `translate-y-16 blur-md opacity-0`
  - Visible: `translate-y-0 blur-0 opacity-1`
  - Duration: 800ms, `ease-[cubic-bezier(0.32,0.72,0,1)]`
  - Staggered: 50ms delay between rows (top row first)
- **Card hover:** inner core `scale-[1.02]`, outer shell border brightens, 400ms
- **Button press:** `active:scale-[0.98]` for physical feedback
- **Nav link hover:** underline from center via `::after` pseudo-element with `scale-x-0` → `scale-x-100`
- **Reduced motion:** all animations disabled via `prefers-reduced-motion`

## Footer

- Glass style matching nav
- `py-6` with top border `border-white/[0.04]`
- "data: github api · refreshed daily" + `LastUpdated` component
- Glass row container: `bg-midnight/30 backdrop-blur-xl rounded-full px-6 py-3`

## Files to Modify

- `app/globals.css` — noise overlay, radial orbs, custom bezier utility, keyframes
- `app/layout.tsx` — Geist font import, update nav shell, footer glass
- `tailwind.config.ts` — new animations, colors, rounded scales
- `components/RepoCard.tsx` — double-bezel shell, hover effects, button-in-button
- `components/RepoList.tsx` — asymmetrical grid, staggered scroll, sort controls styling
- `components/NavLinks.tsx` — underline-from-center hover
- `components/MobileNav.tsx` — hamburger morph, staggered overlay
- `components/Panel.tsx` — glass shell, inner shadow
- `components/StarChart.tsx` — glass container, gradient fill, thinner lines
- `components/Header.tsx` — hero section with eyebrow tag
- `components/ScrollReveal.tsx` — new IntersectionObserver logic with blur
- `app/repo/[slug]/page.tsx` — detail page updated glass styling

## Acceptance Criteria

- [ ] All fonts updated: Geist for UI, JetBrains Mono for data numbers
- [ ] Background has subtle radial gradient orbs
- [ ] Noise overlay present and fixed
- [ ] Nav is a floating glass pill with desert/island spacing
- [ ] Mobile hamburger morphs to X with staggered overlay reveal
- [ ] Repo cards use double-bezel nested architecture
- [ ] Asymmetrical bento grid: top 3 hero cards, rest compact
- [ ] All transitions use custom cubic-bezier (no linear/ease-in-out)
- [ ] Scroll reveal with blur+fade-up
- [ ] Card hover: magnetic scale effect
- [ ] Button press: active scale-down
- [ ] "view on github" button has button-in-button arrow pattern
- [ ] Footer uses glass styling
- [ ] Responsive: collapes to single column on mobile
- [ ] Reduced motion respected
- [ ] Build passes, 9/9 tests pass, all pages load
- [ ] No banned fonts/icons/borders/shadows/motion patterns present
