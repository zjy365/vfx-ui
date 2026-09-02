"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Effect, Frame, Gpu, Surface, Target, Texture } from "vgpu";

/*
 * BlackHole — the vgpu `optimized-black-hole` example, ported verbatim into a
 * drop-in vfx-ui component (MIT, Copyright 2025 Vercel, Inc.).
 *
 * This is the real multi-pass pipeline, not an approximation:
 *   1. BAKE    — integrates one null geodesic per pixel (a = -1.5·h²·x/r⁵) and
 *                writes the G-buffer: two accretion-disk plane crossings, the
 *                lensed escape direction, and packed view vectors.
 *   2. REFINE  — one-shot photon-ring AA: 4×4 supersampled coverage, radial
 *                span, and synthesized crossings for missed sub-pixel hits.
 *   3. SHADE   — per-frame: decodes the bake, rotates the scene for pointer
 *                lean, shades the disk (thermal ramp, shear cycle, Doppler
 *                beaming, redshift, optical depth) over a prefiltered lensed
 *                star field, composites near/far layers.
 *   4. BLOOM   — HDR extract + separable Gaussian at half/quarter/eighth.
 *   5. COMPOSITE — bloom combine, ACES tone map, vignette, gamma.
 *
 * The expensive bake runs once per geometry change (resize, camera props);
 * animation only re-shades. WGSL sources below are the example's files with
 * imports flattened (geodesic/gbuffer/disk/stars inlined, @vgpu/wgsl-std hash
 * functions copied in) — the algorithm is untouched.
 */

/** Flattened `geodesic.wgsl + bake.wgsl` from the example. */
export const BLACK_HOLE_BAKE_SHADER = /* wgsl */ `
// Shared Schwarzschild-like ray integration used by the bake and refinement passes.
const  HORIZON: f32 = 1.0;
const  ISCO: f32 = 3.0;
const  MAX_STEPS: i32 = 768;
struct  TraceResult {
  hit1Plane: vec2f,
  hit1Direction: vec2f,
  hit2Plane: vec2f,
  hit2Direction: vec2f,
  hitCount: i32,
  swallowed: f32,
  escaped: f32,

  finalVelocity: vec3f,
}
struct  CameraRay {
  position: vec3f,
  velocity: vec3f,
}
fn  escapeRadiusFor(orbitRadius: f32) -> f32 {
  return max(120.0, orbitRadius + 8.0);
}
fn  encodeDirection(direction: vec3f) -> vec2f {
  return vec2f(direction.y, atan2(direction.z, direction.x));
}

fn geodesicAcceleration(position: vec3f, velocity: vec3f) -> vec3f {
  let r2 = max(dot(position, position), 0.0001);
  let angularMomentum = cross(position, velocity);
  let h2 = dot(angularMomentum, angularMomentum);
  return -1.5 * h2 * position / (r2 * r2 * sqrt(r2));
}
fn  cameraRay(
  uv: vec2f,
  resolution: vec2f,
  yaw: f32,
  pitch: f32,
  orbitRadius: f32,
  fov: f32,
  centerX: f32,
  centerY: f32,
  roll: f32,
) -> CameraRay {
  let aspect = resolution.x / max(resolution.y, 1.0);
  let ndc = vec2f(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0);
  let screenPlane = (ndc - vec2f(centerX, centerY)) * vec2f(aspect, 1.0);
  let cosine = cos(roll);
  let sine = sin(roll);
  let screen = vec2f(
    screenPlane.x * cosine - screenPlane.y * sine,
    screenPlane.x * sine + screenPlane.y * cosine,
  );

  let clampedPitch = clamp(pitch, -1.319, 1.319);
  let cameraPosition = vec3f(
    sin(yaw) * cos(clampedPitch) * orbitRadius,
    sin(clampedPitch) * orbitRadius,
    cos(yaw) * cos(clampedPitch) * orbitRadius,
  );
  let forward = normalize(vec3f(0.0) - cameraPosition);
  let right = normalize(cross(forward, vec3f(0.0, 1.0, 0.0)));
  let up = cross(right, forward);

  var ray: CameraRay;
  ray.position = cameraPosition;
  ray.velocity = normalize(forward * fov + right * screen.x + up * screen.y);
  return ray;
}
fn  traceRay(cameraPosition: vec3f, initialVelocity: vec3f, diskOuter: f32, escapeRadius: f32) -> TraceResult {
  var position = cameraPosition;
  var velocity = initialVelocity;

  var result: TraceResult;
  result.hit1Plane = vec2f(0.0);
  result.hit1Direction = vec2f(0.0);
  result.hit2Plane = vec2f(0.0);
  result.hit2Direction = vec2f(0.0);
  result.hitCount = 0;
  result.swallowed = 0.0;
  result.escaped = 0.0;

  for (var stepIndex = 0; stepIndex < MAX_STEPS; stepIndex++) {
    let radius = length(position);
    if (radius < HORIZON * 1.004) {
      result.swallowed = 1.0;
      break;
    }
    if (radius > escapeRadius && dot(position, velocity) > 0.0) {
      result.escaped = 1.0;
      break;
    }

    let stepSize = clamp((radius - HORIZON) * 0.035, 0.0045, 0.075 * max(1.0, radius / 6.0));

    let previousPosition = position;
    let previousVelocity = velocity;

    let acceleration0 = geodesicAcceleration(position, velocity);
    velocity += acceleration0 * (0.5 * stepSize);
    position += velocity * stepSize;
    let acceleration1 = geodesicAcceleration(position, velocity);
    velocity += acceleration1 * (0.5 * stepSize);
    velocity = normalize(velocity);

    if (result.hitCount < 2) {
      let previousSide = select(-1.0, 1.0, previousPosition.y >= 0.0);
      let currentSide = select(-1.0, 1.0, position.y >= 0.0);
      if (previousSide != currentSide) {
        let t = clamp(previousPosition.y / (previousPosition.y - position.y), 0.0, 1.0);
        let crossing = mix(previousPosition, position, t);
        let planeRadius = length(crossing.xz);
        if (planeRadius >= ISCO && planeRadius <= diskOuter) {
          let direction = encodeDirection(normalize(mix(previousVelocity, velocity, t)));
          if (result.hitCount == 0) {
            result.hit1Plane = crossing.xz;
            result.hit1Direction = direction;
          } else {
            result.hit2Plane = crossing.xz;
            result.hit2Direction = direction;
          }
          result.hitCount += 1;
        }
      }
    }
  }

  result.finalVelocity = velocity;
  return result;
}

// One-shot geodesic bake: store two disk crossings, the lensed sky, and view directions.

struct Bake {
  resolution: vec2f,
  yaw: f32,
  pitch: f32,
  orbitRadius: f32,
  diskOuter: f32,
  fov: f32,
  centerX: f32,
  centerY: f32,
  roll: f32,
}

@group(0) @binding(0) var<uniform> bake: Bake;

const FLAG_HOLE: f32 = 1.0;

const FLAG_ESCAPED: f32 = 2.0;

struct GBuffer {
  @location(0) hit1: vec2f,
  @location(1) hit2: vec2f,
  @location(2) sky: vec4f,
  @location(3) view: vec4f,
}

@fragment fn fs_main(@location(0) uv: vec2f) -> GBuffer {
  let ray = cameraRay(
    uv,
    bake.resolution,
    bake.yaw,
    bake.pitch,
    bake.orbitRadius,
    bake.fov,
    bake.centerX,
    bake.centerY,
    bake.roll,
  );
  var traced = traceRay(ray.position, ray.velocity, bake.diskOuter, escapeRadiusFor(bake.orbitRadius));

  if (traced.swallowed < 0.5 && traced.escaped < 0.5) {
    traced.swallowed = 1.0;
  }

  return GBuffer(
    traced.hit1Plane,
    traced.hit2Plane,
    vec4f(traced.finalVelocity, traced.swallowed * FLAG_HOLE + traced.escaped * FLAG_ESCAPED),
    vec4f(traced.hit1Direction, traced.hit2Direction),
  );
}
`;

