import { type Metadata } from "next";
import { getRepos, getStats } from "@/lib/db";
import StatsBar from "@/components/StatsBar";
import RepoList from "@/components/RepoList";
import EmptyState from "@/components/EmptyState";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Daily - RepoSurge",
  description: "Fastest-rising GitHub repos in the last 24 hours",
};

export default function DailyPage() {
  const day = getRepos("day");
  const week = getRepos("week");
  const month = getRepos("month");
  const stats = getStats("day");

  const empty = day.length === 0;

  return (
    <main className="max-w-7xl mx-auto">
      <div className="px-4 md:px-6 mb-8">
        <StatsBar period="day" stats={stats} />
      </div>

      {empty ? (
        <EmptyState
          icon="◐"
          title="No data for the last 24 hours"
          description="Daily data is updated once per day. Check back tomorrow or view a different period."
          action={{ label: "View weekly", href: "/weekly" }}
        />
      ) : (
        <RepoList repos={{ day, week, month }} defaultPeriod="day" />
      )}
    </main>
  );
}
