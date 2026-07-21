import Link from "next/link";
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
  slug: string;
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
  slug,
  style,
}: RepoCardData & { style?: React.CSSProperties }) {
  const trend = stars_gained > 0 ? "↑" : stars_gained < 0 ? "↓" : "→";
  const trendColor =
    stars_gained > 0
      ? "text-electric"
      : stars_gained < 0
      ? "text-red-500"
      : "text-bone/40";

  return (
    <div
      className="card-glow flex items-center gap-4 border-b border-bone/20 py-3 hover:bg-bone/5"
      data-repo-card
      data-repo-name={full_name.toLowerCase()}
      data-repo-desc={(description ?? "").toLowerCase()}
      data-repo-lang={(language ?? "").toLowerCase()}
      data-repo-sort-gained={stars_gained}
      data-repo-sort-velocity={velocity}
      data-repo-sort-total={stars}
      style={style}
    >
      <div className="w-8 text-right text-bone/50 tabular-nums">
        {String(rank).padStart(2, "0")}
      </div>
      <div className="flex-1 min-w-0">
        <Link
          href={`/repo/${slug}`}
          className="text-bone hover:text-electric active:scale-[0.98] transition-transform truncate block font-bold"
        >
          {full_name}
        </Link>
        <p className="text-bone/50 text-xs truncate">
          {description ?? "-"}
        </p>
        <div className="flex gap-3 text-xs mt-1 text-bone/40">
          <span>{language ?? "-"}</span>
          <span>★ {stars.toLocaleString()}</span>
          <span className={trendColor}>
            {trend} {Math.abs(stars_gained).toLocaleString()}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <StarChart data={sparkline} />
        <span className="text-xs text-electric mt-1 tabular-nums">
          {velocity} v
        </span>
      </div>
    </div>
  );
}
