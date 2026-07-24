import { describe, expect, it } from "vitest";
import { gainedColor } from "@/lib/gained-color";

describe("gainedColor", () => {
  it("returns positive for positive values", () => {
    expect(gainedColor(100)).toBe("text-positive");
    expect(gainedColor(1)).toBe("text-positive");
  });

  it("returns negative for negative values", () => {
    expect(gainedColor(-100)).toBe("text-negative");
    expect(gainedColor(-1)).toBe("text-negative");
  });

  it("returns text-muted for zero", () => {
    expect(gainedColor(0)).toBe("text-text-muted/50");
  });
});
