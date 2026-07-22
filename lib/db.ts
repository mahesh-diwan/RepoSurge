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
}

interface RepoWithVelocity extends RepoRecord {
  rank: number;
  stars_gained: number;
  sparkline: number[];
  velocity: number;
  slug: string;
}

let cache: RepoRecord[] | null = null;

function loadRepos(): RepoRecord[] {
  if (cache) return cache;
  try {
    const raw = require("@/src/content/repos.json");
    const list = raw.repos ?? raw;
    cache = (Array.isArray(list) ? list : []).map((r: any) => ({
      ...r,
      created_at: r.created_at ?? r.fetched_at ?? "",
    }));
  } catch {
    cache = [];
  }
  return cache;
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
  const repos = loadRepos();
  const days = PERIOD_TO_DAYS[period] ?? 7;
  const cutoff = new Date(Date.now() - days * 86400000);
  const sparkCount = SPARKLINE_LENGTH[period] ?? 7;

  const withVelocity = repos.map((repo) => {
    const windowed = repo.history.filter(
      (h) => new Date(h.recorded_at) >= cutoff
    );
    const baseline = windowed.length > 0 ? windowed[0].stars : repo.stars;
    const stars_gained = repo.stars - baseline;

    const sparkHistory = windowed.length > 0 ? windowed : repo.history;
    const sparkline = sparkHistory
      .slice(-sparkCount)
      .map((h) => h.stars);

    const velocity =
      baseline > 0
        ? Math.round((stars_gained / baseline) * 1000)
        : stars_gained;

    return {
      ...repo,
      stars_gained,
      sparkline,
      velocity,
      rank: 0,
      slug: repo.full_name.replace("/", "-"),
    };
  });

  withVelocity.sort((a, b) => b.stars_gained - a.stars_gained);
  return withVelocity.map((repo, i) => ({ ...repo, rank: i + 1 }));
}

export function getStats() {
  const repos = loadRepos();
  const totalRepos = repos.length;
  const totalStars = repos.reduce((sum, r) => sum + r.stars, 0);
  const languages = new Set(repos.map((r) => r.language).filter(Boolean));
  return { totalRepos, totalStars, languages: languages.size };
}

export function getRepoDetails(
  slug: string,
  period: string = "week"
): (RepoWithVelocity & { created_at: string }) | null {
  const repos = getRepos(period);
  const repo = repos.find((r) => r.slug === slug);
  if (!repo) return null;

  const fullRepo = loadRepos().find((r) => r.full_name === repo.full_name);
  return {
    ...repo,
    created_at: fullRepo?.created_at ?? "",
  };
}
