import StarChart from "./StarChart";

export default function RepoCard({
  rank,
  name,
  slug,
  stars,
  gained,
  gained7d,
  language,
  gainedColor,
  liveDelta,
  history,
  period = "week",
  onSelect,
}: {
  rank: number;
  name: string;
  slug: string;
  stars: number;
  gained: number;
  gained7d: number;
  language: string;
  gainedColor: string;
  liveDelta: number | null;
  history: { recorded_at: string; stars: number }[];
  period?: string;
  onSelect?: (slug: string) => void;
}) {
  const gainedPrefix = gained > 0 ? "+" : gained < 0 ? "" : "";
  const gainedAbs = Math.abs(gained);
  const liveLabel =
    liveDelta !== null ? `${liveDelta > 0 ? "+" : ""}${liveDelta}` : null;

  return (
    <div
      className="flex items-center gap-3 py-2.5 px-2 hover:bg-amber-primary/[0.03] transition-colors cursor-pointer border-b border-amber-primary/[0.06] last:border-b-0"
      onClick={() => onSelect?.(slug)}
    >
      <span className="w-6 text-right text-amber-muted tabular-nums text-xs shrink-0">
        #{rank}
      </span>
      <span
        className="flex-1 min-w-0 truncate text-[#F5F5F0] text-sm"
        title={name}
      >
        {name}
      </span>
      <span className="text-amber-muted/50 text-[10px] w-16 shrink-0 hidden sm:inline truncate">
        {language}
      </span>
      <div className="w-20 shrink-0 hidden md:block" style={{ height: "20px" }}>
        <StarChart history={history} period={period} />
      </div>
      {(() => {
        const trend = history[history.length - 1].stars - history[0].stars;
        if (trend > 0) return (
          <svg className="w-3 h-3 text-green-500 shrink-0" viewBox="0 0 12 12" fill="currentColor">
            <polygon points="6,1 11,10 1,10" />
          </svg>
        );
        if (trend < 0) return (
          <svg className="w-3 h-3 text-red-500 shrink-0" viewBox="0 0 12 12" fill="currentColor">
            <polygon points="6,11 1,2 11,2" />
          </svg>
        );
        return null;
      })()}
      <div className="flex items-center gap-2 shrink-0 w-20 justify-end">
        {liveLabel && (
          <span className="text-amber-bright/50 text-[10px] tabular-nums">
            {liveLabel}
          </span>
        )}
        <span className={`${gainedColor} tabular-nums text-sm`}>
          {gainedPrefix}
          {gainedAbs.toLocaleString("en-US")}
        </span>
      </div>
      <span className="text-amber-muted/40 text-xs tabular-nums w-16 text-right shrink-0 hidden sm:block">
        {(stars / 1000).toFixed(1)}K
      </span>
    </div>
  );
}
