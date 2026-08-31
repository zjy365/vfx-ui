"use client";

import { useEffect, useRef, useState } from "react";
import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";

/**
 * TimelineArc — 1:1 port of the milestone timeline on sealos.run/about-us.
 *
 * A huge pair of concentric elliptical arcs sweeps the viewport like a
 * protractor: ruler ticks radiate outward (long at each year, short between),
 * year labels ride the tangent, and the active milestone is a solid dot with a
 * 1px dashed leader (diagonal then horizontal) running to an annotation.
 * Years after the active one trace a marching dotted "future path".
 *
 * Geometry contract (shared by the WGSL below and the label placement):
 * workspace is y-up, x scaled by aspect; 1 unit == resY pixels (isotropic).
 * Supports scroll-driven progress via `scrollProgress` (see useScrollProgress).
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
const RING_GAP = 0.030; // gap between the two concentric arcs
const LEADER_DX = 0.16;
const LEADER_DY = 0.30;

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
  col += (hash2(wp * vec2f(p.resX, p.resY) / max(p.resX, 1.0) * 512.0) - 0.5) * 0.02;

  let arcMask = smoothstep(${f(ARC_A0)} - 0.01, ${f(ARC_A0)} + 0.01, ang) *
                (1.0 - smoothstep(${f(ARC_A1)} - 0.01, ${f(ARC_A1)} + 0.01, ang));

  // --- twin concentric arcs, hairline-thin and faint ---
  let dOuter = abs(lq - 1.0) * minRad;
  let qIn = (wp - C) / (rad - vec2f(${f(RING_GAP)}));
  let dInner = abs(length(qIn) - 1.0) * minRad;
  let hairline = pxU * 1.1; // ~1 device pixel
  let arcA = (1.0 - smoothstep(hairline, hairline * 2.2, dOuter)) +
             (1.0 - smoothstep(hairline, hairline * 2.2, dInner));
  col = mix(col, vec3f(0.741, 0.792, 0.878), clamp(arcA, 0.0, 1.0) * arcMask * 0.85);

  // --- ruler ticks radiating OUTWARD from the arc ---
  let tickStep = (${f(YEAR_A1)} - ${f(YEAR_A0)}) / ((p.yearCount - 1.0) * ${f(MINORS)});
  let tickA0 = ${f(YEAR_A0)} - 2.0 * tickStep;
  for (var i = 0; i < 128; i++) {
    let a = tickA0 + f32(i) * tickStep;
    if (a > ${f(ARC_A1)}) { break; }
    let dir = vec2f(cos(a), sin(a));
    let n = normalize(vec2f(dir.x / rad.x, dir.y / rad.y)); // outward ellipse normal
    let T = C + rad * dir;
    let j = (f32(i) - 2.0) / ${f(MINORS)};
    let isMajor = abs(j - round(j)) < 0.01 && j >= 0.0 && j < p.yearCount;
    let len = select(0.026, 0.062, isMajor);
    // ticks extend outward from the arc line
    let seg = sdSeg(wp, T + n * 0.004, T + n * (0.004 + len));
    let aa = 1.0 - smoothstep(pxU * 0.8, pxU * 1.9, seg.x);
    let past = select(0.0, 1.0, a <= activeAng);
    // mostly neutral gray; only the active year tick picks up the accent
    var tickCol = mix(vec3f(0.698, 0.745, 0.831), vec3f(0.56, 0.604, 0.686), select(0.0, 1.0, isMajor));
    tickCol = mix(tickCol, accent, past * select(0.0, 0.85, isMajor));
    col = mix(col, tickCol, aa * select(0.7, 0.95, isMajor));
  }

  // --- dotted future path along the inner arc, after the active node ---
  if (ang > activeAng && ang < ${f(ARC_A1)}) {
    let q2 = (wp - C) / (rad - vec2f(${f(RING_GAP)}));
    let dDot = abs(length(q2) - 1.0) * minRad;
    let dash = fract((ang - activeAng) * 40.0 - t * 0.3);
    let dotA = (1.0 - smoothstep(pxU * 0.7, pxU * 1.5, dDot)) * step(dash, 0.4);
    col = mix(col, accent * 0.6 + vec3f(0.4), dotA * 0.7);
  }

  // --- 1px dashed leader: node -> diagonal -> long horizontal run ---
  let N = C + rad * vec2f(cos(activeAng), sin(activeAng));
  let E = N + vec2f(${f(LEADER_DX)}, ${f(LEADER_DY)});
  let End = vec2f(aspect * 0.995, E.y);
  let dashLen = 0.008; // matches the site's 2px-on 2px-off rhythm
  let s1 = sdSeg(wp, N, E);
  let s2 = sdSeg(wp, E, End);
  let len1 = distance(N, E);
  let ph1 = fract(s1.y * len1 / dashLen - t * 0.15);
  let ph2 = fract((s2.y * distance(E, End) + len1) / dashLen - t * 0.15);
  let hair = pxU * 0.9;
  let leadA = (1.0 - smoothstep(hair, hair * 2.0, s1.x)) * step(ph1, 0.5) +
              (1.0 - smoothstep(hair, hair * 2.0, s2.x)) * step(ph2, 0.5);
  col = mix(col, accent * 0.7 + vec3f(0.3), clamp(leadA, 0.0, 1.0) * 0.75);

  // --- milestone node: solid dot + thin outer ring ---
  let dNode = distance(wp, N);
  let dotR = 0.013;
  col = mix(col, accent, (1.0 - smoothstep(dotR - pxU, dotR + pxU, dNode)) * 0.97);
  let ringR = 0.026;
  let ring = (1.0 - smoothstep(pxU * 0.9, pxU * 2.0, abs(dNode - ringR)));
  col = mix(col, accent * 0.75 + vec3f(0.25), ring * 0.8);
  let pulseR = 0.036 + 0.010 * sin(t * 1.8);
  let pulse = smoothstep(0.005, 0.0012, abs(dNode - pulseR)) * (0.4 + 0.4 * sin(t * 1.8 - 1.2));
  col = mix(col, accent, pulse * 0.28);

  return vec4f(col, 1.0);
}
`;

export interface TimelineArcProps {
  /** Year labels along the arc. */
  years?: string[];
  /** Index of the highlighted milestone (dot + leader line). Ignored when scrollProgress is set. */
  activeIndex?: number;
  /** Annotation text at the end of the dashed leader line. */
  annotation?: string;
  /** Animation speed (dash march + node pulse). */
  speed?: number;
  /** Accent color for node, active tick and dashes. */
  accent?: string;
  /**
   * Scroll-driven progress 0..1. When provided it overrides activeIndex and
   * the component drives the active milestone from page scroll position —
   * the interaction used on sealos.run/about-us. See useScrollProgress.
   */
  scrollProgress?: number;
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

