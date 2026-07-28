# High-End Visual Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Transform RepoSurge from minimal dark dashboard to premium Ethereal Glass experience with Fluid Island nav, Asymmetrical Bento grid, Double-Bezel cards, and cinematic motion.

**Architecture:** Layered approach — CSS foundation first (tailwind config, globals, fonts), then layout/nav, then component-level visual upgrades (cards, grid, charts, detail pages). Each layer builds on the previous.

**Tech Stack:** Next.js 14.2.29, Tailwind CSS, Geist font (via `next/font/google`), JetBrains Mono (existing), IntersectionObserver API

**Global Constraints:**

- No banned fonts (Inter, Roboto, Arial, Open Sans, Helvetica)
- No standard 1px solid gray borders on premium surfaces
- No `linear` or `ease-in-out` transitions — custom cubic-bezier only: `ease-[cubic-bezier(0.32,0.72,0,1)]`
- All interactive elements use `transform` + `opacity` only for animation
- `backdrop-blur` only on fixed/sticky elements
- All cards use Double-Bezel nested architecture
- Layout collapses to single column below 768px
- Accessible: `prefers-reduced-motion` respected, keyboard navigation preserved, `min-h-[100dvh]` not `h-screen`

---

### Task 1: Foundation — Tailwind Config, Globals, Fonts

**Files:**

- Modify: `tailwind.config.ts` (all), `app/globals.css` (all), `app/layout.tsx` (lines 1-27)

**Interfaces:**

- Consumes: existing color palette (midnight, surface, border, text-body, text-muted, accent, positive, negative)
- Produces: `animate-blur-in`, `animate-stagger-1/2/3/4`, `bg-glass`, `border-glass`, `shadow-glass-inset` utility classes; `body::before` noise overlay; radial gradient orbs; Geist font variable `--font-geist`

- [ ] **Step 1: Update tailwind.config.ts**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0A0A0A",
        surface: "#111111",
        border: "#222222",
        "text-body": "#E5E5E5",
        "text-muted": "#888888",
        accent: "#5B7FFF",
        positive: "#34D399",
        negative: "#F87171",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      animation: {
        "blur-in": "blur-in 0.8s cubic-bezier(0.32,0.72,0,1) forwards",
        "fade-in": "fade-in 0.2s ease-out",
        "stagger-1":
          "stagger-in 0.6s cubic-bezier(0.32,0.72,0,1) 100ms forwards",
        "stagger-2":
          "stagger-in 0.6s cubic-bezier(0.32,0.72,0,1) 200ms forwards",
        "stagger-3":
          "stagger-in 0.6s cubic-bezier(0.32,0.72,0,1) 300ms forwards",
        "stagger-4":
          "stagger-in 0.6s cubic-bezier(0.32,0.72,0,1) 400ms forwards",
      },
      keyframes: {
        "blur-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(4rem)",
            filter: "blur(8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
            filter: "blur(0)",
          },
        },
        "stagger-in": {
          "0%": { opacity: "0", transform: "translateY(1.5rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Update app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #050505;
    color: #e5e5e5;
    scroll-behavior: smooth;
  }

  body {
    min-height: 100dvh;
    position: relative;
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    background:
      radial-gradient(
        ellipse 80% 60% at 15% 10%,
        rgba(91, 127, 255, 0.04) 0%,
        transparent 60%
      ),
      radial-gradient(
        ellipse 60% 50% at 85% 85%,
        rgba(139, 92, 246, 0.03) 0%,
        transparent 60%
      );
  }

  body::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.015'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 256px 256px;
  }

  ::selection {
    background: #5b7fff;
    color: #0a0a0a;
  }

  ::-moz-selection {
    background: #5b7fff;
    color: #0a0a0a;
  }

  :focus-visible {
    outline: 2px solid #5b7fff;
    outline-offset: 2px;
    box-shadow:
      0 0 0 2px #050505,
      0 0 8px rgba(91, 127, 255, 0.4);
  }

  a {
    text-decoration: none;
    color: inherit;
  }
}

