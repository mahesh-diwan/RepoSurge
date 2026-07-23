import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import RepoList from "@/components/RepoList";
import ScrollReveal from "@/components/ScrollReveal";
import PeriodNav from "@/components/PeriodNav";

export default function Home() {
  const repos = getRepos("week");

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <PeriodNav current="week" showLabel />
        </ScrollReveal>

        <RepoList repos={repos} />
      </main>
    </>
  );
}
