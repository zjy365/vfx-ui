"use client";

import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * TerrainRidge — layered ridged-fbm mountain silhouettes in parallax drift.
 *
 * Six stacked ridgelines (ridged value noise: crests sharpened by
 * 1-|2n-1|) recede into haze; each layer scrolls at its own speed and
 * shifts with a different parallax factor, so the range reads as deep
 * terrain. A low sun haloes the sky and rims the nearest crest. The
 * pointer pans the whole valley (opt-in).
 */
export const TERRAIN_RIDGE_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  layers: f32,
  ruggedness: f32,
  c0r: f32, c0g: f32, c0b: f32,
  c1r: f32, c1g: f32, c1b: f32,
  c2r: f32, c2g: f32, c2b: f32,
  px: f32,
  py: f32,
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

fn fbm(pIn: vec2f) -> f32 {
  var v = 0.0;
  var amp = 0.5;
  var q = pIn;
  var m = 0.0;
  for (var i = 0; i < 4; i++) {
    v += amp * noise(q);
    m += amp;
    q = q * 2.05 + vec2f(9.1, 2.3);
    amp = amp * 0.5;
  }
  return v / m;
}

// Ridged 1D terrain profile: fold the fbm around 0.5 to sharpen crests,
// then square it so ridges catch light and valleys fall away.
fn ridged(x: f32, rugged: f32) -> f32 {
  let n = fbm(vec2f(x, 7.31));
  let ridge = 1.0 - abs(2.0 * n - 1.0);
  return mix(ridge, ridge * ridge, rugged);
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = vec2f(uvIn.x, 1.0 - uvIn.y); // bottom-origin, y-up
  let t = p.time * p.speed;

  let sky = vec3f(p.c0r, p.c0g, p.c0b);
  let haze = vec3f(p.c1r, p.c1g, p.c1b);
  let rock = vec3f(p.c2r, p.c2g, p.c2b);

  // Dusk sky: deeper at the zenith, warm toward the horizon.
  var col = mix(haze * 0.85, sky, smoothstep(0.18, 1.0, uv.y));
  // Low sun halo sitting on the horizon, left of center.
  let sunPos = vec2f(0.32, 0.34);
  let sd = distance(uv, sunPos);
  col += vec3f(1.0, 0.82, 0.55) * exp(-sd * sd * 16.0) * 0.5 * p.intensity;
  col += vec3f(1.0, 0.6, 0.35) * exp(-sd * sd * 2.6) * 0.18;

  // The pointer pans the valley; nearer layers move more (parallax).
  let pan = (p.px - 0.5) * 0.9;
  let lift = (0.5 - (1.0 - p.py)) * 0.02;

  // Paint far-to-near: each nearer ridgeline overwrites the ones behind it.
  var ground = col;
  var hit = 0.0;
  var rimGlow = vec3f(0.0);
  let count = clamp(p.layers, 1.0, 6.0);
  for (var i = 0; i < 6; i++) {
    if (f32(i) >= count) { break; }
    let fi = f32(i);
    let nearness = fi / max(count - 1.0, 1.0); // 0 = farthest, 1 = nearest
    let parallax = 0.10 + nearness * 0.55;     // near layers follow the pan
    let scroll = t * (0.006 + nearness * 0.02);
    let x = (uv.x + pan * parallax + scroll) * (4.0 - nearness * 2.6) + fi * 17.3;
    // Farther ridges sit higher on the frame (horizon convergence).
    let base = 0.14 + (1.0 - nearness) * 0.26 + lift;
    let amp = (0.16 + 0.08 * nearness) * p.ruggedness;
    let ridgeY = base + amp * ridged(x, p.ruggedness);

    if (uv.y < ridgeY) {
      // Distance fades each silhouette into the haze color.
      var layer = mix(rock, haze, clamp((1.0 - nearness) * 1.15, 0.0, 1.0));
      layer = layer * mix(0.9, 1.05, nearness);
      ground = layer;
      hit = 1.0;
      // Sun rims the crest of the nearest wall we are inside of.
      rimGlow = vec3f(1.0, 0.72, 0.45) * exp(-(ridgeY - uv.y) * 26.0) * nearness * 0.55 * p.intensity;
    }
  }
  col = mix(col, ground, hit);

  // Thin clouds strung across the upper sky.
  let cl = fbm(vec2f(uv.x * 2.4 + t * 0.01, uv.y * 9.0));
  col += vec3f(0.9, 0.75, 0.7) * smoothstep(0.62, 0.9, cl) * smoothstep(0.45, 0.85, uv.y) * 0.10;

  // A few early stars in the darkening zenith.
  let sg = floor(uvIn * 140.0);
  let sh = hash21(sg);
  if (sh > 0.998 && uv.y > 0.55) {
    let stw = 0.5 + 0.5 * sin(t * 2.0 + sh * 40.0);
    let sdd = length(fract(uvIn * 140.0) - vec2f(0.5)) * 2.0;
    col += vec3f(1.0, 0.98, 0.92) * exp(-sdd * sdd * 9.0) * stw * smoothstep(0.55, 0.9, uv.y) * 0.5;
  }
  col += rimGlow;

  // Vignette + dither.
  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.3 * dot(v, v) * 2.2;
  col += vec3f((hash21(uvIn * 571.1 + t) - 0.5) / 255.0 * 1.5);
  return vec4f(col, 1.0);
}
`;

export interface TerrainRidgeProps {
  /** Animation speed multiplier (parallax scroll rate). */
  speed?: number;
  /** Overall brightness of the sun, rims and sky. */
  intensity?: number;
  /** Number of stacked ridgelines (1-6). */
  layers?: number;
  /** Crest sharpness and height variance — higher means craggier peaks. */
  ruggedness?: number;
  /** Zenith sky color. */
  from?: string;
  /** Horizon haze color — distant ridges dissolve into it. */
  to?: string;
  /** Foreground rock color (nearest ridge). */
  accent?: string;
  /**
   * When true, the pointer pans the valley with per-layer parallax.
   * Off by default — the terrain scrolls on its own.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const TERRAIN_RIDGE_DEFAULTS = {
  speed: 1,
  intensity: 1,
  layers: 5,
  ruggedness: 0.8,
  from: "#1b2a4a",
  to: "#e8956b",
  accent: "#141a2e",
} as const;

export const TERRAIN_RIDGE_PRESETS = {
  dusk: { speed: 1, intensity: 1, layers: 5, ruggedness: 0.8, from: "#1b2a4a", to: "#e8956b", accent: "#141a2e" },
  dawn: { speed: 1.1, intensity: 1.05, layers: 5, ruggedness: 0.7, from: "#28345f", to: "#f2b8a0", accent: "#232c49" },
  alpine: { speed: 0.85, intensity: 0.95, layers: 6, ruggedness: 1, from: "#0e1a33", to: "#9db6d9", accent: "#0b1226" },
} as const;

export function TerrainRidge({
  speed = TERRAIN_RIDGE_DEFAULTS.speed,
  intensity = TERRAIN_RIDGE_DEFAULTS.intensity,
  layers = TERRAIN_RIDGE_DEFAULTS.layers,
  ruggedness = TERRAIN_RIDGE_DEFAULTS.ruggedness,
  from = TERRAIN_RIDGE_DEFAULTS.from,
  to = TERRAIN_RIDGE_DEFAULTS.to,
  accent = TERRAIN_RIDGE_DEFAULTS.accent,
  interactive = false,
  className,
  style,
  fallback,
}: TerrainRidgeProps) {
  const a = hexToRgb01(from);
  const b = hexToRgb01(to);
  const c = hexToRgb01(accent);
  const [wrapRef, pointer] = usePointerUniforms<HTMLDivElement>({ enabled: interactive });
  const ptr = interactive ? pointer : POINTER_REST;
  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={TERRAIN_RIDGE_SHADER}
        label="terrain-ridge"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          layers,
          ruggedness,
          c0r: a[0], c0g: a[1], c0b: a[2],
          c1r: b[0], c1g: b[1], c1b: b[2],
          c2r: c[0], c2g: c[1], c2b: c[2],
          px: ptr.x,
          py: ptr.y,
        }}
      />
    </div>
  );
}
