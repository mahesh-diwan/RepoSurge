import Link from "next/link";
import { getRepoBySlug, getRepos } from "@/lib/db";
import StarChart from "@/components/StarChart";
import ScrollReveal from "@/components/ScrollReveal";

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
      <main className="max-w-7xl mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-bone/40 text-sm hover:text-electric transition-colors duration-500 mb-8 inline-block"
        >
          ← Back
        </Link>
        <div className="glass-card p-12 text-center">
          <p className="text-bone/30">Repo not found.</p>
        </div>
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

  const stats = [
    { label: "TOTAL STARS", value: repo.stars.toLocaleString() },
    {
      label: "STARS GAINED",
      value: `${stars_gained > 0 ? "+" : ""}${stars_gained.toLocaleString()}`,
      color: stars_gained > 0 ? "text-electric" : stars_gained < 0 ? "text-red-400" : "text-bone/40",
    },
    { label: "VELOCITY", value: velocity.toString(), color: "text-electric" },
    { label: "CREATED", value: createdDate },
  ];

  const periods = [
    { key: "day", label: "DAILY" },
    { key: "week", label: "WEEKLY" },
    { key: "month", label: "MONTHLY" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="text-bone/40 text-sm hover:text-electric transition-colors duration-500 mb-12 inline-block"
        style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
      >
        ← Back
      </Link>

      <ScrollReveal>
        <div className="double-bezel mb-8">
          <div className="double-bezel-inner p-8 md:p-10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                  {repo.full_name}
                </h1>
                <p className="text-bone/40 text-sm max-w-lg">{repo.description ?? "—"}</p>
              </div>
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="pill-button bg-electric text-midnight font-medium shrink-0 inline-flex items-center gap-2 group"
              >
                View on GitHub
                <span className="w-6 h-6 rounded-full bg-midnight/10 flex items-center justify-center text-[10px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-500">
                  ↗
                </span>
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-bone/30 text-[10px] tracking-[0.2em] mb-2 font-medium">
                    {stat.label}
                  </p>
                  <p className={`text-2xl md:text-3xl font-bold tabular-nums font-mono ${stat.color ?? ""}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <div className="flex gap-2 text-[10px] tracking-widest">
                <span className="text-bone/30 mr-2">PERIOD:</span>
                {periods.map((p) => (
                  <Link
                    key={p.key}
                    href={`/repo/${slug}?period=${p.key}`}
                    className={`px-3 py-1.5 rounded-full transition-all duration-500 ${
                      period === p.key
                        ? "bg-white/10 text-bone"
                        : "text-bone/40 hover:text-bone hover:bg-white/5"
                    }`}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-bone/30 text-[10px] tracking-[0.2em] mb-4 font-medium">
                STAR HISTORY
              </p>
              <div className="glass-panel rounded-2xl p-4">
                <StarChart data={repo.sparkline} />
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