@layer components {
  .glass {
    background: rgba(17, 17, 17, 0.6);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .glass-strong {
    background: rgba(17, 17, 17, 0.85);
    backdrop-filter: blur(32px);
    -webkit-backdrop-filter: blur(32px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .card-outer {
    padding: 3px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 1.25rem;
    outline: 1px solid rgba(255, 255, 255, 0.06);
    outline-offset: -1px;
    transition: background 0.4s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .card-outer:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  .card-inner {
    background: #111111;
    border-radius: calc(1.25rem - 3px);
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.08);
    transition: transform 0.4s cubic-bezier(0.32, 0.72, 0, 1);
  }

  .card-outer:hover .card-inner {
    transform: scale(1.01);
  }

  .card-inner:active {
    transform: scale(0.98);
  }
}

@layer utilities {
  .data-mono {
    font-family: var(--font-jetbrains), ui-monospace, monospace;
  }
}

.is-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
  filter: blur(0) !important;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Update app/layout.tsx — add Geist font, update body class**

```tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import MobileNav from "@/components/MobileNav";
import LastUpdated from "@/components/LastUpdated";
import NavLinks from "@/components/NavLinks";
import { NAV_LINKS } from "@/lib/nav-links";
import { getLastUpdated } from "@/lib/db";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "reposurge - repos rising. fast.",
  description: "star velocity tracker for github repos",
  icons: { icon: "/favicon.svg" },
};

const lastUpdated = getLastUpdated();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${jetbrains.variable}`}>
      <body className="font-sans bg-midnight relative z-[2]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-surface focus:text-accent focus:outline-1 focus:outline-accent"
        >
          skip to content
        </a>
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className="card-outer !p-[1px] !rounded-full">
            <div className="glass !rounded-full flex items-center gap-6 px-5 py-2 !border-0 !bg-midnight/60">
              <a
                href="/"
                className="text-accent font-bold tracking-wider text-sm"
                title="RepoSurge"
              >
                RS
              </a>
              <NavLinks links={NAV_LINKS} />
              <MobileNav />
            </div>
          </div>
        </nav>

        <div
          id="main-content"
          className="relative z-[2] pt-24 mx-4 md:mx-8 lg:mx-auto max-w-7xl p-4 md:p-6 mb-8"
        >
          {children}
        </div>

        <footer aria-label="site footer" className="py-6 mt-16 relative z-[2]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="glass !rounded-full px-6 py-3 flex items-center justify-between">
              <p className="text-text-muted text-[10px] sm:text-xs">
                data: github api &middot; refreshed daily
              </p>
              {lastUpdated && <LastUpdated dateStr={lastUpdated} />}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Build to verify**

Run: `next build`
Expected: 0 errors, all routes compiled

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.ts app/globals.css app/layout.tsx
git commit -m "feat: design foundation — geist font, glass utilities, noise overlay, orbs"
```

---

### Task 2: Navigation — Fluid Island, Hamburger Morph, Staggered Overlay

**Files:**

- Modify: `components/MobileNav.tsx` (all), `components/NavLinks.tsx` (all)

**Interfaces:**

- Consumes: `glass`, `card-outer`, `card-inner` CSS classes from Task 1
- Produces: Nav floating pill with double-bezel shell; hamburger morphs to X with rotation; overlay menu with staggered link reveal

- [ ] **Step 1: Update NavLinks.tsx — underline-from-center hover**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks({
  links,
  onItemClick,
}: {
  links: { href: string; label: string }[];
  onItemClick?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav
      role="navigation"
      aria-label="main"
      className="hidden md:flex items-center gap-1"
    >
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onItemClick}
            className={`relative text-xs px-3 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-300 ${
              isActive
                ? "text-accent font-medium"
                : "text-text-muted hover:text-text-body"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {link.label}
            <span
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-accent transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
                isActive ? "w-4" : "w-0"
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Update MobileNav.tsx — hamburger morph, staggered overlay**

```tsx
"use client";

import { useState, useRef, useEffect } from "react";
import NavLinks from "./NavLinks";
import { NAV_LINKS } from "@/lib/nav-links";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusable = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function trap(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    dialog.addEventListener("keydown", trap);
    return () => dialog.removeEventListener("keydown", trap);
  }, [open]);

  return (
    <>
      <div className="relative z-[51] md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="relative w-6 h-6 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`absolute block w-4 h-[1.5px] bg-current transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
              open ? "rotate-45" : "-translate-y-[3.5px]"
            }`}
            style={{ color: open ? "#5B7FFF" : "#888888" }}
          />
          <span
            className={`absolute block w-4 h-[1.5px] bg-current transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
              open ? "-rotate-45" : "translate-y-[3.5px]"
            }`}
            style={{ color: open ? "#5B7FFF" : "#888888" }}
          />
        </button>
      </div>

      {open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="navigation"
          aria-hidden={!open}
          className="fixed inset-0 z-40 glass-strong flex items-center justify-center md:hidden animate-fade-in"
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
        >
          <nav
            className="flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="opacity-0 animate-stagger-1">
              <NavLinks links={NAV_LINKS} onItemClick={close} />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 3: Build to verify**

Run: `next build`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add components/MobileNav.tsx components/NavLinks.tsx
git commit -m "feat: fluid island nav — morph hamburger, stagger overlay"
```

---

### Task 3: Scroll Reveal with Blur + Hero Eyebrow

**Files:**

- Modify: `components/ScrollReveal.tsx` (all), `components/Header.tsx` (all), `components/RepoList.tsx` (lines 102-116 — search bar area)

**Interfaces:**

- Consumes: `animate-blur-in` keyframe from Task 1
- Produces: ScrollReveal with blur effect; Header with eyebrow tag

- [ ] **Step 1: Update ScrollReveal.tsx — IntersectionObserver with blur**

```tsx
"use client";

import { useEffect, useRef, ReactNode } from "react";

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (el.classList.contains("is-visible")) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(4rem)";
    el.style.filter = "blur(8px)";
    el.style.transitionDelay = `${delay}s`;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            (entry.target as HTMLElement).style.opacity = "";
            (entry.target as HTMLElement).style.transform = "";
            (entry.target as HTMLElement).style.filter = "";
            (entry.target as HTMLElement).style.transitionDelay = "";
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[800ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Update Header.tsx — eyebrow tag + glass hero**

```tsx
export default function Header() {
  return (
    <section className="px-6 pt-24 pb-16 text-center relative z-[2]">
      <div className="max-w-2xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full glass text-[10px] uppercase tracking-[0.2em] font-medium text-accent mb-6">
          live github rankings
        </span>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none text-text-body mb-4">
          REPOSURGE
        </h1>
        <p className="text-text-muted text-sm md:text-base leading-relaxed mb-6 max-w-lg mx-auto">
          Track GitHub repo velocity in real-time. See which projects are rising
          fastest, compare star growth, and discover trending repos at a glance.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Build to verify**

Run: `next build`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add components/ScrollReveal.tsx components/Header.tsx
git commit -m "feat: blur scroll reveal, hero eyebrow tag"
```

---

### Task 4: Repo Cards — Double-Bezel + Asymmetrical Bento Grid

**Files:**

- Modify: `components/RepoCard.tsx` (all), `components/RepoList.tsx` (lines 130-211)

**Interfaces:**

- Consumes: `card-outer`, `card-inner`, `glass` CSS classes from Task 1
- Produces: Double-bezel cards with magnetic hover; asymmetrical grid (top 3 hero cards span wider); button-in-button pattern for actions

- [ ] **Step 1: Update RepoCard.tsx — double-bezel shell, magnetic hover, button-in-button**

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
  onSelect,
  hero = false,
}: {
  rank: number;
  name: string;
  slug: string;
  stars: number;
  gained: number | null;
  gained7d: number | null;
  language: string;
  gainedColor: string;
  liveDelta: number | null;
  history: { recorded_at: string; stars: number }[];
  period?: string;
  onSelect?: (slug: string) => void;
  hero?: boolean;
}) {
  const gainedPrefix =
    gained !== null && gained > 0
      ? "+"
      : gained !== null && gained < 0
        ? ""
        : "";
  const gainedAbs = gained !== null ? Math.abs(gained) : 0;
  const liveLabel =
    liveDelta !== null ? `${liveDelta > 0 ? "+" : ""}${liveDelta}` : null;
  const isTop3 = rank <= 3;

  return (
    <div
      className="card-outer cursor-pointer group"
      onClick={() => onSelect?.(slug)}
    >
      <div className="card-inner p-3">
        <div className="flex items-center gap-3">
          {isTop3 && (
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold tabular-nums ${
                rank === 1
                  ? "text-accent shadow-[0_0_12px_rgba(91,127,255,0.3)]"
                  : "text-text-muted"
              }`}
              style={{
                background:
                  rank === 1 ? "rgba(91,127,255,0.1)" : "rgba(136,136,136,0.1)",
              }}
            >
              #{rank}
            </span>
          )}
          {!isTop3 && (
            <span className="w-6 text-right text-text-muted tabular-nums text-xs shrink-0">
              #{rank}
            </span>
          )}
          <span
            className="flex-1 min-w-0 truncate text-text-body text-sm font-medium"
            title={name}
          >
            {name}
          </span>
          <span className="text-text-muted/50 text-[10px] w-16 shrink-0 hidden sm:inline truncate">
            {language || <span className="text-text-muted/20">&mdash;</span>}
          </span>
          {hero && (
            <div
              className="w-20 shrink-0 hidden md:block"
              style={{ height: "20px" }}
            >
              <StarChart history={history} period={period} />
            </div>
          )}
          {(() => {
            const trend = history[history.length - 1].stars - history[0].stars;
            if (trend > 0 && !hero)
              return (
                <svg
                  className="w-3 h-3 text-positive shrink-0"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <polygon points="6,1 11,10 1,10" />
                </svg>
              );
            if (trend < 0 && !hero)
              return (
                <svg
                  className="w-3 h-3 text-negative shrink-0"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <polygon points="6,11 1,2 11,2" />
                </svg>
              );
            return null;
          })()}
          <div className="flex items-center gap-2 shrink-0 w-20 justify-end">
            {liveLabel && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-positive/10 text-positive">
                +{liveLabel}
              </span>
            )}
            {gained === null ? (
              <span className="text-text-muted/30 tabular-nums text-sm">
                &mdash;
              </span>
            ) : gained === 0 ? (
              <span className="text-text-muted/30 tabular-nums text-sm">
                &mdash;
              </span>
            ) : (
              <span className={`${gainedColor} tabular-nums text-sm`}>
                {gainedPrefix}
                {gainedAbs.toLocaleString("en-US")}
              </span>
            )}
          </div>
          <span className="text-text-muted/40 text-xs tabular-nums w-16 text-right shrink-0 hidden sm:block">
            {(stars / 1000).toFixed(1)}K
          </span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update RepoList.tsx — asymmetrical bento grid, hero cards for top 3**

