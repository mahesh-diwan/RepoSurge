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
            className="w-[3px] bg-terminal/60"
            style={{ height }}
            title={String(value)}
          />
        );
      })}
    </div>
  );
}
