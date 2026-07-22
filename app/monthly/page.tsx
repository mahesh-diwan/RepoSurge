import { getRepos } from "@/lib/db";
import RepoCard from "@/components/RepoCard";
import ScrollReveal from "@/components/ScrollReveal";

export default function MonthlyPage() {
  const repos = getRepos("month");

  return (
    <main className="max-w-7xl mx-auto px-6 pt-8">
      <ScrollReveal>
        <p className="text-dim text-xs mb-2">last 30 days</p>
        <div className="flex items-center gap-4 mb-8 text-xs">
          <a href="/daily" className="text-dim hover:text-terminal transition-colors">daily</a>
          <a href="/weekly" className="text-dim hover:text-terminal transition-colors">weekly</a>
          <span className="text-terminal font-bold">monthly</span>
        </div>
      </ScrollReveal>

      {repos.length === 0 ? (
        <p className="text-dim text-xs mt-8">no data. run: npm run fetch</p>
      ) : (
        <div>
          {repos.map((repo, i) => (
            <ScrollReveal key={repo.full_name} delay={Math.min(i * 0.02, 0.3)}>
              <RepoCard
                rank={repo.rank}
                full_name={repo.full_name}
                stars_gained={repo.stars_gained}
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
