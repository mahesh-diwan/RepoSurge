import { type Metadata } from "next";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "about - reposurge",
  description: "how reposurge tracks star velocity on github",
};

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 pt-20">
      <div className="max-w-2xl space-y-8">
        <ScrollReveal>
          <section>
            <h2 className="text-text-muted text-xs mb-3 tracking-widest">what is this</h2>
            <p className="text-text-muted text-sm leading-relaxed">
              reposurge tracks the fastest-rising open source projects on github.
              repos are ranked by star velocity: how quickly a repo gains stars
              relative to its existing count.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <section>
            <h2 className="text-text-muted text-xs mb-3 tracking-widest">how it works</h2>
            <p className="text-text-muted text-sm leading-relaxed">
              top repos by stars are fetched daily from the github search api.
              star counts are compared against a baseline to calculate velocity:
            </p>
            <p className="text-text-muted text-sm leading-relaxed mt-2">
              velocity = (stars gained / baseline) &times; 1000
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <section>
            <h2 className="text-text-muted text-xs mb-3 tracking-widest">stack</h2>
            <p className="text-text-muted text-sm leading-relaxed">
              next.js 14 &middot; react 18 &middot; tailwind css
            </p>
          </section>
        </ScrollReveal>
      </div>
    </main>
  );
}
