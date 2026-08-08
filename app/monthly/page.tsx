import { type Metadata } from "next";
import { getRepos, getStats } from "@/lib/db";
import StatsBar from "@/components/StatsBar";
import RepoList from "@/components/RepoList";
import EmptyState from "@/components/EmptyState";

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
        <EmptyState
          icon="◐"
          title="No data for the last 30 days"
          description="Monthly data aggregates on a rolling 30-day window. Check back soon."
          action={{ label: "View weekly", href: "/weekly" }}
        />
      ) : (
        <RepoList repos={{ day, week, month }} defaultPeriod="month" />
      )}
    </main>
  );
}
