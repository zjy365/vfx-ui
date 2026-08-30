import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";

/**
 * Particle field: cell-hash particles wandering with breathing size and soft edges.
 */
export const PARTICLE_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  density: f32,
  size: f32,
  c0r: f32, c0g: f32, c0b: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

fn particleLayer(
  uv: vec2f,
  t: f32,
  cells: f32,
  density: f32,
  size: f32,
  seed: f32,
  drift: vec2f,
) -> f32 {
  let g = fract(uv + drift) * cells;
  let id = floor(g);
  let f = fract(g);

  let h1 = hash(id + vec2f(seed, seed * 1.7 + 1.9));
  let h2 = hash(id + vec2f(seed + 7.7, 3.1));
  let h3 = hash(id + vec2f(2.9, seed + 8.4));

  let exists = step(h1, clamp(density, 0.0, 1.0));

  let phase = h2 * 6.2831;
  let wob = vec2f(
    sin(t * (0.35 + 0.4 * h3) + phase),
    cos(t * (0.28 + 0.3 * h2) + phase * 1.37)
  ) * 0.2;
  let pos = vec2f(h1, h2) * 0.56 + 0.22 + wob;
  let d = length(f - pos);

  let r = max(size * (0.72 + 0.28 * sin(t * (0.7 + 0.6 * h3) + h1 * 6.2831)), 0.001);
  let core = 1.0 - smoothstep(r * 0.25, r, d);
  let glow = exp(-d * d / (r * r * 6.0)) * 0.35;
  let amp = 0.35 + 0.65 * h3;

  return exists * amp * (core + glow);
}

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;
  let pc = vec3f(p.c0r, p.c0g, p.c0b);

  var col = vec3f(0.018, 0.022, 0.038);

  let far = particleLayer(uv, t, 5.5, p.density * 0.85, p.size * 0.55, 6.2, vec2f(t * 0.010, t * 0.004));
  let near = particleLayer(uv, t, 3.2, p.density, p.size, 13.9, vec2f(-t * 0.016, t * 0.007));
  col += pc * (far * 0.5 + near);

  return vec4f(col, 1.0);
}
`;

export interface ParticleFieldProps {
  /** Fraction of grid cells that carry a particle (0..1). */
  density?: number;
  /** Animation speed multiplier for drift, wander, and breathing. */
  speed?: number;
  /** Particle radius relative to its grid cell. */
  size?: number;
  /** Particle color. */
  color?: string;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const PARTICLE_DEFAULTS = {
  density: 0.45,
  speed: 0.8,
  size: 0.16,
  color: "#9ecbff",
} as const;

export const PARTICLE_PRESETS = {
  frost: { color: "#a8d8ff", density: 0.45, size: 0.16, speed: 0.8 },
  blossom: { color: "#ffb7c5", density: 0.55, size: 0.13, speed: 0.65 },
  ember: { color: "#f5c396", density: 0.35, size: 0.2, speed: 1.0 },
} as const;

export function ParticleField({
  density = PARTICLE_DEFAULTS.density,
  speed = PARTICLE_DEFAULTS.speed,
  size = PARTICLE_DEFAULTS.size,
  color = PARTICLE_DEFAULTS.color,
  className,
  style,
  fallback,
}: ParticleFieldProps) {
  const c = hexToRgb01(color);
  return (
    <VfxCanvas
      shader={PARTICLE_SHADER}
      label="particle-field"
      className={className}
      style={style}
      fallback={fallback}
      uniforms={{
        time: 0,
        density,
        speed,
        size,
        c0r: c[0], c0g: c[1], c0b: c[2],
      }}
    />
  );
}
