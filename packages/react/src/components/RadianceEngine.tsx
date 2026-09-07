/*
Adapted from Vercel vgpu Agent Radiance Cascades.
MIT License

Copyright (c) 2025 Vercel, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import {
  effect,
  frame,
  sampler,
  target,
  type Effect,
  type Gpu,
  type Surface,
  type Target,
} from "vgpu";

const agentDotsWgsl = /* wgsl */ `// VFX UI: an original orbital / square light arrangement.
struct AgentDots {
 size: vec2f, time: f32, spacing: f32, radius: f32, animation_mode: u32,
 tint: vec3f, arrangement: f32, pointer: vec2f, pActive: f32,
};
@group(0) @binding(0) var<uniform> agent: AgentDots;
@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
 let pixel=uv*agent.size;
 var result=vec4f(0.0);
 let count=select(13,9,agent.arrangement>0.5);
 for(var i=0;i<count;i++) {
   let a=f32(i)*6.2831853/12.0-1.5707963;
   var offset=vec2f(cos(a),sin(a))*agent.spacing*2.0;
   if(i==12){offset=vec2f(0.0);}
   if(agent.arrangement>0.5){offset=vec2f(f32(i%3)-1.0,f32(i/3)-1.0)*agent.spacing*1.6;}
   let center=agent.size*0.5+offset;
   var strength=0.5+0.5*sin(agent.time*2.2-f32(i)*0.52);
   if(agent.animation_mode==0u){strength=0.5+0.5*sin(agent.time*2.1-length(offset)/agent.spacing*1.8);}
   if(agent.animation_mode==2u){strength=0.5+0.5*sin(agent.time*1.7);}
   strength=pow(strength,3.0);
   let pointerLight=exp(-dot(center-agent.pointer*agent.size,center-agent.pointer*agent.size)/pow(agent.spacing*1.5,2.0))*agent.pActive;
   let emission=mix(0.045,7.5,max(strength,pointerLight));
   let sd=distance(pixel,center)-agent.radius;
   let mask=1.0-smoothstep(-0.65,0.65,sd);
   result=max(result,vec4f(agent.tint*emission*mask,mask));
 }
 return result;
}`;
const jfaInitWgsl = /* wgsl */ `// Seeds the jump flood: every emitter texel points at itself, everything else is empty.
// Seeds are absolute pixel centers in an rgba32float target — f16 cannot hold a 2560-wide
// coordinate exactly, and a seed that is off by a texel becomes an SDF that is off by a
// texel, which sphere tracing turns into light leaking through a wall.

@group(0) @binding(0) var emitter: texture_2d<f32>;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let size = vec2f(textureDimensions(emitter));
  let pixel = clamp(floor(uv * size), vec2f(0.0), size - 1.0);
  let mask = textureLoad(emitter, vec2i(pixel), 0).a;
  if (mask > 0.5) {
    return vec4f(pixel + 0.5, 0.0, 1.0);
  }
  return vec4f(0.0);
}
`;
const jfaPassWgsl = /* wgsl */ `// One jump-flood round: look at the 3x3 neighborhood \`jump\` texels away and keep the
// nearest seed. Run with jump = size/2, size/4 ... 1 the seeds converge to the exact
// nearest emitter in ceil(log2(size)) passes instead of a search per texel.

struct JfaStep {
  jump: vec4f,
};

@group(0) @binding(0) var<uniform> jfa: JfaStep;
@group(0) @binding(1) var seeds: texture_2d<f32>;

fn jfa_pick(current: vec4f, candidate: vec4f, position: vec2f) -> vec4f {
  if (candidate.w < 0.5) {
    return current;
  }
  if (current.w < 0.5) {
    return candidate;
  }
  let current_distance = distance(current.xy, position);
  let candidate_distance = distance(candidate.xy, position);
  return select(current, candidate, candidate_distance < current_distance);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let size = vec2f(textureDimensions(seeds));
  let pixel = clamp(floor(uv * size), vec2f(0.0), size - 1.0);
  let position = pixel + 0.5;
  let coord = vec2i(pixel);
  let limit = vec2i(size) - vec2i(1);
  let jump = i32(jfa.jump.x);

  var best = textureLoad(seeds, coord, 0);
  for (var y = -1; y <= 1; y = y + 1) {
    for (var x = -1; x <= 1; x = x + 1) {
      let neighbor = coord + vec2i(x, y) * jump;
      // Out-of-bounds neighbors are skipped rather than clamped: a clamped read would
      // duplicate the edge seed and bias distances along the border.
      if (
        neighbor.x < 0 ||
        neighbor.y < 0 ||
        neighbor.x > limit.x ||
        neighbor.y > limit.y
      ) {
        continue;
      }
      best = jfa_pick(best, textureLoad(seeds, neighbor, 0), position);
    }
  }
  return best;
}
`;
const presentWgsl = /* wgsl */ `// Direction-first atlas addressing shared by the cascade and presentation passes.

const TAU: f32 = 6.283185307179586;

fn rc_ray_count(cascade: f32, direction_base: f32) -> f32 {
  let block = rc_block_size(cascade, direction_base);
  return block * block;
}

fn rc_probe_spacing(cascade: f32) -> f32 {
  return pow(2.0, cascade);
}

// Spacing and block size both double, so every cascade fills the same atlas.
fn rc_block_size(cascade: f32, direction_base: f32) -> f32 {
  return direction_base * pow(2.0, cascade);
}

fn rc_direction(index: f32, rays: f32) -> vec2f {
  let theta = TAU * (index + 0.5) / rays;
  return vec2f(cos(theta), sin(theta));
}

fn rc_atlas_decode(texel: vec2f, block: f32) -> vec3f {
  let probe = floor(texel / block);
  let slot = texel - probe * block;
  return vec3f(probe, slot.y * block + slot.x);
}

fn rc_atlas_texel(probe: vec2f, direction_index: f32, block: f32) -> vec2f {
  let slot = vec2f(direction_index % block, floor(direction_index / block));
  return probe * block + slot;
}

fn rc_probe_origin(probe: vec2f, spacing: f32) -> vec2f {
  return (probe + 0.5) * spacing;
}



fn tonemap_aces(color: vec3f) -> vec3f {
  let a = 2.51;
  let b = 0.03;
  let c = 2.43;
  let d = 0.59;
  let e = 0.14;
  return clamp(
    (color * (a * color + b)) / (color * (c * color + d) + e),
    vec3f(0.0),
    vec3f(1.0),
  );
}

fn linear_to_srgb(color: vec3f) -> vec3f {
  let low = color * 12.92;
  let high =
    1.055 * pow(max(color, vec3f(0.0)), vec3f(1.0 / 2.4)) - 0.055;
  return select(high, low, color <= vec3f(0.0031308));
}

fn distance_ramp(distance: f32, period: f32) -> vec3f {
  let near = exp(-distance / period);
  let bands = 0.5 + 0.5 * cos(6.283185307179586 * distance / period);
  return vec3f(near, near * 0.55 + 0.12 * bands, 0.35 * bands);
}

struct Present {
  /** x: exposure, y: view, z: SDF period, w: direction block side. */
  display: vec4f,
  /** x: albedo, y: ambient. */
  lighting: vec4f,
};

@group(0) @binding(0) var<uniform> present: Present;
@group(0) @binding(1) var cascade_tex: texture_2d<f32>;
@group(0) @binding(2) var emitter_tex: texture_2d<f32>;
@group(0) @binding(3) var sdf_tex: texture_2d<f32>;
@group(0) @binding(4) var jfa_tex: texture_2d<f32>;
@group(0) @binding(5) var emitter_samp: sampler;

fn resolve_probe(probe: vec2f) -> vec3f {
  let block = rc_block_size(0.0, present.display.w);
  let rays = rc_ray_count(0.0, present.display.w);
  let atlas_size = vec2f(textureDimensions(cascade_tex));
  let clamped_probe = clamp(probe, vec2f(0.0), atlas_size / block - 1.0);
  var total = vec3f(0.0);
  for (var i = 0.0; i < rays; i = i + 1.0) {
    total += textureLoad(cascade_tex, vec2i(rc_atlas_texel(clamped_probe, i, block)), 0).rgb;
  }
  return total / rays;
}

// The cascade field is intentionally capped below large display sizes. Resolve the four
// neighboring probes instead of magnifying a nearest-probe image, which keeps the light
// field continuous while preserving the exact radiance stored in the atlas.
fn resolve_cascade0(pixel: vec2f) -> vec3f {
  let position = pixel - 0.5;
  let base = floor(position);
  let blend = fract(position);
  let top = mix(resolve_probe(base), resolve_probe(base + vec2f(1.0, 0.0)), blend.x);
  let bottom = mix(resolve_probe(base + vec2f(0.0, 1.0)), resolve_probe(base + vec2f(1.0)), blend.x);
  return mix(top, bottom, blend.y);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let scene_size = vec2f(textureDimensions(emitter_tex));
  let atlas_size = vec2f(textureDimensions(cascade_tex));
  let pixel = uv * scene_size;
  let texel = vec2i(clamp(floor(pixel), vec2f(0.0), scene_size - 1.0));
  let half_texel = 0.5 / scene_size;
  let scene_uv = clamp(uv, half_texel, vec2f(1.0) - half_texel);
  let view = i32(present.display.y + 0.5);

  if (view == 1) {
    let emitter = textureSampleLevel(emitter_tex, emitter_samp, scene_uv, 0.0);
    return vec4f(linear_to_srgb(tonemap_aces(emitter.rgb * present.display.x)), 1.0);
  }
  if (view == 2) {
    let distance_px = textureLoad(sdf_tex, texel, 0).r;
    return vec4f(linear_to_srgb(distance_ramp(distance_px, present.display.z)), 1.0);
  }
  if (view == 3) {
    let coord = vec2i(clamp(uv * atlas_size, vec2f(0.0), atlas_size - 1.0));
    let radiance = textureLoad(cascade_tex, coord, 0);
    return vec4f(linear_to_srgb(tonemap_aces(radiance.rgb * present.display.x)), 1.0);
  }
  if (view == 4) {
    let seed = textureLoad(jfa_tex, texel, 0);
    if (seed.a < 0.5) {
      return vec4f(0.0, 0.0, 0.0, 1.0);
    }
    let encoded = 0.5 + 0.5 * cos(vec3f(0.0, 2.1, 4.2) + seed.x * 0.055 + seed.y * 0.089);
    return vec4f(encoded, 1.0);
  }

  let irradiance = resolve_cascade0(pixel);
  let emitter = textureSampleLevel(emitter_tex, emitter_samp, scene_uv, 0.0);
  let vignette = 1.0 - 0.42 * smoothstep(0.16, 0.72, distance(uv, vec2f(0.5)));
  let surface = vec3f(present.lighting.x * vignette);
  let lit = mix(surface * (irradiance + present.lighting.y), emitter.rgb, clamp(emitter.a, 0.0, 1.0));
  return vec4f(linear_to_srgb(tonemap_aces(lit * present.display.x)), 1.0);
}
`;
const radianceCascadeWgsl = /* wgsl */ `// Direction-first atlas addressing shared by the cascade and presentation passes.

const TAU: f32 = 6.283185307179586;

fn rc_ray_count(cascade: f32, direction_base: f32) -> f32 {
  let block = rc_block_size(cascade, direction_base);
  return block * block;
}

fn rc_probe_spacing(cascade: f32) -> f32 {
  return pow(2.0, cascade);
}

// Spacing and block size both double, so every cascade fills the same atlas.
fn rc_block_size(cascade: f32, direction_base: f32) -> f32 {
  return direction_base * pow(2.0, cascade);
}

fn rc_direction(index: f32, rays: f32) -> vec2f {
  let theta = TAU * (index + 0.5) / rays;
  return vec2f(cos(theta), sin(theta));
}

fn rc_atlas_decode(texel: vec2f, block: f32) -> vec3f {
  let probe = floor(texel / block);
  let slot = texel - probe * block;
  return vec3f(probe, slot.y * block + slot.x);
}

fn rc_atlas_texel(probe: vec2f, direction_index: f32, block: f32) -> vec2f {
  let slot = vec2f(direction_index % block, floor(direction_index / block));
  return probe * block + slot;
}

fn rc_probe_origin(probe: vec2f, spacing: f32) -> vec2f {
  return (probe + 0.5) * spacing;
}

// Sphere tracing shared by every cascade level.

const SDF_HIT_EPSILON: f32 = 0.5;
const SDF_MIN_STEP: f32 = 0.35;
const SDF_MAX_STEPS: i32 = 16;

fn sdf_pixel_uv(pixel: vec2f, size: vec2f) -> vec2f {
  let half_texel = 0.5 / size;
  return clamp(pixel / size, half_texel, vec2f(1.0) - half_texel);
}

fn sdf_sample(
  tex: texture_2d<f32>,
  samp: sampler,
  pixel: vec2f,
  size: vec2f,
) -> f32 {
  return textureSampleLevel(tex, samp, sdf_pixel_uv(pixel, size), 0.0).r;
}

// Alpha is visibility: zero on a hit and one when the interval stays open.
fn sphere_trace(
  sdf_tex: texture_2d<f32>,
  sdf_samp: sampler,
  emitter_tex: texture_2d<f32>,
  emitter_samp: sampler,
  size: vec2f,
  origin: vec2f,
  direction: vec2f,
  t_start: f32,
  t_end: f32,
) -> vec4f {
  var t = t_start;
  for (var step = 0; step < SDF_MAX_STEPS; step = step + 1) {
    let p = origin + direction * t;
    if (
      p.x < -1.0 ||
      p.y < -1.0 ||
      p.x > size.x + 1.0 ||
      p.y > size.y + 1.0
    ) {
      break;
    }
    let d = sdf_sample(sdf_tex, sdf_samp, p, size);
    if (d <= SDF_HIT_EPSILON) {
      let emitter = textureSampleLevel(
        emitter_tex,
        emitter_samp,
        sdf_pixel_uv(p, size),
        0.0,
      );
      return vec4f(emitter.rgb, 0.0);
    }
    t = t + max(d, SDF_MIN_STEP);
    if (t > t_end) {
      break;
    }
  }
  return vec4f(0.0, 0.0, 0.0, 1.0);
}





// Trace one interval per atlas texel, then merge the already-rendered upper level.

fn rc_interval_start(cascade: f32, interval0: f32) -> f32 {
  return interval0 * (pow(4.0, cascade) - 1.0) / 3.0;
}

fn rc_interval_length(cascade: f32, interval0: f32) -> f32 {
  return interval0 * pow(4.0, cascade);
}

fn rc_interval_end(cascade: f32, interval0: f32, overlap: f32) -> f32 {
  return rc_interval_start(cascade, interval0) +
    rc_interval_length(cascade, interval0) * (1.0 + overlap);
}

const RC_BRANCH_WEIGHT: f32 = 0.25;

fn rc_merge(near: vec4f, far: vec4f) -> vec4f {
  return vec4f(near.rgb + near.a * far.rgb, near.a * far.a);
}

fn rc_bilinear_weights(fraction: vec2f) -> vec4f {
  let f = clamp(fraction, vec2f(0.0), vec2f(1.0));
  return vec4f(
    (1.0 - f.x) * (1.0 - f.y),
    f.x * (1.0 - f.y),
    (1.0 - f.x) * f.y,
    f.x * f.y,
  );
}

fn rc_clamp_probe(probe: vec2f, grid: vec2f) -> vec2f {
  return clamp(probe, vec2f(0.0), grid - vec2f(1.0));
}

struct Cascade {
  /** x: level, y: has upper level, z: level-0 direction block side. */
  state: vec4f,
};

@group(0) @binding(0) var<uniform> rc: Cascade;
@group(0) @binding(1) var sdf_tex: texture_2d<f32>;
@group(0) @binding(2) var sdf_samp: sampler;
@group(0) @binding(3) var emitter_tex: texture_2d<f32>;
@group(0) @binding(4) var emitter_samp: sampler;
@group(0) @binding(5) var upper_tex: texture_2d<f32>;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let atlas_size = vec2f(textureDimensions(upper_tex));
  let scene_size = vec2f(textureDimensions(sdf_tex));
  let cascade = rc.state.x;
  let texel = floor(uv * atlas_size);
  let block = rc_block_size(cascade, rc.state.z);
  let rays = rc_ray_count(cascade, rc.state.z);
  let decoded = rc_atlas_decode(texel, block);
  let probe = decoded.xy;
  let direction_index = decoded.z;

  let spacing = rc_probe_spacing(cascade);
  let origin = rc_probe_origin(probe, spacing);
  let direction = rc_direction(direction_index, rays);

  var radiance = sphere_trace(
    sdf_tex,
    sdf_samp,
    emitter_tex,
    emitter_samp,
    scene_size,
    origin, direction,
    rc_interval_start(cascade, 2.0),
    rc_interval_end(cascade, 2.0, 0.02),
  );

  if (rc.state.y > 0.5) {
    let upper_block = block * 2.0;
    let upper_spacing = spacing * 2.0;
    let upper_grid = atlas_size / upper_block;

    let position = origin / upper_spacing - 0.5;
    let base = floor(position);
    let weights = rc_bilinear_weights(position - base);
    var weight_array = array<f32, 4>(weights.x, weights.y, weights.z, weights.w);

    var far = vec4f(0.0);
    for (var branch = 0; branch < 4; branch = branch + 1) {
      let upper_direction = direction_index * 4.0 + f32(branch);
      var interpolated = vec4f(0.0);
      for (var corner = 0; corner < 4; corner = corner + 1) {
        let offset = vec2f(f32(corner % 2), f32(corner / 2));
        let neighbor = rc_clamp_probe(base + offset, upper_grid);
        let coord = rc_atlas_texel(neighbor, upper_direction, upper_block);
        interpolated +=
          weight_array[corner] * textureLoad(upper_tex, vec2i(coord), 0);
      }
      far += interpolated * RC_BRANCH_WEIGHT;
    }
    radiance = rc_merge(radiance, far);
  }

  return radiance;
}
`;
const sdfFinalizeWgsl = /* wgsl */ `// Turns the converged seed field into the distance field the sphere tracer samples.
// R holds the distance in scene pixels; the target is rgba16float because the tracer needs
// bilinear filtering, which 32-bit float targets do not offer without an optional feature.

@group(0) @binding(0) var seeds: texture_2d<f32>;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let size = vec2f(textureDimensions(seeds));
  let pixel = clamp(floor(uv * size), vec2f(0.0), size - 1.0);
  let seed = textureLoad(seeds, vec2i(pixel), 0);
  let distance_px = select(
    length(size) * 2.0,
    distance(seed.xy, pixel + 0.5),
    seed.w >= 0.5,
  );
  return vec4f(distance_px, 0.0, 0.0, 1.0);
}
`;

