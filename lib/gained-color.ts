export function gainedColor(val: number): string {
  if (val > 0) return "text-positive";
  if (val < 0) return "text-negative";
  return "text-text-muted/50";
}
