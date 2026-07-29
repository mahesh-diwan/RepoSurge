import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "page not found - reposurge",
};

export default function NotFoundPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 pt-24">
      <div className="max-w-xl text-center mx-auto space-y-4">
        <p className="text-accent font-bold text-5xl tabular-nums data-mono">404</p>
        <p className="text-text-muted text-sm">this route doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-block mt-4 text-xs bg-accent text-midnight px-4 py-2 rounded hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-midnight transition-colors"
        >
          back to reposurge
        </Link>
      </div>
    </main>
  );
}
