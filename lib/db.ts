import {
  PERIOD_TO_DAYS,
  SPARKLINE_LENGTH,
  computeVelocity,
  computeSparkline,
  computeForecast,
  computeWindowGain,
  rankByGained,
  computeRankChanges,
  computeAcceleration,
  computeStats,
} from "./repo-compute";
import { loadRaw } from "./repo-source";
import type { RepoRecord, HistoryEntry } from "./repo-source";

// ─── types ──────────────────────────────────────────────────────────────────

export type { RepoRecord, HistoryEntry };

export interface RepoWithVelocity extends RepoRecord {
  rank: number;
  stars_gained: number | null;
  sparkline: number[];
  velocity: number | null;
  slug: string;
  rankChange: number | null;
  gainedPrev: number | null;
  accel: number | null;
  forecast: string | null;
  isNew: boolean;
  category: string | null;
}

// ─── normalization ──────────────────────────────────────────────────────────

const NEW_BADGE_DAYS = 7;

function isNewRepo(r: RepoRecord): boolean {
  const firstSeen = r.firstSeen ?? r.fetched_at ?? r.history?.[0]?.recorded_at;
  if (!firstSeen) return false;
  const daysSinceSeen = (Date.now() - new Date(firstSeen).getTime()) / 86400000;
  return daysSinceSeen <= NEW_BADGE_DAYS;
}

function normalizeRepos(raw: RepoRecord[]): RepoRecord[] {
  return raw.map((r) => ({
    ...r,
    history: [...(r.history ?? [])].sort(
      (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    ),
    isNew: isNewRepo(r),
    category: r.category ?? null,
    created_at: r.created_at ?? r.fetched_at ?? r.history?.[0]?.recorded_at ?? "",
  }));
}

// ─── public interface ───────────────────────────────────────────────────────

export function formatVelocity(v: number | null): string {
  if (v === null) return "\u2014";
  if (v < 10) return v.toFixed(1);
  return Math.round(v).toString();
}

export function getRepos(period: string = "week"): RepoWithVelocity[] {
  const { repos } = loadRaw();
  const normalized = normalizeRepos(repos);
  const days = PERIOD_TO_DAYS[period] ?? 7;
  const cutoffMs = Date.now() - days * 86400000;
  const sparkCount = SPARKLINE_LENGTH[period] ?? 7;

  // ── current window ──────────────────────────────────────────────────────
  const withVelocity: RepoWithVelocity[] = normalized.map((repo) => {
    const windowed = repo.history.filter(
      (h) => new Date(h.recorded_at).getTime() >= cutoffMs
    );

    const windowSpan =
      windowed.length >= 2
        ? new Date(windowed[windowed.length - 1].recorded_at).getTime() -
          new Date(windowed[0].recorded_at).getTime()
        : 0;

    const hasData = windowed.length >= 2 && windowSpan >= (days * 86400000) / 2;
    const baseline = windowed.length > 0 ? windowed[0].stars : repo.stars;
    const stars_gained = hasData ? repo.stars - baseline : null;

    const sparkline = computeSparkline(windowed, repo.history, sparkCount);
    const velocity = computeVelocity(stars_gained, days);

    return {
      ...repo,
      isNew: repo.isNew ?? false,
      category: repo.category ?? null,
      stars_gained,
      sparkline,
      velocity,
      rank: 0,
      slug: repo.full_name.replace("/", "-"),
      rankChange: null,
      gainedPrev: null,
      accel: null,
      forecast: computeForecast(sparkline),
    };
  });

  const ranked = rankByGained(withVelocity);

  // ── previous window (for rank change + acceleration) ────────────────────
  const prevDays = days;
  const prevEnd = Date.now() - prevDays * 86400000;
  const prevStart = prevEnd - prevDays * 86400000;

  const prevGainMap = new Map<string, number>();
  const prevVelocityMap = new Map<string, number | null>();
  const prevGainActual = new Map<string, number | null>();

  for (const repo of normalized) {
    const { gain, velocity } = computeWindowGain(repo.history, prevStart, prevEnd);
    prevGainMap.set(repo.full_name, gain ?? 0);
    prevVelocityMap.set(repo.full_name, velocity);
    prevGainActual.set(repo.full_name, gain);
  }

  computeRankChanges(ranked, prevGainMap);
  computeAcceleration(ranked, prevVelocityMap);

  // attach gainedPrev for display (null when insufficient data)
  for (const repo of ranked) {
    repo.gainedPrev = prevGainActual.get(repo.full_name) ?? null;
  }

  return ranked;
}

export function getStats(period: string = "week") {
  const repos = getRepos(period);
  return computeStats(repos);
}

export function getLastUpdated(): string {
  const { repos } = loadRaw();
  const dates = repos
    .flatMap((r) => [r.fetched_at, ...r.history.map((h) => h.recorded_at)])
    .filter(Boolean);
  if (dates.length === 0) return "";
  return dates.sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  )[0];
}

export function getRepoDetails(
  slug: string,
  period: string = "week"
): (RepoWithVelocity & { created_at: string; gained7d: number | null }) | null {
  const repos = getRepos(period);
  const matchSlug = slug.replace("/", "-");
  const repo = repos.find((r) => r.slug === matchSlug || r.full_name === slug);
  if (!repo) return null;

  const { repos: rawRepos } = loadRaw();
  const fullRepo = normalizeRepos(rawRepos).find(
    (r) => r.full_name === repo.full_name
  );

  const gained7d =
    fullRepo && fullRepo.history.length >= 8
      ? fullRepo.history[fullRepo.history.length - 1].stars -
        fullRepo.history[fullRepo.history.length - 8].stars
      : null;

  return {
    ...repo,
    created_at: fullRepo?.created_at ?? "",
    gained7d,
  };
}