/** Flattened `geodesic.wgsl + refine.wgsl` from the example. */
export const BLACK_HOLE_REFINE_SHADER = /* wgsl */ `
// Shared Schwarzschild-like ray integration used by the bake and refinement passes.
const  HORIZON: f32 = 1.0;
const  ISCO: f32 = 3.0;
const  MAX_STEPS: i32 = 768;
struct  TraceResult {
  hit1Plane: vec2f,
  hit1Direction: vec2f,
  hit2Plane: vec2f,
  hit2Direction: vec2f,
  hitCount: i32,
  swallowed: f32,
  escaped: f32,

  finalVelocity: vec3f,
}
struct  CameraRay {
  position: vec3f,
  velocity: vec3f,
}
fn  escapeRadiusFor(orbitRadius: f32) -> f32 {
  return max(120.0, orbitRadius + 8.0);
}
fn  encodeDirection(direction: vec3f) -> vec2f {
  return vec2f(direction.y, atan2(direction.z, direction.x));
}

fn geodesicAcceleration(position: vec3f, velocity: vec3f) -> vec3f {
  let r2 = max(dot(position, position), 0.0001);
  let angularMomentum = cross(position, velocity);
  let h2 = dot(angularMomentum, angularMomentum);
  return -1.5 * h2 * position / (r2 * r2 * sqrt(r2));
}
fn  cameraRay(
  uv: vec2f,
  resolution: vec2f,
  yaw: f32,
  pitch: f32,
  orbitRadius: f32,
  fov: f32,
  centerX: f32,
  centerY: f32,
  roll: f32,
) -> CameraRay {
  let aspect = resolution.x / max(resolution.y, 1.0);
  let ndc = vec2f(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0);
  let screenPlane = (ndc - vec2f(centerX, centerY)) * vec2f(aspect, 1.0);
  let cosine = cos(roll);
  let sine = sin(roll);
  let screen = vec2f(
    screenPlane.x * cosine - screenPlane.y * sine,
    screenPlane.x * sine + screenPlane.y * cosine,
  );

  let clampedPitch = clamp(pitch, -1.319, 1.319);
  let cameraPosition = vec3f(
    sin(yaw) * cos(clampedPitch) * orbitRadius,
    sin(clampedPitch) * orbitRadius,
    cos(yaw) * cos(clampedPitch) * orbitRadius,
  );
  let forward = normalize(vec3f(0.0) - cameraPosition);
  let right = normalize(cross(forward, vec3f(0.0, 1.0, 0.0)));
  let up = cross(right, forward);

  var ray: CameraRay;
  ray.position = cameraPosition;
  ray.velocity = normalize(forward * fov + right * screen.x + up * screen.y);
  return ray;
}
fn  traceRay(cameraPosition: vec3f, initialVelocity: vec3f, diskOuter: f32, escapeRadius: f32) -> TraceResult {
  var position = cameraPosition;
  var velocity = initialVelocity;

  var result: TraceResult;
  result.hit1Plane = vec2f(0.0);
  result.hit1Direction = vec2f(0.0);
  result.hit2Plane = vec2f(0.0);
  result.hit2Direction = vec2f(0.0);
  result.hitCount = 0;
  result.swallowed = 0.0;
  result.escaped = 0.0;

  for (var stepIndex = 0; stepIndex < MAX_STEPS; stepIndex++) {
    let radius = length(position);
    if (radius < HORIZON * 1.004) {
      result.swallowed = 1.0;
      break;
    }
    if (radius > escapeRadius && dot(position, velocity) > 0.0) {
      result.escaped = 1.0;
      break;
    }

    let stepSize = clamp((radius - HORIZON) * 0.035, 0.0045, 0.075 * max(1.0, radius / 6.0));

    let previousPosition = position;
    let previousVelocity = velocity;

    let acceleration0 = geodesicAcceleration(position, velocity);
    velocity += acceleration0 * (0.5 * stepSize);
    position += velocity * stepSize;
    let acceleration1 = geodesicAcceleration(position, velocity);
    velocity += acceleration1 * (0.5 * stepSize);
    velocity = normalize(velocity);

    if (result.hitCount < 2) {
      let previousSide = select(-1.0, 1.0, previousPosition.y >= 0.0);
      let currentSide = select(-1.0, 1.0, position.y >= 0.0);
      if (previousSide != currentSide) {
        let t = clamp(previousPosition.y / (previousPosition.y - position.y), 0.0, 1.0);
        let crossing = mix(previousPosition, position, t);
        let planeRadius = length(crossing.xz);
        if (planeRadius >= ISCO && planeRadius <= diskOuter) {
          let direction = encodeDirection(normalize(mix(previousVelocity, velocity, t)));
          if (result.hitCount == 0) {
            result.hit1Plane = crossing.xz;
            result.hit1Direction = direction;
          } else {
            result.hit2Plane = crossing.xz;
            result.hit2Direction = direction;
          }
          result.hitCount += 1;
        }
      }
    }
  }

  result.finalVelocity = velocity;
  return result;
}

// One-shot photon-ring refinement: measure sub-pixel coverage and synthesize missed crossings.

struct Refine {
  resolution: vec2f,
  yaw: f32,
  pitch: f32,
  orbitRadius: f32,
  diskOuter: f32,
  fov: f32,
  centerX: f32,
  centerY: f32,
  roll: f32,
}

@group(0) @binding(0) var<uniform> refine: Refine;

@group(0) @binding(1) var gHit1: texture_2d<f32>;

@group(0) @binding(2) var gSky: texture_2d<f32>;

const SUB_STEPS: i32 = 4;

const MASK_RADIUS: i32 = 2;

const GRADIENT_LIMIT: f32 = 0.12;

const B_CRIT: f32 = 2.59807621;

const CRITICAL_BAND: f32 = 0.06;

fn isHitAt(plane: vec2f) -> bool {
  return length(plane) > ISCO * 0.5;
}

struct RefineOut {
  @location(0) coverage: vec2f,
  @location(1) geometry: vec4f,
}

@fragment fn fs_main(@location(0) uv: vec2f) -> RefineOut {
  let dimensions = vec2i(textureDimensions(gHit1, 0));
  let texel = vec2i(clamp(uv * refine.resolution, vec2f(0.0), refine.resolution - vec2f(1.0)));
  let annulus = max(refine.diskOuter - ISCO, 0.001);

  let centerPlane = textureLoad(gHit1, texel, 0).xy;
  let centerHit = isHitAt(centerPlane);
  let centerHole = (i32(textureLoad(gSky, texel, 0).w + 0.5) & 1) != 0;
  let centerRadiusNorm = clamp((length(centerPlane) - ISCO) / annulus, 0.0, 1.0);

  let centerRay = cameraRay(
    uv,
    refine.resolution,
    refine.yaw,
    refine.pitch,
    refine.orbitRadius,
    refine.fov,
    refine.centerX,
    refine.centerY,
    refine.roll,
  );
  let impactParameter = length(cross(centerRay.position, centerRay.velocity));

  var boundary = abs(impactParameter - B_CRIT) < CRITICAL_BAND * HORIZON;
  for (var dy = -MASK_RADIUS; dy <= MASK_RADIUS; dy++) {
    for (var dx = -MASK_RADIUS; dx <= MASK_RADIUS; dx++) {
      let neighbor = clamp(texel + vec2i(dx, dy), vec2i(0), dimensions - vec2i(1));
      let plane = textureLoad(gHit1, neighbor, 0).xy;
      let hit = isHitAt(plane);
      let hole = (i32(textureLoad(gSky, neighbor, 0).w + 0.5) & 1) != 0;
      if (hit != centerHit || hole != centerHole) {
        boundary = true;
      }
      if (hit && centerHit) {
        let radiusNorm = clamp((length(plane) - ISCO) / annulus, 0.0, 1.0);
        if (abs(radiusNorm - centerRadiusNorm) > GRADIENT_LIMIT) {
          boundary = true;
        }
      }
    }
  }

  if (!boundary) {
    return RefineOut(vec2f(select(0.0, 1.0, centerHit), 0.0), vec4f(0.0));
  }

  let escapeRadius = escapeRadiusFor(refine.orbitRadius);
  var hits = 0.0;
  var minRadius = 1e9;
  var maxRadius = -1e9;
  var bestPlane = vec2f(0.0);
  var bestDirection = vec2f(0.0);
  var bestRadius = 0.0;
  var bestDistance = 1e9;
  for (var sy = 0; sy < SUB_STEPS; sy++) {
    for (var sx = 0; sx < SUB_STEPS; sx++) {
      let offset = (vec2f(f32(sx), f32(sy)) + vec2f(0.5)) / f32(SUB_STEPS);
      let subUv = (vec2f(texel) + offset) / refine.resolution;
      let ray = cameraRay(
        subUv,
        refine.resolution,
        refine.yaw,
        refine.pitch,
        refine.orbitRadius,
        refine.fov,
        refine.centerX,
        refine.centerY,
        refine.roll,
      );
      let traced = traceRay(ray.position, ray.velocity, refine.diskOuter, escapeRadius);
      if (traced.hitCount > 0) {
        let radius = length(traced.hit1Plane);
        hits += 1.0;
        minRadius = min(minRadius, radius);
        maxRadius = max(maxRadius, radius);
        let distance = length(offset - vec2f(0.5));
        if (distance < bestDistance) {
          bestDistance = distance;
          bestPlane = traced.hit1Plane;
          bestDirection = traced.hit1Direction;
          bestRadius = radius;
        }
      }
    }
  }

  let coverage = hits / f32(SUB_STEPS * SUB_STEPS);
  if (hits < 0.5) {
    return RefineOut(vec2f(0.0, 0.0), vec4f(0.0));
  }

  var r0 = length(centerPlane);
  var span = 0.0;
  var geometry = vec4f(0.0);
  if (centerHit) {
    span = 2.0 * max(abs(maxRadius - r0), abs(r0 - minRadius));
  } else {
    r0 = 0.5 * (minRadius + maxRadius);
    span = maxRadius - minRadius;
    geometry = vec4f(bestPlane * (r0 / max(bestRadius, ISCO)), bestDirection);
  }
  return RefineOut(vec2f(coverage, clamp(span / annulus, 0.0, 1.0)), geometry);
}
`;

