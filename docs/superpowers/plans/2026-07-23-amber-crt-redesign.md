# Amber CRT Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform RepoSurge from green terminal-brutalist to full retro-futuristic amber CRT terminal with dashboard cards.

**Architecture:** Change the Tailwind color palette to amber tones, add CRT visual effects via CSS (scanlines, vignette, glow, boot animation, monitor frame), convert flat table rows to amber-glow dashboard cards, migrate all component color tokens.

**Tech Stack:** Next.js 14.2.29, React 18, Tailwind CSS v3.4, TypeScript

## Global Constraints

- Palette: amber-bg `#1A1200`, amber-primary `#FFB000`, amber-dim `#CC8800`, amber-muted `#8B6914`, amber-bright `#FFD040`, amber-bezel `#0D0900`
- CRT effects: scanlines (1.5px repeating-linear-gradient), vignette (radial-gradient), text-shadow glow (2-3 stacked), CRT frame (border-radius 16px, thick border, inset shadow), boot sweep animation (0.6s, once)
- `prefers-reduced-motion: reduce` disables glow animation and boot sweep; scanlines persist but static
- JetBrains Mono via `next/font` (unchanged), `tabular-nums` on all numerics
- Language data in `repos.json` as manual `language` field, text only (no emoji)
- No `#00FF41` or green palette remnants after migration
- Build must compile (11/11 pages), tests must pass (9/9)
- No new dependencies

---

### Task 1: Foundation — Amber palette + CRT effects + data

**Files:**

- Modify: `tailwind.config.ts` — replace green palette with amber
- Modify: `app/globals.css` — add CRT effects CSS, remove green theme
- Modify: `app/layout.tsx` — CRT frame wrapper, bezel background, token migration
- Modify: `src/content/repos.json` — add `language` field to all 15 repos

**Interfaces:**

- Produces: `amber-bg`, `amber-primary`, `amber-dim`, `amber-muted`, `amber-bright`, `amber-bezel` Tailwind colors; `.crt-frame` CSS class for scanlines+vignette+glow; `@keyframes crt-sweep`; `language` field on each repos.json entry

- [ ] **Step 1: Update tailwind.config.ts — replace palette**

Replace the `colors` block:

```ts
colors: {
  'amber-bg': '#1A1200',
  'amber-primary': '#FFB000',
  'amber-dim': '#CC8800',
  'amber-muted': '#8B6914',
  'amber-bright': '#FFD040',
  'amber-bezel': '#0D0900',
},
```

Also add CRT keyframe + animate utility:

```ts
extend: {
  keyframes: {
    'crt-sweep': {
      '0%': { top: '0', height: '0', opacity: '1' },
      '50%': { height: '2px', opacity: '1' },
      '100%': { top: '100%', height: '0', opacity: '0' },
    },
  },
  animation: {
    'crt-sweep': 'crt-sweep 0.6s ease-out forwards',
  },
}
```

Remove old `terminal`, `midnight`, `bone`, `dim` colors. Remove old `animate-fade-in` keyframe if unused (keep if referenced elsewhere).

- [ ] **Step 2: Write CRT CSS in tailwind.config.ts extend**

Add under `extend`:

```ts
// Keep existing fontFamily etc.
```

(Step 2 merged into Step 3 globals.css)

- [ ] **Step 3: Update globals.css — CRT effects**

Add at end of file:

```css
/* ── CRT Monitor Frame ── */
.crt-frame {
  position: relative;
  border: 2px solid #8b6914;
  border-radius: 16px;
  background: #1a1200;
  overflow: hidden;
  box-shadow:
    inset 0 0 60px rgba(0, 0, 0, 0.6),
    0 0 30px rgba(255, 176, 0, 0.1);
}

/* Scanlines */
.crt-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 1.5px,
    rgba(0, 0, 0, 0.15) 1.5px,
    rgba(0, 0, 0, 0.15) 3px
  );
  pointer-events: none;
  z-index: 10;
}

/* Vignette */
.crt-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(0, 0, 0, 0.4) 100%
  );
  pointer-events: none;
  z-index: 11;
}

/* CRT boot sweep */
.crt-sweep::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 176, 0, 0.3),
    #ffb000,
    rgba(255, 176, 0, 0.3),
    transparent
  );
  z-index: 12;
  animation: crt-sweep 0.6s ease-out forwards;
  pointer-events: none;
}

/* Amber glow utility */
.amber-glow {
  text-shadow:
    0 0 4px rgba(255, 176, 0, 0.4),
    0 0 8px rgba(255, 176, 0, 0.2),
    0 0 16px rgba(255, 176, 0, 0.1);
}

.amber-glow-sm {
  text-shadow: 0 0 4px rgba(255, 176, 0, 0.3);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .crt-sweep::before {
    animation: none !important;
    display: none;
  }
  .amber-glow,
  .amber-glow-sm {
    text-shadow: none;
  }
}
```

