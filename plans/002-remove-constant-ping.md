# 002 — Remove constant `animate-ping` from LiveIndicator

**Severity**: HIGH | **Category**: Purpose & frequency  
**Scope**: `components/LiveIndicator.tsx` | **Effort**: Small

## Finding

`animate-ping` runs 24/7 on every page (the "LIVE" badge is in the header). Per AUDIT.md: "100+ times/day (keyboard shortcuts, command palette toggle) — No animation. Ever." A constant pulsing dot serves no spatial or state purpose — it's decorative motion that never stops.

## Target

Replace `animate-ping` with a static dot + subtle CSS-only breathing (opacity oscillation) that respects `prefers-reduced-motion`.

## Steps

1. In `components/LiveIndicator.tsx`, replace the current implementation:

```tsx
// BEFORE:
<span className="relative flex h-2 w-2">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75" />
  <span className="relative inline-flex rounded-full h-2 w-2 bg-positive" />
</span>
LIVE

// AFTER:
<span className="relative flex h-2 w-2">
  <span className="inline-flex rounded-full h-2 w-2 bg-positive animate-[pulse_2s_ease-in-out_infinite] opacity-80" />
</span>
LIVE
```

2. In `app/globals.css`, add a subtle pulse keyframe (not the harsh `animate-ping`):

```css
@keyframes gentle-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
```

3. Replace `animate-ping` usage with `animate-gentle-pulse` class.

4. In the `@media (prefers-reduced-motion: reduce)` block, add:
```css
.animate-gentle-pulse { animation: none !important; opacity: 0.85 !important; }
```

## Verification

- The dot should gently breathe (opacity 0.7 → 1 → 0.7 over 2s) — visible but not distracting.
- With `prefers-reduced-motion: reduce` enabled, the dot should be static at 0.85 opacity.
- No `animate-ping` should remain in the codebase.
