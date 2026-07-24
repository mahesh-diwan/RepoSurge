# Amber + Cyan Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add vibrant cyan/teal accent (`#22D3EE`) to the amber-on-dark RepoSurge design — amber stays structural/brand, cyan goes on data/interactive elements (sparklines, gains, active nav, focus states, live badges).

**Architecture:** Palette swap in tailwind config, then component-by-component color updates. No layout or behavior changes. ~8 component files modified, 2 config/doc files.

**Tech Stack:** Next.js 14 + Tailwind CSS v3.4 + TypeScript

## Global Constraints

- No new dependencies
- JetBrains Mono font unchanged
- Amber palette kept: `amber-primary #FFB000`, `amber-dim #CC8800`, `amber-muted #8B6914`, `amber-muted-light #CCA060`, `amber-bright #FFD040`, `amber-bg #1A1200`, `amber-bezel #0D0900`
- Cyan accent: `#22D3EE` (Tailwind cyan-400)
- Build 11/11 pages, tests 9/9 pass
- `bg-accent/10` pattern for hover states, `shadow-[0_0_8px_rgba(34,211,238,0.3)]` for cyan glow
- Sparkline colors use raw `rgba(34,211,238,...)` (not Tailwind classes) because StarChart uses inline SVG

---

### Task 1: Config + Interactive Elements

**Files:**

- Modify: `tailwind.config.ts`
- Modify: `DESIGN.md`
- Modify: `components/NavLinks.tsx`
- Modify: `components/SearchInput.tsx`
- Modify: `components/Panel.tsx`

**Interfaces:**

- Consumes: current palette + component structure
- Produces: `accent` color in tailwind config, `design-system-v3` update in DESIGN.md

- [ ] **Step 1: Global find-and-replace — focus rings + hover states**

Replace all `ring-amber-primary` → `ring-cyan-400` across every component file (components/_.tsx, app/_.tsx, app/repo/**/*.tsx). Use sed or manual edits.

