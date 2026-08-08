import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="font-mono text-6xl md:text-8xl font-bold text-border tracking-[-0.06em] mb-4">
        404
      </p>
      <h2 className="text-text-body text-xl md:text-2xl font-semibold mb-2">
        Page not found
      </h2>
      <p className="text-text-muted text-sm mb-8 max-w-md">
        The repo you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="group inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-midnight font-medium text-sm rounded-full hover:bg-accent/90 transition-all duration-500 ease-out-expo active:scale-[0.97]"
      >
        Back to dashboard
        <span className="btn-icon bg-midnight/10">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </Link>
    </div>
  );
}
