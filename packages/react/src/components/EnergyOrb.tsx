import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * EnergyOrb — a faithful WGSL port of ThreeUI's EnergyOrb (MIT,
 * Copyright 2026 Meng To — references/threeui/src/shaders/energy-orb/).
 * A rotating sphere of volumetric smoke (3D fBm, two nested warps) with
 * fresnel rim, top light, outer glow, and Rodrigues hue-rotation grading.
 * Output is premultiplied-alpha to match the vgpu surface.
 */
export const ENERGY_ORB_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  smokeScale: f32,
  smokeStrength: f32,
  smokeSpeed: f32,
  hue: f32,
  saturation: f32,
  glow: f32,
  px: f32,
  py: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash13(p: vec3f) -> f32 {
  var q = fract(p * 0.3183099 + vec3f(0.1, 0.2, 0.3));
  q = q * 17.0;
  return fract(q.x * q.y * q.z * (q.x + q.y + q.z));
}

fn noise3(x: vec3f) -> f32 {
  let i = floor(x);
  var f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i), hash13(i + vec3f(1.0, 0.0, 0.0)), f.x),
        mix(hash13(i + vec3f(0.0, 1.0, 0.0)), hash13(i + vec3f(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash13(i + vec3f(0.0, 0.0, 1.0)), hash13(i + vec3f(1.0, 0.0, 1.0)), f.x),
        mix(hash13(i + vec3f(0.0, 1.0, 1.0)), hash13(i + vec3f(1.0, 1.0, 1.0)), f.x), f.y),
    f.z,
  );
}

fn fbm(pIn: vec3f) -> f32 {
  var v = 0.0;
  var a = 0.5;
  var p = pIn;
  for (var i = 0; i < 5; i++) {
    v += a * noise3(p);
    p = p * 2.03 + vec3f(1.7);
    a = a * 0.5;
  }
  return v;
}

/// Rodrigues rotation of color around the (1,1,1) axis — hue shift.
fn gradeColor(color: vec3f, hue: f32, saturation: f32) -> vec3f {
  let luminance = dot(color, vec3f(0.2126, 0.7152, 0.0722));
  let sat = mix(vec3f(luminance), color, saturation);
  let axis = normalize(vec3f(1.0));
  return max(vec3f(0.0), sat * cos(hue) + cross(axis, sat) * sin(hue) + axis * dot(axis, sat) * (1.0 - cos(hue)));
}

fn dither(uv: vec2f) -> f32 {
  return (fract(sin(dot(uv, vec2f(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0 * 1.5;
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  let uv = (uvIn - vec2f(0.5)) * 2.0;
  let r = length(uv);
  let R = 0.62;
  var col = vec3f(0.0);
  var alpha = 0.0;

  if (r < R) {
    let z = sqrt(R * R - r * r);
    let n = normalize(vec3f(uv, z));
    let ca = p.time * p.speed * 0.15;
    let rot = mat3x3f(
      vec3f(cos(ca), 0.0, sin(ca)),
      vec3f(0.0, 1.0, 0.0),
      vec3f(-sin(ca), 0.0, cos(ca)),
    );
    let sp = rot * n;

    let smokeTime = p.time * p.speed * p.smokeSpeed;
    let f1 = fbm(sp * (2.6 * p.smokeScale) + vec3f(0.0, smokeTime * 0.12, 0.0));
    let f2 = fbm(sp * (4.5 * p.smokeScale) - vec3f(smokeTime * 0.08, 0.0, smokeTime * 0.05) + f1 * 1.8);
    let veil = smoothstep(0.35, 0.75, f2);

    let deep = vec3f(0.04, 0.02, 0.12);
    let mid = vec3f(0.22, 0.16, 0.55);
    let bright = vec3f(0.62, 0.60, 0.98);
    col = mix(deep, mid, f1 * 1.2);
    col = mix(col, bright, clamp(veil * 0.65 * p.smokeStrength, 0.0, 1.0));

    let fres = pow(1.0 - z / R, 2.2);
    col += vec3f(0.55, 0.55, 1.0) * fres * 1.1 * p.glow;
    // Top light follows the pointer (rest = straight overhead, the original look).
    let lightDir = normalize(vec3f((p.px - 0.5) * 1.8, 0.7 + (0.5 - p.py) * 1.4, 0.7));
    let top = pow(max(dot(n, lightDir), 0.0), 3.0);
    col += vec3f(0.45, 0.42, 0.9) * top * 0.35 * p.glow;
    alpha = 1.0;
  }

  let glow = clamp(exp(-(r - R) * 14.0), 0.0, 1.0);
  if (r >= R) {
    col = vec3f(0.55, 0.52, 1.0) * glow * 0.8 * p.glow;
    alpha = glow * 0.85;
  } else {
    let rim = smoothstep(R - 0.03, R, r);
    col += vec3f(0.6, 0.58, 1.0) * rim * 0.6 * p.glow;
  }

  col = gradeColor(col, p.hue, p.saturation);
  col += dither(uvIn);
  return vec4f(col * alpha, alpha);
}
`;

export interface EnergyOrbProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Smoke pattern density on the sphere. */
  smokeScale?: number;
  /** Bright veil intensity. */
  smokeStrength?: number;
  /** Smoke animation rate. */
  smokeSpeed?: number;
  /** Hue rotation (radians) around the luminance axis. */
  hue?: number;
  saturation?: number;
  /** Rim/atmosphere glow multiplier. */
  glow?: number;
  /** When true (default), the top light tracks the pointer across the orb. */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export function EnergyOrb({
  speed = 1,
  smokeScale = 1,
  smokeStrength = 1,
  smokeSpeed = 1,
  hue = 0,
  saturation = 1,
  glow = 1,
  interactive = true,
  className,
  style,
  fallback,
}: EnergyOrbProps) {
  const [wrapRef, pointer] = usePointerUniforms<HTMLDivElement>();
  const ptr = interactive ? pointer : POINTER_REST;
  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={ENERGY_ORB_SHADER}
        label="energy-orb"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          smokeScale,
          smokeStrength,
          smokeSpeed,
          hue,
          saturation,
          glow,
          px: ptr.x,
          py: ptr.y,
        }}
      />
    </div>
  );
}

export const ENERGY_ORB_PRESETS = {
  amethyst: { hue: 0, smokeScale: 1, smokeStrength: 1 },
  cyan: { hue: 2.2, smokeScale: 0.85, smokeStrength: 1.15, glow: 1.15 },
  magma: { hue: 4.1, smokeScale: 1.2, smokeStrength: 0.9, glow: 1.1 },
} as const;
