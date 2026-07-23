import { describe, expect, it } from "vitest";
import { gainedColor } from "@/lib/gained-color";

describe("gainedColor", () => {
  it("returns terminal green for positive values", () => {
    expect(gainedColor(100)).toBe("text-terminal");
    expect(gainedColor(1)).toBe("text-terminal");
  });

  it("returns dim for negative values", () => {
    expect(gainedColor(-100)).toBe("text-dim");
    expect(gainedColor(-1)).toBe("text-dim");
  });

  it("returns dim for zero", () => {
    expect(gainedColor(0)).toBe("text-dim");
  });
});