type Output = Surface | Target;
type Vec2 = readonly [number, number];

export type AgentRadianceAnimation =
  | "center-out"
  | "edge-orbit"
  | "edge-then-center";
export type AgentRadianceView =
  | "final"
  | "emitters"
  | "jfa"
  | "sdf"
  | `cascade-${0 | 1 | 2 | 3 | 4 | 5}`;

const HDR_FORMAT: Surface["format"] = "rgba16float";
// Seeds store absolute pixel coordinates, which need f32 precision past 2048.
const SEED_FORMAT: Surface["format"] = "rgba32float";
const RC_INTERVAL0 = 2;
const DOT_SPACING = 0.105;
const DOT_RADIUS = 0.0295;
const ANIMATION_MODE: Record<AgentRadianceAnimation, number> = {
  "center-out": 0,
  "edge-orbit": 1,
  "edge-then-center": 2,
};

export function scaledSize(
  width: number,
  height: number,
  requestedScale: number,
  maxEdge: number,
): Vec2 {
  const scale = Math.min(requestedScale, maxEdge / Math.max(width, height, 1));
  return [
    Math.max(1, Math.round(width * scale)),
    Math.max(1, Math.round(height * scale)),
  ];
}

function resolveView(view: AgentRadianceView, cascadeCount: number) {
  if (view === "emitters") return { mode: 1, stage: 0, stopAt: cascadeCount };
  if (view === "jfa") return { mode: 4, stage: 1, stopAt: cascadeCount };
  if (view === "sdf") return { mode: 2, stage: 2, stopAt: cascadeCount };
  if (view.startsWith("cascade-")) {
    return {
      mode: 3,
      stage: 3,
      stopAt: Math.min(Number(view.slice(8)), cascadeCount - 1),
    };
  }
  return { mode: 0, stage: 3, stopAt: 0 };
}

