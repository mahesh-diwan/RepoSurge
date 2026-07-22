import { getStats } from "@/lib/db";
import AnimatedStat from "./AnimatedStat";
import ScrollReveal from "./ScrollReveal";

export default function Header() {
  const stats = getStats();

  return (
    <section className="px-6 pt-16 pb-12">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <p className="text-terminal text-xs mb-4">repos rising. fast.</p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none text-balance">
            REP<span className="text-bone">Ø</span>SURGE
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p className="text-dim text-xs mt-6">
            <AnimatedStat value={stats.totalRepos} /> repos &middot;{" "}
            <AnimatedStat value={stats.totalStars} duration={2000} /> stars &middot;{" "}
            <AnimatedStat value={stats.languages} /> languages
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
