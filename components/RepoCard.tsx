import Tooltip from "./Tooltip";

export default function RepoCard({
  rank,
  name,
  stars,
  gained,
  language,
  onSelect,
  slug,
  hero,
  description,
  rankChange,
  sparkline,
  compact,
}: {
  rank: number;
  name: string;
  stars: number;
  gained: number | null;
  language: string;
  onSelect?: (slug: string) => void;
  slug: string;
  hero?: boolean;
  description: string | null;
  rankChange: number | null;
  sparkline: number[];
  compact?: boolean;
}) {
  if (compact) {
    return (
      <button
        onClick={() => onSelect?.(slug)}
        className="w-full text-left px-3 py-2 rounded hover:bg-surface/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className="text-text-body text-sm truncate">{name}</span>
          <span className="text-text-muted text-xs ml-2">{/* velocity */}</span>
        </div>
      </button>
    );
  }
  const isSurging = (gained ?? 0) > 0;

  return (
    <div
      className={`flex items-center justify-between gap-4 py-2.5 px-2 cursor-pointer transition-all duration-300 border-b border-white/[0.03] hover:bg-white/[0.01] ${isSurging ? "animate-surge-glow bg-amber-500/[0.015]" : ""}`}
      onClick={() => onSelect?.(slug)}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex items-center gap-1.5 w-6 shrink-0">
          <span role="text" className="tabular-nums text-xs text-text-muted">#{rank}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-text-body text-sm font-medium">{name}</span>
            {rankChange !== null && rankChange !== 0 && (
              <Tooltip
                label={`Rank moved ${rankChange > 0 ? "↑" : "↓"}${Math.abs(rankChange)} position${Math.abs(rankChange) === 1 ? "" : "s"} this period.`}
              >
                <span
                  aria-label={rankChange > 0 ? `moved up ${rankChange} positions` : `moved down ${Math.abs(rankChange)} positions`}
                  className={`tabular-nums text-[11px] shrink-0 ${rankChange > 0 ? "text-positive" : "text-negative"}`}
                >
                  {rankChange > 0 ? "↑" : "↓"}{Math.abs(rankChange)}
                </span>
              </Tooltip>
            )}
          </div>
          {description && (
            <p className="text-text-muted/40 text-xs mt-0.5 leading-snug line-clamp-1">{description}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-12 h-5 shrink-0 hidden sm:block">
          {sparkline.length > 1 && (
            <svg role="img" aria-label="star velocity trend" viewBox={`0 0 ${sparkline.length - 1} 20`} className="w-full h-full" preserveAspectRatio="none">
              <path
                d={sparkline.map((s, i) => `${i === 0 ? "M" : "L"}${i},${20 - ((s - Math.min(...sparkline)) / (Math.max(...sparkline) - Math.min(...sparkline) || 1)) * 18}`).join(" ")}
                fill="none"
                stroke="rgba(217,119,6,0.3)"
                strokeWidth="2"
              />
            </svg>
          )}
        </div>
        <span className="text-text-muted/30 text-[11px] hidden sm:block">{language || "—"}</span>
        {gained === null || gained === 0 ? (
          <span className="text-text-muted/20 tabular-nums text-xs w-16 text-right">—</span>
        ) : (
          <span className={`tabular-nums text-xs font-medium w-16 text-right ${gained > 0 ? "text-positive" : "text-negative"}`}>
            {gained > 0 ? "+" : ""}{gained.toLocaleString("en-US")}
          </span>
        )}
        <span className="text-text-muted/20 text-[11px] tabular-nums w-14 text-right hidden sm:block">{(stars / 1000).toFixed(1)}K</span>
        <Tooltip label="Total GitHub stars. Stars gained shows delta this period.">
          <svg
            className="w-3 h-3 text-text-muted/50 inline-block ml-0.5 cursor-help"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1Zm0 1.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Zm-.5 4h1v4.5h-1V6.5ZM8 5.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
          </svg>
        </Tooltip>
      </div>
    </div>
  );
}
