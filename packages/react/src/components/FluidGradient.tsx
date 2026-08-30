import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";

/**
 * Domain-warped fbm noise blending a three-stop gradient into slow liquid motion.
 */
export const FLUID_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  warp: f32,
  scale: f32,
  c0r: f32, c0g: f32, c0b: f32,
  c1r: f32, c1g: f32, c1b: f32,
  c2r: f32, c2g: f32, c2b: f32,
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
    q = q * 2.02 + vec2f(7.3, 3.1);
    amp = amp * 0.5;
  }
  return v;
}

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;

  let p0 = uv * p.scale;
  let q = vec2f(
    fbm(p0 + vec2f(0.0, 0.0) + t * 0.07),
    fbm(p0 + vec2f(5.2, 1.3) - t * 0.05)
  );
  let r = vec2f(
    fbm(p0 + p.warp * q + vec2f(1.7, 9.2) + t * 0.09),
    fbm(p0 + p.warp * q + vec2f(8.3, 2.8) - t * 0.06)
  );
  let f = fbm(p0 + p.warp * r);

  let cA = vec3f(p.c0r, p.c0g, p.c0b);
  let cB = vec3f(p.c1r, p.c1g, p.c1b);
  let cC = vec3f(p.c2r, p.c2g, p.c2b);

  var col = mix(cA, cB, smoothstep(0.18, 0.72, f));
  col = mix(col, cC, smoothstep(0.55, 0.95, f) * 0.85);

  // Gentle luminance shaping: lifted midtones, soft vignette.
  col = col * (0.88 + 0.24 * f);
  let d = uv - vec2f(0.5, 0.5);
  col = col * (1.0 - 0.28 * dot(d, d));

  return vec4f(col, 1.0);
}
`;

export interface FluidGradientProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Strength of the domain-warp turbulence. */
  warp?: number;
  /** Noise frequency; lower is broader and softer. */
  scale?: number;
  /** Dark base gradient stop. */
  from?: string;
  /** Mid gradient stop. */
  to?: string;
  /** Highlight gradient stop. */
  accent?: string;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const FLUID_DEFAULTS = {
  speed: 0.55,
  warp: 2.4,
  scale: 1.6,
  from: "#0b1220",
  to: "#1e4a5f",
  accent: "#7fb8c9",
} as const;

export const FLUID_PRESETS = {
  sunset: { from: "#355c7d", to: "#6c5b7b", accent: "#c06c84", speed: 0.5, warp: 2.6, scale: 1.5 },
  ocean: { from: "#062a30", to: "#0b5563", accent: "#3fb8af", speed: 0.6, warp: 2.2, scale: 1.7 },
  ember: { from: "#1b0f0f", to: "#6e3226", accent: "#e0a458", speed: 0.45, warp: 2.8, scale: 1.4 },
} as const;

export function FluidGradient({
  speed = FLUID_DEFAULTS.speed,
  warp = FLUID_DEFAULTS.warp,
  scale = FLUID_DEFAULTS.scale,
  from = FLUID_DEFAULTS.from,
  to = FLUID_DEFAULTS.to,
  accent = FLUID_DEFAULTS.accent,
  className,
  style,
  fallback,
}: FluidGradientProps) {
  const a = hexToRgb01(from);
  const b = hexToRgb01(to);
  const c = hexToRgb01(accent);
  return (
    <VfxCanvas
      shader={FLUID_SHADER}
      label="fluid-gradient"
      className={className}
      style={style}
      fallback={fallback}
      uniforms={{
        time: 0,
        speed,
        warp,
        scale,
        c0r: a[0], c0g: a[1], c0b: a[2],
        c1r: b[0], c1g: b[1], c1b: b[2],
        c2r: c[0], c2g: c[1], c2b: c[2],
      }}
    />
  );
}
