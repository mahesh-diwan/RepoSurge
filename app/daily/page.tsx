import { type Metadata } from "next";
import { getRepos } from "@/lib/db";
import RepoList from "@/components/RepoList";
import ScrollReveal from "@/components/ScrollReveal";
import PeriodNav from "@/components/PeriodNav";

export const metadata: Metadata = {
  title: "daily - reposurge",
  description: "fastest-rising repos last 24 hours",
};

export default function DailyPage() {
  const repos = getRepos("day");

  return (
    <main className="max-w-7xl mx-auto px-6 pt-8">
      <ScrollReveal>
        <p className="text-dim text-xs mb-2">last 24 hours</p>
        <PeriodNav current="day" />
      </ScrollReveal>

      <RepoList repos={repos} />
    </main>
  );
}
