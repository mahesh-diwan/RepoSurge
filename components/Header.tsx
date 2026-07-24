export default function Header() {
  return (
    <section className="px-6 pt-24 pb-12 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-none text-[#F5F5F0] mb-4">
          REPOSURGE
        </h1>
        <p className="text-amber-muted-light text-sm md:text-base leading-relaxed mb-6 max-w-lg mx-auto">
          Track GitHub repo velocity in real-time. See which projects are rising fastest, compare star growth, and discover trending repos at a glance.
        </p>
      </div>
    </section>
  );
}
