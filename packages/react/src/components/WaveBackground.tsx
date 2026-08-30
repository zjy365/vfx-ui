import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";

/**
 * Wave shader: three layered sine bands over a tri-color gradient.
 * All uniforms are plain f32 fields to keep the uniform layout trivial.
 */
export const WAVE_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  amplitude: f32,
  frequency: f32,
  c0r: f32, c0g: f32, c0b: f32,
  c1r: f32, c1g: f32, c1b: f32,
  c2r: f32, c2g: f32, c2b: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = uv.x * p.frequency + p.time * p.speed;
  let w1 = sin(t * 1.0 + uv.y * 2.0) * 0.15 * p.amplitude;
  let w2 = sin(t * 1.7 + uv.y * 4.0 + 1.3) * 0.08 * p.amplitude;
  let w3 = sin(t * 0.6 - uv.y * 1.0 + 2.1) * 0.22 * p.amplitude;
  let band = uv.y + w1 + w2 + w3;

  let cA = vec3f(p.c0r, p.c0g, p.c0b);
  let cB = vec3f(p.c1r, p.c1g, p.c1b);
  let cC = vec3f(p.c2r, p.c2g, p.c2b);
  var col = mix(cA, cB, smoothstep(0.0, 0.6, band));
  col = mix(col, cC, smoothstep(0.55, 1.0, band));

  let glow = exp(-3.0 * abs(band - 0.72)) * 0.35;
  col += vec3f(glow);
  return vec4f(col, 1.0);
}
`;

export interface WaveBackgroundProps {
  speed?: number;
  amplitude?: number;
  frequency?: number;
  /** Bottom gradient stop. */
  from?: string;
  /** Middle gradient stop. */
  to?: string;
  /** Top gradient stop. */
  accent?: string;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

const DEFAULTS = { from: "#020617", to: "#1d4ed8", accent: "#38bdf8" };

export function WaveBackground({
  speed = 1,
  amplitude = 1,
  frequency = 2.5,
  from = DEFAULTS.from,
  to = DEFAULTS.to,
  accent = DEFAULTS.accent,
  className,
  style,
  fallback,
}: WaveBackgroundProps) {
  const a = hexToRgb01(from);
  const b = hexToRgb01(to);
  const c = hexToRgb01(accent);
  return (
    <VfxCanvas
      shader={WAVE_SHADER}
      label="wave-background"
      className={className}
      style={style}
      fallback={fallback}
      uniforms={{
        time: 0,
        speed,
        amplitude,
        frequency,
        c0r: a[0], c0g: a[1], c0b: a[2],
        c1r: b[0], c1g: b[1], c1b: b[2],
        c2r: c[0], c2g: c[1], c2b: c[2],
      }}
    />
  );
}
