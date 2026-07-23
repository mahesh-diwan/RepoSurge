---
name: RepoSurge
description: Terminal velocity tracker for GitHub repos
colors:
  primary: "#00FF41"
  neutral-bg: "#0A0A0A"
  neutral-text: "#F5F5F0"
  neutral-muted: "#999999"
typography:
  label:
    fontFamily: '"JetBrains Mono", ui-monospace, monospace'
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1
  title:
    fontFamily: '"JetBrains Mono", ui-monospace, monospace'
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: '"JetBrains Mono", ui-monospace, monospace'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
  display:
    fontFamily: '"JetBrains Mono", ui-monospace, monospace'
    fontSize: clamp(1.5rem, 4vw, 1.875rem)
    fontWeight: 700
    lineHeight: 1.1
rounded:
  none: "0px"
  sparkline-bar: "1px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  nav-pill:
    backgroundColor: transparent
    textColor: "{colors.neutral-muted}"
    rounded: "{rounded.none}"
    padding: "12px 8px"
  nav-pill-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.none}"
    padding: "12px 8px"
  row-hover:
    backgroundColor: "#00FF4115"
  view-on-github:
    textColor: "{colors.primary}"
    borderColor: "{colors.primary} / 50%"
    padding: "6px 12px"
---

# Design System: RepoSurge

## 1. Overview

**Creative North Star: "The Leaderboard Terminal"**

RepoSurge is a competitive leaderboard rendered through a terminal lens — green phosphor on deep black, flat rows, and glow rewards for action. The system rejects all SaaS dashboard conventions: no cards, no sidebars, no rounded corners, no decorative illustrations. Every interface decision serves a single goal: let a developer scan the rising-repo ranking at a glance and immediately see who is winning.

Spacing is generous (the black background breathes), but the data density is high. The glow is earned — appearing only on interactive elements (hover, focus, active state) and on the live delta badges. Resting state is flat and dark.

**Key Characteristics:**

- Monospaced throughout. One font, one weight range (400–700).
- Flat surfaces with green glow as the only elevation signal.
- Rows, not cards. Leaderboard logic, not dashboard logic.
- High contrast: `#00FF41` on `#0A0A0A` is 15.4:1. Dim `#999` on `#0A0A0A` is 5.3:1.
- Green selection highlight — select any text to see the phosphor glow inverted.

## 2. Colors

A two-color system with a single accent and two neutrals. No secondary or tertiary palette.

### Primary

- **Terminal Green** (`#00FF41`): The sole accent. Used for active nav pills, interactive element borders on focus, glow shadows, live delta badges, the logo, gained numbers, sparkline gradients, and the selection highlight. Never used as a background for more than 10% of any screen.

### Neutral

- **Midnight** (`#0A0A0A`): The body background. All surfaces rest on this. The only background color.
- **Bone** (`#F5F5F0`): Primary text color for headings, repo names, and body content. Near-white with a slight warm tilt to contrast against the pure green.
- **Dim** (`#999`): Secondary text for labels, nav links (inactive), rank numbers, timestamps, and helper text. Achieves 5.3:1 contrast on midnight — passes WCAG AA.

### Named Rules

**The Single Accent Rule.** Terminal green is the only accent color. It is used on ≤10% of any screen. Its rarity is the point — when the green appears (active pill, glow, live badge), it commands attention.

**The No-Surface Rule.** No surface uses a different background than midnight. Containers are implied by spacing and borders (`border-[#1a1a1a]`), never by a separate fill. Row hover is a `00FF41` at 3% opacity — barely green, but enough to show life.

## 3. Typography

**Font:** JetBrains Mono (with `ui-monospace, monospace` fallback), loaded via `next/font` with `display: swap`. Single font throughout — no display/body pairing.

**Character:** Terminal-terse. Monospace compresses naturally; the character shapes of JetBrains Mono are wider and more readable than generic mono fonts. At 10px label size, the monospace is still legible — intentional for the terminal feel.

### Hierarchy

- **Display** (700, `clamp(1.5rem, 4vw, 1.875rem)`, 1.1): Page titles and the logo. The logo uses a `Ø` with no text-shadow to punctuate the glow.
- **Body** (400, `14px`, 1.4): Repo names, descriptions, detail page body. Max line length caps at 75ch.
- **Title** (400, `12px`, 1): Nav links, period nav labels, stat labels, filter input text. The workhorse size for interface copy.
- **Label** (400, `10px`, 1): Stat headers ("stars", "gained", "velocity", "created"), footer text, "view on github" button, live delta badge. Tiniest visible size — reserved for secondary information only.

### Named Rules

**The One-Font Rule.** Every visible character is JetBrains Mono. No serif, no sans-serif, no second mono. The font IS the container.

## 4. Elevation

Flat by default. Elevation is conveyed exclusively through green glow on interactive states — never through shadows, never through tonal layering. A surface at rest is a flat rectangle on midnight.

- **Hover glow** (`drop-shadow: 0 0 4px #00FF41`): Applied to gained numbers on repo rows and the "view on github" button.
- **Focus glow** (`box-shadow: 0 0 8px rgba(0, 255, 65, 0.4)`): Applied via `:focus-visible` on all interactive elements.
- **Active pill glow** (`box-shadow: 0 0 8px #00FF41/30`): Applied to the currently active nav pill.
- **Logo glow** (`text-shadow: 0 0 8px rgba(0, 255, 65, 0.3)`): Always-on, very subtle, identifies the brand.
- **Glow pulse** (`@keyframes glow-pulse`): The logo glow animates subtly to imply a live system.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Glow appears only as a response to state (hover, focus, active). No container shadows, no box-shadow on cards or rows.

