import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * Domain-warped fbm noise blending a three-stop gradient into slow liquid motion.
 */
export const FLUID_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  warp: f32,
  scale: f32,
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
  for (var i = 0; i < 5; i++) {
    v += amp * noise(q);
    m += amp;
    q = q * 2.02 + vec2f(1.7, 4.3);
    amp = amp * 0.5;
  }
  return v / m;
}

fn dither(uv: vec2f) -> f32 {
  return (hash21(uv * 831.7) - 0.5) / 255.0 * 1.6;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;
  // Pointer parallax: the liquid plane slides gently against the cursor.
  let uv = (uvIn - vec2f(0.5) - (vec2f(p.px, p.py) - 0.5) * 0.16) * p.scale;

  // Triple nested domain warp (Iñigo Quilez's oil-paint recipe): q warps r,
  // r warps the final field. Each layer drifts at its own speed.
  let q = vec2f(
    fbm(uv + vec2f(t * 0.21, -t * 0.14)),
    fbm(uv + vec2f(5.2, 1.3) - vec2f(t * 0.17, t * 0.11)),
  );
  let r = vec2f(
    fbm(uv + p.warp * q + vec2f(1.7, 9.2) + vec2f(t * 0.12, t * 0.09)),
    fbm(uv + p.warp * q + vec2f(8.3, 2.8) - vec2f(t * 0.1, t * 0.13)),
  );
  let f = fbm(uv + p.warp * r);

  let cA = vec3f(p.c0r, p.c0g, p.c0b);
  let cB = vec3f(p.c1r, p.c1g, p.c1b);
  let cC = vec3f(p.c2r, p.c2g, p.c2b);

  var col = mix(cA, cB, clamp(f * f * 2.4, 0.0, 1.0));
  col = mix(col, cC, clamp(r.x * 1.35, 0.0, 1.0));
  col = mix(col, cC * vec3f(0.85, 1.0, 0.9), clamp(q.x * 0.9, 0.0, 1.0) * 0.6);

  // Flow-line highlights: thin bright filaments along the warped field.
  let filament = pow(clamp(1.0 - abs(f - 0.52) * 6.0, 0.0, 1.0), 4.0);
  col += filament * 0.16 * mix(cB, cC, 0.5);

  // Grade: filmic-ish S-curve, vignette, dither.
  col = col * col * (3.0 - 2.0 * clamp(col, vec3f(0.0), vec3f(1.0)));
  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.4 * dot(v, v) * 2.2;
  col = clamp(col + vec3f(dither(uvIn)), vec3f(0.0), vec3f(1.0));
  return vec4f(col, 1.0);
}
`;

export interface FluidGradientProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Strength of the domain-warp turbulence. */
  warp?: number;
  /** Noise frequency; lower is broader and softer. */
  scale?: number;
  /** Dark base gradient stop. */
  from?: string;
  /** Mid gradient stop. */
  to?: string;
  /** Highlight gradient stop. */
  accent?: string;
  /** When true (default), the liquid plane parallax-shifts with the pointer. */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const FLUID_DEFAULTS = {
  speed: 0.55,
  warp: 2.4,
  scale: 1.6,
  from: "#0b1220",
  to: "#1e4a5f",
  accent: "#7fb8c9",
} as const;

export const FLUID_PRESETS = {
  sunset: { from: "#355c7d", to: "#6c5b7b", accent: "#c06c84", speed: 0.5, warp: 2.6, scale: 1.5 },
  ocean: { from: "#062a30", to: "#0b5563", accent: "#3fb8af", speed: 0.6, warp: 2.2, scale: 1.7 },
  ember: { from: "#1b0f0f", to: "#6e3226", accent: "#e0a458", speed: 0.45, warp: 2.8, scale: 1.4 },
} as const;

export function FluidGradient({
  speed = FLUID_DEFAULTS.speed,
  warp = FLUID_DEFAULTS.warp,
  scale = FLUID_DEFAULTS.scale,
  from = FLUID_DEFAULTS.from,
  to = FLUID_DEFAULTS.to,
  accent = FLUID_DEFAULTS.accent,
  interactive = true,
  className,
  style,
  fallback,
}: FluidGradientProps) {
  const a = hexToRgb01(from);
  const b = hexToRgb01(to);
  const c = hexToRgb01(accent);
  const [wrapRef, pointer] = usePointerUniforms<HTMLDivElement>();
  const ptr = interactive ? pointer : POINTER_REST;
  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={FLUID_SHADER}
        label="fluid-gradient"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          warp,
          scale,
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
