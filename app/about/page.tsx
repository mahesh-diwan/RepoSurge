import ScrollReveal from "@/components/ScrollReveal";

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 pt-16">
      <div className="max-w-2xl space-y-8">
        <ScrollReveal>
          <section>
            <p className="text-dim text-xs mb-3">what is this</p>
            <p className="text-dim text-sm leading-relaxed">
              reposurge tracks the fastest-rising open source projects on github.
              repos are ranked by star velocity: how quickly a repo gains stars
              relative to its existing count.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <section>
            <p className="text-dim text-xs mb-3">how it works</p>
            <p className="text-dim text-sm leading-relaxed">
              top repos by stars are fetched daily from the github search api.
              star counts are compared against a baseline to calculate velocity:
            </p>
            <p className="text-dim text-sm leading-relaxed mt-2">
              velocity = (stars gained / baseline) &times; 1000
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <section>
            <p className="text-dim text-xs mb-3">stack</p>
            <p className="text-dim text-sm leading-relaxed">
              next.js 14 &middot; react 18 &middot; tailwind css &middot; motion
            </p>
          </section>
        </ScrollReveal>
      </div>
    </main>
  );
}
