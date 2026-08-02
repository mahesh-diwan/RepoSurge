import { getStats } from "@/lib/db";
import AnimatedNumber from "./AnimatedNumber";

export default function StatsBar({ period = "week" }: { period?: string }) {
  const { totalRepos, totalStars, languages, totalGained } = getStats(period);

  return (
    <div className="grid grid-cols-[1fr_1fr] md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-3 mb-8 md:mb-10 px-4 md:px-6">
      <div className="col-span-2 md:col-span-1 relative overflow-hidden bg-surface border border-accent/20 rounded-2xl px-5 py-4 md:px-6 md:py-5">
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full -mr-8 -mt-8" />
        <p className="text-text-muted text-xs mb-2">Gained this {period}</p>
        <p className="font-mono text-2xl md:text-3xl tabular-nums text-accent font-bold">
          +<AnimatedNumber value={totalGained} />
        </p>
      </div>

      <div className="border border-border rounded-2xl px-4 py-3 md:px-5 md:py-4">
        <p className="text-text-muted text-xs mb-2">Repos</p>
        <p className="font-mono text-xl md:text-2xl tabular-nums text-text-body font-semibold">
          <AnimatedNumber value={totalRepos} />
        </p>
      </div>

      <div className="border border-border rounded-2xl px-4 py-3 md:px-5 md:py-4">
        <p className="text-text-muted text-xs mb-2">Stars</p>
        <p className="font-mono text-xl md:text-2xl tabular-nums text-text-body font-semibold">
          <AnimatedNumber value={totalStars} />
        </p>
      </div>

      <div className="hidden md:block border border-border rounded-2xl px-5 py-4">
        <p className="text-text-muted text-xs mb-2">Languages</p>
        <p className="font-mono text-2xl tabular-nums text-text-body font-semibold">
          <AnimatedNumber value={languages} />
        </p>
      </div>
    </div>
  );
}
