export default function LeaderboardInfo() {
  return (
    <p className="text-amber-muted text-xs leading-relaxed border-b border-amber-primary/5 pb-4 mb-2">
      15 repos ranked by stars gained this period. <span title="Rank">#</span>{" "}
      position &middot; <span title="Stars gained this period">gained</span>{" "}
      stars earned &middot; <span title="Star count trend">sparkline</span>{" "}
      trend &middot; <span title="Live polling from GitHub API">● live</span>{" "}
      from github
    </p>
  );
}
