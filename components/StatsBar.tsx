import { getStats } from "@/lib/db";
import AnimatedNumber from "./AnimatedNumber";

export default function StatsBar({ period = "week" }: { period?: string }) {
  const { totalRepos, totalStars, languages, totalGained } = getStats(period);

  const cards = [
    { label: "Repos", value: totalRepos },
    { label: "Stars", value: totalStars },
    { label: "Languages", value: languages },
    { label: `Gained / ${period}`, value: totalGained, highlight: true },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8 px-4 md:px-6">
      {cards.map((c) => (
        <div key={c.label} className={`relative overflow-hidden bg-surface border rounded-2xl px-4 py-3 md:px-5 md:py-4 ${c.highlight ? "border-accent/20" : "border-border"}`}>
          {c.highlight && <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-bl-full -mr-6 -mt-6" />}
          <p className="text-text-muted text-xs mb-2">{c.label}</p>
          <p className={`font-mono text-xl md:text-2xl tabular-nums ${c.highlight ? "text-accent font-bold" : "text-text-body font-semibold"}`}>
            {c.highlight && c.value > 0 ? "+" : ""}
            <AnimatedNumber value={c.value} />
          </p>
        </div>
      ))}
    </div>
  );
}
