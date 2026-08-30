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

fn hash21(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
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

fn fbm(p: vec2f) -> f32 {
  var v = 0.0;
  var amp = 0.5;
  var q = p;
  var m = 0.0;
  for (var i = 0; i < 4; i++) {
    v += amp * noise(q);
    m += amp;
    q = q * 2.11 + vec2f(4.4, 9.1);
    amp = amp * 0.5;
  }
  return v / m;
}

/// Stellar temperature: most stars cool white-blue, a few warm orange.
fn starColor(seed: f32, base: vec3f) -> vec3f {
  let warm = vec3f(1.0, 0.78, 0.55);
  let neutral = vec3f(1.0, 0.97, 0.92);
  let cold = vec3f(0.72, 0.82, 1.0);
  var col = base;
  if (seed < 0.12) {
    col = warm;
  } else if (seed < 0.55) {
    col = neutral;
  } else {
    col = cold;
  }
  return mix(vec3f(1.0), col, 0.55);
}

/// One parallax layer of hashed stars. Returns (rgb premult by intensity).
fn starLayer(
  uv: vec2f,
  t: f32,
  cells: f32,
  density: f32,
  twinkle: f32,
  seed: f32,
  drift: vec2f,
  sizeK: f32,
  base: vec3f,
) -> vec3f {
  let g = fract(uv + drift) * cells;
  let id = floor(g);
  let f = fract(g);

  let h1 = hash21(id + vec2f(seed, seed * 1.31 + 0.7));
  let h2 = hash21(id + vec2f(seed + 5.2, 3.7));
  let h3 = hash21(id + vec2f(9.1, seed + 2.3));
  let h4 = hash21(id + vec2f(seed + 1.9, 7.7));

  let exists = step(1.0 - clamp(density, 0.0, 1.0), h1);
  let pos = vec2f(h2, h3) * 0.72 + 0.14;
  let d = length(f - pos);

  // Only a fraction of stars pulse; the rest hold steady.
  let pulsing = step(h4, twinkle);
  let tw = mix(1.0, 0.5 + 0.5 * sin(t * (0.9 + 2.4 * h1) + h2 * 6.2831), pulsing * 0.9);
  let mag = 0.5 + 0.5 * h3 * h3; // magnitude: few bright, many faint
  let core = exp(-d * d * sizeK);
  let halo = 0.09 * exp(-d * d * sizeK * 0.55);
  let tint = starColor(h2, base);
  return exists * mag * tw * tint * (core + halo);
}

fn dither(uv: vec2f) -> f32 {
  return (hash21(uv * 733.1) - 0.5) / 255.0 * 1.5;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;
  let base = vec3f(p.c0r, p.c0g, p.c0b);

  // Milky-way band: a diagonal fbm haze that lifts star density inside it.
  let bandQ = mat2x2f(0.62, -0.78, 0.78, 0.62) * (uvIn - vec2f(0.42, 0.55));
  let band = exp(-bandQ.x * bandQ.x * 7.0);
  let haze = fbm(bandQ * 3.1 + vec2f(t * 0.008, 0.0));
  let milkyWay = band * (0.22 + 0.5 * haze);

  // Deep-space gradient, never pure black; nebula tint inside the band.
  var col = mix(vec3f(0.012, 0.016, 0.034), vec3f(0.03, 0.034, 0.06), uvIn.y);
  col += base * milkyWay * 0.10;
  col += vec3f(0.05, 0.04, 0.09) * band * haze * 0.35;

  // Three parallax layers: far dust, mid field, near bright stars.
  let far = starLayer(uvIn, t, 26.0, p.density * 1.6 + band * 0.25, p.twinkle * 0.7, 3.7, vec2f(t * 0.010, t * 0.004), 240.0, base);
  let mid = starLayer(uvIn, t, 13.0, p.density * 0.9 + band * 0.18, p.twinkle, 11.3, vec2f(t * 0.02, -t * 0.008), 120.0, base);
  let near = starLayer(uvIn, t, 6.5, p.density * 0.45, p.twinkle * 0.85, 27.9, vec2f(t * 0.034, t * 0.012), 70.0, base);

  col += far * 0.35;
  col += mid * 0.7;
  col += near * 1.15;

  // Vignette keeps corners quiet; dither kills 8-bit banding in the gradient.
  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.3 * dot(v, v) * 2.2;
  col += vec3f(dither(uvIn));
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
