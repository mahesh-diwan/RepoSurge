import { getRepos } from "@/lib/db";
import RepoCard from "@/components/RepoCard";
import ScrollReveal from "@/components/ScrollReveal";

export default function MonthlyPage() {
  const repos = getRepos("month");

  return (
    <main className="max-w-7xl mx-auto px-6">
      <ScrollReveal>
        <section className="mb-16">
          <div className="pill-badge glass-panel inline-block mb-6 text-electric">
            MONTHLY
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Monthly Rankings
          </h1>
          <p className="text-bone/40 text-sm mt-3 max-w-md">
            top repos by stars gained this month
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <div className="flex items-center gap-4 mb-8">
          <div className="flex gap-2 text-[10px] tracking-widest">
            <a
              href="/daily"
              className="px-3 py-1.5 rounded-full text-bone/40 hover:text-bone hover:bg-white/5 transition-all duration-500"
            >
              DAILY
            </a>
            <a
              href="/weekly"
              className="px-3 py-1.5 rounded-full text-bone/40 hover:text-bone hover:bg-white/5 transition-all duration-500"
            >
              WEEKLY
            </a>
            <span className="px-3 py-1.5 rounded-full bg-white/10 text-bone">
              MONTHLY
            </span>
          </div>
          <div className="h-px flex-1 bg-white/5" />
        </div>
      </ScrollReveal>

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
    </main>
  );
}
