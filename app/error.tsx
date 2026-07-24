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
        <h1 className="text-xl font-bold text-accent">something went wrong</h1>
        <p className="text-text-muted text-sm">{error.message || "an unexpected error occurred"}</p>
        <button
          onClick={reset}
          className="text-accent text-xs hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-midnight active:text-accent/70 transition-colors cursor-pointer underline underline-offset-4"
        >
          try again
        </button>
      </div>
    </main>
  );
}