## 5. Components

### NavLinks

- **Shape:** Square pills — `rounded-none`, `px-3`, `py-1.5`.
- **Default:** `text-dim` on transparent background.
- **Active:** `bg-terminal text-midnight font-bold` with a `8px` green glow (`shadow-[0_0_8px_#00FF41/30]`).
- **Hover:** `bg-terminal/10 text-bone`.
- **A11y:** `aria-current="page"` on active link. Wrapped in `<nav role="navigation" aria-label="main">`.

### RepoCard (list row)

- **Shape:** Flat horizontal row, no border, no container.
- **Layout:** rank (32px) | repo name (flex-1, truncated) | sparkline (hidden on mobile) | gained value (80px min) | live delta badge.
- **Spacing:** `py-4` (generous vertical padding between rows), `gap-4` between columns.
- **Hover:** `bg-terminal/[0.03]` subtle row highlight. Rank number turns terminal green. Repo name turns terminal green. Gained number gets `drop-shadow-[0_0_4px_#00FF41]`.
- **Rank:** `text-dim tabular-nums text-xs`, right-aligned, 32px wide.
- **Repo name:** `text-bone text-sm`, `truncate`, `title` attr for full name on overflow. `max-w-[55vw]` on mobile, unlimited on desktop.
- **Gained value:** `tabular-nums font-bold text-xs`. Green if positive, red if negative, dim if zero. Drop-shadow glow on hover.

### StarChart (sparkline)

- **Shape:** Vertical bars filling available width and height. Bar width = `100% / data.length`.
- **Style:** `bg-gradient-to-t from-terminal/20 to-terminal/70`, `rounded-[1px]`.
- **Group hover:** `group-hover:bg-terminal` — full green on row hover.
- **Accessibility:** `role="img"`, `aria-roledescription="sparkline chart"`, `aria-label="star history"`.
- **States:** Empty/null data → returns null. Single value → fills full height (min-height floor at 4px).

### SearchInput

- **Shape:** Full-width input with `>` prompt character (decorative, `aria-hidden="true"`).
- **Default:** `bg-transparent`, `border border-[#1a1a1a]`, `text-bone`, `placeholder-dim`.
- **Focus:** `border-terminal` and `bg-terminal/5` background tint.
- **Spacing:** `pl-7 pr-3 py-2 text-xs`. The `>` sits at `left-3` inside the input.

### "view on github" button

- **Shape:** Inline border-only — `border border-terminal/50`, `px-3 py-1.5`.
- **Default:** `text-terminal text-xs`.
- **Hover:** `bg-terminal/10`, `hover:shadow-[0_0_8px_#00FF41/30]`.
- **States:** No disabled state — not applicable (always links to a real URL).

### PeriodNav

- **Shape:** Flat text links in a row. No container.
- **Current period:** `text-terminal font-bold` (plain text, not a link).
- **Other periods:** `text-dim hover:text-terminal transition-colors` (Next.js `<Link>` for prefetching).
- **Optional label:** "period:" prefix in `text-dim` when `showLabel` is true.

### MobileNav

- **Toggle:** Hamburger icon (`☰` / `✕`), `text-dim hover:text-terminal`. Touch target padded to 44×44px via `p-3 -m-3` pattern. Placed inside `z-[51]` wrapper to stay above the overlay.
- **Overlay:** Fixed fullscreen dialog, `z-50`, `bg-midnight/95 backdrop-blur-sm`. Opens with `animate-fade-in` (200ms ease-out). Closes on backdrop click or Escape key.
- **Dialog:** `role="dialog"`, `aria-modal="true"`, `aria-label="navigation"`. Contains `<NavLinks>` in a centered column.

## 6. Do's and Don'ts

### Do:

- **Do** use terminal green (`#00FF41`) sparingly — the single accent rules.
- **Do** keep surfaces flat at rest. Glow only on interaction.
- **Do** use JetBrains Mono for every visible character.
- **Do** use generous vertical spacing (`py-4` on rows, `mt-32` on footer) to let the black background breathe.
- **Do** use gradient sparklines (`from-terminal/20 to-terminal/70`) — the gradient makes them feel alive.
- **Do** use `tabular-nums` for all numeric data so numbers don't shift during updates.
- **Do** add `title` attributes on truncated text for overflow tooltips.

### Don't:

- **Don't** use cards, sidebars, rounded corners, or container shadows.
- **Don't** use gradient text, glassmorphism, or decorative illustrations.
- **Don't** use a second font family — no serif, no sans-serif alternative.
- **Don't** use generic SaaS dashboard patterns: no sidebar nav, no stat cards, no header metrics.
- **Don't** use border-left stripes, numbered section markers (01/02/03), or uppercase tracked eyebrows.
- **Don't** use shadows on containers — only green glow on interactive elements.
- **Don't** stretch nav pills — they must be content-sized (`px-3 py-1.5` with no explicit width).
- **Don't** show the same sparkline size on detail page as list — detail sparkline gets `h-32` (128px).
