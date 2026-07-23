import { type Metadata } from "next";
import { getRepos } from "@/lib/db";
import RepoList from "@/components/RepoList";
import ScrollReveal from "@/components/ScrollReveal";
import PeriodNav from "@/components/PeriodNav";

export const metadata: Metadata = {
  title: "weekly - reposurge",
  description: "fastest-rising repos last 7 days",
};

export default function WeeklyPage() {
  const repos = getRepos("week");

  return (
    <main className="max-w-7xl mx-auto px-6 pt-8">
      <ScrollReveal>
        <p className="text-dim text-xs mb-2">last 7 days</p>
        <PeriodNav current="week" />
      </ScrollReveal>

      <RepoList repos={repos} />
    </main>
  );
}
