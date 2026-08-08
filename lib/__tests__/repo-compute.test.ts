import { describe, expect, it } from "vitest";
import {
  computeVelocity,
  computeForecast,
  computeWindowGain,
  rankByGained,
  computeRankChanges,
  computeAcceleration,
  computeStats,
  PERIOD_TO_DAYS,
  SPARKLINE_LENGTH,
} from "../repo-compute";
import type { RepoWithVelocity } from "../db";

function makeRepo(overrides: Partial<RepoWithVelocity> = {}): RepoWithVelocity {
  return {
    full_name: "test/repo",
    name: "repo",
    owner: "test",
    description: null,
    language: "TypeScript",
    url: "https://github.com/test/repo",
    stars: 1000,
    created_at: "2024-01-01",
    fetched_at: "2026-08-01",
    history: [],
    isNew: false,
    category: null,
    rank: 0,
    stars_gained: null,
    sparkline: [],
    velocity: null,
    slug: "test-repo",
    rankChange: null,
    gainedPrev: null,
    accel: null,
    forecast: null,
    ...overrides,
  };
}

describe("computeVelocity", () => {
  it("returns null for null gain", () => {
    expect(computeVelocity(null, 7)).toBeNull();
  });

  it("returns null for zero days", () => {
    expect(computeVelocity(100, 0)).toBeNull();
  });

  it("computes daily velocity rounded to 1 decimal", () => {
    expect(computeVelocity(75, 7)).toBe(10.7);
    expect(computeVelocity(100, 7)).toBe(14.3);
    expect(computeVelocity(70, 7)).toBe(10);
  });
});

describe("computeForecast", () => {
  it("returns null for fewer than 3 points", () => {
    expect(computeForecast([100, 105])).toBeNull();
  });

  it("returns null for flat or declining trends", () => {
    expect(computeForecast([100, 100, 100])).toBeNull();
    expect(computeForecast([100, 90, 80])).toBeNull();
  });

  it("returns forecast for growing trend", () => {
    // 3 points growing: 100000, 100010, 100020 -> slope = 10/day
    // current = 100020, magnitude = 100000, milestone = 200000
    // days = (200000 - 100020) / 10 = 9998
    expect(computeForecast([100000, 100010, 100020])).toBe("200K ~9998d");
  });

  it("handles larger milestones correctly", () => {
    // 995K stars, growing 1000/day -> next milestone is 1M
    const result = computeForecast([990000, 991000, 992000]);
    expect(result).toBeTruthy();
    expect(result).toContain("1000K");
  });
});

describe("computeWindowGain", () => {
  const day = 86400000;
  const now = Date.now();

  it("returns null gain for fewer than 2 data points", () => {
    const history = [{ stars: 100, recorded_at: new Date(now - day).toISOString() }];
    const result = computeWindowGain(history, now - 2 * day, now - day);
    expect(result.gain).toBeNull();
    expect(result.velocity).toBeNull();
  });

  it("computes gain and velocity for a valid window", () => {
    const history = [
      { stars: 100, recorded_at: new Date(now - 8 * day).toISOString() },
      { stars: 110, recorded_at: new Date(now - 7 * day).toISOString() },
      { stars: 130, recorded_at: new Date(now - 6 * day).toISOString() },
    ];
    const result = computeWindowGain(history, now - 8 * day, now - day);
    // All 3 points are within [now-8d, now-d). gain = 130 - 100 = 30, days = 7
    expect(result.gain).toBe(30);
    expect(result.velocity).toBe(4.3); // 30 / 7 days
  });

  it("only considers points within the window boundaries", () => {
    const history = [
      { stars: 100, recorded_at: new Date(now - 20 * day).toISOString() }, // outside
      { stars: 200, recorded_at: new Date(now - 7 * day).toISOString() }, // inside (boundary)
      { stars: 220, recorded_at: new Date(now - 3 * day).toISOString() }, // inside
      { stars: 250, recorded_at: new Date(now).toISOString() }, // outside (end boundary)
    ];
    const result = computeWindowGain(history, now - 7 * day, now);
    expect(result.gain).toBe(20); // 220 - 200
  });
});

