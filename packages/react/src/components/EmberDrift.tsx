"use client";

import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * EmberDrift — sparks rising from a bed of coals, refracted through heat shimmer.
 *
 * Two cell-hashed ember layers ascend at different speeds and sizes; each
 * spark cools from hot orange to deep red as it climbs, then fades out.
 * A bottom-weighted fbm distortion bends the whole frame like rising heat.
 * The pointer blows a gentle sideways wind through the sparks (opt-in).
 */
export const EMBER_DRIFT_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  embers: f32,
  rise: f32,
  shimmer: f32,
  c0r: f32, c0g: f32, c0b: f32,
  c1r: f32, c1g: f32, c1b: f32,
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
    q = q * 2.11 + vec2f(7.7, 3.9);
    amp = amp * 0.5;
  }
  return v / m;
}

// One layer of rising embers. The cell grid itself scrolls downward so the
// sparks read as ascending; each spark sways, flickers and cools with height.
fn emberLayer(uv: vec2f, t: f32, grid: vec2f, seed: f32, wind: f32, hot: vec3f, cool: vec3f) -> vec3f {
  let rising = uv * grid - vec2f(wind, t);
  let id = floor(rising);
  let local = fract(rising);
  let h0 = hash21(id + vec2f(seed, seed * 1.7));
  let h1 = hash21(id + vec2f(seed + 43.7, seed + 11.3));
  var col = vec3f(0.0);
  // Sparse occupancy: not every cell carries a spark.
  if (h0 > 0.42) {
    let cx = 0.25 + 0.5 * h1;
    let cy = 0.25 + 0.5 * h0;
    // Lateral sway grows with height, so the plume fans out as it rises.
    let sway = sin(t * (0.9 + h1) + h0 * 6.2831) * 0.16 * (0.3 + uv.y);
    let d = length(local - vec2f(cx + sway, cy));
    let core = exp(-d * d * 130.0);
    let halo = exp(-d * d * 22.0) * 0.22;
    // Flicker: fast phase-jittered pulse, unique per spark.
    let flick = 0.55 + 0.45 * sin(t * (5.0 + 4.0 * h1) + h0 * 40.0);
    // Cooling: fresh sparks near the bed are hot; high sparks fade to red.
    let life = 1.0 - smoothstep(0.15, 0.95, uv.y);
    let temp = clamp(life * (0.6 + 0.4 * h1), 0.0, 1.0);
    let spark = (core + halo) * flick * smoothstep(0.0, 0.12, uv.y);
    col = col + mix(cool, hot, temp) * spark;
  }
  return col;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = vec2f(uvIn.x, 1.0 - uvIn.y); // bottom-origin, y-up
  let t = p.time * p.speed;

  // Heat shimmer: the lower third of the frame is warped by rising thermals.
  let lens = (fbm(vec2f(uv.y * 5.0, t * 1.4)) - 0.5) * p.shimmer * smoothstep(0.75, 0.0, uv.y);
  let suv = vec2f(uv.x + lens, uv.y);

  // Charcoal bed: near-black with a warm breathing glow along the bottom.
  var col = mix(vec3f(0.012, 0.008, 0.007), vec3f(0.045, 0.02, 0.012), uv.y);
  let bed = fbm(vec2f(suv.x * 6.0, t * 0.25));
  let hot = vec3f(p.c0r, p.c0g, p.c0b);
  let cool = vec3f(p.c1r, p.c1g, p.c1b);
  col += hot * exp(-uv.y * 7.0) * (0.10 + 0.22 * bed);

  // The pointer is a soft wind: it leans the plume and sways the sparks.
  let wind = (p.px - 0.5) * 0.9;

  // Far layer: many small slow sparks. Near layer: fewer, larger, brighter.
  var em = vec3f(0.0);
  em += emberLayer(suv, t * p.rise * 0.6, vec2f(24.0, 15.0) * p.embers, 3.1, wind * 0.5, hot, cool) * 0.5;
  em += emberLayer(suv, t * p.rise, vec2f(11.0, 7.0) * max(p.embers, 0.4), 9.7, wind, hot, cool) * 1.1;
  col += em * p.intensity;

  // Faint smoke veil drifting above the sparks.
  let smoke = fbm(vec2f(suv.x * 3.0 + t * 0.05, suv.y * 2.2 - t * 0.03));
  col += vec3f(0.05, 0.04, 0.045) * smoke * smoothstep(0.3, 0.9, uv.y) * 0.5;

  // Vignette + dither.
  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.4 * dot(v, v) * 2.0;
  col += vec3f((hash21(uvIn * 719.3 + t) - 0.5) / 255.0 * 1.5);
  return vec4f(col, 1.0);
}
`;

export interface EmberDriftProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Overall brightness of the sparks. */
  intensity?: number;
  /** Ember count multiplier — higher means denser sparks. */
  embers?: number;
  /** Ascent speed multiplier for the ember plume. */
  rise?: number;
  /** Heat-refraction strength in the lower frame. */
  shimmer?: number;
  /** Fresh-spark color (white-hot end of the ramp). */
  from?: string;
  /** Cooled-spark color (deep-red end of the ramp). */
  to?: string;
  /**
   * When true, the pointer blows a sideways wind that leans the plume.
   * Off by default — sparks rise straight up.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const EMBER_DRIFT_DEFAULTS = {
  speed: 1,
  intensity: 1,
  embers: 1,
  rise: 1,
  shimmer: 0.035,
  from: "#ffb45e",
  to: "#c22b0f",
} as const;

export const EMBER_DRIFT_PRESETS = {
  campfire: { speed: 1, intensity: 1, embers: 1, rise: 1, shimmer: 0.035, from: "#ffb45e", to: "#c22b0f" },
  furnace: { speed: 1.3, intensity: 1.15, embers: 1.4, rise: 1.25, shimmer: 0.05, from: "#fff3c4", to: "#f97316" },
  blueFlame: { speed: 0.9, intensity: 0.95, embers: 0.9, rise: 0.85, shimmer: 0.03, from: "#bfe8ff", to: "#3b46f1" },
} as const;

export function EmberDrift({
  speed = EMBER_DRIFT_DEFAULTS.speed,
  intensity = EMBER_DRIFT_DEFAULTS.intensity,
  embers = EMBER_DRIFT_DEFAULTS.embers,
  rise = EMBER_DRIFT_DEFAULTS.rise,
  shimmer = EMBER_DRIFT_DEFAULTS.shimmer,
  from = EMBER_DRIFT_DEFAULTS.from,
  to = EMBER_DRIFT_DEFAULTS.to,
  interactive = false,
  className,
  style,
  fallback,
}: EmberDriftProps) {
  const a = hexToRgb01(from);
  const b = hexToRgb01(to);
  const [wrapRef, pointer] = usePointerUniforms<HTMLDivElement>({ enabled: interactive });
  const ptr = interactive ? pointer : POINTER_REST;
  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={EMBER_DRIFT_SHADER}
        label="ember-drift"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          embers,
          rise,
          shimmer,
          c0r: a[0], c0g: a[1], c0b: a[2],
          c1r: b[0], c1g: b[1], c1b: b[2],
          px: ptr.x,
          py: ptr.y,
        }}
      />
    </div>
  );
}
