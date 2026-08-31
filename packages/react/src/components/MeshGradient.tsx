import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/**
 * MeshGradient — animated Voronoi color cells over an fBM-warped field.
 * Pure fragment math: no meshes, no textures, DOM cannot reproduce it.
 */
export const MESH_GRADIENT_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  scale: f32,
  softness: f32,
  c0r: f32, c0g: f32, c0b: f32,
  c1r: f32, c1g: f32, c1b: f32,
  c2r: f32, c2g: f32, c2b: f32,
  c3r: f32, c3g: f32, c3b: f32,
  px: f32,
  py: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash2(p: vec2f) -> vec2f {
  var q = vec2f(dot(p, vec2f(127.1, 311.7)), dot(p, vec2f(269.5, 183.3)));
  q = fract(sin(q) * vec2f(43758.5453, 22578.145));
  return q;
}

fn noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash2(i).x;
  let b = hash2(i + vec2f(1.0, 0.0)).x;
  let c = hash2(i + vec2f(0.0, 1.0)).x;
  let d = hash2(i + vec2f(1.0, 1.0)).x;
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = params;
  let t = p.time * p.speed;
  var pt = (uv - (vec2f(p.px, p.py) - 0.5) * 0.14) * p.scale;
  let w = noise(pt * 0.9 + t * 0.18) - 0.5;
  let w2 = noise(pt * 1.7 - t * 0.13) - 0.5;
  pt = pt + vec2f(w, w2) * 1.6;

  let cell = floor(pt);
  let f = fract(pt);
  var minDist = 8.0;
  for (var y: i32 = -1; y <= 1; y = y + 1) {
    for (var x: i32 = -1; x <= 1; x = x + 1) {
      let o = vec2f(f32(x), f32(y));
      let h = hash2(cell + o);
      let d = length(o + h - f);
      minDist = min(minDist, d);
    }
  }

  let warp = noise(pt * 0.5 + t * 0.07);
  let cA = vec3f(p.c0r, p.c0g, p.c0b);
  let cB = vec3f(p.c1r, p.c1g, p.c1b);
  let cC = vec3f(p.c2r, p.c2g, p.c2b);
  let cD = vec3f(p.c3r, p.c3g, p.c3b);
  var col = mix(cA, cB, smoothstep(0.0, 0.55, warp));
  col = mix(col, cC, smoothstep(0.35, 0.75, minDist));
  col = mix(col, cD, smoothstep(0.6, 1.1, minDist) * (0.5 + 0.5 * w));

  let edge = smoothstep(p.softness, 0.02, abs(minDist - 0.62)) * 0.10;
  col += mix(vec3f(1.0), cC, 0.55) * edge;
  col *= 0.92 + 0.16 * w;
  return vec4f(col, 1.0);
}
`;

export interface MeshGradientProps {
  speed?: number;
  /** Cell density. */
  scale?: number;
  /** Cell edge softness (lower = crisper edges). */
  softness?: number;
  from?: string;
  to?: string;
  accent?: string;
  deep?: string;
  /** When true (default), the color field drifts with the pointer. */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

const DEFAULTS = { from: "#0b1120", to: "#155e75", accent: "#7c3aed", deep: "#f472b6" };

export function MeshGradient({
  speed = 0.6,
  scale = 3.2,
  softness = 0.09,
  from = DEFAULTS.from,
  to = DEFAULTS.to,
  accent = DEFAULTS.accent,
  deep = DEFAULTS.deep,
  interactive = true,
  className,
  style,
  fallback,
}: MeshGradientProps) {
  const a = hexToRgb01(from);
  const b = hexToRgb01(to);
  const c = hexToRgb01(accent);
  const d = hexToRgb01(deep);
  const [wrapRef, pointer] = usePointerUniforms<HTMLDivElement>();
  const ptr = interactive ? pointer : POINTER_REST;
  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={MESH_GRADIENT_SHADER}
        label="mesh-gradient"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0, speed, scale, softness,
          c0r: a[0], c0g: a[1], c0b: a[2],
          c1r: b[0], c1g: b[1], c1b: b[2],
          c2r: c[0], c2g: c[1], c2b: c[2],
          c3r: d[0], c3g: d[1], c3b: d[2],
          px: ptr.x,
          py: ptr.y,
        }}
      />
    </div>
  );
}

export const MESH_GRADIENT_PRESETS = {
  aurora: { from: "#020617", to: "#0f766e", accent: "#22d3ee", deep: "#a7f3d0", scale: 2.6 },
  sunset: { from: "#1e1b4b", to: "#be185d", accent: "#fb923c", deep: "#fde68a" },
  ember: { from: "#18181b", to: "#7c2d12", accent: "#ef4444", deep: "#fbbf24", speed: 0.9 },
} as const;
