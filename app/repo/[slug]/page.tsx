import { type Metadata } from "next";
import Link from "next/link";
import { getRepoDetails, formatVelocity } from "@/lib/db";
import StarChart from "@/components/StarChart";
import { gainedColor } from "@/lib/gained-color";

const periods = ["day", "week", "month"];
const periodLabels: Record<string, string> = { day: "Daily", week: "Weekly", month: "Monthly" };

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const repo = getRepoDetails(slug);

  if (!repo) {
    return { title: "Repo not found - RepoSurge" };
  }

  return {
    title: `${repo.full_name} - RepoSurge`,
    description: repo.description ?? `${repo.full_name} star velocity on RepoSurge`,
  };
}

export default function RepoDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { period?: string };
}) {
  const { slug } = params;
  const period = periods.includes(searchParams.period ?? "")
    ? searchParams.period!
    : "week";
  const repo = getRepoDetails(slug, period);

  if (!repo) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-text-muted text-xs hover:text-accent transition-colors mb-8 inline-block"
        >
          Back
        </Link>
        <p className="text-text-muted text-sm mt-8">Repo not found</p>
      </main>
    );
  }

  const createdDate = new Date(repo.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
      <Link
        href="/"
        className="text-text-dim text-xs font-mono hover:text-accent transition-colors mb-8 inline-block"
      >
        BACK
      </Link>

      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-text-body tracking-tight text-balance">
            {repo.full_name}
          </h1>
          <p className="text-text-muted text-sm mb-4">{repo.description ?? "—"}</p>
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-mono bg-accent/10 text-accent px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-colors"
          >
            VIEW ON GITHUB
          </a>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
          <div className="card p-3">
            <p className="section-label mb-1">Stars</p>
            <p className="data-mono text-lg font-bold tabular-nums text-text-body">
              {repo.stars.toLocaleString("en-US")}
            </p>
          </div>
          <div className="card p-3">
            <p className="section-label mb-1">Gained</p>
            <p
              className={`data-mono text-lg font-bold tabular-nums ${gainedColor(repo.stars_gained ?? 0)}`}
            >
              {repo.stars_gained !== null
                ? (repo.stars_gained > 0 ? "+" : "") +
                  repo.stars_gained.toLocaleString("en-US")
                : "—"}
            </p>
          </div>
          <div className="card p-3">
            <p className="section-label mb-1">Velocity</p>
            <p className="data-mono text-lg font-bold tabular-nums text-text-body">
              {formatVelocity(repo.velocity)}
              <span className="text-text-dim text-xs ml-0.5">/d</span>
            </p>
          </div>
          <div className="card p-3">
            <p className="section-label mb-1">7d gain</p>
            <p
              className={`data-mono text-lg font-bold tabular-nums ${gainedColor(repo.stars_gained ?? 0)}`}
            >
              {repo.gained7d !== null
                ? (repo.gained7d > 0 ? "+" : "") +
                  repo.gained7d.toLocaleString("en-US")
                : "—"}
            </p>
          </div>
          <div className="card p-3">
            <p className="section-label mb-1">Created</p>
            <p className="data-mono text-lg font-bold tabular-nums text-text-body">
              {createdDate}
            </p>
          </div>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-2 mb-6">
          <span className="section-label mr-1">Period:</span>
          {periods.map((p) =>
            period === p ? (
              <span
                key={p}
className="rounded-full px-3 py-1 text-xs bg-accent text-midnight font-medium"
              >
                {periodLabels[p]}
              </span>
            ) : (
              <Link
                key={p}
                href={`/repo/${slug}?period=${p}`}
                className="rounded-full px-3 py-1 text-xs bg-surface border border-border text-text-muted hover:text-text-body transition-colors duration-200"
              >
                {periodLabels[p]}
              </Link>
            )
          )}
        </div>

        {/* Chart */}
        <div className="card p-4">
          <p className="section-label mb-3">Star history</p>
          <div className="h-40 w-full">
            <StarChart history={repo.history} period={period} />
          </div>
        </div>
      </div>
    </main>
  );
}
