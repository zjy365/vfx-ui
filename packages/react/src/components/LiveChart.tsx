import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";

const MAX_POINTS = 64;

/** Built-in wave shown when no data is supplied (docs/catalog previews). */
const DEMO_SERIES: number[] = Array.from({ length: 48 }, (_, i) =>
  Math.min(1, Math.max(0, 0.5 + 0.3 * Math.sin(i * 0.35) + 0.1 * Math.sin(i * 0.9))),
);

/**
 * LiveChart — real-time GPU line chart. Data flows through a uniform
 * array (one vec4 per point); the fragment shader builds an analytic
 * distance field to the polyline for anti-aliased stroke + glow + fill.
 * No textures, no DOM measurement — fully GPU-composited.
 */
export const LIVE_CHART_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  count: f32,
  lineWidth: f32,
  glow: f32,
  fill: f32,
  cr: f32, cg: f32, cb: f32,
  er: f32, eg: f32, eb: f32,
}
@group(0) @binding(0) var<uniform> params: Params;
@group(0) @binding(1) var<uniform> pts: array<vec4f, ${MAX_POINTS}>;

fn segmentDistance(p: vec2f, a: vec2f, b: vec2f) -> vec2f {
  let ab = b - a;
  let t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  return vec2f(length(p - (a + t * ab)), t);
}

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = params;
  let n = i32(clamp(p.count, 2.0, ${MAX_POINTS - 1}.0));

  // Chart space: x 0..1 across the panel, y 0..1 bottom-up with margins.
  let cs = vec2f(uv.x, 1.0 - uv.y);
  var d = 1e6;
  var nearestY = 0.0;
  for (var i: i32 = 0; i < ${MAX_POINTS - 1}; i = i + 1) {
    if (i >= n - 1) { break; }
    let x0 = f32(i) / f32(n - 1);
    let x1 = f32(i + 1) / f32(n - 1);
    // Aspect correction so the stroke width is isotropic on screen.
    let a = vec2f(x0, pts[i].y);
    let b = vec2f(x1, pts[i + 1].y);
    let dr = segmentDistance(cs * vec2f(1.0, 1.125), a * vec2f(1.0, 1.125), b * vec2f(1.0, 1.125));
    if (dr.x < d) { d = dr.x; nearestY = mix(a.y, b.y, dr.y); }
  }

  let lineMask = 1.0 - smoothstep(p.lineWidth * 0.6, p.lineWidth, d);
  let glowMask = (1.0 - smoothstep(p.lineWidth, p.lineWidth * 8.0, d)) * p.glow;
  // Area fill: bright right under the line, fading out downward.
  let below = nearestY - cs.y;
  let fillMask = smoothstep(0.0, 0.05, below) * p.fill;
  let fillFade = 1.0 - smoothstep(0.05, 0.45, below);

  var col = vec3f(p.er, p.eg, p.eb) * glowMask + vec3f(p.cr, p.cg, p.cb) * lineMask;
  col += vec3f(p.cr, p.cg, p.cb) * fillMask * fillFade * 1.4;
  let alpha = clamp(lineMask + glowMask + fillMask * fillFade * 0.55, 0.0, 1.0);
  return vec4f(col, alpha);
}
`;

export interface LiveChartProps {
  /** Series values in 0..1, rendered left-to-right. Truncated to 64 points.
   *  Omit to show a built-in demo wave (catalog previews rely on this). */
  data?: number[];
  /** Stroke half-width in normalized units. */
  lineWidth?: number;
  /** Glow strength (0 = off). */
  glow?: number;
  /** Area fill strength under the line (0 = off). */
  fill?: number;
  /** Stroke color. */
  color?: string;
  /** Glow color. */
  accent?: string;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export function LiveChart({
  data = DEMO_SERIES,
  lineWidth = 0.006,
  glow = 0.4,
  fill = 0.6,
  color = "#38bdf8",
  accent = "#7dd3fc",
  className,
  style,
  fallback,
}: LiveChartProps) {
  const c = hexToRgb01(color);
  const e = hexToRgb01(accent);
  const series = data.slice(0, MAX_POINTS);
  const points: number[][] = [];
  for (let i = 0; i < MAX_POINTS; i++) {
    const v = series[Math.min(i, Math.max(series.length - 1, 0))] ?? 0;
    points.push([v, v, 0, 0]);
  }
  // pts[i].y carries the value; x is derived from index in the shader.
  const uniforms = {
    time: 0,
    count: series.length,
    lineWidth,
    glow,
    fill,
    cr: c[0], cg: c[1], cb: c[2],
    er: e[0], eg: e[1], eb: e[2],
  };
  return (
    <VfxCanvas
      shader={LIVE_CHART_SHADER}
      label="live-chart"
      className={className}
      style={style}
      fallback={fallback}
      uniforms={{ ...uniforms, pts: points }}
    />
  );
}

export const LIVE_CHART_PRESETS = {
  signal: { color: "#34d399", accent: "#a7f3d0", glow: 0.5, fill: 0.5 },
  plasma: { color: "#f472b6", accent: "#fbcfe8", glow: 0.7, fill: 0.7 },
  minimal: { color: "#94a3b8", accent: "#e2e8f0", glow: 0.15, fill: 0.2, lineWidth: 0.004 },
} as const;
