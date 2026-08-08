import { type Metadata } from "next";
import { getRepos, getStats } from "@/lib/db";
import StatsBar from "@/components/StatsBar";
import RepoList from "@/components/RepoList";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Monthly - RepoSurge",
  description: "Fastest-rising GitHub repos in the last 30 days",
};

export default function MonthlyPage() {
  const day = getRepos("day");
  const week = getRepos("week");
  const month = getRepos("month");
  const stats = getStats("month");

  const empty = month.length === 0;

  return (
    <main className="max-w-7xl mx-auto">
      <div className="px-4 md:px-6 mb-8">
        <StatsBar period="month" stats={stats} />
      </div>

      {empty ? (
        <div className="py-24 text-center">
          <p className="text-text-muted text-sm">No data for the last 30 days</p>
          <p className="text-text-dim text-xs mt-1">Monthly data aggregates on a rolling 30-day window.</p>
        </div>
      ) : (
        <RepoList repos={{ day, week, month }} defaultPeriod="month" />
      )}
    </main>
  );
}
