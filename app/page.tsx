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
  const topRepo = week[0];

  const empty = day.length === 0 && week.length === 0 && month.length === 0;

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto">
        {/* Hero: live proof, not promise */}
        {topRepo && (
          <div className="px-4 md:px-6 mb-8">
            <div className="card-shell animate-fade-up">
              <div className="card-core">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="min-w-0">
                    <p className="section-label mb-2">This week's top gainer</p>
                    <h2 className="text-xl md:text-2xl font-bold text-text-body tracking-tight truncate">
                      {topRepo.full_name}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="data-mono text-accent font-semibold text-lg">
                        +{topRepo.stars_gained?.toLocaleString()} ★
                      </span>
                      {topRepo.rankChange != null && topRepo.rankChange > 0 && (
                        <span className="text-positive data-mono text-xs">
                          ▲ {topRepo.rankChange} ranks
                        </span>
                      )}
                      {topRepo.velocity != null && (
                        <span className="text-text-dim data-mono text-xs">
                          {topRepo.velocity}/day
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="data-mono text-3xl md:text-4xl font-bold text-text-body tabular-nums leading-none">
                      #{topRepo.rank}
                    </p>
                    <p className="text-text-dim text-[10px] font-mono mt-1 tracking-wider">WORLDWIDE</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats overview */}
        <div className="px-4 md:px-6 mb-8">
          <StatsBar period="week" stats={stats} />
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
