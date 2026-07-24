# Clean Dark Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the terminal/amber glow aesthetic from RepoSurge and adopt clean dark design inspired by opencode.ai: system sans-serif for UI, JetBrains Mono for data only, indigo accent (`#5B7FFF`), emerald/rose semantic data colors, flat surfaces, no glow or blur.

**Architecture:** Two-phase — (1) update tokens (tailwind config + globals.css) then (2) migrate all components to new tokens. Global find-and-replace handles the bulk of class migrations; targeted edits handle structural changes.

**Tech Stack:** Next.js 14.2.29 (App Router), React 18, Tailwind CSS v3.4, TypeScript, JetBrains Mono (data only).

## Global Constraints

- No amber (`#FFB000`) or terminal green (`#00FF41`) colors remain in any source file after implementation
- No `backdrop-blur`, `shadow-lg`, `shadow-xl`, `shadow-2xl` on containers
- No `uppercase tracking-wider` on labels
- No `amber-glow` or `bg-amber-bg` class references remain
- All labels use system font (not JetBrains Mono)
- All numeric data uses JetBrains Mono (tailwind `font-mono` or `tabular-nums`)
- Accent color is `#5B7FFF` (indigo) — used on interactive elements only
- Semantic data colors: emerald (`#34D399`) for positive, rose (`#F87171`) for negative
- No terminal/phosphor/green metaphors in brand copy, comments, or class names
- Build compiles with 0 errors, 0 TypeScript warnings
- All tests pass

---

### Task 1: Update tailwind config + globals.css tokens

**Files:**

- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

**Step 1: Replace amber palette with new color system in tailwind.config.ts**

Replace the entire `colors` block in `tailwind.config.ts` with:

```ts
colors: {
  midnight: '#0A0A0A',
  surface: '#111111',
  border: '#222222',
  'text-body': '#E5E5E5',
  'text-muted': '#888888',
  accent: '#5B7FFF',
  positive: '#34D399',
  negative: '#F87171',
},
```

Keep the `fontFamily.mono` entry unchanged. Keep `animation` and `keyframes` unchanged. Remove `glow-cyan` and any amber entries.

**Step 2: Update globals.css**

Replace:

- `html { background: #1a1200; }` → `html { background: #0A0A0A; }`
- `color: #f5f5f0;` → `color: #E5E5E5;`
- `background: #ffb000;` / `color: #1a1200;` in `::selection` → `background: #5B7FFF; color: #0A0A0A;`
- Same for `::-moz-selection`
- `outline: 2px solid #ffb000;` → `outline: 2px solid #5B7FFF;`
- `box-shadow: 0 0 0 2px #1a1200, 0 0 8px rgba(255, 176, 0, 0.4);` → `box-shadow: 0 0 0 2px #0A0A0A, 0 0 8px rgba(91, 127, 255, 0.4);`

Add `.amber-glow` removal (delete the class if it exists in the css).

**Step 3: Run tests**

Run `npm test` and `npm run build` to verify no regressions from token changes.

**Step 4: Commit**

`git commit -m "feat: update design tokens — indigo accent, midnight/surface palette"`

---

### Task 2: Update Header, NavLinks, SearchInput, Panel

**Files:**

- Modify: `components/Header.tsx`
- Modify: `components/NavLinks.tsx`
- Modify: `components/SearchInput.tsx`
- Modify: `components/Panel.tsx`
- Modify: `app/layout.tsx`

**Step 1: Rewrite Header.tsx**

Remove `getStats` import and stats counters (live repos/stars/languages). Keep hero h1 and description paragraph. Update text colors: h1 → `text-text-body`, description → `text-text-muted`, install snippet code block → use new surface/border tokens. Install snippet background: `bg-surface`, border: `border-border`.

**Step 2: Update NavLinks.tsx**

Change active state from `bg-amber-primary text-amber-bg font-bold shadow-[0_0_8px_#FFB000/30]` to `text-accent border-b-2 border-accent font-medium`. Update hover state from `text-body` (already ok). Update inactive state from `text-amber-muted` to `text-text-muted`.

**Step 3: Update SearchInput.tsx**

Change `border-amber-primary` focus → `border-accent`. Change `bg-amber-bg/[0.03]` focus bg → `bg-surface/50`. Change placeholder color → `text-text-muted`. Update text color from `text-amber-primary` → `text-text-body`. Remove any `amber-bg` references. Change the `>` prompt color from `text-amber-primary` to `text-text-muted`.

**Step 4: Update Panel.tsx**

Remove `border-l border-amber-primary/10` and `shadow-2xl shadow-black/50` from the panel div on line 40. Keep `bg-amber-bg` → change to `bg-surface`. Update close button `text-amber-muted/50` → `text-text-muted/50`. Update border bottom `border-amber-primary/10` → `border-border`. Update h2 text-color `text-[#F5F5F0]` → `text-text-body`.

**Step 5: Update layout.tsx**

Change `bg-amber-bg` → `bg-midnight` on body. Remove `backdrop-blur-lg` and `shadow-lg shadow-black/40` from nav div on line 32. Change nav border from `border-amber-primary/20` to `border-border`. Change skip link colors from amber → accent and midnight. Change footer border from `border-amber-muted/20` to `border-border`. Change footer text from `text-amber-muted` to `text-text-muted`.

**Step 6: Run build and tests**

**Step 7: Commit**

