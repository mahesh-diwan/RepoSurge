import Link from "next/link";

const PERIODS = ["daily", "weekly", "monthly"] as const;
const TO_SLUG = { daily: "day", weekly: "week", monthly: "month" } as const;

export default function PeriodNav({
  current,
  showLabel = false,
}: {
  current: "day" | "week" | "month";
  showLabel?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 text-xs">
      {showLabel && <span className="text-text-muted">period:</span>}
      {PERIODS.map((label) => {
        const slug = TO_SLUG[label];
        return slug === current ? (
          <span key={label} className="text-accent font-bold border border-accent/30 px-2 py-1" aria-current="page" title="Current view">{label}</span>
        ) : (
          <Link key={label} href={`/${label}`} className="text-text-muted hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-midnight active:text-accent/70 transition-colors py-2" title={`View ${label} leaderboard`}>{label}</Link>
        );
      })}
    </div>
  );
}
