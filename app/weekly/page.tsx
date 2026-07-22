import { getRepos } from "@/lib/db";
import RepoCard from "@/components/RepoCard";
import ScrollReveal from "@/components/ScrollReveal";

export default function WeeklyPage() {
  const repos = getRepos("week");

  return (
    <main className="max-w-7xl mx-auto px-6">
      <ScrollReveal>
        <section className="mb-8 pt-8">
          <p className="text-terminal text-xs tracking-wider mb-4">
            <span className="text-terminal">$</span> ls ./rankings/weekly
          </p>
          <p className="text-dim text-xs">
            top repos by stars gained this week
          </p>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <div className="flex items-center gap-2 text-[10px] tracking-wider mb-6 border-b border-[#1a1a1a] pb-3">
          <a href="/daily" className="text-dim hover:text-terminal transition-colors">DAILY</a>
          <span className="text-terminal">|</span>
          <span className="text-bone">WEEKLY</span>
          <span className="text-terminal">|</span>
          <a href="/monthly" className="text-dim hover:text-terminal transition-colors">MONTHLY</a>
        </div>
      </ScrollReveal>

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
    </main>
  );
}
