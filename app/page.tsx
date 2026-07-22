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
            <section className="mb-12">
              <p className="text-terminal text-xs tracking-wider mb-4">
                <span className="text-terminal">$</span> trending --top 3
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {trending.map((repo, i) => (
                  <ScrollReveal key={repo.full_name} delay={i * 0.1}>
                    <a
                      href={`/repo/${repo.slug}`}
                      className="block border border-[#1a1a1a] p-4 hover:border-terminal/30 transition-colors group"
                    >
                      <p className="text-dim text-[10px] tracking-wider mb-2">
                        #{i + 1} <span className="text-terminal">trending</span>
                      </p>
                      <p className="text-sm truncate group-hover:text-terminal transition-colors">
                        {repo.full_name}
                      </p>
                      <p className="text-terminal text-lg tabular-nums mt-3">
                        +{repo.stars_gained.toLocaleString()} ★
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
            <div className="flex items-center justify-between mb-4">
              <p className="text-terminal text-xs tracking-wider">
                <span className="text-terminal">$</span> ls ./rankings/weekly
              </p>
              <div className="flex gap-2 text-[10px] tracking-wider">
                <a
                  href="/daily"
                  className="text-dim hover:text-terminal transition-colors"
                >
                  DAILY
                </a>
                <span className="text-terminal">/</span>
                <span className="text-bone">WEEKLY</span>
                <span className="text-terminal">/</span>
                <a
                  href="/monthly"
                  className="text-dim hover:text-terminal transition-colors"
                >
                  MONTHLY
                </a>
              </div>
            </div>

            {repos.length === 0 ? (
              <p className="text-dim text-xs mt-8">
                <span className="text-terminal">$</span> no data. run: npm run fetch
              </p>
            ) : (
              <div>
                {repos.map((repo, i) => (
                  <ScrollReveal key={repo.full_name} delay={Math.min(i * 0.03, 0.5)}>
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
