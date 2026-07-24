---
name: RepoSurge
description: Clean star velocity tracker for GitHub repos
colors:
  primary: "#5B7FFF"
  neutral-bg: "#0A0A0A"
  neutral-text: "#E5E5E5"
  neutral-muted: "#888888"
  surface: "#111111"
  border: "#222222"
  positive: "#34D399"
  negative: "#F87171"
typography:
  body:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
  heading:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: clamp(1.5rem, 4vw, 2rem)
    fontWeight: 600
    lineHeight: 1.2
  mono:
    fontFamily: '"JetBrains Mono", ui-monospace, monospace'
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
  button:
    fontFamily: "system-ui, -apple-system, sans-serif"
    fontSize: 13px
    fontWeight: 500
rounded:
  none: "0px"
  sm: "4px"
  md: "8px"
  lg: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
---

# Design System: RepoSurge

## 1. Overview

**Creative North Star: "Clean Analytics, No Clutter"**

RepoSurge is a focused star velocity analytics tool — not a full GitHub dashboard, not a dashboard at all. It's a single-page leaderboard that lets developers quickly scan which repos are rising and understand the growth pattern at a glance. The design borrows from opencode.ai's approach: dark background, clean sans-serif typography, generous whitespace, minimal chrome, and data-first hierarchy.

Every design decision serves a single goal: let a developer land, scan, and understand repo growth velocity in under 5 seconds.

**Key Characteristics:**

- Clean sans-serif system font for headings and body text; JetBrains Mono reserved for data elements only (star counts, sparklines, timestamps).
- Flat surfaces with no shadows on containers. Interactive elements use subtle background color shifts on hover.
- Dark theme throughout. No gradients, no glow effects, no glassmorphism.
- Spacious layout with generous vertical rhythm. The dark background breathes.
- Data carries the visual weight — sparklines, gain numbers, and live deltas are the primary visual signals.

## 2. Colors

Three-color system with one accent and semantic data colors. No secondary or tertiary palette.

### Background

- **Midnight** (`#0A0A0A`): The body background. All surfaces rest on this.
- **Surface** (`#111111`): Used for cards, panels, and elevated surfaces (1px above midnight).
- **Border** (`#222222`): Subtle dividers between sections.

### Text

- **Onyx** (`#E5E5E5`): Primary text color for headings, repo names, and body content.
- **Silver** (`#888888`): Secondary text for labels, nav links, timestamps, and helper text.

### Accent

- **Indigo** (`#5B7FFF`): The sole accent color. Used for interactive elements — links, active nav pills, focus rings, buttons, sparkline gradients. Never used as a background or for large surface fills. Its rarity is the point — when it appears (active state, hover), it signals action.

### Semantic Data Colors

- **Emerald** (`#34D399`): Positive growth indicators — gain numbers, upward trends, live "new" badges.
- **Rose** (`#F87171`): Negative indicators — declined repos, losses.

### Named Rules

**The Single Accent Rule.** Indigo (`#5B7FFF`) is the only accent color. It is used on ≤10% of any screen. When it appears (active nav, hover underline, focus ring), it commands attention without shouting.

**The No-Surface-Rule.** Surfaces are flat at rest. No shadows on containers, no glow effects, no box-shadow on cards or rows. Elevation is conveyed through surface color (`#111111` for cards, `bg-surface` for subtle lift).

**Data-First Color.** Growth and velocity data carries its own semantic color (emerald for positive, rose for negative). Accent indigo is only for interactive affordances, not data decoration.

## 3. Typography

**Font stack:** System UI sans-serif (`system-ui, -apple-system, sans-serif`) for all text except data elements. JetBrains Mono (`"JetBrains Mono", ui-monospace, monospace`) is used only for numeric data — star counts, sparkline values, timestamps, and code snippets.

### Hierarchy

- **Display** (600, `clamp(1.5rem, 4vw, 2rem)`, 1.15): Page headings, repo names on detail page. Clean and authoritative.
- **Body** (400, `15px`, 1.6): Descriptions, prose, repo detail text. Max line length caps at 70ch.
- **Label** (500, `11px`, 1): Stat headers ("stars", "gained", "velocity", "created"), nav labels, button text, badge text.
- **Data** (400, `13px`, 1.5): Star counts, sparkline values, timestamps. Mono only here.

### Named Rules

**The Data-Mono Rule.** Monospace is used only for numbers and code, never for prose or interface labels. This keeps the UI feeling clean and modern while preserving readability of numeric data.

## 4. Elevation

Flat by default. No shadows on containers. Surfaces are differentiated by background color, not elevation.

- **Surface** (`bg-surface #111111`): Cards, panels, and elevated elements get a slightly lighter background than the body.
- **Hover** (`bg-surface` or subtle color shift): Interactive elements shift background color on hover, not shadow or elevation.
- **Focus ring** (`box-shadow: 0 0 0 2px #5B7FFF`): Applied via `:focus-visible` on all interactive elements. Indigo, not amber.

### Named Rules

**The Flat-By-Default Rule.** No container shadows, no box-shadow on rows or cards. The surface color difference (`#0A0A0A` body vs `#111111` card) is the only elevation signal.

## 5. Components

### Header / Hero

