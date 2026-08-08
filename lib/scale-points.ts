export interface ScaledPoint {
  x: number;
  y: number;
  value: number;
}

export interface ScaleResult {
  points: ScaledPoint[];
  min: number;
  max: number;
  range: number;
}

/**
 * Pure helper: maps a numeric array to SVG-coordinate points.
 * Used by both inline sparklines and full charts to avoid duplicating
 * the min/max/range/scaling math.
 */
export function scalePoints(
  data: number[],
  width: number,
  height: number,
  padding: { top?: number; bottom?: number; left?: number; right?: number } = {}
): ScaleResult {
  const pad = { top: 0, bottom: 0, left: 0, right: 0, ...padding };
  const drawW = width - pad.left - pad.right;
  const drawH = height - pad.top - pad.bottom;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => ({
    x: data.length > 1 ? pad.left + (i / (data.length - 1)) * drawW : pad.left,
    y: pad.top + drawH - ((value - min) / range) * drawH,
    value,
  }));

  return { points, min, max, range };
}

/** Builds an SVG path `d` string from scaled points. */
export function pointsToPathD(points: ScaledPoint[]): string {
  return points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" L ");
}

/** Builds a closed SVG path `d` string (for filled areas) from scaled points. */
export function pointsToFillD(points: ScaledPoint[], height: number): string {
  const line = pointsToPathD(points);
  const last = points[points.length - 1];
  return `${line} L${last.x.toFixed(1)},${height} L${points[0].x.toFixed(1)},${height} Z`;
}
