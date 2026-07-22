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
  stars,
}: RepoCardData & { style?: React.CSSProperties }) {
  const gainedColor =
    stars_gained > 0
      ? "text-electric"
      : stars_gained < 0
        ? "text-red-400"
        : "text-bone/30";

  return (
    <div className="double-bezel group">
      <div className="double-bezel-inner p-4 md:p-5">
        <div className="flex items-center gap-4">
          <div className="w-8 text-right text-bone/20 tabular-nums text-xs font-mono">
            {String(rank).padStart(2, "0")}
          </div>

          <div className="flex-1 min-w-0">
            <Link
              href={`/repo/${slug}`}
              className="text-bone group-hover:text-electric transition-colors duration-500 truncate block font-bold text-sm"
              style={{ transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)" }}
            >
              {full_name}
            </Link>
            <p className="text-bone/30 text-xs truncate mt-1">
              {description ?? "—"}
            </p>
          </div>

          <div className="hidden sm:block">
            <StarChart data={sparkline} />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {language && (
              <span className="hidden md:inline-block pill-badge glass-panel text-bone/40 text-[9px]">
                {language}
              </span>
            )}
            <div className="text-right min-w-[70px]">
              <span className={`text-sm tabular-nums font-bold font-mono ${gainedColor}`}>
                {stars_gained > 0 ? "+" : ""}
                {stars_gained.toLocaleString()} ★
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
