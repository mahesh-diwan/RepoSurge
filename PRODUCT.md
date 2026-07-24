# Product

## Register

product

## Platform

web

## Users

Developers — primarily open-source maintainers, tech leaders, and investors who track which GitHub projects are gaining traction. They are technically sophisticated, impatient, scan-heavy, and value a clean fast UX over decorative interfaces. They land already knowing what a star count is; RepoSurge does not need to explain GitHub.

Secondary audience: hiring managers or portfolio reviewers evaluating the developer's craftsmanship. They scan for attention to detail, testing, CI/CD, and design taste.

## Product Purpose

Track and compare GitHub repository star velocity at a glance. Sorted views (daily, weekly, monthly) reveal which repos are rising fastest, with live polling for real-time deltas. Success is a user landing, scanning the leaderboard, and instantly knowing who is growing fast and why.

## Positioning

Clean star velocity analytics. Not a full GitHub dashboard — a focused velocity lens that trades feature breadth for immediate comprehension. The aesthetic is borrowed from opencode.ai: dark, minimal, data-first, confident.

## Brand Personality

**Clean, direct, modern.** The dark-on-dark theme is not a gimmick — it lets the data breathe. Clean sans-serif typography on a dark background, with indigo for interactive affordances and emerald/rose for semantic data. The design feels like looking at a clean dashboard that happens to be about code, not a developer tool that pretends to be a terminal. Voice is terse, direct, and confident. No emojis, no puns, no "terminal" metaphor.

## Anti-references

- Terminal/phosphor green aesthetics — glow effects, monochrome-only font, CRT metaphors
- Generic SaaS dashboards with cards, sidebar nav, and muted gray-on-white
- Any design that uses gradient text, glassmorphism, or decorative illustrations
- "Startup landing page" patterns (hero-metric template, numbered section markers, eyebrow kickers)
- GitHub's own UI — RepoSurge is complementary, not a clone

## Design Principles

1. **Data is the interface.** Sparklines, gain numbers, and live deltas convey more than paragraphs. The rank list is the insight.
2. **Clean is fast.** A tool about speed should feel fast. Every visual element justifies its place on the page. No decoration.
3. **Flat surfaces.** No shadows on containers, no glow effects. Interactive elements signal state through background color and underline, not elevation.
4. **One job, done well.** No full GitHub dashboard ambitions. Velocity is the axis; everything else is secondary.
5. **Accessible speed.** High contrast, keyboard navigable, screen-reader friendly. Focus-visible rings on every interactive element.

## Accessibility & Inclusion

- WCAG AA minimum (4.5:1 normal text, 3:1 large text). Onyx (`#E5E5E5`) on midnight (`#0A0A0A`) = 15.4:1. Silver (`#888888`) on midnight = 5.3:1. Both pass AA.
- Reduced motion respected via `prefers-reduced-motion` guard on all animations.
- Skip-to-content link for keyboard users.
- All interactive elements are `<a>` or `<button>`, keyboard accessible.
- Focus-visible rings visible (2px indigo offset).
- Touch targets ≥24×24px (WCAG 2.5.8).
