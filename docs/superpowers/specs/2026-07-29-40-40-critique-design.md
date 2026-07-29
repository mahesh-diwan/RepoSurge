# RepoSurge: 40/40 Critique Score

## Goal

Push impeccable critique score for `app/page.tsx` from **30/40 → 40/40** by closing all 6 remaining heuristic gaps.

## Heuristic Target Map

| Heuristic        | From | Gap                                        | Fixes                                                                 |
| ---------------- | ---- | ------------------------------------------ | --------------------------------------------------------------------- |
| Help + Docs      | 1    | No tooltips, no help text, no onboarding   | Tooltip wrapper, info icons on columns, help text above period toggle |
| Flexibility      | 2    | No shortcuts reference, single layout      | `?` key shortcuts modal + grid/list toggle + column visibility + `⌘C` |
| Consistency      | 3    | Sibling pages missing Header + empty-state | Unify all period pages                                                |
| Visibility       | 3    | No loading skeleton in detail Panel        | Skeleton shimmer in RepoDetail                                        |
| Error Prevention | 3    | No validation feedback on min-stars        | Visual feedback on invalid input                                      |
| Error Recovery   | 3    | No retry, no undo/notifications            | Retry button in ErrorBoundary, Toast system                           |

## New Components

### 1. Tooltip (`components/Tooltip.tsx`)

- **Pattern**: Pure CSS, zero deps. Wrapper div with `group`, absolutely positioned label on `group-hover:opacity-100`.
- **Props**: `{ children: ReactNode; label: string }`
- **Edge cases**: Overflow hidden — tooltip may clip at viewport edge. `ponytail: no edge-detection, add if overflow issues arise`.
- **Usage locations**:
  - Column headers in RepoList (rank, velocity, stars gained, stars)
  - Info circle icons next to data fields in RepoCard
  - rankChange value explaining velocity formula

### 2. ShortcutsModal (`components/ShortcutsModal.tsx`)

- **Trigger**: `?` key (anywhere except INPUT/TEXTAREA/SELECT)
- **State**: `open: boolean` managed in RepoList
- **Content**: Dialog listing all keyboard shortcuts
- **A11y**: `role="dialog"`, `aria-labelledby`, focus trap, Escape closes
- **Shortcuts listed**: `↑↓` navigate list, `Enter` detail, `Escape` close, `/` search, `⌘K` search, `?` shortcuts, `⌘C` copy repo name

### 3. Toast (`components/Toast.tsx`)

- **Pattern**: React context + portal to `fixed bottom-4 right-4` region
- **Types**: `{ id, type: 'info'|'error'|'undo', message: string, action?: { label: string; onClick: () => void } }`
- **Dismiss**: Auto 4s, manual on click, max 3 stacked, oldest auto-dismissed
- **Usage**: filter-cleared toast with undo, error notifications, status confirmations
- **A11y**: `role="status"` with `aria-live="polite"`

### 4. LoadingSkeleton (`components/LoadingSkeleton.tsx`)

- **Pattern**: Shimmer placeholder matching RepoDetail layout
- **States**: 3-4 pulsing rectangles mimicking rank chart + detail text
- **A11y**: `aria-busy="true"` on parent

## Existing Component Changes

### RepoList.tsx

- Wrap sort-header buttons in Tooltip (already have `title` — promote to visible Tooltip)
- Add info circle icon next to "Velocity" column header. Tooltip: "Velocity = (stars gained / baseline) × 1000. Measures how fast a repo is rising relative to its size."
- Register `?` key → open ShortcutsModal
- Add ToastProvider at top level
- On "Clear filters" click → toast("Filters cleared") with undo action
- Add **grid/list view toggle** — icon button toggles between `list` and `grid` layout. Grid shows RepoCard in compact variant with name + velocity only.
- Add **column visibility toggle** — button opens a dropdown with checkboxes for show/hide columns (rank, name, velocity, stars gained, stars, language)
- Register **`⌘C`** — copy selected repo name to clipboard
- Add **help text** row above the period toggle: a muted text row "period · language · min stars — filter repos by time window, language, or minimum follower count" that disappears on first user interaction (or after 3s)

### RepoCard.tsx

- Add Tooltip on rankChange: "Rank moved ↑N / ↓N positions this period. Velocity = (stars gained / baseline) × 1000"
- Add info icon on star count. Tooltip: "Total GitHub stars. Stars gained shows the delta this period."
- Support compact variant for grid mode (name + velocity only)

### RepoDetail.tsx

- Return LoadingSkeleton while data loads, then swap in content

### ErrorBoundary (RepoListBoundary)

- Add retry button: calls `resetErrorBoundary` or re-mounts children
- Toast on recovery: "Error recovered" notification

### Sibling Pages (daily/weekly/monthly)

- Add `<Header />` component import
- Add empty-state guard (like main page)

### SearchInput.tsx (min-stars)

- Add `aria-invalid={value < 0}` and `border-red-500` class on invalid
- Native `min={0}` already present

## Data Flow

No data model changes. All additions are UI-only:

- Tooltip: decorative hover label
- ShortcutsModal: static content
- Toast: ephemeral state (React state, useCallback for actions)
- LoadingSkeleton: conditional render based on data presence

## Non-Goals

- No new data fetching
- No new API routes
- No state management library
- No CSS framework additions
- No bulk actions/compare/pin features

## Out of Scope

- Server-side changes
- Database schema changes
- External dependencies
