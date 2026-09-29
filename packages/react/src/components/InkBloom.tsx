"use client";

import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * InkBloom — ink drops blooming and feathering across wet paper.
 *
 * Each drop expands from its seed in an eased spiral: the ink front is a
 * fbm-noise-perturbed radius (heavier upward, like paper grain dragging),
 * dense at the core, ring-deposited at the feathered edge, and slowly
 * paling as it ages. Drops respawn on staggered cycles so the page keeps
 * breathing. The paper is a warm fiber tone with subtle grain. In
 * interactive mode the freshest drop falls at the pointer (opt-in).
 */
export const INK_BLOOM_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  drops: f32,
  spread: f32,
  feather: f32,
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

fn fbm(p: vec2f) -> f32 {
  var v = 0.0;
  var amp = 0.5;
  var q = p;
  var m = 0.0;
  for (var i = 0; i < 4; i++) {
    v += amp * noise(q);
    m += amp;
    q = q * 2.17 + vec2f(6.7, 1.9);
    amp = amp * 0.5;
  }
  return v / m;
}

// Ink density for one drop, in 0..1. uv relative to the drop center.
// age 0..1 is the drop's life; ink spreads fast then settles and pales.
fn inkDrop(uv: vec2f, age: f32, seed: f32, spread: f32, feather: f32) -> f32 {
  // Eased expansion: violent splash in the first moments, then a long,
  // nearly stalled seep into the fibers.
  let grow = 1.0 - pow(1.0 - clamp(age, 0.0, 1.0), 5.0);
  let radius = spread * grow;

  let ang = atan2(uv.y, uv.x);
  let r = length(uv);
  // The ink front is ragged: angular noise makes fingers and lobes, and
  // a slow rotation shears them as the drop seeps.
  let wob = fbm(vec2f(ang * 2.5 + seed * 7.0, r * 3.0 - seed) + vec2f(seed * 3.1, 0.0)) - 0.5;
  let edge = radius * (1.0 + wob * (0.35 + feather * 0.35));

  if (r > edge) { return 0.0; }
  // Dense core, feathered frontier.
  var density = smoothstep(edge, edge * 0.45, r);
  // Coffee-ring: pigment deposits at the evaporating frontier.
  let ring = (r / max(edge, 1e-4) - 0.86) * 9.0;
  density += exp(-ring * ring) * 0.5 * smoothstep(0.05, 0.3, age);
  // Fine mottling inside the stain — uneven fiber absorption.
  density *= 0.82 + 0.36 * fbm(uv * 14.0 + vec2f(seed * 11.0));
  // The stain pales as it ages into the paper.
  density *= 1.0 - smoothstep(0.55, 1.0, age) * 0.55;
  return clamp(density, 0.0, 1.0);
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = vec2f(uvIn.x, 1.0 - uvIn.y); // bottom-origin, y-up
  let t = p.time * p.speed;

  let paper = vec3f(p.c0r, p.c0g, p.c0b);
  let wash = vec3f(p.c1r, p.c1g, p.c1b);
  let ink = vec3f(p.c2r, p.c2g, p.c2b);

  // Warm paper with fiber grain and a soft border burn.
  var col = paper;
  let grain = fbm(uv * vec2f(160.0, 90.0));
  col *= 0.97 + 0.05 * grain;
  let fiber = noise(vec2f(uv.x * 320.0, uv.y * 24.0));
  col *= 0.985 + 0.025 * fiber;
  let vb = uvIn - vec2f(0.5);
  col *= 1.0 - 0.10 * dot(vb, vb) * 2.2;

  // Stacked stains: each respawns on its own staggered cycle. The first
  // drop follows the pointer when interactive; the rest are hashed.
  var stain = 0.0;
  var washAcc = 0.0;
  let count = clamp(p.drops, 1.0, 6.0);
  for (var i = 0; i < 6; i++) {
    if (f32(i) >= count) { break; }
    let fi = f32(i);
    let cycle = 9.0 + fi * 3.0;
    let age = fract(t / cycle + fi * 0.37 + hash21(vec2f(fi, 7.7)) * 0.3);
    let h1 = hash21(vec2f(fi + 2.3, 9.1));
    let h2 = hash21(vec2f(fi + 6.7, 3.9));
    var center = vec2f(0.18 + 0.64 * h1, 0.2 + 0.6 * h2);
    if (fi == 0.0) {
      center = mix(center, vec2f(p.px, 1.0 - p.py), 0.85);
    }
    let rel = uv - center;
    // Paper grain drags the bloom slightly downward.
    let relShear = vec2f(rel.x, rel.y - 0.02 * p.spread);
    let size = p.spread * (0.42 + 0.30 * hash21(vec2f(fi, 4.4)));
    let d = inkDrop(relShear, age, fi + 1.0, size, p.feather);
    // Nearer (later-index) drops composite over earlier ones.
    stain = max(stain, d * (0.75 + 0.25 * fi / count));
    washAcc = washAcc + d;
  }

  // Dilute wash tint under the dense ink body.
  col = mix(col, wash, clamp(washAcc * 0.35, 0.0, 0.55));
  col = mix(col, ink, clamp(stain, 0.0, 1.0) * p.intensity);

  // Dither to keep the pale paper gradients smooth.
  col += vec3f((hash21(uvIn * 577.7 + t) - 0.5) / 255.0 * 1.2);
  return vec4f(col, 1.0);
}
`;

export interface InkBloomProps {
  /** Animation speed multiplier (drop cycle rate scales with it). */
  speed?: number;
  /** Ink opacity at full density. */
  intensity?: number;
  /** Number of active drops cycling on the page (1-6). */
  drops?: number;
  /** Base drop radius as a viewport fraction. */
  spread?: number;
  /** Edge raggedness — higher means wilder feathered fingers. */
  feather?: number;
  /** Paper color. */
  from?: string;
  /** Dilute wash tint under each stain. */
  to?: string;
  /** Dense ink color. */
  accent?: string;
  /**
   * When true, the freshest drop falls at the pointer position.
   * Off by default — drops land at hashed spots.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const INK_BLOOM_DEFAULTS = {
  speed: 1,
  intensity: 0.92,
  drops: 4,
  spread: 0.26,
  feather: 0.7,
  from: "#f4eee2",
  to: "#b9ac96",
  accent: "#191621",
} as const;

export const INK_BLOOM_PRESETS = {
  sumi: { speed: 1, intensity: 0.92, drops: 4, spread: 0.26, feather: 0.7, from: "#f4eee2", to: "#b9ac96", accent: "#191621" },
  indigo: { speed: 0.85, intensity: 0.88, drops: 5, spread: 0.3, feather: 0.9, from: "#eef2f5", to: "#9fb2c8", accent: "#14243d" },
  cinnabar: { speed: 1.15, intensity: 0.95, drops: 3, spread: 0.22, feather: 0.55, from: "#f6efe6", to: "#d8a08c", accent: "#8c1f13" },
} as const;

export function InkBloom({
  speed = INK_BLOOM_DEFAULTS.speed,
  intensity = INK_BLOOM_DEFAULTS.intensity,
  drops = INK_BLOOM_DEFAULTS.drops,
  spread = INK_BLOOM_DEFAULTS.spread,
  feather = INK_BLOOM_DEFAULTS.feather,
  from = INK_BLOOM_DEFAULTS.from,
  to = INK_BLOOM_DEFAULTS.to,
  accent = INK_BLOOM_DEFAULTS.accent,
  interactive = false,
  className,
  style,
  fallback,
}: InkBloomProps) {
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
        shader={INK_BLOOM_SHADER}
        label="ink-bloom"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          drops,
          spread,
          feather,
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
