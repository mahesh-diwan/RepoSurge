import { NextResponse } from "next/server";
import { getRepoNames } from "@/lib/repo-source";

interface CacheEntry {
  data: any;
  ts: number;
  stale: boolean;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 120_000; // 2 minutes fresh
const STALE_TTL = 600_000; // 10 minutes stale-while-revalidate
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(
  url: string,
  headers: Record<string, string>,
  retries = MAX_RETRIES
): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(10000),
      });
      if (res.status === 429 || res.status === 403) {
        // Rate limited - wait and retry
        const retryAfter = res.headers.get("retry-after");
        const wait = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY * (attempt + 1);
        await sleep(wait);
        continue;
      }
      return res;
    } catch (err) {
      if (attempt === retries - 1) throw err;
      await sleep(RETRY_DELAY * (attempt + 1));
    }
  }
  throw new Error("Max retries exceeded");
}

export async function GET() {
  const now = Date.now();
  const cached = cache.get("stars");

  // Return fresh cache immediately
  if (cached && now - cached.ts < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  // Stale-while-revalidate: return stale data, refresh in background
  if (cached && now - cached.ts < STALE_TTL && !cached.stale) {
    // Mark as stale and refresh in background
    cache.set("stars", { ...cached, stale: true });
    refreshInBackground();
    return NextResponse.json(cached.data);
  }

  // No cache or fully expired - fetch synchronously
  try {
    const data = await fetchStarCounts();
    cache.set("stars", { data, ts: now, stale: false });
    return NextResponse.json(data);
  } catch {
    // Return stale cache if available, otherwise error
    if (cached) return NextResponse.json(cached.data);
    return NextResponse.json(
      {
        ok: false,
        error: { code: "fetch_failed", message: "Unable to fetch star counts" },
      },
      { status: 503 },
    );
  }
}

async function refreshInBackground() {
  try {
    const data = await fetchStarCounts();
    cache.set("stars", { data, ts: Date.now(), stale: false });
  } catch {
    // Background refresh failed - will retry on next request
  }
}

async function fetchStarCounts() {
  const repoNames = getRepoNames();
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "RepoSurge",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const results = await Promise.allSettled(
    repoNames.map(({ owner, name }) =>
      fetchWithRetry(`https://api.github.com/repos/${owner}/${name}`, headers).then((r) =>
        r.ok ? r.json() : Promise.reject(r.status)
      )
    )
  );

  const repos: { full_name: string; stars: number }[] = [];
  let failedCount = 0;

  for (const r of results) {
    if (r.status === "fulfilled") {
      repos.push({
        full_name: r.value.full_name,
        stars: r.value.stargazers_count,
      });
    } else {
      failedCount++;
    }
  }

  return {
    ok: true,
    data: {
      repos,
      timestamp: new Date().toISOString(),
      partial: failedCount > 0,
      failedCount,
    },
  };
}
