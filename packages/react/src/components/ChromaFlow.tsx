"use client";

import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { usePointerUniforms, POINTER_REST, POINTER_STILL } from "../usePointerUniforms.ts";
import { hexToRgb01 } from "../utils/color";

/**
 * ChromaFlow — a four-edge liquid color field that sloshes toward whichever
 * way the pointer sweeps.
 *
 * An original vfx-ui design in the "directional chroma flow" family popular
 * on product landing pages (a cursor flick from the right makes that edge's
 * color flood inward, then drains as the pointer settles). Built from
 * textbook techniques for the vgpu protocol: value-noise fbm drives a wavy
 * bleed boundary at each screen edge; pointer velocity (per-frame eased step,
 * see usePointerUniforms) scales each edge's bleed amount, so the effect
 * self-decays to the ambient slosh without any cleanup.
 *
 * At rest the field still breathes (the `ambient` slosh drifts through the
 * fbm), and the pointer position carries a soft glow pocket.
 */
export const CHROMA_FLOW_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  radius: f32,
  momentum: f32,
  ambient: f32,
  px: f32,
  py: f32,
  pActive: f32,
  vx: f32,
  vy: f32,
  c0r: f32, c0g: f32, c0b: f32, // base
  c1r: f32, c1g: f32, c1b: f32, // top edge
  c2r: f32, c2g: f32, c2b: f32, // bottom edge
  c3r: f32, c3g: f32, c3b: f32, // left edge
  c4r: f32, c4g: f32, c4b: f32, // right edge
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash21(p: vec2f) -> f32 {
  var p2 = fract(p * vec2f(123.34, 456.21));
  p2 = p2 + dot(p2, p2 + 45.32);
  return fract(p2.x * p2.y);
}

