import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import TrustLogos from "@/components/TrustLogos";
import RepoCard from "@/components/RepoCard";
import GossipFeed from "@/components/GossipFeed";
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          <div className="lg:col-span-3">
            <ScrollReveal>
              <section>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-terminal text-xs tracking-wider">
                    <span className="text-terminal">$</span> ls ./rankings/weekly
                  </p>
                  <div className="flex gap-2 text-[10px] tracking-wider">
                    <a href="/daily" className="text-dim hover:text-terminal transition-colors">
                      DAILY
                    </a>
                    <span className="text-terminal">/</span>
                    <span className="text-bone">WEEKLY</span>
                    <span className="text-terminal">/</span>
                    <a href="/monthly" className="text-dim hover:text-terminal transition-colors">
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
                      <ScrollReveal key={repo.full_name} delay={Math.min(i * 0.02, 0.3)}>
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
          </div>

          <div className="lg:col-span-1">
            <ScrollReveal delay={0.1}>
              <section className="border border-[#1a1a1a] p-4 lg:sticky lg:top-24">
                <p className="text-terminal text-[10px] tracking-wider mb-3">
                  <span className="text-terminal">$</span> tail -f ./gossip
                  <span className="ml-1.5 inline-block px-1 py-0.5 border border-terminal/50 text-[8px] tracking-widest text-terminal">
                    LIVE
                  </span>
                </p>
                <GossipFeed />
              </section>
            </ScrollReveal>
          </div>
        </div>
      </main>
    </>
  );
}
