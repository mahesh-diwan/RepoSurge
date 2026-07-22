import { getRepos } from "@/lib/db";
import RepoList from "@/components/RepoList";
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

      <RepoList repos={repos} />
    </main>
  );
}
