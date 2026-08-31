import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * WebGlobe v2 — a faithful WGSL port of shuding/cobe's rendering model (MIT,
 * Copyright Shu Ding — see references/cobe/src/globe.frag.glslx), with the
 * earth mask replaced by procedural fBm continents (vgpu has no texture
 * upload path yet).
 *
 * What makes it read as "cobe": Fibonacci-lattice dots (perfectly uniform
 * density, no polar squeezing), per-dot lambert lighting with an explicit
 * dark-side mix, rim glow, and a three-part atmosphere halo.
 */

export const WEB_GLOBE_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  phi: f32,
  theta: f32,
  dots: f32,
  dotScale: f32,
  diffuse: f32,
  dark: f32,
  atmosphere: f32,
  seaLevel: f32,
  globeScale: f32,
  cr: f32, cg: f32, cb: f32,
  gr: f32, gg: f32, gb: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn rotMat(theta: f32, phi: f32) -> mat3x3f {
  let cx = cos(theta);
  let cy = cos(phi);
  let sx = sin(theta);
  let sy = sin(phi);
  return mat3x3f(
    vec3f(cy, sy * sx, -sy * cx),
    vec3f(0.0, cx, sx),
    vec3f(sy, -cy * sx, cy * cx),
  );
}

fn hash13(p: vec3f) -> f32 {
  var q = fract(p * 0.3183099 + vec3f(0.1, 0.2, 0.3));
  q = q * 17.0;
  return fract(q.x * q.y * q.z * (q.x + q.y + q.z));
}

fn noise3(p: vec3f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash13(i + vec3f(0.0, 0.0, 0.0));
  let b = hash13(i + vec3f(1.0, 0.0, 0.0));
  let c = hash13(i + vec3f(0.0, 1.0, 0.0));
  let d = hash13(i + vec3f(1.0, 1.0, 0.0));
  let e = hash13(i + vec3f(0.0, 0.0, 1.0));
  let g = hash13(i + vec3f(1.0, 0.0, 1.0));
  let h = hash13(i + vec3f(0.0, 1.0, 1.0));
  let k = hash13(i + vec3f(1.0, 1.0, 1.0));
  return mix(
    mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
    mix(mix(e, g, u.x), mix(h, k, u.x), u.y),
    u.z,
  );
}

fn fbm3(p: vec3f) -> f32 {
  var v = 0.0;
  var amp = 0.5;
  var q = p;
  for (var i = 0; i < 4; i++) {
    v += amp * noise3(q);
    q = q * 2.15 + vec3f(3.1, 7.7, 1.3);
    amp = amp * 0.5;
  }
  return v;
}

// Procedural stand-in for cobe's earth texture: domain-warped fbm continents.
fn continentMask(sphere: vec3f) -> f32 {
  let warp = fbm3(sphere * 1.2 + vec3f(8.2, 1.7, 4.4));
  let land = fbm3(sphere * 3.1 + (warp - 0.5) * 2.4 + vec3f(11.0, 4.0, 7.0));
  let detail = fbm3(sphere * 6.0) * 0.1;
  return smoothstep(params.seaLevel, params.seaLevel + 0.05, land + detail - 0.09);
}

