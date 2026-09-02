"use client";

import { useEffect, useState } from "react";
import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { usePointerUniforms } from "../usePointerUniforms.ts";
import { hexToRgb01 } from "../utils/color";

/**
 * LightPrism — a frosted glass prism floating on warm paper, with a white
 * light beam crossing the page and refracting through it.
 *
 * An original vfx-ui design recreating the "minimal prism hero" visual
 * family: a half-plane-intersection SDF triangle reads as thick glass
 * (tinted body, dark inner wall, bright rounded rim), a soft cast shadow
 * anchors it to the page, and the beam is a distance-to-line field whose
 * sampling coordinate is displaced across the prism — so the ray visibly
 * bends at the glass. Three displacement strengths (R/G/B) split the
 * beam into spectral fringes, the signature of real dispersion. The
 * background is paper: warm base, drifting light pools, fine grain.
 */
export const LIGHT_PRISM_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  prismSize: f32,
  beamWidth: f32,
  refraction: f32,
  dispersion: f32,
  shadow: f32,
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

/// Signed distance to an upward equilateral triangle (half-plane
/// intersection) centered at origin with circumradius r. Subtracting a
/// constant rounds the corners outward.
fn sdTriangle(pp: vec2f, r: f32) -> f32 {
  let v1 = vec2f(-0.8660254 * r, -0.5 * r);
  let v2 = vec2f(0.8660254 * r, -0.5 * r);
  let dBottom = -(pp.y + 0.5 * r);
  let dLeft = dot(pp - v1, vec2f(-0.8660254, 0.5));
  let dRight = dot(pp - v2, vec2f(0.8660254, 0.5));
  return max(max(dBottom, dLeft), dRight);
}