`git commit -m "feat: update header, nav, search, panel — clean dark tokens"`

---

### Task 3: Update RepoList, RepoCard, StarChart, RepoDetail

**Files:**

- Modify: `components/RepoList.tsx`
- Modify: `components/RepoCard.tsx`
- Modify: `components/StarChart.tsx`
- Modify: `components/RepoDetail.tsx`

**Step 1: Update RepoList.tsx**

Change live dot `bg-cyan-400` → `bg-positive` for consistency (cyan → emerald). Change live dot shadow from `rgba(34,211,238,0.5)` → `rgba(52,211,153,0.5)`. Change `text-amber-muted-light` → `text-text-muted` on the live/polling label. Change row hover classes from amber tints to surface tints. Change sort button text colors from amber → `text-text-muted` and hover → `text-accent`. Change divider `border-amber-primary/20` → `border-border`. Change "no repos" and filter hint text from amber → muted.

**Step 2: Update RepoCard.tsx**

Change all `text-amber-primary` references → `text-accent`. Change glow shadow `drop-shadow-[0_0_4px_#FFB000]` → `drop-shadow-[0_0_4px_#5B7FFF]`. Change hover bg `bg-amber-primary/[0.03]` → `bg-positive/[0.03]` or `bg-surface`. Change trend arrow if any from green → `text-positive`. Change `text-amber-muted-light` → `text-text-muted`. Change any amber-bg references → `bg-surface`. Ensure sparkline uses indigo gradient.

**Step 3: Update StarChart.tsx**

Replace all `rgba(255,176,0,*)` (amber) → `rgba(91,127,255,*)` (indigo). Replace all `rgba(34,211,238,*)` (cyan) → `rgba(91,127,255,*)` (indigo). Replace fill gradient `from-cyan-400` / `to-indigo-400` → `from-accent` / `to-accent` (via tailwind config).

**Step 4: Update RepoDetail.tsx**

Remove `uppercase tracking-wider` from all 4 label divs. Replace with `text-text-muted text-[10px]`. Flatten 3 card-grid stat blocks into a single `flex flex-wrap gap-4` row of inline key-value pairs. Remove `bg-amber-primary/[0.03] rounded-lg p-3` wrappers. Change inline `#8B6914` on language dot → `bg-text-muted`. Change `text-[#F5F5F0]` → `text-text-body`. Change "gained" label and value colors to use semantic data color class. Ensure `gainedColor()` is used for 7d gain.

**Step 5: Run build and tests**

**Step 6: Commit**

`git commit -m "feat: update data display components — indigo sparklines, emerald/rose semantics"`

---

### Task 4: Update error pages, layout, page.tsx

**Files:**

- Modify: `app/error.tsx`
- Modify: `app/not-found.tsx`
- Modify: `app/page.tsx` (if needed)

**Step 1: Update error.tsx**

Remove `amber-glow` class from h1 on line 13. Change `text-amber-primary` → `text-accent` on h1. Change `text-amber-muted-light` → `text-text-muted` on paragraph. Change button text `text-amber-primary` → `text-accent`. Change underline offset styles to use accent color. Change focus ring `focus-visible:ring-cyan-400` → `focus-visible:ring-accent`. Change `focus-visible:ring-offset-amber-bg` → `focus-visible:ring-offset-midnight`. Change `active:text-amber-primary/70` → `active:text-accent/70`.

**Step 2: Update not-found.tsx**

Remove `amber-glow` class from h1. Change `text-amber-primary` → `text-accent` on h1. Change `text-amber-muted-light` → `text-text-muted` on paragraph. Change link text and focus rings from amber → accent/midnight. Replace `bg-amber-bg` references → `bg-midnight`.

**Step 3: Check app/page.tsx for any amber references**

Grepping for amber classes in page.tsx. Update any remaining `text-amber-*`, `bg-amber-*`, `border-amber-*` references to new tokens.

**Step 4: Run build and tests**

**Step 5: Commit**

`git commit -m "feat: update error pages and layout — clean dark tokens"`

---

### Task 5: Verify, tests, and cleanup

**Files:** All modified files

**Step 1: Run full build**

`npm run build` — verify 0 TypeScript errors, 0 build errors, 11/11 static pages.

**Step 2: Run tests**

`npm test` — verify 9/9 pass.

**Step 3: Verify no amber/terminal remnants**

Run: `rg -n 'amber|ffb000|00FF41|glow-cyan|backdrop-blur|shadow-2xl|amber-glow|uppercase.tracking' app/ components/ lib/` — should return 0 matches.

**Step 4: Verify token consistency**

Run: `rg -n 'bg-amber|text-amber|border-amber|ring-amber|from-amber|to-amber' app/ components/ lib/` — should return 0 matches.

**Step 5: Commit**

`git commit -m "chore: verify clean dark redesign — no amber/terminal remnants, all tests pass"`

---

## Self-Review

- Spec coverage: All colors (amber → indigo), all typography (mono → system for labels), all components (header, nav, search, panel, cards, sparklines, error pages) covered ✓
- No placeholders: Every step has exact code and commands ✓
- No cross-task dependencies that would block: Token changes in Task 1 feed into all component tasks, but each task's file edits are independent ✓
- TDD: No new test code needed — existing tests verify gainedColor behavior which was already updated ✓
- Frequent commits: Each task commits independently ✓
