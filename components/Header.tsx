import { getStats } from "@/lib/db";
import ScrollReveal from "./ScrollReveal";

export default function Header() {
  const stats = getStats();

  return (
    <section className="px-6 pt-20 pb-16">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <p className="text-terminal text-xs mb-4 drop-shadow-[0_0_6px_#00FF41]">repos rising. fast.</p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none text-balance">
            REP<span className="text-bone">Ø</span>SURGE
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="text-bone/60 text-xs mt-8">
            <span className="tabular-nums">{stats.totalRepos.toLocaleString("en-US")}</span> repos &middot;{" "}
            <span className="tabular-nums">{stats.totalStars.toLocaleString("en-US")}</span> stars &middot;{" "}
            <span className="tabular-nums">{stats.languages.toLocaleString("en-US")}</span> languages
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