Replace the container div and card rendering loop.

Key change in the render area (around line 130-211): wrap the sort header and cards in a `grid grid-cols-12 gap-4` for desktop, `grid-cols-1` for mobile. Top 3 repos get `col-span-6`, rest get `col-span-4`. The sort header and search bar stay unchanged.

Replace lines 162-210 (the filtered.length check and sorted.map loop):

```tsx
{
  filtered.length === 0 ? (
    <div className="mt-4">
      <p className="text-text-muted text-xs">
        no repos match &ldquo;{search}&rdquo;
      </p>
      <p className="text-text-muted text-xs mt-1">
        try a different name or clear the filter
      </p>
    </div>
  ) : (
    <div
      className="grid grid-cols-1 md:grid-cols-12 gap-4"
      onKeyDown={handleKeyDown}
    >
      {sorted.map((repo, i) => {
        const gainedColorStr = gainedColor(repo.stars_gained);
        const gained7d =
          repo.stars_gained !== null && repo.history.length >= 8
            ? repo.history[repo.history.length - 1].stars -
              repo.history[repo.history.length - 8].stars
            : null;
        const hero = i < 3;
        return (
          <div
            key={repo.full_name}
            className={`${hero ? "md:col-span-6" : "md:col-span-4"} ${
              i === selectedIndex ? "relative" : ""
            }`}
            onClick={() => setSelectedIndex(i)}
          >
            {i === selectedIndex && (
              <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-accent rounded-full z-10" />
            )}
            <ScrollReveal delay={Math.min(i * 0.02, 0.3)}>
              <div className={i === selectedIndex ? "pl-2" : ""}>
                <RepoCard
                  rank={repo.rank}
                  name={repo.name}
                  slug={repo.slug}
                  stars={repo.stars}
                  gained={repo.stars_gained}
                  gained7d={gained7d}
                  language={repo.language ?? ""}
                  gainedColor={gainedColorStr}
                  liveDelta={(() => {
                    const liveStars = starsMap[repo.full_name];
                    const initial = initStars.current[repo.full_name];
                    if (!liveStars || !initial) return null;
                    const delta = liveStars - initial;
                    return delta > 0 ? delta : null;
                  })()}
                  history={repo.history}
                  onSelect={setSelectedRepo}
                  hero={hero}
                />
              </div>
            </ScrollReveal>
          </div>
        );
      })}
    </div>
  );
}
```

