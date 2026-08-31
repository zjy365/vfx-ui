"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";

/**
 * TimelineArc — 1:1 port of the milestone dial on sealos.run/about-us
 * (app/[locale]/(landing)/about-us/sections/MilestoneSection.tsx).
 *
 * The original dial is a raster SVG (ticked-disk.svg) tilted into 3D with CSS
 * `perspective(900px) + rotateX(-60deg) rotateY(-16deg)`; scroll spins the
 * disk (rotateZ, 18° per milestone) so the active year stays anchored at the
 * callout position. This port replaces the raster with a procedural WGSL dial
 * (same radii/angles measured from the SVG) and reuses the exact CSS 3D
 * transform stack, so the browser does the perspective warp for the canvas,
 * the year labels and the hexagon markers identically.
 *
 * The callout (dashed leader + annotation) lives in screen space, anchored to
 * the active marker's measured position — same as the source.
 */

// --- 3D transform stack (DIAL_3D_CONFIG) ---
const PERSPECTIVE_PX = 900;
const TILT_X_DEG = -60;
const TILT_Y_DEG = -16;

// --- dial layout (DIAL_LAYOUT_CONFIG) ---
const START_ANGLE_DEG = 108; // 90 + 18
const STEP_ANGLE_DEG = -18;
const LABEL_RADIUS_RATIO = 0.348;
const MARKER_RADIUS_RATIO = 0.385;
const MARKER_ROTATE_OFFSET_DEG = 30;
const LABEL_ROTATE_OFFSET_DEG = 90;
const LABEL_TEXT_ROTATE_DEG = 180;

// --- scroll behavior (DIAL_SCROLL_CONFIG) ---
const ACTIVE_END_PROGRESS = 0.88;
const SPIN_PER_STEP_DEG = 18;
const SCROLL_VH_PER_MILESTONE = 56;
const EXTRA_SCROLL_VH = 72;

// --- dial box: source caps at max-w-3xl (768px) then scale:2 ---
const MAX_DIAL_PX = 1536;

// --- callout (CALLOUT_LINE_CONFIG) ---
const CALLOUT = {
  kinkSlope: 28.26 / 33.52,
  baselineYRatio: 0.62,
  endPaddingPx: 16,
  textOffsetYPx: 10,
  minGapAboveMarkerPx: 24,
  minSegmentWidthPx: 160,
  dash: "2 2",
} as const;

const HEX_CLIP_PATH =
  "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0 50%)";

// --- dial texture geometry, measured from ticked-disk.svg (viewBox 998, r=499) ---
const DISK_R = 456.5 / 499; // 0.9148 — #fafafa paper disk
const TICK_GRAY: [number, number] = [438.4 / 499, 476.5 / 499]; // #d9d9d9, every 3°
const TICK_DARK: [number, number] = [410.8 / 499, 446.5 / 499]; // #605d5d, every 3°
const TICK_MAJOR: [number, number] = [406.2 / 499, 483.5 / 499]; // accent, every 18°
const DOT_R = 371.6 / 499; // 0.7447 — accent dotted ring, every 2.5°
const DOT_SIZE = 1.238 / 499;
const TICK_W = 1 / 499; // SVG stroke-width 1

const f = (n: number) => n.toFixed(6);

