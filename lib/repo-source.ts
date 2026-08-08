import fs from "fs";
import path from "path";

export interface HistoryEntry {
  stars: number;
  recorded_at: string;
}

export interface RepoRecord {
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
  firstSeen?: string;
  category?: string | null;
}

/**
 * Single data-source adapter for repos.json.
 * All reads of the JSON store route through here.
 */
export function loadRaw(): { repos: RepoRecord[] } {
  const file = path.join(process.cwd(), "data", "repos.json");
  if (!fs.existsSync(file)) return { repos: [] };
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  const list = parsed.repos ?? parsed;
  if (!Array.isArray(list)) return { repos: [] };
  return { repos: list };
}

/**
 * Returns owner/name pairs for all tracked repos.
 * Used by the live polling endpoint.
 */
export function getRepoNames(): { owner: string; name: string }[] {
  const { repos } = loadRaw();
  return repos
    .filter((r) => r.full_name)
    .map((r) => {
      const [owner, name] = r.full_name.split("/");
      return { owner, name };
    });
}
