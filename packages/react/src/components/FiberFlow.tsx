"use client";

import { useEffect, useState } from "react";
import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { usePointerUniforms } from "../usePointerUniforms.ts";
import { hexToRgb01 } from "../utils/color";

/**
 * FiberFlow — luminous silk fibers streaming through the dark.
 *
 * An original vfx-ui design built from textbook techniques (value-noise fbm,
 * domain warping, ridge comb filtering) — conceptually in the "flowing fiber
 * background" family popularized by component galleries, implemented from
 * scratch for the vgpu protocol (fullscreen fragment + f32 uniforms).
 *
 * The fibers are ridges of an anisotropically stretched, domain-warped fbm
 * field; a second low-frequency fbm makes each strand ebb and flow along its
 * length. The pointer parallaxes the field and adds a soft local glow.
 */
export const FIBER_FLOW_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  scale: f32,
  strands: f32,
  sharp: f32,
  px: f32,
  py: f32,
  pActive: f32,
  resX: f32,
  resY: f32,
  c0r: f32, c0g: f32, c0b: f32,
  c1r: f32, c1g: f32, c1b: f32,
  c2r: f32, c2g: f32, c2b: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash2(pIn: vec2f) -> f32 {
  var p = fract(pIn * vec2f(123.34, 456.21));
  p = p + dot(p, p + 45.32);
  return fract(p.x * p.y);
}

fn vnoise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash2(i);
  let b = hash2(i + vec2f(1.0, 0.0));
  let c = hash2(i + vec2f(0.0, 1.0));
  let d = hash2(i + vec2f(1.0, 1.0));
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

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = vec2f(uvIn.x, 1.0 - uvIn.y); // bottom-origin, y-up
  let aspect = p.resX / max(p.resY, 1.0);
  let t = p.time * p.speed * 0.35;

  var q = vec2f(uv.x * aspect, uv.y) * p.scale;
  // pointer parallax: the whole field shifts gently toward the cursor
  q = q + (vec2f(p.px, 1.0 - p.py) - 0.5) * 0.6;

  // domain warp — large-scale organic drift
  let wx = fbm(q + vec2f(0.0, t * 0.12));
  let wy = fbm(q + vec2f(5.2, 1.3) - vec2f(t * 0.09, 0.0));
  q = q + (vec2f(wx, wy) - 0.5) * 2.2;

  // anisotropic stretch → long strands streaming along x
  let f = fbm(q * vec2f(0.55, 2.1) + vec2f(t * 0.22, 0.0));

  // ridge comb: thin luminous fibers at field ridges
  let v = fract(f * p.strands * 0.25);
  let d = abs(v - 0.5) * 2.0;
  var fiber = pow(max(1.0 - d, 0.0), p.sharp);

  // each strand ebbs and flows along its length
  let shade = fbm(q * vec2f(0.4, 0.9) + vec2f(t * 0.06, 3.7));
  fiber = fiber * (0.25 + 0.75 * smoothstep(0.35, 0.75, shade));

  let deep = vec3f(p.c0r, p.c0g, p.c0b);
  let mid = vec3f(p.c1r, p.c1g, p.c1b);
  let hi = vec3f(p.c2r, p.c2g, p.c2b);

  var col = vec3f(0.008, 0.006, 0.030); // near-black blue base
  col = col + deep * 0.10;
  col = col + mix(deep, mid, shade) * fiber * 0.9;
  col = col + hi * pow(fiber, 3.0) * 0.55;

  // soft glow pocket around the pointer
  let pp = vec2f(uv.x * aspect, uv.y);
  let pd = distance(pp, vec2f(p.px * aspect, 1.0 - p.py));
  col = col + mid * exp(-pd * pd / 0.08) * 0.18 * p.pActive;

  // vignette + grain
  let vig = smoothstep(1.25, 0.35, length(uv - 0.5));
  col = col * mix(0.55, 1.0, vig) * p.intensity;
  col = col + (hash2(uvIn * vec2f(p.resX, p.resY) + vec2f(p.time * 7.0, 0.0)) - 0.5) * 0.03;

  return vec4f(col, 1.0);
}
`;

export interface FiberFlowProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Overall brightness multiplier. */
  intensity?: number;
  /** Field scale — higher zooms out to finer, denser fibers. */
  scale?: number;
  /** Fiber density multiplier (ridge comb frequency). */
  strands?: number;
  /** Fiber edge sharpness — higher = thinner, crisper strands. */
  sharp?: number;
  /** Deep fiber color (default indigo-950). */
  from?: string;
  /** Mid fiber color (default indigo-600). */
  to?: string;
  /** Strand-peak sheen color (default indigo-300). */
  accent?: string;
  /**
   * When true, the field parallaxes toward the pointer and a soft glow pocket
   * follows it. Off by default — the field stays pinned to the center.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const FIBER_FLOW_DEFAULTS = {
  speed: 1,
  intensity: 1,
  scale: 1.6,
  strands: 22,
  sharp: 6,
  from: "#1e1b4b",
  to: "#4f46e5",
  accent: "#a5b4fc",
} as const;

export const FIBER_FLOW_PRESETS = {
  classic: { speed: 1, intensity: 1, scale: 1.6, strands: 22, sharp: 6, from: "#1e1b4b", to: "#4f46e5", accent: "#a5b4fc" },
  ocean: { speed: 0.8, intensity: 1.05, scale: 1.9, strands: 26, sharp: 7, from: "#083344", to: "#0891b2", accent: "#67e8f9" },
  ember: { speed: 1.15, intensity: 1, scale: 1.5, strands: 18, sharp: 5, from: "#450a0a", to: "#ea580c", accent: "#fdba74" },
} as const;

export function FiberFlow({
  speed = FIBER_FLOW_DEFAULTS.speed,
  intensity = FIBER_FLOW_DEFAULTS.intensity,
  scale = FIBER_FLOW_DEFAULTS.scale,
  strands = FIBER_FLOW_DEFAULTS.strands,
  sharp = FIBER_FLOW_DEFAULTS.sharp,
  from = FIBER_FLOW_DEFAULTS.from,
  to = FIBER_FLOW_DEFAULTS.to,
  accent = FIBER_FLOW_DEFAULTS.accent,
  interactive = false,
  className,
  style,
  fallback,
}: FiberFlowProps) {
  const [wrapRef, pointer, pointerActive] = usePointerUniforms<HTMLDivElement>();
  const [res, setRes] = useState<[number, number]>([800, 600]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = el.getBoundingClientRect();
      setRes([Math.max(1, Math.round(r.width * dpr)), Math.max(1, Math.round(r.height * dpr))]);
    };
    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const c0 = hexToRgb01(from);
  const c1 = hexToRgb01(to);
  const c2 = hexToRgb01(accent);
  const px = interactive ? pointer.x : 0.5;
  const py = interactive ? pointer.y : 0.5;

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={FIBER_FLOW_SHADER}
        label="fiber-flow"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          scale,
          strands,
          sharp,
          px,
          py,
          pActive: pointerActive && interactive ? 1 : 0,
          resX: res[0],
          resY: res[1],
          c0r: c0[0],
          c0g: c0[1],
          c0b: c0[2],
          c1r: c1[0],
          c1g: c1[1],
          c1b: c1[2],
          c2r: c2[0],
          c2g: c2[1],
          c2b: c2[2],
        }}
      />
    </div>
  );
}
