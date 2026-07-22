import { getRepos } from "@/lib/db";
import RepoList from "@/components/RepoList";
import ScrollReveal from "@/components/ScrollReveal";

export default function DailyPage() {
  const repos = getRepos("day");

  return (
    <main className="max-w-7xl mx-auto px-6 pt-8">
      <ScrollReveal>
        <p className="text-dim text-xs mb-2">last 24 hours</p>
        <div className="flex items-center gap-4 mb-8 text-xs">
          <span className="text-terminal font-bold">daily</span>
          <a href="/weekly" className="text-dim hover:text-terminal transition-colors">weekly</a>
          <a href="/monthly" className="text-dim hover:text-terminal transition-colors">monthly</a>
        </div>
      </ScrollReveal>

      <RepoList repos={repos} />
    </main>
  );
}
