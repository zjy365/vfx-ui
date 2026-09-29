"use client";

import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * StarTide — a field of stars drifting on slow luminous waves.
 *
 * Two hashed star grids ride a shared interference wave field (crossed
 * sines over drifting fbm): neighboring stars displace together, so the
 * whole sky visibly sloshes like a tide. Stars brighten on wave crests
 * and twinkle on their own phases; a faint glow trace makes the wave
 * itself readable between the stars. The pointer stirs the wave phase
 * (opt-in).
 */
export const STAR_TIDE_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  density: f32,
  waveAmp: f32,
  waveFreq: f32,
  twinkle: f32,
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
    q = q * 2.15 + vec2f(4.3, 8.9);
    amp = amp * 0.5;
  }
  return v / m;
}

// The shared tide: crossed directional sines over a drifting fbm swell.
// Returned in -1..1; both the star offsets and their glow sample this.
fn tide(p: vec2f, t: f32, freq: f32) -> f32 {
  let a = sin(p.x * freq + t * 0.9);
  let b = sin((p.x * 0.6 + p.y * 1.1) * freq - t * 0.7 + 1.9);
  let c = sin((p.y * 1.4 - p.x * 0.3) * freq + t * 0.5 + 4.1);
  let swell = fbm(p * 1.6 + vec2f(t * 0.05, -t * 0.04)) - 0.5;
  return (a * 0.4 + b * 0.35 + c * 0.25 + swell * 0.8);
}

