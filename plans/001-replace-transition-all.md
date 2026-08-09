# 001 — Replace `transition-all` with explicit properties

**Severity**: HIGH | **Category**: Performance  
**Scope**: 15+ components | **Effort**: Medium

## Finding

`transition-all` animates every property change off-GPU (layout + paint + composite). Found in:
- `app/page.tsx` (KPI tiles, buttons)
- `components/RepoList.tsx` (filter buttons, action buttons)
- `components/RepoBottomSheet.tsx` (close button)
- `components/NavLinks.tsx` (nav links)
- `components/EmptyState.tsx` (action buttons)
- `components/Toast.tsx` (toast items)
- `components/SearchInput.tsx` (input field)
- `components/MobileRepoCard.tsx` (card press)

## Target

Replace `transition-all` with explicit `transition` on `transform` + `opacity` only — the two GPU-composited properties.

## Steps

1. In `app/page.tsx`, change KPI tile hover from `transition-all duration-500 ease-out-expo hover:bg-surface` to `transition-colors duration-200 ease-spring hover:bg-surface`.

2. In `components/RepoList.tsx`, change all filter/action buttons from `transition-all duration-250 ease-spring` to `transition-[transform,background-color] duration-200 ease-spring`.

3. In `components/EmptyState.tsx`, change action buttons from `transition-all duration-400 ease-out-expo` to `transition-[transform,background-color] duration-200 ease-spring`.

4. In `components/NavLinks.tsx`, change from `transition-all duration-400 ease-out-expo` to `transition-[transform,color] duration-200 ease-spring`.

5. In `components/RepoBottomSheet.tsx`, change close button from `transition-colors` (already correct — no change needed).

6. In `components/Toast.tsx`, change from `transition-all duration-200` to `transition-[transform,opacity] duration-200 ease-spring`.

7. In `components/SearchInput.tsx`, change from `transition-all duration-200` to `transition-[transform,border-color,box-shadow] duration-150 ease-spring`.

8. In `components/MobileRepoCard.tsx`, change from `transition-all duration-400 ease-out-expo` to `transition-[transform,box-shadow] duration-200 ease-spring`.

## Verification

- Run `grep -rn "transition-all" --include="*.tsx" app/ components/` → should return zero results.
- In DevTools Performance panel, verify no Layout/Paint events on hover/press.
- Feel-check: hover and press feedback should feel identical to before (same visual result, better perf).
