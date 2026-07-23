import fs from "fs";
import path from "path";

const GITHUB_API = "https://api.github.com";
const OUTPUT = path.join(process.cwd(), "src", "content", "repos.json");
const REPOS_TO_FETCH = 500;
const MAX_HISTORY = 90;

type GitHubRepo = {
  id: number;
  full_name: string;
  name: string;
  owner: { login: string };
  description: string | null;
  language: string | null;
  html_url: string;
  stargazers_count: number;
  created_at: string;
};

type HistoryRow = { stars: number; recorded_at: string };
type RepoRecord = {
  full_name: string;
  name: string;
  owner: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  created_at: string;
  fetched_at: string;
  history: HistoryRow[];
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function githubFetch(apiPath: string): Promise<any> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "RepoSurge",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`${GITHUB_API}${apiPath}`, { headers });

    if (res.status === 429 || res.status === 403) {
      const retryAfter = res.headers.get("retry-after");
      const wait = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
      console.warn(`Rate limited, waiting ${wait / 1000}s... (attempt ${attempt + 1})`);
      await sleep(wait);
      continue;
    }

    if (!res.ok) throw new Error(`GitHub API ${res.status} for ${apiPath}`);
    return res.json();
  }
  throw new Error(`Exhausted retries for ${apiPath}`);
}

async function fetchTopRepos(count: number): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  const perPage = 100;
  const pages = Math.ceil(count / perPage);

  for (let page = 1; page <= pages; page++) {
    console.log(`Fetching page ${page}/${pages}...`);
    const data = await githubFetch(
      `/search/repositories?q=stars:>1&sort=stars&order=desc&per_page=${perPage}&page=${page}`,
    );
    repos.push(...data.items);
    console.log(`  Got ${data.items.length} repos (total: ${repos.length})`);
    if (data.items.length < perPage) break;
    await sleep(1200);
  }
  return repos.slice(0, count);
}

function readExisting(): { repos: RepoRecord[] } {
  try {
    return JSON.parse(fs.readFileSync(OUTPUT, "utf8"));
  } catch {
    return { repos: [] };
  }
}

async function main() {
  const today = new Date().toISOString();
  const store = readExisting();

  if (!process.env.GITHUB_TOKEN) {
    console.warn("GITHUB_TOKEN not set — running unauthenticated (60 req/hr limit).");
    console.warn("Set GITHUB_TOKEN in .env.local for 5000 req/hr.");
  }

  console.log(`Fetching top ${REPOS_TO_FETCH} repos by stars...`);
  const repos = await fetchTopRepos(REPOS_TO_FETCH);

  for (const repo of repos) {
    const existing = store.repos.find((r) => r.full_name === repo.full_name);

    if (existing) {
      existing.stars = repo.stargazers_count;
      existing.fetched_at = today;
      existing.history.push({
        stars: repo.stargazers_count,
        recorded_at: today,
      });
      if (existing.history.length > MAX_HISTORY) {
        existing.history = existing.history.slice(-MAX_HISTORY);
      }
    } else {
      const history: HistoryRow[] = [];
      history.push({ stars: repo.stargazers_count, recorded_at: today });
      store.repos.push({
        full_name: repo.full_name,
        name: repo.name,
        owner: repo.owner.login,
        description: repo.description,
        language: repo.language,
        url: repo.html_url,
        stars: repo.stargazers_count,
        created_at: repo.created_at,
        fetched_at: today,
        history,
      });
    }
  }

  store.repos.sort(
    (a, b) =>
      (b.history?.[b.history.length - 1]?.stars ?? 0) -
      (a.history?.[a.history.length - 1]?.stars ?? 0),
  );

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(store, null, 2));
  console.log(`Done. Wrote ${store.repos.length} repos to ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