/** Flattened `gbuffer + disk + hash + stars + shade` WGSL from the example. */
export const BLACK_HOLE_SHADE_SHADER = /* wgsl */ `
// Shared decoding contract for the baked crossings consumed by the frame shader.
const  HORIZON: f32 = 1.0;
const  ISCO: f32 = 3.0;
const  TAU: f32 = 6.28318530718;
const  PI_CONST: f32 = 3.14159265359;
struct  GBufferSample {
  position: vec3f,
  normal: vec3f,
  diskUv: vec2f,
  diskPolar: vec2f,
  rayDirection: vec3f,
  viewDirection: vec3f,
  side: f32,
  coverage: f32,
  span: f32,
  isHit: bool,
  synthesized: bool,
  isBlackHole: bool,
  escaped: bool,
}
struct  GBufferLayers {
  front: GBufferSample,
  back: GBufferSample,
}

fn decodeDirection(encoded: vec2f) -> vec3f {
  let horizontal = sqrt(max(1.0 - encoded.x * encoded.x, 0.0));
  return vec3f(cos(encoded.y) * horizontal, encoded.x, sin(encoded.y) * horizontal);
}

fn decodeLayer(
  plane: vec2f, encodedDirection: vec2f, sky: vec4f, flags: i32,
  diskOuter: f32, aa: vec2f, synthesized: bool,
) -> GBufferSample {
  var sample: GBufferSample;
  let planeRadius = length(plane);
  let isHit = planeRadius > ISCO * 0.5;
  let radius = max(planeRadius, ISCO);
  let azimuth = atan2(plane.y, plane.x);
  let direction = decodeDirection(encodedDirection);
  let side = select(1.0, -1.0, direction.y > 0.0);

  sample.position = select(vec3f(0.0), vec3f(plane.x, 0.0, plane.y), isHit);
  sample.normal = select(vec3f(0.0), vec3f(0.0, side, 0.0), isHit);
  sample.diskUv = vec2f(
    clamp((radius - ISCO) / max(diskOuter - ISCO, 0.001), 0.0, 1.0),
    (azimuth + PI_CONST) / TAU,
  );
  sample.diskPolar = vec2f(radius, azimuth);
  sample.rayDirection = sky.xyz;
  sample.viewDirection = direction;
  sample.side = select(0.0, side, isHit);
  sample.coverage = clamp(aa.x, 0.0, 1.0);
  sample.span = clamp(aa.y, 0.0, 1.0);
  sample.isHit = isHit;
  sample.synthesized = synthesized && isHit;
  sample.isBlackHole = (flags & 1) != 0;
  sample.escaped = (flags & 2) != 0;
  return sample;
}
fn  decodeGBuffer(
  hit1: vec2f, hit2: vec2f, sky: vec4f, view: vec4f,
  diskOuter: f32, aa: vec2f, aaGeom: vec4f,
) -> GBufferLayers {
  let flags = i32(sky.w + 0.5);
  let substitute = length(hit1) <= ISCO * 0.5 && length(aaGeom.xy) > ISCO * 0.5;
  let frontPlane = select(hit1, aaGeom.xy, substitute);
  let frontDirection = select(view.xy, aaGeom.zw, substitute);
  var layers: GBufferLayers;
  layers.front = decodeLayer(frontPlane, frontDirection, sky, flags, diskOuter, aa, substitute);
  layers.back = decodeLayer(hit2, view.zw, sky, flags, diskOuter, vec2f(1.0, 0.0), false);
  if (!layers.front.isHit) {
    layers.back.isHit = false;
    layers.back.side = 0.0;
    layers.back.normal = vec3f(0.0);
  }
  return layers;
}
fn  sampleAtRadius(g: GBufferSample, radius: f32, diskOuter: f32) -> GBufferSample {
  var moved = g;
  let clamped = clamp(radius, ISCO, max(diskOuter, ISCO));
  let azimuth = g.diskPolar.y;
  moved.position = vec3f(cos(azimuth) * clamped, 0.0, sin(azimuth) * clamped);
  moved.diskPolar = vec2f(clamped, azimuth);
  moved.diskUv = vec2f(
    clamp((clamped - ISCO) / max(diskOuter - ISCO, 0.001), 0.0, 1.0),
    g.diskUv.y,
  );
  return moved;
}

// Accretion-disk material with deterministic tiled noise and radial prefiltering.
struct  DiskLook {
  brightness: f32,
  speed: f32,
  stretch: f32,
  detail: f32,
  turbulence: f32,
  density: f32,
  doppler: f32,
  cloudScale: f32,
  cloudSpeed: f32,
  cloudStrength: f32,
  spare0: f32,
  spare1: f32,
  spare2: f32,
  spare3: f32,
}
struct  DiskSample {
  color: vec3f,
  alpha: f32,
}

struct NoiseLattice {
  invSize: f32,
}

fn noise3(tex: texture_3d<f32>, samp: sampler, lattice: NoiseLattice, p: vec3f) -> f32 {
  let i = floor(p);
  let f = p - i;
  let u = f * f * (3.0 - 2.0 * f);
  return textureSampleLevel(tex, samp, (i + u + vec3f(0.5)) * lattice.invSize, 0.0).r;
}

fn streakFbm(
  tex: texture_3d<f32>,
  samp: sampler,
  lattice: NoiseLattice,
  angle: f32,
  radius: f32,
  angScale: f32,
  radScale: f32,
  octaves: i32,
  dAngle: f32,
  dRadius: f32,
  lacAng: f32,
  lacRad: f32,
  seed: f32,
) -> f32 {
  var value: f32 = 0.0;
  var total: f32 = 0.0;
  var amplitude: f32 = 0.5;
  var a = angScale;
  var r = radScale;
  var offset = seed;
  for (var i = 0; i < octaves; i++) {
    let visible = clamp(1.0 - 1.7 * max(dAngle * a, dRadius * r), 0.0, 1.0);
    var sampleValue: f32 = 0.5;
    if (visible > 0.004) {
      sampleValue = mix(
        0.5,
        noise3(tex, samp, lattice, vec3f(cos(angle) * a, sin(angle) * a, radius * r + offset)),
        visible,
      );
    }
    value += amplitude * sampleValue;
    total += amplitude;
    a *= lacAng;
    r *= lacRad;
    offset += 23.7;
    amplitude *= 0.55;
  }
  return value / max(total, 0.0001);
}

fn ridgeFbm(
  tex: texture_3d<f32>,
  samp: sampler,
  lattice: NoiseLattice,
  angle: f32,
  radius: f32,
  angScale: f32,
  radScale: f32,
  octaves: i32,
  dAngle: f32,
  dRadius: f32,
  lacAng: f32,
  lacRad: f32,
  seed: f32,
) -> f32 {
  var value: f32 = 0.0;
  var total: f32 = 0.0;
  var amplitude: f32 = 0.5;
  var a = angScale;
  var r = radScale;
  var offset = seed;
  for (var i = 0; i < octaves; i++) {
    let visible = clamp(1.0 - 1.7 * max(dAngle * a, dRadius * r), 0.0, 1.0);
    var crest: f32 = 0.42;
    if (visible > 0.004) {
      let n = noise3(tex, samp, lattice, vec3f(cos(angle) * a, sin(angle) * a, radius * r + offset));
      crest = mix(0.42, pow(1.0 - abs(n * 2.0 - 1.0), 1.35), visible);
    }
    value += amplitude * crest;
    total += amplitude;
    a *= lacAng;
    r *= lacRad;
    offset += 41.9;
    amplitude *= 0.62;
  }
  return value / max(total, 0.0001);
}

struct FieldParams {
  angBase: f32,
  radBase: f32,
  flowRad: f32,
  chaos: f32,
  outward: f32,
  dAngle: f32,
  dRadius: f32,
}

fn smokeField(
  tex: texture_3d<f32>, samp: sampler, lattice: NoiseLattice,
  angle: f32, radius: f32, p: FieldParams,
) -> vec2f {
  let warpA = (streakFbm(
    tex, samp, lattice, angle, radius, p.angBase * 0.55, p.flowRad * 1.6,
    2, p.dAngle, p.dRadius, 1.6, 2.0, 3.7,
  )) - 0.5;
  let warpB = (streakFbm(
    tex, samp, lattice, angle + 2.4, radius * 1.13,
    p.angBase * 2.8, p.radBase * 0.45, 3, p.dAngle, p.dRadius,
    1.7, 2.0, 61.3,
  )) - 0.5;
  let radiusW = radius + (warpA * 1.9 + warpB * 1.25 * p.outward) * p.chaos;
  let angleW = angle + (warpB * 0.9 - warpA * 0.35) * p.chaos * 0.55 / max(radius * 0.22, 0.35);

  let flow = streakFbm(
    tex, samp, lattice, angleW, radiusW, p.angBase, p.flowRad,
    3, p.dAngle, p.dRadius, 2.0, 1.12, 131.7,
  );
  let threads = ridgeFbm(
    tex, samp, lattice, angleW, radiusW, p.angBase * 0.85, p.radBase,
    5, p.dAngle, p.dRadius, 1.26, 2.05, 0.0,
  );

  let fineVis = clamp(1.0 - 1.7 * max(p.dAngle * p.angBase * 0.85, p.dRadius * p.radBase), 0.0, 1.0);
  let field = mix(flow, flow * 0.22 + threads * 1.05, fineVis);
  let rim = (warpA + warpB * 0.5) * 0.9;
  return vec2f(f32(field), rim);
}

const FIELD_MEAN = 0.52;

const SHEAR_REF_RADIUS = 6.5;
const  SHEAR_PERIOD: f32 = 10.0;
const TWO_PI = 6.283185307;
fn  shadeDisk(
  g: GBufferSample,
  look: DiskLook,
  time: f32,
  footprint: f32,
  noiseTex: texture_3d<f32>,
  noiseSampler: sampler,
) -> DiskSample {
  var lattice: NoiseLattice;
  lattice.invSize = 1.0 / f32(textureDimensions(noiseTex).x);

  let plane = vec2f(g.position.x, g.position.z);
  let radius = g.diskPolar.x;
  let azimuth = g.diskPolar.y;
  let radiusNorm = clamp(g.diskUv.x, 0.0, 1.0);
  let viewDirection = g.viewDirection;

  let slant = max(abs(viewDirection.y), 0.022);
  let grazing = min(1.0 / slant, 34.0);

  let viewPlane = normalize(vec2f(viewDirection.x, viewDirection.z) + vec2f(1e-6, 0.0));
  let radialDir = normalize(plane + vec2f(1e-6, 0.0));
  let alignR = clamp(abs(dot(radialDir, viewPlane)), 0.0, 1.0);
  let alignT = sqrt(max(1.0 - alignR * alignR, 0.0));
  let stretchSq = grazing * grazing - 1.0;
  let kR = sqrt(1.0 + stretchSq * alignR * alignR);   // radial elongation
  let kT = sqrt(1.0 + stretchSq * alignT * alignT);   // tangential elongation
  let baseScaleR = max(look.detail, 0.05);
  let baseScaleA = max(look.stretch, 0.05);
  let pixelWorld = footprint / max(baseScaleR * kR, baseScaleA * kT / max(radius, ISCO));
  let dRadius = pixelWorld * kR;
  let dAngle = pixelWorld * kT / max(radius, ISCO);

  let omega = look.speed * 0.55 / pow(radius, 1.5);
  let omegaRef = look.speed * 0.55 / pow(SHEAR_REF_RADIUS, 1.5);
  let dOmega = omega - omegaRef;
  let rigid = fract(time * omegaRef / TWO_PI) * TWO_PI;
  let swirl = max(0.0, 0.85 + look.spare1);
  let flowBase = azimuth - rigid + swirl * log(radius / ISCO);

  let cycle = time / SHEAR_PERIOD;
  let u0 = fract(cycle);
  let u1 = fract(cycle + 0.5);
  let shear0 = (u0 - 0.5) * SHEAR_PERIOD;
  let shear1 = (u1 - 0.5) * SHEAR_PERIOD;
  let w0 = 1.0 - abs(2.0 * u0 - 1.0);
  let w1 = 1.0 - w0;
  let angle0 = flowBase - dOmega * shear0;
  let angle1 = flowBase - dOmega * shear1;

  let outward = smoothstep(0.0, 0.92, radiusNorm);
  let fray = max(0.0, 1.0 + look.spare3);
  let chaos = look.turbulence * (0.08 + 2.10 * outward * outward) * fray;

  let angBase = max(look.stretch, 0.05) * 0.45 * (0.80 + 1.45 * outward * fray);
  let radBase = max(look.detail, 0.05) * 2.35;
  let flowRad = max(look.detail, 0.05) * 0.105;

  var params: FieldParams;
  params.angBase = angBase;
  params.radBase = radBase;
  params.flowRad = flowRad;
  params.chaos = chaos;
  params.outward = outward;
  params.dAngle = dAngle;
  params.dRadius = dRadius;
  let lobeShift = abs(dOmega) * SHEAR_PERIOD * 0.5 * angBase * 0.85;
  let rho = 1.0 - smoothstep(0.12, 1.1, lobeShift);

  var blended: vec2f;
  var lobeVariance = 1.0;
  if (rho > 0.98) {
    let angleMerged = mix(angle1, angle0, w0);
    blended = smokeField(noiseTex, noiseSampler, lattice, angleMerged, radius, params);
  } else {
    let lobe0 = smokeField(noiseTex, noiseSampler, lattice, angle0, radius, params);
    let lobe1 = smokeField(noiseTex, noiseSampler, lattice, angle1, radius, params);
    blended = mix(lobe1, lobe0, w0);
    lobeVariance = sqrt(max(w0 * w0 + w1 * w1 + 2.0 * rho * w0 * w1, 0.25));
  }
  var field = FIELD_MEAN + (blended.x - FIELD_MEAN) / lobeVariance;

  let cloudRate = omegaRef * look.cloudSpeed;
  let cloudRigid = fract(time * cloudRate / TWO_PI) * TWO_PI;
  let cloudAngle = azimuth - cloudRigid + 0.32 * log(radius / ISCO);
  let cloudScale = max(look.cloudScale, 0.05);
  let cloudRaw = streakFbm(
    noiseTex,
    noiseSampler,
    lattice,
    cloudAngle,
    radius,
    cloudScale,
    cloudScale * 0.34,
    2,
    dAngle,
    dRadius,
    1.72,
    1.86,
    211.7,
  );
  let cloud = smoothstep(0.28, 0.72, cloudRaw);
  let cloudStrength = clamp(look.cloudStrength, 0.0, 0.95);
  let cloudMultiplier = mix(1.0 - cloudStrength, 1.0 + cloudStrength, cloud);
  field *= cloudMultiplier;

  let rimNoise = blended.y;
  let innerEdge = smoothstep(0.0, 0.055, radiusNorm);
  let outerEdge = 1.0 - smoothstep(0.42 + rimNoise * 0.30 * fray, 1.0, radiusNorm);
  let envelope = innerEdge * outerEdge * mix(1.0, 0.62, outward);

  let contrast = max(0.2, 1.0 + look.spare2);
  let lo = 0.50 - 0.16 / contrast;
  let hi = 0.50 + 0.21 / contrast;
  var smoke = clamp(pow(smoothstep(lo, hi, field), 1.0 + 0.9 * contrast) * envelope, 0.0, 1.0);

  let fieldN = clamp((field - (lo - 0.10)) / max(hi - lo + 0.26, 0.02), 0.0, 1.0);
  let emissivity = (mix(0.05, 1.0, pow(fieldN, 1.35)) + 2.2 * pow(fieldN, 5.0)) * envelope;

  let path = pow(grazing, 0.62);
  let thickness = mix(0.30, 0.85, radiusNorm);
  let opticalDepth = smoke * thickness * path * look.density * 0.95;
  let coverage = 1.0 - exp(-opticalDepth);

  let heat = pow(1.0 - radiusNorm, 1.25);
  var thermal = mix(vec3f(0.52, 0.14, 0.03), vec3f(1.0, 0.56, 0.17), smoothstep(0.03, 0.5, heat));
  thermal = mix(thermal, vec3f(1.0, 0.94, 0.83), pow(heat, 2.2));

  let tangent = normalize(vec3f(-plane.y, 0.0, plane.x));
  let orbitalSpeed = min(0.64, 0.94 / sqrt(max(radius - HORIZON, 0.25)));
  let towardObserver = dot(tangent, -normalize(viewDirection));
  let beaming = pow(clamp(1.0 / (1.0 - orbitalSpeed * towardObserver), 0.72, 1.55), 1.5 * look.doppler);
  let redshift = sqrt(max(1.0 - HORIZON / radius, 0.025));

  let facing = mix(0.82, 1.0, step(0.0, g.side));

  let flux = pow(clamp(ISCO / radius, 0.0, 1.0), 1.7);
  let core = 1.0 + 2.6 * pow(1.0 - radiusNorm, 5.0);

  let arcLift = max(0.0, 1.0 + look.spare0);
  let faceOn = smoothstep(0.16, 0.75, abs(viewDirection.y));
  let lift = 1.0 + 1.55 * arcLift * faceOn;
  let edgeGlow = 1.0 + 0.55 * smoothstep(6.0, 26.0, grazing);

  let source = thermal * beaming * redshift * facing * flux * lift * edgeGlow * core * emissivity;
  let emission = source * look.brightness * 1.35;

  var sample: DiskSample;
  sample.color = vec3f(emission);
  sample.alpha = coverage;
  return sample;
}

// Inlined from @vgpu/wgsl-std/hash (MIT, Copyright 2025 Vercel, Inc.)
fn hashU32(value: u32) -> u32 {
  var hashed = value;
  hashed = (hashed ^ (hashed >> 16u)) * 0x7feb352du;
  hashed = (hashed ^ (hashed >> 15u)) * 0x846ca68bu;
  hashed = hashed ^ (hashed >> 16u);
  return hashed;
}
fn pcg3d(value: vec3u) -> vec3u {
  var hashed = value * 1664525u + 1013904223u;
  hashed.x = hashed.x + hashed.y * hashed.z;
  hashed.y = hashed.y + hashed.z * hashed.x;
  hashed.z = hashed.z + hashed.x * hashed.y;
  hashed = hashed ^ (hashed >> vec3u(16u));
  hashed.x = hashed.x + hashed.y * hashed.z;
  hashed.y = hashed.y + hashed.z * hashed.x;
  hashed.z = hashed.z + hashed.x * hashed.y;
  hashed = hashed ^ (hashed >> vec3u(16u));
  return hashed;
}
fn unitFloat(hash: u32) -> f32 {
  return f32(hash >> 8u) * (1.0 / 16777216.0);
}


// Procedural lensed star field with anisotropic footprint prefiltering.

const STAR_INTENSITY: f32 = 1.9;

const ANCHOR_CELLS: f32 = 36.0;
const ANCHOR_FILL: f32 = 0.75;
const ANCHOR_RADIUS: f32 = 0.00110;
const ANCHOR_PEAK: f32 = 1.0;

const FIELD_CELLS: f32 = 93.0;
const FIELD_FILL: f32 = 0.75;
const FIELD_RADIUS: f32 = 0.00070;
const FIELD_PEAK: f32 = 0.45;

const DUST_CELLS: f32 = 151.0;
const DUST_FILL: f32 = 0.75;
const DUST_RADIUS: f32 = 0.00040;
const DUST_PEAK: f32 = 0.22;

const COUNT_SLOPE: f32 = 2.0;

const STAR_FLUX_AREA: f32 = 0.5385;

const MAX_PREFILTER_PIXELS: f32 = 4.0;

const STAR_WARM: vec3f = vec3f(1.1741, 0.9745, 0.7397);
const STAR_COOL: vec3f = vec3f(0.8954, 1.0131, 1.1781);
struct  StarLook {
  brightness: f32,
  density: f32,
  contrast: f32,
  warmth: f32,
  twinkle: f32,
}

fn faceCoords(direction: vec3f) -> vec3f {
  let magnitude = abs(direction);
  if (magnitude.x >= magnitude.y && magnitude.x >= magnitude.z) {
    return vec3f(direction.yz / magnitude.x, select(1.0, 0.0, direction.x > 0.0));
  }
  if (magnitude.y >= magnitude.z) {
    return vec3f(direction.xz / magnitude.y, select(3.0, 2.0, direction.y > 0.0));
  }
  return vec3f(direction.xy / magnitude.z, select(5.0, 4.0, direction.z > 0.0));
}

fn faceProject(direction: vec3f, axis: i32) -> vec2f {
  if (axis == 0) {
    return direction.yz / abs(direction.x);
  }
  if (axis == 1) {
    return direction.xz / abs(direction.y);
  }
  return direction.xy / abs(direction.z);
}

struct SkyFilter {
  inverseJacobian: mat2x2f,
  pixelsPerFace: f32,
  faceMajor: f32,
}

fn skyFilter(direction: vec3f, axis: i32, ddx: vec3f, ddy: vec3f) -> SkyFilter {
  let base = faceProject(direction, axis);
  let jx = faceProject(direction + ddx, axis) - base;
  let jy = faceProject(direction + ddy, axis) - base;

  let determinant = jx.x * jy.y - jx.y * jy.x;
  let safeDeterminant = select(determinant, 1.0e-24, abs(determinant) < 1.0e-24);
  let inverse = mat2x2f(vec2f(jy.y, -jx.y), vec2f(-jy.x, jx.x)) * (1.0 / safeDeterminant);

  var prefilter: SkyFilter;
  prefilter.inverseJacobian = inverse;
  prefilter.pixelsPerFace = 1.0 / sqrt(max(abs(determinant), 1.0e-24));
  prefilter.faceMajor = max(length(jx), length(jy));
  return prefilter;
}

struct SkyState {
  brightness: f32,
  rangePower: f32,
  meanFlux: f32,
  warmth: f32,
  twinkle: f32,
  time: f32,
  fillScale: f32,
  radiusScale: f32,
}

fn resolveSky(look: StarLook, face: vec2f, time: f32) -> SkyState {
  let range = clamp(look.contrast, 1.0, 512.0);
  let rangePower = range * range;

  let compression = 1.0 + dot(face, face);
  let root = sqrt(compression);

  var sky: SkyState;
  sky.brightness = max(0.0, look.brightness) * STAR_INTENSITY;
  sky.rangePower = rangePower;
  sky.meanFlux = COUNT_SLOPE / (range + COUNT_SLOPE - 1.0);
  sky.warmth = clamp(look.warmth, 0.0, 1.0);
  sky.twinkle = clamp(look.twinkle, 0.0, 1.0);
  sky.time = time;
  sky.fillScale = max(0.0, look.density) / (compression * root);
  sky.radiusScale = sqrt(compression * root);
  return sky;
}

struct Species {
  cells: f32,
  fill: f32,
  peak: f32,
  faceRadius: f32,
  radiusPixels: f32,
  gain: f32,
}

fn resolveSpecies(
  cells: f32,
  fill: f32,
  peak: f32,
  angularRadius: f32,
  sky: SkyState,
  prefilter: SkyFilter,
) -> Species {
  let faceRadius = angularRadius * sky.radiusScale;
  let starPixels = faceRadius * prefilter.pixelsPerFace;

  var species: Species;
  species.cells = cells;
  species.fill = clamp(fill * sky.fillScale, 0.0, 1.0);
  species.peak = peak * sky.brightness;
  species.faceRadius = faceRadius;
  species.radiusPixels = clamp(starPixels, 1.0, MAX_PREFILTER_PIXELS);
  species.gain = min(1.0, starPixels * starPixels);
  return species;
}

fn starPoint(
  cell: vec2f,
  grid: vec2f,
  faceIndex: i32,
  seed: i32,
  species: Species,
  sky: SkyState,
  prefilter: SkyFilter,
) -> vec3f {
  let hashed = pcg3d(bitcast<vec3u>(vec3i(vec2i(cell), faceIndex * 131 + seed)));
  let presence = unitFloat(hashed.x);
  if (presence > species.fill) {
    return vec3f(0.0);
  }

  let jitter = vec2f(unitFloat(hashed.y), unitFloat(hashed.z)) - vec2f(0.5);
  let center = cell + vec2f(0.5) + jitter * 0.8;
  let offsetPixels = prefilter.inverseJacobian * ((grid - center) / species.cells);
  let falloff = 1.0 - smoothstep(0.0, species.radiusPixels, length(offsetPixels));

  let uniform01 = presence / max(species.fill, 1.0e-6);
  let flux = inverseSqrt(1.0 + uniform01 * (sky.rangePower - 1.0));

  let tint = mix(vec3f(1.0), mix(STAR_WARM, STAR_COOL, unitFloat(hashed.y ^ hashed.z)), sky.warmth);

  let phase = unitFloat(hashed.y) * 6.2831853;
  let shimmer = 1.0 + sky.twinkle * 0.06 * sin(sky.time * (0.35 + unitFloat(hashed.z) * 0.4) + phase);
  return tint * (falloff * falloff * species.peak * flux * shimmer * species.gain);
}

fn starSpecies(
  face: vec3f,
  seed: i32,
  species: Species,
  sky: SkyState,
  prefilter: SkyFilter,
) -> vec3f {
  let faceIndex = i32(face.z);
  let grid = face.xy * species.cells;
  let total = starPoint(floor(grid), grid, faceIndex, seed, species, sky, prefilter);

  let extent = species.faceRadius * species.cells;
  let mean = species.peak * sky.meanFlux * species.fill * STAR_FLUX_AREA * extent * extent;
  let meanTint = mix(vec3f(1.0), 0.5 * (STAR_WARM + STAR_COOL), sky.warmth);
  let cellsPerPixel = species.cells * prefilter.faceMajor;
  return mix(total, meanTint * mean, smoothstep(1.0, 3.0, cellsPerPixel));
}
fn  shadeStars(direction: vec3f, look: StarLook, time: f32, ddx: vec3f, ddy: vec3f) -> vec3f {
  let d = normalize(direction);
  let face = faceCoords(d);
  let prefilter = skyFilter(d, i32(face.z) / 2, ddx, ddy);
  let sky = resolveSky(look, face.xy, time);

  return starSpecies(
    face, 17,
    resolveSpecies(ANCHOR_CELLS, ANCHOR_FILL, ANCHOR_PEAK, ANCHOR_RADIUS, sky, prefilter),
    sky, prefilter,
  ) + starSpecies(
    face, 71,
    resolveSpecies(FIELD_CELLS, FIELD_FILL, FIELD_PEAK, FIELD_RADIUS, sky, prefilter),
    sky, prefilter,
  ) + starSpecies(
    face, 149,
    resolveSpecies(DUST_CELLS, DUST_FILL, DUST_PEAK, DUST_RADIUS, sky, prefilter),
    sky, prefilter,
  );
}

// Per-frame shading: decode the bake, shade stars and disk layers, then composite them.



struct Shade {
  resolution: vec2f,
  time: f32,
  diskOuter: f32,
  sceneYaw: f32,
  centerFade: f32,
}

const DISK_GAIN: f32 = 1.35;

fn centeredCopyFade(uvY: f32) -> f32 {
  let distanceFromCenter = abs(uvY - 0.5);
  return pow(smoothstep(0.08, 0.38, distanceFromCenter), 2.2);
}

@group(0) @binding(0) var<uniform> shade: Shade;
@group(0) @binding(1) var gHit1: texture_2d<f32>;
@group(0) @binding(2) var gHit2: texture_2d<f32>;
@group(0) @binding(3) var gSky: texture_2d<f32>;
@group(0) @binding(4) var gView: texture_2d<f32>;
@group(0) @binding(5) var<uniform> disk: DiskLook;
@group(0) @binding(6) var<uniform> stars: StarLook;

@group(0) @binding(7) var noiseVolume: texture_3d<f32>;
@group(0) @binding(8) var noiseSampler: sampler;

@group(0) @binding(9) var gAa: texture_2d<f32>;

@group(0) @binding(10) var gAaGeom: texture_2d<f32>;

fn diskFootprintAxes(g: GBufferSample) -> vec2f {
  let angular = max(disk.stretch, 0.05);
  let noiseAngle = g.diskPolar.y
    - min(shade.time, SHEAR_PERIOD * 0.5) * (disk.speed * 0.55 / pow(g.diskPolar.x, 1.5));
  let noiseCoords = vec3f(
    cos(noiseAngle) * angular,
    sin(noiseAngle) * angular,
    g.diskPolar.x * disk.detail,
  );
  return vec2f(
    max(fwidth(noiseCoords.x), fwidth(noiseCoords.y)),
    fwidth(noiseCoords.z),
  );
}

fn diskFootprint(axes: vec2f) -> f32 {
  return min(max(axes.x, axes.y), 4.0);
}

fn rotateY(v: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(c * v.x + s * v.z, v.y, -s * v.x + c * v.z);
}

fn wrapAngle(angle: f32) -> f32 {
  return angle - TAU * floor((angle + PI_CONST) / TAU);
}

fn rotateSample(g: GBufferSample, angle: f32) -> GBufferSample {
  var rotated = g;
  rotated.position = rotateY(g.position, angle);
  rotated.viewDirection = rotateY(g.viewDirection, angle);
  rotated.rayDirection = rotateY(g.rayDirection, angle);
  let azimuth = wrapAngle(g.diskPolar.y - angle);
  rotated.diskPolar = vec2f(g.diskPolar.x, azimuth);
  rotated.diskUv = vec2f(g.diskUv.x, (azimuth + PI_CONST) / TAU);
  return rotated;
}

fn rotateLayers(layers: GBufferLayers, angle: f32) -> GBufferLayers {
  var rotated: GBufferLayers;
  rotated.front = rotateSample(layers.front, angle);
  rotated.back = rotateSample(layers.back, angle);
  return rotated;
}

const AA_TAPS: i32 = 6;

const AA_SPAN_MIN: f32 = 0.15;

fn shadeFront(g: GBufferSample, footprint: f32, angularFootprint: f32) -> DiskSample {
  let annulus = max(shade.diskOuter - ISCO, 0.001);
  let spanWorld = g.span * annulus;
  if (g.span <= AA_SPAN_MIN) {
    return shadeDisk(g, disk, shade.time, footprint, noiseVolume, noiseSampler);
  }

  let tapFootprint = min(max(angularFootprint, max(disk.detail, 0.05) * (spanWorld / f32(AA_TAPS))), 4.0);
  let step = spanWorld / f32(AA_TAPS);
  let start = g.diskPolar.x - spanWorld * 0.5;

  var sumEmission = vec3f(0.0);
  var sumAlpha = 0.0;
  var taps = 0.0;
  for (var i = 0; i < AA_TAPS; i++) {
    let radius = start + (f32(i) + 0.5) * step;
    if (radius < ISCO || radius > shade.diskOuter) {
      continue;
    }
    let tap = shadeDisk(
      sampleAtRadius(g, radius, shade.diskOuter), disk, shade.time,
      tapFootprint, noiseVolume, noiseSampler,
    );
    sumEmission += tap.color * tap.alpha;
    sumAlpha += tap.alpha;
    taps += 1.0;
  }
  if (taps < 0.5) {
    return shadeDisk(g, disk, shade.time, footprint, noiseVolume, noiseSampler);
  }

  var sample: DiskSample;
  let meanAlpha = sumAlpha / taps;
  sample.alpha = meanAlpha;
  sample.color = select(vec3f(0.0), (sumEmission / taps) / max(meanAlpha, 1e-6), meanAlpha > 1e-6);
  return sample;
}

fn emptyDiskSample() -> DiskSample {
  var sample: DiskSample;
  sample.color = vec3f(0.0);
  sample.alpha = 0.0;
  return sample;
}

fn compositeDisk(under: vec3f, sample: DiskSample) -> vec3f {
  return sample.color * sample.alpha * DISK_GAIN + under * (1.0 - sample.alpha);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let dimensions = vec2f(textureDimensions(gHit1, 0));
  let texel = vec2i(clamp(uv * dimensions, vec2f(0.0), dimensions - vec2f(1.0)));

  let aa = textureLoad(gAa, texel, 0).xy;
  let aaGeom = textureLoad(gAaGeom, texel, 0);

  let baked = decodeGBuffer(
    textureLoad(gHit1, texel, 0).xy,
    textureLoad(gHit2, texel, 0).xy,
    textureLoad(gSky, texel, 0),
    textureLoad(gView, texel, 0),
    shade.diskOuter,
    aa,
    aaGeom,
  );

  let frontAxes = diskFootprintAxes(baked.front);
  let backAxes = diskFootprintAxes(baked.back);
  let frontFootprint = diskFootprint(frontAxes);
  let backFootprint = diskFootprint(backAxes);

  let bakedRayDirection = baked.front.rayDirection;
  let skyDdx = dpdx(bakedRayDirection);
  let skyDdy = dpdy(bakedRayDirection);

  let layers = rotateLayers(baked, -shade.sceneYaw);
  let g = layers.front;
  let skyDdxRotated = rotateY(skyDdx, -shade.sceneYaw);
  let skyDdyRotated = rotateY(skyDdy, -shade.sceneYaw);

  var background = vec3f(0.0);
  if (!g.isBlackHole && g.escaped) {
    background = shadeStars(g.rayDirection, stars, shade.time, skyDdxRotated, skyDdyRotated);
  }

  var backSample = emptyDiskSample();
  var frontSample = emptyDiskSample();
  if (layers.back.isHit) {
    backSample = shadeDisk(layers.back, disk, shade.time, backFootprint, noiseVolume, noiseSampler);
  }
  if (layers.front.isHit) {
    frontSample = shadeFront(layers.front, frontFootprint, frontAxes.x);
    frontSample.alpha *= layers.front.coverage;
  }

  var color = background;
  color = compositeDisk(color, backSample);
  color = compositeDisk(color, frontSample);

  let centerMask = mix(
    1.0,
    centeredCopyFade(uv.y),
    clamp(shade.centerFade, 0.0, 1.0),
  );
  let heroFade = centerMask;

  color *= heroFade;

  return vec4f(color, 1.0);
}
`;

