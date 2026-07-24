import { getStats } from "@/lib/db";
import ScrollReveal from "./ScrollReveal";

export default function Header() {
  const stats = getStats();

  return (
    <section className="px-6 pt-20 pb-16">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <p className="text-amber-primary text-xs mb-4 drop-shadow-[0_0_6px_#FFB000]">repos rising. fast.</p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none text-balance">
            REP<span className="text-amber-dim">Ø</span>SURGE
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="text-amber-primary/60 text-xs mt-8">
            <span title="Total repositories" className="tabular-nums">{stats.totalRepos.toLocaleString("en-US")}</span> ⊞ repos &middot;{" "}
            <span title="Total stars" className="tabular-nums">{stats.totalStars.toLocaleString("en-US")}</span> ★ stars &middot;{" "}
            <span title="Programming languages" className="tabular-nums">{stats.languages.toLocaleString("en-US")}</span> ⊞ languages
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
