import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

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
  px: f32,
  py: f32,
  pActive: f32,
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
    q = q * 2.09 + vec2f(2.9, 7.1);
    amp = amp * 0.5;
  }
  return v / m;
}

/// The liquid surface height field: two crossing wave families + fbm swell.
fn surface(p: vec2f, t: f32) -> f32 {
  let w1 = sin(p.x * 3.1 + fbm(p * 1.4 + t * 0.18) * 4.0 + t * 0.7);
  let w2 = sin(p.y * 2.6 - fbm(p * 1.1 - t * 0.14) * 3.4 + t * 0.5);
  return w1 * 0.6 + w2 * 0.4 + fbm(p * 2.4 - vec2f(t * 0.1)) * 0.8;
}

/// Refraction offset of the surface field at p (finite-difference gradient).
fn refract(p: vec2f, t: f32, k: f32) -> vec2f {
  let e = 0.006;
  let h = surface(p, t);
  let dx = surface(p + vec2f(e, 0.0), t) - h;
  let dy = surface(p + vec2f(0.0, e), t) - h;
  return vec2f(dx, dy) * k;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;
  let q = (uvIn - vec2f(0.5)) * p.scale * 2.4;

  // Chromatic dispersion: each channel refracts with a slightly different
  // offset — the signature of real thick glass.
  let k = p.distortion * 0.05;
  let base = vec2f(0.0);
  // Cursor presses into the liquid: a soft lens that deepens refraction where
  // the pointer rests. pActive is 0 at rest, so default render is unchanged.
  let lens = exp(-pow(distance(uvIn, vec2f(p.px, p.py)), 2.0) / 0.05) * p.pActive;
  let off = refract(q, t, k * (1.0 + lens * 2.5));
  let disp = off * p.chromatic * 0.5;

  let src = uvIn * 2.0;
  let colR = fbm((uvIn + off + disp) * 2.6 + vec2f(t * 0.03));
  let colG = fbm((uvIn + off) * 2.6 + vec2f(t * 0.03));
  let colB = fbm((uvIn + off - disp) * 2.6 + vec2f(t * 0.03));

  // Deep glass base from the refracted channels — dark, so ridges pop.
  var col = vec3f(0.03, 0.045, 0.09);
  col += vec3f(colR, colG, colB) * vec3f(0.22, 0.30, 0.46);

  // Interference contour lines of the surface field, RGB-split: these are
  // the visible "liquid" structures, not a blurry haze.
  let phase = surface(q, t) * 9.0;
  let lineR = abs(fract(phase * 0.96 + 0.19) - 0.5);
  let lineG = abs(fract(phase) - 0.5);
  let lineB = abs(fract(phase * 1.05 - 0.13) - 0.5);
  let lineW = 0.10;
  col += vec3f(
    (1.0 - smoothstep(0.0, lineW, lineR)) * 0.85,
    (1.0 - smoothstep(0.0, lineW, lineG)) * 0.75,
    (1.0 - smoothstep(0.0, lineW, lineB)) * 0.7,
  ) * vec3f(0.5, 0.65, 1.0);

  // Steep-gradient caustic glow.
  let ridge = pow(1.0 - clamp(length(off) * 4.2, 0.0, 1.0), 5.0);
  col += vec3f(0.35, 0.5, 0.95) * ridge * 0.4;

  // Sparse specular glints.
  let glint = pow(noise(q * 3.4 + vec2f(t * 0.4, -t * 0.3)), 8.0);
  col += vec3f(0.9, 0.94, 1.0) * glint * 0.35;

  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.38 * dot(v, v) * 2.2;
  col += vec3f((hash21(uvIn * 883.1 + t) - 0.5) / 255.0 * 1.5);
  return vec4f(clamp(col, vec3f(0.0), vec3f(1.0)), 1.0);
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
  /** When true (default), the pointer presses a refraction lens into the surface. */
  interactive?: boolean;
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
  interactive = true,
  className,
  style,
  fallback,
}: LiquidGlassProps) {
  const [wrapRef, pointer, pActive] = usePointerUniforms<HTMLDivElement>();
  const ptr = interactive ? pointer : POINTER_REST;
  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={LIQUID_GLASS_SHADER}
        label="liquid-glass"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          distortion,
          chromatic,
          scale,
          px: ptr.x,
          py: ptr.y,
          pActive: interactive && pActive ? 1 : 0,
        }}
      />
    </div>
  );
}
