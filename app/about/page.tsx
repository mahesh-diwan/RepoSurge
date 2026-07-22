import ScrollReveal from "@/components/ScrollReveal";

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div>
            <div className="pill-badge glass-panel inline-block mb-6 text-electric">
              ABOUT
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              About
              <br />
              <span className="text-electric">RepoSurge</span>
            </h1>
          </div>

          <div className="space-y-10">
            <ScrollReveal delay={0.1}>
              <section>
                <h2 className="text-[10px] tracking-[0.2em] text-electric font-medium mb-4">
                  WHAT IS THIS?
                </h2>
                <p className="text-bone/60 text-sm leading-relaxed">
                  RepoSurge tracks the fastest-rising open source projects on GitHub.
                  We measure star velocity: how quickly a repo gains stars relative to
                  its existing count, to surface projects gaining momentum, not just
                  the ones with the most stars.
                </p>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <section>
                <h2 className="text-[10px] tracking-[0.2em] text-electric font-medium mb-4">
                  HOW IT WORKS
                </h2>
                <p className="text-bone/60 text-sm leading-relaxed">
                  Every day, we fetch the top repos sorted by stars. We compare today&apos;s
                  count against a historical baseline to calculate velocity.
                </p>
                <p className="text-bone/60 text-sm leading-relaxed mt-3">
                  Velocity = (stars gained / baseline stars) × 1000. A velocity of 5 means
                  the repo gained 0.5% of its star count in the measurement period.
                </p>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <section>
                <h2 className="text-[10px] tracking-[0.2em] text-bone/60 font-medium mb-4">
                  DATA SOURCE
                </h2>
                <p className="text-bone/60 text-sm leading-relaxed">
                  All data comes from the GitHub Search API. Star counts are snapshots,
                  not real-time. History is accumulated over daily fetches.
                </p>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <section>
                <h2 className="text-[10px] tracking-[0.2em] text-bone/60 font-medium mb-4">
                  STACK
                </h2>
                <p className="text-bone/60 text-sm leading-relaxed">
                  Next.js 14, React 18, Tailwind CSS, Framer Motion. No heavy frameworks,
                  no unnecessary dependencies.
                </p>
              </section>
            </ScrollReveal>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
