"use client";

import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * SilkVeil — a draped silk curtain with a sheen band sweeping across it.
 *
 * Vertical folds are a domain-warped sine field shaded anisotropically
 * (bright where the surface tilts toward the light, like cloth-of-gold);
 * a diagonal luster band travels slowly across the weave and catches the
 * fold crests. Fine thread noise adds weave grain. The pointer tilts the
 * light so the sheen follows it (opt-in).
 */
export const SILK_VEIL_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  folds: f32,
  sheen: f32,
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
    q = q * 2.13 + vec2f(5.9, 1.7);
    amp = amp * 0.5;
  }
  return v / m;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = vec2f(uvIn.x, 1.0 - uvIn.y); // bottom-origin, y-up
  let t = p.time * p.speed;

  // The fabric breathes: a slow fbm warp bends the fold field, so the
  // curtain never reads as a static interference pattern.
  let wx = fbm(vec2f(uv.x * 1.8, uv.y * 1.2 + t * 0.05)) - 0.5;
  let wy = fbm(vec2f(uv.x * 1.6 + 4.7, uv.y * 2.0 - t * 0.04)) - 0.5;
  let wq = uv + vec2f(wx, wy) * 0.35;

  // Vertical folds: a travelling sine field; slope = surface tilt.
  let foldArg = wq.x * p.folds + t * 0.06;
  let fold = sin(foldArg);
  let slope = cos(foldArg); // +-1 at fold faces, 0 at crests/troughs

  // Shade: crests catch light, valleys fall to shadow, tilt shifts it.
  let tilt = (p.px - 0.5) * 1.2;
  let shade = clamp(0.5 + 0.5 * fold * 0.8 + slope * tilt * 0.35, 0.0, 1.0);

  // Luster band sweeping diagonally across the weave.
  let s = uv.x * 0.8 + uv.y * 0.6;
  let sweepPos = -0.3 + fract(t * 0.10) * 1.9 + (p.py - 0.5) * 0.2;
  let bandDist = (s - sweepPos) * 3.2;
  let band = exp(-bandDist * bandDist);

  // Anisotropic sheen: the band brightens on slopes facing it, like
  // specular light raking across silk threads.
  let facing = clamp(0.5 + slope * sign(s - sweepPos) * 0.5, 0.0, 1.0);
  let sheen = band * (0.25 + 0.75 * pow(facing, 2.0)) * p.sheen;

  let deep = vec3f(p.c0r, p.c0g, p.c0b);
  let mid = vec3f(p.c1r, p.c1g, p.c1b);
  let luster = vec3f(p.c2r, p.c2g, p.c2b);

  var col = mix(deep, mid, shade * 0.75 + 0.12);
  // Broad soft luster wherever the band passes, thread-sharp at crests.
  col = col + luster * sheen * (0.4 + 0.6 * shade);
  col = col + luster * pow(shade, 5.0) * band * 0.30;

  // Weave grain: anisotropic fine threads running vertically.
  let thread = noise(vec2f(uv.x * 240.0, uv.y * 18.0 + t * 0.15));
  col *= 0.94 + 0.09 * thread;
  // Slub knots: occasional brighter horizontal slubs in the weave.
  let slub = noise(vec2f(uv.x * 30.0, uv.y * 160.0));
  col += mid * smoothstep(0.82, 0.95, slub) * 0.10;

  // Depth: the veil darkens toward the top and bottom edges, as if
  // gathering into unseen pleats.
  col *= mix(0.72, 1.0, smoothstep(0.0, 0.24, uv.y) * smoothstep(1.0, 0.72, uv.y) * 0.7 + 0.3);
  col *= p.intensity;

  // Vignette + dither.
  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.30 * dot(v, v) * 2.0;
  col += vec3f((hash21(uvIn * 599.1 + t) - 0.5) / 255.0 * 1.5);
  return vec4f(col, 1.0);
}
`;

export interface SilkVeilProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Overall brightness of the fabric. */
  intensity?: number;
  /** Fold density across the curtain. */
  folds?: number;
  /** Strength of the traveling luster band. */
  sheen?: number;
  /** Shadow color of the fold valleys. */
  from?: string;
  /** Fold body color. */
  to?: string;
  /** Luster highlight color (the sweeping sheen). */
  accent?: string;
  /**
   * When true, the light tilts toward the pointer — slopes facing it glow
   * and the luster band tracks its height. Off by default.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const SILK_VEIL_DEFAULTS = {
  speed: 1,
  intensity: 1,
  folds: 9,
  sheen: 1,
  from: "#2a1030",
  to: "#7c2d64",
  accent: "#ffd9a8",
} as const;

export const SILK_VEIL_PRESETS = {
  rosewood: { speed: 1, intensity: 1, folds: 9, sheen: 1, from: "#2a1030", to: "#7c2d64", accent: "#ffd9a8" },
  midnight: { speed: 0.85, intensity: 0.95, folds: 12, sheen: 1.1, from: "#0a1430", to: "#2f4fa8", accent: "#cfe3ff" },
  champagne: { speed: 1.1, intensity: 1.05, folds: 7, sheen: 0.95, from: "#3a2c14", to: "#a8823c", accent: "#fff2cf" },
} as const;

export function SilkVeil({
  speed = SILK_VEIL_DEFAULTS.speed,
  intensity = SILK_VEIL_DEFAULTS.intensity,
  folds = SILK_VEIL_DEFAULTS.folds,
  sheen = SILK_VEIL_DEFAULTS.sheen,
  from = SILK_VEIL_DEFAULTS.from,
  to = SILK_VEIL_DEFAULTS.to,
  accent = SILK_VEIL_DEFAULTS.accent,
  interactive = false,
  className,
  style,
  fallback,
}: SilkVeilProps) {
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
        shader={SILK_VEIL_SHADER}
        label="silk-veil"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          folds,
          sheen,
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
