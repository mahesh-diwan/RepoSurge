import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import TrustLogos from "@/components/TrustLogos";
import RepoCard from "@/components/RepoCard";

export default function Home() {
  const repos = getRepos("week");
  const trending = [...repos]
    .sort((a, b) => b.stars_gained - a.stars_gained)
    .slice(0, 3);

  return (
    <>
      <Header />
      <TrustLogos />

      <main className="max-w-7xl mx-auto px-4">
        {trending.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs tracking-widest text-bone/40 mb-4">
              TRENDING THIS WEEK
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trending.map((repo) => (
                <a
                  key={repo.full_name}
                  href={`/repo/${repo.slug}`}
                  className="border border-bone/20 p-4 hover:border-electric/30 transition-colors"
                >
                  <p className="font-bold text-sm truncate">{repo.full_name}</p>
                  <p className="text-electric text-lg font-bold tabular-nums mt-2">
                    +{repo.stars_gained.toLocaleString()} ★
                  </p>
                  <p className="text-bone/40 text-xs mt-1">
                    {repo.velocity} velocity
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-6 mb-6 border-b border-bone/20 pb-3">
            <h2 className="text-xs tracking-widest text-bone/40">RANKINGS</h2>
            <div className="flex gap-4 text-xs tracking-widest">
              <a
                href="/daily"
                className="text-bone/50 hover:text-electric transition-colors"
              >
                DAILY
              </a>
              <span className="text-electric">WEEKLY</span>
              <a
                href="/monthly"
                className="text-bone/50 hover:text-electric transition-colors"
              >
                MONTHLY
              </a>
            </div>
          </div>

          {repos.length === 0 ? (
            <p className="py-12 text-center text-bone/40 text-sm">
              no repos data yet. run npm run fetch first.
            </p>
          ) : (
            repos.map((repo, i) => (
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
                style={{ "--stagger": i } as React.CSSProperties}
              />
            ))
          )}
        </section>
      </main>
    </>
  );
}
