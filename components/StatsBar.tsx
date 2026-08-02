import { getStats } from "@/lib/db";

export default function StatsBar({ period = "week" }: { period?: string }) {
  const { totalRepos, totalStars, languages, totalGained } = getStats(period);

  const cards = [
    { label: "TRACKED REPOS", value: totalRepos.toLocaleString("en-US") },
    { label: "TOTAL STARS", value: totalStars.toLocaleString("en-US") },
    { label: "LANGUAGES", value: languages.toString() },
    {
      label: `GAINED THIS ${period.toUpperCase()}`,
      value: `+${totalGained.toLocaleString("en-US")}`,
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-6 md:mb-8 px-0">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative overflow-hidden bg-surface border border-border rounded-2xl px-4 py-3 md:px-5 md:py-4 ${
            card.highlight ? "border-accent/20" : ""
          }`}
        >
          {card.highlight && (
            <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-bl-full -mr-4 -mt-4" />
          )}
          <p className="text-text-muted text-[10px] tracking-widest uppercase mb-1">
            {card.label}
          </p>
          <p
            className={`font-mono text-lg md:text-xl tabular-nums ${
              card.highlight ? "text-accent font-bold" : "text-text-body font-semibold"
            }`}
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
