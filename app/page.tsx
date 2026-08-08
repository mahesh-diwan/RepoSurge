import { getRepos, getStats } from "@/lib/db";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import RepoList from "@/components/RepoList";

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
          <div className="py-24 text-center">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center">
                <span className="text-text-dim text-lg">◐</span>
              </div>
              <p className="text-text-muted text-sm">No repository data available</p>
              <p className="text-text-dim text-xs">Data is refreshed daily. Check back soon.</p>
            </div>
          </div>
        ) : (
          <RepoList repos={{ day, week, month }} />
        )}
      </main>
    </>
  );
}