/**
 * Drives TimelineArc from page scroll: progress goes 0 -> 1 as the element
 * travels from entering the viewport bottom to reaching the top third.
 * Returns [ref, progress]; attach ref to the component's outer wrapper or a
 * parent section. This reproduces the scroll-scrubbed milestone interaction.
 */
export function useScrollProgress<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  number,
] {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the element's top hits the viewport bottom, 1 when its center
      // reaches ~35% from the top — tuned to the sealos about-us pacing.
      const raw = (vh - r.top) / (vh * 0.65 + r.height * 0.5);
      setProgress(Math.min(1, Math.max(0, raw)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return [ref, progress];
}

export function TimelineArc({
  years = [...TIMELINE_ARC_DEFAULTS.years],
  activeIndex = TIMELINE_ARC_DEFAULTS.activeIndex,
  annotation,
  speed = TIMELINE_ARC_DEFAULTS.speed,
  accent = TIMELINE_ARC_DEFAULTS.accent,
  scrollProgress,
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
  const effectiveT =
    scrollProgress != null
      ? Math.min(1, Math.max(0, scrollProgress))
      : Math.min(Math.max(activeIndex, 0), count - 1) / (count - 1);
  const activeT = effectiveT;
  const accentRgb = hexToRgb01(accent);
  const activeAng = YEAR_A0 + (YEAR_A1 - YEAR_A0) * activeT;
  const node = arcPoint(activeAng, aspect);
  const elbow = { x: node.x + LEADER_DX, y: node.y + LEADER_DY };
  const activeIdx = Math.round(activeT * (count - 1));

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
        // Labels sit just inside the arc along the ellipse normal.
        const nx = Math.cos(a) / (RX_T * aspect);
        const ny = Math.sin(a) / RY;
        const nl = Math.hypot(nx, ny) || 1;
        const lx = pt.x - (nx / nl) * 0.052;
        const ly = pt.y - (ny / nl) * 0.052;
        const active = i === activeIdx;
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
              color: active ? accent : "#94a3b8",
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
            left: `${(elbow.x / aspect) * 100 + 2}%`,
            top: `${(1 - elbow.y) * 100}%`,
            transform: "translateY(-50%)",
            maxWidth: "46%",
            fontSize: 17,
            fontWeight: 600,
            lineHeight: 1.55,
            color: "#0f172a",
            letterSpacing: "-0.01em",
            pointerEvents: "none",
          }}
        >
          {annotation}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Self-contained scroll-driven demo: an inner scroll region drives the
 * milestone progress, so the interaction works inside a docs preview without
 * wiring page scroll. This is how sealos.run/about-us behaves on page scroll;
 * here the scroll region stands in for the page.
 */
export function TimelineArcScrollDemo(props: TimelineArcProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, el.scrollTop / total)) : 0);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={scrollRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflowY: "auto",
        background: "#ffffff",
      }}
    >
      {/* tall spacer creates the scroll distance; the arc is sticky */}
      <div style={{ height: "320%" }}>
        <div style={{ position: "sticky", top: 0, height: "31.25%" }}>
          <TimelineArc {...props} scrollProgress={progress} />
        </div>
      </div>
    </div>
  );
}