Also add `hero` prop to the `RepoCard` JSX line as shown above.

- [ ] **Step 3: Build to verify**

Run: `next build`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add components/RepoCard.tsx components/RepoList.tsx
git commit -m "feat: double-bezel cards, bento grid, hero top-3 layout"
```

---

### Task 5: Detail Page, Panel, StarChart — Glass Upgrade

**Files:**

- Modify: `components/Panel.tsx` (all), `components/RepoDetail.tsx` (all), `components/StarChart.tsx` (lines 71-122), `app/repo/[slug]/page.tsx` (lines 60-138)

**Interfaces:**

- Consumes: `glass`, `glass-strong`, `card-outer`, `card-inner` CSS classes from Task 1
- Produces: Glass panel with slide-in; detail page with glass stats grid; period toggle pills; StarChart with gradient fill

- [ ] **Step 1: Update Panel.tsx — glass shell, slide-in animation**

```tsx
"use client";

import { useEffect, useCallback, ReactNode } from "react";

type PanelProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Panel({ open, onClose, children }: PanelProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, handleKey]);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md glass-strong transform transition-transform duration-[600ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Repo details"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-text-body">REPO DETAILS</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full glass flex items-center justify-center text-text-muted/60 hover:text-accent transition-colors cursor-pointer"
            aria-label="Close panel"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(100%-4rem)]">
          {children}
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Update RepoDetail.tsx — glass stats, pill toggle, button-in-button**