export const TIMELINE_ARC_SHADER = /* wgsl */ `
struct Params {
  resX: f32,
  resY: f32,
  cr: f32, cg: f32, cb: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash2(pIn: vec2f) -> f32 {
  var p = fract(pIn * vec2f(123.34, 456.21));
  p = p + dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Coverage of a radial ruler tick: nearest segment at fixed angle, r in [r0, r1],
// dev = arc-length distance from the tick's centerline.
fn tickCov(dev: f32, r: f32, r0: f32, r1: f32, halfW: f32, pxU: f32) -> f32 {
  let dr = max(max(r0 - r, r - r1), 0.0);
  let dist = length(vec2f(dev, dr));
  return 1.0 - smoothstep(halfW - pxU * 0.6, halfW + pxU, dist);
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let halfMin = 0.5 * min(p.resX, p.resY);
  let d = (uvIn - vec2f(0.5)) * vec2f(p.resX, p.resY) / halfMin; // y-down, 1 = half canvas
  let r = length(d);
  let theta = atan2(d.y, d.x);
  let pxU = 1.0 / halfMin;
  let accent = vec3f(p.cr, p.cg, p.cb);

  // premultiplied compositor: dst over src
  var acc = vec4f(0.0);

  // --- paper disk (#fafafa) with print grain ---
  let disk = 1.0 - smoothstep(${f(DISK_R)} - pxU, ${f(DISK_R)} + pxU, r);
  if (disk > 0.0) {
    var paper = vec3f(0.980, 0.980, 0.980);
    paper += (hash2(uvIn * vec2f(p.resX, p.resY)) - 0.5) * 0.012;
    acc = vec4f(paper * disk, disk);
  }

  let halfW = max(${f(TICK_W)} * 0.5, pxU * 0.55);

  // --- minor ruler ticks, every 3° ---
  let stepMin = 0.0523599;
  let aMin = round(theta / stepMin) * stepMin;
  let devMin = (theta - aMin) * r;
  let dark = tickCov(devMin, r, ${f(TICK_DARK[0])}, ${f(TICK_DARK[1])}, halfW, pxU);
  if (dark > 0.0) {
    let c = vec3f(0.376, 0.365, 0.365);
    acc = vec4f(c * dark + acc.rgb * (1.0 - dark), dark + acc.a * (1.0 - dark));
  }
  let gray = tickCov(devMin, r, ${f(TICK_GRAY[0])}, ${f(TICK_GRAY[1])}, halfW, pxU);
  if (gray > 0.0) {
    let c = vec3f(0.851, 0.851, 0.851);
    acc = vec4f(c * gray + acc.rgb * (1.0 - gray), gray + acc.a * (1.0 - gray));
  }

  // --- dotted ring, every 2.5° at r = ${f(DOT_R)} ---
  let stepDot = 0.0436332;
  let aDot = round(theta / stepDot) * stepDot;
  let dotPos = vec2f(cos(aDot), sin(aDot)) * ${f(DOT_R)};
  let dotR = max(${f(DOT_SIZE)}, pxU * 1.1);
  let dotA = 1.0 - smoothstep(dotR - pxU * 0.6, dotR + pxU, distance(d, dotPos));
  if (dotA > 0.0) {
    acc = vec4f(accent * dotA + acc.rgb * (1.0 - dotA), dotA + acc.a * (1.0 - dotA));
  }

  // --- major ruler ticks, every 18° (one per milestone step) ---
  let stepMaj = 0.3141593;
  let aMaj = round(theta / stepMaj) * stepMaj;
  let devMaj = (theta - aMaj) * r;
  let maj = tickCov(devMaj, r, ${f(TICK_MAJOR[0])}, ${f(TICK_MAJOR[1])}, halfW, pxU);
  if (maj > 0.0) {
    acc = vec4f(accent * maj + acc.rgb * (1.0 - maj), maj + acc.a * (1.0 - maj));
  }

  return acc;
}
`;

export interface TimelineArcProps {
  /** Milestone year labels on the dial. */
  years?: string[];
  /** Index of the highlighted milestone (hexagon + callout). Ignored when scrollProgress is set. */
  activeIndex?: number;
  /** Annotation text at the end of the dashed callout line. */
  annotation?: string;
  /** Per-milestone annotations; overrides `annotation` when present. */
  annotations?: string[];
  /** Animation speed (active marker pulse). 0 disables the pulse. */
  speed?: number;
  /** Accent color for major ticks, dot ring, marker and callout. */
  accent?: string;
  /**
   * Scroll-driven progress 0..1. When provided it overrides activeIndex:
   * the disk spins (18° per milestone) so the active year stays anchored —
   * the interaction used on sealos.run/about-us. See useScrollProgress.
   */
  scrollProgress?: number;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const TIMELINE_ARC_DEFAULTS = {
  years: ["2018", "2021", "2022", "2023", "2024", "2025"],
  activeIndex: 1,
  speed: 1,
  accent: "#005bff",
} as const;

export const TIMELINE_ARC_PRESETS = {
  classic: { speed: 1, accent: "#005bff" },
  emerald: { speed: 0.8, accent: "#059669" },
  violet: { speed: 1.2, accent: "#7c3aed" },
} as const;

/**
 * Drives TimelineArc from page scroll: progress goes 0 -> 1 as the element
 * travels from entering the viewport bottom to reaching the top third.
 * Returns [ref, progress]; attach ref to the component's outer wrapper or a
 * parent section. This reproduces the scroll-scrubbed milestone interaction.
 */
export function useScrollProgress<T extends HTMLElement>(): [
  RefObject<T | null>,
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
  annotations,
  speed = TIMELINE_ARC_DEFAULTS.speed,
  accent = TIMELINE_ARC_DEFAULTS.accent,
  scrollProgress,
  className,
  style,
  fallback,
}: TimelineArcProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dialBoxRef = useRef<HTMLDivElement | null>(null);
  const markerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [dialSize, setDialSize] = useState(0);
  const [res, setRes] = useState<[number, number]>([1024, 1024]);
  const [callout, setCallout] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const count = years.length;
  const continuousStep =
    scrollProgress != null
      ? Math.min(1, Math.max(0, scrollProgress / ACTIVE_END_PROGRESS)) * Math.max(count - 1, 0)
      : Math.min(Math.max(activeIndex, 0), Math.max(count - 1, 0));
  const spinDeg = continuousStep * SPIN_PER_STEP_DEG;
  const activeIdx =
    count === 0
      ? null
      : scrollProgress != null
        ? scrollProgress >= ACTIVE_END_PROGRESS
          ? null
          : Math.min(count - 1, Math.round(continuousStep))
        : Math.min(count - 1, Math.max(0, Math.round(activeIndex)));
  const accentRgb = hexToRgb01(accent);
  const calloutText = activeIdx != null ? (annotations?.[activeIdx] ?? annotation) : undefined;