export function createScene(gpu: Gpu, requestedSize: Vec2, directionBase = 2) {
  const width = Math.max(1, Math.floor(requestedSize[0]));
  const height = Math.max(1, Math.floor(requestedSize[1]));
  const size: Vec2 = [width, height];
  const cascadeCount = Math.min(
    6,
    Math.max(
      5,
      Math.ceil(
        Math.log(1 + (3 * Math.hypot(width, height)) / RC_INTERVAL0) /
          Math.log(4),
      ),
    ),
  );
  const coarsest = 2 ** (cascadeCount - 1);
  const atlas: Vec2 = [
    Math.ceil(width / coarsest) * coarsest * directionBase,
    Math.ceil(height / coarsest) * coarsest * directionBase,
  ];
  const jumpCount = Math.ceil(Math.log2(Math.max(width, height, 2)));
  const jumps = [
    ...Array.from({ length: jumpCount }, (_, index) =>
      Math.max(1, 2 ** (jumpCount - index - 1)),
    ),
    1,
    1,
  ];
  const created: Target[] = [];
  const own = (resource: Target) => {
    created.push(resource);
    return resource;
  };

  try {
    const emitter = own(target(gpu, { size, format: HDR_FORMAT }));
    const jfa: [Target, Target] = [
      own(target(gpu, { size, format: SEED_FORMAT })),
      own(target(gpu, { size, format: SEED_FORMAT })),
    ];
    const sdf = own(target(gpu, { size, format: HDR_FORMAT }));
    const cascades: [Target, Target] = [
      own(target(gpu, { size: atlas, format: HDR_FORMAT })),
      own(target(gpu, { size: atlas, format: HDR_FORMAT })),
    ];
    return {
      gpu,
      size,
      atlas,
      directionBase,
      cascadeCount,
      jumps,
      emitter,
      jfa,
      sdf,
      cascades,
      effects: {
        dots: effect(gpu, agentDotsWgsl),
        jfaInit: effect(gpu, jfaInitWgsl),
        // Uniforms upload immediately, so each encoded pass needs its own effect.
        jfaSteps: jumps.map(() => effect(gpu, jfaPassWgsl)),
        sdfFinalize: effect(gpu, sdfFinalizeWgsl),
        cascade: Array.from({ length: cascadeCount }, () =>
          effect(gpu, radianceCascadeWgsl),
        ),
        present: effect(gpu, presentWgsl),
      },
      sampler: sampler(gpu, {
        minFilter: "linear",
        magFilter: "linear",
        addressModeU: "clamp-to-edge",
        addressModeV: "clamp-to-edge",
      }),
    };
  } catch (error) {
    try {
      destroyTargets(created);
    } catch {
      // Preserve the allocation error after best-effort rollback.
    }
    throw error;
  }
}

