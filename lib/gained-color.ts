export function gainedColor(value: number): string {
  return value > 0 ? "text-amber-primary" : value < 0 ? "text-amber-muted" : "text-amber-muted";
}
