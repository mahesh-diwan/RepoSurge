export function gainedColor(val: number): string {
  if (val > 0) return "text-cyan-400";
  if (val < 0) return "text-amber-muted";
  return "text-amber-muted/50";
}