```tsx
import { getRepoDetails } from "@/lib/db";
import { gainedColor } from "@/lib/gained-color";
import StarChart from "./StarChart";

export default function RepoDetail({ slug }: { slug: string }) {
  const repo = getRepoDetails(slug);
  if (!repo) return <p className="text-text-muted text-xs">Repo not found</p>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-text-body tracking-tight">
          {repo.name}
        </h3>
        <p className="text-text-muted text-xs mt-1 leading-relaxed">
          {repo.description}
        </p>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 mt-3 rounded-full px-4 py-2 bg-accent text-white text-xs transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          view on github
          <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </span>
        </a>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="card-outer">
          <div className="card-inner p-2.5">
            <p className="text-text-muted/60 text-[10px] mb-1">Stars</p>
            <p className="text-text-body text-sm font-bold tabular-nums data-mono">
              {repo.stars.toLocaleString("en-US")}
            </p>
          </div>
        </div>
        <div className="card-outer">
          <div className="card-inner p-2.5">
            <p className="text-text-muted/60 text-[10px] mb-1">7d Gain</p>
            <p
              className={`text-sm font-bold tabular-nums data-mono ${gainedColor(repo.stars_gained ?? 0)}`}
            >
              {repo.gained7d === null
                ? "\u2014"
                : (repo.gained7d > 0 ? "+" : "") +
                  repo.gained7d.toLocaleString("en-US")}
            </p>
          </div>
        </div>
        <div className="card-outer">
          <div className="card-inner p-2.5">
            <p className="text-text-muted/60 text-[10px] mb-1">Created</p>
            <p className="text-text-body text-xs font-bold tabular-nums data-mono leading-tight">
              {repo.created_at
                ? new Date(repo.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "\u2014"}
            </p>
          </div>
        </div>
      </div>

      {repo.language && (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent/60" />
          <span className="text-text-body text-xs">{repo.language}</span>
        </div>
      )}

      <div>
        <div className="text-text-muted/60 text-[10px] mb-2">Star Velocity</div>
        <div className="card-outer">
          <div className="card-inner p-3">
            <div className="h-24">
              <StarChart history={repo.history} period="week" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update StarChart.tsx — gradient fill, thinner lines**

Replace the SVG return block (lines 71-122) with:

```tsx
return (
  <svg
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid meet"
    className="w-full h-full"
    role="img"
    aria-roledescription="sparkline chart"
    aria-label={`Star history: ${values.length} data points from ${values[0].toLocaleString("en-US")} to ${values[values.length - 1].toLocaleString("en-US")}`}
  >
    <defs>
      <linearGradient id={`grad-${period}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(91,127,255,0.3)" />
        <stop offset="100%" stopColor="rgba(91,127,255,0)" />
      </linearGradient>
    </defs>
    <title>{`Star history for the past ${period}`}</title>
    {yLabels.map((v) => (
      <line
        key={v}
        x1={pad.left}
        y1={yPos(v)}
        x2={W - pad.right}
        y2={yPos(v)}
        stroke="rgba(91,127,255,0.06)"
        strokeWidth="0.5"
      />
    ))}
    {yLabels.map((v) => (
      <text
        key={v}
        x={pad.left - 2}
        y={yPos(v) + 1.5}
        textAnchor="end"
        fill="rgba(91,127,255,0.3)"
        fontSize="6"
      >
        {abbreviateNumber(Math.round(v))}
      </text>
    ))}
    {xTickIndices.map((idx) => (
      <text
        key={idx}
        x={xPos(idx)}
        y={H - 1}
        textAnchor="middle"
        fill="rgba(91,127,255,0.2)"
        fontSize="5"
      >
        {getXLabel(idx)}
      </text>
    ))}
    {values.map((v, i) => (
      <circle
        key={i}
        cx={xPos(i)}
        cy={yPos(v)}
        r="1.2"
        fill="rgba(91,127,255,0.8)"
      />
    ))}
    <path d={fillD} fill={`url(#grad-${period})`} />
    <path d={lineD} fill="none" stroke="rgba(91,127,255,0.8)" strokeWidth="1" />
  </svg>
);
```

- [ ] **Step 4: Update app/repo/[slug]/page.tsx — glass stats grid, period pill toggle**

Replace the stats grid (lines 83-114) and period nav (lines 116-127):

Period nav pills (around line 116-127, the period selection area):

```tsx
<div className="flex items-center gap-2 mb-6">
  <span className="text-text-muted/60 text-[10px] mr-1">period:</span>
  {periods.map((p) =>
    period === p ? (
      <span
        key={p}
        className="rounded-full px-3 py-1 text-xs bg-accent text-white font-medium"
      >
        {periodLabels[p]}
      </span>
    ) : (
      <Link
        key={p}
        href={`/repo/${slug}?period=${p}`}
        className="rounded-full px-3 py-1 text-xs glass text-text-muted hover:text-text-body transition-colors duration-300"
      >
        {periodLabels[p]}
      </Link>
    ),
  )}
</div>
```

Replace the stats grid (lines 83-114):

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
  <div className="card-outer">
    <div className="card-inner p-3">
      <p className="text-text-muted/60 text-[10px] sm:text-xs mb-1">stars</p>
      <p className="text-lg font-bold tabular-nums data-mono text-text-body">
        {repo.stars.toLocaleString("en-US")}
      </p>
    </div>
  </div>
  <div className="card-outer">
    <div className="card-inner p-3">
      <p className="text-text-muted/60 text-[10px] sm:text-xs mb-1">gained</p>
      <p
        className={`text-lg font-bold tabular-nums data-mono text-text-body ${gainedColor(repo.stars_gained ?? 0)}`}
      >
        {repo.stars_gained !== null
          ? (repo.stars_gained > 0 ? "+" : "") +
            repo.stars_gained.toLocaleString("en-US")
          : "\u2014"}
      </p>
    </div>
  </div>
  <div className="card-outer">
    <div className="card-inner p-3">
      <p className="text-text-muted/60 text-[10px] sm:text-xs mb-1">velocity</p>
      <p
        className={`text-lg font-bold tabular-nums data-mono text-text-body ${gainedColor(repo.stars_gained ?? 0)}`}
      >
        {formatVelocity(repo.velocity)}
      </p>
    </div>
  </div>
  <div className="card-outer">
    <div className="card-inner p-3">
      <p className="text-text-muted/60 text-[10px] sm:text-xs mb-1">7d gain</p>
      <p
        className={`text-lg font-bold tabular-nums data-mono text-text-body ${gainedColor(repo.stars_gained ?? 0)}`}
      >
        {repo.gained7d !== null
          ? (repo.gained7d > 0 ? "+" : "") +
            repo.gained7d.toLocaleString("en-US")
          : "\u2014"}
      </p>
    </div>
  </div>
  <div className="card-outer">
    <div className="card-inner p-3">
      <p className="text-text-muted/60 text-[10px] sm:text-xs mb-1">created</p>
      <p className="text-lg font-bold tabular-nums data-mono text-text-body">
        {createdDate}
      </p>
    </div>
  </div>
</div>
```

Replace the star chart area (line 129-134):

```tsx
<div>
  <p className="text-text-muted/60 text-[10px] mb-3">star history</p>
  <div className="card-outer">
    <div className="card-inner p-4">
      <div className="h-40 w-full">
        <StarChart history={repo.history} period={period} />
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 5: Build to verify**

Run: `next build`
Expected: 0 errors

- [ ] **Step 6: Commit**

```bash
git add components/Panel.tsx components/RepoDetail.tsx components/StarChart.tsx app/repo/\[slug\]/page.tsx
git commit -m "feat: glass panel, detail page, star chart gradient"
```

---

### Task 6: Final Verification

- [ ] **Step 1: Run unit tests**

Run: `npm test`
Expected: 9/9 pass

- [ ] **Step 2: Production build**

Run: `rm -rf .next && next build`
Expected: 0 errors, all routes compiled

- [ ] **Step 3: Start production server and test all routes**

Run: `next start -p 3000`
Then curl each route: `/`, `/about`, `/daily`, `/weekly`, `/monthly`, `/repo/codecrafters-io-build-your-own-x`, `/robots.txt`, `/sitemap.xml`, `/nonexistent`
Expected: all return correct HTTP status codes

- [ ] **Step 4: Check for banned patterns**

Verify in globals.css, tailwind.config.ts, and all components:

- No Inter, Roboto, Arial, Open Sans, Helvetica fonts
- No `linear` or `ease-in-out` transitions on premium surfaces
- All `backdrop-blur` only on fixed/sticky elements
- All cards use card-outer/card-inner double-bezel pattern

- [ ] **Step 5: Commit final verification**

```bash
git add -A
git commit -m "chore: final verification — all tests pass, all routes return 200"
```
