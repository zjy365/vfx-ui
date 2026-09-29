"use client";

import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * HaloRings — concentric light rings breathing outward with chromatic dispersion.
 *
 * Rings are emitted from a luminous core and expand in staggered phases,
 * each fading as it grows. Every ring is sampled at three slightly different
 * radii for R/G/B, so the band edges split into spectral fringes like light
 * through a prism. The pointer gently drifts the halo center (opt-in).
 */
export const HALO_RINGS_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  rings: f32,
  dispersion: f32,
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

// One expanding ring's radial profile at radius r: a Gaussian band whose
// width grows with the ring's age, enveloped by a sine window so rings are
// born at the core and dissolve at the rim.
fn ringProfile(r: f32, phase: f32) -> f32 {
  let age = fract(phase);
  let rr = age * 0.58 + 0.04;
  let w = 0.010 + age * 0.030;
  let d = (r - rr) / w;
  let env = sin(3.14159 * clamp(age * 1.15, 0.0, 1.0));
  return exp(-d * d) * env * env;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = vec2f(uvIn.x, 1.0 - uvIn.y); // bottom-origin, y-up
  let t = p.time * p.speed;

  // Deep-space base with a very slight radial cool wash.
  let core = vec3f(p.c0r, p.c0g, p.c0b);
  let mid = vec3f(p.c1r, p.c1g, p.c1b);
  let rim = vec3f(p.c2r, p.c2g, p.c2b);
  var col = mix(vec3f(0.010, 0.011, 0.020), vec3f(0.018, 0.014, 0.030), uv.y);

  // The halo center leans toward the pointer; rests dead center.
  let center = mix(vec2f(0.5, 0.5), vec2f(p.px, 1.0 - p.py), 0.12);
  let r = length(uv - center);

  // Breathing core: a compact glow that pulses on the emission cycle.
  let breath = 0.75 + 0.25 * sin(t * 1.4);
  col += core * exp(-r * r * 220.0) * (1.1 * breath);
  col += mid * exp(-r * r * 26.0) * 0.35 * breath;

  // Stacked rings, each offset in phase so they never bunch up.
  let count = clamp(p.rings, 1.0, 6.0);
  var ringCol = vec3f(0.0);
  for (var i = 0; i < 6; i++) {
    if (f32(i) >= count) { break; }
    let fi = f32(i);
    let phase = t * 0.22 + fi / count;
    // Chromatic dispersion: each channel rings at its own radius.
    let pr = ringProfile(r * (1.0 + p.dispersion * 0.16), phase);
    let pg = ringProfile(r, phase);
    let pb = ringProfile(r * (1.0 - p.dispersion * 0.16), phase);
    // Per-ring hue lean so the stack doesn't read as one repeated band.
    let lean = mix(mid, mix(core, rim, fi * 0.22), 0.6);
    ringCol = ringCol + vec3f(pr * lean.r, pg * lean.g, pb * lean.b) * (0.9 - fi * 0.08);
  }
  col += ringCol * p.intensity * 0.85;

  // Faint angular shimmer over the rings, like diffraction through dust.
  let ang = atan2(uv.y - center.y, uv.x - center.x);
  let shimmer = 0.5 + 0.5 * sin(ang * 18.0 + t * 0.6 + r * 30.0);
  col += mid * ringCol.g * shimmer * 0.15;

  // Far star dust, dimmed near the bright core.
  let sg = floor(uvIn * 160.0);
  let sh = hash21(sg);
  if (sh > 0.9975) {
    let sd = length(fract(uvIn * 160.0) - vec2f(0.5)) * 2.0;
    col += vec3f(0.85, 0.88, 1.0) * exp(-sd * sd * 10.0) * (0.35 + 0.3 * sin(t * 1.7 + sh * 40.0)) * (1.0 - exp(-r * 3.0));
  }

  // Vignette + dither.
  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.34 * dot(v, v) * 2.2;
  col += vec3f((hash21(uvIn * 653.3 + t) - 0.5) / 255.0 * 1.5);
  return vec4f(col, 1.0);
}
`;

export interface HaloRingsProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Overall brightness of the rings. */
  intensity?: number;
  /** Number of visible rings in flight (1-6). */
  rings?: number;
  /** Chromatic dispersion — 0 is a clean ring, 1 splits wide spectra. */
  dispersion?: number;
  /** Core glow color (innermost light). */
  from?: string;
  /** Ring body color. */
  to?: string;
  /** Spectral fringe color (outer lean of each ring). */
  accent?: string;
  /**
   * When true, the halo center gently drifts toward the pointer.
   * Off by default — the halo stays centered.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const HALO_RINGS_DEFAULTS = {
  speed: 1,
  intensity: 1,
  rings: 3,
  dispersion: 0.55,
  from: "#fef3c7",
  to: "#7dd3fc",
  accent: "#c4b5fd",
} as const;

export const HALO_RINGS_PRESETS = {
  dawn: { speed: 1, intensity: 1, rings: 3, dispersion: 0.55, from: "#fef3c7", to: "#7dd3fc", accent: "#c4b5fd" },
  prism: { speed: 1.2, intensity: 1.05, rings: 4, dispersion: 1, from: "#ffffff", to: "#a5f3fc", accent: "#f0abfc" },
  ember: { speed: 0.8, intensity: 0.95, rings: 2, dispersion: 0.35, from: "#fff7ed", to: "#fb923c", accent: "#ef4444" },
} as const;

export function HaloRings({
  speed = HALO_RINGS_DEFAULTS.speed,
  intensity = HALO_RINGS_DEFAULTS.intensity,
  rings = HALO_RINGS_DEFAULTS.rings,
  dispersion = HALO_RINGS_DEFAULTS.dispersion,
  from = HALO_RINGS_DEFAULTS.from,
  to = HALO_RINGS_DEFAULTS.to,
  accent = HALO_RINGS_DEFAULTS.accent,
  interactive = false,
  className,
  style,
  fallback,
}: HaloRingsProps) {
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
        shader={HALO_RINGS_SHADER}
        label="halo-rings"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          rings,
          dispersion,
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
