import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * Aurora curtains: fbm-perturbed Gaussian light bands drifting over a dark sky.
 */
export const AURORA_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  bands: f32,
  c0r: f32, c0g: f32, c0b: f32,
  c1r: f32, c1g: f32, c1b: f32,
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
    q = q * 2.07 + vec2f(3.7, 8.1);
    amp = amp * 0.5;
  }
  return v / m;
}

// Two-layer starfield, dimmed wherever the aurora is bright. Stars are
// distance-decayed points inside their cell, never hard-lit full cells.
fn stars(uv: vec2f, t: f32, suppress: f32) -> vec3f {
  var col = vec3f(0.0);
  let g1 = floor(uv * 220.0);
  let s1 = hash21(g1);
  if (s1 > 0.9965) {
    let tw = 0.55 + 0.45 * sin(t * 2.1 + s1 * 40.0);
    let d1 = length(fract(uv * 220.0) - 0.5) * 2.0;
    col += vec3f(0.9, 0.93, 1.0) * tw * 0.7 * exp(-d1 * d1 * 9.0);
  }
  let g2 = floor(uv * 90.0 + vec2f(31.7));
  let s2 = hash21(g2);
  if (s2 > 0.998) {
    let d2 = length(fract(uv * 90.0 + vec2f(31.7)) - 0.5) * 2.0;
    col += vec3f(1.0, 0.98, 0.9) * 1.1 * exp(-d2 * d2 * 7.0);
  }
  return col * suppress;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;

  // Night sky: deep blue gradient, darkest at the top.
  var col = mix(vec3f(0.008, 0.012, 0.03), vec3f(0.02, 0.035, 0.07), uvIn.y);

  var aurora = vec3f(0.0);
  let count = clamp(p.bands, 1.0, 5.0);
  // The pointer sways the curtains sideways and lifts them gently.
  let ax = uvIn.x + (p.px - 0.5) * 0.6;
  let lift = (0.5 - p.py) * 0.1;
  for (var i = 0; i < 5; i++) {
    if (f32(i) >= count) { break; }
    let fi = f32(i);

    // Curtain lower edge: a fbm ridge drifting sideways, unique per band.
    let drift = t * (0.13 + 0.04 * fi);
    let edge = 0.14 + 0.09 * fi + lift
      + (fbm(vec2(ax * (1.6 + 0.3 * fi) + fi * 9.4, drift)) - 0.5) * 0.13
      + sin(ax * (2.1 + 0.4 * fi) + fi * 2.7 + t * 0.18) * 0.025;
    // Height above the sharp lower edge (positive = up into the curtain).
    let h = edge - uvIn.y;

    // Sharp lower edge, exponential falloff upward, curtain hangs in the sky.
    let body = exp(-h * (2.6 + fi * 0.35)) * smoothstep(-0.004, 0.014, h) * smoothstep(0.0, 0.22, uvIn.y);

    // Vertical rays along the curtain, animated.
    let rays = 0.45 + 0.75 * fbm(vec2(ax * (16.0 + fi * 5.0) + fi * 13.0, drift * 2.2));

    // Green at the edge fading to violet as rays rise.
    let heightMix = exp(-h * 1.1);
    let curtainCol = mix(vec3f(p.c0r, p.c0g, p.c0b), vec3f(p.c1r, p.c1g, p.c1b), clamp(1.0 - heightMix, 0.0, 1.0));

    let bright = (0.4 + 0.6 * heightMix) * body * rays;
    aurora += curtainCol * bright;
  }

  aurora = aurora * p.intensity * 0.6;
  col += aurora;
  col += stars(uvIn, t, 1.0 - clamp(aurora.g + aurora.b, 0.0, 0.85)) * 0.8;

  // Faint horizon glow at the very bottom keeps the frame grounded.
  col += vec3f(0.012, 0.02, 0.045) * pow(clamp((uvIn.y - 0.82) / 0.18, 0.0, 1.0), 2.0);

  // Vignette + dither.
  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.35 * dot(v, v) * 2.2;
  col += vec3f((hash21(uvIn * 731.0 + t) - 0.5) / 255.0 * 1.5);
  return vec4f(col, 1.0);
}
`;

export interface AuroraProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Overall brightness of the curtains. */
  intensity?: number;
  /** Number of visible bands (1-5). */
  bands?: number;
  /** Dominant curtain color. */
  primary?: string;
  /** Secondary curtain color, mixed per band. */
  secondary?: string;
  /** When true, the curtains sway and lift with the pointer. */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const AURORA_DEFAULTS = {
  speed: 0.7,
  intensity: 0.85,
  bands: 3,
  primary: "#2dd4bf",
  secondary: "#818cf8",
} as const;

export const AURORA_PRESETS = {
  emerald: { primary: "#34d399", secondary: "#60a5fa", speed: 0.65, intensity: 0.9, bands: 3 },
  violet: { primary: "#a78bfa", secondary: "#f472b6", speed: 0.55, intensity: 0.8, bands: 4 },
  arctic: { primary: "#7dd3fc", secondary: "#c4b5fd", speed: 0.8, intensity: 0.75, bands: 2 },
} as const;

export function Aurora({
  speed = AURORA_DEFAULTS.speed,
  intensity = AURORA_DEFAULTS.intensity,
  bands = AURORA_DEFAULTS.bands,
  primary = AURORA_DEFAULTS.primary,
  secondary = AURORA_DEFAULTS.secondary,
  interactive = false,
  className,
  style,
  fallback,
}: AuroraProps) {
  const a = hexToRgb01(primary);
  const b = hexToRgb01(secondary);
  const [wrapRef, pointer] = usePointerUniforms<HTMLDivElement>();
  const ptr = interactive ? pointer : POINTER_REST;
  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={AURORA_SHADER}
        label="aurora"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          bands,
          c0r: a[0], c0g: a[1], c0b: a[2],
          c1r: b[0], c1g: b[1], c1b: b[2],
          px: ptr.x,
          py: ptr.y,
        }}
      />
    </div>
  );
}
