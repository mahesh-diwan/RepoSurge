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

export default function StatsBar({ period = "week", stats }: StatsBarProps) {
  if (!stats) return null;

  const { totalRepos, totalStars, totalGained } = stats;

  return (
    <div className="card p-5 md:p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="section-label mb-1.5">Overview</p>
          <h2 className="text-lg md:text-xl font-semibold text-text-body tracking-tight">
            This {period}
          </h2>
        </div>
        <div className="text-right">
          <p className="data-mono text-2xl md:text-3xl font-bold text-accent tabular-nums">
            +<AnimatedNumber value={totalGained} />
          </p>
          <p className="text-text-dim text-[10px] font-mono mt-0.5">STARS GAINED</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px bg-border-subtle rounded-xl overflow-hidden">
        <div className="bg-surface px-4 py-3 text-center">
          <p className="data-mono text-lg md:text-xl font-semibold text-text-body tabular-nums">
            <AnimatedNumber value={totalRepos} />
          </p>
          <p className="text-text-dim text-[10px] font-mono mt-0.5">REPOS</p>
        </div>
        <div className="bg-surface px-4 py-3 text-center">
          <p className="data-mono text-lg md:text-xl font-semibold text-text-body tabular-nums">
            <AnimatedNumber value={totalStars} />
          </p>
          <p className="text-text-dim text-[10px] font-mono mt-0.5">TOTAL STARS</p>
        </div>
        <div className="bg-surface px-4 py-3 text-center">
          <p className="data-mono text-lg md:text-xl font-semibold text-text-body tabular-nums">
            {(totalStars / 1000000).toFixed(1)}M
          </p>
          <p className="text-text-dim text-[10px] font-mono mt-0.5">COMBINED</p>
        </div>
      </div>
    </div>
  );
}