// Nearest point on a Fibonacci lattice (golden-angle spiral) — the reason
// cobe's dots are perfectly even everywhere on the sphere. Ported from
// references/cobe/src/globe.frag.glslx (MIT).
fn nearestFibonacci(pIn: vec3f, byDots: f32) -> vec4f {
  let TAU = 6.283185;
  let SQRT5 = 2.236068;
  let KPHI = 1.618034;
  var p = pIn.xzy;
  let k = max(2.0, floor(log2(SQRT5 * params.dots * TAU * (1.0 - p.z * p.z)) * 0.72021));
  let f = floor(pow(KPHI, k) / SQRT5 * vec2f(1.0, KPHI) + 0.5);
  let br1 = fract((f + vec2f(1.0)) * (KPHI - 1.0)) * TAU - 3.883222;
  let br2 = vec2f(-2.0) * f;
  let sp = vec2f(atan2(p.y, p.x), p.z - 1.0);
  let c = floor(vec2f(
    br2.y * sp.x - br1.y * (sp.y * params.dots + 1.0),
    -br2.x * sp.x + br1.x * (sp.y * params.dots + 1.0),
  ) / (br1.x * br2.y - br2.x * br1.y));

  var mindist = TAU;
  var minip = vec3f(0.0);
  for (var s = 0.0; s < 4.0; s += 1.0) {
    let o = vec2f(s % 2.0, floor(s * 0.5));
    let idx = dot(f, c + o);
    if (idx > params.dots) { continue; }

    var a = idx;
    var b = 0.0;
    if (a >= 16384.0) { a -= 16384.0; b += 0.868872; }
    if (a >= 8192.0) { a -= 8192.0; b += 0.934436; }
    if (a >= 4096.0) { a -= 4096.0; b += 0.467218; }
    if (a >= 2048.0) { a -= 2048.0; b += 0.733609; }
    if (a >= 1024.0) { a -= 1024.0; b += 0.866804; }
    if (a >= 512.0) { a -= 512.0; b += 0.433402; }
    if (a >= 256.0) { a -= 256.0; b += 0.216701; }
    if (a >= 128.0) { a -= 128.0; b += 0.108351; }
    if (a >= 64.0) { a -= 64.0; b += 0.554175; }
    if (a >= 32.0) { a -= 32.0; b += 0.777088; }
    if (a >= 16.0) { a -= 16.0; b += 0.888544; }
    if (a >= 8.0) { a -= 8.0; b += 0.944272; }
    if (a >= 4.0) { a -= 4.0; b += 0.472136; }
    if (a >= 2.0) { a -= 2.0; b += 0.236068; }
    if (a >= 1.0) { a -= 1.0; b += 0.618034; }

    let theta = fract(b) * TAU;
    let cosphi = 1.0 - 2.0 * idx * byDots;
    let sinphi = sqrt(1.0 - cosphi * cosphi);
    let sample = vec3f(cos(theta) * sinphi, sin(theta) * sinphi, cosphi);
    let dist = length(p - sample);
    if (dist < mindist) {
      mindist = dist;
      minip = sample;
    }
  }
  return vec4f(minip.xzy, mindist);
}