fn vnoise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash21(i);
  let b = hash21(i + vec2f(1.0, 0.0));
  let c = hash21(i + vec2f(0.0, 1.0));
  let d = hash21(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(pIn: vec2f) -> f32 {
  var p = pIn;
  var v = 0.0;
  var amp = 0.5;
  for (var i = 0; i < 5; i = i + 1) {
    v += amp * vnoise(p);
    p = p * 2.03 + vec2f(11.7, 9.2);
    amp *= 0.5;
  }
  return v;
}

/**
 * How far an edge's color has bled inward at this pixel: d is the distance
 * from the edge (0 at the edge, 1 at the opposite side), nz is the noise
 * boundary. The wet front sits at radius, feathered by noise and a soft
 * 35% gradient so it reads like sloshing liquid, not a bar.
 */
fn bleed(d: f32, nz: f32, radius: f32) -> f32 {
  let reach = (0.72 + 0.56 * nz) * radius;
  return clamp((reach - d) / max(reach * 0.55, 0.001), 0.0, 1.0);
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = uvIn; // y is down, matching the pointer uniforms' CSS convention
  let t = p.time * p.speed * 0.25;

  // Two decorrelated noise fields: one drives the bleed boundary, one
  // modulates the color body, so edges wobble independently of hue drift.
  let q = uv * 2.6;
  let nEdge = fbm(q + vec2f(t * 0.13, -t * 0.09));
  let nBody = fbm(q * 1.7 + vec2f(-t * 0.11, t * 0.15) + vec2f(7.3, 2.1));
  let nz = mix(nEdge, nBody, 0.45);

  // Pointer sweep: each edge's bleed is ambient + directional velocity.
  let sw = clamp(length(vec2f(p.vx, p.vy)) * p.momentum, 0.0, 1.0);
  let wUp = clamp(p.ambient + max(-p.vy, 0.0) * p.momentum * sw, 0.0, 1.0);
  let wDn = clamp(p.ambient + max( p.vy, 0.0) * p.momentum * sw, 0.0, 1.0);
  let wLf = clamp(p.ambient + max(-p.vx, 0.0) * p.momentum * sw, 0.0, 1.0);
  let wRt = clamp(p.ambient + max( p.vx, 0.0) * p.momentum * sw, 0.0, 1.0);

  let base = vec3f(p.c0r, p.c0g, p.c0b) * (0.94 + 0.12 * nBody);
  let up = vec3f(p.c1r, p.c1g, p.c1b);
  let dn = vec3f(p.c2r, p.c2g, p.c2b);
  let lf = vec3f(p.c3r, p.c3g, p.c3b);
  let rt = vec3f(p.c4r, p.c4g, p.c4b);

  var col = base;
  col = mix(col, up, bleed(uv.y, nz, p.radius) * wUp);
  col = mix(col, dn, bleed(1.0 - uv.y, nz, p.radius) * wDn);
  col = mix(col, lf, bleed(uv.x, nz, p.radius) * wLf);
  col = mix(col, rt, bleed(1.0 - uv.x, nz, p.radius) * wRt);

  // Soft glow pocket where the pointer is (opt-in via pActive): a bright
  // tint of the base so it reads on any palette.
  let pp = uv - vec2f(p.px, p.py);
  col = col + mix(base, up, 0.35) * exp(-dot(pp, pp) / 0.06) * 0.22 * p.pActive;

  // Grade: gentle S-curve, vignette, dither to kill banding in the bleeds.
  col = clamp(col, vec3f(0.0), vec3f(1.0));
  col = col * col * (3.0 - 2.0 * col) * 0.6 + col * 0.4;
  let v = uv - vec2f(0.5);
  col = col * (1.0 - 0.5 * dot(v, v)) * p.intensity;
  col = col + vec3f((hash21(uv * 981.7 + p.time) - 0.5) / 255.0 * 1.6);

  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
`;

export interface ChromaFlowProps {
  /** Ambient drift speed multiplier. */
  speed?: number;
  /** Overall brightness multiplier. */
  intensity?: number;
  /** How far an edge's color bleeds inward (0..1 of screen). */
  radius?: number;
  /** Sweep-to-color sensitivity: velocity × this drives each edge's flood. */
  momentum?: number;
  /** Resting bleed amount per edge (0..1) — keeps the frame alive with no cursor. */
  ambient?: number;
  /** Base gradient color (default midnight navy). */
  baseColor?: string;
  /** Top edge color. */
  upColor?: string;
  /** Bottom edge color. */
  downColor?: string;
  /** Left edge color. */
  leftColor?: string;
  /** Right edge color. */
  rightColor?: string;
  /**
   * When true, the field sloshes toward the pointer's sweep direction and a
   * glow pocket follows it. Off by default — the field only ambient-breathes.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const CHROMA_FLOW_DEFAULTS = {
  speed: 1,
  intensity: 1,
  radius: 0.45,
  momentum: 16,
  ambient: 0.55,
  baseColor: "#071021",
  upColor: "#1d4ed8",
  downColor: "#cbd5e1",
  leftColor: "#0ea5e9",
  rightColor: "#f59e0b",
} as const;

export const CHROMA_FLOW_PRESETS = {
  classic: { ambient: 0.55, radius: 0.45, momentum: 16 },
  dusk: {
    baseColor: "#1b0b2e",
    upColor: "#a855f7",
    downColor: "#f5f5f4",
    leftColor: "#f472b6",
    rightColor: "#fbbf24",
    ambient: 0.6,
  },
  tide: {
    baseColor: "#03161f",
    upColor: "#0ea5e9",
    downColor: "#ecfeff",
    leftColor: "#06b6d4",
    rightColor: "#38bdf8",
    ambient: 0.5,
    radius: 0.6,
  },
} as const;

export function ChromaFlow({
  speed = CHROMA_FLOW_DEFAULTS.speed,
  intensity = CHROMA_FLOW_DEFAULTS.intensity,
  radius = CHROMA_FLOW_DEFAULTS.radius,
  momentum = CHROMA_FLOW_DEFAULTS.momentum,
  ambient = CHROMA_FLOW_DEFAULTS.ambient,
  baseColor = CHROMA_FLOW_DEFAULTS.baseColor,
  upColor = CHROMA_FLOW_DEFAULTS.upColor,
  downColor = CHROMA_FLOW_DEFAULTS.downColor,
  leftColor = CHROMA_FLOW_DEFAULTS.leftColor,
  rightColor = CHROMA_FLOW_DEFAULTS.rightColor,
  interactive = false,
  className,
  style,
  fallback,
}: ChromaFlowProps) {
  const [wrapRef, pointer, pointerActive, velocity] = usePointerUniforms<HTMLDivElement>();
  const ptr = interactive ? pointer : POINTER_REST;
  const vel = interactive ? velocity : POINTER_STILL;

  const c = [baseColor, upColor, downColor, leftColor, rightColor].map(hexToRgb01);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={CHROMA_FLOW_SHADER}
        label="chroma-flow"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          radius,
          momentum,
          ambient,
          px: ptr.x,
          py: ptr.y,
          pActive: pointerActive && interactive ? 1 : 0,
          vx: vel.vx,
          vy: vel.vy,
          c0r: c[0]![0], c0g: c[0]![1], c0b: c[0]![2],
          c1r: c[1]![0], c1g: c[1]![1], c1b: c[1]![2],
          c2r: c[2]![0], c2g: c[2]![1], c2b: c[2]![2],
          c3r: c[3]![0], c3g: c[3]![1], c3b: c[3]![2],
          c4r: c[4]![0], c4g: c[4]![1], c4b: c[4]![2],
        }}
      />
    </div>
  );
}
