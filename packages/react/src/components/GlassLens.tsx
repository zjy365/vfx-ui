"use client";

import { useEffect, useState } from "react";
import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * GlassLens — a floating liquid-glass pill lens over a living color field.
 *
 * An original vfx-ui take on the Apple "Liquid Glass" visual family
 * (iOS 26 / the kube.io refraction write-up): instead of waving the whole
 * page (LiquidGlass) or paning a card (GlassCard), a stadium-shaped lens
 * floats over a bright drifting scene and bends *that scene* through real
 * cylindrical-lens math. The displacement comes from the gradient of a
 * paraboloid bulge profile (sqrt(1 - r^2)) across the pill's short axis, so
 * light bends hardest at the rim and slides straight through the middle —
 * the same optics that make a glass rod invert its background at the edge.
 * RGB channels refract at three strengths (dispersion), the rim gathers a
 * rotating specular line, and a pointer glare pool tracks the cursor when
 * interactive.
 */
export const GLASS_LENS_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  refraction: f32,
  dispersion: f32,
  blur: f32,
  rim: f32,
  tintR: f32, tintG: f32, tintB: f32,
  px: f32,
  py: f32,
  pActive: f32,
  resX: f32,
  resY: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash21(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

/// PCG-style integer hash of the pixel coordinate: unlike a sin-hash it
/// cannot degenerate to a constant when the float argument is large or
/// quantized, so the output dither is guaranteed per-pixel.
fn hashU(x: u32, y: u32, salt: u32) -> f32 {
  var s = (x * 1973u + y * 9277u + salt * 26699u) * 747796405u + 2891336453u;
  var w = ((s >> ((s >> 28u) + 4u)) ^ s) * 2777777777u;
  return f32(((w >> 22u) ^ w) % 4096u) / 4096.0;
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
  for (var i = 0; i < 3; i++) {
    v += amp * noise(q);
    m += amp;
    q = q * 2.07 + vec2f(4.3, 8.1);
    amp = amp * 0.5;
  }
  return v / m;
}

/// The living backdrop: three saturated light pools drifting over a deep
/// slate field, warped by fbm so the glass always has structure to bend.
fn scene(p: vec2f, t: f32) -> vec3f {
  var col = mix(vec3f(0.031, 0.043, 0.078), vec3f(0.055, 0.075, 0.13), fbm(p * 1.6 - t * 0.02));
  let c1 = vec2f(0.28 + sin(t * 0.11) * 0.10, 0.66 + cos(t * 0.09) * 0.12);
  let c2 = vec2f(0.72 + cos(t * 0.08) * 0.10, 0.34 + sin(t * 0.13) * 0.12);
  let c3 = vec2f(0.52 + sin(t * 0.07 + 2.0) * 0.14, 0.82 + cos(t * 0.10 + 1.0) * 0.10);
  let w1 = fbm(p * 2.3 + vec2f(t * 0.05));
  let pool = exp(-length(p - c1) * length(p - c1) * 7.0);
  col += vec3f(0.16, 0.55, 0.98) * pool * (0.55 + 0.45 * w1);
  let pool2 = exp(-length(p - c2) * length(p - c2) * 8.5);
  col += vec3f(0.72, 0.32, 0.98) * pool2 * (0.55 + 0.45 * fbm(p * 2.9 - t * 0.04));
  let pool3 = exp(-length(p - c3) * length(p - c3) * 11.0);
  col += vec3f(0.98, 0.42, 0.55) * pool3 * 0.5;
  let pool4 = exp(-dot(p - vec2f(0.15 + t * 0.008, 0.22), p - vec2f(0.15 + t * 0.008, 0.22)) * 13.0);
  col += vec3f(0.98, 0.72, 0.28) * pool4 * 0.45;
  // Fine grain so the backdrop never reads as flat vector fill.
  col += (fbm(p * 38.0 + t * 0.1) - 0.5) * 0.02;
  return col;
}

/// Capsule SDF in aspect-corrected units: spine from (-hw,0) to (hw,0),
/// half-height h, centered on the lens center.
fn sdCapsule(p: vec2f, center: vec2f, hw: f32, h: f32) -> f32 {
  let q = p - center;
  let x = clamp(q.x, -hw, hw);
  return length(q - vec2f(x, 0.0)) - h;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;
  let aspect = p.resX / max(p.resY, 1.0);
  let pp = vec2f(uvIn.x * aspect, uvIn.y);

  // The pill: horizontal capsule, gently breathing bob + micro-tilt.
  let center = vec2f(aspect * 0.5, 0.5 + sin(t * 0.21) * 0.012);
  let hw = 0.30;
  let h = 0.085;
  let sd = sdCapsule(pp, center, hw, h);
  let inside = sd < 0.0;

  // Cylindrical-lens optics: normalized distance from the capsule spine.
  let spineX = clamp(pp.x - center.x, -hw, hw);
  let radial = (pp - vec2f(center.x + spineX, center.y)) / h; // (0, y/h) inside a lobe
  let r2 = clamp(dot(radial, radial), 0.0, 1.0);
  // Paraboloid bulge sqrt(1 - r^2): its slope explodes toward the rim.
  let slope = r2 / max(1.0 - r2, 0.12);
  let bendDir = normalize(radial + vec2f(1e-5, 0.0));
  let k = p.refraction * 0.020 * slope;

  var col = scene(uvIn, t);

  if (inside) {
    // Cylindrical-lens magnification: the pill shows a zoomed slice of the
    // scene along its short axis, and past the focal line (r2 > 0.6) the
    // view flips — the lateral inversion a real glass rod produces. Without
    // this the interior reads as flat fill over a smooth backdrop.
    let cu = vec2f(center.x / aspect, center.y);
    let zoom = mix(0.62, 1.0, r2);
    let sy = select(zoom, -0.85, r2 > 0.6);
    let base = cu + (uvIn - cu) * vec2f(1.0, sy);

    // RGB refract at three slightly different strengths: dispersion fringe.
    let oR = bendDir * (k * (1.0 - p.dispersion * 0.16));
    let oG = bendDir * k;
    let oB = bendDir * (k * (1.0 + p.dispersion * 0.16));

    // Depth-of-field: only the rim zone softens (the glass is thinnest
    // there, so its focal smear is widest). Center stays crisp.
    let rimWeight = smoothstep(0.25, 0.95, r2);
    let spread = p.blur * 0.004 * (1.0 + rimWeight * 3.0);
    let a = t * 0.7;
    let dirA = vec2f(cos(a), sin(a));
    let dirB = vec2f(cos(a + 2.09), sin(a + 2.09));
    let dirC = vec2f(cos(a + 4.19), sin(a + 4.19));

    var refrR = scene(base + oR, t) * 0.28;
    var refrG = scene(base + oG, t) * 0.28;
    var refrB = scene(base + oB, t) * 0.28;
    refrR += scene(base + oR + dirA * spread, t) * 0.24;
    refrG += scene(base + oG + dirA * spread, t) * 0.24;
    refrB += scene(base + oB + dirA * spread, t) * 0.24;
    refrR += scene(base + oR + dirB * spread, t) * 0.24;
    refrG += scene(base + oG + dirB * spread, t) * 0.24;
    refrB += scene(base + oB + dirB * spread, t) * 0.24;
    refrR += scene(base + oR + dirC * spread, t) * 0.24;
    refrG += scene(base + oG + dirC * spread, t) * 0.24;
    refrB += scene(base + oB + dirC * spread, t) * 0.24;
    let refr = vec3f(refrR.r, refrG.g, refrB.b) * 1.08;

    // Glass body: refracted scene, faint cool tint, interior sheen from the
    // surface slope (fake fresnel without a real view vector). The slope
    // blows up at the rim (it is the lens profile's derivative), so cap it —
    // uncapped it saturates the whole rim span to flat white.
    let tint = vec3f(p.tintR, p.tintG, p.tintB);
    col = mix(refr, refr * tint * 1.35 + tint * 0.05, 0.30);
    col += tint * min(slope * slope, 1.2) * 0.055;

    // Sweeping specular line, diagonal across the pill. Kept below
    // saturation: a plateau at pure white across the pill reads as banding.
    let sweep = fract(t * 0.06) * (hw * 2.0 + 0.8) - hw - 0.4;
    let sweepLine = (pp.x - center.x) + (pp.y - center.y) * 1.4 - sweep;
    col += vec3f(0.92, 0.96, 1.0) * exp(-abs(sweepLine) * 85.0) * 0.30;

    // Pointer glare pool (fades to zero at rest via pActive).
    let gp = vec2f(p.px * aspect, p.py) - pp;
    col += vec3f(0.9, 0.94, 1.0) * exp(-dot(gp, gp) * 26.0) * p.pActive * 0.30;
  }

  // Rim: bright edge line with a rotating directional light. The inner
  // bevel line below it is what sells the thickness of the glass. Both stay
  // below saturation: a rim that clamps to pure white along the pill's
  // straight span reads as one long flat band.
  let edge = exp(-abs(sd) * 520.0);
  let grad = normalize(pp - vec2f(center.x + spineX, center.y) + vec2f(1e-5));
  let lightA = t * 0.17;
  let lightDir = vec2f(cos(lightA), sin(lightA) * 0.4);
  let facing = 0.45 + 0.55 * max(dot(grad, lightDir), 0.0);
  col += vec3f(0.85, 0.92, 1.0) * edge * p.rim * facing * 0.42;
  let bevel = exp(-abs(sd + 0.006) * 420.0);
  col += vec3f(0.75, 0.85, 1.0) * bevel * p.rim * 0.14 * (1.0 - facing * 0.4);

  // Cast shadow grounding the lens on the page.
  let sh = sdCapsule(pp - vec2f(0.012, 0.028), center, hw, h + 0.02);
  let shadow = smoothstep(0.05, 0.0, sh) * (1.0 - edge * 2.0);
  col = mix(col, col * 0.55, clamp(shadow, 0.0, 1.0) * 0.45);

  // Soft-clip + dither so rims never plateau into flat white. Noise scales
  // up in the dark pool gradients where 8-bit steps band visibly. The dither
  // MUST come from integer pixel coordinates: float sin-hashes degenerate to
  // a constant along rows where the (smooth) scene has no variation, and the
  // gate reads that as banding.
  let lum = dot(col, vec3f(0.2126, 0.7152, 0.0722));
  col *= select(1.0, (0.85 + 0.15 * lum) / max(lum, 1e-3), lum > 0.85);
  let pc = vec2u(uvIn * vec2f(p.resX, p.resY));
  let dith = vec3f(
    hashU(pc.x, pc.y, 1u),
    hashU(pc.x, pc.y, 2u),
    hashU(pc.x, pc.y, 3u),
  );
  col += (dith - 0.5) * (8.0 + 6.0 * (1.0 - clamp(lum, 0.0, 1.0))) / 255.0;
  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
`;

export interface GlassLensProps {
  /** Backdrop drift and rim-light rotation speed. */
  speed?: number;
  /** Lens bending strength. */
  refraction?: number;
  /** RGB dispersion spread. */
  dispersion?: number;
  /** Rim depth-of-field softness. */
  blur?: number;
  /** Rim and bevel highlight strength. */
  rim?: number;
  /** Glass tint color. */
  tint?: string;
  /** When true, a specular glare pool tracks the pointer inside the lens. */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const GLASS_LENS_DEFAULTS = {
  speed: 1.0,
  refraction: 0.85,
  dispersion: 0.7,
  blur: 0.8,
  rim: 0.9,
  tint: "#cfe4ff",
} as const;

export const GLASS_LENS_PRESETS = {
  aqua: { speed: 1.0, refraction: 0.85, dispersion: 0.7, blur: 0.8, rim: 0.9, tint: "#cfe4ff" },
  prism: { speed: 1.3, refraction: 1.2, dispersion: 1.4, blur: 0.6, rim: 1.1, tint: "#e9d5ff" },
  honey: { speed: 0.7, refraction: 0.7, dispersion: 0.4, blur: 1.1, rim: 0.75, tint: "#ffe8c7" },
} as const;

export function GlassLens({
  speed = GLASS_LENS_DEFAULTS.speed,
  refraction = GLASS_LENS_DEFAULTS.refraction,
  dispersion = GLASS_LENS_DEFAULTS.dispersion,
  blur = GLASS_LENS_DEFAULTS.blur,
  rim = GLASS_LENS_DEFAULTS.rim,
  tint = GLASS_LENS_DEFAULTS.tint,
  interactive = false,
  className,
  style,
  fallback,
}: GlassLensProps) {
  const [wrapRef, pointer, pActive] = usePointerUniforms<HTMLDivElement>();
  const [res, setRes] = useState<[number, number]>([800, 600]);
  const c = hexToRgb01(tint);
  const ptr = interactive ? pointer : POINTER_REST;

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

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={GLASS_LENS_SHADER}
        label="glass-lens"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          refraction,
          dispersion,
          blur,
          rim,
          tintR: c[0], tintG: c[1], tintB: c[2],
          px: ptr.x,
          py: ptr.y,
          pActive: interactive && pActive ? 1 : 0,
          resX: res[0],
          resY: res[1],
        }}
      />
    </div>
  );
}