describe("rankByGained", () => {
  it("sorts repos by stars_gained descending and assigns ranks", () => {
    const repos = [
      makeRepo({ full_name: "a", stars_gained: 100 }),
      makeRepo({ full_name: "b", stars_gained: 300 }),
      makeRepo({ full_name: "c", stars_gained: 200 }),
    ];
    const ranked = rankByGained(repos);
    expect(ranked[0].full_name).toBe("b");
    expect(ranked[1].full_name).toBe("c");
    expect(ranked[2].full_name).toBe("a");
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3]);
  });

  it("treats null gain as -1 (bottom)", () => {
    const repos = [
      makeRepo({ full_name: "a", stars_gained: null }),
      makeRepo({ full_name: "b", stars_gained: 100 }),
    ];
    const ranked = rankByGained(repos);
    expect(ranked[0].full_name).toBe("b");
    expect(ranked[1].full_name).toBe("a");
  });
});

describe("computeRankChanges", () => {
  it("computes rank change from previous period ranking", () => {
    const repos = [
      makeRepo({ full_name: "a", rank: 1 }),
      makeRepo({ full_name: "b", rank: 2 }),
      makeRepo({ full_name: "c", rank: 3 }),
    ];
    // prevGainMap sorted ascending gives prev ranks: c(#1), a(#2), b(#3)
    const prevGainMap = new Map([
      ["a", 200],
      ["b", 300],
      ["c", 100],
    ]);
    computeRankChanges(repos, prevGainMap);
    // a: was rank 2, now rank 1 -> +1 (moved up)
    expect(repos.find((r) => r.full_name === "a")!.rankChange).toBe(1);
    // b: was rank 3, now rank 2 -> +1 (moved up)
    expect(repos.find((r) => r.full_name === "b")!.rankChange).toBe(1);
    // c: was rank 1, now rank 3 -> -2 (dropped)
    expect(repos.find((r) => r.full_name === "c")!.rankChange).toBe(-2);
  });
});

describe("computeAcceleration", () => {
  it("computes velocity ratio", () => {
    const repos = [makeRepo({ full_name: "a", velocity: 20 })];
    const prevVelocityMap = new Map([["a", 10]]);
    computeAcceleration(repos, prevVelocityMap);
    expect(repos[0].accel).toBe(2);
  });

  it("returns null when previous velocity was 0", () => {
    const repos = [makeRepo({ full_name: "a", velocity: 20 })];
    const prevVelocityMap = new Map([["a", 0]]);
    computeAcceleration(repos, prevVelocityMap);
    expect(repos[0].accel).toBeNull();
  });

  it("returns null when current velocity is null", () => {
    const repos = [makeRepo({ full_name: "a", velocity: null })];
    const prevVelocityMap = new Map([["a", 10]]);
    computeAcceleration(repos, prevVelocityMap);
    expect(repos[0].accel).toBeNull();
  });
});

describe("computeStats", () => {
  it("returns aggregate statistics", () => {
    const repos = [
      makeRepo({ stars: 1000, language: "TypeScript", stars_gained: 100 }),
      makeRepo({ stars: 2000, language: "Rust", stars_gained: 200 }),
      makeRepo({ stars: 3000, language: "TypeScript", stars_gained: 50 }),
    ];
    const stats = computeStats(repos);
    expect(stats.totalRepos).toBe(3);
    expect(stats.totalStars).toBe(6000);
    expect(stats.languages).toBe(2);
    expect(stats.totalGained).toBe(350);
  });
});

describe("constants", () => {
  it("has correct period-to-days mapping", () => {
    expect(PERIOD_TO_DAYS).toEqual({ day: 1, week: 7, month: 30 });
  });

  it("has correct sparkline lengths", () => {
    expect(SPARKLINE_LENGTH).toEqual({ day: 3, week: 7, month: 14 });
  });
});
