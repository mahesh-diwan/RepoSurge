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

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-amber-primary/[0.03] rounded-lg p-3">
          <div className="text-amber-muted-light/50 text-[10px] uppercase tracking-wider">
            Stars
          </div>
          <div className="text-[#F5F5F0] text-lg font-bold tabular-nums">
            {repo.stars.toLocaleString("en-US")}
          </div>
        </div>
        <div className="bg-amber-primary/[0.03] rounded-lg p-3">
          <div className="text-amber-muted-light/50 text-[10px] uppercase tracking-wider">
            7d Gain
          </div>
          <div
            className={`text-lg font-bold tabular-nums ${gainedColor(repo.gained7d)}`}
          >
            {repo.gained7d > 0 ? "+" : ""}
            {repo.gained7d.toLocaleString("en-US")}
          </div>
        </div>
        <div className="bg-amber-primary/[0.03] rounded-lg p-3">
          <div className="text-amber-muted-light/50 text-[10px] uppercase tracking-wider">
            Created
          </div>
          <div className="text-[#F5F5F0] text-xs font-bold tabular-nums leading-tight mt-1">
            {repo.created_at ? new Date(repo.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
          </div>
        </div>
      </div>

      {repo.language && (
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: "#8B6914" }}
          />
          <span className="text-[#F5F5F0] text-xs">{repo.language}</span>
        </div>
      )}

      <div>
        <div className="text-amber-muted-light/50 text-[10px] uppercase tracking-wider mb-2">
          Star Velocity
        </div>
        <div className="h-24">
          <StarChart history={repo.history} period="week" />
        </div>
      </div>
    </div>
  );
}