fn dither(uv: vec2f) -> f32 {
  return (fract(sin(dot(uv, vec2f(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let R = 0.8;
  let byDots = 1.0 / p.dots;

  var uv = (uvIn * 2.0 - vec2f(1.0)) / max(p.globeScale, 0.1);
  let l = dot(uv, uv);
  var color = vec3f(0.0);
  var alpha = 0.0;
  var glowFactor = 0.0;

  if (l <= R * R) {
    let n = normalize(vec3f(uv, sqrt(R * R - l)));
    let rot = rotMat(p.theta, p.phi + p.time * p.speed);
    let dotNL = n.z;

    let gpr = nearestFibonacci(n * rot, byDots);
    let gp = gpr.xyz;
    let dis = gpr.w;

    // cobe's composition: dots carry the map, lit by lambert, mixed with a
    // dark-side term; base surface keeps a faint ambient floor.
    let dotR = 0.030 * p.dotScale;
    let dotMask = smoothstep(dotR, dotR * 0.55, dis);

    // Exactly cobe's formula: the map only modulates dot brightness — oceans
    // get dim dots, land gets bright dots. The surface itself carries no mask.
    let mapColor = max(continentMask(gp), 0.12);
    let sample = mapColor * dotMask * pow(clamp(dotNL, 0.0, 1.0), p.diffuse);

    let lit = mix((1.0 - sample) * pow(clamp(dotNL, 0.0, 1.0), 0.4), sample, p.dark) + 0.1;
    var layer = vec3f(p.cr, p.cg, p.cb) * lit;
    let rim = pow(1.0 - clamp(dotNL, 0.0, 1.0), 4.0);
    layer += vec3f(p.gr, p.gg, p.gb) * rim;

    color = layer;
    alpha = 1.0;

    glowFactor = (1.0 - l) * (1.0 - l) * smoothstep(0.0, 1.0, 0.2 / max(l - R * R, 1e-4)) * 0.35;
  } else {
    let outD = sqrt(0.2 / (l - R * R));
    glowFactor = smoothstep(0.5, 1.0, outD / (outD + 1.0));
  }

  // Outer atmosphere halo + inner glow, both tinted by the glow color.
  let glowCol = vec3f(p.gr, p.gg, p.gb) * p.atmosphere;
  color += glowCol * glowFactor;
  alpha = clamp(max(alpha, glowFactor * p.atmosphere), 0.0, 1.0);

  color += dither(uvIn);
  return vec4f(color * alpha, alpha);
}
`;

export interface WebGlobeProps {
  /** Spin speed (radians/second). */
  speed?: number;
  /** Initial longitude offset. */
  phi?: number;
  /** Axial tilt (radians). */
  theta?: number;
  /** Fibonacci lattice point count (higher = denser dots). */
  dots?: number;
  /** Dot size multiplier. */
  dotScale?: number;
  /** Lambert exponent for lit-side falloff. */
  diffuse?: number;
  /** Dark-side visibility (0 = black far side, 1 = fully lit look). */
  dark?: number;
  /** Atmosphere halo strength. */
  atmosphere?: number;
  /** Procedural continent threshold (lower = more land). */
  seaLevel?: number;
  /** Globe size relative to the container (1 = touches edges). */
  globeScale?: number;
  /** Dot color. */
  color?: string;
  /** Rim/atmosphere color. */
  emission?: string;
  /** When true, the pointer rotates (x) and tilts (y) the globe. */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

const DEFAULTS = { color: "#9db4d6", emission: "#7dd3fc" };

export function WebGlobe({
  speed = 0.35,
  phi = 0,
  theta = 0.35,
  dots = 520,
  dotScale = 1.15,
  diffuse = 1.2,
  dark = 0.92,
  atmosphere = 0.8,
  seaLevel = 0.46,
  globeScale = 0.98,
  color = DEFAULTS.color,
  emission = DEFAULTS.emission,
  interactive = false,
  className,
  style,
  fallback,
}: WebGlobeProps) {
  const c = hexToRgb01(color);
  const e = hexToRgb01(emission);
  const [wrapRef, pointer] = usePointerUniforms<HTMLDivElement>();
  const ptr = interactive ? pointer : POINTER_REST;
  // The pointer steers the globe through the existing phi/theta uniforms —
  // no shader change needed; rest is exactly the authored orientation.
  const phiEff = phi + (ptr.x - 0.5) * 1.4;
  const thetaEff = theta + (ptr.y - 0.5) * 0.7;
  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={WEB_GLOBE_SHADER}
        label="web-globe"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          phi: phiEff,
          theta: thetaEff,
          dots,
          dotScale,
          diffuse,
          dark,
          atmosphere,
          seaLevel,
          globeScale,
          cr: c[0], cg: c[1], cb: c[2],
          gr: e[0], gg: e[1], gb: e[2],
        }}
      />
    </div>
  );
}

export const WEB_GLOBE_PRESETS = {
  midnight: { color: "#9db4d6", emission: "#7dd3fc", dark: 0.92, theta: 0.35, atmosphere: 0.9 },
  wire: { color: "#34d399", emission: "#a7f3d0", dotScale: 0.85, dots: 700, speed: 0.5, seaLevel: 0.62 },
  ember: { color: "#f0b077", emission: "#fcd9a8", dark: 0.5, theta: 0.5, atmosphere: 0.55 },
} as const;
