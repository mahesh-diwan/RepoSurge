import Link from "next/link";

export default function Header() {
  return (
    <section className="min-h-[100dvh] flex flex-col justify-center hero-mesh relative">
      <header className="text-left relative z-10 max-w-7xl mx-auto px-4 reveal">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          REP<span className="text-electric">Ø</span>SURGE
        </h1>
        <p className="text-bone/50 text-sm mt-3 max-w-md">
          repos rising. fast. ranked by star velocity.
        </p>
        <Link
          href="#repos"
          className="inline-block mt-8 bg-electric text-midnight px-8 py-3 text-sm tracking-widest hover:bg-electric/80 active:scale-[0.98] transition-all hover:shadow-[0_0_24px_rgba(0,102,255,0.4)]"
        >
          View Rankings
        </Link>
      </header>
    </section>
  );
}