// One star layer: cell-hashed stars, displaced by the tide and brightened
// where the wave crests. Fine layers are smaller and more numerous.
fn starLayer(uv: vec2f, t: f32, grid: f32, seed: f32, fine: f32, freq: f32, amp: f32, star: vec3f, glow: vec3f, tw: f32) -> vec3f {
  var col = vec3f(0.0);
  let g = grid * 2.0;
  let cell = uv * g;
  let base = floor(cell);
  // Sample neighbors too, so a star pushed out of its cell still renders.
  for (var j = -1; j <= 1; j++) {
    for (var k = -1; k <= 1; k++) {
      let id = base + vec2f(f32(j), f32(k));
      let h0 = hash21(id + vec2f(seed, seed * 2.3));
      if (h0 > 0.52) {
        let h1 = hash21(id + vec2f(seed + 19.7, seed + 3.1));
        let h2 = hash21(id + vec2f(seed + 7.9, seed + 43.7));
        // Rest position inside the cell, then the tide carries the star.
        let rest = (vec2f(h1, h2) * 0.5 + 0.25) / g;
        let pos = id / g + rest;
        let w = tide(pos, t, freq);
        let cur = pos + vec2f(w, sin(w * 1.7 + h0 * 6.2831)) * amp;
        let d = length(uv - cur);
        let size = (0.0016 + 0.0028 * fine) * (0.6 + h0);
        var bright = (0.45 + 0.75 * h1) * smoothstep(0.55, 0.95, h0);
        // Crest bloom: stars flare where the tide runs high.
        bright *= 0.65 + 0.7 * clamp(w * 0.5 + 0.5, 0.0, 1.0);
        // Personal twinkle phase.
        bright *= 1.0 - tw * 0.5 * (0.5 + 0.5 * sin(t * (1.5 + 2.5 * h2) + h0 * 40.0));
        let core = exp(-d * d / (size * size));
        let halo = exp(-d * d / (size * size * 42.0)) * 0.16;
        col = col + star * (core + halo) * bright + glow * core * 0.20;
      }
    }
  }
  return col;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = vec2f(uvIn.x, 1.0 - uvIn.y); // bottom-origin, y-up
  let t = p.time * p.speed;

  // The pointer leans on the tide: waves phase toward it.
  let push = (p.px - 0.5) * 2.4;

  let deep = vec3f(p.c0r, p.c0g, p.c0b);
  let star = vec3f(p.c1r, p.c1g, p.c1b);
  let glow = vec3f(p.c2r, p.c2g, p.c2b);

  // Night-sea sky base.
  var col = mix(deep, deep * 2.4 + vec3f(0.01, 0.015, 0.03), uv.y);

  // The visible wave: soft glow tracing the tide's crests.
  let w0 = tide(uv + vec2f(push * 0.1, 0.0), t, p.waveFreq);
  let crest = clamp(w0 * 0.5 + 0.5, 0.0, 1.0);
  col += glow * pow(crest, 3.0) * 0.10;

  // Two star layers riding the same tide at different scales.
  col += starLayer(uv, t, 26.0 * p.density, 3.7, 1.0, p.waveFreq, p.waveAmp * 0.045, star, glow, p.twinkle) * 1.0;
  col += starLayer(uv, t, 14.0 * p.density, 11.3, 0.45, p.waveFreq * 0.8, p.waveAmp * 0.06, star, glow, p.twinkle * 0.7) * 1.3;

  // A moon-glow gradient anchors the top of the frame.
  let md = distance(uv, vec2f(0.78, 0.88));
  col += vec3f(0.75, 0.82, 1.0) * exp(-md * md * 9.0) * 0.10;

  col *= p.intensity;

  // Vignette + dither.
  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.36 * dot(v, v) * 2.2;
  col += vec3f((hash21(uvIn * 683.9 + t) - 0.5) / 255.0 * 1.5);
  return vec4f(col, 1.0);
}
`;

export interface StarTideProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Overall brightness of the star field. */
  intensity?: number;
  /** Star count multiplier. */
  density?: number;
  /** How far stars travel on the wave. */
  waveAmp?: number;
  /** Spatial frequency of the wave field. */
  waveFreq?: number;
  /** Per-star flicker depth (0 = steady, 1 = heavy twinkle). */
  twinkle?: number;
  /** Night-sky base color. */
  from?: string;
  /** Star color. */
  to?: string;
  /** Wave-crest glow color. */
  accent?: string;
  /**
   * When true, the pointer leans on the tide — waves phase toward it.
   * Off by default — the tide runs on its own.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const STAR_TIDE_DEFAULTS = {
  speed: 1,
  intensity: 1,
  density: 1,
  waveAmp: 1,
  waveFreq: 6,
  twinkle: 0.5,
  from: "#050818",
  to: "#dbe7ff",
  accent: "#5eead4",
} as const;

export const STAR_TIDE_PRESETS = {
  midnight: { speed: 1, intensity: 1, density: 1, waveAmp: 1, waveFreq: 6, twinkle: 0.5, from: "#050818", to: "#dbe7ff", accent: "#5eead4" },
  nebulaTide: { speed: 0.8, intensity: 1.05, density: 1.2, waveAmp: 1.3, waveFreq: 4.5, twinkle: 0.35, from: "#0d0618", to: "#ffe3f1", accent: "#c084fc" },
  bioluminescent: { speed: 1.15, intensity: 0.95, density: 0.85, waveAmp: 1.5, waveFreq: 7, twinkle: 0.65, from: "#01131a", to: "#d9fef2", accent: "#2dd4bf" },
} as const;

export function StarTide({
  speed = STAR_TIDE_DEFAULTS.speed,
  intensity = STAR_TIDE_DEFAULTS.intensity,
  density = STAR_TIDE_DEFAULTS.density,
  waveAmp = STAR_TIDE_DEFAULTS.waveAmp,
  waveFreq = STAR_TIDE_DEFAULTS.waveFreq,
  twinkle = STAR_TIDE_DEFAULTS.twinkle,
  from = STAR_TIDE_DEFAULTS.from,
  to = STAR_TIDE_DEFAULTS.to,
  accent = STAR_TIDE_DEFAULTS.accent,
  interactive = false,
  className,
  style,
  fallback,
}: StarTideProps) {
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
        shader={STAR_TIDE_SHADER}
        label="star-tide"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          density,
          waveAmp,
          waveFreq,
          twinkle,
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
