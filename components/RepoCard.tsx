import Link from "next/link";
import StarChart from "./StarChart";

export type RepoCardData = {
  rank: number;
  full_name: string;
  stars_gained: number;
  sparkline: number[];
  slug: string;
};

export default function RepoCard({
  rank,
  full_name,
  stars_gained,
  sparkline,
  slug,
}: RepoCardData) {
  const gainedColor =
    stars_gained > 0
      ? "text-terminal"
      : stars_gained < 0
        ? "text-red-400"
        : "text-dim";

  return (
    <div className="flex items-center gap-4 py-2.5 group">
      <div className="w-8 text-right text-dim tabular-nums text-xs shrink-0">
        {rank}
      </div>

      <Link
        href={`/repo/${slug}`}
        className="flex-1 min-w-0 text-sm text-bone group-hover:text-terminal transition-colors truncate"
      >
        {full_name}
      </Link>

      <div className="hidden sm:block shrink-0">
        <StarChart data={sparkline} />
      </div>

      <div className="text-right min-w-[80px] shrink-0">
        <span className={`text-xs tabular-nums font-bold ${gainedColor}`}>
          {stars_gained > 0 ? "+" : ""}
          {stars_gained.toLocaleString("en-US")}
        </span>
      </div>
    </div>
  );
}
