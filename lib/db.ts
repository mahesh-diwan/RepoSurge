import fs from "fs";
import path from "path";

export function formatVelocity(v: number | null): string {
  if (v === null) return "\u2014";
  if (v < 10) return v.toFixed(1);
  return Math.round(v).toString();
}

interface HistoryEntry {
  stars: number;
  recorded_at: string;
}

interface RepoRecord {
  full_name: string;
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  created_at: string;
  fetched_at: string;
  history: HistoryEntry[];
  isNew?: boolean;
  category?: string | null;
}

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

function loadRaw(): { repos: RepoRecord[] } {
  const file = path.join(process.cwd(), "data", "repos.json");
  if (!fs.existsSync(file)) return { repos: [] };
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  const list = parsed.repos ?? parsed;
  if (!Array.isArray(list)) return { repos: [] };
  return { repos: list };
}

function normalizeRepos(raw: RepoRecord[]): RepoRecord[] {
  return raw.map((r) => ({
    ...r,
    history: [...(r.history ?? [])].sort(
      (a, b) =>
        new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    ),
    isNew: r.isNew ?? false,
    category: r.category ?? null,
    created_at: r.created_at ?? r.fetched_at ?? r.history?.[0]?.recorded_at ?? "",
  }));
}

const PERIOD_TO_DAYS: Record<string, number> = {
  day: 1,
  week: 7,
  month: 30,
};

const SPARKLINE_LENGTH: Record<string, number> = {
  day: 3,
  week: 7,
  month: 14,
};

function computeForecast(sparkline: number[]): string | null {
  const points = sparkline.slice(-14);
  if (points.length < 3) return null;

  const N = points.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
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

export function getRepos(period: string = "week"): RepoWithVelocity[] {
  const { repos } = loadRaw();
  const normalized = normalizeRepos(repos);
  const days = PERIOD_TO_DAYS[period] ?? 7;
  const cutoff = new Date(Date.now() - days * 86400000);
  const sparkCount = SPARKLINE_LENGTH[period] ?? 7;

  const withVelocity: RepoWithVelocity[] = normalized.map((repo) => {
    const windowed = repo.history.filter(
      (h) => new Date(h.recorded_at) >= cutoff
    );

    const windowSpan =
      windowed.length >= 2
        ? new Date(windowed[windowed.length - 1].recorded_at).getTime() -
          new Date(windowed[0].recorded_at).getTime()
        : 0;

    const hasData = windowed.length >= 2 && windowSpan >= (days * 86400000) / 2;

    const baseline = windowed.length > 0 ? windowed[0].stars : repo.stars;
    const stars_gained = hasData ? repo.stars - baseline : null;

    const sparkHistory = windowed.length > 0 ? windowed : repo.history.slice(-sparkCount);
    const sparkline = sparkHistory.slice(-sparkCount).map((h) => h.stars);

    const velocity =
      stars_gained !== null && days > 0
        ? Math.round((stars_gained / days) * 10) / 10
        : null;

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

  withVelocity.sort((a, b) => (b.stars_gained ?? -1) - (a.stars_gained ?? -1));
  withVelocity.forEach((repo, i) => {
    repo.rank = i + 1;
  });

  const prevDays = days;
  const prevEnd = Date.now() - prevDays * 86400000;
  const prevStart = prevEnd - prevDays * 86400000;

  const prevMeta = new Map<string, { gainedPrev: number | null; prevVelocity: number | null }>();
  const prevGains: { full_name: string; gain: number }[] = [];

  for (const repo of normalized) {
    const prevWindow = repo.history.filter((h) => {
      const t = new Date(h.recorded_at).getTime();
      return t >= prevStart && t < prevEnd;
    });

    let gainedPrev: number | null = null;
    let prevVelocity: number | null = null;

    if (prevWindow.length >= 2) {
      const base = prevWindow[0].stars;
      gainedPrev = prevWindow[prevWindow.length - 1].stars - base;
      prevVelocity =
        gainedPrev !== null && prevDays > 0
          ? Math.round((gainedPrev / prevDays) * 10) / 10
          : null;
    }

    prevMeta.set(repo.full_name, { gainedPrev, prevVelocity });
    prevGains.push({ full_name: repo.full_name, gain: gainedPrev ?? 0 });
  }

  prevGains.sort((a, b) => b.gain - a.gain);
  const prevRankMap = new Map(prevGains.map((c, i) => [c.full_name, i + 1]));

  for (const repo of withVelocity) {
    const prev = prevMeta.get(repo.full_name);
    repo.gainedPrev = prev?.gainedPrev ?? null;
    repo.rankChange = prevRankMap.has(repo.full_name)
      ? prevRankMap.get(repo.full_name)! - repo.rank
      : null;
    repo.accel =
      repo.velocity !== null &&
      prev?.prevVelocity !== null &&
      prev!.prevVelocity !== 0
        ? Math.round((repo.velocity / prev!.prevVelocity!) * 10) / 10
        : null;
  }

  return withVelocity;
}

export function getStats(period: string = "week") {
  const repos = getRepos(period);
  const totalRepos = repos.length;
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const languages = new Set(repos.map((r) => r.language).filter(Boolean));
  const totalGained = repos.reduce((sum, r) => sum + (r.stars_gained ?? 0), 0);
  return { totalRepos, totalStars, languages: languages.size, totalGained };
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
