import { describe, expect, it } from "vitest";
import { gainedColor } from "@/lib/gained-color";

describe("gainedColor", () => {
  it("returns amber-primary for positive values", () => {
    expect(gainedColor(100)).toBe("text-amber-primary");
    expect(gainedColor(1)).toBe("text-amber-primary");
  });

  it("returns amber-muted for negative values", () => {
    expect(gainedColor(-100)).toBe("text-amber-muted");
    expect(gainedColor(-1)).toBe("text-amber-muted");
  });

  it("returns amber-muted for zero", () => {
    expect(gainedColor(0)).toBe("text-amber-muted/50");
  });
});
