import { getRepoDetails } from "@/lib/db";
import { gainedColor } from "@/lib/gained-color";
import LoadingSkeleton from "./LoadingSkeleton";
import StarChart from "./StarChart";

export default function RepoDetail({ slug }: { slug: string }) {
  const detail = getRepoDetails(slug);

  if (!detail) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-text-body tracking-tight">
          {detail.name}
        </h3>
        <p className="text-text-muted text-xs mt-1 leading-relaxed">
          {detail.description}
        </p>
        <a
          href={detail.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 mt-3 rounded-full px-4 py-2 bg-accent text-white text-xs transition-all duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          view on github
          <span className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-[2px] group-hover:-translate-y-[1px]">
            <svg
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </span>
        </a>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-surface border border-white/[0.06] rounded-xl p-2.5">
          <p className="text-text-muted/60 text-[10px] mb-1">Stars</p>
          <p className="text-text-body text-sm font-bold tabular-nums data-mono">
            {detail.stars.toLocaleString("en-US")}
          </p>
        </div>
        <div className="bg-surface border border-white/[0.06] rounded-xl p-2.5">
          <p className="text-text-muted/60 text-[10px] mb-1">7d Gain</p>
          <p
            className={`text-sm font-bold tabular-nums data-mono ${gainedColor(detail.stars_gained ?? 0)}`}
          >
            {detail.gained7d === null
              ? "\u2014"
              : (detail.gained7d > 0 ? "+" : "") +
                detail.gained7d.toLocaleString("en-US")}
          </p>
        </div>
        <div className="bg-surface border border-white/[0.06] rounded-xl p-2.5">
          <p className="text-text-muted/60 text-[10px] mb-1">Created</p>
          <p className="text-text-body text-xs font-bold tabular-nums data-mono leading-tight">
            {detail.created_at
              ? new Date(detail.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "\u2014"}
          </p>
        </div>
      </div>

      {detail.language && (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent/60" />
          <span className="text-text-body text-xs">{detail.language}</span>
        </div>
      )}

      <div>
        <div className="text-text-muted/60 text-[10px] mb-2">Star Velocity</div>
        <div className="bg-surface border border-white/[0.06] rounded-xl p-3">
          <div className="h-24">
            <StarChart history={detail.history} period="week" />
          </div>
        </div>
      </div>
    </div>
  );
}
