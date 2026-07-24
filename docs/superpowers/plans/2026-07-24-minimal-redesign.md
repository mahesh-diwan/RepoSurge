# RepoSurge Minimal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign RepoSurge from CRT amber aesthetic to clean minimal dark theme with floating nav, table layout, robust sparklines, and slide-out repo panel.

**Architecture:** Remove CRT CSS/effects across all files. Rewrite Header as centered hero with description. Convert RepoCard from stacked card to horizontal table row. Upgrade StarChart with axis labels/trends. Add new Panel component for slide-out repo detail. Simplify detail page.

**Tech Stack:** Next.js 14.2.29, React 18, Tailwind CSS v3.4, TypeScript

## Global Constraints

- No new npm dependencies
- All 15 repos must have working GitHub `url` in repos.json
- Build must compile: 11/11 pages
- Tests must pass: 9/9 (2 test files)
- Palette: amber-bg #1A1200, amber-primary #FFB000, amber-dim #CC8800, amber-muted #8B6914, amber-bright #FFD040, amber-bezel #0D0900 — no other colors
- No CRT CSS remnants: no `.crt-frame`, `.crt-sweep`, `.amber-glow`, `.amber-glow-sm`, scanlines, or vignette
- JetBrains Mono via next/font (unchanged)
- Slide-out panel closes on Escape, backdrop click, and close button
- GitHub link opens `target="_blank" rel="noreferrer"`

---

### Task 1: Foundation — CRT removal + CSS/config cleanup

**Files:**

- Modify: `tailwind.config.ts` — remove `crt-sweep` keyframe/animation, remove old color aliases (`terminal`, `midnight`, `bone`, `dim`)
- Modify: `app/globals.css` — delete all CRT/CSS (`.crt-frame`, `::before` scanlines, `::after` vignette, `.crt-sweep`, `.amber-glow`, `.amber-glow-sm`, `@keyframes glow-pulse`). Keep `@layer base`, `:focus-visible`, `::selection`, reduced-motion, `.is-visible`, base html/body styles
- Modify: `app/layout.tsx` — remove `crt-frame` class, remove `crt-sweep` div from `#main-content`. Simplify body class (remove `bg-amber-bezel` context — use `bg-amber-bg`). Remove `amber-glow-sm` class from logo `<a>`. Remove `style={{ textShadow: "none" }}` from Ø span. Update header/footer border classes
- Delete: `components/LeaderboardInfo.tsx` — remove file and remove import from `app/page.tsx`
- Modify: `app/page.tsx` — remove LeaderboardInfo import and usage, remove PeriodNav import/usage

- [ ] **Step 1: Clean tailwind.config.ts**
      Remove: `crt-sweep` from `animation`, `crt-sweep` keyframes block, lines for `terminal`, `midnight`, `bone`, `dim` from colors.
      Keep all 6 amber colors + `fade-in` animation/keyframe (used by MobileNav).

- [ ] **Step 2: Clean globals.css**
      Delete lines 59-161 (everything after `@media (prefers-reduced-motion: reduce)` block). Content to keep: `.is-visible`, `@layer base` with html/body/selection/focus-visible/a rules, and reduced-motion block.

- [ ] **Step 3: Update layout.tsx**
      Remove `crt-frame` and `mb-8` from `#main-content` div. Remove inner `<div className="crt-sweep">`. Simplify body class. Remove amber-glow-sm from logo. Remove `text-bone` from Ø span (use `text-amber-dim` instead). Keep `textShadow: "none"` removed.

- [ ] **Step 4: Remove LeaderboardInfo**
      Delete `components/LeaderboardInfo.tsx`. Remove import and `<LeaderboardInfo>` from `app/page.tsx`.

- [ ] **Step 5: Clean up page.tsx**
      Remove PeriodNav import and usage. Keep Header and RepoList.

- [ ] **Step 6: Build + test**

