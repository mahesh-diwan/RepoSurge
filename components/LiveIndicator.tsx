export default function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-positive/5 border border-positive/20 text-[10px] font-mono text-positive">
      <span className="relative flex h-2 w-2">
        <span className="inline-flex rounded-full h-2 w-2 bg-positive animate-gentle-pulse" />
      </span>
      LIVE
    </span>
  );
}