export type AgentRadianceScene = ReturnType<typeof createScene>;

export async function prepareScene(
  scene: AgentRadianceScene,
  outputFormat: Surface["format"],
): Promise<void> {
  await Promise.all([
    scene.effects.dots.compile({ colors: [HDR_FORMAT] }),
    scene.effects.jfaInit.compile({ colors: [SEED_FORMAT] }),
    ...scene.effects.jfaSteps.map((shader) =>
      shader.compile({ colors: [SEED_FORMAT] }),
    ),
    scene.effects.sdfFinalize.compile({ colors: [HDR_FORMAT] }),
    ...scene.effects.cascade.map((shader) =>
      shader.compile({ colors: [HDR_FORMAT] }),
    ),
    scene.effects.present.compile({ colors: [outputFormat] }),
  ]);
}

export function destroyScene(scene: AgentRadianceScene): void {
  destroyTargets([scene.emitter, ...scene.jfa, scene.sdf, ...scene.cascades]);
}

function destroyTargets(targets: readonly Target[]): void {
  let firstError: unknown;
  for (let index = targets.length - 1; index >= 0; index--) {
    try {
      (targets[index] as Target & { destroy?: () => void }).destroy?.();
    } catch (error) {
      firstError ??= error;
    }
  }
  if (firstError) throw firstError;
}

