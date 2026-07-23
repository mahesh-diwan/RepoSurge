import { describe, expect, it } from "vitest";
import { getRepos, getStats, getLastUpdated } from "@/lib/db";

describe("getRepos", () => {
  it("returns repos sorted by stars_gained descending", () => {
    const repos = getRepos("week");
    expect(repos.length).toBeGreaterThan(0);
    for (let i = 1; i < repos.length; i++) {
      expect(repos[i - 1].stars_gained).toBeGreaterThanOrEqual(repos[i].stars_gained);
    }
  });

  it("each repo has required fields", () => {
    const repos = getRepos("week");
    for (const r of repos) {
      expect(r.rank).toBeGreaterThan(0);
      expect(r.full_name).toBeTruthy();
      expect(typeof r.stars_gained).toBe("number");
      expect(Array.isArray(r.sparkline)).toBe(true);
    }
  });

  it("returns different data per period", () => {
    const day = getRepos("day");
    const week = getRepos("week");
    const month = getRepos("month");
    expect(day.some((r, i) => r.stars_gained !== week[i]?.stars_gained)).toBe(true);
    expect(month.some((r, i) => r.stars_gained !== week[i]?.stars_gained)).toBe(true);
  });

  it("includes velocity for all repos", () => {
    const repos = getRepos("week");
    for (const r of repos) {
      expect(typeof r.velocity).toBe("number");
    }
  });
});

describe("getStats", () => {
  it("returns aggregate stats", () => {
    const stats = getStats();
    expect(stats.totalRepos).toBeGreaterThan(0);
    expect(stats.totalStars).toBeGreaterThan(0);
    expect(stats.languages).toBeGreaterThan(0);
  });
});

describe("getLastUpdated", () => {
  it("returns a non-empty ISO string", () => {
    const lu = getLastUpdated();
    expect(lu).toBeTruthy();
    expect(() => new Date(lu)).not.toThrow();
  });
});
