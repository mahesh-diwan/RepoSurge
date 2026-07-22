import { getRepos } from "@/lib/db";
import TrustLogos from "@/components/TrustLogos";
import RepoCard from "@/components/RepoCard";

export default function MonthlyPage() {
  const repos = getRepos("month");

  return (
    <>
      <section className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight">Monthly</h1>
          <p className="text-bone/50 text-sm mt-2">
            top repos by stars gained in the last 30 days
          </p>
        </div>
      </section>

      <TrustLogos />

      <main className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 mb-6 border-b border-bone/20 pb-3">
          <h2 className="text-xs tracking-widest text-bone/40">RANKINGS</h2>
          <div className="flex gap-4 text-xs tracking-widest">
            <a
              href="/daily"
              className="text-bone/50 hover:text-electric transition-colors"
            >
              DAILY
            </a>
            <a
              href="/weekly"
              className="text-bone/50 hover:text-electric transition-colors"
            >
              WEEKLY
            </a>
            <span className="text-electric">MONTHLY</span>
          </div>
        </div>

        {repos.length === 0 ? (
          <p className="py-12 text-center text-bone/40 text-sm">
            no repos data yet. run npm run fetch first.
          </p>
        ) : (
          repos.map((repo) => (
            <RepoCard
              key={repo.full_name}
              rank={repo.rank}
              full_name={repo.full_name}
              description={repo.description}
              language={repo.language}
              url={repo.url}
              stars={repo.stars}
              stars_gained={repo.stars_gained}
              velocity={repo.velocity}
              sparkline={repo.sparkline}
              slug={repo.slug}
            />
          ))
        )}
      </main>
    </>
  );
}
