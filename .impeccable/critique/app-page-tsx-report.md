# Impeccable Critique: RepoSurge Homepage

**Method:** dual-agent (A: design-review · B: detector+scan)

**Score:** 32/40 — Good. Address weak areas, solid foundation.

## Heuristic Scores

| #   | Heuristic                       | Score | Key Issue                                                        |
| --- | ------------------------------- | ----- | ---------------------------------------------------------------- |
| 1   | Visibility of System Status     | 4     | Live dot, sort indicators, empty/error states — all present      |
| 2   | Match System / Real World       | 4     | GitHub-native vocabulary, users know rank/stars/gained           |
| 3   | User Control and Freedom        | 4     | Escape closes panel/search, sort tri-state, backdrop click       |
| 4   | Consistency and Standards       | 3     | NavLinks nested in nav, minor drift                              |
| 5   | Error Prevention                | 3     | Search is free-text (fine), no destructive actions               |
| 6   | Recognition Rather Than Recall  | 4     | Column headers visible, sort state inline                        |
| 7   | Flexibility and Efficiency      | 2     | **⌘K badge shown but not wired.** No keyboard nav                |
| 8   | Aesthetic and Minimalist Design | 4     | Clean dark theme, data-forward, no decoration                    |
| 9   | Error Recovery                  | 3     | Retry button on live error. No undo for accidental panel dismiss |
| 10  | Help and Documentation          | 1     | No help, no tooltips, no "what's this?" hints                    |

**Total: 32/40 — Good**

## Anti-Patterns

- **Clean.** Homepage is slop-free. Detail panel has 3 tiny uppercase tracked eyebrows (STARS / 7D GAIN / CREATED) — minor P3.
- **Detector:** 1 advisory — `#8B6914` undocumented in DESIGN.md (valid amber-muted token, design doc stale).

## Priority Issues

- **P0 — ⌘K badge, no handler.** `⌘K` rendered in SearchInput but no `keydown` listener. Adding `useEffect` with `(metaKey||ctrlKey)+K → inputRef.focus()` is ~5 lines.
- **P1 — WCAG contrast failures.** amber-muted (`#8B6914`) on amber-bg (`#1A1200`) = ~2.8:1. Fails 4.5:1 minimum. Affects header subtext, column headers, placeholder text. Fix: use `#CCA060` for secondary text.
- **P1 — Sparkline `preserveAspectRatio="none"` distorts.** Data viz must not distort. Switch to `xMidYMid meet`.
- **P2 — RepoCard rows not keyboard accessible.** `div` with `onClick` lacks `role="button"`, `tabIndex`, `onKeyDown`. Add keyboard semantics.
- **P2 — Brand says "no rounded corners", code uses them.** Nav pill `rounded-xl`, search `rounded-lg`, stat cards `rounded-lg`. Brand statement needs aligning with implementation.

## Persona Red Flags

- **Sam (Accessibility):** WCAG AA fails on body text, keyboard nav broken, search lacks `aria-label`, filtered empty state lacks `aria-live`.
- **Alex (Power User):** ⌘K dead, no keyboard row navigation, no data export.

## Minor Observations

- Footer `·` vs `&middot;` inconsistency
- `font-mono` class overrides JetBrains_Mono variable on `<body>`
- Search input missing `aria-label="search repos"`
- Sort buttons missing `aria-sort` attribute
- Panel `border-l` disappears on mobile (fine)

## Detector Findings

1 advisory: `#8B6914` in RepoDetail.tsx not in DESIGN.md — false positive (it IS amber-muted in tailwind config).
