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
    <div className="row py-3 group">
      <div className="w-8 text-right text-dim tabular-nums text-xs shrink-0">
        {String(rank).padStart(2, "0")}
      </div>

      <div className="flex-1 min-w-0">
        <Link
          href={`/repo/${slug}`}
          className="text-bone group-hover:text-terminal transition-colors truncate block text-sm"
        >
          <span className="text-terminal opacity-0 group-hover:opacity-100 transition-opacity mr-1">
            &gt;
          </span>
          {full_name}
        </Link>
        <p className="text-dim text-[10px] truncate mt-0.5">
          {description ?? "-"}
        </p>
      </div>

      <div className="hidden sm:block shrink-0">
        <StarChart data={sparkline} />
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {language && (
          <span className="hidden md:inline-block text-dim text-[10px] border border-[#333] px-2 py-0.5">
            {language}
          </span>
        )}
        <div className="text-right min-w-[80px]">
          <span className={`text-xs tabular-nums font-bold ${gainedColor}`}>
            {stars_gained > 0 ? "+" : ""}
            {stars_gained.toLocaleString()} ★
          </span>
        </div>
      </div>
    </div>
  );
}
