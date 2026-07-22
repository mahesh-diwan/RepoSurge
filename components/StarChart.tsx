export default function StarChart({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div
      className="flex items-end h-8 gap-[2px]"
      aria-label="star history"
      role="img"
      aria-roledescription="sparkline chart"
    >
      {data.map((value, i) => {
        const height = `${Math.max(8, ((value - min) / range) * 100)}%`;
        const prev = i > 0 ? data[i - 1] : value;
        const isUp = value > prev;
        const isDown = value < prev;

        return (
          <div
            key={i}
            className="w-1 rounded-full transition-all duration-700"
            style={{
              height,
              background: isUp
                ? "linear-gradient(to top, #0066ff, #0066ffcc)"
                : isDown
                  ? "linear-gradient(to top, #ef4444, #ef4444cc)"
                  : "linear-gradient(to top, rgba(245,245,240,0.15), rgba(245,245,240,0.3))",
              transitionTimingFunction: "cubic-bezier(0.32, 0.72, 0, 1)",
            }}
            title={String(value)}
          />
        );
      })}
    </div>
  );
}
