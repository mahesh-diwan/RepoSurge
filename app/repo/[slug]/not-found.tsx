import Link from "next/link";

export default function RepoNotFound() {
  return (
    <main className="max-w-7xl mx-auto px-6 pt-16">
      <div className="max-w-xl space-y-4">
        <h1 className="text-xl font-bold text-accent">repo not found</h1>
        <p className="text-text-muted text-sm">no repository matches that name.</p>
        <Link
          href="/"
          className="text-accent text-xs hover:underline hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-midnight active:text-accent/70 transition-colors inline-block"
        >
          back home
        </Link>
      </div>
    </main>
  );
}
