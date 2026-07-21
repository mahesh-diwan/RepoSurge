import Link from "next/link";
import { getRepos, getRepoBySlug } from "@/lib/db";
import StarChart from "@/components/StarChart";

export function generateStaticParams() {
  return getRepos("year").map((repo) => ({
    slug: repo.slug,
  }));
}

export default function RepoDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const repo = getRepoBySlug(slug);

  if (!repo) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-16">
        <Link href="/" className="text-bone/50 text-sm hover:text-electric transition-colors mb-8 inline-block">
          ← Back to Rankings
        </Link>
        <p className="text-bone/40">Repo not found.</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <Link href="/" className="text-bone/50 text-sm hover:text-electric transition-colors mb-8 inline-block">
        ← Back to Rankings
      </Link>

      <div className="border border-bone/20 p-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {repo.full_name}
            </h1>
            <p className="text-bone/50 text-sm">
              {repo.description ?? "-"}
            </p>
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
            <p className="text-bone/40 text-xs tracking-widest mb-1">TOTAL STARS</p>
            <p className="text-2xl font-bold tabular-nums">{repo.stars.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-bone/40 text-xs tracking-widest mb-1">STARS GAINED</p>
            <p className={`text-2xl font-bold tabular-nums ${repo.stars_gained > 0 ? "text-electric" : repo.stars_gained < 0 ? "text-red-500" : "text-bone/40"}`}>
              {repo.stars_gained > 0 ? "+" : ""}{repo.stars_gained.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-bone/40 text-xs tracking-widest mb-1">VELOCITY</p>
            <p className="text-2xl font-bold tabular-nums text-electric">{repo.velocity} v</p>
          </div>
          <div>
            <p className="text-bone/40 text-xs tracking-widest mb-1">LANGUAGE</p>
            <p className="text-2xl font-bold">{repo.language ?? "-"}</p>
          </div>
        </div>

        <div>
          <p className="text-bone/40 text-xs tracking-widest mb-3">STAR HISTORY (7 DAYS)</p>
          <StarChart data={repo.sparkline} />
        </div>
      </div>
    </main>
  );
}
