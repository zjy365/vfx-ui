"use client";

import { useEffect, useRef, useState } from "react";
import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";

/**
 * TimelineArc — a spiral-timeline backdrop in the style of sealos.run/about-us:
 * a huge elliptical arc sweeping the viewport with ruler ticks, year labels
 * (DOM, positioned by the same math), a highlighted hexagon milestone node,
 * and a dashed leader line to an annotation block. The GPU draws arc, ticks,
 * node, dashes and a marching dotted "future path"; text stays in the DOM.
 *
 * Geometry contract (shared by the WGSL below and the label placement):
 * workspace is y-up, x scaled by aspect; 1 unit == resY pixels (isotropic).
 */

const CX_T = 0.52; // center x as a fraction of the aspect-scaled width
const CY = 1.18; // center y (above the viewport: arc dips through it)
const RX_T = 0.58; // radius x, same scaling
const RY = 1.06;
const ARC_A0 = -2.7053; // -155°: where the drawn arc starts (top-left edge)
const ARC_A1 = -0.3142; // -18°: where it ends (right edge)
const YEAR_A0 = -2.6012; // -149°: first year label angle
const YEAR_A1 = -1.1868; // -68°: last year label angle
const MINORS = 5; // minor ticks between consecutive year ticks
const LEADER_DX = 0.13;
const LEADER_DY = 0.34;

const f = (n: number) => n.toFixed(6);

export const TIMELINE_ARC_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  activeT: f32,
  yearCount: f32,
  cr: f32, cg: f32, cb: f32,
  resX: f32,
  resY: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn sdSeg(p: vec2f, a: vec2f, b: vec2f) -> vec2f {
  let pa = p - a;
  let ba = b - a;
  let h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return vec2f(length(pa - ba * h), h);
}

fn sdHex(pIn: vec2f, r: f32) -> f32 {
  var p = abs(pIn);
  p = p - 2.0 * min(dot(vec2f(-0.8660254, 0.5), p), 0.0) * vec2f(-0.8660254, 0.5);
  p = p - vec2f(clamp(p.x, -0.5773503 * r, 0.5773503 * r), r);
  return length(p) * sign(p.y);
}

