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
        <h1 className="text-xl font-bold text-amber-primary amber-glow">something went wrong</h1>
        <p className="text-amber-muted-light text-sm">{error.message || "an unexpected error occurred"}</p>
        <button
          onClick={reset}
          className="text-amber-primary text-xs hover:text-amber-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-primary focus-visible:ring-offset-2 focus-visible:ring-offset-amber-bg active:text-amber-primary/70 transition-colors cursor-pointer underline underline-offset-4"
        >
          try again
        </button>
      </div>
    </main>
  );
}
