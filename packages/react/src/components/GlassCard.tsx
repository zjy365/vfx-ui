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
    q = q * 2.05 + vec2f(3.3, 6.1);
    amp = amp * 0.5;
  }
  return v / m;
}

/// Rounded-rect signed distance, centred, half-size (w, h).
fn sdRoundRect(p: vec2f, w: f32, h: f32, r: f32) -> f32 {
  let q = abs(p) - vec2f(w, h) + vec2f(r);
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - r;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time;

  // Ambient backdrop: slow aurora-like colour field so the glass has
  // something real to refract.
  let bg = fbm(uvIn * 2.2 + vec2f(t * 0.03, -t * 0.02));
  let bg2 = fbm(uvIn * 3.7 - vec2f(t * 0.02, t * 0.03));
  var scene = mix(vec3f(0.05, 0.07, 0.13), vec3f(0.10, 0.14, 0.24), bg);
  scene += vec3f(0.10, 0.06, 0.20) * pow(bg2, 2.2) * 0.9;

  let aspect = vec2f(1.0, 1.0);
  let card = (uvIn - vec2f(0.5)) * aspect;
  let w = 0.36 * p.cardScale * 2.0;
  let h = 0.24 * p.cardScale * 2.0;
  let sd = sdRoundRect(card, w, h, p.radius);

  // Refraction: bend the scene lookup by the glass surface normal.
  let eps = 0.004;
  let sdx = sdRoundRect(card + vec2f(eps, 0.0), w, h, p.radius) - sd;
  let sdy = sdRoundRect(card + vec2f(0.0, eps), w, h, p.radius) - sd;
  let normal = normalize(vec3f(sdx, sdy, 0.02));
  let bend = normal.xy * 0.16;

  let inside = smoothstep(0.0025, -0.0025, sd);

  // What the glass shows: the scene, sampled through the bend + interior fbm.
  let refr = fbm((uvIn + bend) * 3.4 + vec2f(t * 0.015, -t * 0.01));
  var glassCol = scene * (0.55 + 0.5 * refr);
  let tint = vec3f(p.c0r, p.c0g, p.c0b);
  glassCol = mix(glassCol, glassCol * tint * 1.6 + tint * 0.10, 0.45);

  // Sweeping specular highlight, diagonal, time-driven.
  let sweep = fract(t * 0.11);
  let sweepLine = card.x + card.y - sweep * 1.6 + 0.3;
  let spec = exp(-abs(sweepLine) * 16.0) * p.shine;

  // Edge treatment: bright outer rim + inner bevel line.
  let edge = smoothstep(0.02, 0.0, abs(sd + 0.004)) ;
  let bevel = smoothstep(0.05, 0.0, abs(sd + 0.016));

  var col = mix(scene, glassCol, inside);
  // Interior grain: micro-texture so the pane never reads as flat plastic.
  let grain = fbm(uvIn * 46.0 + vec2f(refr * 2.0)) * 0.14 + fbm(uvIn * 170.0) * 0.07;
  col = mix(col, col * (0.78 + 0.44 * grain) + vec3f(grain * 0.07), inside * 0.95);
  col += tint * edge * p.borderGlow * 1.02;
  col += vec3f(0.75, 0.82, 1.0) * bevel * 0.3 * p.borderGlow;
  col += vec3f(0.9, 0.94, 1.0) * spec * inside * 0.9;

  // Soft drop shadow below the card.
  let shadow = smoothstep(0.12, 0.0, sd - 0.05) * (1.0 - inside);
  col = mix(col, vec3f(0.0, 0.0, 0.0), shadow * 0.35);

  // Keep the backdrop alive: faint drifting texture outside the pane.
  let outer = 1.0 - inside;
  col += vec3f(0.030, 0.038, 0.062) * outer * (0.4 + 0.6 * fbm(uvIn * 5.5 - vec2f(t * 0.02, t * 0.014)));

  // Soft-clip highlights so rims never clamp into flat white plateaus.
  let lum0 = dot(col, vec3f(0.2126, 0.7152, 0.0722));
  if (lum0 > 0.8) {
    col = col * (0.8 + 0.2 * lum0) / max(lum0, 1e-3) * lum0;
  }
  let d = hash21(uvIn * 991.0 + t);
  let lum = dot(col, vec3f(0.2126, 0.7152, 0.0722));
  col += vec3f((d - 0.5) / 255.0 * (3.2 + 5.0 * (1.0 - clamp(lum, 0.0, 1.0))) + (fbm(uvIn * 23.0 + t * 0.05) - 0.5) * 0.012);
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
