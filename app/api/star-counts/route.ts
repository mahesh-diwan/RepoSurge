import { NextResponse } from "next/server";

const REPOS = [
  { owner: "anomalyco", name: "opencode" },
  { owner: "Graphify-Labs", name: "graphify" },
  { owner: "koala73", name: "worldmonitor" },
  { owner: "tirth8205", name: "code-review-graph" },
  { owner: "DiegoSouzaPW", name: "omniroute" },
  { owner: "n8n-io", name: "n8n" },
  { owner: "1jehuang", name: "jcode" },
  { owner: "shubhamsaboo", name: "awesome-llm-apps" },
  { owner: "all-ai", name: "obsidian-tbirth" },
  { owner: "tony-istahockey", name: "pianolab" },
  { owner: "peter-kish", name: "glacier" },
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
          next: { revalidate: 30 },
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

    const payload = { repos, timestamp: new Date().toISOString() };
    cache.set("stars", { data: payload, ts: Date.now() });
    return NextResponse.json(payload);
  } catch {
    if (cached) return NextResponse.json(cached.data);
    return NextResponse.json(
      { repos: [], timestamp: now.toString() },
      { status: 503 },
    );
  }
}
