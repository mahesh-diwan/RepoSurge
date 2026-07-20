import StarChart from "./StarChart";

export type RepoCardData = {
  rank: number;
  full_name: string;
  description: string | null;
  language: string | null;
  url: string;
  stars: number;
  stars_gained: number;
  velocity: number;
  sparkline: number[];
};

export default function RepoCard({
  rank,
  full_name,
  description,
  language,
  url,
  stars,
  stars_gained,
  velocity,
  sparkline,
}: RepoCardData) {
  const trend = stars_gained > 0 ? "↑" : stars_gained < 0 ? "↓" : "→";
  const trendColor =
    stars_gained > 0
      ? "text-electric"
      : stars_gained < 0
      ? "text-red-500"
      : "text-bone/40";

  return (
    <div className="flex items-center gap-4 border-b border-bone/20 py-3">
      <div className="w-8 text-right text-bone/50 tabular-nums">
        {String(rank).padStart(2, "0")}
      </div>
      <div className="flex-1 min-w-0">
<a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-bone hover:text-electric active:scale-[0.98] transition-transform truncate block font-bold"
      >
          {full_name}
        </a>
        <p className="text-bone/50 text-xs truncate">
          {description ?? "—"}
        </p>
        <div className="flex gap-3 text-xs mt-1 text-bone/40">
          <span>{language ?? "—"}</span>
          <span>★ {stars.toLocaleString()}</span>
          <span className={trendColor}>
            {trend} {Math.abs(stars_gained).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <StarChart data={sparkline} />
        <span className="text-xs text-electric mt-1 tabular-nums">
          {velocity.toFixed(1)} v
        </span>
      </div>
    </div>
  );
}
