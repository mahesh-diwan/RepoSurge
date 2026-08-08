export default function RepoLoading() {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 pt-20">
      <div className="max-w-3xl space-y-8 animate-pulse">
        {/* Back link */}
        <div className="h-3 w-12 bg-white/5 rounded-full" />
        {/* Header */}
        <div className="space-y-3">
          <div className="h-8 w-72 bg-white/5 rounded-full" />
          <div className="h-4 w-full max-w-md bg-white/5 rounded-full" />
          <div className="h-8 w-32 bg-white/5 rounded-full" />
        </div>
        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="card p-3 space-y-2">
              <div className="h-2 w-12 bg-white/5 rounded-full" />
              <div className="h-6 w-16 bg-white/5 rounded-full" />
            </div>
          ))}
        </div>
        {/* Chart */}
        <div className="card-shell">
          <div className="card-core">
            <div className="h-2 w-20 bg-white/5 rounded-full mb-4" />
            <div className="h-32 w-full bg-white/5 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
