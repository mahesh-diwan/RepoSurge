export function gainedColor(val: number): string {
  if (val > 0) return "text-amber-primary";
  if (val < 0) return "text-amber-muted";
  return "text-amber-muted/50";
}
