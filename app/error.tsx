"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="max-w-7xl mx-auto px-6 pt-16">
      <div className="max-w-xl space-y-4">
        <h1 className="text-xl font-bold text-text-body">Something went wrong</h1>
        <p className="text-text-muted text-sm">{error.message || "An unexpected error occurred."}</p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 text-xs font-mono bg-accent/10 text-accent px-3 py-1.5 rounded-lg hover:bg-accent/20 active:scale-[0.97] transition-all duration-200"
        >
          TRY AGAIN
        </button>
      </div>
    </main>
  );
}
