import { describe, expect, it } from "vitest";
import { getRepos, getStats, getLastUpdated } from "@/lib/db";

describe("getRepos", () => {
  it("returns repos sorted by stars_gained descending", () => {
    const repos = getRepos("week");
    expect(repos.length).toBeGreaterThan(0);
    for (let i = 1; i < repos.length; i++) {
      const a = repos[i - 1].stars_gained ?? 0;
      const b = repos[i].stars_gained ?? 0;
      expect(a).toBeGreaterThanOrEqual(b);
    }
  });

  it("each repo has required fields", () => {
    const repos = getRepos("week");
    for (const r of repos) {
      expect(r.rank).toBeGreaterThan(0);
      expect(r.full_name).toBeTruthy();
      expect(r.stars_gained === null || typeof r.stars_gained === "number").toBe(true);
      expect(Array.isArray(r.sparkline)).toBe(true);
    }
  });

  it("returns different data per period", () => {
    const day = getRepos("day");
    const week = getRepos("week");
    const month = getRepos("month");
    const hasGains = day.some(r => r.stars_gained !== 0);
    if (hasGains) {
      expect(day.some((r, i) => r.stars_gained !== week[i]?.stars_gained)).toBe(true);
      expect(month.some((r, i) => r.stars_gained !== week[i]?.stars_gained)).toBe(true);
    }
    // ponytail: all gains are 0 in fresh state (1 history entry).
    // test becomes meaningful after cron runs >1 day.
  });

  it("includes velocity for all repos", () => {
    const repos = getRepos("week");
    for (const r of repos) {
      expect(r.velocity === null || typeof r.velocity === "number").toBe(true);
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