export interface RadianceSettings {
  animation: AgentRadianceAnimation;
  color: readonly [number, number, number];
  layout: number;
  intensity: number;
  px: number;
  py: number;
  active: number;
}

function buildChain(
  scene: AgentRadianceScene,
  time: number,
  view: AgentRadianceView,
  animation: AgentRadianceAnimation,
  settings: RadianceSettings,
) {
  const { size, effects } = scene;
  const resolved = resolveView(view, scene.cascadeCount);
  const passes: { readonly target: Target; readonly effect: Effect }[] = [];

  effects.dots.set({
    agent: {
      size: [size[0], size[1]],
      time,
      spacing: Math.min(size[0], size[1]) * DOT_SPACING,
      radius: Math.min(size[0], size[1]) * DOT_RADIUS,
      animation_mode: ANIMATION_MODE[animation],
      tint: [...settings.color],
      arrangement: settings.layout,
      pointer: [settings.px, settings.py],
      pActive: settings.active,
    },
  });
  passes.push({ target: scene.emitter, effect: effects.dots });
  if (resolved.stage === 0) return passes;

  effects.jfaInit.set({ emitter: scene.emitter });
  passes.push({ target: scene.jfa[0], effect: effects.jfaInit });
  let seedRead = scene.jfa[0];
  let seedWrite = scene.jfa[1];
  scene.jumps.forEach((jump, index) => {
    const shader = effects.jfaSteps[index]!;
    shader.set({ jfa: { jump: [jump, 0, 0, 0] }, seeds: seedRead });
    passes.push({ target: seedWrite, effect: shader });
    [seedRead, seedWrite] = [seedWrite, seedRead];
  });
  scene.jfa = [seedRead, seedWrite];
  if (resolved.stage === 1) return passes;

  effects.sdfFinalize.set({ seeds: seedRead });
  passes.push({ target: scene.sdf, effect: effects.sdfFinalize });
  if (resolved.stage === 2) return passes;

  let atlasWrite = scene.cascades[0];
  let atlasRead = scene.cascades[1];
  for (
    let cascade = scene.cascadeCount - 1;
    cascade >= resolved.stopAt;
    cascade--
  ) {
    const shader = effects.cascade[cascade]!;
    shader.set({
      rc: {
        state: [
          cascade,
          cascade < scene.cascadeCount - 1 ? 1 : 0,
          scene.directionBase,
          0,
        ],
      },
      sdf_tex: scene.sdf,
      sdf_samp: scene.sampler,
      emitter_tex: scene.emitter,
      emitter_samp: scene.sampler,
      upper_tex: atlasRead,
    });
    passes.push({ target: atlasWrite, effect: shader });
    [atlasRead, atlasWrite] = [atlasWrite, atlasRead];
  }
  scene.cascades = [atlasRead, atlasWrite];
  return passes;
}

