import Link from "next/link";
import StarChart from "./StarChart";
import { gainedColor } from "@/lib/gained-color";

export type RepoCardData = {
  rank: number;
  full_name: string;
  stars_gained: number;
  velocity?: number;
  sparkline: number[];
  slug: string;
  stars?: number;
  liveDelta?: number;
};

export default function RepoCard({
  rank,
  full_name,
  stars_gained,
  sparkline,
  slug,
  liveDelta,
}: RepoCardData) {
  return (
    <div className="flex items-center gap-4 py-4 group hover:bg-terminal/[0.03] transition-all duration-200">
      <div className="w-8 text-right text-dim tabular-nums text-xs shrink-0 group-hover:text-terminal transition-colors">
        <span title="Rank">{rank}</span>
      </div>

      <Link
        href={`/repo/${slug}`}
        className="flex-1 min-w-0 max-w-[55vw] sm:max-w-none text-sm text-bone group-hover:text-terminal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal focus-visible:ring-offset-2 focus-visible:ring-offset-midnight active:text-terminal/70 transition-all duration-200 truncate py-2.5"
        title={full_name}
      >
        {full_name}
      </Link>

      <div className="hidden sm:block shrink-0">
        <StarChart data={sparkline} />
      </div>

      <div className="text-right min-w-[80px] shrink-0">
        <span
          className={`group-hover:drop-shadow-[0_0_4px_#00FF41] transition-all duration-200 text-xs tabular-nums font-bold ${gainedColor(stars_gained)}`}
          title={stars_gained > 0 ? "Stars gained this period" : stars_gained < 0 ? "Stars lost this period" : "No change this period"}
          aria-label={
            stars_gained > 0
              ? `gained ${stars_gained.toLocaleString("en-US")} stars`
              : stars_gained < 0
              ? `lost ${Math.abs(stars_gained).toLocaleString("en-US")} stars`
              : "no stars gained"
          }
        >
          {stars_gained > 0 ? "+" : stars_gained < 0 ? "↓" : ""}
          {stars_gained < 0 ? Math.abs(stars_gained).toLocaleString("en-US") : stars_gained.toLocaleString("en-US")}
        </span>
        {liveDelta !== undefined && liveDelta !== 0 && (
          <span className="text-terminal text-[10px] ml-1 align-super" title="Live star gain since page load">
            +{liveDelta}
          </span>
        )}
      </div>
    </div>
  );
}
