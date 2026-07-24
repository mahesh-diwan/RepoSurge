import { getStats } from "@/lib/db";

export default function Header() {
  const stats = getStats();
  return (
    <section className="px-6 pt-24 pb-12 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none text-[#F5F5F0] mb-4">
          REPOSURGE
        </h1>
        <p className="text-amber-muted text-sm md:text-base leading-relaxed mb-6 max-w-lg mx-auto">
          Track GitHub repo velocity in real-time. See which projects are rising fastest, compare star growth, and discover trending repos at a glance.
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-amber-primary/60">
          <span className="tabular-nums">{stats.totalRepos.toLocaleString("en-US")}</span> repos
          <span className="text-amber-muted/30">·</span>
          <span className="tabular-nums">{stats.totalStars.toLocaleString("en-US")}</span> stars
          <span className="text-amber-muted/30">·</span>
          <span className="tabular-nums">{stats.languages.toLocaleString("en-US")}</span> languages
        </div>
      </div>
    </section>
  );
}
