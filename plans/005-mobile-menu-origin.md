# 005 — Add spatial origin to mobile menu

**Severity**: MEDIUM | **Category**: Physicality & origin  
**Scope**: `components/MobileNav.tsx` | **Effort**: Small

## Finding

The mobile menu appears as a full-screen overlay with no spatial relationship to the hamburger button that triggered it. Per AUDIT.md: "Anchor interactions to their trigger." The menu should feel like it emerges from the hamburger.

## Target

Add a subtle scale-from-corner entrance that originates near the hamburger button (top-right area).

## Steps

1. In `components/MobileNav.tsx`, update the menu overlay:

```tsx
// BEFORE:
<div className="fixed inset-0 z-[60] bg-surface/90 backdrop-blur-2xl flex items-center justify-center md:hidden">

// AFTER:
<div
  className="fixed inset-0 z-[60] bg-surface/90 backdrop-blur-2xl flex items-center justify-center md:hidden animate-[scale-in_0.3s_ease-spring_forwards]"
  style={{ transformOrigin: "calc(100% - 2.5rem) 1.5rem" }}
>
```

2. In `app/globals.css`, add the keyframe:

```css
@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

3. Update nav links to stagger in:

```tsx
<nav className="flex flex-col items-center gap-2">
  {NAV_LINKS.map((link, i) => (
    <a
      key={link.href}
      href={link.href}
      onClick={close}
      className="text-lg font-medium text-text-body hover:text-accent transition-colors duration-200 ease-spring px-6 py-3 rounded-2xl hover:bg-white/[0.04] opacity-0 animate-[fade-up_0.3s_ease-spring_forwards]"
      style={{ animationDelay: `${60 * (i + 1)}ms` }}
    >
      {link.label}
    </a>
  ))}
</nav>
```

## Verification

- Opening the menu: it should scale in from the top-right (near the hamburger).
- Links should stagger in with 60ms delay between each.
- Closing should feel like it reverses (add `animation-direction: reverse` on close if desired).
- With `prefers-reduced-motion: reduce`, the menu should appear instantly (no animation).
