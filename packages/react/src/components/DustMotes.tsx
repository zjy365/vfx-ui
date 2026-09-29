"use client";

import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * DustMotes — dust motes drifting through slanted Tyndall light beams.
 *
 * Parallel volumetric beams enter from the upper left: each is a soft band
 * whose width and brightness breathe with fbm, and the whole shaft set
 * slowly sweeps. Two mote layers ride a lazy flow field; they brighten
 * inside the beams and all but vanish in the shadowed room beyond. The
 * pointer is a draft of air that carries the motes (opt-in).
 */
export const DUST_MOTES_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  motes: f32,
  beams: f32,
  beamWidth: f32,
  drift: f32,
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
    q = q * 2.07 + vec2f(8.9, 2.6);
    amp = amp * 0.5;
  }
  return v / m;
}

// Beam coordinate: distance along and across the shaft direction. Beams
// run diagonally from the upper-left; s is across-shaft, d is beam depth.
fn beamCoords(uv: vec2f) -> vec2f {
  let dir = normalize(vec2f(0.55, -1.0)); // heading lower-right
  let rel = uv - vec2f(-0.1, 1.15);       // apex above the top-left corner
  return vec2f(dot(rel, vec2f(-dir.y, dir.x)), dot(rel, dir));
}

// Volumetric light at uv: a set of soft parallel bands, each breathing.
fn beams(uv: vec2f, t: f32, count: f32, width: f32) -> f32 {
  let sc = beamCoords(uv);
  let s = sc.x;
  // The shaft set breathes: width and offset wander on slow fbm.
  let sway = (fbm(vec2f(s * 0.9, t * 0.05)) - 0.5) * 0.45;
  let breathe = 0.7 + 0.5 * fbm(vec2f(s * 0.5 + 3.0, t * 0.08));
  let w = width * (0.7 + 0.6 * breathe);
  var light = 0.0;
  for (var i = 0; i < 4; i++) {
    if (f32(i) >= count) { break; }
    let fi = f32(i);
    // Bands fan out slightly as they descend (a window, not a laser).
    let center = 0.12 + fi * 0.30 + sway * (0.4 + fi * 0.2);
    let d = abs(s - center) / w;
    light += exp(-d * d) * (0.9 - fi * 0.12);
  }
  // Depth falloff: beams lose power as they cross the room, and taper
  // toward their source so no hard edge betrays the apex.
  let depth = clamp(sc.y / 1.5, 0.0, 1.0);
  light *= mix(0.25, 1.0, depth) * smoothstep(0.0, 0.15, depth);
  // Break the beams with drifting smoke haze.
  let haze = fbm(vec2f(s * 2.2, sc.y * 1.2 - t * 0.03)) - 0.5;
  light *= clamp(0.75 + haze * 0.9, 0.0, 1.0);
  return light;
}

