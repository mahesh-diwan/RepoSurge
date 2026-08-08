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

export function searchRepos(repos: RepoWithVelocity[], query: string): RepoWithVelocity[] {
  if (!query) return repos;
  const q = query.toLowerCase();
  return repos.filter((r) => r.full_name.toLowerCase().includes(q));
}

export function filterByLanguage(
  repos: RepoWithVelocity[],
  lang: string | null
): RepoWithVelocity[] {
  if (!lang) return repos;
  return repos.filter((r) => r.language === lang);
}

export function filterByCategory(
  repos: RepoWithVelocity[],
  cat: string | null
): RepoWithVelocity[] {
  if (!cat) return repos;
  return repos.filter((r) => r.category === cat);
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

export function applyFilters(
  repos: RepoWithVelocity[],
  search: string,
  lang: string | null,
  cat: string | null
): RepoWithVelocity[] {
  let result = filterByCategory(repos, cat);
  result = filterByLanguage(result, lang);
  result = searchRepos(result, search);
  return result;
}