```bash
npm run build && npm test
```

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: remove CRT effects — foundation for minimal redesign"
```

---

### Task 2: Floating nav pill + hero with description

**Files:**

- Modify: `components/Header.tsx` — rewrite completely
- Modify: `components/NavLinks.tsx` — update styling for floating pill
- Modify: `components/MobileNav.tsx` — update for floating pill integration
- Modify: `app/layout.tsx` — replace nav bar with floating pill, wrap in centered container

**Interfaces:**

- Consumes: layout.tsx cleanup from Task 1 (no crt-frame, clean body)
- Produces: HeroSection with `stats` props consumed by page.tsx

#### Floating Nav Pill

The nav is a fixed, centered pill at the top of the page:

```tsx
<nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
  <div className="flex items-center gap-6 px-5 py-2 bg-amber-bg/80 backdrop-blur-lg border border-amber-primary/20 rounded-xl shadow-lg shadow-black/40">
    <a href="/" className="text-amber-primary font-bold tracking-wider text-sm">
      RS
    </a>
    <NavLinks links={NAV_LINKS} />
    <MobileNav />
  </div>
</nav>
```

NavLinks renders `home` and `about` as inline links (no pill bg per item, just text).
MobileNav renders hamburger icon that shows fullscreen overlay on <md.

- [ ] **Step 1: Write Header.tsx**

```tsx
import { getStats } from "@/lib/db";