/** `bloom.wgsl` from the example (downsample + separable Gaussian). */
export const BLACK_HOLE_BLOOM_SHADER = /* wgsl */ `
// HDR bloom downsample and separable Gaussian blur.

struct Bloom {
  sourceSize: vec2f,
  direction: vec2f,
  params: vec4f,
}

@group(0) @binding(0) var<uniform> bloom: Bloom;
@group(0) @binding(1) var source: texture_2d<f32>;
@group(0) @binding(2) var linearSampler: sampler;

fn softThreshold(color: vec3f) -> vec3f {
  let threshold = bloom.params.x;
  if (threshold <= 0.0) {
    return color;
  }

  let brightness = dot(color, vec3f(0.2126, 0.7152, 0.0722));
  let knee = max(min(bloom.params.y, threshold), 0.000001);
  let soft = clamp(brightness - threshold + knee, 0.0, 2.0 * knee);
  let softContribution = soft * soft / (4.0 * knee + 0.0001);
  let contribution = max(brightness - threshold, softContribution) / max(brightness, 0.0001);
  return color * contribution;
}

fn downsample(uv: vec2f) -> vec3f {
  let texel = 1.0 / bloom.sourceSize;
  let offset = texel * 0.5;
  let color = (
    textureSample(source, linearSampler, uv + vec2f(-offset.x, -offset.y)).rgb +
    textureSample(source, linearSampler, uv + vec2f( offset.x, -offset.y)).rgb +
    textureSample(source, linearSampler, uv + vec2f(-offset.x,  offset.y)).rgb +
    textureSample(source, linearSampler, uv + vec2f( offset.x,  offset.y)).rgb
  ) * 0.25;
  return softThreshold(color);
}

fn gaussianBlur(uv: vec2f) -> vec3f {
  let sigma = max(bloom.params.z, 0.5);
  let inverseTwoSigmaSquared = 0.5 / (sigma * sigma);
  let w0 = 1.0;
  let w1 = exp(-1.0 * inverseTwoSigmaSquared);
  let w2 = exp(-4.0 * inverseTwoSigmaSquared);
  let w3 = exp(-9.0 * inverseTwoSigmaSquared);
  let w4 = exp(-16.0 * inverseTwoSigmaSquared);

  let pair12 = w1 + w2;
  let pair34 = w3 + w4;
  let offset12 = (w1 + 2.0 * w2) / max(pair12, 0.000001);
  let offset34 = (3.0 * w3 + 4.0 * w4) / max(pair34, 0.000001);
  let normalization = w0 + 2.0 * (pair12 + pair34);
  let texel = bloom.direction / bloom.sourceSize;

  var color = textureSample(source, linearSampler, uv).rgb * w0;
  color += textureSample(source, linearSampler, uv + texel * offset12).rgb * pair12;
  color += textureSample(source, linearSampler, uv - texel * offset12).rgb * pair12;
  color += textureSample(source, linearSampler, uv + texel * offset34).rgb * pair34;
  color += textureSample(source, linearSampler, uv - texel * offset34).rgb * pair34;
  return color / normalization;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  var color: vec3f;
  if (bloom.params.w > 0.5) {
    color = gaussianBlur(uv);
  } else {
    color = downsample(uv);
  }
  return vec4f(color, 1.0);
}
`;

