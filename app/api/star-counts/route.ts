import { NextResponse } from "next/server";

const REPOS = [
  { owner: "anomalyco", name: "opencode" },
  { owner: "graphify-labs", name: "graphify" },
  { owner: "n8n-io", name: "n8n" },
  { owner: "shubhamsaboo", name: "awesome-llm-apps" },
  { owner: "koala73", name: "worldmonitor" },
  { owner: "diegosouzapw", name: "omniroute" },
  { owner: "tirth8205", name: "code-review-graph" },
  { owner: "trycua", name: "cua" },
  { owner: "1jehuang", name: "jcode" },
  { owner: "ibelick", name: "ui-skills" },
  { owner: "codecrafters-io", name: "build-your-own-x" },
  { owner: "vercel", name: "next.js" },
  { owner: "shadcn-ui", name: "ui" },
  { owner: "langgenius", name: "dify" },
  { owner: "astral-sh", name: "ruff" },
];

const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 30_000;

export async function GET() {
  const now = Date.now();
  const cached = cache.get("stars");
  if (cached && now - cached.ts < CACHE_TTL)
    return NextResponse.json(cached.data);

  try {
    const results = await Promise.allSettled(
      REPOS.map(({ owner, name }) =>
        fetch(`https://api.github.com/repos/${owner}/${name}`, {
          headers: { Accept: "application/vnd.github.v3+json" },
          signal: AbortSignal.timeout(10000),
        }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      ),
    );

    const repos: { full_name: string; stars: number }[] = [];
    for (const r of results) {
      if (r.status === "fulfilled")
        repos.push({
          full_name: r.value.full_name,
          stars: r.value.stargazers_count,
        });
    }

    const payload = { ok: true, data: { repos, timestamp: new Date().toISOString() } };
    cache.set("stars", { data: payload, ts: Date.now() });
    return NextResponse.json(payload);
  } catch {
    if (cached) return NextResponse.json(cached.data);
    return NextResponse.json(
      { ok: false, error: { code: "fetch_failed", message: "Unable to fetch star counts" } },
      { status: 503 },
    );
  }
}
