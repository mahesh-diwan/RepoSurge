import reposData from "../content/repos.json";

type HistoryRow = { stars: number; recorded_at: string };
type RepoRecord = {
  full_name: string;
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  fetched_at: string;
  history: HistoryRow[];
};

export type RepoCardData = {
  rank: number;
  full_name: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  stars_gained: number;
  velocity: number;
  sparkline: number[];
  slug: string;
};

const PERIOD_TO_DAYS: Record<string, number> = {
  day: 1,
  week: 7,
  month: 30,
  "6m": 180,
  year: 365,
};

export function getRepos(period: string): RepoCardData[] {
  const days = PERIOD_TO_DAYS[period] ?? 7;
  const cutoff = Date.now() - days * 86400000;
  const repos = (reposData as { repos: RepoRecord[] }).repos;

  return repos
    .map((r) => {
      const inWindow = r.history.filter(
        (h) => new Date(h.recorded_at).getTime() >= cutoff,
      );
      const baseline = inWindow.length ? inWindow[0].stars : r.stars;
      const stars_gained = r.stars - baseline;
      const sparkline = (inWindow.length ? inWindow : r.history)
        .slice(-7)
        .map((h) => h.stars);
      const velocity =
        baseline > 0
          ? Math.round((stars_gained / baseline) * 1000)
          : stars_gained;

      return {
        full_name: r.full_name,
        description: r.description,
        language: r.language,
        url: r.url,
        stars: r.stars,
        stars_gained,
        velocity,
        sparkline,
        slug: r.full_name.replace("/", "-"),
      };
    })
    .sort((a, b) => b.stars_gained - a.stars_gained)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}
