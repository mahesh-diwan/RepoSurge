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
  gained: number | null;
  gained7d: number | null;
  language: string;
  gainedColor: string;
  liveDelta: number | null;
  history: { recorded_at: string; stars: number }[];
  period?: string;
  onSelect?: (slug: string) => void;
}) {
  const gainedPrefix = gained !== null && gained > 0 ? "+" : gained !== null && gained < 0 ? "" : "";
  const gainedAbs = gained !== null ? Math.abs(gained) : 0;
  const liveLabel =
    liveDelta !== null ? `${liveDelta > 0 ? "+" : ""}${liveDelta}` : null;

  return (
    <div
      role="button"
      tabIndex={0}
      className="flex items-center gap-3 py-2.5 px-2 hover:bg-positive/[0.03] transition-colors cursor-pointer border-b border-border last:border-b-0"
      onClick={() => onSelect?.(slug)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(slug);
        }
      }}
    >
      <span className="w-6 text-right text-text-muted tabular-nums text-xs shrink-0">
        #{rank}
      </span>
      <span
        className="flex-1 min-w-0 truncate text-text-body text-sm"
        title={name}
      >
        {name}
      </span>
      <span className="text-text-muted/50 text-[10px] w-16 shrink-0 hidden sm:inline truncate">
        {language || <span className="text-text-muted/20">&mdash;</span>}
      </span>
      <div className="w-20 shrink-0 hidden md:block" style={{ height: "20px" }}>
        <StarChart history={history} period={period} />
      </div>
      {(() => {
        const trend = history[history.length - 1].stars - history[0].stars;
        if (trend > 0) return (
          <svg className="w-3 h-3 text-positive shrink-0" viewBox="0 0 12 12" fill="currentColor">
            <polygon points="6,1 11,10 1,10" />
          </svg>
        );
        if (trend < 0) return (
          <svg className="w-3 h-3 text-negative shrink-0" viewBox="0 0 12 12" fill="currentColor">
            <polygon points="6,11 1,2 11,2" />
          </svg>
        );
        return null;
      })()}
      <div className="flex items-center gap-2 shrink-0 w-20 justify-end">
        {liveLabel && (
          <span className="text-positive/70 text-[10px] tabular-nums">
            {liveLabel}
          </span>
        )}
        {gained === null ? (
          <span className="text-text-muted/30 tabular-nums text-sm">&mdash;</span>
        ) : gained === 0 ? (
          <span className="text-text-muted/30 tabular-nums text-sm">&mdash;</span>
        ) : (
          <span className={`${gainedColor} tabular-nums text-sm`}>
            {gainedPrefix}
            {gainedAbs.toLocaleString("en-US")}
          </span>
        )}
      </div>
      <span className="text-text-muted/40 text-xs tabular-nums w-16 text-right shrink-0 hidden sm:block">
        {(stars / 1000).toFixed(1)}K
      </span>
    </div>
  );
}
