import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import RepoList from "@/components/RepoList";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  const repos = getRepos("week");

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-6 text-xs">
            <span className="text-dim">period:</span>
            <a href="/daily" className="text-dim hover:text-terminal transition-colors">daily</a>
            <span className="text-terminal font-bold">weekly</span>
            <a href="/monthly" className="text-dim hover:text-terminal transition-colors">monthly</a>
          </div>
        </ScrollReveal>

        <RepoList repos={repos} />
      </main>
    </>
  );
}