/** `composite.wgsl` from the example (bloom combine + ACES + vignette). */
export const BLACK_HOLE_COMPOSITE_SHADER = /* wgsl */ `
// Combine bloom levels, tone map, vignette, and convert to display output.

struct Composite {
  params: vec4f,
}

@group(0) @binding(0) var<uniform> composite: Composite;
@group(0) @binding(1) var scene: texture_2d<f32>;
@group(0) @binding(2) var bloomNear: texture_2d<f32>;
@group(0) @binding(3) var bloomMedium: texture_2d<f32>;
@group(0) @binding(4) var bloomFar: texture_2d<f32>;
@group(0) @binding(5) var linearSampler: sampler;

const EXPOSURE: f32 = 1.15;
const SATURATION: f32 = 0.0;

fn aces(x: vec3f) -> vec3f {
  let a = 2.51;
  let b = 0.03;
  let c = 2.43;
  let d = 0.59;
  let e = 0.14;
  return clamp((x * (a * x + vec3f(b))) / (x * (c * x + vec3f(d)) + vec3f(e)), vec3f(0.0), vec3f(1.0));
}

fn tonemap(linearColor: vec3f, uv: vec2f) -> vec3f {
  var color = aces(linearColor * EXPOSURE);

  let centered = uv - vec2f(0.5);
  let vignette = 1.0 - smoothstep(0.55, 1.15, length(centered) * 1.6);
  color *= mix(0.72, 1.0, vignette);

  color = pow(color, vec3f(1.0 / 2.2));
  let luma = dot(color, vec3f(0.2126, 0.7152, 0.0722));
  return mix(vec3f(luma), color, SATURATION);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let sceneColor = textureSample(scene, linearSampler, uv).rgb;
  let bloom =
    textureSample(bloomNear, linearSampler, uv).rgb * 0.50 +
    textureSample(bloomMedium, linearSampler, uv).rgb * 0.32 +
    textureSample(bloomFar, linearSampler, uv).rgb * 0.18;
  let hdr = sceneColor + bloom * composite.params.x;
  return vec4f(tonemap(hdr, uv), 1.0);
}
`;

