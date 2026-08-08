export default function LiveIndicator() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-positive/5 border border-positive/20 text-[10px] font-mono text-positive">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-positive" />
      </span>
      LIVE
    </span>
  );
}
