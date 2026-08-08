import { getRepos, getStats } from "@/lib/db";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import RepoList from "@/components/RepoList";
import EmptyState from "@/components/EmptyState";

export const revalidate = 3600;

export default function Home() {
  const day = getRepos("day");
  const week = getRepos("week");
  const month = getRepos("month");
  const stats = getStats("week");

  const empty = day.length === 0 && week.length === 0 && month.length === 0;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto">
        {/* Hero stats */}
        <div className="px-4 md:px-6 mb-8">
          <StatsBar period="week" stats={stats} />
        </div>

        {empty ? (
          <EmptyState
            icon="◐"
            title="No repository data available"
            description="Data is refreshed daily. Check back soon."
          />
        ) : (
          <RepoList repos={{ day, week, month }} />
        )}
      </main>
    </>
  );
}
