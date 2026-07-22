import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import TrustLogos from "@/components/TrustLogos";
import RepoCard from "@/components/RepoCard";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  const repos = getRepos("week");
  const trending = [...repos]
    .sort((a, b) => b.stars_gained - a.stars_gained)
    .slice(0, 3);

  return (
    <>
      <Header />
      <TrustLogos />

      <main className="max-w-7xl mx-auto px-6">
        {trending.length > 0 && (
          <ScrollReveal>
            <section className="mb-20">
                      <div className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-white/5" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trending.map((repo, i) => (
                  <ScrollReveal key={repo.full_name} delay={i * 0.1} className={i === 0 ? "md:col-span-2" : ""}>
                    <a
                      href={`/repo/${repo.slug}`}
                      className="glass-card block p-6 group"
                    >
                      <p className="font-bold text-sm truncate group-hover:text-electric transition-colors duration-500">
                        {repo.full_name}
                      </p>
                      <p className="text-electric text-2xl font-bold tabular-nums mt-4 font-mono">
                        +{repo.stars_gained.toLocaleString()}
                      </p>
                      <p className="text-bone/30 text-xs mt-2 font-mono">
                        {repo.velocity} velocity
                      </p>
                    </a>
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="pill-badge glass-panel text-bone/60">
                WEEKLY RANKINGS
              </div>
              <div className="h-px flex-1 bg-white/5" />
              <div className="flex gap-2 text-[10px] tracking-widest">
                <a
                  href="/daily"
                  className="px-3 py-1.5 rounded-full text-bone/40 hover:text-bone hover:bg-white/5 transition-all duration-500"
                >
                  DAILY
                </a>
                <span className="px-3 py-1.5 rounded-full bg-white/10 text-bone">
                  WEEKLY
                </span>
                <a
                  href="/monthly"
                  className="px-3 py-1.5 rounded-full text-bone/40 hover:text-bone hover:bg-white/5 transition-all duration-500"
                >
                  MONTHLY
                </a>
              </div>
            </div>

            {repos.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-bone/30 text-sm">
                  no repos data yet. run npm run fetch first.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {repos.map((repo, i) => (
                  <ScrollReveal key={repo.full_name} delay={Math.min(i * 0.05, 0.5)}>
                    <RepoCard
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
                  </ScrollReveal>
                ))}
              </div>
            )}
          </section>
        </ScrollReveal>
      </main>
    </>
  );
}
