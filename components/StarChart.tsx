function abbreviateNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString("en-US");
}

type StarChartProps = {
  data?: number[];
  history?: { stars: number; recorded_at?: string }[];
  period?: string;
};

export default function StarChart(props: StarChartProps) {
  const { history, period = "week" } = props;

  let values: number[];
  if (props.data) {
    values = props.data;
  } else if (history && history.length > 0) {
    const counts: Record<string, number> = { day: 3, week: 7, month: 14 };
    const n = counts[period] ?? 7;
    values = history.slice(-n).map((h) => h.stars);
  } else {
    return null;
  }

  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const W = 180, H = 32;
  const pad = { top: 2, bottom: 4, left: 32, right: 4 };
  const drawW = W - pad.left - pad.right;
  const drawH = H - pad.top - pad.bottom;

  const yPos = (v: number) => pad.top + (1 - (v - min) / range) * drawH;
  const xPos = (i: number) => values.length > 1 ? pad.left + (i / (values.length - 1)) * drawW : pad.left;

  const points = values.map((v, i) => `${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`);
  const lineD = `M${points.join(" L")}`;
  const fillD = `${lineD} L${xPos(values.length - 1).toFixed(1)},${pad.top + drawH} L${pad.left},${pad.top + drawH} Z`;

  const yLabels = [min, (min + max) / 2, max];

  const xTickCount = 5;
  const xTickIndices: number[] = [];
  if (values.length <= xTickCount) {
    for (let i = 0; i < values.length; i++) xTickIndices.push(i);
  } else {
    for (let t = 0; t < xTickCount; t++) {
      xTickIndices.push(Math.round((t / (xTickCount - 1)) * (values.length - 1)));
    }
  }

  const getXLabel = (idx: number): string => {
    if (history) {
      const entry = history[history.length - values.length + idx];
      if (entry?.recorded_at) {
        const d = new Date(entry.recorded_at);
        if (period === "week") return d.toLocaleDateString("en-US", { weekday: "short" });
        if (period === "month") return `${d.getDate()}`;
        if (period === "quarter") return `w${Math.ceil(d.getDate() / 7)}`;
        return `m${d.getMonth() + 1}`;
      }
    }
    return "";
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      role="img"
      aria-roledescription="sparkline chart"
      aria-label={`Star history: ${values.length} data points from ${values[0].toLocaleString("en-US")} to ${values[values.length - 1].toLocaleString("en-US")}`}
    >
      <title>{`Star history for the past ${period}`}</title>
      {yLabels.map((v) => (
        <line
          key={v}
          x1={pad.left}
          y1={yPos(v)}
          x2={W - pad.right}
          y2={yPos(v)}
          stroke="rgba(255,176,0,0.1)"
          strokeWidth="0.5"
        />
      ))}
      {yLabels.map((v) => (
        <text
          key={v}
          x={pad.left - 2}
          y={yPos(v) + 1.5}
          textAnchor="end"
          fill="rgba(255,176,0,0.4)"
          fontSize="6"
        >
          {abbreviateNumber(Math.round(v))}
        </text>
      ))}
      {xTickIndices.map((idx) => (
        <text
          key={idx}
          x={xPos(idx)}
          y={H - 1}
          textAnchor="middle"
          fill="rgba(255,176,0,0.3)"
          fontSize="5"
        >
          {getXLabel(idx)}
        </text>
      ))}
      {values.map((v, i) => (
        <circle key={i} cx={xPos(i)} cy={yPos(v)} r="1.5" fill="rgba(255,176,0,0.9)">
          <title>{v.toLocaleString("en-US")} stars</title>
        </circle>
      ))}
      <path d={fillD} fill="rgba(255,176,0,0.1)" />
      <path d={lineD} fill="none" stroke="rgba(255,176,0,0.9)" strokeWidth="1" />
    </svg>
  );
}