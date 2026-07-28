export default function Header() {
  return (
    <section className="px-6 pt-24 pb-16 text-center relative z-[2]">
      <div className="max-w-2xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full glass text-[10px] uppercase tracking-[0.2em] font-medium text-accent mb-6">
          live github rankings
        </span>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none text-text-body mb-4">
          REPOSURGE
        </h1>
        <p className="text-text-muted text-sm md:text-base leading-relaxed mb-6 max-w-lg mx-auto">
          Track GitHub repo velocity in real-time. See which projects are rising
          fastest, compare star growth, and discover trending repos at a glance.
        </p>
      </div>
    </section>
  );
}
