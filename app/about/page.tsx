import ScrollReveal from "@/components/ScrollReveal";

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 pt-8">
      <ScrollReveal>
        <section className="mb-12">
          <p className="text-terminal text-xs tracking-wider mb-4">
            <span className="text-terminal">$</span> cat ./about
          </p>
        </section>
      </ScrollReveal>

      <div className="max-w-2xl space-y-8">
        <ScrollReveal delay={0.1}>
          <section>
            <p className="text-terminal text-[10px] tracking-wider mb-3">$ whatis</p>
            <p className="text-dim text-xs leading-relaxed">
              reposurge tracks the fastest-rising open source projects on github.
              we measure star velocity: how quickly a repo gains stars relative to
              its existing count, to surface projects gaining momentum.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <section>
            <p className="text-terminal text-[10px] tracking-wider mb-3">$ how</p>
            <p className="text-dim text-xs leading-relaxed">
              every day we fetch top repos sorted by stars. we compare today's
              count against a baseline to calculate velocity.
            </p>
            <p className="text-dim text-xs leading-relaxed mt-2">
              velocity = (stars gained / baseline stars) &times; 1000. a velocity
              of 5 means the repo gained 0.5% of its star count in the period.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <section>
            <p className="text-terminal text-[10px] tracking-wider mb-3">$ source</p>
            <p className="text-dim text-xs leading-relaxed">
              all data from the github search api. star counts are snapshots, not
              real-time. history accumulates over daily fetches.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <section>
            <p className="text-terminal text-[10px] tracking-wider mb-3">$ stack</p>
            <p className="text-dim text-xs leading-relaxed">
              next.js 14 &middot; react 18 &middot; tailwind css &middot; motion
            </p>
          </section>
        </ScrollReveal>
      </div>
    </main>
  );
}
