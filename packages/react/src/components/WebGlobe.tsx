import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";

/**
 * WebGlobe — WebGPU re-creation of shuding/cobe (MIT, https://github.com/shuding/cobe).
 * Analytic sphere in a fullscreen fragment shader: ray/sphere intersection,
 * lat/lon dot matrix, two-layer composite (bright near side, dim far side
 * visible through the dot gaps), lambert + fresnel lighting.
 */
export const WEB_GLOBE_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  phi: f32,
  theta: f32,
  dotSize: f32,
  globeScale: f32,
  backside: f32,
  cr: f32, cg: f32, cb: f32,
  er: f32, eg: f32, eb: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn rotY(p: vec3f, a: f32) -> vec3f {
  let c = cos(a); let s = sin(a);
  return vec3f(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}
fn rotX(p: vec3f, a: f32) -> vec3f {
  let c = cos(a); let s = sin(a);
  return vec3f(p.x, c * p.y - s * p.z, s * p.y + c * p.z);
}

fn dotMask(local: vec3f) -> f32 {
  let R = 0.92;
  let latStep = 0.145;
  let lonStep = 0.235;
  let lat = asin(clamp(local.y / R, -1.0, 1.0));
  let lon = atan2(local.z, local.x);
  let cellLat = (floor(lat / latStep) + 0.5) * latStep;
  let cellLon = (floor(lon / lonStep) + 0.5) * lonStep;
  // Distance in cell units so dotSize (0..1] means "fraction of a cell".
  let dLat = (lat - cellLat) / latStep;
  let dLon = (lon - cellLon) / lonStep;
  let d = sqrt(dLat * dLat + dLon * dLon);
  return 1.0 - smoothstep(params.dotSize * 0.45, params.dotSize * 0.62, d);
}

@fragment
fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let p = params;
  let R = 0.92;
  let uvN = (uv - vec2f(0.5, 0.5)) * 2.0 / max(p.globeScale, 0.1);

  let bgA = 0.0;
  var col = vec3f(0.0);
  var alpha = bgA;

  let d = length(uvN);
  if (d < R) {
    let z = sqrt(R * R - d * d);
    let spin = p.time * p.speed + p.phi;
    let n = normalize(vec3f(uvN.x, uvN.y, z));

    // near (front) surface point
    let hitNear = rotY(rotX(vec3f(uvN.x, uvN.y, z), -p.theta), -spin);
    // far (back) surface point
    let hitFar = rotY(rotX(vec3f(uvN.x, uvN.y, -z), -p.theta), -spin);

    // far side dots seen through the gaps (dimmed)
    let farDot = dotMask(hitFar);
    let light = normalize(vec3f(0.45, 0.55, 0.72));
    let diff = clamp(dot(n, light), 0.0, 1.0);
    let fres = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.2);

    let dotCol = mix(vec3f(p.cr, p.cg, p.cb) * (0.35 + 0.65 * diff), vec3f(p.er, p.eg, p.eb), fres * 0.85);

    let nearDot = dotMask(hitNear);
    // Start with the dim far dots (visible through the front gaps), then the near dots.
    var g = vec3f(p.cr, p.cg, p.cb) * p.backside * farDot * 0.5;
    var a = farDot * p.backside * 0.35;
    g = mix(g, dotCol, nearDot);
    a = max(a, nearDot);
    col = g;
    alpha = max(a, 0.0);
  }

  return vec4f(col * alpha, alpha);
}
`;

export interface WebGlobeProps {
  /** Spin speed (radians/second). */
  speed?: number;
  /** Initial longitude offset. */
  phi?: number;
  /** Axial tilt (radians). */
  theta?: number;
  /** Dot radius in lat/lon cell units. */
  dotSize?: number;
  /** Globe size relative to the container (1 = touches edges). */
  globeScale?: number;
  /** Far-side dot visibility (0 = hidden, 1 = fully visible). */
  backside?: number;
  /** Dot color. */
  color?: string;
  /** Rim/emission color. */
  emission?: string;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

const DEFAULTS = { color: "#94a3b8", emission: "#f8fafc" };

export function WebGlobe({
  speed = 0.35,
  phi = 0,
  theta = 0.35,
  dotSize = 0.62,
  globeScale = 0.98,
  backside = 0.5,
  color = DEFAULTS.color,
  emission = DEFAULTS.emission,
  className,
  style,
  fallback,
}: WebGlobeProps) {
  const c = hexToRgb01(color);
  const e = hexToRgb01(emission);
  return (
    <VfxCanvas
      shader={WEB_GLOBE_SHADER}
      label="web-globe"
      className={className}
      style={style}
      fallback={fallback}
      uniforms={{
        time: 0,
        speed,
        phi,
        theta,
        dotSize,
        globeScale,
        backside,
        cr: c[0], cg: c[1], cb: c[2],
        er: e[0], eg: e[1], eb: e[2],
      }}
    />
  );
}

export const WEB_GLOBE_PRESETS = {
  midnight: { color: "#818cf8", emission: "#e0e7ff", backside: 0.45, theta: 0.3 },
  wire: { color: "#34d399", emission: "#d1fae5", dotSize: 0.5, speed: 0.5 },
  ember: { color: "#f59e0b", emission: "#fef3c7", backside: 0.6, theta: 0.5 },
} as const;
