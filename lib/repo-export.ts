import type { RepoWithVelocity } from "./db";

function csvEscape(v: string): string {
  return v.includes(",") || v.includes('"') || v.includes("\n")
    ? `"${v.replace(/"/g, '""')}"`
    : v;
}

export function reposToCSV(repos: RepoWithVelocity[]): string {
  const headers = ["repo", "stars", "gained", "velocity", "rank_change"];
  const rows = repos.map((r) => [
    csvEscape(r.full_name),
    r.stars.toString(),
    (r.stars_gained ?? 0).toString(),
    (r.velocity ?? 0).toString(),
    (r.rankChange ?? 0).toString(),
  ]);
  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}

export function downloadCSV(repos: RepoWithVelocity[]): void {
  const csv = reposToCSV(repos);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reposurge-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