fn hash2(pIn: vec2f) -> f32 {
  var p = fract(pIn * vec2f(123.34, 456.21));
  p = p + dot(p, p + 45.32);
  return fract(p.x * p.y);
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let aspect = p.resX / p.resY;
  let wp = vec2f(uvIn.x * aspect, 1.0 - uvIn.y); // y-up, isotropic
  let pxU = 1.0 / p.resY; // one pixel in workspace units
  let C = vec2f(${f(CX_T)} * aspect, ${f(CY)});
  let rad = vec2f(${f(RX_T)} * aspect, ${f(RY)});
  let minRad = min(rad.x, rad.y);
  let accent = vec3f(p.cr, p.cg, p.cb);
  let t = p.time * p.speed;

  let q = (wp - C) / rad; // unit-circle space of the ellipse
  let lq = length(q);
  let ang = atan2(q.y, q.x);
  let activeAng = mix(${f(YEAR_A0)}, ${f(YEAR_A1)}, p.activeT);

  var col = vec3f(0.986, 0.989, 0.996); // near-white paper
  // Paper grain: kills flat runs and reads as print texture.
  col += (hash2(wp * vec2f(p.resX, p.resY) / max(p.resX, 1.0) * 512.0) - 0.5) * 0.012;

  // --- main arc ---
  let dArc = abs(lq - 1.0) * minRad;
  let arcMask = smoothstep(${f(ARC_A0)} - 0.01, ${f(ARC_A0)} + 0.01, ang) *
                (1.0 - smoothstep(${f(ARC_A1)} - 0.01, ${f(ARC_A1)} + 0.01, ang));
  let arcA = (1.0 - smoothstep(pxU * 0.9, pxU * 1.9, dArc)) * arcMask;
  col = mix(col, vec3f(0.741, 0.792, 0.878), arcA * 0.9);

  // --- dotted future path (inside the arc, after the active node) ---
  if (ang > activeAng && ang < ${f(ARC_A1)}) {
    let q2 = (wp - C) / (rad - vec2f(0.032));
    let dDot = abs(length(q2) - 1.0) * minRad;
    let dash = fract((ang - activeAng) * 34.0 - t * 0.35);
    let dotA = (1.0 - smoothstep(pxU * 0.7, pxU * 1.6, dDot)) * step(dash, 0.42);
    col = mix(col, accent * 0.72 + vec3f(0.28), dotA * 0.85);
  }

  // --- ruler ticks ---
  let tickStep = (${f(YEAR_A1)} - ${f(YEAR_A0)}) / ((p.yearCount - 1.0) * ${f(MINORS)});
  let tickA0 = ${f(YEAR_A0)} - 2.0 * tickStep;
  for (var i = 0; i < 128; i++) {
    let a = tickA0 + f32(i) * tickStep;
    if (a > ${f(ARC_A1)}) { break; }
    let dir = vec2f(cos(a), sin(a));
    let T = C + rad * dir;
    let n = normalize(vec2f(dir.x / rad.x, dir.y / rad.y));
    let j = (f32(i) - 2.0) / ${f(MINORS)};
    let isMajor = abs(j - round(j)) < 0.01 && j >= 0.0 && j < p.yearCount;
    let len = select(0.020, 0.052, isMajor);
    let seg = sdSeg(wp, T - n * len * 0.72, T + n * len * 0.28);
    let aa = 1.0 - smoothstep(pxU * 0.8, pxU * 1.8, seg.x);
    let past = select(0.0, 1.0, a <= activeAng);
    var tickCol = mix(vec3f(0.733, 0.773, 0.835), accent, select(0.0, 0.55, isMajor));
    tickCol = mix(tickCol, accent * 0.85 + vec3f(0.15), past * select(0.35, 0.15, isMajor));
    col = mix(col, tickCol, aa * select(0.75, 0.95, isMajor));
  }

  // --- dashed leader: node -> elbow -> right edge ---
  let N = C + rad * vec2f(cos(activeAng), sin(activeAng));
  let E = N + vec2f(${f(LEADER_DX)}, ${f(LEADER_DY)});
  let End = vec2f(aspect * 0.985, E.y);
  let dashLen = 0.016;
  let s1 = sdSeg(wp, N, E);
  let s2 = sdSeg(wp, E, End);
  let len1 = distance(N, E);
  let ph1 = fract(s1.y * len1 / dashLen - t * 0.22);
  let ph2 = fract((s2.y * distance(E, End) + len1) / dashLen - t * 0.22);
  let leadA = (1.0 - smoothstep(pxU * 0.8, pxU * 1.7, s1.x)) * step(ph1, 0.5) +
              (1.0 - smoothstep(pxU * 0.8, pxU * 1.7, s2.x)) * step(ph2, 0.5);
  col = mix(col, accent, clamp(leadA, 0.0, 1.0) * 0.8);

  // --- milestone node: hexagon + pulse ring ---
  let dHex = sdHex(wp - N, 0.016);
  col = mix(col, accent, (1.0 - smoothstep(-pxU, pxU, dHex)) * 0.96);
  let pulseR = 0.030 + 0.008 * sin(t * 2.1);
  let ring = smoothstep(0.004, 0.0012, abs(distance(wp, N) - pulseR)) * (0.5 + 0.5 * sin(t * 2.1 - 1.2));
  col = mix(col, accent, ring * 0.35);

  return vec4f(col, 1.0);
}
`;

export interface TimelineArcProps {
  /** Year labels along the arc. */
  years?: string[];
  /** Index of the highlighted milestone (hexagon + leader line). */
  activeIndex?: number;
  /** Annotation text at the end of the dashed leader line. */
  annotation?: string;
  /** Animation speed (dash march + node pulse). */
  speed?: number;
  /** Accent color for node, major ticks and dashes. */
  accent?: string;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const TIMELINE_ARC_DEFAULTS = {
  years: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
  activeIndex: 4,
  speed: 1,
  accent: "#2563eb",
} as const;

export const TIMELINE_ARC_PRESETS = {
  classic: { speed: 1, accent: "#2563eb" },
  emerald: { speed: 0.8, accent: "#059669" },
  violet: { speed: 1.2, accent: "#7c3aed" },
} as const;

/** Workspace point for a param angle; mirrored 1:1 in the shader. */
function arcPoint(a: number, aspect: number): { x: number; y: number; rot: number } {
  const cx = CX_T * aspect;
  const rx = RX_T * aspect;
  const x = cx + rx * Math.cos(a);
  const y = CY + RY * Math.sin(a);
  // CSS rotation of the tangent (y flips between y-up math and y-down CSS).
  const rot = (Math.atan2(-(RY * Math.cos(a)), -rx * Math.sin(a)) * 180) / Math.PI;
  return { x, y, rot };
}

export function TimelineArc({
  years = [...TIMELINE_ARC_DEFAULTS.years],
  activeIndex = TIMELINE_ARC_DEFAULTS.activeIndex,
  annotation,
  speed = TIMELINE_ARC_DEFAULTS.speed,
  accent = TIMELINE_ARC_DEFAULTS.accent,
  className,
  style,
  fallback,
}: TimelineArcProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [res, setRes] = useState<[number, number]>([1600, 1000]);

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
  }, []);

  const aspect = res[0] / res[1];
  const count = Math.max(years.length, 2);
  const activeT = Math.min(Math.max(activeIndex, 0), count - 1) / (count - 1);
  const accentRgb = hexToRgb01(accent);
  const activeAng = YEAR_A0 + (YEAR_A1 - YEAR_A0) * activeT;
  const node = arcPoint(activeAng, aspect);
  const elbow = { x: node.x + LEADER_DX, y: node.y + LEADER_DY };

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", ...style }}
    >
      <VfxCanvas
        shader={TIMELINE_ARC_SHADER}
        label="timeline-arc"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          activeT,
          yearCount: count,
          cr: accentRgb[0],
          cg: accentRgb[1],
          cb: accentRgb[2],
          resX: res[0],
          resY: res[1],
        }}
      />
      {years.map((year, i) => {
        const a = YEAR_A0 + (YEAR_A1 - YEAR_A0) * (i / (count - 1));
        const pt = arcPoint(a, aspect);
        // Nudge labels inward along the ellipse normal.
        const nx = Math.cos(a) / (RX_T * aspect);
        const ny = Math.sin(a) / RY;
        const nl = Math.hypot(nx, ny) || 1;
        const lx = pt.x - (nx / nl) * 0.055;
        const ly = pt.y - (ny / nl) * 0.055;
        const active = i === Math.round(activeT * (count - 1));
        return (
          <span
            key={year}
            style={{
              position: "absolute",
              left: `${(lx / aspect) * 100}%`,
              top: `${(1 - ly) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${pt.rot}deg)`,
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              letterSpacing: "0.04em",
              color: active ? accent : "#7c8aa5",
              userSelect: "none",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {year}
          </span>
        );
      })}
      {annotation ? (
        <div
          style={{
            position: "absolute",
            left: `${(elbow.x / aspect) * 100 + 1.5}%`,
            top: `${(1 - elbow.y) * 100}%`,
            transform: "translateY(-50%)",
            maxWidth: "46%",
            fontSize: 15,
            lineHeight: 1.6,
            color: "#1e293b",
            background: "rgba(255,255,255,0.72)",
            padding: "2px 6px",
            pointerEvents: "none",
          }}
        >
          {annotation}
        </div>
      ) : null}
    </div>
  );
}