/* ------------------------------------------------------------------ */
/* Settings — port of the example's settings.ts                        */
/* ------------------------------------------------------------------ */

export interface BlackHoleDiskLook {
  brightness: number;
  speed: number;
  stretch: number;
  detail: number;
  turbulence: number;
  density: number;
  doppler: number;
  cloudScale: number;
  cloudSpeed: number;
  cloudStrength: number;
  spare0: number;
  spare1: number;
  spare2: number;
  spare3: number;
}

export interface BlackHoleStarLook {
  brightness: number;
  density: number;
  contrast: number;
  warmth: number;
  twinkle: number;
}

export interface BlackHoleBloomLook {
  strength: number;
  threshold: number;
  knee: number;
  radius: number;
}

export interface BlackHoleSettings {
  cameraY: number;
  distance: number;
  diskRadius: number;
  fov: number;
  centerX: number;
  centerY: number;
  cameraRoll: number;
  mouseYaw: number;
  centerFade: number;
  bloom: BlackHoleBloomLook;
  disk: BlackHoleDiskLook;
  stars: BlackHoleStarLook;
}

/** The example's production defaults (defaultHeroSettings). */
export function defaultBlackHoleSettings(): BlackHoleSettings {
  return {
    cameraY: 0.16,
    distance: 13.5,
    diskRadius: 9,
    fov: 3,
    centerX: 0.8,
    centerY: 0.3,
    cameraRoll: -0.27,
    mouseYaw: 0.15,
    centerFade: 0,
    bloom: { strength: 1, threshold: 0, knee: 0.18, radius: 1.5 },
    disk: {
      brightness: 0.75,
      speed: 0.75,
      stretch: 5.75,
      detail: 3.44,
      turbulence: 4.46,
      density: 1.38,
      doppler: 1.21,
      cloudScale: 20,
      cloudSpeed: 0.3,
      cloudStrength: 0.2,
      spare0: 0.43,
      spare1: -0.25,
      spare2: -0.67,
      spare3: 0.69,
    },
    stars: { brightness: 1, density: 1, contrast: 13, warmth: 0.5, twinkle: 0 },
  };
}

/* ------------------------------------------------------------------ */
/* Noise volume — port of the example's noise-volume.mjs               */
/* ------------------------------------------------------------------ */

const NOISE_VOLUME_SIZE = 64;
const NOISE_SEED = 13;

const fract32 = (value: number) => Math.fround(value - Math.floor(value));
const K0 = Math.fround(0.1031);
const K1 = Math.fround(0.103);
const K2 = Math.fround(0.0973);
const K3 = Math.fround(33.33);

/** Deterministic tiled value-noise lattice (Math.fround keeps it f32-exact). */
function hash31(x: number, y: number, z: number): number {
  let qx = fract32(Math.fround(x * K0));
  let qy = fract32(Math.fround(y * K1));
  let qz = fract32(Math.fround(z * K2));
  const d = fract32(
    fract32(Math.fround(qx * Math.fround(qy + K3))) +
      fract32(Math.fround(qy * Math.fround(qz + K3))) +
      fract32(Math.fround(qz * Math.fround(qx + K3))),
  );
  qx = fract32(qx + d);
  qy = fract32(qy + d);
  qz = fract32(qz + d);
  return fract32(Math.fround(Math.fround(qx + qy) * qz));
}

function latticeCoord(index: number, size: number): number {
  return index < size / 2 ? index : index - size;
}

function buildNoiseVolume(size: number, seed: number): Uint8Array {
  const data = new Uint8Array(size * size * size);
  const offset = seed * 1024;
  let cursor = 0;
  for (let z = 0; z < size; z++) {
    const pz = latticeCoord(z, size) + offset;
    for (let y = 0; y < size; y++) {
      const py = latticeCoord(y, size);
      for (let x = 0; x < size; x++) {
        data[cursor++] = Math.min(255, Math.round(hash31(latticeCoord(x, size), py, pz) * 255));
      }
    }
  }
  return data;
}

function createNoiseVolume(gpu: Gpu, size = NOISE_VOLUME_SIZE): Texture {
  const texture = gpu.device.createTexture({
    size: [size, size, size],
    dimension: "3d",
    format: "r8unorm",
    usage: ["texture_binding", "copy_dst"],
    label: "black-hole-noise",
  });
  try {
    gpu.gpu.queue.writeTexture(
      { texture: texture.gpu },
      // Cast: @webgpu/types wants ArrayBuffer-backed sources; a fresh
      // Uint8Array always owns a plain ArrayBuffer.
      buildNoiseVolume(size, NOISE_SEED) as BufferSource,
      { offset: 0, bytesPerRow: size, rowsPerImage: size },
      { width: size, height: size, depthOrArrayLayers: size },
    );
    return texture;
  } catch (error) {
    try {
      texture.destroy();
    } catch {
      /* the upload failure is the primary error */
    }
    throw error;
  }
}

/* ------------------------------------------------------------------ */
/* Pipeline — port of the example's pipeline.ts                        */
/* ------------------------------------------------------------------ */

type VgpuApi = typeof import("vgpu");

// Derived from vgpu's own surface so this file compiles under hosts that do
// not load @webgpu/types globals (e.g. the docs app's tsconfig "types": []).
type GpuSampler = ReturnType<VgpuApi["sampler"]>;
type TextureFormat = Target["format"];

interface Effects {
  bake: Effect;
  refine: Effect;
  shade: Effect;
  bloomExtract: Effect;
  bloomBlurH0: Effect;
  bloomBlurV0: Effect;
  bloomDown1: Effect;
  bloomBlurH1: Effect;
  bloomBlurV1: Effect;
  bloomDown2: Effect;
  bloomBlurH2: Effect;
  bloomBlurV2: Effect;
  composite: Effect;
  postSampler: GpuSampler;
  noiseVolume: Texture;
  noiseSampler: GpuSampler;
}

interface Targets {
  gbuffer: Target;
  aa: Target;
  scene: Target;
  bloom0: Target;
  bloomPing0: Target;
  bloom1: Target;
  bloomPing1: Target;
  bloom2: Target;
  bloomPing2: Target;
}

type Output = Surface | Target;

const GBUFFER_FORMATS: readonly TextureFormat[] = ["rg32float", "rg32float", "rgba16float", "rgba16float"];
const AA_FORMATS: readonly TextureFormat[] = ["rg8unorm", "rgba16float"];
const CLEAR: readonly [number, number, number, number] = [0, 0, 0, 1];

function createEffects(vgpu: VgpuApi, gpu: Gpu): Effects {
  const postSampler = vgpu.sampler(gpu, { minFilter: "linear", magFilter: "linear" });
  const noiseSampler = vgpu.sampler(gpu, {
    addressModeU: "repeat",
    addressModeV: "repeat",
    addressModeW: "repeat",
    minFilter: "linear",
    magFilter: "linear",
  });
  return {
    bake: vgpu.effect(gpu, BLACK_HOLE_BAKE_SHADER, { label: "black-hole-bake" }),
    refine: vgpu.effect(gpu, BLACK_HOLE_REFINE_SHADER, { label: "black-hole-refine" }),
    shade: vgpu.effect(gpu, BLACK_HOLE_SHADE_SHADER, { label: "black-hole-shade" }),
    bloomExtract: vgpu.effect(gpu, BLACK_HOLE_BLOOM_SHADER, { label: "black-hole-bloom-extract" }),
    bloomBlurH0: vgpu.effect(gpu, BLACK_HOLE_BLOOM_SHADER, { label: "black-hole-bloom-h0" }),
    bloomBlurV0: vgpu.effect(gpu, BLACK_HOLE_BLOOM_SHADER, { label: "black-hole-bloom-v0" }),
    bloomDown1: vgpu.effect(gpu, BLACK_HOLE_BLOOM_SHADER, { label: "black-hole-bloom-down1" }),
    bloomBlurH1: vgpu.effect(gpu, BLACK_HOLE_BLOOM_SHADER, { label: "black-hole-bloom-h1" }),
    bloomBlurV1: vgpu.effect(gpu, BLACK_HOLE_BLOOM_SHADER, { label: "black-hole-bloom-v1" }),
    bloomDown2: vgpu.effect(gpu, BLACK_HOLE_BLOOM_SHADER, { label: "black-hole-bloom-down2" }),
    bloomBlurH2: vgpu.effect(gpu, BLACK_HOLE_BLOOM_SHADER, { label: "black-hole-bloom-h2" }),
    bloomBlurV2: vgpu.effect(gpu, BLACK_HOLE_BLOOM_SHADER, { label: "black-hole-bloom-v2" }),
    composite: vgpu.effect(gpu, BLACK_HOLE_COMPOSITE_SHADER, { label: "black-hole-composite" }),
    postSampler,
    noiseSampler,
    noiseVolume: createNoiseVolume(gpu),
  };
}

function normalizeSize(size: readonly [number, number]): [number, number] {
  return [Math.max(1, Math.floor(size[0])), Math.max(1, Math.floor(size[1]))];
}

function scaleSize(size: readonly [number, number], divisor: number): [number, number] {
  return [Math.max(1, Math.floor(size[0] / divisor)), Math.max(1, Math.floor(size[1] / divisor))];
}

function createTargets(vgpu: VgpuApi, gpu: Gpu, size: readonly [number, number]): Targets {
  const full = normalizeSize(size);
  const half = scaleSize(full, 2);
  const quarter = scaleSize(full, 4);
  const eighth = scaleSize(full, 8);
  const postTarget = (targetSize: readonly [number, number]) =>
    vgpu.target(gpu, { size: targetSize, colors: [{ format: "rgba16float" }] });
  const created: Target[] = [];
  const own = (value: Target) => {
    created.push(value);
    return value;
  };
  try {
    return {
      gbuffer: own(vgpu.target(gpu, { size: full, colors: GBUFFER_FORMATS.map((format) => ({ format })) })),
      aa: own(vgpu.target(gpu, { size: full, colors: AA_FORMATS.map((format) => ({ format })) })),
      scene: own(postTarget(full)),
      bloom0: own(postTarget(half)),
      bloomPing0: own(postTarget(half)),
      bloom1: own(postTarget(quarter)),
      bloomPing1: own(postTarget(quarter)),
      bloom2: own(postTarget(eighth)),
      bloomPing2: own(postTarget(eighth)),
    };
  } catch (error) {
    try {
      created.reverse().forEach((t) => destroyTarget(t));
    } catch {
      /* the allocation failure remains the primary error */
    }
    throw error;
  }
}

