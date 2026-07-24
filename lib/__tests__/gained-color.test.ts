import { describe, expect, it } from "vitest";
import { gainedColor } from "@/lib/gained-color";

describe("gainedColor", () => {
  it("returns cyan-400 for positive values", () => {
    expect(gainedColor(100)).toBe("text-cyan-400");
    expect(gainedColor(1)).toBe("text-cyan-400");
  });

  it("returns red-400 for negative values", () => {
    expect(gainedColor(-100)).toBe("text-red-400");
    expect(gainedColor(-1)).toBe("text-red-400");
  });

  it("returns amber-muted for zero", () => {
    expect(gainedColor(0)).toBe("text-amber-muted/50");
  });
});