Replace all `hover:text-amber-primary` → `hover:text-cyan-400` across every component file (but KEEP `hover:text-amber-primary` in error/not-found pages — those should stay amber since they're structural).
This includes: MobileNav hamburger, NavLinks links, PeriodNav links, RepoList sort buttons, RepoList retry button, error page, not-found page.

- [ ] **Step 2: Update tailwind.config.ts**

Add to the `colors` block:

```ts
accent: '#22D3EE',
'glow-cyan': 'rgba(34,211,238,0.3)',
```

- [ ] **Step 2: Run build to verify no breakage**

Run: `npm run build`
Expected: 0 errors

- [ ] **Step 3: Update DESIGN.md palette section**

Add cyan accent to the colors table. Add a note:

> "Cyan accent (`#22D3EE`) carries the velocity/energy signal — sparklines, active states, gain numbers, live indicators. Amber carries the brand structure."

- [ ] **Step 4: Update NavLinks.tsx active state**

Change active pill styling:

```
text-amber-primary → text-cyan-400
bg-amber-primary/10 → bg-accent/10
```

The active link (using `pathname.startsWith(link.href)`) gets:

```tsx
className={`text-xs transition-colors px-3 py-1.5 ${
  active
    ? "bg-accent text-black font-bold shadow-[0_0_8px_rgba(34,211,238,0.3)]"
    : "text-amber-muted-light hover:text-cyan-400 hover:bg-accent/10"
}`}
```

The background for the active state should be `bg-accent` (solid) with `text-black` for contrast, and a cyan glow shadow. This replaces the previous `bg-amber-primary text-black` pattern.

- [ ] **Step 5: Update SearchInput.tsx**

Search input focus border: `focus:border-cyan-400/40 focus:bg-amber-bg/80 focus:ring-1 focus:ring-cyan-400/20`

⌘K badge: `text-cyan-400/60` (was `text-amber-muted/40`)

- [ ] **Step 6: Update Panel.tsx**

Close button hover: `hover:text-cyan-400` (was `hover:text-amber-primary`)

"View on GitHub" link: `text-cyan-400/70 hover:text-cyan-400` with `hover:shadow-[0_0_8px_rgba(34,211,238,0.3)]`

- [ ] **Step 7: Build + test**

Run: `npm run build && npm test`
Expected: 0 errors, 9/9 tests

- [ ] **Step 8: Commit**

```bash
git add tailwind.config.ts DESIGN.md components/NavLinks.tsx components/SearchInput.tsx components/Panel.tsx
git commit -m "feat: add cyan accent — config, nav, search, panel"
```

---

### Task 2: Data Visualization Elements

**Files:**

- Modify: `components/StarChart.tsx`
- Modify: `components/RepoCard.tsx`
- Modify: `components/RepoDetail.tsx`
- Modify: `app/repo/[slug]/page.tsx`
- Modify: `components/RepoList.tsx`

**Interfaces:**

- Consumes: `accent` color from Task 1 config
- Produces: cyan sparklines, cyan gain numbers, cyan live badges, cyan trend arrows

- [ ] **Step 1: Update StarChart.tsx**

Replace all color references from amber to cyan:

| Element         | Old                   | New                    |
| --------------- | --------------------- | ---------------------- |
| Line stroke     | `rgba(255,176,0,0.9)` | `rgba(34,211,238,0.9)` |
| Fill under line | `rgba(255,176,0,0.1)` | `rgba(34,211,238,0.1)` |
| Data point dots | `rgba(255,176,0,0.9)` | `rgba(34,211,238,0.9)` |
| Y-axis labels   | `rgba(255,176,0,0.4)` | `rgba(34,211,238,0.4)` |
| X-axis labels   | `rgba(255,176,0,0.3)` | `rgba(34,211,238,0.3)` |
| Grid lines      | `rgba(255,176,0,0.1)` | `rgba(34,211,238,0.1)` |

- [ ] **Step 2: Update RepoCard.tsx**

- Positive trend arrow: `text-green-500` → `text-cyan-400`
- Gained7d positive: conditional check for positive → `text-cyan-400` (was `text-amber-primary`)
- Live badge: `bg-amber-bright` → `bg-cyan-400`

The gained color logic currently uses `gainedColor(s7)` from `lib/db.ts`. Check what it returns. For positive values, it should now return `text-cyan-400` instead of `text-amber-primary`. The `gainedColor` function in `lib/db.ts` (or `lib/gained-color.ts`) should be updated.

- [ ] **Step 3: Update gainedColor function**

In `lib/gained-color.ts` (or wherever `gainedColor` is defined), change:

```ts
if (n > 0) return "text-amber-primary";
```

to:

```ts
if (n > 0) return "text-cyan-400";
```

This ensures all positive gain numbers across the app (RepoCard, RepoDetail, detail page) use cyan.

- [ ] **Step 4: Update RepoList.tsx**

- Sort button hover: `hover:text-amber-primary` → `hover:text-cyan-400` on all 3 sort buttons (rank, name, gained)
- Focus ring on sort buttons: `ring-amber-primary` → `ring-cyan-400`
- Live indicator dot: `bg-amber-primary shadow-[0_0_4px_#FFB000]` → `bg-cyan-400 shadow-[0_0_4px_rgba(34,211,238,0.5)]`
- Live badge text "live": stays as-is, dot color changes to cyan

- [ ] **Step 5: Update RepoDetail.tsx**

- 7d Gain stat card: value gets `text-cyan-400` when positive (inherits from `gainedColor`)
- StarVelocity chart: inherits cyan from StarChart (already updated in step 1)
- Close button hover: `hover:text-cyan-400` (already updated in Panel.tsx Task 1)

- [ ] **Step 6: Update app/repo/[slug]/page.tsx**

Check for any hardcoded amber colors on stat values, sparkline, or interactive elements. If colors use Tailwind classes like `text-amber-primary`, they'll be fine — only the `gainedColor` function drives gain text color. Sparkline inherits from StarChart.

Primary change: any hardcoded `text-amber-primary` on gain/velocity values should use the `gainedColor` function or be changed to `text-cyan-400` for positive values.

- [ ] **Step 7: Build + test + commit**

Run: `npm run build && npm test`
Expected: 0 errors, 9/9 tests

```bash
git add components/StarChart.tsx components/RepoCard.tsx components/RepoDetail.tsx components/RepoList.tsx lib/gained-color.ts
git commit -m "feat: cyan accent — sparklines, gains, trend arrows, sort, live dot"
```
