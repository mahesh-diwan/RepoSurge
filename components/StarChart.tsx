export default function StarChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div
      className="flex items-end h-6 gap-px"
      aria-label="star history"
      role="img"
      aria-roledescription="sparkline chart"
    >
      {data.map((value, i) => {
        const height = `${Math.max(10, ((value - min) / range) * 100)}%`;
        const prev = i > 0 ? data[i - 1] : value;
        const color =
          value > prev
            ? "bg-electric"
            : value < prev
              ? "bg-red-500"
              : "bg-bone/30";
        return (
          <div
            key={i}
            className={`w-1.5 ${color}`}
            style={{ height }}
            title={String(value)}
          />
        );
      })}
    </div>
  );
}
