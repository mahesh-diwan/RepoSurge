type StarChartProps = {
  data?: number[];
  history?: { stars: number; recorded_at?: string }[];
  period?: string;
};

export default function StarChart(props: StarChartProps) {
  const data = props.history
    ? props.history.map((h) => h.stars)
    : (props.data ?? []);

  if (!data || data.length === 0) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div
      className="flex items-end h-full w-full gap-[1px]"
      role="img"
      aria-roledescription="sparkline chart"
      aria-label={`Star count history: ${data.length} data points from ${data[0].toLocaleString("en-US")} to ${data[data.length - 1].toLocaleString("en-US")}`}
      title={`Star history: ${data.length} data points across this period`}
    >
      {data.map((value, i) => {
        const height = `${Math.max(4, ((value - min) / range) * 100)}%`;
        return (
          <div
            key={i}
            className="bg-gradient-to-t from-amber-primary/20 to-amber-primary/70 rounded-[1px] group-hover:bg-amber-primary transition-all duration-200"
            style={{ height, width: `${100 / data.length}%` }}
            aria-label={`${value.toLocaleString("en-US")} stars`}
          />
        );
      })}
    </div>
  );
}
