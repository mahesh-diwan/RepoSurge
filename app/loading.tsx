export default function LoadingPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 pt-20">
      <div className="space-y-6 animate-pulse">
        {/* StatsBar skeleton */}
        <div className="card-shell">
          <div className="card-core">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-white/5 rounded-full" />
                <div className="h-5 w-32 bg-white/5 rounded-full" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-8 w-28 bg-white/5 rounded-full ml-auto" />
                <div className="h-2 w-20 bg-white/5 rounded-full ml-auto" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-px bg-border rounded-xl overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface/50 px-4 py-4 text-center">
                  <div className="h-5 w-12 bg-white/5 rounded-full mx-auto" />
                  <div className="h-2 w-8 bg-white/5 rounded-full mx-auto mt-2" />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Row skeletons */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-[36px_1fr_80px_90px_90px_130px_64px] gap-3 items-center px-4 py-3.5">
            <div className="h-4 w-4 bg-white/5 rounded-full" />
            <div className="space-y-1.5">
              <div className="h-4 w-40 bg-white/5 rounded-full" />
              <div className="h-3 w-20 bg-white/5 rounded-full" />
            </div>
            <div className="h-4 w-10 bg-white/5 rounded-full ml-auto" />
            <div className="h-4 w-12 bg-white/5 rounded-full ml-auto" />
            <div className="h-4 w-8 bg-white/5 rounded-full ml-auto" />
            <div className="h-6 w-24 bg-white/5 rounded-full ml-auto" />
            <div className="h-4 w-6 bg-white/5 rounded-full ml-auto" />
          </div>
        ))}
      </div>
    </main>
  );
}
