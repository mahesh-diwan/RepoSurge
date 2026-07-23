import Link from "next/link";
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
}) {
  const gainedPrefix = gained > 0 ? "+" : gained < 0 ? "" : "";
  const gainedAbs = Math.abs(gained);
  const liveLabel =
    liveDelta !== null ? `${liveDelta > 0 ? "+" : ""}${liveDelta}` : null;

  return (
    <Link
      href={`/repo/${slug}`}
      className="block bg-amber-bg/30 border border-amber-muted/30 px-3 py-2.5
        hover:bg-amber-bg/60 hover:border-amber-muted/50
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-primary
        focus-visible:ring-offset-2 focus-visible:ring-offset-amber-bg
        active:bg-amber-bg/80 transition-all duration-200"
    >
      {/* Row 1: rank + name + language + gained */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-amber-muted tabular-nums text-xs w-5 shrink-0">
            #{rank}
          </span>
          <span
            className="text-amber-primary amber-glow-sm truncate text-sm"
            title={name}
          >
            {name}
          </span>
          <span className="text-amber-muted/60 text-[10px] hidden sm:inline shrink-0">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {liveLabel && (
            <span className="text-amber-bright/60 text-[10px] tabular-nums">
              {liveLabel}
            </span>
          )}
          <span className={`${gainedColor} tabular-nums text-sm`}>
            {gainedPrefix}
            {gainedAbs.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      {/* Row 2: Amber glow sparkline (StarChart) */}
      <div className="mt-1 mb-1.5">
        <div style={{ height: "24px" }}>
          <StarChart history={history} period={period} />
        </div>
      </div>

      {/* Row 3: stats */}
      <div className="flex items-center gap-4 text-amber-muted text-[10px] tabular-nums">
        <span>{stars.toLocaleString("en-US")} ★</span>
        {gained7d > 0 && <span>+{gained7d.toLocaleString("en-US")} / 7d</span>}
      </div>
    </Link>
  );
}
