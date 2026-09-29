"use client";

import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * PlasmaSheet — molten color currents folding through each other.
 *
 * Two chained domain warps (value-noise fbm warped by fbm, the classic
 * fluid technique): the first warp advects the field, the second folds it
 * back on itself, so colors stir like dense dye in motion. Filament
 * highlights ride the warp's second derivative and an electric rim picks
 * out the fold edges. The pointer injects a vortex-like swirl (opt-in).
 */
export const PLASMA_SHEET_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  scale: f32,
  warp: f32,
  c0r: f32, c0g: f32, c0b: f32,
  c1r: f32, c1g: f32, c1b: f32,
  c2r: f32, c2g: f32, c2b: f32,
  px: f32,
  py: f32,
  pActive: f32,
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
  for (var i = 0; i < 5; i++) {
    v += amp * noise(q);
    m += amp;
    q = q * 2.08 + vec2f(6.1, 9.7);
    amp = amp * 0.5;
  }
  return v / m;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = vec2f(uvIn.x, 1.0 - uvIn.y); // bottom-origin, y-up
  let t = p.time * p.speed;

  var q = uv * p.scale;

  // Pointer vortex: a swirl term bends the field around the cursor. The
  // rotation angle is gated by the swirl strength, so at rest (swirl = 0)
  // the matrix is exactly the identity and the field is untouched.
  let pp = vec2f(p.px, 1.0 - p.py) * p.scale;
  let pd = q - pp;
  let pr = length(pd);
  let swirl = exp(-pr * pr * 0.35) * p.pActive;
  let ang = swirl * (3.0 + 1.5 * sin(t * 0.9));
  let sn = sin(ang);
  let cs = cos(ang);
  q = pp + vec2f(pd.x * cs - pd.y * sn, pd.x * sn + pd.y * cs);

  // First warp: advect the field along drifting fbm currents.
  let w1 = fbm(q + vec2f(0.0, t * 0.10));
  let w2 = fbm(q + vec2f(5.2, 1.3) - vec2f(t * 0.08, 0.0));
  let advected = q + (vec2f(w1, w2) - vec2f(0.5)) * p.warp;

  // Second warp: fold the advected field back through itself.
  let w3 = fbm(advected + vec2f(1.7, 9.2) + vec2f(t * 0.05, t * 0.06));
  let folded = advected + (w3 - 0.5) * p.warp * 0.8;

  let f = fbm(folded);

  let deep = vec3f(p.c0r, p.c0g, p.c0b);
  let mid = vec3f(p.c1r, p.c1g, p.c1b);
  let rim = vec3f(p.c2r, p.c2g, p.c2b);

  // Color currents: the folded field value selects the dye concentration.
  var col = deep;
  col = mix(col, mid, clamp(f * f * 1.9, 0.0, 1.0));
  // Electric rim where the second warp compresses — the fold edges.
  let foldEdge = clamp(1.0 - abs(w3 - f) * 3.2, 0.0, 1.0);
  col = mix(col, rim, pow(foldEdge, 3.0) * 0.7);

  // Filaments: thin bright threads where the field is dense.
  let filament = pow(clamp(f * 1.35 - 0.45, 0.0, 1.0), 2.5);
  col = col + rim * filament * 0.35;
  col = col + mid * exp(-abs(f - 0.52) * 14.0) * 0.10;

  // Deep-space shadows pool in the corners; plasma brightens center-frame.
  let v = uv - vec2f(0.5);
  col *= 1.0 - 0.42 * dot(v, v) * 1.9;
  col *= p.intensity;

  // Dither.
  col += vec3f((hash21(uvIn * 761.3 + t) - 0.5) / 255.0 * 1.5);
  return vec4f(col, 1.0);
}
`;

export interface PlasmaSheetProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Overall brightness. */
  intensity?: number;
  /** Current scale — higher means finer, tighter folds. */
  scale?: number;
  /** Domain-warp strength — higher means more violent folding. */
  warp?: number;
  /** Deep background dye color. */
  from?: string;
  /** Main dye current color. */
  to?: string;
  /** Electric rim / filament color. */
  accent?: string;
  /**
   * When true, the pointer injects a swirling vortex into the current.
   * Off by default — the plasma stirs on its own.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const PLASMA_SHEET_DEFAULTS = {
  speed: 1,
  intensity: 1,
  scale: 2.2,
  warp: 1.8,
  from: "#120b26",
  to: "#7b2ff7",
  accent: "#22d3ee",
} as const;

export const PLASMA_SHEET_PRESETS = {
  nebula: { speed: 1, intensity: 1, scale: 2.2, warp: 1.8, from: "#120b26", to: "#7b2ff7", accent: "#22d3ee" },
  magma: { speed: 1.15, intensity: 1.05, scale: 1.9, warp: 2.1, from: "#1f0a05", to: "#f97316", accent: "#fde047" },
  anodized: { speed: 0.85, intensity: 0.95, scale: 2.6, warp: 1.6, from: "#051c23", to: "#0ea5e9", accent: "#a3e635" },
} as const;

export function PlasmaSheet({
  speed = PLASMA_SHEET_DEFAULTS.speed,
  intensity = PLASMA_SHEET_DEFAULTS.intensity,
  scale = PLASMA_SHEET_DEFAULTS.scale,
  warp = PLASMA_SHEET_DEFAULTS.warp,
  from = PLASMA_SHEET_DEFAULTS.from,
  to = PLASMA_SHEET_DEFAULTS.to,
  accent = PLASMA_SHEET_DEFAULTS.accent,
  interactive = false,
  className,
  style,
  fallback,
}: PlasmaSheetProps) {
  const a = hexToRgb01(from);
  const b = hexToRgb01(to);
  const c = hexToRgb01(accent);
  const [wrapRef, pointer, pointerActive] = usePointerUniforms<HTMLDivElement>({ enabled: interactive });
  const ptr = interactive ? pointer : POINTER_REST;
  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={PLASMA_SHEET_SHADER}
        label="plasma-sheet"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          scale,
          warp,
          c0r: a[0], c0g: a[1], c0b: a[2],
          c1r: b[0], c1g: b[1], c1b: b[2],
          c2r: c[0], c2g: c[1], c2b: c[2],
          px: ptr.x,
          py: ptr.y,
          pActive: pointerActive && interactive ? 1 : 0,
        }}
      />
    </div>
  );
}
