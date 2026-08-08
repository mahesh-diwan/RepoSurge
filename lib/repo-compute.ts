import type { RepoRecord, HistoryEntry, RepoWithVelocity } from "./db";

// ─── constants ──────────────────────────────────────────────────────────────

export const PERIOD_TO_DAYS: Record<string, number> = {
  day: 1,
  week: 7,
  month: 30,
};

export const SPARKLINE_LENGTH: Record<string, number> = {
  day: 3,
  week: 7,
  month: 14,
};

// ─── pure computation ───────────────────────────────────────────────────────

export function computeVelocity(starsGained: number | null, days: number): number | null {
  if (starsGained === null || days <= 0) return null;
  return Math.round((starsGained / days) * 10) / 10;
}

export function computeSparkline(
  windowed: HistoryEntry[],
  fullHistory: HistoryEntry[],
  sparkCount: number
): number[] {
  const source = windowed.length > 0 ? windowed : fullHistory.slice(-sparkCount);
  return source.slice(-sparkCount).map((h) => h.stars);
}

export function computeForecast(sparkline: number[]): string | null {
  const points = sparkline.slice(-14);
  if (points.length < 3) return null;

  const N = points.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0;
  for (let i = 0; i < N; i++) {
    sumX += i;
    sumY += points[i];
    sumXY += i * points[i];
    sumX2 += i * i;
  }

  const denom = N * sumX2 - sumX * sumX;
  if (denom === 0) return null;
  const slope = (N * sumXY - sumX * sumY) / denom;
  if (slope <= 0) return null;

  const currentStars = points[N - 1];
  if (currentStars <= 0) return null;

  const magnitude = Math.pow(10, Math.floor(Math.log10(currentStars)));
  const milestone = (Math.floor(currentStars / magnitude) + 1) * magnitude;
  const daysToMilestone = Math.ceil((milestone - currentStars) / slope);

  return `${Math.round(milestone / 1000)}K ~${daysToMilestone}d`;
}

export function computeWindowGain(
  history: HistoryEntry[],
  startMs: number,
  endMs: number
): { gain: number | null; velocity: number | null; days: number } {
  const window = history.filter((h) => {
    const t = new Date(h.recorded_at).getTime();
    return t >= startMs && t < endMs;
  });

  if (window.length < 2) return { gain: null, velocity: null, days: 0 };

  const days = (endMs - startMs) / 86400000;
  const gain = window[window.length - 1].stars - window[0].stars;
  const velocity = days > 0 ? Math.round((gain / days) * 10) / 10 : null;

  return { gain, velocity, days };
}

// ─── ranking pipeline (pure) ────────────────────────────────────────────────

export function rankByGained(repos: RepoWithVelocity[]): RepoWithVelocity[] {
  const sorted = [...repos].sort((a, b) => (b.stars_gained ?? -1) - (a.stars_gained ?? -1));
  sorted.forEach((repo, i) => {
    repo.rank = i + 1;
  });
  return sorted;
}

export function computeRankChanges(
  repos: RepoWithVelocity[],
  prevGainMap: Map<string, number>
): void {
  const sorted = [...repos].sort(
    (a, b) => (prevGainMap.get(a.full_name) ?? 0) - (prevGainMap.get(b.full_name) ?? 0)
  );
  const prevRankMap = new Map(sorted.map((r, i) => [r.full_name, i + 1]));

  for (const repo of repos) {
    const prevRank = prevRankMap.get(repo.full_name);
    repo.rankChange = prevRank != null ? prevRank - repo.rank : null;
  }
}

export function computeAcceleration(
  repos: RepoWithVelocity[],
  prevVelocityMap: Map<string, number | null>
): void {
  for (const repo of repos) {
    const prevVel = prevVelocityMap.get(repo.full_name) ?? null;
    repo.accel =
      repo.velocity !== null && prevVel !== null && prevVel !== 0
        ? Math.round((repo.velocity / prevVel) * 10) / 10
        : null;
  }
}

// ─── stats (pure) ───────────────────────────────────────────────────────────

export function computeStats(repos: RepoWithVelocity[]) {
  const totalRepos = repos.length;
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const languages = new Set(repos.map((r) => r.language).filter(Boolean));
  const totalGained = repos.reduce((sum, r) => sum + (r.stars_gained ?? 0), 0);
  return { totalRepos, totalStars, languages: languages.size, totalGained };
}
