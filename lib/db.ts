import path from "path";
import fs from "fs";

const DATA_PATH = path.join(process.cwd(), "data", "repos.json");

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

type Store = { repos: RepoRecord[] };

const PERIOD_TO_DAYS: Record<string, number> = {
  day: 1,
  week: 7,
  month: 30,
  "6m": 180,
  year: 365,
};

function readStore(): Store {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf8")) as Store;
  } catch {
    return { repos: [] };
  }
}

function writeStore(store: Store): void {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(store));
}

export type RepoRow = Omit<RepoRecord, "history">;

export type RepoWithVelocity = RepoRow & {
  stars_gained: number;
  sparkline: number[];
  velocity: number;
};

export function getRepos(period: string): RepoWithVelocity[] {
  const days = PERIOD_TO_DAYS[period] ?? 7;
  const cutoff = Date.now() - days * 86400000;
  const store = readStore();

  return store.repos
    .map((r) => {
      const inWindow = r.history.filter(
        (h) => new Date(h.recorded_at).getTime() >= cutoff
      );
      const baseline = inWindow.length ? inWindow[0].stars : r.stars;
      const stars_gained = r.stars - baseline;
      const sparkline = (inWindow.length ? inWindow : r.history)
        .slice(-7)
        .map((h) => h.stars);
      const velocity =
        baseline > 0 ? (stars_gained / baseline) * 1000 : stars_gained;
      return {
        full_name: r.full_name,
        name: r.name,
        owner: r.owner,
        description: r.description,
        language: r.language,
        url: r.url,
        stars: r.stars,
        fetched_at: r.fetched_at,
        stars_gained,
        sparkline,
        velocity,
      };
    })
    .sort((a, b) => b.stars_gained - a.stars_gained);
}

export function getRepoId(fullName: string): number | null {
  const store = readStore();
  const idx = store.repos.findIndex((r) => r.full_name === fullName);
  return idx >= 0 ? idx : null;
}

export function insertRepo(repo: {
  full_name: string;
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  fetched_at: string;
}): number {
  const store = readStore();
  const existing = store.repos.find((r) => r.full_name === repo.full_name);
  if (existing) {
    Object.assign(existing, repo);
    writeStore(store);
    return store.repos.indexOf(existing);
  }
  store.repos.push({ ...repo, history: [] });
  writeStore(store);
  return store.repos.length - 1;
}

export function insertStarHistory(
  repoId: number,
  stars: number,
  recordedAt: string
): void {
  const store = readStore();
  const repo = store.repos[repoId];
  if (!repo) return;
  const dup = repo.history.find((h) => h.recorded_at === recordedAt);
  if (dup) dup.stars = stars;
  else repo.history.push({ stars, recorded_at: recordedAt });
  writeStore(store);
}