Remove any old `:focus-visible` rule that references `#00FF41` — replace with amber-primary. Replace the `outline: 2px solid #00ff41` with `outline: 2px solid #FFB000`.

- [ ] **Step 4: Update layout.tsx — CRT frame + bezel background**

Apply CRT frame wrapper to main content. Change bg classes:

- `<body>` bg `bg-midnight` → `bg-amber-bezel`
- Header `bg-midnight/90` → `bg-amber-bg/90`, `border-[#1a1a1a]` → `border-amber-muted/20`
- `#main-content` pt-16 wrapper — add `className="crt-frame mx-4 md:mx-8 lg:mx-auto max-w-7xl p-4 md:p-6 mb-8 crt-sweep"`

Footer bg `border-[#1a1a1a]` → `border-amber-muted/20`, text `text-dim` → `text-amber-muted`.

- [ ] **Step 5: Add language to repos.json**

Read `src/content/repos.json`. Add `language` field to each entry apropos known stacks:

- `graphify-labs/graphify` → `"Rust"`
- `trycua/cua` → `"Python"`
- `ibelick/ui-skills` → `"TypeScript"`
- `codecrafters-io/build-your-own-x` → `"Markdown"`
- `vercel/next.js` → `"TypeScript"`
- `shadcn-ui/ui` → `"TypeScript"`
- `langgenius/dify` → `"Python"`
- `astral-sh/ruff` → `"Rust"`
- `sst/sst` → `"TypeScript"`
- `mckaywrigley/chatbot-ui` → `"TypeScript"`
- `immich-app/immich` → `"TypeScript"`
- `microsoft/vscode` → `"TypeScript"`
- `n8n-io/n8n` → `"TypeScript"`
- `mckaywrigley/chatbot-ui` → `"TypeScript"`
- `all-hands-ai/openhands` → `"Python"`
- `grafana/grafana` → `"Go"`

(Verify exact list of 15 repos from the file before writing.)

- [ ] **Step 6: Build + verify**

Run: `npm run build` — expect 0 errors, 11 pages. Run: `npm test` — expect 9/9 pass.

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.ts app/globals.css app/layout.tsx src/content/repos.json
git commit -m "feat: amber CRT foundation — palette, effects, frame, language data"
```

---

### Task 2: RepoCard dashboard card

**Files:**

- Modify: `components/RepoCard.tsx` — rewrite as dashboard card
- Modify: `components/StarChart.tsx` — amber glow gradient bars
- Modify: `lib/db.ts` — add `gained7d` to repo detail

**Interfaces:**

- Consumes: `language` field from repos.json entries; amber palette tokens from Task 1
- Produces: `RepoCard` props accept `{ repo: RepoEntry, rank: number, period: string }` where `RepoEntry` includes `language: string`

- [ ] **Step 1: Add gained7d to lib/db.ts**

In `getRepoDetails()` and/or `getStats()`, compute `gained7d` from history:

```ts
// In getRepoDetails return, after computing gained:
const gained7d =
  repo.history.length >= 8
    ? repo.history[repo.history.length - 1].stars -
      repo.history[repo.history.length - 8].stars
    : 0;
```

Exclude 7d gain from `getRepos()` return (not needed on listing).

- [ ] **Step 2: Rewrite RepoCard.tsx**

Replace full file content:

```tsx
import Link from "next/link";
import StarChart from "./StarChart";

