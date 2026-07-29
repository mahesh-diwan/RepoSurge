import { getStats } from "@/lib/db";

export default function StatsBar() {
  const { totalRepos, totalStars, languages, totalGained } = getStats();

  const cards = [
    { label: "TOTAL REPOS", value: totalRepos.toLocaleString("en-US") },
    { label: "TOTAL STARS", value: totalStars.toLocaleString("en-US") },
    { label: "LANGUAGES", value: languages.toString() },
    { label: "TOTAL GAINED", value: `+${totalGained.toLocaleString("en-US")}` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-surface border border-border rounded-2xl px-4 py-3"
        >
          <p className="font-sans text-text-muted text-[10px] tracking-widest mb-1">
            {card.label}
          </p>
          <p className="font-mono text-text-body font-bold text-lg tabular-nums">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
