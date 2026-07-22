import Link from "next/link";
import { getRepoDetails, getRepos } from "@/lib/db";
import StarChart from "@/components/StarChart";
import ScrollReveal from "@/components/ScrollReveal";

export const dynamic = "force-dynamic";

export default function RepoDetailPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { period?: string };
}) {
  const { slug } = params;
  const period = searchParams.period ?? "week";
  const repo = getRepoDetails(slug, period);

  if (!repo) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16">
        <Link href="/" className="text-dim text-xs hover:text-terminal transition-colors mb-8 inline-block">
          &larr; back
        </Link>
        <p className="text-dim text-xs mt-8">repo not found</p>
      </main>
    );
  }

  const createdDate = new Date(repo.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const periods = ["day", "week", "month"];

  const gainedColor =
    repo.stars_gained > 0
      ? "text-terminal"
      : repo.stars_gained < 0
        ? "text-red-400"
        : "text-dim";

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="text-dim text-xs hover:text-terminal transition-colors mb-8 inline-block"
      >
        &larr; back
      </Link>

      <ScrollReveal>
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-balance">{repo.full_name}</h1>
          <p className="text-dim text-sm mb-6">{repo.description ?? "-"}</p>

          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-xs text-terminal border border-terminal/50 px-3 py-1.5 hover:bg-terminal/10 transition-colors mb-10"
          >
            view on github
          </a>

          <div className="flex gap-8 mb-8">
            <div>
              <p className="text-dim text-[10px] sm:text-xs mb-1">stars</p>
              <p className="text-lg font-bold tabular-nums">{repo.stars.toLocaleString("en-US")}</p>
            </div>
            <div>
              <p className="text-dim text-[10px] sm:text-xs mb-1">gained</p>
              <p className={`text-lg font-bold tabular-nums ${gainedColor}`}>
                {repo.stars_gained > 0 ? "+" : ""}
                {repo.stars_gained.toLocaleString("en-US")}
              </p>
            </div>
            <div>
              <p className="text-dim text-[10px] sm:text-xs mb-1">velocity</p>
              <p className={`text-lg font-bold tabular-nums ${gainedColor}`}>{repo.velocity}</p>
            </div>
            <div>
              <p className="text-dim text-[10px] sm:text-xs mb-1">created</p>
              <p className="text-lg font-bold tabular-nums">{createdDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6 text-xs">
            <span className="text-dim">period:</span>
            {periods.map((p) =>
              period === p ? (
                <span key={p} className="text-terminal font-bold">{p}</span>
              ) : (
                <Link key={p} href={`/repo/${slug}?period=${p}`} className="text-dim hover:text-terminal transition-colors">
                  {p}
                </Link>
              )
            )}
          </div>

          <div>
            <p className="text-dim text-[10px] sm:text-xs mb-3">star history</p>
            <StarChart data={repo.sparkline} />
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