// The example's pipeline.ts calls this defensively: offscreen targets own a
// destroy() at runtime, but the public Target type does not declare it.
function destroyTarget(value: Target): void {
  (value as { destroy?: () => void }).destroy?.();
}

function destroyTargets(targets: Targets): void {
  [
    targets.gbuffer,
    targets.aa,
    targets.scene,
    targets.bloom0,
    targets.bloomPing0,
    targets.bloom1,
    targets.bloomPing1,
    targets.bloom2,
    targets.bloomPing2,
  ].forEach((t) => destroyTarget(t));
}

function setBindings(effects: Effects, targets: Targets): void {
  const [hit1, hit2, sky, view] = targets.gbuffer.colors;
  const [aa, aaGeom] = targets.aa.colors;
  effects.bake.set({ bake: { resolution: targets.gbuffer.size } });
  effects.refine.set({
    gHit1: hit1,
    gSky: sky,
    refine: { resolution: targets.gbuffer.size },
  });
  effects.shade.set({
    gHit1: hit1,
    gHit2: hit2,
    gSky: sky,
    gView: view,
    gAa: aa,
    gAaGeom: aaGeom,
    noiseVolume: effects.noiseVolume,
    noiseSampler: effects.noiseSampler,
    shade: { resolution: targets.gbuffer.size },
  });
  const scene = targets.scene.colors[0];
  const bloom0 = targets.bloom0.colors[0];
  const bloomPing0 = targets.bloomPing0.colors[0];
  const bloom1 = targets.bloom1.colors[0];
  const bloomPing1 = targets.bloomPing1.colors[0];
  const bloom2 = targets.bloom2.colors[0];
  const bloomPing2 = targets.bloomPing2.colors[0];
  effects.bloomExtract.set({ source: scene, linearSampler: effects.postSampler });
  effects.bloomBlurH0.set({ source: bloom0, linearSampler: effects.postSampler });
  effects.bloomBlurV0.set({ source: bloomPing0, linearSampler: effects.postSampler });
  effects.bloomDown1.set({ source: bloom0, linearSampler: effects.postSampler });
  effects.bloomBlurH1.set({ source: bloom1, linearSampler: effects.postSampler });
  effects.bloomBlurV1.set({ source: bloomPing1, linearSampler: effects.postSampler });
  effects.bloomDown2.set({ source: bloom1, linearSampler: effects.postSampler });
  effects.bloomBlurH2.set({ source: bloom2, linearSampler: effects.postSampler });
  effects.bloomBlurV2.set({ source: bloomPing2, linearSampler: effects.postSampler });
  effects.composite.set({
    scene,
    bloomNear: bloom0,
    bloomMedium: bloom1,
    bloomFar: bloom2,
    linearSampler: effects.postSampler,
  });
}

function setBakeUniforms(effects: Effects, targets: Targets, settings: BlackHoleSettings): void {
  const geometry = {
    resolution: targets.gbuffer.size,
    yaw: 0,
    pitch: settings.cameraY,
    orbitRadius: settings.distance,
    diskOuter: settings.diskRadius,
    fov: settings.fov,
    centerX: settings.centerX,
    centerY: settings.centerY,
    roll: settings.cameraRoll,
  };
  effects.bake.set({ bake: geometry });
  effects.refine.set({ refine: geometry });
}

function setShadeUniforms(
  effects: Effects,
  targets: Targets,
  settings: BlackHoleSettings,
  time: number,
  sceneYaw: number,
): void {
  effects.shade.set({
    shade: {
      resolution: targets.gbuffer.size,
      time,
      diskOuter: settings.diskRadius,
      sceneYaw,
      centerFade: settings.centerFade,
    },
    disk: settings.disk,
    stars: settings.stars,
  });
}

function setPostUniforms(effects: Effects, targets: Targets, settings: BlackHoleSettings): void {
  const threshold = Math.max(0, settings.bloom.threshold);
  const knee = Math.max(0.0001, settings.bloom.knee);
  const radius = Math.max(0.1, settings.bloom.radius);
  const downsample = (sourceSize: readonly [number, number], applyThreshold: boolean) => ({
    sourceSize,
    direction: [0, 0],
    params: [applyThreshold ? threshold : -1, knee, radius, 0],
  });
  const blur = (sourceSize: readonly [number, number], x: number, y: number) => ({
    sourceSize,
    direction: [x, y],
    params: [-1, knee, radius, 1],
  });
  effects.bloomExtract.set({ bloom: downsample(targets.scene.size, true) });
  effects.bloomBlurH0.set({ bloom: blur(targets.bloom0.size, 1, 0) });
  effects.bloomBlurV0.set({ bloom: blur(targets.bloomPing0.size, 0, 1) });
  effects.bloomDown1.set({ bloom: downsample(targets.bloom0.size, false) });
  effects.bloomBlurH1.set({ bloom: blur(targets.bloom1.size, 1, 0) });
  effects.bloomBlurV1.set({ bloom: blur(targets.bloomPing1.size, 0, 1) });
  effects.bloomDown2.set({ bloom: downsample(targets.bloom1.size, false) });
  effects.bloomBlurH2.set({ bloom: blur(targets.bloom2.size, 1, 0) });
  effects.bloomBlurV2.set({ bloom: blur(targets.bloomPing2.size, 0, 1) });
  effects.composite.set({ composite: { params: [Math.max(0, settings.bloom.strength), 0, 0, 0] } });
}

async function prewarm(effects: Effects, targets: Targets, output: Output): Promise<void> {
  const bloomOutput = { colors: [targets.bloom0.format] };
  await Promise.all([
    effects.bake.compile(targets.gbuffer),
    effects.refine.compile(targets.aa),
    effects.shade.compile(targets.scene),
    effects.bloomExtract.compile(bloomOutput),
    effects.bloomBlurH0.compile(bloomOutput),
    effects.bloomBlurV0.compile(bloomOutput),
    effects.bloomDown1.compile(bloomOutput),
    effects.bloomBlurH1.compile(bloomOutput),
    effects.bloomBlurV1.compile(bloomOutput),
    effects.bloomDown2.compile(bloomOutput),
    effects.bloomBlurH2.compile(bloomOutput),
    effects.bloomBlurV2.compile(bloomOutput),
    effects.composite.compile({ colors: [output.format] }),
  ]);
}

function renderChain(
  frame: Frame,
  effects: Effects,
  targets: Targets,
  output: Output,
  bake: boolean,
): void {
  if (bake) {
    frame.pass({ target: targets.gbuffer, clear: CLEAR }, (pass) => pass.draw(effects.bake));
    frame.pass({ target: targets.aa, clear: CLEAR }, (pass) => pass.draw(effects.refine));
  }
  frame.pass({ target: targets.scene, clear: CLEAR }, (pass) => pass.draw(effects.shade));
  frame.pass({ target: targets.bloom0, clear: CLEAR }, (pass) => pass.draw(effects.bloomExtract));
  frame.pass({ target: targets.bloomPing0, clear: CLEAR }, (pass) => pass.draw(effects.bloomBlurH0));
  frame.pass({ target: targets.bloom0, clear: CLEAR }, (pass) => pass.draw(effects.bloomBlurV0));
  frame.pass({ target: targets.bloom1, clear: CLEAR }, (pass) => pass.draw(effects.bloomDown1));
  frame.pass({ target: targets.bloomPing1, clear: CLEAR }, (pass) => pass.draw(effects.bloomBlurH1));
  frame.pass({ target: targets.bloom1, clear: CLEAR }, (pass) => pass.draw(effects.bloomBlurV1));
  frame.pass({ target: targets.bloom2, clear: CLEAR }, (pass) => pass.draw(effects.bloomDown2));
  frame.pass({ target: targets.bloomPing2, clear: CLEAR }, (pass) => pass.draw(effects.bloomBlurH2));
  frame.pass({ target: targets.bloom2, clear: CLEAR }, (pass) => pass.draw(effects.bloomBlurV2));
  frame.pass({ target: output, clear: CLEAR }, (pass) => pass.draw(effects.composite));
}

/**
 * Headless single-frame render used by scripts/black-hole-snapshot.mjs (the
 * quality gate cannot drive a multi-pass pipeline through a single effect).
 */
export async function renderBlackHoleThumbnail(
  gpu: Gpu,
  output: Target,
  opts: { time?: number; settings?: Partial<BlackHoleSettings> } = {},
): Promise<void> {
  const settings = { ...defaultBlackHoleSettings(), ...opts.settings };
  const vgpu = (await import("vgpu")) as unknown as VgpuApi;
  const effects = createEffects(vgpu, gpu);
  let targets: Targets | undefined;
  try {
    targets = createTargets(vgpu, gpu, output.size);
    setBindings(effects, targets);
    setBakeUniforms(effects, targets, settings);
    setPostUniforms(effects, targets, settings);
    await prewarm(effects, targets, output);
    setShadeUniforms(effects, targets, settings, opts.time ?? 2.5, 0);
    vgpu.frame(gpu, (currentFrame) => renderChain(currentFrame, effects, targets as Targets, output, true));
    await gpu.gpu.queue.onSubmittedWorkDone();
    await gpu.settled();
  } finally {
    if (targets) destroyTargets(targets);
    effects.noiseVolume.destroy();
  }
}

/* ------------------------------------------------------------------ */
/* Component — port of the example's renderer.ts lifecycle             */
/* ------------------------------------------------------------------ */

export interface BlackHoleProps {
  /** Disk evolution speed (disk.speed). */
  speed?: number;
  /** Disk emission gain (disk.brightness); also scales the star field. */
  brightness?: number;
  /** Camera orbit radius in horizon units (horizon radius = 1). */
  distance?: number;
  /** Outer disk radius in horizon units. */
  diskRadius?: number;
  /** Field of view (projection scale; larger is wider). */
  fov?: number;
  /** Camera elevation above the disk plane, radians. */
  tilt?: number;
  /** Horizontal framing of the hole, NDC -1..1 (the example defaults to 0.8). */
  centerX?: number;
  /** Vertical framing of the hole, NDC -1..1 (the example defaults to 0.3). */
  centerY?: number;
  /** Camera roll, radians. */
  roll?: number;
  /** Smoke turbulence amplitude. */
  turbulence?: number;
  /** Absorption density (optical depth). */
  density?: number;
  /** Doppler beaming exponent. */
  doppler?: number;
  /** Star tint spread: 0 neutral, 1 full warm/cool. */
  stars?: number;
  /** Fade the scene band behind centered copy (mobile heroes), 0..1. */
  centerFade?: number;
  /** HDR bloom strength. */
  bloom?: number;
  /** When true, the pointer leans the scene yaw (the example's mouseYaw). */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Rendered when WebGPU is unavailable or the pipeline fails to build. */
  fallback?: ReactNode;
}

export const BLACK_HOLE_DEFAULTS = {
  speed: 0.75,
  brightness: 0.75,
  distance: 13.5,
  diskRadius: 9,
  fov: 3,
  tilt: 0.16,
  centerX: 0,
  centerY: 0,
  roll: -0.27,
  turbulence: 4.46,
  density: 1.38,
  doppler: 1.21,
  stars: 0.5,
  centerFade: 0,
  bloom: 1,
} as const;

