import Link from "next/link";
import { getRepoBySlug, getRepos } from "@/lib/db";
import StarChart from "@/components/StarChart";

export function generateStaticParams() {
  return getRepos("week").map((repo) => ({
    slug: repo.slug,
  }));
}

export default function RepoDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { period?: string };
}) {
  const { slug } = params;
  const period = searchParams.period ?? "week";
  const repo = getRepoBySlug(slug);

  if (!repo) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16">
        <Link
          href="/"
          className="text-bone/50 text-sm hover:text-electric transition-colors mb-8 inline-block"
        >
          ← Back
        </Link>
        <p className="text-bone/40">Repo not found.</p>
      </main>
    );
  }

  const periodRepos = getRepos(period);
  const periodRepo = periodRepos.find((r) => r.slug === slug);
  const stars_gained = periodRepo?.stars_gained ?? 0;
  const velocity = periodRepo?.velocity ?? 0;

  const createdDate = new Date(repo.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <Link
        href="/"
        className="text-bone/50 text-sm hover:text-electric transition-colors mb-8 inline-block"
      >
        ← Back
      </Link>

      <div className="border border-bone/20 p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {repo.full_name}
            </h1>
            <p className="text-bone/50 text-sm">{repo.description ?? "-"}</p>
          </div>
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="bg-electric text-midnight px-4 py-2 text-xs tracking-widest hover:bg-electric/80 transition-colors"
          >
            View on GitHub
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-bone/40 text-xs tracking-widest mb-1">
              TOTAL STARS
            </p>
            <p className="text-2xl font-bold tabular-nums">
              {repo.stars.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-bone/40 text-xs tracking-widest mb-1">
              STARS GAINED
            </p>
            <p
              className={`text-2xl font-bold tabular-nums ${stars_gained > 0 ? "text-electric" : stars_gained < 0 ? "text-red-500" : "text-bone/40"}`}
            >
              {stars_gained > 0 ? "+" : ""}
              {stars_gained.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-bone/40 text-xs tracking-widest mb-1">
              VELOCITY
            </p>
            <p className="text-2xl font-bold tabular-nums text-electric">
              {velocity}
            </p>
          </div>
          <div>
            <p className="text-bone/40 text-xs tracking-widest mb-1">CREATED</p>
            <p className="text-2xl font-bold">{createdDate}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 text-xs tracking-widest mb-3">
            <span className="text-bone/40">PERIOD:</span>
            <Link
              href={`/repo/${slug}?period=day`}
              className={
                period === "day"
                  ? "text-electric"
                  : "text-bone/50 hover:text-electric transition-colors"
              }
            >
              DAILY
            </Link>
            <Link
              href={`/repo/${slug}?period=week`}
              className={
                period === "week"
                  ? "text-electric"
                  : "text-bone/50 hover:text-electric transition-colors"
              }
            >
              WEEKLY
            </Link>
            <Link
              href={`/repo/${slug}?period=month`}
              className={
                period === "month"
                  ? "text-electric"
                  : "text-bone/50 hover:text-electric transition-colors"
              }
            >
              MONTHLY
            </Link>
          </div>
        </div>

        <div>
          <p className="text-bone/40 text-xs tracking-widest mb-3">
            STAR HISTORY
          </p>
          <StarChart data={repo.sparkline} />
        </div>
      </div>
    </main>
  );
}
