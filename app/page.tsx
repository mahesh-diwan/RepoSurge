import { getRepos, getStats } from "@/lib/db";
import Header from "@/components/Header";
import RepoList from "@/components/RepoList";
import AnimatedNumber from "@/components/AnimatedNumber";

export const revalidate = 3600;

export default function Home() {
  const day = getRepos("day");
  const week = getRepos("week");
  const month = getRepos("month");
  const stats = getStats("week");
  const topRepo = week[0];

  const empty = day.length === 0 && week.length === 0 && month.length === 0;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto">
        {/* Hero + Stats combined card */}
        <div className="px-4 md:px-6 mb-8">
          <div className="card-shell animate-fade-up">
            <div className="card-core">
              {/* Hero metric */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="min-w-0">
                  <p className="section-label mb-2">Top gainer this week</p>
                  <h2 className="text-xl md:text-2xl font-bold text-text-body tracking-tight truncate">
                    {topRepo?.full_name ?? "—"}
                  </h2>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <p className="data-mono text-4xl md:text-5xl font-black text-accent tabular-nums leading-none tracking-tight">
                    +<AnimatedNumber value={topRepo?.stars_gained ?? 0} />
                  </p>
                  <p className="text-text-dim text-[10px] font-mono mt-1.5 tracking-wider">STARS THIS WEEK</p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border mb-5" />

              {/* KPI tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden">
                <div className="bg-surface/50 px-4 py-4 text-center transition-all duration-500 ease-out-expo hover:bg-surface">
                  <p className="data-mono text-lg md:text-xl font-bold text-text-body tabular-nums">
                    <AnimatedNumber value={stats.totalRepos} />
                  </p>
                  <p className="text-text-dim text-[10px] font-mono mt-1 tracking-wider">REPOS</p>
                </div>
                <div className="bg-surface/50 px-4 py-4 text-center transition-all duration-500 ease-out-expo hover:bg-surface">
                  <p className="data-mono text-lg md:text-xl font-bold text-text-body tabular-nums">
                    <AnimatedNumber value={stats.totalStars} />
                  </p>
                  <p className="text-text-dim text-[10px] font-mono mt-1 tracking-wider">TOTAL STARS</p>
                </div>
                <div className="bg-surface/50 px-4 py-4 text-center transition-all duration-500 ease-out-expo hover:bg-surface">
                  <p className="data-mono text-lg md:text-xl font-bold text-text-body tabular-nums">
                    {stats.totalRepos > 0 ? `${Math.round(stats.totalStars / stats.totalRepos / 1000).toFixed(1)}K` : "—"}
                  </p>
                  <p className="text-text-dim text-[10px] font-mono mt-1 tracking-wider">AVG/REPO</p>
                </div>
                <div className="bg-surface/50 px-4 py-4 text-center transition-all duration-500 ease-out-expo hover:bg-surface">
                  <p className="data-mono text-lg md:text-xl font-bold text-text-body tabular-nums">
                    {stats.languages}
                  </p>
                  <p className="text-text-dim text-[10px] font-mono mt-1 tracking-wider">LANGUAGES</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {empty ? (
          <div className="px-4 md:px-6">
            <div className="card-shell">
              <div className="card-core py-16 text-center">
                <div className="inline-flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center animate-float">
                    <span className="text-text-dim text-lg">◐</span>
                  </div>
                  <p className="text-text-body text-sm font-medium">No repository data available</p>
                  <p className="text-text-dim text-xs">Data is refreshed daily. Check back soon.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <RepoList repos={{ day, week, month }} />
        )}
      </main>
    </>
  );
}
