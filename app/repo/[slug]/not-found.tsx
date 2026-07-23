import Link from "next/link";

export default function RepoNotFound() {
  return (
    <main className="max-w-7xl mx-auto px-6 pt-16">
      <div className="max-w-xl space-y-4">
        <h1 className="text-xl font-bold text-bone">repo not found</h1>
        <p className="text-dim text-sm">no repository matches that name.</p>
        <Link
          href="/"
          className="text-terminal text-xs hover:underline hover:text-terminal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal focus-visible:ring-offset-2 focus-visible:ring-offset-midnight active:text-terminal/70 transition-colors inline-block"
        >
          back home
        </Link>
      </div>
    </main>
  );
}
