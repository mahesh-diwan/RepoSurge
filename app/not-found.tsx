import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="font-mono text-6xl md:text-8xl font-bold text-border tracking-[-0.06em] mb-4">
        404
      </p>
      <h2 className="text-text-body text-xl md:text-2xl font-semibold mb-2">
        page not found
      </h2>
      <p className="text-text-muted text-sm mb-8 max-w-md">
        the repo you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-accent text-midnight font-medium text-sm rounded-xl hover:bg-accent/90 transition-colors"
      >
        back to dashboard
      </Link>
    </div>
  );
}
