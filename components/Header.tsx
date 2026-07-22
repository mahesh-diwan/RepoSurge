import { getStats } from "@/lib/db";
import ScrollReveal from "./ScrollReveal";

export default function Header() {
  const stats = getStats();

  return (
    <section className="pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="pill-badge glass-panel inline-block mb-6 text-electric">
            STAR VELOCITY TRACKER
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9]">
            REP<span className="text-electric">Ø</span>SURGE
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <p className="text-bone/40 text-lg mt-6 max-w-md font-light">
            repos rising. fast.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex gap-16 mt-16">
            {[
              { value: stats.totalRepos.toLocaleString(), label: "REPOS TRACKED" },
              { value: stats.totalStars.toLocaleString(), label: "STARS MONITORED" },
              { value: stats.languages.toString(), label: "LANGUAGES" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold tabular-nums font-mono">
                  {stat.value}
                </p>
                <p className="text-bone/30 text-[10px] tracking-[0.2em] mt-2 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
