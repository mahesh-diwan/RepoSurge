import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 120_000;

function getRepoNames(): { owner: string; name: string }[] {
  const file = path.join(process.cwd(), "src", "content", "repos.json");
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const list = raw.repos ?? raw;
  return (Array.isArray(list) ? list : [])
    .filter((r: any) => r.full_name)
    .map((r: any) => {
      const [owner, name] = r.full_name.split("/");
      return { owner, name };
    });
}

export async function GET() {
  const now = Date.now();
  const cached = cache.get("stars");
  if (cached && now - cached.ts < CACHE_TTL)
    return NextResponse.json(cached.data);

  const repoNames = getRepoNames();

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = { Accept: "application/vnd.github.v3+json", "User-Agent": "RepoSurge" };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const results = await Promise.allSettled(
      repoNames.map(({ owner, name }) =>
        fetch(`https://api.github.com/repos/${owner}/${name}`, {
          headers,
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
