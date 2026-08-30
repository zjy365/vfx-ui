import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";

/**
 * Liquid glass card: rounded-rect SDF with edge refraction, bevel light, and a shine sweep.
 */
export const GLASS_CARD_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  shine: f32,
  borderGlow: f32,
  cardScale: f32,
  radius: f32,
  c0r: f32, c0g: f32, c0b: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn cardSdf(uv: vec2f, halfW: f32, halfH: f32, rad: f32) -> f32 {
  let ctr = uv - vec2f(0.5, 0.5);
  let q = abs(ctr) - vec2f(halfW - rad, halfH - rad);
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - rad;
}

fn backdrop(uv: vec2f, tint: vec3f) -> vec3f {
  let d = uv - vec2f(0.5, 0.45);
  let v = smoothstep(1.05, 0.2, length(d));
  var c = mix(vec3f(0.030, 0.036, 0.054), vec3f(0.074, 0.086, 0.116), v);
  c += tint * 0.035 * v;
  return c;
}

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = params;
  let tint = vec3f(p.c0r, p.c0g, p.c0b);

  let halfW = 0.5 * p.cardScale;
  let halfH = 0.5 * p.cardScale * 0.66;
  let rad = min(p.radius, min(halfW, halfH) * 0.9);

  let sd = cardSdf(uv, halfW, halfH, rad);
  let px = 0.0022;
  let inside = 1.0 - smoothstep(-px, px, sd);

  // Outward normal from the SDF gradient, used to bend the backdrop at the rim.
  let e = 0.0045;
  let nx = cardSdf(uv + vec2f(e, 0.0), halfW, halfH, rad) - cardSdf(uv - vec2f(e, 0.0), halfW, halfH, rad);
  let ny = cardSdf(uv + vec2f(0.0, e), halfW, halfH, rad) - cardSdf(uv - vec2f(0.0, e), halfW, halfH, rad);
  let n = normalize(vec2f(nx, ny) + vec2f(1e-5, 0.0));

  let edgeBand = exp(-abs(sd) * 22.0);
  let rimBand = exp(-abs(sd) * 70.0);

  // Background: quiet radial gradient with a whisper of tint.
  var col = backdrop(uv, tint);

  // Card body: frosted tint over the refracted backdrop, top-lit for volume.
  let refr = backdrop(uv + n * edgeBand * 0.05, tint);
  var body = mix(refr, tint * 0.42 + vec3f(0.10, 0.11, 0.14), 0.38);
  body = body * mix(0.88, 1.06, 1.0 - smoothstep(0.0, 1.0, uv.y));

  // Bevel: bright rim toward the light, gentle shading opposite.
  let lightDir = normalize(vec2f(-0.62, -0.78));
  let bevel = pow(clamp(dot(n, lightDir), 0.0, 1.0), 3.0) * rimBand;
  let shade = pow(clamp(dot(n, -lightDir), 0.0, 1.0), 3.0) * rimBand;
  body += vec3f(0.88, 0.93, 1.0) * bevel * 0.22;
  body = body * (1.0 - shade * 0.16);

  // Shine: a soft diagonal highlight sweeping across the card.
  let diag = (uv.x + uv.y) * 0.5;
  let sweep = fract(p.time * 0.22) * 1.7 - 0.35;
  let bandD = diag - sweep;
  let shineBand = exp(-bandD * bandD / 0.01125);
  body += vec3f(1.0) * shineBand * p.shine * 0.14;

  col = mix(col, body, inside);

  // Border glow just outside the rim.
  let glow = exp(-max(sd, 0.0) * 60.0) * (1.0 - inside);
  col = mix(col, col + tint * 0.85 + vec3f(0.10), glow * p.borderGlow * 0.40);

  return vec4f(col, 1.0);
}
`;

export interface GlassCardProps {
  /** Corner radius in normalized units. */
  radius?: number;
  /** Strength of the outer border glow. */
  borderGlow?: number;
  /** Strength of the sweeping inner highlight. */
  shine?: number;
  /** Card size as a fraction of the canvas (0..1). */
  cardScale?: number;
  /** Glass tint color. */
  tint?: string;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const GLASS_CARD_DEFAULTS = {
  radius: 0.05,
  borderGlow: 0.7,
  shine: 0.8,
  cardScale: 0.62,
  tint: "#a5c8ff",
} as const;

export const GLASS_CARD_PRESETS = {
  frosted: { tint: "#a5c8ff", radius: 0.05, borderGlow: 0.7, shine: 0.8, cardScale: 0.62 },
  champagne: { tint: "#ffd9a0", radius: 0.07, borderGlow: 0.55, shine: 1.0, cardScale: 0.56 },
  rose: { tint: "#ffb3c8", radius: 0.04, borderGlow: 0.85, shine: 0.65, cardScale: 0.68 },
} as const;

export function GlassCard({
  radius = GLASS_CARD_DEFAULTS.radius,
  borderGlow = GLASS_CARD_DEFAULTS.borderGlow,
  shine = GLASS_CARD_DEFAULTS.shine,
  cardScale = GLASS_CARD_DEFAULTS.cardScale,
  tint = GLASS_CARD_DEFAULTS.tint,
  className,
  style,
  fallback,
}: GlassCardProps) {
  const c = hexToRgb01(tint);
  return (
    <VfxCanvas
      shader={GLASS_CARD_SHADER}
      label="glass-card"
      className={className}
      style={style}
      fallback={fallback}
      uniforms={{
        time: 0,
        shine,
        borderGlow,
        cardScale,
        radius,
        c0r: c[0], c0g: c[1], c0b: c[2],
      }}
    />
  );
}
