import { scalePoints, pointsToPathD, pointsToFillD } from "@/lib/scale-points";

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

  const W = 180;
  const H = 32;
  const pad = { top: 2, bottom: 4, left: 32, right: 4 };

  const { points, min, max, range } = scalePoints(values, W, H, pad);
  const lineD = "M " + pointsToPathD(points);
  const fillD = pointsToFillD(points, H);

  const drawH = H - pad.top - pad.bottom;
  const yPos = (v: number) => pad.top + drawH - ((v - min) / range) * drawH;

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
      <defs>
        <linearGradient id={`grad-${period}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(91,127,255,0.3)" />
          <stop offset="100%" stopColor="rgba(91,127,255,0)" />
        </linearGradient>
      </defs>
      <title>{`Star history for the past ${period}`}</title>
      {yLabels.map((v) => (
        <line
          key={v}
          x1={pad.left}
          y1={yPos(v)}
          x2={W - pad.right}
          y2={yPos(v)}
          stroke="rgba(91,127,255,0.06)"
          strokeWidth="0.5"
        />
      ))}
      {yLabels.map((v) => (
        <text
          key={v}
          x={pad.left - 2}
          y={yPos(v) + 1.5}
          textAnchor="end"
          fill="rgba(91,127,255,0.3)"
          fontSize="6"
        >
          {abbreviateNumber(Math.round(v))}
        </text>
      ))}
      {xTickIndices.map((idx) => (
        <text
          key={idx}
          x={points[idx]?.x ?? 0}
          y={H - 1}
          textAnchor="middle"
          fill="rgba(91,127,255,0.2)"
          fontSize="5"
        >
          {getXLabel(idx)}
        </text>
      ))}
      {values.map((v, i) => (
        <circle key={i} cx={points[i].x} cy={points[i].y} r="1.2" fill="rgba(91,127,255,0.8)" />
      ))}
      <path d={fillD} fill={`url(#grad-${period})`} />
      <path d={lineD} fill="none" stroke="rgba(91,127,255,0.8)" strokeWidth="1" />
    </svg>
  );
}
