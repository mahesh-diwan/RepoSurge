import { getRepos } from "@/lib/db";
import RepoList from "@/components/RepoList";
import ScrollReveal from "@/components/ScrollReveal";

export default function WeeklyPage() {
  const repos = getRepos("week");

  return (
    <main className="max-w-7xl mx-auto px-6 pt-8">
      <ScrollReveal>
        <p className="text-dim text-xs mb-2">last 7 days</p>
        <div className="flex items-center gap-4 mb-8 text-xs">
          <a href="/daily" className="text-dim hover:text-terminal transition-colors">daily</a>
          <span className="text-terminal font-bold">weekly</span>
          <a href="/monthly" className="text-dim hover:text-terminal transition-colors">monthly</a>
        </div>
      </ScrollReveal>

      <RepoList repos={repos} />
    </main>
  );
}
