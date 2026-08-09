import { type Metadata } from "next";
import Link from "next/link";
import { getRepoDetails, formatVelocity } from "@/lib/db";
import Sparkline from "@/components/Sparkline";
import { gainedColor } from "@/lib/gained-color";
import ForecastBar from "@/components/ForecastBar";

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
          className="text-text-dim text-xs hover:text-accent transition-colors mb-8 inline-block"
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
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <Link
        href="/"
        className="text-text-dim text-xs font-mono hover:text-accent transition-colors mb-10 inline-block"
      >
        BACK
      </Link>

      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-black mb-2 text-text-body tracking-tight text-balance">
            {repo.full_name}
          </h1>
          <p className="text-text-muted text-sm mb-5">{repo.description ?? "—"}</p>
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 text-xs font-mono bg-accent/10 text-accent px-4 py-2 rounded-full hover:bg-accent/20 transition-[transform,background-color] duration-200 ease-spring active:scale-[0.97]"
          >
            VIEW ON GITHUB
            <span className="btn-icon">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </span>
          </a>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
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
        <div className="flex items-center gap-2 mb-8">
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
                className="rounded-full px-3 py-1 text-xs bg-surface border border-border text-text-muted hover:text-text-body transition-colors duration-200 ease-spring"
              >
                {periodLabels[p]}
              </Link>
            )
          )}
        </div>

        {/* Chart */}
        <div className="card-shell">
          <div className="card-core">
            <p className="section-label mb-3">Star history</p>
            <div className="h-40 w-full">
              <Sparkline history={repo.history} period={period} variant="chart" />
            </div>
          </div>
        </div>

        {/* Forecast */}
        {repo.forecast && (
          <div className="mt-4 card-shell">
            <div className="card-core">
              <p className="section-label mb-3">Forecast</p>
              <ForecastBar forecast={repo.forecast} currentStars={repo.stars} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