- **Shape:** Centered text block, generous vertical padding (`pt-24 pb-12`).
- **Heading:** Display weight, onyx color, tight tracking.
- **Description:** Silver body text, max-width constrained, centered.
- **Install snippet:** Inline code block with dark background, monospace, copy action. Clean and copyable — like opencode.ai's install command.
- **Stats row:** Three simple numbers (total repos, total stars, languages) in a single horizontal row, labels below each number, muted silver. No live counters — static or updated on refresh only.

### Nav

- **Shape:** Fixed top, full-width, minimal.
- **Default:** Transparent background, silver text for links.
- **Active:** Indigo text color, thin bottom border (`border-b-2 border-accent`).
- **Hover:** Onyx text color.
- **Mobile:** Hamburger toggle, slide-over panel with surface background.

### RepoList (leaderboard rows)

- **Shape:** Flat horizontal rows, no border, no container. Alternating `bg-transparent` / `bg-surface/50` subtle row tint for scanability.
- **Layout:** rank (32px) | sparkline (hidden on mobile) | repo name (flex-1, truncated) | gained value (70px min) | stars count (60px).
- **Spacing:** `py-3` vertical padding, `gap-3` between columns.
- **Hover:** Subtle surface tint (`bg-surface/[0.06]`). Repo name shifts to accent indigo.
- **Rank:** `text-muted tabular-nums text-xs`, right-aligned, 32px wide.
- **Repo name:** `text-body text-sm`, `truncate`, `title` attr for full name on overflow.
- **Gained value:** `tabular-nums font-semibold text-xs`. Emerald if positive, rose if negative, silver if zero.
- **Sparkline:** Inline SVG sparkline. Horizontal bar chart. Accent indigo fill gradient. Hidden below `sm` breakpoint.

### RepoDetail (slide-out panel)

- **Shape:** Full-height right panel on desktop, full-screen overlay on mobile. Surface background (`bg-surface`).
- **Header:** Repo name (display weight), description (body text), "View on GitHub" link (accent indigo, underline).
- **Stats row:** Three inline stat blocks — Stars (plain number), 7d Gain (colored by semantic data), Created (date).
- **Sparkline:** Larger sparkline (`h-36` / 144px). Same accent indigo gradient.
- **Close button:** Top-right, subtle, accessible (Esc key).

### SearchInput

- **Shape:** Full-width input with `>` prompt character (decorative, `aria-hidden="true"`), rounded corners `rounded-md`.
- **Default:** `bg-transparent`, `border border-border`, `text-body`, `placeholder-silver`.
- **Focus:** `border-accent` and subtle `bg-surface/50` background tint.
- **Spacing:** `px-4 py-2.5 text-sm`. The `>` sits at `left-4` inside the input.

### PeriodNav

- **Shape:** Flat text links in a row. No container, no pills.
- **Current period:** `text-accent font-medium` (accent indigo, not bold).
- **Other periods:** `text-muted hover:text-body transition-colors` (system-ui Link for prefetching).
- **Optional label:** "Period:" prefix in `text-muted` when `showLabel` is true.

### Live Indicator

- **Dot:** `inline-block w-2 h-2 rounded-full bg-positive` (emerald) when live. `bg-silver` when polling.
- **Label:** `text-label text-silver` — "live" or "polling" text next to the dot.

### "View on GitHub" button

- **Shape:** Inline text link, no border, no background.
- **Default:** `text-accent text-sm`.
- **Hover:** Underline + `text-accent/80`.
- **States:** Always links to real URL. No disabled state.

### Error / 404 Page

- **Shape:** Centered content block, max-width `max-w-md`.
- **Heading:** Display weight, onyx color.
- **Message:** Silver body text.
- **Link:** Accent indigo, underlined on hover.

## 6. Do's and Don'ts

### Do:

- **Do** use indigo (`#5B7FFF`) sparingly — the single accent on interactive elements only.
- **Do** keep surfaces flat at rest. No shadows, no glow, no glassmorphism.
- **Do** use system sans-serif for all prose; JetBrains Mono for data/numbers only.
- **Do** use generous vertical spacing between rows and sections to let the dark background breathe.
- **Do** use semantic data colors (emerald/rose) for gain indicators — the data speaks for itself.
- **Do** use `tabular-nums` for all numeric data so numbers don't shift during updates.
- **Do** add `title` attributes on truncated text for overflow tooltips.
- **Do** use clean, system-ui font for all UI text — no monospace for labels or button text.

### Don't:

- **Don't** use cards with full rounded corners as the primary layout primitive. Use flat rows with subtle background tints.
- **Don't** use gradients as decoration (gradient text, gradient backgrounds on containers).
- **Don't** use glassmorphism or backdrop blur as a default surface treatment.
- **Don't** use a second sans-serif font — one system-ui stack for everything except mono data.
- **Don't** use generic SaaS dashboard patterns: no sidebar nav, no stat cards, no header metrics with live counters.
- **Don't** use border-left stripes, numbered section markers, or uppercase tracked eyebrows.
- **Don't** use shadows on containers — no `shadow-lg`, `shadow-xl`, `shadow-2xl` on any container.
- **Don't** stretch nav items — they must be content-sized.
- **Don't** use the word "terminal", "green", or "phosphor" anywhere in the interface or brand copy.
- **Don't** show the same sparkline size on list and detail views — list sparklines should be `hidden` on mobile, detail sparklines visible always.