export const BLACK_HOLE_PRESETS = {
  interstellar: { centerX: 0.8, centerY: 0.3, speed: 0.75, brightness: 0.75, doppler: 1.21 },
  centered: { centerX: 0, centerY: 0 },
  gargantua: { distance: 11.5, diskRadius: 11, tilt: 0.05, brightness: 0.85, density: 1.55, doppler: 1.45 },
  topDown: { distance: 15, diskRadius: 8.5, tilt: 0.9, turbulence: 3.2, density: 1.1, doppler: 0.9 },
  ember: { speed: 0.85, brightness: 1.05, density: 1.7, doppler: 1.8, stars: 0.3 },
} as const;

const SCENE_YAW_TAU_S = 0.325;
const MAX_FRAME_DT_S = 0.1;
const TARGET_FPS = 60;
const FRAME_PACING_EPSILON_MS = 2;
const MIN_FRAME_INTERVAL_MS = 1000 / TARGET_FPS - FRAME_PACING_EPSILON_MS;

function clockMs(): number {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}

export function BlackHole({
  speed = BLACK_HOLE_DEFAULTS.speed,
  brightness = BLACK_HOLE_DEFAULTS.brightness,
  distance = BLACK_HOLE_DEFAULTS.distance,
  diskRadius = BLACK_HOLE_DEFAULTS.diskRadius,
  fov = BLACK_HOLE_DEFAULTS.fov,
  tilt = BLACK_HOLE_DEFAULTS.tilt,
  centerX = BLACK_HOLE_DEFAULTS.centerX,
  centerY = BLACK_HOLE_DEFAULTS.centerY,
  roll = BLACK_HOLE_DEFAULTS.roll,
  turbulence = BLACK_HOLE_DEFAULTS.turbulence,
  density = BLACK_HOLE_DEFAULTS.density,
  doppler = BLACK_HOLE_DEFAULTS.doppler,
  stars = BLACK_HOLE_DEFAULTS.stars,
  centerFade = BLACK_HOLE_DEFAULTS.centerFade,
  bloom = BLACK_HOLE_DEFAULTS.bloom,
  interactive = false,
  className,
  style,
  fallback,
}: BlackHoleProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  // Latest props for the mount-only loop; re-running the effect would tear
  // down the whole bake pipeline on every parent render.
  const optsRef = useRef({
    speed, brightness, distance, diskRadius, fov, tilt, centerX, centerY, roll,
    turbulence, density, doppler, stars, centerFade, bloom, interactive,
  });
  optsRef.current = {
    speed, brightness, distance, diskRadius, fov, tilt, centerX, centerY, roll,
    turbulence, density, doppler, stars, centerFade, bloom, interactive,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;

    let disposed = false;
    let vgpuApi: VgpuApi | undefined;
    let gpu: Gpu | undefined;
    let surface: Surface | undefined;
    let effects: Effects | undefined;
    let targets: Targets | undefined;
    let loop: { stop(): void } | undefined;
    let observer: ResizeObserver | undefined;
    let intersection: IntersectionObserver | undefined;
    let documentVisible = typeof document === "undefined" ? true : !document.hidden;
    let canvasIntersecting = true;
    let started = false;
    let animationTime = 0;
    let lastFrameAt: number | undefined;
    let lastYawAt: number | undefined;
    let resizeFrame = 0;
    let pendingSize: { width: number; height: number } | undefined;
    let forceBake = true;
    let bakedGeometryKey = "";
    let pointerXNormalized = 0;
    let currentSceneYaw = 0;

    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The example scales bloom with the display density so the glow reads
    // the same on 1x and 2x panels.
    const bloomScale = Math.min(Math.max(window.devicePixelRatio || 1, 1), 2) / 2;

    const buildSettings = (): BlackHoleSettings => {
      const o = optsRef.current;
      const base = defaultBlackHoleSettings();
      return {
        ...base,
        cameraY: o.tilt,
        distance: o.distance,
        diskRadius: o.diskRadius,
        fov: o.fov,
        centerX: o.centerX,
        centerY: o.centerY,
        cameraRoll: o.roll,
        mouseYaw: o.interactive ? 0.15 : 0,
        centerFade: o.centerFade,
        bloom: { ...base.bloom, strength: base.bloom.strength * bloomScale * o.bloom, radius: base.bloom.radius * bloomScale },
        disk: {
          ...base.disk,
          speed: o.speed,
          brightness: o.brightness,
          turbulence: o.turbulence,
          density: o.density,
          doppler: o.doppler,
        },
        stars: { ...base.stars, warmth: o.stars },
      };
    };

    const geometryKey = (s: BlackHoleSettings) =>
      `${s.distance}|${s.diskRadius}|${s.fov}|${s.cameraY}|${s.centerX}|${s.centerY}|${s.cameraRoll}`;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !optsRef.current.interactive) return;
      const rect = wrap.getBoundingClientRect();
      if (rect.width === 0) return;
      pointerXNormalized = Math.min(1, Math.max(-1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
    };
    const onPointerOut = () => {
      pointerXNormalized = 0;
    };
    const onVisibilityChange = () => {
      if (document.hidden) pointerXNormalized = 0;
      documentVisible = !document.hidden;
      reconcileLoop();
    };

    const advanceAnimationTime = (now: number): number => {
      animationTime += lastFrameAt === undefined ? 0 : Math.max(0, (now - lastFrameAt) / 1000);
      lastFrameAt = now;
      return animationTime;
    };

    const advanceSceneYaw = (now: number, mouseYaw: number): number => {
      if (mouseYaw <= 0) {
        currentSceneYaw = 0;
        lastYawAt = now;
        return 0;
      }
      const dt =
        lastYawAt === undefined ? 0 : Math.min(Math.max((now - lastYawAt) / 1000, 0), MAX_FRAME_DT_S);
      lastYawAt = now;
      const target = pointerXNormalized * Math.max(0, mouseYaw);
      currentSceneYaw += (target - currentSceneYaw) * (1 - Math.exp(-dt / SCENE_YAW_TAU_S));
      return currentSceneYaw;
    };

    const renderFrame = (frame: Frame): void => {
      if (disposed || !effects || !targets || !surface) return;
      const now = clockMs();
      const settings = buildSettings();
      const key = geometryKey(settings);
      const runBake = forceBake || key !== bakedGeometryKey;
      forceBake = false;
      bakedGeometryKey = key;
      if (runBake) setBakeUniforms(effects, targets, settings);
      setShadeUniforms(
        effects,
        targets,
        settings,
        advanceAnimationTime(now),
        advanceSceneYaw(now, settings.mouseYaw),
      );
      renderChain(frame, effects, targets, surface, runBake);
    };

    function startPacedLoop(vgpu: VgpuApi, activeGpu: Gpu): { stop(): void } {
      let stopped = false;
      let lastPresentedAt: number | undefined;
      let frameHandle = 0;
      const tick = (timestamp: number): void => {
        if (stopped) return;
        if (lastPresentedAt === undefined || timestamp - lastPresentedAt >= MIN_FRAME_INTERVAL_MS) {
          lastPresentedAt = timestamp;
          try {
            vgpu.frame(activeGpu, renderFrame);
          } catch (error) {
            handleFailure(error);
          }
        }
        if (!stopped) frameHandle = requestAnimationFrame(tick);
      };
      frameHandle = requestAnimationFrame(tick);
      return {
        stop(): void {
          stopped = true;
          cancelAnimationFrame(frameHandle);
        },
      };
    }

    const reconcileLoop = (): void => {
      if (!started || !gpu || !vgpuApi) return;
      const shouldRun = !disposed && !reduced && documentVisible && canvasIntersecting;
      if (shouldRun === Boolean(loop)) return;
      if (shouldRun) {
        lastFrameAt = undefined;
        lastYawAt = undefined;
        loop = startPacedLoop(vgpuApi, gpu);
      } else {
        loop?.stop();
        loop = undefined;
      }
    };

    const applyResize = () => {
      resizeFrame = 0;
      const size = pendingSize;
      pendingSize = undefined;
      if (disposed || !size || !gpu || !vgpuApi || !effects || !targets || !surface) return;
      try {
        const previousTargets = targets;
        const nextTargets = createTargets(vgpuApi, gpu, [
          Math.max(1, Math.round(size.width)),
          Math.max(1, Math.round(size.height)),
        ]);
        try {
          setBindings(effects, nextTargets);
          setPostUniforms(effects, nextTargets, buildSettings());
        } catch (error) {
          destroyTargets(nextTargets);
          throw error;
        }
        targets = nextTargets;
        destroyTargets(previousTargets);
        forceBake = true;
      } catch (error) {
        handleFailure(error);
      }
    };

    const resize = (size: { width: number; height: number }) => {
      if (disposed || size.width <= 0 || size.height <= 0) return;
      pendingSize = size;
      if (!resizeFrame) resizeFrame = requestAnimationFrame(applyResize);
    };

    const measure = () => {
      resize({ width: canvas.clientWidth, height: canvas.clientHeight });
    };

    function handleFailure(error: unknown): never {
      dispose();
      throw error;
    }

    const dispose = () => {
      if (disposed) return;
      disposed = true;
      loop?.stop();
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      observer?.disconnect();
      intersection?.disconnect();
      if (typeof window !== "undefined") {
        wrap.removeEventListener("pointermove", onPointerMove);
        wrap.removeEventListener("pointerleave", onPointerOut);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      }
      try {
        if (targets) destroyTargets(targets);
        effects?.noiseVolume.destroy();
      } catch {
        /* gpu.dispose() below tears the device down regardless */
      }
      gpu?.dispose();
    };

    const initialize = async () => {
      const vgpu = (await import("vgpu")) as unknown as VgpuApi;
      if (disposed) return;
      const nextGpu = await vgpu.init();
      if (disposed) {
        nextGpu.dispose();
        return;
      }
      gpu = nextGpu;
      vgpuApi = vgpu;
      surface = vgpu.surface(gpu, canvas, { dpr: 1 });
      effects = createEffects(vgpu, gpu);
      targets = createTargets(vgpu, gpu, surface.size);
      setBindings(effects, targets);
      setPostUniforms(effects, targets, buildSettings());
      await prewarm(effects, targets, surface);
      if (disposed) return;
      observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
      observer?.observe(canvas);
      wrap.addEventListener("pointermove", onPointerMove, { passive: true });
      wrap.addEventListener("pointerleave", onPointerOut);
      document.addEventListener("visibilitychange", onVisibilityChange);
      if (typeof IntersectionObserver !== "undefined") {
        intersection = new IntersectionObserver(
          (entries) => {
            canvasIntersecting = entries[entries.length - 1]?.isIntersecting ?? canvasIntersecting;
            reconcileLoop();
          },
          { threshold: 0 },
        );
        intersection.observe(canvas);
      }
      measure();
      started = true;
      documentVisible = !document.hidden;
      if (reduced) {
        // Static contract: one fully-baked frame, no loop.
        vgpu.frame(gpu, renderFrame);
      } else {
        reconcileLoop();
      }
      setReady(true);
    };

    initialize().catch((error: unknown) => {
      if (disposed) return;
      console.error("[vfx-ui] black-hole pipeline failed:", error);
      try {
        window.localStorage.setItem(
          "vfx-ui:last-init-error",
          `black-hole: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`,
        );
      } catch {
        /* storage unavailable — the console line above is the record */
      }
      setFailed(true);
    });

    return dispose;
  }, []);

  if (failed) {
    return <>{fallback ?? null}</>;
  }

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#020103", ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          touchAction: "none",
          opacity: ready ? 1 : 0,
          transition: "opacity 500ms",
        }}
      />
    </div>
  );
}
