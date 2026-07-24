import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 pt-16">
      <div className="max-w-xl space-y-4">
        <h1 className="text-xl font-bold text-amber-primary amber-glow">404 &mdash; page not found</h1>
        <p className="text-amber-muted-light text-sm">this route doesn&apos;t exist.</p>
        <Link
          href="/"
          className="text-amber-primary text-xs hover:underline hover:text-amber-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-primary focus-visible:ring-offset-2 focus-visible:ring-offset-amber-bg active:text-amber-primary/70 transition-colors inline-block"
        >
          back home
        </Link>
      </div>
    </main>
  );
}
