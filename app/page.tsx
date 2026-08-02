import { getRepos } from "@/lib/db";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import RepoList from "@/components/RepoList";

export const revalidate = 3600;

export default function Home() {
  const day = getRepos("day");
  const week = getRepos("week");
  const month = getRepos("month");

  const empty = day.length === 0 && week.length === 0 && month.length === 0;

  return (
    <>
      <Header />
      <StatsBar period="week" />
      <main className="max-w-7xl mx-auto">
        {empty ? (
          <div className="py-16 text-center">
            <p className="text-text-muted text-sm">no repository data available</p>
            <p className="text-text-muted/40 text-xs mt-1">Data is refreshed daily. Check back soon.</p>
          </div>
        ) : (
          <RepoList repos={{ day, week, month }} />
        )}
      </main>
    </>
  );
}
