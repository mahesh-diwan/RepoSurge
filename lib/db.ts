import rawRepos from "@/data/repos.json";

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

const reposData: RepoRecord[] = (() => {
  const list = (rawRepos as Record<string, unknown>).repos ?? rawRepos;
  return (Array.isArray(list) ? list : []).map((r: Record<string, unknown>) => ({
    ...r,
    created_at: r.created_at ?? r.fetched_at ?? ((r.history as HistoryEntry[])?.[0]?.recorded_at ?? ""),
  })) as RepoRecord[];
})();

function loadRepos(): RepoRecord[] {
  return reposData;
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

export function getRepos(period: string = "week"): RepoWithVelocity[] {
  return computeAllRepos(period);
}

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

  const slope = (N * sumXY - sumX * sumY) / (N * sumX2 - sumX * sumX);
  if (slope <= 0) return null;

  const currentStars = points[N - 1];
  if (currentStars <= 0) return null;

  const magnitude = Math.pow(10, Math.floor(Math.log10(currentStars)));
  const milestone = (Math.floor(currentStars / magnitude) + 1) * magnitude;
  const daysToMilestone = Math.ceil((milestone - currentStars) / slope);

  return `${Math.round(milestone / 1000)}K ~${daysToMilestone}d`;
}

function computeAllRepos(period: string): RepoWithVelocity[] {
  const repos = loadRepos();
  const days = PERIOD_TO_DAYS[period] ?? 7;
  const cutoff = new Date(Date.now() - days * 86400000);
  const sparkCount = SPARKLINE_LENGTH[period] ?? 7;

  const withVelocity = repos.map((repo) => {
    const windowed = repo.history.filter(
      (h) => new Date(h.recorded_at) >= cutoff
    );

    const hasGap =
      windowed.length >= 2 &&
      (() => {
        for (let i = 1; i < windowed.length; i++) {
          const prev = new Date(windowed[i - 1].recorded_at).getTime();
          const curr = new Date(windowed[i].recorded_at).getTime();
          if (curr - prev > 48 * 3600000) return true;
        }
        return false;
      })();

    const baseline = windowed.length > 0 ? windowed[0].stars : repo.stars;
    const stars_gained = hasGap ? null : repo.stars - baseline;

    const sparkHistory = windowed.length > 0 ? windowed : repo.history;
    const sparkline = sparkHistory
      .slice(-sparkCount)
      .map((h) => h.stars);

    const velocity =
      stars_gained === null
        ? null
        : baseline > 0
          ? Math.round((stars_gained / baseline) * 1000)
          : stars_gained;

    return {
      ...repo,
      isNew: repo.isNew ?? false,
      category: repo.category ?? null,
      stars_gained,
      sparkline,
      velocity,
      rank: 0,
      slug: repo.full_name.replace("/", "-"),
    };
  });

  withVelocity.sort((a, b) => (b.stars_gained ?? 0) - (a.stars_gained ?? 0));
  withVelocity.forEach((repo, i) => { (repo as RepoWithVelocity).rank = i + 1; });

  // Compute previous period data for gainedPrev, rankChange, accel
  const prevDays = PERIOD_TO_DAYS[period] ?? 7;
  const prevEnd = Date.now() - prevDays * 86400000;
  const prevStart = prevEnd - prevDays * 86400000;

  const prevMeta = new Map<string, { gainedPrev: number | null; prevVelocity: number | null }>();
  const prevGains: { full_name: string; gain: number }[] = [];

  for (const repo of loadRepos()) {
    const prevWindow = repo.history.filter(h => {
      const t = new Date(h.recorded_at).getTime();
      return t >= prevStart && t < prevEnd;
    });

    let gainedPrev: number | null;
    let prevVelocity: number | null;

    if (prevWindow.length >= 2) {
      const base = prevWindow[0].stars;
      gainedPrev = prevWindow[prevWindow.length - 1].stars - base;
      prevVelocity = base > 0 ? Math.round((gainedPrev / base) * 1000) : gainedPrev;
    } else {
      gainedPrev = null;
      prevVelocity = null;
    }

    prevMeta.set(repo.full_name, { gainedPrev, prevVelocity });
    prevGains.push({ full_name: repo.full_name, gain: gainedPrev ?? 0 });
  }

  prevGains.sort((a, b) => b.gain - a.gain);
  const prevRankMap = new Map(prevGains.map((c, i) => [c.full_name, i + 1]));

  for (const repo of withVelocity) {
    const r = repo as RepoWithVelocity;
    const prev = prevMeta.get(repo.full_name);
    r.gainedPrev = prev?.gainedPrev ?? null;
    r.rankChange = prevRankMap.has(repo.full_name)
      ? prevRankMap.get(repo.full_name)! - repo.rank
      : null;
    r.accel = (r.velocity !== null && prev?.prevVelocity !== null && prev!.prevVelocity !== 0)
      ? r.velocity / prev!.prevVelocity!
      : null;
    r.forecast = computeForecast(repo.sparkline);
  }

  return withVelocity as RepoWithVelocity[];
}

export function getStats() {
  const repos = loadRepos();
  const totalRepos = repos.length;
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const languages = new Set(repos.map((r) => r.language).filter(Boolean));
  const totalGained = repos.reduce((sum, r) => {
    const n =
      (r.history.at(-1)?.stars ?? r.stars) - (r.history.at(0)?.stars ?? r.stars);
    return sum + Math.max(0, n);
  }, 0);
  return { totalRepos, totalStars, languages: languages.size, totalGained };
}

export function getLastUpdated(): string {
  const repos = loadRepos();
  const dates = repos
    .flatMap(r => [r.fetched_at, ...r.history.map(h => h.recorded_at)])
    .filter(Boolean);
  if (dates.length === 0) return "";
  return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
}

export function getRepoDetails(
  slug: string,
  period: string = "week"
): (RepoWithVelocity & { created_at: string; gained7d: number | null; rankChange: number | null }) | null {
  const repos = computeAllRepos(period);

  const matchSlug = slug.replace("/", "-");
  const repo = repos.find((r) => r.slug === matchSlug || r.full_name === slug);
  if (!repo) return null;

  const fullRepo = loadRepos().find((r) => r.full_name === repo.full_name);
  const gained7d =
    repo.stars_gained !== null && fullRepo && fullRepo.history.length >= 8
      ? fullRepo.history[fullRepo.history.length - 1].stars -
        fullRepo.history[fullRepo.history.length - 8].stars
      : null;
  return {
    ...repo,
    created_at: fullRepo?.created_at ?? "",
    gained7d,
  };
}
