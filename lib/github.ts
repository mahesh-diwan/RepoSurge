const GITHUB_API = "https://api.github.com";

function githubFetch(path: string): Promise<any> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "RepoSurge",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  return fetch(`${GITHUB_API}${path}`, { headers }).then((res) => {
    if (!res.ok) {
      throw new Error(`GitHub API ${res.status} for ${path}`);
    }
    return res.json();
  });
}

export type GitHubRepo = {
  id: number;
  full_name: string;
  name: string;
  owner: { login: string };
  description: string | null;
  language: string | null;
  html_url: string;
  stargazers_count: number;
};

export async function fetchTopRepos(
  language: string,
  count = 100
): Promise<GitHubRepo[]> {
  const q = encodeURIComponent(`language:${language} stars:>1`);
  const repos: GitHubRepo[] = [];
  const perPage = 100;
  const pages = Math.ceil(count / perPage);

  for (let page = 1; page <= pages; page++) {
    const data = await githubFetch(
      `/search/repositories?q=${q}&sort=stars&order=desc&per_page=${perPage}&page=${page}`
    );
    repos.push(...data.items);
    if (data.items.length < perPage) break;
  }

  return repos.slice(0, count);
}

export function parseRepoFullName(fullName: string): {
  owner: string;
  name: string;
} {
  const [owner, name] = fullName.split("/");
  return { owner, name };
}

export async function getStarHistory(
  fullName: string,
  count = 7
): Promise<number[]> {
  const { owner, name } = parseRepoFullName(fullName);
  const data = await githubFetch(
    `/repos/${owner}/${name}/stats/star_history`
  );
  if (!Array.isArray(data)) return [];
  return data
    .slice(-count)
    .map((d: any) => d.stargazers_total ?? d.stars ?? 0);
}
