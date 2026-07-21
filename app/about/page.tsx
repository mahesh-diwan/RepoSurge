export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-8">About RepoSurge</h1>

      <div className="space-y-8 text-bone/70 text-sm leading-relaxed">
        <section>
          <h2 className="text-electric text-xs tracking-widest uppercase mb-3">What is this?</h2>
          <p>
            RepoSurge tracks the fastest-rising open source projects on GitHub.
            We measure star velocity: how quickly a repo gains stars relative to
            its existing count, to surface projects gaining momentum, not just
            the ones with the most stars.
          </p>
        </section>

        <section>
          <h2 className="text-electric text-xs tracking-widest uppercase mb-3">How it works</h2>
          <p>
            Every day, we fetch the top 100 repos across 6 languages (JavaScript,
            Python, Rust, Go, TypeScript, Java) sorted by stars. We compare today&apos;s
            count against a historical baseline to calculate velocity.
          </p>
          <p className="mt-3">
            Velocity = (stars gained / baseline stars) × 1000. A velocity of 5 means
            the repo gained 0.5% of its star count in the measurement period.
          </p>
        </section>

        <section>
          <h2 className="text-bone font-bold mb-3">Data source</h2>
          <p>
            All data comes from the GitHub Search API. Star counts are snapshots,
            not real-time. History is accumulated over daily fetches.
          </p>
        </section>

        <section>
          <h2 className="text-bone font-bold mb-3">Stack</h2>
          <p>
            Next.js 14, React 18, Tailwind CSS, vanilla JavaScript for client
            interactivity. No heavy frameworks, no unnecessary dependencies.
          </p>
        </section>
      </div>
    </main>
  );
}
