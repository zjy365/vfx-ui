import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";

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
}
@group(0) @binding(0) var<uniform> params: Params;

fn cosinePalette(t: vec3f, v: f32) -> vec3f {
  return vec3f(0.5) + vec3f(0.5) * cos(vec3f(6.28318) * (vec3f(1.0, 0.9, 0.75) * v + t));
}

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;
  let q = (uv - vec2f(0.5)) * p.scale;

  let a = sin(q.x * 1.7 + t * 0.9) + sin(q.y * 2.3 - t * 0.7);
  let b = sin((q.x + q.y) * 1.3 + t * 1.1);
  let c = sin(length(q) * 2.1 - t * 0.8);
  let field = a * 0.4 + b * 0.3 + c * 0.3;

  let v = field * 0.28 + t * 0.03 + p.hueShift;
  var col = cosinePalette(vec3f(0.0, 0.15, 0.35), v);

  let sheen = pow(0.5 + 0.5 * sin(field * 2.4 + t), 3.0);
  col = mix(col, col + vec3f(0.35), sheen * 0.4);

  let lum = dot(col, vec3f(0.2126, 0.7152, 0.0722));
  col = mix(vec3f(lum), col, p.saturation);
  col *= p.brightness;
  return vec4f(col, 1.0);
}
`;

export interface IridescentProps {
  speed?: number;
  scale?: number;
  hueShift?: number;
  saturation?: number;
  brightness?: number;
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
  className,
  style,
  fallback,
}: IridescentProps) {
  return (
    <VfxCanvas
      shader={IRIDESCENT_SHADER}
      label="iridescent"
      className={className}
      style={style}
      fallback={fallback}
      uniforms={{ time: 0, speed, scale, hueShift, saturation, brightness }}
    />
  );
}

export const IRIDESCENT_PRESETS = {
  pearl: { scale: 1.8, speed: 0.5, brightness: 0.95 },
  oil: { scale: 3.4, speed: 1.2, hueShift: 0.35 },
  deepSea: { scale: 2.2, hueShift: 0.55, saturation: 0.85, brightness: 0.75 },
} as const;
