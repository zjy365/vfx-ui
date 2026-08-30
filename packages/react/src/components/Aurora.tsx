import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";

/**
 * Aurora curtains: fbm-perturbed Gaussian light bands drifting over a dark sky.
 */
export const AURORA_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  bands: f32,
  c0r: f32, c0g: f32, c0b: f32,
  c1r: f32, c1g: f32, c1b: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

fn noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash(i);
  let b = hash(i + vec2f(1.0, 0.0));
  let c = hash(i + vec2f(0.0, 1.0));
  let d = hash(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(p: vec2f) -> f32 {
  var v = 0.0;
  var amp = 0.5;
  var q = p;
  for (var i = 0; i < 4; i++) {
    v += amp * noise(q);
    q = q * 2.02 + vec2f(4.7, 9.3);
    amp = amp * 0.5;
  }
  return v;
}

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;
  let c0 = vec3f(p.c0r, p.c0g, p.c0b);
  let c1 = vec3f(p.c1r, p.c1g, p.c1b);

  // Night sky: near-black base, faint color lift near the top edge.
  var col = vec3f(0.014, 0.02, 0.042);
  col += c0 * pow(1.0 - uv.y, 3.5) * 0.10;
  col += c1 * pow(1.0 - uv.y, 5.0) * 0.05;

  let count = clamp(p.bands, 1.0, 5.0);
  var aurora = vec3f(0.0);

  for (var i = 0; i < 5; i++) {
    let fi = f32(i);
    let weight = clamp(count - fi, 0.0, 1.0);
    if (weight <= 0.0) { continue; }

    let n = fbm(vec2f(uv.x * 1.7 + fi * 4.31, uv.y * 0.9 - t * (0.14 + 0.05 * fi)));
    let sway = sin(t * (0.28 + 0.11 * fi) + fi * 2.13) * 0.20;
    let center = 0.22 + 0.16 * fi + sway + (n - 0.5) * 0.55;

    let d = uv.x - center;
    let w = 0.05 + 0.022 * fi;
    let g = exp(-d * d / (2.0 * w * w));

    // Vertical curtain streaks and bottom fade (uv.y = 0 is the top).
    let rays = 0.65 + 0.7 * noise(vec2f(uv.x * 26.0 + fi * 11.0, t * 0.35 + fi * 3.0));
    let fade = smoothstep(1.0, 0.12, uv.y) * (0.55 + 0.45 * n);

    let mixCol = clamp(0.22 + 0.5 * n + 0.22 * sin(fi * 1.71 + t * 0.21), 0.0, 1.0);
    aurora += mix(c0, c1, mixCol) * g * rays * fade * weight;
  }

  col += aurora * p.intensity * 0.85;

  // Soft ground shadow at the bottom for depth.
  col = col * mix(0.55, 1.0, smoothstep(0.0, 0.9, 1.0 - uv.y));

  return vec4f(col, 1.0);
}
`;

export interface AuroraProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Overall brightness of the curtains. */
  intensity?: number;
  /** Number of visible bands (1-5). */
  bands?: number;
  /** Dominant curtain color. */
  primary?: string;
  /** Secondary curtain color, mixed per band. */
  secondary?: string;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const AURORA_DEFAULTS = {
  speed: 0.7,
  intensity: 0.85,
  bands: 3,
  primary: "#2dd4bf",
  secondary: "#818cf8",
} as const;

export const AURORA_PRESETS = {
  emerald: { primary: "#34d399", secondary: "#60a5fa", speed: 0.65, intensity: 0.9, bands: 3 },
  violet: { primary: "#a78bfa", secondary: "#f472b6", speed: 0.55, intensity: 0.8, bands: 4 },
  arctic: { primary: "#7dd3fc", secondary: "#c4b5fd", speed: 0.8, intensity: 0.75, bands: 2 },
} as const;

export function Aurora({
  speed = AURORA_DEFAULTS.speed,
  intensity = AURORA_DEFAULTS.intensity,
  bands = AURORA_DEFAULTS.bands,
  primary = AURORA_DEFAULTS.primary,
  secondary = AURORA_DEFAULTS.secondary,
  className,
  style,
  fallback,
}: AuroraProps) {
  const a = hexToRgb01(primary);
  const b = hexToRgb01(secondary);
  return (
    <VfxCanvas
      shader={AURORA_SHADER}
      label="aurora"
      className={className}
      style={style}
      fallback={fallback}
      uniforms={{
        time: 0,
        speed,
        intensity,
        bands,
        c0r: a[0], c0g: a[1], c0b: a[2],
        c1r: b[0], c1g: b[1], c1b: b[2],
      }}
    />
  );
}