type RepoCardProps = {
  rank: number;
  name: string;
  slug: string;
  stars: number;
  gained: number;
  gained7d: number;
  language: string;
  gainedColor: string;
  liveDelta: number | null;
  history: { date: string; stars: number }[];
  period: string;
};

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
  period,
}: RepoCardProps) {
  const gainedPrefix = gained > 0 ? "+" : gained < 0 ? "" : "";
  const gainedAbs = Math.abs(gained);
  const liveLabel =
    liveDelta !== null ? `${liveDelta > 0 ? "+" : ""}${liveDelta}` : null;

  return (
    <Link
      href={`/repo/${slug}`}
      className="block bg-amber-bg/30 border border-amber-muted/30 px-3 py-2.5
        hover:bg-amber-bg/60 hover:border-amber-muted/50
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-primary
        focus-visible:ring-offset-2 focus-visible:ring-offset-amber-bg
        active:bg-amber-bg/80 transition-all duration-200"
    >
      {/* Row 1: rank + name + language + gained */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-amber-muted tabular-nums text-xs w-5 shrink-0">
            #{rank}
          </span>
          <span
            className="text-amber-primary amber-glow-sm truncate text-sm"
            title={name}
          >
            {name}
          </span>
          <span className="text-amber-muted/60 text-[10px] hidden sm:inline shrink-0">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {liveLabel && (
            <span className="text-amber-bright/60 text-[10px] tabular-nums">
              {liveLabel}
            </span>
          )}
          <span className={`${gainedColor} tabular-nums text-sm`}>
            {gainedPrefix}
            {gainedAbs.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      {/* Row 2: Amber glow sparkline (StarChart) */}
      <div className="mt-1 mb-1.5">
        <div style={{ height: "24px" }}>
          <StarChart history={history} period={period} />
        </div>
      </div>

      {/* Row 3: stats */}
      <div className="flex items-center gap-4 text-amber-muted text-[10px] tabular-nums">
        <span>{stars.toLocaleString("en-US")} ★</span>
        {gained7d > 0 && <span>+{gained7d.toLocaleString("en-US")} / 7d</span>}
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Update StarChart.tsx — amber gradient**

Replace green color references with amber:

- `bg-terminal` → `bg-amber-primary`
- `bg-terminal/20` → `bg-amber-primary/20`
- `text-terminal` → `text-amber-primary`
- `ring-1 ring-terminal/30` → `ring-1 ring-amber-primary/30`

Update hover glow to amber shadow.

- [ ] **Step 4: Build + verify**

Run: `npm run build` — 0 errors. Run: `npm test` — 9/9 pass.

- [ ] **Step 5: Commit**

```bash
git add components/RepoCard.tsx components/StarChart.tsx lib/db.ts
git commit -m "feat: amber CRT dashboard cards with sparkline + language + 7d gain"
```

---

### Task 3: Token migration — all remaining components

**Files:**

- Modify: `components/Header.tsx` — amber tokens
- Modify: `components/RepoList.tsx` — amber tokens, remove table markup
- Modify: `components/PeriodNav.tsx` — amber tokens
- Modify: `components/NavLinks.tsx` — amber tokens
- Modify: `components/MobileNav.tsx` — amber tokens
- Modify: `components/LeaderboardInfo.tsx` — amber tokens
- Modify: `components/SearchInput.tsx` — amber tokens
- Modify: `components/LastUpdated.tsx` — amber tokens
- Modify: `app/repo/[slug]/page.tsx` — amber tokens
- Modify: `app/error.tsx` — amber tokens
- Modify: `app/not-found.tsx` — amber tokens
- Modify: `app/repo/[slug]/not-found.tsx` — amber tokens
- Modify: `app/page.tsx` — if any green refs

**Interfaces:**

- Consumes: Task 1's amber palette tokens

- [ ] **Step 1: Mass token replacement**

Replace in all listed files (mechanical find-and-replace, one class at a time):

| Old                              | New                                              |
| -------------------------------- | ------------------------------------------------ |
| `text-terminal`                  | `text-amber-primary`                             |
| `bg-terminal`                    | `bg-amber-primary`                               |
| `border-terminal`                | `border-amber-primary`                           |
| `ring-terminal`                  | `ring-amber-primary`                             |
| `shadow-[0_0_8px_#00FF41`        | `shadow-[0_0_8px_#FFB000`                        |
| `shadow-[0_0_4px_#00FF41`        | `shadow-[0_0_4px_#FFB000`                        |
| `bg-midnight`                    | `bg-amber-bg`                                    |
| `bg-midnight/90`                 | `bg-amber-bg/95`                                 |
| `bg-midnight/80`                 | `bg-amber-bg/90`                                 |
| `text-bone`                      | `text-amber-primary` (headings get `amber-glow`) |
| `text-dim`                       | `text-amber-muted`                               |
| `text-dim/60`                    | `text-amber-muted/60`                            |
| `border-[#1a1a1a]`               | `border-amber-muted/20`                          |
| `bg-terminal/[0.03]`             | `bg-amber-primary/[0.05]`                        |
| `bg-terminal/10`                 | `bg-amber-primary/10`                            |
| `ring-offset-midnight`           | `ring-offset-amber-bg`                           |
| `hover:shadow-[0_0_12px_#00FF41` | `hover:shadow-[0_0_12px_#FFB000`                 |
| `hover:shadow-[0_0_6px_#00FF41`  | `hover:shadow-[0_0_6px_#FFB000`                  |

For `text-bone` specifically: if used as heading/hero text, replace with `text-amber-primary amber-glow`. If used as body text, replace with `text-amber-primary`.

For `gainedColor` in `lib/gained-color.ts`: `text-terminal` → `text-amber-primary`, `text-red-400` → `text-amber-muted`, `text-dim` → `text-amber-muted`. Also update `text-terminal/80` → `text-amber-primary/80`.

For `text-red-400` references in RepoCard/RepoList — replace with `text-amber-dim` (negative gain should still be visible but subdued per CRT aesthetic).

- [ ] **Step 2: Audit for missed tokens**

Run: `rg -rn '#00FF41\|text-terminal\|bg-terminal\|border-terminal\|ring-terminal\|bg-midnight\|text-bone\|text-dim\|ring-offset-midnight' src/ app/ components/ lib/ --include '*.tsx' --include '*.ts' --include '*.css'` — confirm zero matches outside `node_modules/` and archived files.

- [ ] **Step 3: Build + verify**

Run: `npm run build` — 0 errors, 11 pages. Run: `npm test` — 9/9 pass.

- [ ] **Step 4: Commit**

```bash
git add components/ app/ lib/
git commit -m "feat: migrate all components to amber CRT color tokens"
```

---

### Task 4: Detail page — sparkline + amber polish

**Files:**

- Modify: `app/repo/[slug]/page.tsx` — amber tokens, StarChart size
- Modify: `components/StarChart.tsx` — (already modified in Task 2, verify amber consistency)

- [ ] **Step 1: Polish detail page**

In `app/repo/[slug]/page.tsx`:

- Replace green color classes with amber equivalents (covered in Task 3 by mass replacement)
- Replace `text-terminal` on the period selector with `text-amber-primary` when active, `text-amber-muted` when inactive
- Replace `border-terminal/30` on `text-terminal` periods with `border-amber-primary/30`
- Stats section: `text-bone` → `text-amber-primary amber-glow`, `text-dim` → `text-amber-muted`

- [ ] **Step 2: Verify StarChart on detail page shows correct amber glow bars, h-32 works**

- [ ] **Step 3: Build + verify**

Run: `npm run build` — 0 errors. Run: `npm test` — 9/9 pass.

- [ ] **Step 4: Commit**

```bash
git add app/repo/\[slug\]/page.tsx
git commit -m "feat: amber CRT detail page polish"
```

---

### Task 5: Final review + cleanup

**Files:**

- Full diff review — no specific file, audit scope

- [ ] **Step 1: Run full grep for green remnants**

```bash
rg -n '#00ff41\|#00FF41\|text-terminal\|bg-terminal\|border-terminal\|ring-terminal\|ring-offset-midnight' --include '*.tsx' --include '*.ts' --include '*.css' --include '*.json' src/ app/ components/ lib/ tailwind.config.ts
```

Expected: zero matches.

- [ ] **Step 2: Verify build + tests**

```bash
npm run build && npm test
```

Expected: 0 errors, 11/11 pages, 9/9 tests.

- [ ] **Step 3: Commit final cleanup**

```bash
git add -A
git commit -m "chore: remove green palette remnants, final amber cleanup"
```
