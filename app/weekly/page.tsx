import { type Metadata } from "next";
import { getRepos, getStats } from "@/lib/db";
import StatsBar from "@/components/StatsBar";
import RepoList from "@/components/RepoList";

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
        <div className="py-24 text-center">
          <p className="text-text-muted text-sm">No data for the last 7 days</p>
          <p className="text-text-dim text-xs mt-1">Weekly data updates once per day. Check back soon.</p>
        </div>
      ) : (
        <RepoList repos={{ day, week, month }} defaultPeriod="week" />
      )}
    </main>
  );
}
