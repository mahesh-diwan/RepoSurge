# Product

## Register

product

## Platform

web

## Users

Developers — primarily open-source maintainers, tech leaders, and investors who track which GitHub projects are gaining traction. They are technically sophisticated, impatient, scan-heavy, and value terminal-fast UX over decorative interfaces. They land already knowing what a star count is; RepoSurge does not need to explain GitHub.

Secondary audience: hiring managers or portfolio reviewers evaluating the developer's craftsmanship. They scan for attention to detail, testing, CI/CD, and design taste.

## Product Purpose

Track and compare GitHub repository star velocity at a glance. Sorted views (daily, weekly, monthly) reveal which repos are rising fastest, with live polling for real-time deltas. Success is a user landing, scanning the leaderboard, and instantly knowing who is growing fast and why.

## Positioning

Terminal-fast star velocity analytics. Not a full GitHub dashboard — a focused velocity lens that trades feature breadth for immediate comprehension.

## Brand Personality

**Playful, competitive, live.** The green-on-black terminal aesthetic is not a gimmick — it's a metaphor for performance data delivered with urgency. The glow effects, live badges, and rising-star deltas frame repo tracking as a race, not a report. Voice is terse, direct, and slightly fun (emoji-free, but "gained +1,593" is allowed to feel like a scoreboard).

## Anti-references

- Generic SaaS dashboards with cards, sidebar nav, and muted gray-on-white
- Any design that uses gradient text, glassmorphism, or decorative illustrations
- "Startup landing page" patterns (hero-metric template, numbered section markers, eyebrow kickers)
- GitHub's own UI — RepoSurge is complementary, not a clone

## Design Principles

1. **Practice what you preach.** A tool about speed should load fast. Every byte and animation justifies itself. (Removed `motion` library for this reason.)
2. **Show, don't tell.** Sparklines, gain numbers, and live deltas convey more than paragraphs. The rank list is the insight.
3. **Terminal confidence.** Flat rows, monospace font, no rounded corners, no shadows on containers. The green glow on interactive elements rewards action without implying uncertainty.
4. **One job, done well.** No full GitHub dashboard ambitions. Velocity is the axis; everything else is secondary.
5. **Accessible speed.** High contrast (5.3:1 minimum), keyboard navigable, screen-reader friendly.

## Accessibility & Inclusion

- WCAG AA minimum (4.5:1 normal text, 3:1 large text). Current dim (#999 on #0A0A0A = 5.3:1) passes AA.
- Reduced motion respected via `prefers-reduced-motion` guard on all animations.
- Skip-to-content link for keyboard users.
- All interactive elements are `<a>` or `<button>`, keyboard accessible.
- Focus-visible rings visible (1px green with 2px offset).
- Touch targets ≥24×24px (WCAG 2.5.8).