export default function Header() {
  const stats = getStats();
  return (
    <section className="px-6 pt-24 pb-12 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none text-[#F5F5F0] mb-4">
          REPOSURGE
        </h1>
        <p className="text-amber-muted text-sm md:text-base leading-relaxed mb-6 max-w-lg mx-auto">
          Track GitHub repo velocity in real-time. See which projects are rising
          fastest, compare star growth, and discover trending repos at a glance.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-amber-primary/60">
          <span className="tabular-nums">
            {stats.totalRepos.toLocaleString("en-US")}
          </span>{" "}
          repos
          <span className="text-amber-muted/30">·</span>
          <span className="tabular-nums">
            {stats.totalStars.toLocaleString("en-US")}
          </span>{" "}
          stars
          <span className="text-amber-muted/30">·</span>
          <span className="tabular-nums">
            {stats.languages.toLocaleString("en-US")}
          </span>{" "}
          languages
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update layout.tsx nav**
      Replace the current `<nav className="fixed top-0 left-0 right-0 z-40 ...">` with floating centered pill using the JSX from the Floating Nav Pill section above. Keep `header role="banner"` wrapper. Remove the amber-glow-sm, `text-bone` references.

- [ ] **Step 3: Update NavLinks.tsx**
      Remove pill-bg-per-item styling. Keep simple text links with hover/active/focus states:
      `hover:text-amber-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-primary transition-colors`

- [ ] **Step 4: Update MobileNav.tsx**
      Keep existing overlay logic. Update styling to match floating nav (remove old bg references, use consistent amber tokens).

- [ ] **Step 5: Build + test**

```bash
npm run build && npm test
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: floating nav pill + hero with description"
```

---

### Task 3: RepoCard → horizontal table row + SearchInput

**Files:**

- Modify: `components/RepoCard.tsx` — rewrite as table row
- Modify: `components/SearchInput.tsx` — pill style, centered, ⌘K hint
- Modify: `components/RepoList.tsx` — adjust search position, adjust sort header

**Interfaces:**

- Consumes: same props as current RepoCard (rank, name, slug, stars, gained, gained7d, language, gainedColor, liveDelta, history, period)
- Produces: onClick handler that Panel (Task 5) will attach

- [ ] **Step 1: Rewrite RepoCard.tsx**

```tsx
import StarChart from "./StarChart";

export default function RepoCard({
  rank,
  name,
  slug,
  stars,
  gained,
  gained7d,
  language,
  gainedColor,
  liveDelta,
  history,
  period = "week",
}: {
  rank: number;
  name: string;
  slug: string;
  stars: number;
  gained: number;
  gained7d: number;
  language: string;
  gainedColor: string;
  liveDelta: number | null;
  history: { recorded_at: string; stars: number }[];
  period?: string;
}) {
  const gainedPrefix = gained > 0 ? "+" : gained < 0 ? "" : "";
  const gainedAbs = Math.abs(gained);
  const liveLabel =
    liveDelta !== null ? `${liveDelta > 0 ? "+" : ""}${liveDelta}` : null;

  return (
    <div className="flex items-center gap-3 py-2.5 px-2 hover:bg-amber-primary/[0.03] transition-colors cursor-pointer border-b border-amber-primary/[0.06] last:border-b-0">
      <span className="w-6 text-right text-amber-muted tabular-nums text-xs shrink-0">
        #{rank}
      </span>
      <span
        className="flex-1 min-w-0 truncate text-[#F5F5F0] text-sm"
        title={name}
      >
        {name}
      </span>
      <span className="text-amber-muted/50 text-[10px] w-16 shrink-0 hidden sm:inline truncate">
        {language}
      </span>
      <div className="w-20 shrink-0 hidden md:block" style={{ height: "20px" }}>
        <StarChart history={history} period={period} />
      </div>
      <div className="flex items-center gap-2 shrink-0 w-20 justify-end">
        {liveLabel && (
          <span className="text-amber-bright/50 text-[10px] tabular-nums">
            {liveLabel}
          </span>
        )}
        <span className={`${gainedColor} tabular-nums text-sm`}>
          {gainedPrefix}
          {gainedAbs.toLocaleString("en-US")}
        </span>
      </div>
      <span className="text-amber-muted/40 text-xs tabular-nums w-16 text-right shrink-0 hidden sm:block">
        {(stars / 1000).toFixed(1)}K
      </span>
    </div>
  );
}
```

Note: `gainedColor` function's color token needs update — it currently returns `text-dim` and `text-terminal`. In `lib/gained-color.ts`, change `text-terminal` → `text-amber-primary` and `text-dim` → `text-amber-muted`.

- [ ] **Step 2: Update SearchInput.tsx**

```tsx
"use client";

export default function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-muted/40 text-sm pointer-events-none">
        /
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
            (e.target as HTMLInputElement).blur();
          }
        }}
        placeholder="search repos..."
        className="w-72 pl-7 pr-10 py-2 bg-[#1A1200] border border-amber-muted/20 rounded-lg text-sm text-[#F5F5F0] placeholder-amber-muted/30 focus:outline-none focus:border-amber-primary/50 focus-visible:ring-1 focus-visible:ring-amber-primary transition-all"
      />
      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-amber-muted/30 px-1.5 py-0.5 border border-amber-muted/15 rounded">
        ⌘K
      </kbd>
    </div>
  );
}
```

- [ ] **Step 3: Update gained-color.ts**

```ts
export function gainedColor(val: number): string {
  if (val > 0) return "text-amber-primary";
  if (val < 0) return "text-amber-muted";
  return "text-amber-muted/50";
}
```

- [ ] **Step 4: Update RepoList.tsx**
      Move the search row to be centered above the table. Replace the old search layout:
  - Remove the `flex items-center gap-2 mb-4` wrapper
  - Add `<div className="flex justify-center mb-6">` wrapping the SearchInput
  - Keep the live polling indicator inline in the header area
  - Sort headers: adjust column widths to match new RepoCard columns (`# w-6`, `repo flex-1`, `language w-16`, `sparkline w-20`, `gained w-20`, `stars w-16`)

- [ ] **Step 5: Build + test**

```bash
npm run build && npm test
```

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: table layout for repo rows + pill search input"
```

---

### Task 4: Robust sparklines with axis labels + trend

**Files:**

- Modify: `components/StarChart.tsx` — add labels, trend, title attrs
- Modify: `lib/db.ts` — ensure sparkline data has enough points

- [ ] **Step 1: Rewrite StarChart.tsx**

```tsx
export default function StarChart({
  history,
  period = "week",
  data,
}: {
  history?: { recorded_at: string; stars: number }[];
  period?: string;
  data?: number[];
}) {
  // Backward-compat: accept either data[] or history+period
  let values: number[];
  if (data) {
    values = data;
  } else if (history && history.length > 0) {
    const counts: Record<string, number> = { day: 3, week: 7, month: 14 };
    const n = counts[period] ?? 7;
    values = history.slice(-n).map((h) => h.stars);
  } else {
    return null;
  }

  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const trend = values[values.length - 1] >= values[0] ? "up" : "down";

  return (
    <div className="w-full h-full flex flex-col justify-end gap-0.5">
      <div className="flex items-end gap-px h-full">
        {values.map((v, i) => {
          const pct = ((v - min) / range) * 100;
          const day = history
            ? new Date(
                history[history.length - values.length + i].recorded_at,
              ).toLocaleDateString("en-US", { weekday: "short" })
            : null;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${Math.max(pct, 5)}%`,
                background: `linear-gradient(0deg, rgba(255,176,0,0.15), rgba(255,176,0,0.65))`,
              }}
              title={`${day ?? ""} ${v.toLocaleString("en-US")} stars`}
            />
          );
        })}
      </div>
      {data === undefined && ( // Only show labels for history mode
        <div className="flex items-center justify-between mt-0.5">
          <div className="flex gap-2 text-[8px] text-amber-muted/40">
            <span>{min.toLocaleString("en-US")}</span>
            <span>{max.toLocaleString("en-US")}</span>
          </div>
          <span className="text-[8px] text-amber-muted/40">
            {trend === "up" ? "\u2191" : "\u2193"}
          </span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify data adequacy**
      Check `lib/db.ts` — `history` slices already work for all periods. No changes needed.

- [ ] **Step 3: Build + test**

```bash
npm run build && npm test
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: robust sparklines with axis labels, trend, and hover values"
```

---

### Task 5: Slide-out panel component

**Files:**

- Create: `components/Panel.tsx`
- Modify: `components/RepoList.tsx` — wire panel state, attach onClick

**Interfaces:**

- Consumes: `RepoCard` row click → `selectedRepo` state in RepoList
- Produces: Panel with repo details, sparkline, GitHub link

- [ ] **Step 1: Create Panel.tsx**

```tsx
"use client";

import { useEffect, useRef } from "react";
import StarChart from "./StarChart";
import { gainedColor } from "@/lib/gained-color";

export default function Panel({
  repo,
  onClose,
}: {
  repo: {
    rank: number;
    full_name: string;
    name: string;
    description: string | null;
    stars: number;
    stars_gained: number;
    gained7d: number;
    language: string | null;
    url: string;
    created_at: string;
    history: { recorded_at: string; stars: number }[];
  };
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const gainedCls = gainedColor(repo.stars_gained);
  const createdDate = new Date(repo.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/50" onClick={onClose} />
      <div
        ref={panelRef}
        tabIndex={-1}
        className="w-80 md:w-96 bg-[#1A1200] border-l border-amber-primary/20 p-6 overflow-y-auto shadow-[-8px_0_32px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-amber-muted/50 text-[10px] mb-0.5">
              #{repo.rank}
            </p>
            <h2 className="text-[#F5F5F0] text-base font-bold leading-tight">
              {repo.full_name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-amber-muted/40 hover:text-amber-primary text-lg leading-none p-1 -m-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {repo.language && (
          <span className="inline-block text-[10px] text-amber-primary bg-amber-primary/10 px-2 py-0.5 rounded mb-4">
            {repo.language}
          </span>
        )}

        <p className="text-amber-muted/70 text-xs leading-relaxed mb-5">
          {repo.description ?? "No description available."}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-amber-muted/50 text-[10px] mb-0.5">stars</p>
            <p className="text-[#F5F5F0] text-sm font-bold tabular-nums">
              {repo.stars.toLocaleString("en-US")}
            </p>
          </div>
          <div>
            <p className="text-amber-muted/50 text-[10px] mb-0.5">gained</p>
            <p className={`text-sm font-bold tabular-nums ${gainedCls}`}>
              {repo.stars_gained > 0 ? "+" : ""}
              {repo.stars_gained.toLocaleString("en-US")}
            </p>
          </div>
          <div>
            <p className="text-amber-muted/50 text-[10px] mb-0.5">7d gain</p>
            <p className="text-amber-primary text-sm font-bold tabular-nums">
              {repo.gained7d > 0 ? "+" : ""}
              {repo.gained7d.toLocaleString("en-US")}
            </p>
          </div>
          <div>
            <p className="text-amber-muted/50 text-[10px] mb-0.5">created</p>
            <p className="text-[#F5F5F0] text-sm font-bold tabular-nums">
              {createdDate}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <p className="text-amber-muted/50 text-[10px] mb-2">
            star history (7d)
          </p>
          <div style={{ height: "96px" }}>
            <StarChart history={repo.history} period="week" />
          </div>
        </div>

        <a
          href={repo.url}
          target="_blank"
          rel="noreferrer"
          className="block w-full text-center bg-amber-primary text-[#1A1200] font-semibold text-sm py-2.5 rounded-lg hover:bg-amber-bright transition-colors"
        >
          view on github →
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire panel in RepoList.tsx**

```tsx
// Add imports at top:
import Panel from "./Panel";
import { useState } from "react";  // already imported

// Add state:
const [selectedRepo, setSelectedRepo] = useState<typeof repos[0] | null>(null);

// Add onClick to each repo row div:
// In the sorted.map loop, wrap RepoCard in a div with onClick:
<div key={repo.full_name} onClick={() => setSelectedRepo(repo)}>
  <ScrollReveal delay={Math.min(i * 0.02, 0.3)}>
    <RepoCard ... />
  </ScrollReveal>
</div>

// At the end of the JSX (before or after the closing <> or fragment):
{selectedRepo && (
  <Panel
    repo={{
      ...selectedRepo,
      gained7d: /* compute same as current */,
      description: selectedRepo.description ?? null,
      url: selectedRepo.url ?? "",
      created_at: selectedRepo.created_at ?? "",
    }}
    onClose={() => setSelectedRepo(null)}
  />
)}
```

- [ ] **Step 3: Build + test**

```bash
npm run build && npm test
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: slide-out panel for repo details with GitHub link"
```

---

### Task 6: Detail page simplification

**Files:**

- Modify: `app/repo/[slug]/page.tsx` — remove CRT, update styling, use updated StarChart

- [ ] **Step 1: Rewrite detail page**
  - Remove `amber-glow` class from stat values
  - Remove any CRT remnants
  - Update sparkline to use `<StarChart history={repo.history} period={period} />` with h-32
  - Keep existing layout (back link, stats grid, period selector, sparkline)
  - Use `rounded-lg` on GitHub link button, amber bg with dark text

- [ ] **Step 2: Build + test**

```bash
npm run build && npm test
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: simplify detail page — remove CRT, minimal styling"
```

---

### Task 7: Impeccable critique + polish

**Files:** All modified files

**Process:**

1. Run `/impeccable critique /` on the new design
2. Fix all findings (Critical → Important → Minor)
3. Run `/impeccable polish` to refine
4. Final build + test

- [ ] **Step 1: Run critique**

```bash
npm run build && npm test
```

- [ ] **Step 2: Apply fixes from critique**
      Fix each finding by severity.

- [ ] **Step 3: Run polish**
      Apply polish improvements.

- [ ] **Step 4: Final verification**

```bash
npm run build && npm test
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: critique fixes and polish"
```

---