// One mote layer: cell-hashed particles riding a slow flow field.
fn moteLayer(uv: vec2f, t: f32, grid: f32, seed: f32, drift: f32, draft: f32, light: f32, tint: vec3f, bright: vec3f) -> vec3f {
  var col = vec3f(0.0);
  // Flow field: motes sink and wander — dust never hurries.
  let fx = fbm(uv * 1.6 + vec2f(t * 0.02, seed)) - 0.5;
  let fy = fbm(uv * 1.4 + vec2f(seed, t * 0.015)) - 0.5;
  let flow = vec2f(fx, fy - 0.22 * drift) * 0.35 + vec2f(draft, -draft * 0.4);
  let g = uv * grid + flow * grid;
  let base = floor(g);
  for (var j = -1; j <= 1; j++) {
    for (var k = -1; k <= 1; k++) {
      let id = base + vec2f(f32(j), f32(k));
      let h0 = hash21(id + vec2f(seed, seed * 3.1));
      if (h0 > 0.35) {
        let h1 = hash21(id + vec2f(seed + 13.7, seed + 5.9));
        let h2 = hash21(id + vec2f(seed + 29.3, seed + 17.1));
        let pos = (id + vec2f(0.2 + 0.6 * h1, 0.2 + 0.6 * h2)) / grid;
        let d = length(uv - pos) * grid;
        let size = 0.10 + 0.16 * h1;
        let mote = exp(-d * d / (size * size));
        // Micro-catch: motes flare briefly as they tumble through focus.
        let flare = 0.55 + 0.45 * sin(t * (0.8 + 1.6 * h2) + h0 * 40.0);
        // Motes are only visible where light finds them.
        let lit = mote * flare * (0.12 + 1.5 * light);
        col = col + mix(tint, bright, h1) * lit;
      }
    }
  }
  return col;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = vec2f(uvIn.x, 1.0 - uvIn.y); // bottom-origin, y-up
  let t = p.time * p.speed;

  let room = vec3f(p.c0r, p.c0g, p.c0b);
  let light = vec3f(p.c1r, p.c1g, p.c1b);
  let spark = vec3f(p.c2r, p.c2g, p.c2b);

  // Dark room gradient: faint ambient pooling near the floor.
  var col = mix(room * 1.6, room, uv.y);

  // Volumetric beams and their scatter into the room.
  let bl = beams(uv, t, p.beams, p.beamWidth);
  col += light * bl * 0.16 * p.intensity;
  col += light * bl * bl * 0.05;

  // The pointer is a draft of air: motes lean with it.
  let draft = (p.px - 0.5) * 0.35;

  // Two mote layers — coarse near motes, fine far ones.
  col += moteLayer(uv, t, 13.0 * p.motes, 3.3, p.drift, draft, bl, light, spark) * 0.9;
  col += moteLayer(uv, t, 24.0 * p.motes, 11.9, p.drift * 0.7, draft * 0.6, bl, light, spark) * 0.5;

  // Vignette + dither.
  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.38 * dot(v, v) * 2.0;
  col += vec3f((hash21(uvIn * 709.7 + t) - 0.5) / 255.0 * 1.5);
  return vec4f(col, 1.0);
}
`;

export interface DustMotesProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Overall brightness of beams and motes. */
  intensity?: number;
  /** Mote count multiplier. */
  motes?: number;
  /** Number of visible beams (1-4). */
  beams?: number;
  /** Beam softness — higher means wider, hazier shafts. */
  beamWidth?: number;
  /** Ambient mote drift rate. */
  drift?: number;
  /** Room shadow color. */
  from?: string;
  /** Beam light color. */
  to?: string;
  /** Mote sparkle color (brightest flare). */
  accent?: string;
  /**
   * When true, the pointer acts as a draft of air carrying the motes.
   * Off by default — the air is still.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const DUST_MOTES_DEFAULTS = {
  speed: 1,
  intensity: 1,
  motes: 1,
  beams: 3,
  beamWidth: 0.16,
  drift: 1,
  from: "#0c0b10",
  to: "#e8d9b5",
  accent: "#fffbe8",
} as const;

export const DUST_MOTES_PRESETS = {
  attic: { speed: 1, intensity: 1, motes: 1, beams: 3, beamWidth: 0.16, drift: 1, from: "#0c0b10", to: "#e8d9b5", accent: "#fffbe8" },
  cathedral: { speed: 0.8, intensity: 1.1, motes: 0.85, beams: 2, beamWidth: 0.22, drift: 0.7, from: "#0a0d14", to: "#cfe0ff", accent: "#f5f9ff" },
  workshop: { speed: 1.2, intensity: 0.95, motes: 1.3, beams: 4, beamWidth: 0.12, drift: 1.3, from: "#100c0a", to: "#ffd9a0", accent: "#fff3d6" },
} as const;

export function DustMotes({
  speed = DUST_MOTES_DEFAULTS.speed,
  intensity = DUST_MOTES_DEFAULTS.intensity,
  motes = DUST_MOTES_DEFAULTS.motes,
  beams = DUST_MOTES_DEFAULTS.beams,
  beamWidth = DUST_MOTES_DEFAULTS.beamWidth,
  drift = DUST_MOTES_DEFAULTS.drift,
  from = DUST_MOTES_DEFAULTS.from,
  to = DUST_MOTES_DEFAULTS.to,
  accent = DUST_MOTES_DEFAULTS.accent,
  interactive = false,
  className,
  style,
  fallback,
}: DustMotesProps) {
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
        shader={DUST_MOTES_SHADER}
        label="dust-motes"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          motes,
          beams,
          beamWidth,
          drift,
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
