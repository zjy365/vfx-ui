import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

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
  px: f32,
  py: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash21(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

fn hash31(p: vec3f) -> f32 {
  return fract(sin(dot(p, vec3f(127.1, 311.7, 74.7))) * 43758.5453);
}

fn noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  let a = hash21(i);
  let b = hash21(i + vec2f(1.0, 0.0));
  let c = hash21(i + vec2f(0.0, 1.0));
  let d = hash21(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

/// Flow field the particles ride on: two-octave curl-ish drift.
fn flow(p: vec2f, t: f32) -> vec2f {
  let e = noise(p * 1.4 + vec2f(t * 0.22, -t * 0.13));
  let g = noise(p * 1.4 + vec2f(7.3 - t * 0.15, 2.9 + t * 0.17));
  return vec2f(e, g) - vec2f(0.5);
}

/// One depth layer of drifting soft particles. Each pixel accumulates the
/// 3x3 neighborhood of cells so a particle's halo is never clipped by its
/// cell border into a square blob (the old edgeFade shortcut's failure).
fn particleCell(
  f: vec2f,
  id: vec2f,
  t: f32,
  density: f32,
  size: f32,
  seed: f32,
  drift: f32,
  base: vec3f,
  twinkleK: f32,
) -> vec3f {
  let h1 = hash21(id + vec2f(seed, seed * 0.73 + 1.1));
  let h2 = hash21(id + vec2f(seed + 4.3, 9.2));
  let h3 = hash21(id + vec2f(2.6, seed + 5.8));
  let h4 = hash31(vec3f(id, seed));

  let exists = step(1.0 - clamp(density, 0.0, 1.0), h1);
  if (exists < 0.5) { return vec3f(0.0); }

  // Per-particle wander: each drifts along the flow field with its own phase.
  let wander = flow(id * 0.11 + h2 * 3.0, t) * 0.22;
  let pos = vec2f(h2, h3) * 0.66 + 0.17 + wander;
  let d = length(f - pos);

  // Breathing size + per-particle phase twinkle.
  let breathe = 0.75 + 0.25 * sin(t * (0.5 + h3) + h2 * 6.2831);
  let dotR = clamp(size * (0.35 + 0.3 * h4) * breathe, 0.04, 0.24);
  let core = exp(-d * d / max(dotR * dotR * 2.2, 1e-5));
  let halo = exp(-d * d / max(dotR * dotR * 7.0, 1e-5)) * 0.14;

  let fade = smoothstep(0.0, 0.15, h2) * smoothstep(1.0, 0.85, h2);
  let tw = mix(1.0, 0.6 + 0.4 * sin(t * 1.3 + h2 * 6.2831), twinkleK);
  return fade * tw * base * (core + halo) * (0.3 + 0.45 * h1);
}

fn particleLayer(
  uv: vec2f,
  t: f32,
  cells: f32,
  density: f32,
  size: f32,
  seed: f32,
  drift: f32,
  base: vec3f,
  twinkleK: f32,
  ptrOff: vec2f,
) -> vec3f {
  let g = fract(uv * 1.0 + vec2f(drift * 0.6, -drift) - ptrOff) * cells;
  let id = floor(g);
  let f = fract(g);

  var col = vec3f(0.0);
  for (var oy = -1.0; oy <= 1.0; oy += 1.0) {
    for (var ox = -1.0; ox <= 1.0; ox += 1.0) {
      let off = vec2f(ox, oy);
      col += particleCell(f - off, id + off, t, density, size, seed, drift, base, twinkleK);
    }
  }
  return col;
}

fn dither(uv: vec2f) -> f32 {
  return (hash21(uv * 517.3) - 0.5) / 255.0 * 1.5;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;
  let base = vec3f(p.c0r, p.c0g, p.c0b);

  // Depth: far dust motes, mid field, near bokeh orbs — three drift rates.
  // The pointer adds a viewpoint offset; near layers shift most.
  let ptr = vec2f(p.px, p.py) - 0.5;
  var col = mix(vec3f(0.016, 0.022, 0.04), vec3f(0.035, 0.045, 0.075), uvIn.y);
  col += base * 0.012 * noise(uvIn * 3.0 + vec2f(t * 0.05));

  let far = particleLayer(uvIn, t, 30.0, p.density * 1.7, p.size * 0.55, 3.1, t * 0.02, base, 0.5, ptr * 0.012);
  let mid = particleLayer(uvIn, t, 15.0, p.density, p.size, 11.7, t * 0.045, base, 0.25, ptr * 0.03);
  let near = particleLayer(uvIn, t, 7.5, p.density * 0.5, p.size * 2.1, 27.3, t * 0.075, base, 0.1, ptr * 0.06);

  col += far * 0.35 + mid * 0.7 + near * 0.95;

  // Faint glow pooling where particles cluster.
  let cluster = noise(uvIn * 2.2 + flow(uvIn * 1.1, t) * 1.4 + vec2f(t * 0.03));
  col += base * 0.05 * pow(cluster, 3.0);

  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.32 * dot(v, v) * 2.2;
  col += vec3f(dither(uvIn));
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
  /** When true, particle layers parallax-shift against the pointer. */
  interactive?: boolean;
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
  interactive = false,
  className,
  style,
  fallback,
}: ParticleFieldProps) {
  const c = hexToRgb01(color);
  const [wrapRef, pointer] = usePointerUniforms<HTMLDivElement>();
  const ptr = interactive ? pointer : POINTER_REST;
  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={PARTICLE_SHADER}
        label="particle-field"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          density,
          speed,
          size,
          c0r: c[0], c0g: c[1], c0b: c[2],
          px: ptr.x,
          py: ptr.y,
        }}
      />
    </div>
  );
}
