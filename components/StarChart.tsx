export default function StarChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div
      className="flex items-end h-6 gap-[1px]"
      aria-label="star history"
      role="img"
      aria-roledescription="sparkline chart"
    >
      {data.map((value, i) => {
        const height = `${Math.max(6, ((value - min) / range) * 100)}%`;
        return (
          <div
            key={i}
            className="w-[3px] bg-terminal/60 hover:bg-terminal transition-colors relative group/bar cursor-pointer"
            style={{ height }}
          >
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-bone bg-midnight border border-[#333] px-1 py-0.5 whitespace-nowrap opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none z-10 font-mono tabular-nums">
              {value.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
}
