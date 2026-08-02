# RepoSurge Recovery Plan

## Root Issues

1. **Data statically imported** — `import rawRepos from "@/data/repos.json"` freezes at build time, ISR can't refresh
2. **History arrays unsorted** — gap-detection too aggressive, `stars_gained` null for most repos
3. **CI/CD skip logic broken** — doesn't actually skip subsequent steps
4. **Syntax error** — stray `H` character in `weekly/page.tsx` breaks build

---

## Task 1: Fix Data Architecture & Static Import

### 1.1 Rewrite `lib/db.ts`

- Read repos.json with `fs.readFileSync` on every call
- Sort history chronologically before computing windows
- Velocity = stars per day (not abstract ratio)
- Relaxed gap detection: only nullify if < 2 points or spans < half period
- `getStats(period)` sums that period's gains

### 1.2 Update `scripts/fetch-repos.ts`

- Sort history after push: `existing.history.sort((a, b) => ...)`
- Stricter stale cleanup: keep top-50 + 14-day grace buffer

---

## Task 2: Fix CI/CD Pipeline

### Replace `.github/workflows/fetch.yml`

- Use step outputs (`skip=true`) with `if:` conditions
- Proper conditional skipping of fetch/commit steps
- Add Vercel deploy hook trigger after commit

---

## Task 3: Fix Build Errors & Page Routes

### 3.1 Fix `app/weekly/page.tsx`

- Remove stray `H` character

### 3.2 Update `app/page.tsx`

- Add `<StatsBar period="week" />`

### 3.3 Update daily/monthly pages

- Add `<StatsBar period="day" />` and `<StatsBar period="month" />`

---

## Task 4: Redesign Core Components

### 4.1 Replace `components/Header.tsx`

- Period nav tabs (day/week/month) with active state
- LiveIndicator component

### 4.2 Replace `components/StatsBar.tsx`

- Accept `period` prop, accent highlight on gained card

### 4.3 Create `lib/language-color.ts`

- Language color map + helper function

### 4.4 Replace `components/RepoList.tsx`

- Period toggle, search, top-gainer banner
- Language dots, sparklines, rank change arrows
- Card-based mobile, grid desktop

### 4.5 Replace `components/StarChart.tsx`

- Clean responsive SVG for detail panel

---

## Task 5: Visual Polish

### 5.1 Upgrade `app/globals.css`

- Ambient glow, noise texture, custom scrollbar
- Selection color, focus-visible, reduced-motion

### 5.2 Create `components/LiveIndicator.tsx`

- Green pulse dot + "live data" label

### 5.3 Row animations

- `fade-in-up` keyframes, staggered delay

### 5.4 Update `tailwind.config.ts`

- Add animations, keyframes, shadow tokens

---

## Task 6: Deployment

### 6.1 `next.config.mjs` — `output: "standalone"`

### 6.2 Vercel settings — Node 20, npm ci

### 6.3 Env vars — GITHUB_TOKEN, NEXT_PUBLIC_APP_URL

### 6.4 Deploy hook for revalidation

### 6.5 Final build checklist
