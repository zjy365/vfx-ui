"use client";

import { useEffect, useState } from "react";
import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";
import { hexToRgb01 } from "../utils/color";

/**
 * SolarCorona — a blazing sun disk crowned with streaming corona light.
 *
 * The photosphere is a limb-darkened white-gold disk whose surface
 * granulation (high-frequency fbm cells) slowly boils; a red-shifted rim
 * marks the chromosphere. Beyond the limb, fbm-modulated streamers ray
 * outward with radial falloff and an angular pinprick pattern of long
 * polar plumes, over a faint star field. The pointer parallaxes the star
 * backdrop against the sun (opt-in).
 */
export const SOLAR_CORONA_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  rays: f32,
  corona: f32,
  granulation: f32,
  c0r: f32, c0g: f32, c0b: f32,
  c1r: f32, c1g: f32, c1b: f32,
  c2r: f32, c2g: f32, c2b: f32,
  px: f32,
  py: f32,
  resX: f32,
  resY: f32,
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
  for (var i = 0; i < 4; i++) {
    v += amp * noise(q);
    m += amp;
    q = q * 2.05 + vec2f(3.1, 7.7);
    amp = amp * 0.5;
  }
  return v / m;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = vec2f(uvIn.x, 1.0 - uvIn.y); // bottom-origin, y-up
  let aspect = p.resX / max(p.resY, 1.0);
  let t = p.time * p.speed;

  let core = vec3f(p.c0r, p.c0g, p.c0b);
  let crown = vec3f(p.c1r, p.c1g, p.c1b);
  let rim = vec3f(p.c2r, p.c2g, p.c2b);

  // Deep space base.
  var col = vec3f(0.006, 0.007, 0.012);

  // The sun sits slightly above center; the star backdrop parallaxes
  // against it when the pointer moves.
  let sun = vec2f(0.5, 0.56);
  let pp = vec2f(uv.x * aspect, uv.y);
  let sp = vec2f(sun.x * aspect, sun.y);
  let r = distance(pp, sp);
  let ang = atan2(pp.y - sp.y, pp.x - sp.x);

  // ---- Star backdrop (drawn first, behind everything) ----
  let starPar = (vec2f(p.px, p.py) - vec2f(0.5)) * 0.02;
  let suv = uvIn + starPar;
  let sg = floor(suv * vec2f(150.0, 90.0));
  let sh = hash21(sg);
  if (sh > 0.996) {
    let sd = length(fract(suv * vec2f(150.0, 90.0)) - vec2f(0.5)) * 2.0;
    let tw = 0.55 + 0.45 * sin(t * 1.9 + sh * 40.0);
    col += vec3f(0.85, 0.9, 1.0) * exp(-sd * sd * 9.0) * tw * 0.55;
  }

  // ---- Corona ----
  // Streamer field: fbm over angle and radius, sheared outward over time
  // so filaments stream away from the limb.
  let streamArg = vec2f(ang * 3.0, r * 2.4 - t * 0.12);
  let streamers = fbm(streamArg);
  let coronaFall = exp(-max(r - 0.20, 0.0) * (3.4 - 1.6 * streamers)) * p.corona;
  // Long polar plumes: sparse angular spikes with individual lengths.
  let plume = pow(abs(sin(ang * p.rays * 0.5 + fbm(vec2f(ang * 4.0, 3.7)) * 2.0)), 24.0);
  let plumeLen = 0.30 + 0.28 * hash21(vec2f(floor(ang * p.rays * 0.5 / 3.14159), 1.7));
  let plumeFall = exp(-max(r - 0.20, 0.0) / plumeLen) * plume;
  // Inner haze hugging the limb.
  let haze = exp(-max(r - 0.20, 0.0) * 16.0) * 0.5;

  var coronaCol = crown * coronaFall * (0.45 + 0.8 * streamers);
  coronaCol = coronaCol + crown * plumeFall * 0.65;
  coronaCol = coronaCol + mix(crown, core, 0.4) * haze;
  col += coronaCol * p.intensity * 0.8 * smoothstep(0.16, 0.22, r);

  // ---- Photosphere ----
  let disk = smoothstep(0.205, 0.196, r); // 1 inside the disk
  if (disk > 0.001) {
    // Boiling granulation: high-frequency cells drifting over the surface.
    let gArg = (pp - sp) * 26.0 + vec2f(t * 0.05, -t * 0.03);
    let gran = fbm(gArg * (1.5 + p.granulation * 2.0));
    let gran2 = fbm(gArg * 3.2 + vec2f(t * 0.07, 0.0));
    let boil = mix(gran, gran2, 0.5);
    // Limb darkening: the edge of the disk is dimmer and redder.
    let limb = smoothstep(0.205, 0.10, r);
    var surf = core * (0.75 + 0.5 * boil);
    surf = surf * mix(0.55, 1.05, limb);
    surf = mix(surf, surf * crown * 1.6, 1.0 - limb);
    // Chromosphere rim: a thin red-shifted band just inside the limb.
    surf = mix(surf, rim * 1.2, smoothstep(0.13, 0.20, r) * 0.6);
    col = mix(col, surf, disk);
  }

  // Outer chromosphere ring bleeding just past the limb.
  col += rim * exp(-abs(r - 0.208) * 60.0) * 0.45 * p.intensity;

  // Lens bloom: a wide soft halo around the whole sun.
  col += crown * exp(-r * r * 4.0) * 0.06 * p.intensity;

  // Vignette + dither.
  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.30 * dot(v, v) * 2.0;
  col += vec3f((hash21(uvIn * 743.1 + t) - 0.5) / 255.0 * 1.5);
  return vec4f(col, 1.0);
}
`;

export interface SolarCoronaProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Overall brightness of the corona and disk. */
  intensity?: number;
  /** Number of long polar plumes around the limb. */
  rays?: number;
  /** Corona reach — higher means streamers extend farther. */
  corona?: number;
  /** Surface granulation detail — higher means finer boiling cells. */
  granulation?: number;
  /** Photosphere core color (white-hot disk). */
  from?: string;
  /** Corona streamer color. */
  to?: string;
  /** Chromosphere rim color (the red-shifted edge). */
  accent?: string;
  /**
   * When true, the pointer parallaxes the star backdrop against the sun.
   * Off by default — the sun sits still.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const SOLAR_CORONA_DEFAULTS = {
  speed: 1,
  intensity: 1,
  rays: 18,
  corona: 1,
  granulation: 0.7,
  from: "#fff6d8",
  to: "#ffb347",
  accent: "#ff5470",
} as const;

export const SOLAR_CORONA_PRESETS = {
  gold: { speed: 1, intensity: 1, rays: 18, corona: 1, granulation: 0.7, from: "#fff6d8", to: "#ffb347", accent: "#ff5470" },
  sapphire: { speed: 0.85, intensity: 0.95, rays: 24, corona: 1.15, granulation: 0.9, from: "#eef6ff", to: "#60a5fa", accent: "#818cf8" },
  whiteDwarf: { speed: 1.2, intensity: 1.05, rays: 30, corona: 0.85, granulation: 0.5, from: "#ffffff", to: "#d1d5db", accent: "#f87171" },
} as const;

export function SolarCorona({
  speed = SOLAR_CORONA_DEFAULTS.speed,
  intensity = SOLAR_CORONA_DEFAULTS.intensity,
  rays = SOLAR_CORONA_DEFAULTS.rays,
  corona = SOLAR_CORONA_DEFAULTS.corona,
  granulation = SOLAR_CORONA_DEFAULTS.granulation,
  from = SOLAR_CORONA_DEFAULTS.from,
  to = SOLAR_CORONA_DEFAULTS.to,
  accent = SOLAR_CORONA_DEFAULTS.accent,
  interactive = false,
  className,
  style,
  fallback,
}: SolarCoronaProps) {
  const [wrapRef, pointer] = usePointerUniforms<HTMLDivElement>({ enabled: interactive });
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

  const a = hexToRgb01(from);
  const b = hexToRgb01(to);
  const c = hexToRgb01(accent);
  const ptr = interactive ? pointer : POINTER_REST;

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={SOLAR_CORONA_SHADER}
        label="solar-corona"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          rays,
          corona,
          granulation,
          c0r: a[0], c0g: a[1], c0b: a[2],
          c1r: b[0], c1g: b[1], c1b: b[2],
          c2r: c[0], c2g: c[1], c2b: c[2],
          px: ptr.x,
          py: ptr.y,
          resX: res[0],
          resY: res[1],
        }}
      />
    </div>
  );
}
