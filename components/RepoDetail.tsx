import { getRepoDetails } from "@/lib/db";
import { gainedColor } from "@/lib/gained-color";
import StarChart from "./StarChart";

export default function RepoDetail({ slug }: { slug: string }) {
  const repo = getRepoDetails(slug);
  if (!repo)
    return <p className="text-amber-muted-light text-xs">Repo not found</p>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#F5F5F0] tracking-tight">
          {repo.name}
        </h3>
        <p className="text-amber-muted-light text-xs mt-1 leading-relaxed">
          {repo.description}
        </p>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-cyan-400/70 hover:text-cyan-400 hover:shadow-[0_0_8px_rgba(34,211,238,0.3)] text-xs underline underline-offset-2 transition-colors"
        >
          View on GitHub &rarr;
        </a>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-amber-muted-light/60 text-[10px]">Stars</span>
          <span className="text-[#F5F5F0] text-sm font-bold tabular-nums">
            {repo.stars.toLocaleString("en-US")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-muted-light/60 text-[10px]">7d Gain</span>
          <span
            className={`text-sm font-bold tabular-nums ${gainedColor(repo.gained7d)}`}
          >
            {repo.gained7d > 0 ? "+" : ""}
            {repo.gained7d.toLocaleString("en-US")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-amber-muted-light/60 text-[10px]">Created</span>
          <span className="text-[#F5F5F0] text-xs font-bold tabular-nums leading-tight">
            {repo.created_at ? new Date(repo.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
          </span>
        </div>
      </div>

      {repo.language && (
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-muted" />
          <span className="text-[#F5F5F0] text-xs">{repo.language}</span>
        </div>
      )}

      <div>
        <div className="text-amber-muted-light/60 text-[10px] mb-2">
          Star Velocity
        </div>
        <div className="h-24">
          <StarChart history={repo.history} period="week" />
        </div>
      </div>
    </div>
  );
}
