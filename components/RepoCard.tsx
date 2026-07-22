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
  stars_gained,
  sparkline,
  slug,
  style,
}: RepoCardData & { style?: React.CSSProperties }) {
  const gainedColor =
    stars_gained > 0
      ? "text-electric"
      : stars_gained < 0
        ? "text-red-500"
        : "text-bone/40";

  return (
    <div
      className="flex items-center gap-4 border-b border-bone/10 py-3"
      data-repo-card
      data-repo-name={full_name.toLowerCase()}
      data-repo-desc={(description ?? "").toLowerCase()}
      data-repo-sort-gained={stars_gained}
      style={style}
    >
      <div className="w-8 text-right text-bone/30 tabular-nums text-sm">
        {String(rank).padStart(2, "0")}
      </div>
      <div className="flex-1 min-w-0">
        <Link
          href={`/repo/${slug}`}
          className="text-bone hover:text-electric transition-colors truncate block font-bold"
        >
          {full_name}
        </Link>
        <p className="text-bone/40 text-xs truncate mt-0.5">
          {description ?? "-"}
        </p>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <StarChart data={sparkline} />
        <div className="text-right min-w-[60px]">
          <span className={`text-sm tabular-nums font-bold ${gainedColor}`}>
            {stars_gained > 0 ? "+" : ""}
            {stars_gained.toLocaleString()} ★
          </span>
        </div>
      </div>
    </div>
  );
}
