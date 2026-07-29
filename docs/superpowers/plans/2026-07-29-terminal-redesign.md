# Terminal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign RepoSurge with terminal-inspired dashboard aesthetic — floating pill nav, Chivo + Fragment Mono typography, comparison table, stats bar, curated digest layer.

**Architecture:** Server components + client components ("use client" where needed). Layout change: fixed header bar → floating centered pill. Homepage: list/grid toggle → comparison table. About: 3-section text → stats dashboard.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS 3, Vitest, @fontsource/chivo, @fontsource/fragment-mono

## Global Constraints

- Only @fontsource/chivo (400, 500, 700) and @fontsource/fragment-mono (400) — remove @fontsource/outfit completely
- All brand (`[RS]`), table data, stats values: Fragment Mono
- All body text, labels, nav: Chivo
- No new npm dependencies beyond font packages
- No new files beyond what's listed; prefer modifying existing files
- Amber accent: `#D97706` (existing)
- Build must pass, all 9 tests must pass

---

### Task 1: Swap Fonts — Outfit → Chivo + Fragment Mono

**Files:**

- Modify: `app/layout.tsx` (font imports + CSS variable)
- Modify: `tailwind.config.ts` (fontFamily)
- Create: `.npmrc` (if needed for fontsource)
- Remove: `@fontsource/outfit` from package.json (npm uninstall)

**Interfaces:**

- Consumes: existing `globals.css` font variable
- Produces: `--font-chivo` and `--font-fragment` CSS variables available globally

- [ ] **Step 1: Install font packages**

```bash
npm uninstall @fontsource/outfit
npm install @fontsource/chivo @fontsource/fragment-mono
```

Expected: `@fontsource/outfit` removed from package.json, `@fontsource/chivo` + `@fontsource/fragment-mono` added.

- [ ] **Step 2: Update layout.tsx — font imports**

Replace:

```tsx
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import { JetBrains_Mono } from "next/font/google";
```

With:

```tsx
import "@fontsource/chivo/400.css";
import "@fontsource/chivo/500.css";
import "@fontsource/chivo/700.css";
import "@fontsource/fragment-mono/400.css";
import "@fontsource/fragment-mono/700.css";
```

Remove the `next/font/google` import for JetBrains Mono (replace with empty):

- Delete lines: `import { JetBrains_Mono } from "next/font/google";`
- Delete the `const jetbrains = JetBrains_Mono({...})` block
- Update `<html>` tag: remove `className={`${jetbrains.variable}`}`

Final `<html>` tag:

```tsx
<html lang="en">
```

- [ ] **Step 3: Update tailwind.config.ts**

Replace:

```ts
fontFamily: {
  sans: ["Outfit", "system-ui", "sans-serif"],
  mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
},
```

With:

```ts
fontFamily: {
  sans: ["Chivo", "system-ui", "sans-serif"],
  mono: ["'Fragment Mono'", "ui-monospace", "monospace"],
},
```

- [ ] **Step 4: Build to verify**

```bash
npm run build
```

Expected: Build succeeds. No font-related errors.

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected: All 9 tests pass.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: swap fonts Outfit -> Chivo + Fragment Mono"
```

---

### Task 2: Floating Pill Navigation

**Files:**

- Create: `components/FloatingPill.tsx`
- Modify: `app/layout.tsx` (replace `<header>` with `<FloatingPill>`)
- Modify: `components/NavLinks.tsx` (update styling for pill context — remove `hidden md:flex`, use gap consistent with pill)
- No change: `components/MobileNav.tsx` (kept as-is, rendered inside pill)

**Interfaces:**

- Consumes: `NAV_LINKS` (already imported)
- Produces: fixed centered pill nav with `[RS]` + NavLinks + MobileNav

- [ ] **Step 1: Create `components/FloatingPill.tsx`**

```tsx
import NavLinks from "./NavLinks";
import MobileNav from "./MobileNav";
import { NAV_LINKS } from "@/lib/nav-links";

