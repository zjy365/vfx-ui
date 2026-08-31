import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * Vortex — spiral galaxy: logarithmic arms, core glow, star speckles.
 * Polar-coordinate fragment math with rotational drift.
 */
export const VORTEX_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  swirl: f32,
  arms: f32,
  coreGlow: f32,
  cr: f32, cg: f32, cb: f32,
  er: f32, eg: f32, eb: f32,
  px: f32,
  py: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash21(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453);
}

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = params;
  // The galaxy's center leans toward the pointer.
  let q = (uv - vec2f(0.5) - (vec2f(p.px, p.py) - 0.5) * 0.16) * 2.0;
  let r = length(q);
  let ang = atan2(q.y, q.x);

  let t = p.time * p.speed;
  let twist = p.swirl * log(1.0 + r * 3.5) - t * 0.6;
  let a = ang + twist;

  let armMask = 0.5 + 0.5 * cos(a * p.arms + r * 4.0);
  let falloff = exp(-2.6 * r);
  let dust = falloff * (0.5 + 0.72 * armMask);

  // Star speckles: hashed per cell, rendered as soft round points.
  let sg = (q + vec2f(t * 0.02)) * 42.0;
  let sid = floor(sg);
  let sf = fract(sg) - vec2f(0.5);
  let sh = hash21(sid);
  let sPos = (vec2f(hash21(sid + vec2f(3.1)), hash21(sid + vec2f(7.7))) - vec2f(0.5)) * 0.6;
  let sDot = exp(-dot(sf - sPos, sf - sPos) * 90.0);
  let star = step(0.94, sh) * sDot * 2.6 * falloff * (0.4 + armMask);

  let core = exp(-7.0 * r) * p.coreGlow;

  var col = vec3f(p.cr, p.cg, p.cb) * dust;
  col += vec3f(p.er, p.eg, p.eb) * (core + star);

  let alpha = clamp(dust + core + star, 0.0, 1.0);
  return vec4f(col, alpha);
}
`;

export interface VortexProps {
  speed?: number;
  /** Tightness of the spiral twist. */
  swirl?: number;
  /** Number of spiral arms. */
  arms?: number;
  coreGlow?: number;
  /** Dust/arm color. */
  color?: string;
  /** Core and star color. */
  emission?: string;
  /** When true (default), the vortex center leans toward the pointer. */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

const DEFAULTS = { color: "#818cf8", emission: "#e0f2fe" };

export function Vortex({
  speed = 0.5,
  swirl = 2.4,
  arms = 2,
  coreGlow = 1.2,
  color = DEFAULTS.color,
  emission = DEFAULTS.emission,
  interactive = true,
  className,
  style,
  fallback,
}: VortexProps) {
  const c = hexToRgb01(color);
  const e = hexToRgb01(emission);
  const [wrapRef, pointer] = usePointerUniforms<HTMLDivElement>();
  const ptr = interactive ? pointer : POINTER_REST;
  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={VORTEX_SHADER}
        label="vortex"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0, speed, swirl, arms, coreGlow,
          cr: c[0], cg: c[1], cb: c[2],
          er: e[0], eg: e[1], eb: e[2],
          px: ptr.x,
          py: ptr.y,
        }}
      />
    </div>
  );
}

export const VORTEX_PRESETS = {
  galaxy: { color: "#a78bfa", emission: "#f5f3ff", swirl: 2.6, arms: 2 },
  hurricane: { color: "#38bdf8", emission: "#cffafe", swirl: 4.2, arms: 3, speed: 0.9 },
  ember: { color: "#fb923c", emission: "#fff7ed", swirl: 2.0, coreGlow: 2.0 },
} as const;
