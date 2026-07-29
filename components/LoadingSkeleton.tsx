export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 p-6" aria-busy="true">
      <div className="h-6 w-3/4 motion-safe:animate-pulse bg-surface rounded" />
      <div className="h-4 w-1/2 motion-safe:animate-pulse bg-surface rounded" />
      <div className="h-32 w-full motion-safe:animate-pulse bg-surface rounded" />
      <div className="h-4 w-2/3 motion-safe:animate-pulse bg-surface rounded" />
      <div className="h-4 w-1/3 motion-safe:animate-pulse bg-surface rounded" />
    </div>
  );
}
