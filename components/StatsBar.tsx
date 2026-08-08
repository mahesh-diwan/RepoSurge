import AnimatedNumber from "./AnimatedNumber";

interface StatsBarProps {
  period?: string;
  stats?: {
    totalRepos: number;
    totalStars: number;
    languages: number;
    totalGained: number;
  };
}

export default function StatsBar({ period = "period", stats }: StatsBarProps) {
  if (!stats) return null;

  const { totalRepos, totalStars, totalGained } = stats;
  const avgStars = totalRepos > 0 ? Math.round(totalStars / totalRepos) : 0;

  return (
    <div className="card-shell animate-fade-up">
      <div className="card-core">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="section-label mb-1">Overview</p>
            <h2 className="text-lg md:text-xl font-semibold text-text-body tracking-tight">
              This {period}
            </h2>
          </div>
          <div className="text-right">
            <p className="data-mono text-2xl md:text-3xl font-bold text-accent tabular-nums leading-none">
              +<AnimatedNumber value={totalGained} />
            </p>
            <p className="text-text-dim text-[10px] font-mono mt-1 tracking-wider">STARS GAINED</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
          <div className="bg-surface/50 px-4 py-3 text-center transition-all duration-500 ease-out-expo hover:bg-surface">
            <p className="data-mono text-lg md:text-xl font-semibold text-text-body tabular-nums">
              <AnimatedNumber value={totalRepos} />
            </p>
            <p className="text-text-dim text-[10px] font-mono mt-0.5 tracking-wider">REPOS</p>
          </div>
          <div className="bg-surface/50 px-4 py-3 text-center transition-all duration-500 ease-out-expo hover:bg-surface">
            <p className="data-mono text-lg md:text-xl font-semibold text-text-body tabular-nums">
              <AnimatedNumber value={totalStars} />
            </p>
            <p className="text-text-dim text-[10px] font-mono mt-0.5 tracking-wider">TOTAL STARS</p>
          </div>
          <div className="bg-surface/50 px-4 py-3 text-center transition-all duration-500 ease-out-expo hover:bg-surface">
            <p className="data-mono text-lg md:text-xl font-semibold text-text-body tabular-nums">
              {avgStars >= 1000 ? `${(avgStars / 1000).toFixed(1)}K` : avgStars}
            </p>
            <p className="text-text-dim text-[10px] font-mono mt-0.5 tracking-wider">AVG/REPO</p>
          </div>
        </div>
      </div>
    </div>
  );
}
