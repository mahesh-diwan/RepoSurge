export function gainedColor(val: number | null): string {
  if (val === null) return "text-text-muted/50";
  if (val > 0) return "text-positive";
  if (val < 0) return "text-negative";
  return "text-text-muted/50";
}
