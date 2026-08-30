import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";

/**
 * Deep-space starfield: hashed grid stars twinkling over slow parallax drift.
 */
export const STARFIELD_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  density: f32,
  twinkle: f32,
  c0r: f32, c0g: f32, c0b: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

fn starLayer(
  uv: vec2f,
  t: f32,
  cells: f32,
  density: f32,
  twinkle: f32,
  seed: f32,
  drift: vec2f,
) -> f32 {
  let g = fract(uv + drift) * cells;
  let id = floor(g);
  let f = fract(g);

  let h1 = hash(id + vec2f(seed, seed * 1.31 + 0.7));
  let h2 = hash(id + vec2f(seed + 5.2, 3.7));
  let h3 = hash(id + vec2f(9.1, seed + 2.3));

  let exists = step(h1, clamp(density, 0.0, 1.0));
  let pos = vec2f(h2, h3) * 0.7 + 0.15;
  let d = length(f - pos);

  let tw = 0.55 + 0.45 * sin(t * (1.2 + 2.2 * h1) + h2 * 6.2831);
  let amp = mix(1.0, tw, twinkle) * (0.45 + 0.55 * h3);

  return exists * amp * (exp(-d * d * 70.0) + 0.12 * exp(-d * d * 7.0));
}

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;
  let star = vec3f(p.c0r, p.c0g, p.c0b);

  var col = vec3f(0.010, 0.014, 0.030);

  let far = starLayer(uv, t, 7.5, p.density * 0.8, p.twinkle, 3.7, vec2f(t * 0.012, t * 0.005));
  let near = starLayer(uv, t, 4.5, p.density, p.twinkle, 11.3, vec2f(t * 0.024, -t * 0.009));
  col += star * (far * 0.55 + near);

  // Faint milky-way style haze so the void is never flat black.
  col += star * 0.016 * (0.5 + 0.5 * sin(uv.x * 3.1 + t * 0.05) * sin(uv.y * 2.3 - t * 0.04));

  return vec4f(col, 1.0);
}
`;

export interface StarfieldProps {
  /** Fraction of grid cells that carry a star (0..1). */
  density?: number;
  /** Animation speed multiplier for drift and twinkle. */
  speed?: number;
  /** Twinkle strength (0 = steady, 1 = full pulse). */
  twinkle?: number;
  /** Star color. */
  color?: string;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const STARFIELD_DEFAULTS = {
  density: 0.35,
  speed: 1,
  twinkle: 0.8,
  color: "#cfe4ff",
} as const;

export const STARFIELD_PRESETS = {
  midnight: { color: "#d6e4ff", density: 0.4, twinkle: 0.85, speed: 1 },
  golden: { color: "#ffe3b8", density: 0.28, twinkle: 0.6, speed: 0.8 },
  nebula: { color: "#e0c3fc", density: 0.5, twinkle: 1.0, speed: 1.2 },
} as const;

export function Starfield({
  density = STARFIELD_DEFAULTS.density,
  speed = STARFIELD_DEFAULTS.speed,
  twinkle = STARFIELD_DEFAULTS.twinkle,
  color = STARFIELD_DEFAULTS.color,
  className,
  style,
  fallback,
}: StarfieldProps) {
  const c = hexToRgb01(color);
  return (
    <VfxCanvas
      shader={STARFIELD_SHADER}
      label="starfield"
      className={className}
      style={style}
      fallback={fallback}
      uniforms={{
        time: 0,
        density,
        speed,
        twinkle,
        c0r: c[0], c0g: c[1], c0b: c[2],
      }}
    />
  );
}
