import { type Metadata } from "next";
import { getRepos } from "@/lib/db";
import RepoList from "@/components/RepoList";
import ScrollReveal from "@/components/ScrollReveal";
import PeriodNav from "@/components/PeriodNav";

export const metadata: Metadata = {
  title: "monthly - reposurge",
  description: "fastest-rising repos last 30 days",
};

export default function MonthlyPage() {
  const repos = getRepos("month");

  return (
    <main className="max-w-7xl mx-auto px-6 pt-8">
      <ScrollReveal>
        <p className="text-dim text-xs mb-2">last 30 days</p>
        <PeriodNav current="month" />
      </ScrollReveal>

      <RepoList repos={repos} />
    </main>
  );
}