export function renderLighting(
  scene: AgentRadianceScene,
  time: number,
  view: AgentRadianceView,
  animation: AgentRadianceAnimation,
  settings: RadianceSettings,
): void {
  const passes = buildChain(scene, time, view, animation, settings);
  frame(scene.gpu, (currentFrame) => {
    for (const pass of passes) {
      currentFrame.pass(
        { target: pass.target, clear: [0, 0, 0, 0] },
        (encoder) => encoder.draw(pass.effect),
      );
    }
  });
}

export function presentScene(
  scene: AgentRadianceScene,
  output: Output,
  view: AgentRadianceView,
  intensity = 1,
): void {
  scene.effects.present.set({
    present: {
      display: [
        0.92 * intensity,
        resolveView(view, scene.cascadeCount).mode,
        48,
        scene.directionBase,
      ],
      lighting: [0.075, 0.004, 0, 0],
    },
    cascade_tex: scene.cascades[0],
    emitter_tex: scene.emitter,
    sdf_tex: scene.sdf,
    jfa_tex: scene.jfa[0],
    emitter_samp: scene.sampler,
  });
  frame(scene.gpu, (currentFrame) => {
    currentFrame.pass({ target: output, clear: [0, 0, 0, 1] }, (encoder) =>
      encoder.draw(scene.effects.present),
    );
  });
}
