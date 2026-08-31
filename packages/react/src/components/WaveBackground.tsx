import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

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
  for (var i = 0; i < 3; i++) {
    v += amp * noise(q);
    m += amp;
    q = q * 2.13 + vec2f(7.3, 3.1);
    amp = amp * 0.5;
  }
  return v / m;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;

  // Four travelling wave trains at different speeds and directions —
  // parallax between them is what makes water read as water.
  // The cursor sloshes the water: x pushes the wave phase, y lifts the level.
  let slosh = (p.px - 0.5) * 2.4;
  let w1 = sin(uvIn.x * p.frequency + t * 1.00 + slosh + fbm(uvIn * 2.0 + t * 0.10) * 2.4) * 0.14;
  let w2 = sin(uvIn.x * p.frequency * 1.7 - t * 1.35 - slosh * 0.7 + fbm(uvIn * 3.1 - t * 0.16) * 1.8) * 0.07;
  let w3 = sin(uvIn.x * p.frequency * 0.6 + t * 0.55 + slosh * 0.4 + fbm(uvIn * 1.3 + t * 0.07) * 3.0) * 0.24;
  let w4 = sin((uvIn.x + uvIn.y) * p.frequency * 1.15 + t * 1.9) * 0.035;
  let band = uvIn.y + (0.5 - p.py) * 0.05 + (w1 + w2 + w3 + w4) * p.amplitude;

  let cA = vec3f(p.c0r, p.c0g, p.c0b);
  let cB = vec3f(p.c1r, p.c1g, p.c1b);
  let cC = vec3f(p.c2r, p.c2g, p.c2b);
  var col = mix(cA, cB, smoothstep(0.0, 0.62, band));
  col = mix(col, cC, smoothstep(0.58, 1.05, band));

  // Crest highlights: bright film where several waves peak together.
  let crest = exp(-abs(band - 0.78) * 7.0) * 0.30;
  col += vec3f(crest);

  // Moonlight glitter: fine sparkles riding the crest line.
  let sparkle = pow(hash21(floor(uvIn * vec2f(340.0, 190.0)) + floor(t * 3.0)), 40.0);
  col += vec3f(sparkle) * crest * 2.2;

  // Depth shading: darker troughs, airier tops.
  col *= mix(0.72, 1.12, smoothstep(0.0, 1.0, band));

  // Vignette + dither.
  let v = uvIn - vec2f(0.5);
  col *= 1.0 - 0.35 * dot(v, v) * 2.2;
  col += vec3f((hash21(uvIn * 611.7 + t) - 0.5) / 255.0 * 1.5);
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
  /** When true (default), the pointer sloshes the waves (x) and water level (y). */
  interactive?: boolean;
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
  interactive = true,
  className,
  style,
  fallback,
}: WaveBackgroundProps) {
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
        shader={WAVE_SHADER}
        label="wave-background"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          amplitude,
          frequency,
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
