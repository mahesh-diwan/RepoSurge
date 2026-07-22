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
        <Link
          href="/"
          className="text-dim text-xs hover:text-terminal transition-colors mb-8 inline-block"
        >
          <span className="text-terminal">$</span> cd ..
        </Link>
        <p className="text-dim text-xs mt-8">
          <span className="text-terminal">$</span> repo not found
        </p>
      </main>
    );
  }

  const createdDate = new Date(repo.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const periods = [
    { key: "day", label: "DAILY" },
    { key: "week", label: "WEEKLY" },
    { key: "month", label: "MONTHLY" },
  ];

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
        <span className="text-terminal">$</span> cd ..
      </Link>

      <ScrollReveal>
        <div className="border border-[#1a1a1a] p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div>
              <p className="text-dim text-[10px] tracking-wider mb-2">
                <span className="text-terminal">$</span> cat ./repo/{slug}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold">
                {repo.full_name}
              </h1>
              <p className="text-dim text-xs mt-2">{repo.description ?? "-"}</p>
            </div>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs border border-terminal/50 text-terminal px-4 py-2 hover:bg-terminal/10 transition-colors inline-flex items-center gap-2 shrink-0"
            >
              view on github ↗
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div>
              <p className="text-dim text-[10px] tracking-wider mb-1">STARS</p>
              <p className="text-lg font-bold tabular-nums">{repo.stars.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-dim text-[10px] tracking-wider mb-1">GAINED</p>
              <p className={`text-lg font-bold tabular-nums ${gainedColor}`}>
                {repo.stars_gained > 0 ? "+" : ""}
                {repo.stars_gained.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-dim text-[10px] tracking-wider mb-1">VELOCITY</p>
              <p className={`text-lg font-bold tabular-nums ${gainedColor}`}>
                {repo.velocity}
              </p>
            </div>
            <div>
              <p className="text-dim text-[10px] tracking-wider mb-1">CREATED</p>
              <p className="text-lg font-bold tabular-nums">{createdDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] tracking-wider mb-6">
            <span className="text-dim">PERIOD:</span>
            {periods.map((p) => (
              <Link
                key={p.key}
                href={`/repo/${slug}?period=${p.key}`}
                className={`transition-colors ${
                  period === p.key
                    ? "text-terminal"
                    : "text-dim hover:text-terminal"
                }`}
              >
                {p.label}
                {period === p.key && <span className="animate-blink text-terminal ml-0.5">_</span>}
              </Link>
            ))}
          </div>

          <div>
            <p className="text-dim text-[10px] tracking-wider mb-3">STAR HISTORY</p>
            <StarChart data={repo.sparkline} />
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
