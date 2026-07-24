import { type Metadata } from "next";
import Link from "next/link";
import { getRepoDetails } from "@/lib/db";
import StarChart from "@/components/StarChart";
import ScrollReveal from "@/components/ScrollReveal";
import { gainedColor } from "@/lib/gained-color";

const periods = ["day", "week", "month"];
const periodLabels: Record<string, string> = { day: "daily", week: "weekly", month: "monthly" };

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const repo = getRepoDetails(slug);

  if (!repo) {
    return { title: "repo not found - reposurge" };
  }

  return {
    title: `${repo.full_name} - reposurge`,
    description:
      repo.description ?? `${repo.full_name} star velocity on reposurge`,
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
  const period = periods.includes(searchParams.period ?? "") ? searchParams.period! : "week";
  const repo = getRepoDetails(slug, period);

  if (!repo) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16">
        <Link href="/" className="text-amber-muted text-xs hover:text-amber-primary transition-colors mb-8 inline-block">
          &larr; back
        </Link>
        <p className="text-amber-muted text-xs mt-8">repo not found</p>
      </main>
    );
  }

  const createdDate = new Date(repo.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="text-amber-muted text-xs hover:text-amber-primary transition-colors mb-8 inline-block"
      >
        &larr; back
      </Link>

      <ScrollReveal>
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-balance">{repo.full_name}</h1>
          <p className="text-amber-muted text-sm mb-6">{repo.description ?? "-"}</p>

          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-xs text-amber-primary border border-amber-primary/50 px-3 py-1.5 hover:bg-amber-primary/10 hover:shadow-[0_0_8px_#FFB000/30] transition-all mb-10"
          >
            view on github
          </a>

          <div className="flex gap-8 mb-8">
            <div>
              <p className="text-amber-muted text-[10px] sm:text-xs mb-1">stars</p>
              <p className="text-lg font-bold tabular-nums text-amber-primary amber-glow">{repo.stars.toLocaleString("en-US")}</p>
            </div>
            <div>
              <p className="text-amber-muted text-[10px] sm:text-xs mb-1">gained</p>
              <p className={`text-lg font-bold tabular-nums amber-glow ${gainedColor(repo.stars_gained)}`}>
                {repo.stars_gained > 0 ? "+" : ""}
                {repo.stars_gained.toLocaleString("en-US")}
              </p>
            </div>
            <div>
              <p className="text-amber-muted text-[10px] sm:text-xs mb-1">velocity</p>
              <p className={`text-lg font-bold tabular-nums amber-glow ${gainedColor(repo.stars_gained)}`}>{repo.velocity}</p>
            </div>
            <div>
              <p className="text-amber-muted text-[10px] sm:text-xs mb-1">7d gain</p>
              <p className="text-lg font-bold tabular-nums amber-glow text-amber-primary">{repo.gained7d > 0 ? "+" : ""}{repo.gained7d.toLocaleString("en-US")}</p>
            </div>
            <div>
              <p className="text-amber-muted text-[10px] sm:text-xs mb-1">created</p>
              <p className="text-lg font-bold tabular-nums">{createdDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6 text-xs">
            <span className="text-amber-muted">period:</span>
            {periods.map((p) =>
              period === p ? (
                <span key={p} className="text-amber-primary font-bold">{periodLabels[p]}</span>
              ) : (
                <Link key={p} href={`/repo/${slug}?period=${p}`} className="text-amber-muted hover:text-amber-primary transition-colors">
                  {periodLabels[p]}
                </Link>
              )
            )}
          </div>

          <div>
            <p className="text-amber-muted text-[10px] sm:text-xs mb-3">star history</p>
            <div className="h-32 w-full">
              <StarChart data={repo.sparkline} />
            </div>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