  // Dial box layout size (px) — drives label/marker radii and canvas resolution.
  useEffect(() => {
    const el = dialBoxRef.current;
    if (!el) return;
    const update = () => {
      const s = Math.max(0, Math.min(el.offsetWidth, el.offsetHeight));
      setDialSize(s);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      setRes([Math.max(1, Math.round(s * dpr)), Math.max(1, Math.round(s * dpr))]);
    };
    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Measure the active marker's projected screen position for the callout.
  useEffect(() => {
    if (activeIdx == null) {
      setCallout(null);
      return;
    }
    let raf = 0;
    const measure = () => {
      const stage = stageRef.current;
      const marker = markerRefs.current[activeIdx];
      if (!stage || !marker) return;
      const sr = stage.getBoundingClientRect();
      const mr = marker.getBoundingClientRect();
      const next = {
        x: mr.left - sr.left + mr.width / 2,
        y: mr.top - sr.top + mr.height / 2,
        w: sr.width,
        h: sr.height,
      };
      setCallout((prev) =>
        prev &&
        Math.abs(prev.x - next.x) < 0.5 &&
        Math.abs(prev.y - next.y) < 0.5 &&
        Math.abs(prev.w - next.w) < 0.5 &&
        Math.abs(prev.h - next.h) < 0.5
          ? prev
          : next,
      );
    };
    // Measure immediately (transforms are already committed at effect time),
    // then keep measuring briefly while the spin transition settles.
    measure();
    const start = performance.now();
    const loop = () => {
      measure();
      if (performance.now() - start < 450) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [activeIdx, spinDeg, dialSize]);

  const tilt = `rotateX(${TILT_X_DEG}deg) rotateY(${TILT_Y_DEG}deg) rotateZ(${spinDeg}deg)`;
  const labelR = dialSize * LABEL_RADIUS_RATIO;
  const markerR = dialSize * MARKER_RADIUS_RATIO;

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", ...style }}
    >
      {speed > 0 ? (
        <style>{`@keyframes vfx-ta-pulse{0%,100%{opacity:1}50%{opacity:.55}}`}</style>
      ) : null}
      <div
        ref={stageRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: `${PERSPECTIVE_PX}px`,
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          ref={dialBoxRef}
          style={{ position: "relative", width: `min(200%, ${MAX_DIAL_PX}px)`, aspectRatio: "1 / 1", flex: "none" }}
        >
          {/* procedural dial, far side faded by the same mask as the source.
              absolute inset-0: the canvas must not size itself from its own
              backing-store aspect (the source img had an intrinsic square). */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              contain: "paint",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,1) calc(100% + 1rem))",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,1) calc(100% + 1rem))",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                transformStyle: "preserve-3d",
                transform: tilt,
                backfaceVisibility: "hidden",
              }}
            >
              <VfxCanvas
                shader={TIMELINE_ARC_SHADER}
                label="timeline-arc"
                animate={false}
                style={{ width: "100%", height: "100%" }}
                fallback={fallback}
                uniforms={{
                  resX: res[0],
                  resY: res[1],
                  cr: accentRgb[0],
                  cg: accentRgb[1],
                  cb: accentRgb[2],
                }}
              />
            </div>
          </div>

          {/* year labels + hexagon markers ride the same tilted plane */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformStyle: "preserve-3d",
              transform: tilt,
              backfaceVisibility: "hidden",
              pointerEvents: "none",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              {years.map((year, i) => {
                const angleDeg = START_ANGLE_DEG + i * STEP_ANGLE_DEG;
                const rad = (angleDeg * Math.PI) / 180;
                const lx = Math.cos(rad) * labelR;
                const ly = Math.sin(rad) * labelR;
                const mx = Math.cos(rad) * markerR;
                const my = Math.sin(rad) * markerR;
                const active = i === activeIdx;
                return (
                  <div key={`${year}-${i}`}>
                    <div
                      ref={(el) => {
                        markerRefs.current[i] = el;
                      }}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: 12,
                        height: 12,
                        background: accent,
                        clipPath: HEX_CLIP_PATH,
                        transform: `translate3d(calc(-50% + ${mx.toFixed(2)}px), calc(-50% + ${my.toFixed(2)}px), 0px) rotateZ(${(angleDeg + MARKER_ROTATE_OFFSET_DEG).toFixed(2)}deg)`,
                        transformOrigin: "50% 50%",
                        opacity: active ? 1 : 0,
                        transition: "opacity 250ms ease-in-out",
                        animation:
                          active && speed > 0
                            ? `vfx-ta-pulse ${(2 / Math.max(speed, 0.01)).toFixed(2)}s ease-in-out infinite`
                            : undefined,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        fontSize: 9,
                        lineHeight: 1,
                        color: "#64748b",
                        userSelect: "none",
                        transform: `translate3d(calc(-50% + ${lx.toFixed(2)}px), calc(-50% + ${ly.toFixed(2)}px), 0px) rotateZ(${(angleDeg + LABEL_ROTATE_OFFSET_DEG).toFixed(2)}deg) rotateX(0deg)`,
                        transformOrigin: "50% 100%",
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          transform: `rotateZ(${LABEL_TEXT_ROTATE_DEG}deg)`,
                          transformOrigin: "50% 50%",
                        }}
                      >
                        {year}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* screen-space callout: dashed leader + annotation */}
        {activeIdx != null && callout ? (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {(() => {
              const baseY = Math.max(1, callout.h * CALLOUT.baselineYRatio);
              const desiredMaxY = Math.max(1, callout.y - CALLOUT.minGapAboveMarkerPx);
              const baselineY = Math.min(baseY, desiredMaxY);
              const dy = Math.max(0, callout.y - baselineY);
              const endX = callout.w - CALLOUT.endPaddingPx;
              const kinkXRaw = callout.x + dy * CALLOUT.kinkSlope;
              const kinkX = Math.max(8, Math.min(kinkXRaw, endX - CALLOUT.minSegmentWidthPx));
              return (
                <>
                  <svg
                    style={{ position: "absolute", inset: 0, color: accent }}
                    width="100%"
                    height="100%"
                    aria-hidden="true"
                  >
                    <path
                      d={`M ${callout.x.toFixed(2)} ${callout.y.toFixed(2)} L ${kinkX.toFixed(2)} ${baselineY.toFixed(2)} L ${endX.toFixed(2)} ${baselineY.toFixed(2)}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1}
                      strokeDasharray={CALLOUT.dash}
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  {calloutText ? (
                    <div
                      style={{
                        position: "absolute",
                        left: endX,
                        top: baselineY - CALLOUT.textOffsetYPx,
                        transform: "translate(-100%, -100%)",
                        maxWidth: Math.max(1, endX - kinkX - 8),
                        width: "100%",
                        textAlign: "right",
                        fontSize: 16,
                        fontWeight: 500,
                        lineHeight: 1.2,
                        color: "#0f172a",
                        overflowWrap: "break-word",
                        textWrap: "balance",
                      }}
                    >
                      {calloutText}
                    </div>
                  ) : null}
                </>
              );
            })()}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Self-contained scroll-driven demo: an inner scroll region spins the dial
 * through the milestones, so the interaction works inside a docs preview
 * without wiring page scroll. Mirrors the sealos.run/about-us scroll pacing
 * (56vh per milestone + 72vh extra). When used with the default milestone
 * years and no annotation props, it shows the sealos.run milestone copy.
 */
const DEMO_ANNOTATIONS: Record<string, string> = {
  "2018": "2018 年 8 月，提交第一行代码，解决 Kubernetes 高可用安装复杂、缺乏文档的问题。",
  "2021": "2021 年，项目霸榜 GitHub 趋势榜，并获得奇绩创坛（陆奇团队）投资。",
  "2022": "2022 年 3 月，推出 v4.0 版本，引入集群镜像能力，实现“一次构建，到处运行”。",
  "2023": "2023 年 6 月，Sealos 公有云版本正式上线。",
  "2024": "2024 年 12 月，获得阿里云战略投资，并发布 Sealos 5.0。",
  "2025": "2025 年，累计注册用户超 30 万，在线应用服务超 5 万。",
};

export function TimelineArcScrollDemo(props: TimelineArcProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const years = props.years ?? [...TIMELINE_ARC_DEFAULTS.years];
  const annotations =
    props.annotations ??
    (props.annotation == null ? years.map((y) => DEMO_ANNOTATIONS[y] ?? y) : undefined);

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

  const scrollRegionPct = years.length * SCROLL_VH_PER_MILESTONE + EXTRA_SCROLL_VH;

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
      {/* tall spacer creates the scroll distance; the dial is sticky */}
      <div style={{ height: `${scrollRegionPct}%` }}>
        <div style={{ position: "sticky", top: 0, height: `${(10000 / scrollRegionPct).toFixed(3)}%` }}>
          <TimelineArc {...props} annotations={annotations} scrollProgress={progress} />
        </div>
      </div>
    </div>
  );
}
