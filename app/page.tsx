import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import RepoList from "@/components/RepoList";
import ScrollReveal from "@/components/ScrollReveal";
import PeriodNav from "@/components/PeriodNav";
import LeaderboardInfo from "@/components/LeaderboardInfo";

export default function Home() {
  const repos = getRepos("week");

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6">
        <ScrollReveal>
          <PeriodNav current="week" showLabel />
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <LeaderboardInfo />
        </ScrollReveal>

        <RepoList repos={repos} />
      </main>
    </>
  );
}
