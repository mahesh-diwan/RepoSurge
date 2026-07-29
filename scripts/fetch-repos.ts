import fs from "fs";
import path from "path";
import { z } from "zod";

const GITHUB_API = "https://api.github.com";
const OUTPUT = path.join(process.cwd(), "data", "repos.json");
const REPOS_TO_FETCH = 50;
const MAX_HISTORY = 90;

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  ai: ["gpt", "llm", "transformer", "neural", "machine learning", "deep learning", "ai", "artificial intelligence", "language model", "token", "embedding", "rag", "diffusion", "stable diffusion"],
  database: ["database", "sql", "postgres", "mysql", "sqlite", "redis", "mongodb", "cockroach", "dynamo", "cassandra", "neo4j", "duckdb"],
  devtools: ["cli", "terminal", "compiler", "linter", "formatter", "debugger", "package manager", "bundler", "build tool", "ide", "editor"],
  framework: ["framework", "react", "vue", "angular", "svelte", "nextjs", "next.js", "nuxt", "django", "rails", "spring", "laravel"],
  infra: ["kubernetes", "k8s", "docker", "terraform", "ansible", "cloud", "aws", "gcp", "azure", "container", "orchestrator"],
};

function detectCategory(description: string | null): string | null {
  if (!description) return null;
  const lower = description.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) return category;
    }
  }
  return null;
}

const GitHubRepoResponse = z.object({
  id: z.number(),
  full_name: z.string(),
  name: z.string(),
  owner: z.object({ login: z.string() }),
  description: z.string().nullable(),
  language: z.string().nullable(),
  html_url: z.string(),
  stargazers_count: z.number(),
  created_at: z.string(),
});

const GitHubSearchResponse = z.object({
  items: z.array(GitHubRepoResponse),
});

type GitHubRepo = z.infer<typeof GitHubRepoResponse>;

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
  isNew: boolean;
  category: string | null;
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
    const parsed = GitHubSearchResponse.safeParse(data);
    if (!parsed.success) {
      console.error("GitHub API response validation failed:", parsed.error.format());
      throw new Error("Invalid GitHub API response shape");
    }
    repos.push(...parsed.data.items);
    console.log(`  Got ${parsed.data.items.length} repos (total: ${repos.length})`);
    if (parsed.data.items.length < perPage) break;
    await sleep(1200);
  }
  return repos.slice(0, count);
}

function readExisting(): { repos: RepoRecord[] } {
  try {
    const parsed = JSON.parse(fs.readFileSync(OUTPUT, "utf8"));
    if (validateStore(parsed)) return parsed;
    console.warn("Invalid data format, starting fresh.");
    return { repos: [] };
  } catch {
    return { repos: [] };
  }
}

function validateStore(store: unknown): store is { repos: RepoRecord[] } {
  if (typeof store !== "object" || store === null) return false;
  const s = store as Record<string, unknown>;
  if (!Array.isArray(s.repos)) return false;
  return s.repos.every(
    (r) =>
      typeof r === "object" &&
      r !== null &&
      typeof (r as Record<string, unknown>).full_name === "string",
  );
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  const today = todayStr();
  let store = readExisting();

  if (!validateStore(store)) {
    console.warn("Invalid data file, starting fresh.");
    store = { repos: [] };
  }

  const existingNames = new Set(store.repos.map((r) => r.full_name));
  const staleCutoff = new Date(Date.now() - 31 * 86400000);
  store.repos = store.repos.filter(
    (r) =>
      existingNames.has(r.full_name) ||
      new Date(r.fetched_at) > staleCutoff,
  );

  if (!process.env.GITHUB_TOKEN) {
    console.warn("GITHUB_TOKEN not set — running unauthenticated (60 req/hr limit).");
    console.warn("Set GITHUB_TOKEN in .env.local for 5000 req/hr.");
  }

  console.log(`Fetching top ${REPOS_TO_FETCH} repos by stars...`);
  const repos = await fetchTopRepos(REPOS_TO_FETCH);

  for (const repo of repos) {
    const existing = store.repos.find((r) => r.full_name === repo.full_name);
    const category = detectCategory(repo.description);

    if (existing) {
      existing.stars = repo.stargazers_count;
      existing.language = repo.language;
      existing.fetched_at = today;
      existing.isNew = false;
      existing.category = category;
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
        isNew: !existingNames.has(repo.full_name),
        category,
      });
    }
  }

  store.repos.sort(
    (a, b) =>
      (b.history?.[b.history.length - 1]?.stars ?? b.stars) -
      (a.history?.[a.history.length - 1]?.stars ?? a.stars),
  );

  try {
    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
    const tmp = `${OUTPUT}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(store, null, 2));
    fs.renameSync(tmp, OUTPUT);
    console.log(`Done. Wrote ${store.repos.length} repos to ${OUTPUT}`);
  } catch (err) {
    console.error("Failed to write output:", err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
