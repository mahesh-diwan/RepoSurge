import { getStats } from "@/lib/db";

export default function Header() {
  const stats = getStats();

  return (
    <section className="pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          REP<span className="text-electric">Ø</span>SURGE
        </h1>
        <p className="text-bone/50 text-sm mt-3">repos rising. fast.</p>

        <div className="flex gap-12 mt-10 text-sm">
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {stats.totalRepos.toLocaleString()}
            </p>
            <p className="text-bone/40 text-xs tracking-widest mt-1">
              REPOS TRACKED
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {stats.totalStars.toLocaleString()}
            </p>
            <p className="text-bone/40 text-xs tracking-widest mt-1">
              STARS MONITORED
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">{stats.languages}</p>
            <p className="text-bone/40 text-xs tracking-widest mt-1">
              LANGUAGES
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
