import type { RepoWithVelocity } from "./db";

export type SortKey =
  | "rank"
  | "name"
  | "gained"
  | "stars"
  | "velocity"
  | "gainedPrev"
  | "accel"
  | "forecast";

export type SortDir = "asc" | "desc";

/**
 * Simple fuzzy match: checks if all characters of the query appear
 * in order within the target string. Tolerant of typos and partial input.
 */
function fuzzyMatch(target: string, query: string): boolean {
  const t = target.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return true;
  if (t.includes(q)) return true; // fast path for substring match

  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

export function searchRepos(repos: RepoWithVelocity[], query: string): RepoWithVelocity[] {
  if (!query) return repos;
  return repos.filter((r) => fuzzyMatch(r.full_name, query));
}

export function filterByLanguage(
  repos: RepoWithVelocity[],
  langs: string[] | null
): RepoWithVelocity[] {
  if (!langs || langs.length === 0) return repos;
  return repos.filter((r) => r.language && langs.includes(r.language));
}

export function filterByCategory(
  repos: RepoWithVelocity[],
  cats: string[] | null
): RepoWithVelocity[] {
  if (!cats || cats.length === 0) return repos;
  return repos.filter((r) => r.category && cats.includes(r.category));
}

export function sortRepos(
  repos: RepoWithVelocity[],
  key: SortKey | null,
  dir: SortDir
): RepoWithVelocity[] {
  if (!key) return repos;
  return [...repos].sort((a, b) => {
    const d = dir === "asc" ? 1 : -1;
    switch (key) {
      case "rank":
        return (a.rank - b.rank) * d;
      case "name":
        return a.full_name.localeCompare(b.full_name) * d;
      case "gained":
        return ((a.stars_gained ?? 0) - (b.stars_gained ?? 0)) * d;
      case "stars":
        return (a.stars - b.stars) * d;
      case "velocity":
        return ((a.velocity ?? 0) - (b.velocity ?? 0)) * d;
      case "gainedPrev":
        return ((a.gainedPrev ?? 0) - (b.gainedPrev ?? 0)) * d;
      case "accel":
        return ((a.accel ?? 0) - (b.accel ?? 0)) * d;
      case "forecast":
        return (a.forecast ?? "").localeCompare(b.forecast ?? "") * d;
      default:
        return 0;
    }
  });
}
