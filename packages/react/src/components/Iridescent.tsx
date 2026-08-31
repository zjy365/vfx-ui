import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * Iridescent — thin-film interference look: layered sine fields sampled
 * into a cosine palette. Silky, holographic, and fully procedural.
 */
export const IRIDESCENT_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  scale: f32,
  hueShift: f32,
  saturation: f32,
  brightness: f32,
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
  var amp = 0.55;
  var q = p;
  var m = 0.0;
  for (var i = 0; i < 4; i++) {
    v += amp * noise(q);
    m += amp;
    q = q * 2.04 + vec2f(5.2, 1.3);
    amp = amp * 0.5;
  }
  return v / m;
}

fn cosinePalette(v: f32) -> vec3f {
  return vec3f(0.5) + vec3f(0.5) * cos(vec3f(6.28318) * (vec3f(1.0, 0.81, 0.62) * v + vec3f(0.12, 0.34, 0.62)));
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;
  let q = (uvIn - vec2f(0.5)) * p.scale * vec2f(1.0, 1.0);

  // Nested domain warp — two layers moving at different rates give the silk
  // its depth; a single warp reads as a blurry gradient.
  let w1 = fbm(q * 0.75 + vec2f(t * 0.11, -t * 0.06));
  let w2 = fbm(q * 1.8 + vec2f(w1 * 2.1) - vec2f(t * 0.05, t * 0.09));
  let flow = fbm(q * 1.25 + vec2f(w2 * 2.4) + vec2f(t * 0.04, -t * 0.05));

  // Thin-film thickness field: smooth flow crossed with interference bands.
  let bands = sin((q.x * 1.4 + q.y * 0.9) * 2.2 + w2 * 5.0 + t * 0.35);
  let thick = flow * 3.0 + bands * 0.32 + w1 * 1.4;

  var col = cosinePalette(thick * 0.8 + p.hueShift + (p.px - 0.5) * 0.9 + t * 0.015);

  // Secondary interference highlight — thin bright iridescent streaks.
  let streak = pow(0.5 + 0.5 * bands, 6.0);
  col = mix(col, cosinePalette(thick * 0.8 + 0.3 + p.hueShift + (p.px - 0.5) * 0.9), streak * 0.45);

  // Anisotropic silk sheen sweeping across the warp; the pointer y tilts it.
  let sheen = pow(0.5 + 0.5 * sin(flow * 7.0 + q.y * 2.5 - t * 0.7 + (p.py - 0.5) * 3.0), 10.0);
  col += sheen * vec3f(0.42, 0.4, 0.38);

  // Grade: soft filmic S-curve, saturation, vignette, dither.
  col = col * p.brightness;
  let soft = col * col * (3.0 - 2.0 * clamp(col, vec3f(0.0), vec3f(1.0)));
  col = mix(col, soft, 0.55);
  col = max(col, vec3f(0.035, 0.045, 0.085));
  let lum = dot(col, vec3f(0.2126, 0.7152, 0.0722));
  col = mix(vec3f(lum), col, p.saturation);
  let vig = 1.0 - 0.42 * dot(uvIn - vec2f(0.5), uvIn - vec2f(0.5)) * 2.4;
  col *= vig;
  col = clamp(col + vec3f((hash21(uvIn * 913.0 + t) - 0.5) / 255.0 * 2.0), vec3f(0.0), vec3f(1.0));
  return vec4f(col, 1.0);
}
`;

export interface IridescentProps {
  speed?: number;
  scale?: number;
  hueShift?: number;
  saturation?: number;
  brightness?: number;
  /** When true, the pointer rotates hue (x) and tilts the sheen (y). */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export function Iridescent({
  speed = 0.8,
  scale = 2.4,
  hueShift = 0,
  saturation = 1,
  brightness = 0.9,
  interactive = false,
  className,
  style,
  fallback,
}: IridescentProps) {
  const [wrapRef, pointer] = usePointerUniforms<HTMLDivElement>();
  const ptr = interactive ? pointer : POINTER_REST;
  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={IRIDESCENT_SHADER}
        label="iridescent"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          scale,
          hueShift,
          saturation,
          brightness,
          px: ptr.x,
          py: ptr.y,
        }}
      />
    </div>
  );
}

export const IRIDESCENT_PRESETS = {
  pearl: { scale: 1.8, speed: 0.5, brightness: 0.95 },
  oil: { scale: 3.4, speed: 1.2, hueShift: 0.35 },
  deepSea: { scale: 2.2, hueShift: 0.55, saturation: 0.85, brightness: 0.75 },
} as const;
