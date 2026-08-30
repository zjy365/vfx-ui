import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";

/**
 * Fullscreen liquid glass: layered sine refraction with chromatic split and specular highlights.
 */
export const LIQUID_GLASS_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  distortion: f32,
  chromatic: f32,
  scale: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn waves(p: vec2f, t: f32) -> vec2f {
  var d = vec2f(
    sin(p.y * 5.3 + t * 0.9) + 0.55 * sin(p.y * 11.7 - t * 0.6 + 1.7),
    cos(p.x * 4.7 - t * 0.8) + 0.55 * cos(p.x * 10.3 + t * 0.7 + 2.3)
  );
  d += vec2f(
    sin((p.x + p.y) * 8.1 + t * 1.15),
    cos((p.x - p.y) * 7.3 + t * 0.95)
  ) * 0.6;
  return d;
}

fn scene(uv: vec2f, t: f32) -> vec3f {
  var acc = vec3f(0.045, 0.052, 0.078);
  let b1 = uv - vec2f(0.32 + 0.10 * sin(t * 0.21), 0.38 + 0.08 * cos(t * 0.17));
  acc += vec3f(0.09, 0.30, 0.32) * exp(-dot(b1, b1) * 5.5);
  let b2 = uv - vec2f(0.70 + 0.09 * cos(t * 0.19), 0.30 + 0.10 * sin(t * 0.23));
  acc += vec3f(0.18, 0.15, 0.40) * exp(-dot(b2, b2) * 6.5);
  let b3 = uv - vec2f(0.52 + 0.11 * sin(t * 0.15 + 2.0), 0.74 + 0.07 * cos(t * 0.20 + 1.0));
  acc += vec3f(0.32, 0.15, 0.23) * exp(-dot(b3, b3) * 7.5);
  return acc;
}

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;
  let sp = p.scale;

  let disp = waves(uv * sp, t) * p.distortion * 0.045;

  // Chromatic split: sample the backdrop at slightly different distortions.
  let cR = scene(uv + disp * (1.0 + p.chromatic * 0.35), t);
  let cG = scene(uv + disp, t);
  let cB = scene(uv + disp * (1.0 - p.chromatic * 0.35), t);
  var col = vec3f(cR.r, cG.g, cB.b);

  // Specular from the wave-height gradient (procedural normal approximation).
  let e = 0.012;
  let hx = waves((uv + vec2f(e, 0.0)) * sp, t) - waves((uv - vec2f(e, 0.0)) * sp, t);
  let hy = waves((uv + vec2f(0.0, e)) * sp, t) - waves((uv - vec2f(0.0, e)) * sp, t);
  let slope = vec2f(hx.x + hx.y, hy.x + hy.y) * (0.5 / e);
  let nrm = normalize(vec3f(-slope.x * 0.1, -slope.y * 0.1, 1.0));
  let light = normalize(vec3f(0.35, -0.5, 0.8));
  let facing = clamp(dot(nrm, light), 0.0, 1.0);
  col += vec3f(1.0) * pow(facing, 22.0) * 0.30;
  col += vec3f(0.88, 0.93, 1.0) * pow(facing, 3.0) * 0.05;

  // Soft vignette.
  let d = uv - vec2f(0.5, 0.5);
  col = col * (1.0 - 0.22 * dot(d, d));

  return vec4f(col, 1.0);
}
`;

export interface LiquidGlassProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Refraction strength. */
  distortion?: number;
  /** RGB chromatic split amount. */
  chromatic?: number;
  /** Wave frequency; lower is broader and calmer. */
  scale?: number;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const LIQUID_GLASS_DEFAULTS = {
  speed: 0.8,
  distortion: 0.45,
  chromatic: 0.6,
  scale: 1.2,
} as const;

export const LIQUID_GLASS_PRESETS = {
  calm: { speed: 0.6, distortion: 0.3, chromatic: 0.4, scale: 1.0 },
  storm: { speed: 1.6, distortion: 0.9, chromatic: 1.2, scale: 1.6 },
  velvet: { speed: 0.5, distortion: 0.55, chromatic: 0.8, scale: 0.8 },
} as const;

export function LiquidGlass({
  speed = LIQUID_GLASS_DEFAULTS.speed,
  distortion = LIQUID_GLASS_DEFAULTS.distortion,
  chromatic = LIQUID_GLASS_DEFAULTS.chromatic,
  scale = LIQUID_GLASS_DEFAULTS.scale,
  className,
  style,
  fallback,
}: LiquidGlassProps) {
  return (
    <VfxCanvas
      shader={LIQUID_GLASS_SHADER}
      label="liquid-glass"
      className={className}
      style={style}
      fallback={fallback}
      uniforms={{
        time: 0,
        speed,
        distortion,
        chromatic,
        scale,
      }}
    />
  );
}