export default function FloatingPill() {
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-6 px-5 py-2 rounded-full bg-surface border border-border shadow-accent">
        <a
          href="/"
          className="font-mono text-accent font-bold text-sm tracking-wider"
          title="RepoSurge"
        >
          [RS]
        </a>
        <NavLinks links={NAV_LINKS} />
        <MobileNav />
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Update NavLinks.tsx — remove `hidden md:flex`**

Replace the `<nav>` className:

```tsx
<nav
  role="navigation"
  aria-label="main"
  className="hidden md:flex items-center gap-1"
>
```

With:

```tsx
<nav
  role="navigation"
  aria-label="main"
  className="hidden md:flex items-center gap-2"
>
```

(Only change is `gap-1` → `gap-2` for slightly more breathing room in the pill.)

- [ ] **Step 3: Update layout.tsx — replace header with FloatingPill**

In `app/layout.tsx`:

- Add import: `import FloatingPill from "@/components/FloatingPill";`
- Remove import: `import MobileNav from "@/components/MobileNav";`
- Remove import: `import NavLinks from "@/components/NavLinks";`
- Remove import: `import { NAV_LINKS } from "@/lib/nav-links";`
- Replace the `<header>` block (lines 42-52) with:

```tsx
<FloatingPill />
```

Also adjust the `pt-24` to `pt-20` since the pill is smaller than the current header bar:

In the `<div id="main-content">` line, change `pt-24` to `pt-20`.

- [ ] **Step 4: Build and visually verify**

```bash
npm run build
```

Expected: Build succeeds. Pill nav appears centered at top with `[RS]` + nav links + hamburger.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: floating pill nav replaces full-width header"
```

---

### Task 3: Stats Bar + totalGained in DB

**Files:**

- Modify: `lib/db.ts` (add `totalGained` to `getStats()`)
- Create: `components/StatsBar.tsx`
- Modify: `app/page.tsx` (add StatsBar)

**Interfaces:**

- Consumes: `getStats()` (extended with `totalGained`)
- Produces: 4-card grid showing TOTAL REPOS | TOTAL STARS | LANGUAGES | TOTAL GAINED
- Test updated: `lib/__tests__/db.test.ts` (verify `totalGained`)

- [ ] **Step 1: Extend `getStats()` in `lib/db.ts`**

Add `totalGained` computation. After the `languages` line:

```ts
const totalGained = repos.reduce((sum, r) => {
  const n =
    (r.history.at(-1)?.stars ?? r.stars) - (r.history.at(0)?.stars ?? r.stars);
  return sum + Math.max(0, n);
}, 0);
```

Update return:

```ts
return { totalRepos, totalStars, languages: languages.size, totalGained };
```

- [ ] **Step 2: Update the test in `lib/__tests__/db.test.ts`**

In the "returns aggregate stats" test, add expectation for `totalGained`:

```ts
it("returns aggregate stats", () => {
  const stats = getStats();
  expect(stats.totalRepos).toBeGreaterThan(0);
  expect(stats.totalStars).toBeGreaterThan(0);
  expect(stats.languages).toBeGreaterThan(0);
  expect(stats.totalGained).toBeGreaterThanOrEqual(0);
});
```

- [ ] **Step 3: Run tests to verify**

```bash
npm test
```

Expected: All 9 tests pass.

- [ ] **Step 4: Create `components/StatsBar.tsx`**

```tsx
import { getStats } from "@/lib/db";

export default function StatsBar() {
  const { totalRepos, totalStars, languages, totalGained } = getStats();

  const cards = [
    { label: "TOTAL REPOS", value: totalRepos.toLocaleString("en-US") },
    { label: "TOTAL STARS", value: totalStars.toLocaleString("en-US") },
    { label: "LANGUAGES", value: languages.toString() },
    { label: "TOTAL GAINED", value: `+${totalGained.toLocaleString("en-US")}` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-surface border border-border rounded-2xl px-4 py-3"
        >
          <p className="font-sans text-text-muted text-[10px] tracking-widest mb-1">
            {card.label}
          </p>
          <p className="font-mono text-text-body font-bold text-lg tabular-nums">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Add StatsBar to `app/page.tsx`**

Add import: `import StatsBar from "@/components/StatsBar";`

Insert `<StatsBar />` between `<Header />` and the `<main>` element:

```tsx
<>
  <Header />
  <StatsBar />
  <main className="max-w-7xl mx-auto px-6">...</main>
</>
```

- [ ] **Step 6: Build**

```bash
npm run build && npm test
```

Expected: Build succeeds, all tests pass.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: stats bar with totalGained in getStats()"
```

---

### Task 4: Homepage — Comparison Table + Digest Features

**Files:**

- Modify: `components/RepoList.tsx` (major rewrite — replace list/grid rendering with comparison table, add weekly highlight, add CSV export, remove column menu, remove help tooltip, remove grid/list toggle)
- Modify: `app/page.tsx` (add weekly highlight callout data)
- Modify: `lib/db.ts` (expose `computeAllRepos` for full-list access if needed for highlight)

**Interfaces:**

- Consumes: `RepoWithVelocity` from `@/lib/db`
- Produces: table with sortable columns: REPO | STARS | GAINED | VELOCITY | Δ RANK + 🔥 hot indicator + CSV export

- [ ] **Step 1: Scaffold the comparison table in RepoList.tsx**

Remove these states and features (lines to delete):

- `viewMode` state (line 64)
- `visibleColumns` state (line 65)
- `columnMenuOpen` state (line 68)
- `columnMenuRef` ref (line 69)
- `showHelp` state (line 67) + auto-dismiss effect (lines 71-74)
- The Tips `<div>` (lines 183-187)
- The view-toggle + column-menu buttons (lines 247-280)
- The sticky header row (lines 282-336)
- The grid rendering branch (lines 350-369)
- Remove imports: `Tooltip` (if no longer used elsewhere) — actually `Tooltip` is still used for rank change tooltips in the table

Add new state for velocity sort:

```tsx
type SortKey = "rank" | "name" | "gained" | "stars" | "velocity";
```

(Add `"velocity"` to the existing SortKey type.)

Add CSV export function:

```tsx
function exportCSV(repos: RepoWithVelocity[]) {
  const headers = ["repo", "stars", "gained", "velocity", "rank_change"];
  const rows = repos.map((r) => [
    r.full_name,
    r.stars.toString(),
    (r.stars_gained ?? 0).toString(),
    (r.velocity ?? 0).toString(),
    (r.rankChange ?? 0).toString(),
  ]);
  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reposurge-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
```

Add sort handler for velocity:

```tsx
case "velocity":
  return ((a.velocity ?? 0) - (b.velocity ?? 0)) * dir;
```

- [ ] **Step 2: Replace sticky header with new table header row**

Replace lines 282-336 (the old sticky header) with:

```tsx
<div className="flex items-center justify-between mb-3">
  <span className="font-mono text-text-muted text-[10px]">{sorted.length} repos</span>
  <button
    onClick={() => exportCSV(sorted)}
    className="font-mono text-text-muted text-[10px] hover:text-accent transition-colors cursor-pointer"
  >
    export data ↓
  </button>
</div>

<div className="flex items-center gap-3 py-2 px-2 text-[10px] font-sans text-text-muted border-b border-border mb-1 sticky top-0 bg-midnight z-10">
  <button onClick={() => handleSort("rank")} className="w-8 text-left hover:text-accent transition-colors cursor-pointer">
    #{arrow("rank")}
  </button>
  <button onClick={() => handleSort("name")} className="flex-1 min-w-0 text-left hover:text-accent transition-colors cursor-pointer">
    repo{arrow("name")}
  </button>
  <button onClick={() => handleSort("stars")} className="w-20 text-right hover:text-accent transition-colors cursor-pointer hidden sm:block">
    stars{arrow("stars")}
  </button>
  <button onClick={() => handleSort("gained")} className="w-20 text-right hover:text-accent transition-colors cursor-pointer">
    gained{arrow("gained")}
  </button>
  <button onClick={() => handleSort("velocity")} className="w-16 text-right hover:text-accent transition-colors cursor-pointer hidden sm:block">
    velocity{arrow("velocity")}
  </button>
  <div className="w-12 text-right hidden sm:block">Δ rank</div>
</div>
```

- [ ] **Step 3: Replace list/grid rendering with table rows**

Replace lines 349-389 (the `RepoListBoundary` with grid/list rendering) with:

```tsx
<div ref={listRef}>
  {sorted.slice(0, 25).map((repo, i) => {
    const isHot = (repo.stars_gained ?? 0) > 1000;
    return (
      <button
        key={repo.full_name}
        onClick={() => setSelectedRepo(repo.slug)}
        className={`w-full flex items-center gap-3 py-2.5 px-2 text-left border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors cursor-pointer ${
          isHot ? "bg-amber-500/[0.015]" : ""
        }`}
      >
        <span className="font-mono tabular-nums text-text-muted text-xs w-8">
          {repo.rank}
        </span>
        <span className="flex-1 min-w-0 font-sans text-text-body text-xs truncate">
          {isHot && <span className="text-amber-500 mr-1">🔥</span>}
          {repo.name}
        </span>
        <span className="font-mono tabular-nums text-text-muted text-xs w-20 text-right hidden sm:block">
          {(repo.stars / 1000).toFixed(1)}K
        </span>
        <span
          className={`font-mono tabular-nums text-xs w-20 text-right ${(repo.stars_gained ?? 0) > 0 ? "text-positive" : "text-text-muted/40"}`}
        >
          {repo.stars_gained != null
            ? `${repo.stars_gained > 0 ? "+" : ""}${repo.stars_gained.toLocaleString("en-US")}`
            : "—"}
        </span>
        <span className="font-mono tabular-nums text-text-muted text-xs w-16 text-right hidden sm:block">
          {repo.velocity != null ? repo.velocity : "—"}
        </span>
        <span
          className={`font-mono tabular-nums text-xs w-12 text-right hidden sm:block ${(repo.rankChange ?? 0) > 0 ? "text-positive" : (repo.rankChange ?? 0) < 0 ? "text-negative" : "text-text-muted/40"}`}
        >
          {repo.rankChange != null && repo.rankChange !== 0
            ? `${repo.rankChange > 0 ? "▲" : "▼"}${Math.abs(repo.rankChange)}`
            : "—"}
        </span>
      </button>
    );
  })}
</div>
```

- [ ] **Step 4: Add weekly highlight callout**

In `RepoListContent`, above the filter section (after the period toggle, before language filters), add:

```tsx
{
  period === "week" &&
    sorted.length > 0 &&
    (() => {
      const top = sorted[0];
      return (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-amber-500/[0.04] border border-amber-500/10">
          <span className="text-amber-500 text-xs font-mono">
            this week's top gainer:
          </span>
          <button
            onClick={() => setSelectedRepo(top.slug)}
            className="font-mono text-accent text-xs hover:underline cursor-pointer"
          >
            {top.name}
          </button>
          <span className="font-mono text-positive text-xs">
            +{(top.stars_gained ?? 0).toLocaleString("en-US")} stars
          </span>
          {top.rankChange != null && top.rankChange > 0 && (
            <span className="font-mono text-text-muted text-xs">
              ▲{top.rankChange} positions
            </span>
          )}
        </div>
      );
    })();
}
```

- [ ] **Step 5: Clean up unused imports from RepoList.tsx**

Remove: `import Tooltip from "./Tooltip";` (no longer used — all tooltip needs removed with column menu and `?` tooltip; or keep if you still use it for rank change — actually the new table rows don't use RankChange tooltips from Tooltip component, they use inline color styling, so remove the import.)

Remove: `import RepoCard from "./RepoCard";` (no longer used — table rows are inline now)

Remove: `import Tooltip from "./Tooltip";`

Remove: The `ShortcutsModal` import and usage can stay (keyboard shortcut `?` still works).

Double check: `ShortcutsModal` is imported at line 10 and used at line 397. Keep it.
`Toast` is imported at line 9 and used at line 46. Keep it.

- [ ] **Step 6: Build**

```bash
npm run build && npm test
```

Expected: Build succeeds, all tests pass.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: comparison table with hot indicator, CSV export, weekly highlight"
```

---

### Task 5: About Page Redesign

**Files:**

- Modify: `app/about/page.tsx` (full rewrite)
- May remove: `components/ScrollReveal.tsx` (if no longer used anywhere)

**Interfaces:**

- Consumes: `getStats()` from `@/lib/db`
- Produces: stats dashboard with 3 cards + formula explanation

- [ ] **Step 1: Rewrite `app/about/page.tsx`**

```tsx
import { type Metadata } from "next";
import { getStats } from "@/lib/db";

export const metadata: Metadata = {
  title: "about - reposurge",
  description: "how reposurge tracks star velocity on github",
};

export default function AboutPage() {
  const stats = getStats();

  const cards = [
    { value: stats.totalRepos.toLocaleString("en-US"), label: "repos tracked" },
    { value: (stats.totalStars / 1000).toFixed(1) + "M", label: "total stars" },
    { value: stats.languages.toString(), label: "languages" },
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 pt-20">
      <h1 className="font-sans text-text-body text-xl font-semibold tracking-tight mb-1">
        ABOUT REPOSURGE
      </h1>
      <p className="font-sans text-text-muted/50 text-xs mb-8">
        star velocity tracker for github
      </p>

      <div className="grid grid-cols-3 gap-3 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-surface border border-border rounded-2xl px-4 py-4 text-center"
          >
            <p className="font-mono text-text-body font-bold text-2xl tabular-nums">
              {card.value}
            </p>
            <p className="font-sans text-text-muted text-[10px] tracking-widest mt-1">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-2xl px-5 py-4 mb-4">
        <p className="font-sans text-text-body text-xs font-medium mb-2">
          velocity formula
        </p>
        <p className="font-mono text-text-muted text-xs">
          velocity = (gained / baseline) × 1000
        </p>
        <p className="font-sans text-text-muted/40 text-[10px] mt-2 leading-relaxed">
          Repos are ranked by star velocity: the rate at which a repository
          gains stars relative to its existing count. Higher velocity = faster
          relative growth.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl px-5 py-4">
        <p className="font-sans text-text-body text-xs font-medium mb-2">
          data
        </p>
        <p className="font-sans text-text-muted text-[10px] leading-relaxed">
          github api · refreshed daily · next.js 14 · react 18 · tailwind css
        </p>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Check if ScrollReveal is used elsewhere**

```bash
grep -r "ScrollReveal" --include="*.tsx" app/ components/
```

If only used on about page, it can be deleted:

```bash
rm components/ScrollReveal.tsx
```

- [ ] **Step 3: Build**

```bash
npm run build && npm test
```

Expected: Build succeeds, all tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: about page redesigned as stats dashboard"
```

---

### Task 6: Header Simplification + Polish

**Files:**

- Modify: `components/Header.tsx` (remove subtitle)

- [ ] **Step 1: Remove subtitle from Header**

```tsx
export default function Header() {
  return (
    <div className="px-6 pt-6 pb-2 text-left relative z-[2]">
      <h1 className="font-sans text-xl md:text-2xl font-semibold tracking-tight leading-none text-text-body">
        REPOSURGE
      </h1>
    </div>
  );
}
```

(Removed the `<p>` subtitle, changed `pt-4` to `pt-6` for better spacing since the pill is smaller.)

- [ ] **Step 2: Update all page routes to use simplified Header**

Check `/daily/page.tsx`, `/weekly/page.tsx`, `/monthly/page.tsx` — they all already use `<Header />` so the change in Step 1 propagates to all of them automatically.

- [ ] **Step 3: Final build + test pass**

```bash
npm run build && npm test
```

Expected: Build succeeds, all 9 tests pass.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "refactor: simplify header, remove subtitle"
```

---

### Task 7: Clean Up — Remove Unused Components

**Files:**

- Delete: `components/ScrollReveal.tsx` (if not deleted in Task 5)
- Delete: `components/RepoCard.tsx` (replaced by inline table rows)
- Verify: no imports of deleted files remain

- [ ] **Step 1: Check for any lingering imports**

```bash
rg "from.*RepoCard" --include="*.tsx"
rg "from.*ScrollReveal" --include="*.tsx"
rg "from.*Tooltip" --include="*.tsx"
```

If no imports remain, delete the files:

```bash
rm components/RepoCard.tsx
# ScrollReveal already removed in Task 5
```

- [ ] **Step 2: Build**

```bash
npm run build && npm test
```

Expected: Build succeeds, all 9 tests pass.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: remove unused RepoCard component"
```
