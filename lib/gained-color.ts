export function gainedColor(value: number): string {
  return value > 0 ? "text-terminal" : value < 0 ? "text-dim" : "text-dim";
}
