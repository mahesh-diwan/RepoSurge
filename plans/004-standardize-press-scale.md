# 004 — Standardize press feedback to `scale(0.97)`

**Severity**: MEDIUM | **Category**: Cohesion  
**Scope**: All interactive elements | **Effort**: Small

## Finding

Press feedback uses inconsistent scales: `0.95`, `0.97`, `0.98`, `0.99`. Per AUDIT.md: "Keep it subtle (0.95–0.98)." Standardize to one value.

## Target

Use `scale(0.97)` everywhere — subtle enough to not feel jarring, noticeable enough to feel responsive.

## Steps

1. In `components/RepoList.tsx`:
   - Filter buttons: `active:scale-[0.95]` → `active:scale-[0.97]`
   - Compare/Export buttons: `active:scale-[0.95]` → `active:scale-[0.97]`

2. In `components/FloatingPill.tsx`:
   - Logo: `active:scale-95` → `active:scale-[0.97]`

3. In `components/MobileRepoCard.tsx`:
   - Card: `active:scale-[0.98]` → `active:scale-[0.97]`

4. In `components/EmptyState.tsx`:
   - Buttons: `active:scale-[0.97]` (already correct)

5. In `components/MobileNav.tsx`:
   - Hamburger: `active:scale-90` → `active:scale-[0.97]`

6. In `app/repo/[slug]/page.tsx`:
   - GitHub link: `active:scale-[0.97]` (already correct)

## Verification

- Every pressable element should feel identical on press (same scale).
- Run `grep -rn "active:scale" --include="*.tsx" app/ components/` — all should show `0.97`.
