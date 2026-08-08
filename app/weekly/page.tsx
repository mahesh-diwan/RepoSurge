import { type Metadata } from "next";
import { getRepos, getStats } from "@/lib/db";
import StatsBar from "@/components/StatsBar";
import RepoList from "@/components/RepoList";
import EmptyState from "@/components/EmptyState";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Weekly - RepoSurge",
  description: "Fastest-rising GitHub repos in the last 7 days",
};

export default function WeeklyPage() {
  const day = getRepos("day");
  const week = getRepos("week");
  const month = getRepos("month");
  const stats = getStats("week");

  const empty = week.length === 0;

  return (
    <main className="max-w-7xl mx-auto">
      <div className="px-4 md:px-6 mb-8">
        <StatsBar period="week" stats={stats} />
      </div>

      {empty ? (
        <EmptyState
          icon="◐"
          title="No data for the last 7 days"
          description="Weekly data updates once per day. Check back soon or view a different period."
          action={{ label: "View monthly", href: "/monthly" }}
        />
      ) : (
        <RepoList repos={{ day, week, month }} defaultPeriod="week" />
      )}
    </main>
  );
}