/// Beam profile: tight luminous core over a wide soft halo.
fn beamCore(g: f32, w: f32) -> f32 {
  let s = g / w;
  return exp(-s * s) + 0.22 * exp(-s * s * 0.05);
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = vec2f(uvIn.x, 1.0 - uvIn.y);
  let aspect = p.resX / max(p.resY, 1.0);
  let t = p.time * p.speed * 0.22;
  let q = vec2f((uv.x - 0.5) * aspect, uv.y - 0.5);
  let ptr = vec2f((p.px - 0.5) * aspect, 0.5 - p.py);

  // --- paper base with drifting light pools ---
  let paper = vec3f(p.c0r, p.c0g, p.c0b);
  var col = paper * (1.0 + 0.06 * (uv.y - 0.5));
  let pull = ptr * 0.12 * p.pActive;
  let pool1 = vec2f(-0.28, 0.40) + pull + vec2f(0.05 * sin(t * 0.7), 0.03 * cos(t * 0.5));
  let pool2 = vec2f(0.46, 0.30) + pull * 0.7 + vec2f(0.04 * cos(t * 0.6), 0.03 * sin(t * 0.8));
  let pool3 = vec2f(0.02, -0.58) + vec2f(0.05 * sin(t * 0.4 + 2.0), 0.0);
  col = col + vec3f(0.130) * exp(-dot(q - pool1, q - pool1) / 0.045);
  col = col + vec3f(0.100) * exp(-dot(q - pool2, q - pool2) / 0.060);
  col = col + vec3f(0.055) * exp(-dot(q - pool3, q - pool3) / 0.100);

  // --- prism geometry ---
  let R = p.prismSize;
  let pc = q - vec2f(0.0, 0.08);
  let sd = sdTriangle(pc, R) - 0.018;
  let inside = smoothstep(0.0, -0.010, sd);
  let rim = exp(-abs(sd) / 0.0055);

  // cast shadow: the prism stretched toward the lower right, soft-edged
  let shP = (q - vec2f(0.115, -0.185) - vec2f(0.0, 0.08)) * vec2f(1.0, 0.85);
  let sdSh = sdTriangle(shP, R * 1.02) - 0.018;
  let sh = smoothstep(0.055, -0.030, sdSh) * p.shadow;
  col = col * (1.0 - 0.16 * sh);

  // glass body: tinted, darker than the paper, frosted micro-noise;
  // a darker inner band reads as the thickness of the glass wall
  let glass = vec3f(p.c1r, p.c1g, p.c1b);
  let frost = (vnoise(pc * 90.0 + vec2f(t * 0.6, -t * 0.4)) - 0.5) * 0.035;
  var body = mix(col, col * 0.55 + glass * 0.42, 0.85) + frost;
  body = body * (1.0 - 0.18 * smoothstep(-0.075, -0.002, sd));
  col = mix(col, body, inside);
  // bright rounded rim, strongest on the faces turned toward the light
  col = col + vec3f(0.85) * rim * (0.34 + 0.30 * smoothstep(-0.2, 0.5, pc.y)) * 0.55;

  // --- refracted beam ---
  // The beam is a distance-to-line field; its sampling coordinate is
  // displaced along the line normal across the prism's x-extent, so the
  // ray bends entering and straightens exiting. R/G/B get different
  // displacement strengths — dispersion fringes at the transition.
  let theta = 0.30 + (p.px - 0.5) * 0.45 * p.pActive;
  let dirv = vec2f(cos(theta), sin(theta));
  let nrm = vec2f(-dirv.y, dirv.x);
  let A = vec2f(0.0, -0.05);
  let ramp = smoothstep(-R * 0.95, R * 0.95, q.x);
  let lift = p.refraction * ramp;
  let w = max(p.beamWidth, 0.0008);
  let gR = dot(q - nrm * (lift * (1.0 + p.dispersion * 0.45)) - A, nrm);
  let gG = dot(q - nrm * lift - A, nrm);
  let gB = dot(q - nrm * (lift * (1.0 - p.dispersion * 0.45)) - A, nrm);
  let beam = vec3f(p.c2r, p.c2g, p.c2b) * vec3f(beamCore(gR, w), beamCore(gG, w), beamCore(gB, w));
  col = col + beam * 0.9;

  // --- finish ---
  let vq = q * vec2f(0.7, 1.0);
  col = col * (1.0 - 0.10 * dot(vq, vq));
  col = col + (hash2(uvIn * vec2f(p.resX, p.resY) + vec2f(t * 13.0, 0.0)) - 0.5) * 0.022;
  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
}
`;

export interface LightPrismProps {
  /** Animation speed multiplier (light pools drift, frost shimmers). */
  speed?: number;
  /** Prism circumradius in normalized-height units. */
  prismSize?: number;
  /** Half-width of the beam core. */
  beamWidth?: number;
  /** How far the beam is displaced crossing the glass. */
  refraction?: number;
  /** Spectral fringe strength (R/G/B displacement split). */
  dispersion?: number;
  /** Cast-shadow strength. */
  shadow?: number;
  /** Paper base color. */
  from?: string;
  /** Prism glass tint. */
  to?: string;
  /** Beam color (default pure white). */
  accent?: string;
  /**
   * When true, the beam tilts and the light pools drift toward the
   * pointer. Off by default — a calm, pointer-free backdrop.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const LIGHT_PRISM_DEFAULTS = {
  speed: 1,
  prismSize: 0.3,
  beamWidth: 0.0045,
  refraction: 0.16,
  dispersion: 0.22,
  shadow: 1,
  from: "#e9e6df",
  to: "#a8a49b",
  accent: "#ffffff",
} as const;

export const LIGHT_PRISM_PRESETS = {
  paper: {
    speed: 1, prismSize: 0.3, beamWidth: 0.0045, refraction: 0.16,
    dispersion: 0.22, shadow: 1, from: "#e9e6df", to: "#a8a49b", accent: "#ffffff",
  },
  moonstone: {
    speed: 0.9, prismSize: 0.32, beamWidth: 0.004, refraction: 0.19,
    dispersion: 0.8, shadow: 0.9, from: "#e4e7ec", to: "#93a3b8", accent: "#f2f7ff",
  },
  amber: {
    speed: 1.1, prismSize: 0.28, beamWidth: 0.005, refraction: 0.14,
    dispersion: 0.35, shadow: 1.1, from: "#efe6d8", to: "#b39a76", accent: "#fff3d9",
  },
} as const;

export function LightPrism({
  speed = LIGHT_PRISM_DEFAULTS.speed,
  prismSize = LIGHT_PRISM_DEFAULTS.prismSize,
  beamWidth = LIGHT_PRISM_DEFAULTS.beamWidth,
  refraction = LIGHT_PRISM_DEFAULTS.refraction,
  dispersion = LIGHT_PRISM_DEFAULTS.dispersion,
  shadow = LIGHT_PRISM_DEFAULTS.shadow,
  from = LIGHT_PRISM_DEFAULTS.from,
  to = LIGHT_PRISM_DEFAULTS.to,
  accent = LIGHT_PRISM_DEFAULTS.accent,
  interactive = false,
  className,
  style,
  fallback,
}: LightPrismProps) {
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
        shader={LIGHT_PRISM_SHADER}
        label="light-prism"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          prismSize,
          beamWidth,
          refraction,
          dispersion,
          shadow,
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
