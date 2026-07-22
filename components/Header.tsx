import { getStats } from "@/lib/db";
import ScrollReveal from "./ScrollReveal";

export default function Header() {
  const stats = getStats();

  return (
    <section className="px-6 pt-12 pb-16">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <p className="text-terminal text-xs tracking-wider mb-4">
            <span className="text-terminal">$</span> ./tracker --scan
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none">
            REP<span className="text-bone">Ø</span>SURGE
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-dim text-sm mt-4">
            repos rising. fast. <span className="animate-blink text-terminal">_</span>
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-12 space-y-1 text-xs tracking-wider">
            <p>
              <span className="text-terminal">$</span> cat ./stats
            </p>
            <p className="text-dim">
              repos tracked: <span className="text-bone">{stats.totalRepos}</span>
            </p>
            <p className="text-dim">
              stars monitored: <span className="text-bone">{stats.totalStars.toLocaleString()}</span>
            </p>
            <p className="text-dim">
              languages: <span className="text-bone">{stats.languages}</span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
