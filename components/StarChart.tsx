export default function StarChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const gap = data.length > 10 ? "1px" : data.length > 5 ? "2px" : "3px";

  return (
    <div
      className="flex items-end h-6"
      style={{ gap }}
      aria-label="star history"
      role="img"
      aria-roledescription="sparkline chart"
    >
      {data.map((value, i) => {
        const height = `${Math.max(8, ((value - min) / range) * 100)}%`;
        return (
          <div
            key={i}
            className="w-[3px] bg-terminal/70 rounded-[1px]"
            style={{ height }}
            title={String(value)}
          />
        );
      })}
    </div>
  );
}
