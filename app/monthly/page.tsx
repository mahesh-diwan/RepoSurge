import { type Metadata } from "next";
import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import RepoList from "@/components/RepoList";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "monthly - reposurge",
  description: "fastest-rising repos last 30 days",
};

export default function MonthlyPage() {
  const day = getRepos("day");
  const week = getRepos("week");
  const month = getRepos("month");

  const empty = month.length === 0;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-6">
        {empty ? (
          <div className="py-16 text-center">
            <p className="text-text-muted text-sm">no data for the last 30 days</p>
            <p className="text-text-muted/40 text-xs mt-1">Monthly data aggregates on a rolling 30-day window.</p>
          </div>
        ) : (
          <RepoList repos={{ day, week, month }} defaultPeriod="month" />
        )}
      </main>
    </>
  );
}
