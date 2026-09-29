"use client";

import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * CausticsField — sunlit pool-floor caustics dancing over deep water.
 *
 * A jittered-grid Voronoi (F1/F2 edge distance) with orbiting cell seeds
 * produces the classic bright net of focused light. Three octaves at
 * different scales and speeds stack into non-repeating ripples, over a
 * depth-graded water gradient with drifting silt motes. The pointer
 * shifts the sun's beam center (opt-in).
 */
export const CAUSTICS_FIELD_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  scale: f32,
  sharpness: f32,
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

fn hash22(pIn: vec2f) -> vec2f {
  var p3 = fract(vec3f(pIn.x, pIn.y, pIn.x) * vec3f(0.1031, 0.1030, 0.0973));
  p3 = p3 + dot(p3, vec3f(p3.y, p3.z, p3.x) + 33.33);
  return fract(vec2f((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y));
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
    q = q * 2.09 + vec2f(8.3, 5.1);
    amp = amp * 0.5;
  }
  return v / m;
}

// Voronoi with orbiting seeds. Returns (F1, F2) distances: the caustic net
// lives on the cell edges, where F2 - F1 collapses toward zero.
fn voronoi(pIn: vec2f, t: f32) -> vec2f {
  let ip = floor(pIn);
  let fp = fract(pIn);
  var d1 = 8.0;
  var d2 = 8.0;
  for (var j = -1; j <= 1; j++) {
    for (var k = -1; k <= 1; k++) {
      let g = vec2f(f32(j), f32(k));
      let seed = hash22(ip + g);
      // Each feature point travels a small circular orbit, phase-offset by
      // its seed — this is what makes the light net crawl and reshape.
      let orbit = vec2f(cos(t + seed.x * 6.2831), sin(t + seed.y * 6.2831)) * 0.5;
      let d = distance(g + 0.25 + seed * 0.5 + orbit, fp);
      if (d < d1) {
        d2 = d1;
        d1 = d;
      } else {
        if (d < d2) { d2 = d; }
      }
    }
  }
  return vec2f(d1, d2);
}

// One caustic octave: bright net where cells meet, dimmed at cell hearts.
fn caustic(p: vec2f, t: f32, freq: f32, rate: f32) -> f32 {
  let d = voronoi(p * freq, t * rate);
  let edge = d.y - d.x;
  return smoothstep(0.38, 0.02, edge);
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = vec2f(uvIn.x, 1.0 - uvIn.y); // bottom-origin, y-up
  let t = p.time * p.speed;

  // Depth-graded water: bright sunlit surface above, dark abyss below.
  let deep = vec3f(p.c0r, p.c0g, p.c0b);
  let mid = vec3f(p.c1r, p.c1g, p.c1b);
  let glint = vec3f(p.c2r, p.c2g, p.c2b);
  var col = mix(mid, deep, smoothstep(0.45, 0.0, uv.y));
  col = mix(col, mid * 0.55, smoothstep(0.55, 1.0, uv.y));

  // Slow whole-frame swell so the net never loops visibly.
  let q = uv * p.scale + vec2f(fbm(uv * 1.7 + vec2f(0.0, t * 0.05)) - 0.5, fbm(uv * 1.9 - vec2f(t * 0.04, 0.0)) - 0.5) * 1.4;

  // The sun's beam follows the pointer a little; centered at rest.
  let sun = vec2f(p.px, 1.0 - p.py);
  let sd = distance(uv, mix(vec2f(0.5, 0.85), sun, 0.25));
  let beam = exp(-sd * sd * 2.2);

  // Three stacked octaves: coarse slow sway, fine fast shimmer.
  var net = caustic(q, t, 3.1, 0.55) * 0.55;
  net += caustic(q + vec2f(13.7, 4.2), t, 5.3, 0.8) * 0.65;
  net += caustic(q + vec2f(41.3, 27.9), t, 9.1, 1.15) * 0.4;
  net = pow(clamp(net, 0.0, 1.0), p.sharpness * 2.0);

  // Caustics are near-white where octaves coincide; deeper water dims them.
  col += glint * net * (0.35 + 0.65 * beam) * smoothstep(0.0, 0.35, uv.y) * p.intensity * 0.85;
  // Soft ambient scatter where the net is merely warm.
  col += mid * net * net * 0.35;

  // Silt motes drifting through the beam.
  let mg = floor(uv * vec2f(50.0, 30.0));
  let mh = hash21(mg);
  if (mh > 0.965) {
    let drift = vec2f(t * 0.03, -t * 0.05);
    let mp = fract(uv * vec2f(50.0, 30.0) + drift) - vec2f(0.5);
    let md = length(mp);
    col += glint * exp(-md * md * 90.0) * 0.35 * (0.5 + 0.5 * beam);
  }

  // Surface sheen: a bright ceiling band, like looking up toward the light.
  col += glint * 0.10 * pow(clamp(uv.y * 1.6, 0.0, 1.0), 3.0);

  // Vignette + dither.
  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.32 * dot(v, v) * 2.0;
  col += vec3f((hash21(uvIn * 613.7 + t) - 0.5) / 255.0 * 1.5);
  return vec4f(col, 1.0);
}
`;

export interface CausticsFieldProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Overall brightness of the caustic net. */
  intensity?: number;
  /** Ripple density — higher means smaller, busier cells. */
  scale?: number;
  /** Edge contrast of the light net — higher means crisper filaments. */
  sharpness?: number;
  /** Deep-water color (bottom gradient stop). */
  from?: string;
  /** Water body color (mid gradient + ambient scatter). */
  to?: string;
  /** Caustic light color (sunlit filaments and motes). */
  accent?: string;
  /**
   * When true, the sun's beam center drifts toward the pointer.
   * Off by default — the beam stays near the surface center.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const CAUSTICS_FIELD_DEFAULTS = {
  speed: 1,
  intensity: 1,
  scale: 1.4,
  sharpness: 1,
  from: "#03161d",
  to: "#0b5568",
  accent: "#bfeef7",
} as const;

export const CAUSTICS_FIELD_PRESETS = {
  lagoon: { speed: 1, intensity: 1, scale: 1.4, sharpness: 1, from: "#03161d", to: "#0b5568", accent: "#bfeef7" },
  reef: { speed: 1.2, intensity: 1.1, scale: 1.8, sharpness: 1.2, from: "#022c1e", to: "#0e7a55", accent: "#d8ffe9" },
  nightPool: { speed: 0.7, intensity: 0.9, scale: 1.1, sharpness: 0.85, from: "#0a0f2b", to: "#2a3f9e", accent: "#cfe0ff" },
} as const;

export function CausticsField({
  speed = CAUSTICS_FIELD_DEFAULTS.speed,
  intensity = CAUSTICS_FIELD_DEFAULTS.intensity,
  scale = CAUSTICS_FIELD_DEFAULTS.scale,
  sharpness = CAUSTICS_FIELD_DEFAULTS.sharpness,
  from = CAUSTICS_FIELD_DEFAULTS.from,
  to = CAUSTICS_FIELD_DEFAULTS.to,
  accent = CAUSTICS_FIELD_DEFAULTS.accent,
  interactive = false,
  className,
  style,
  fallback,
}: CausticsFieldProps) {
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
        shader={CAUSTICS_FIELD_SHADER}
        label="caustics-field"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          scale,
          sharpness,
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
