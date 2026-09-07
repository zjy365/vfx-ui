// @ts-nocheck
/* Vercel VGPU prism light pipeline.
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
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target3, all) => {
  for (var name in all)
    __defProp(target3, name, { get: all[name], enumerable: true });
};

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/types.ts
function clampBeamWidth(width) {
  if (!Number.isFinite(width)) return PRISM_DEFAULT_BEAM_WIDTH;
  return Math.min(
    PRISM_BEAM_WIDTH_RANGE.max,
    Math.max(PRISM_BEAM_WIDTH_RANGE.min, width)
  );
}
function clampCameraFov(fov) {
  if (!Number.isFinite(fov)) return CAMERA_FOV_DEGREES;
  return Math.min(
    PRISM_CAMERA_RANGES.fov.max,
    Math.max(PRISM_CAMERA_RANGES.fov.min, fov)
  );
}
function rotate(point, angle) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return [
    point[0] * cosine - point[1] * sine,
    point[0] * sine + point[1] * cosine
  ];
}
function prismEntryPoint(position) {
  const clamped = Math.min(1, Math.max(0, position));
  return [
    PRISM_TRIANGLE.a[0] + (PRISM_TRIANGLE.c[0] - PRISM_TRIANGLE.a[0]) * clamped,
    PRISM_TRIANGLE.a[1] + (PRISM_TRIANGLE.c[1] - PRISM_TRIANGLE.a[1]) * clamped
  ];
}
function collimatedLightBetween(center, target3, beamWidth = PRISM_DEFAULT_BEAM_WIDTH) {
  const offset = [target3[0] - center[0], target3[1] - center[1]];
  const distance = Math.hypot(offset[0], offset[1]);
  if (!Number.isFinite(distance) || distance <= 1e-8) {
    throw new Error(
      "A collimated light needs distinct finite center and target points."
    );
  }
  return {
    center,
    direction: [offset[0] / distance, offset[1] / distance],
    beamHalfWidth: clampBeamWidth(beamWidth) * 0.5
  };
}
function lampForIncidence(incidenceDegrees, beamWidth = PRISM_DEFAULT_BEAM_WIDTH, entryPosition = 0.5) {
  const face = [
    PRISM_TRIANGLE.a[0] - PRISM_TRIANGLE.c[0],
    PRISM_TRIANGLE.a[1] - PRISM_TRIANGLE.c[1]
  ];
  const faceLength = Math.hypot(face[0], face[1]);
  const inward = [-face[1] / faceLength, face[0] / faceLength];
  const direction = rotate(inward, radians(-incidenceDegrees));
  const clampedBeamWidth = clampBeamWidth(beamWidth);
  const entryMargin = Math.min(
    0.45,
    clampedBeamWidth / (2 * faceLength * Math.max(0.05, Math.abs(Math.cos(radians(incidenceDegrees))))) + 1e-4
  );
  const entryPoint = prismEntryPoint(
    Math.min(1 - entryMargin, Math.max(entryMargin, entryPosition))
  );
  return collimatedLightBetween(
    [
      entryPoint[0] - direction[0] * PRISM_LAMP_DISTANCE,
      entryPoint[1] - direction[1] * PRISM_LAMP_DISTANCE
    ],
    entryPoint,
    clampedBeamWidth
  );
}
var PRISM_DISPERSION_PRESETS, PRISM_DEFAULT_BEAM_WIDTH, PRISM_BEAM_WIDTH_RANGE, DEFAULT_BEAM_MOUSE_Y_CONTROLS, PRISM_BEAM_MOUSE_Y_RANGES, DEFAULT_LIGHT_FADE_CONTROLS, PRISM_LIGHT_FADE_RANGES, PRISM_LIGHT_MODE_RANGES, PRISM_LIGHT_TONE_MAPPING_ORDER, PRISM_LIGHT_TONE_MAPPING_CODES, DEFAULT_LIGHT_MODE_CONTROLS, CAMERA_FOV_DEGREES, CAMERA_DISTANCE, PRISM_CAMERA_RANGES, PRISM_SPECTRAL_DISPERSION_RANGES, DEFAULT_GLASS_TRANSMISSION, DEFAULT_GLASS_CONTROLS, DEFAULT_POSTPROCESS_CONTROLS, DEFAULT_PRISM_CONTROLS: any, radians, PRISM_SIDE, PRISM_TILT_DEGREES, PRISM_CENTROID, PRISM_TRIANGLE, PRISM_ENTRY_FACE_MIDPOINT, PRISM_LAMP_DISTANCE, PRISM_INCIDENCE_DEGREES, PRISM_INCIDENCE_ARC, PRISM_MOUSE_Y_MIDPOINT_INCIDENCE_DEGREES, PRISM_LIGHT, PRISM_DEFAULT_ARC, PRISM_WAVELENGTHS, PRISM_SPECTRAL_SAMPLES, PRISM_BEAM_SLICES, PRISM_LIGHT_EXPOSURE, PRISM_MAX_INTERNAL_BOUNCES, PRISM_DEPTH, PRISM_WALL_GAP, PRISM_BACK_Z, PRISM_FRONT_Z, PRISM_LIGHT_PLANE_Z, PRISM_GLASS, CAMERA_YAW_DEGREES, CAMERA_PITCH_DEGREES, CAMERA_ORBIT_DEGREES;
var init_types = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/types.ts"() {
    "use strict";
    PRISM_DISPERSION_PRESETS = {
      stylized: { base: 1.245, strength: 0.06 },
      crown: { base: 1.5046, strength: 42e-4 },
      flint: { base: 1.664, strength: 0.0105 }
    };
    PRISM_DEFAULT_BEAM_WIDTH = 0.025;
    PRISM_BEAM_WIDTH_RANGE = {
      min: 0.01,
      max: 0.2,
      step: 5e-3
    };
    DEFAULT_BEAM_MOUSE_Y_CONTROLS = {
      top: -35,
      bottom: 75
    };
    PRISM_BEAM_MOUSE_Y_RANGES = {
      top: { min: -85, max: 85, step: 1 },
      bottom: { min: -85, max: 85, step: 1 }
    };
    DEFAULT_LIGHT_FADE_CONTROLS = {
      beamOpacity: 1,
      edgeFalloff: 16,
      rainbowFalloffRate: 3.8,
      rainbowFalloffPower: 3.7
    };
    PRISM_LIGHT_FADE_RANGES = {
      beamOpacity: { min: 0, max: 1, step: 0.01 },
      edgeFalloff: { min: 0, max: 16, step: 0.1 },
      rainbowFalloffRate: { min: 0, max: 40, step: 0.1 },
      rainbowFalloffPower: { min: 0.25, max: 8, step: 0.05 }
    };
    PRISM_LIGHT_MODE_RANGES = {
      wall: {
        normalStrength: { min: 0, max: 3, step: 0.05 },
        lightmapGamma: { min: 0.5, max: 4, step: 0.05 },
        shadowContrast: { min: 0.25, max: 8, step: 0.05 },
        shadowPivot: { min: 0.05, max: 0.95, step: 0.01 },
        shadowFloor: { min: 0, max: 1.2, step: 0.01 },
        highlightExposure: { min: 0.25, max: 8, step: 0.01 },
        ambientFill: { min: 0, max: 2.5, step: 0.01 }
      },
      caustic: {
        strength: { min: 0, max: 4, step: 0.01 },
        coverage: { min: 0, max: 1, step: 0.01 },
        normalInfluence: { min: 0, max: 1, step: 0.01 },
        normalElevation: { min: 5, max: 85, step: 1 }
      },
      output: {
        exposure: { min: 0.25, max: 2, step: 0.01 }
      }
    };
    PRISM_LIGHT_TONE_MAPPING_ORDER = [
      "aces",
      "neutral",
      "reinhard",
      "clamp"
    ];
    PRISM_LIGHT_TONE_MAPPING_CODES = {
      aces: 0,
      neutral: 1,
      reinhard: 2,
      clamp: 3
    };
    DEFAULT_LIGHT_MODE_CONTROLS = {
      wall: {
        normalStrength: 0.6,
        lightmapGamma: 0.65,
        shadowContrast: 6.85,
        shadowPivot: 0.9,
        shadowFloor: 0.87,
        highlightExposure: 3.31,
        ambientFill: 0.42
      },
      caustic: {
        strength: 1.9,
        coverage: 0.86,
        normalInfluence: 1,
        normalElevation: 35
      },
      output: {
        exposure: 1,
        toneMapping: "aces"
      }
    };
    CAMERA_FOV_DEGREES = 48;
    CAMERA_DISTANCE = 1.25;
    PRISM_CAMERA_RANGES = {
      fov: { min: 20, max: 70, step: 1 }
    };
    PRISM_SPECTRAL_DISPERSION_RANGES = {
      base: { min: 1.2, max: 2.1, step: 1e-3 },
      strength: { min: 0, max: 0.2, step: 5e-4 }
    };
    DEFAULT_GLASS_TRANSMISSION = {
      dark: {
        ior: 1.645,
        absorption: [1, 1, 0.54]
      },
      light: {
        ior: 1.645,
        absorption: [0, 0, 0]
      }
    };
    DEFAULT_GLASS_CONTROLS = {
      transmission: DEFAULT_GLASS_TRANSMISSION,
      reflection: {
        dark: { reflectionStrength: 2.14, environmentExposure: 2.3 },
        light: { reflectionStrength: 3, environmentExposure: 4 }
      }
    };
    DEFAULT_POSTPROCESS_CONTROLS = {
      bloomStrength: 0.7,
      bloomThreshold: 0.1,
      bloomRadius: 0.25
    };
    DEFAULT_PRISM_CONTROLS = {
      dispersion: "stylized",
      spectralDispersion: { base: 1.2, strength: 0.1 },
      view: "glass",
      cameraFov: CAMERA_FOV_DEGREES,
      beamWidth: PRISM_DEFAULT_BEAM_WIDTH,
      beamMouseY: DEFAULT_BEAM_MOUSE_Y_CONTROLS,
      lightFade: DEFAULT_LIGHT_FADE_CONTROLS,
      lightMode: DEFAULT_LIGHT_MODE_CONTROLS,
      wallColor: "#000000",
      wireframe: false,
      lightWireframe: false,
      environmentDebug: false,
      glass: DEFAULT_GLASS_CONTROLS,
      postprocess: DEFAULT_POSTPROCESS_CONTROLS
    };
    radians = (degrees) => degrees * Math.PI / 180;
    PRISM_SIDE = 0.57;
    PRISM_TILT_DEGREES = 0;
    PRISM_CENTROID = [0, 0];
    PRISM_TRIANGLE = (() => {
      const circumradius = PRISM_SIDE / Math.sqrt(3);
      const vertex = (degrees) => {
        const spun = rotate(
          [circumradius, 0],
          radians(degrees + PRISM_TILT_DEGREES)
        );
        return [PRISM_CENTROID[0] + spun[0], PRISM_CENTROID[1] + spun[1]];
      };
      return { a: vertex(90), b: vertex(210), c: vertex(330) };
    })();
    PRISM_ENTRY_FACE_MIDPOINT = [
      (PRISM_TRIANGLE.a[0] + PRISM_TRIANGLE.c[0]) / 2,
      (PRISM_TRIANGLE.a[1] + PRISM_TRIANGLE.c[1]) / 2
    ];
    PRISM_LAMP_DISTANCE = 6.5;
    PRISM_INCIDENCE_DEGREES = 60;
    PRISM_INCIDENCE_ARC = {
      min: DEFAULT_BEAM_MOUSE_Y_CONTROLS.top,
      max: DEFAULT_BEAM_MOUSE_Y_CONTROLS.bottom
    };
    PRISM_MOUSE_Y_MIDPOINT_INCIDENCE_DEGREES = PRISM_INCIDENCE_DEGREES;
    PRISM_LIGHT = lampForIncidence(
      PRISM_INCIDENCE_DEGREES
    );
    PRISM_DEFAULT_ARC = 0.5;
    PRISM_WAVELENGTHS = { min: 400, max: 700 };
    PRISM_SPECTRAL_SAMPLES = 64 * 2;
    PRISM_BEAM_SLICES = 24;
    PRISM_LIGHT_EXPOSURE = 88;
    PRISM_MAX_INTERNAL_BOUNCES = 3;
    PRISM_DEPTH = 0.3;
    PRISM_WALL_GAP = 0.015;
    PRISM_BACK_Z = PRISM_WALL_GAP;
    PRISM_FRONT_Z = PRISM_WALL_GAP + PRISM_DEPTH;
    PRISM_LIGHT_PLANE_Z = (PRISM_BACK_Z + PRISM_FRONT_Z) * 0.5;
    PRISM_GLASS = {
      ...DEFAULT_GLASS_CONTROLS,
      environmentRotation: [0, 0, 0]
    };
    CAMERA_YAW_DEGREES = 0;
    CAMERA_PITCH_DEGREES = 0;
    CAMERA_ORBIT_DEGREES = 3.5;
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/camera.ts
import { perspectiveCamera } from "vgpu/scene";
function cameraView(aspect, orbitX = 0, orbitY = 0, distance = CAMERA_DISTANCE, fov = CAMERA_FOV_DEGREES) {
  const limit = CAMERA_ORBIT_DEGREES;
  const yaw = radians2(CAMERA_YAW_DEGREES + clamp(orbitX, -1, 1) * limit);
  const pitch = radians2(CAMERA_PITCH_DEGREES - clamp(orbitY, -1, 1) * limit);
  const cosPitch = Math.cos(pitch);
  const position = [
    Math.sin(yaw) * cosPitch * distance,
    Math.sin(pitch) * distance,
    Math.cos(yaw) * cosPitch * distance
  ];
  const forward = normalize([-position[0], -position[1], -position[2]]);
  const right = normalize(cross(forward, [0, 1, 0]));
  const camera = perspectiveCamera({
    fov,
    aspect,
    // The whole scene sits between the wall at z = 0 and the glass in front of
    // it, so the depth range only has to bracket a couple of units.
    near: 0.05,
    far: 4 * distance,
    position,
    target: [0, 0, 0]
  });
  return {
    camera,
    viewProjection: camera.viewProjection,
    position,
    forward,
    right,
    up: cross(right, forward)
  };
}
function wallHalfHeight(aspect, distance = CAMERA_DISTANCE, fov = CAMERA_FOV_DEGREES) {
  if (aspect === memoizedAspect && distance === memoizedDistance && fov === memoizedFov)
    return memoizedHalfHeight;
  let worst = 0;
  for (const orbitX of [-1, 0, 1]) {
    for (const orbitY of [-1, 0, 1]) {
      worst = Math.max(
        worst,
        wallCoverage(aspect, orbitX, orbitY, distance, fov)
      );
    }
  }
  memoizedAspect = aspect;
  memoizedDistance = distance;
  memoizedFov = fov;
  memoizedHalfHeight = worst * WALL_SAFETY;
  return memoizedHalfHeight;
}
function wallCoverage(aspect, orbitX = 0, orbitY = 0, distance = CAMERA_DISTANCE, fov = CAMERA_FOV_DEGREES) {
  const view = cameraView(aspect, orbitX, orbitY, distance, fov);
  const tanHalfFov = Math.tan(radians2(fov) / 2);
  let worst = 0;
  for (const horizontal of [-1, 1]) {
    for (const vertical of [-1, 1]) {
      const direction = [0, 1, 2].map(
        (axis) => view.forward[axis] + view.right[axis] * horizontal * tanHalfFov * aspect + view.up[axis] * vertical * tanHalfFov
      );
      if (direction[2] >= 0) return Infinity;
      const t = -view.position[2] / direction[2];
      const x = view.position[0] + direction[0] * t;
      const y = view.position[1] + direction[1] * t;
      worst = Math.max(worst, Math.abs(x) / aspect, Math.abs(y));
    }
  }
  return worst;
}
function rotationMatrix(degrees) {
  const [x, y, z] = degrees.map(radians2);
  const [sx, cx] = [Math.sin(x), Math.cos(x)];
  const [sy, cy] = [Math.sin(y), Math.cos(y)];
  const [sz, cz] = [Math.sin(z), Math.cos(z)];
  return new Float32Array([
    cy * cz,
    cy * sz,
    -sy,
    0,
    sx * sy * cz - cx * sz,
    sx * sy * sz + cx * cz,
    sx * cy,
    0,
    cx * sy * cz + sx * sz,
    cx * sy * sz - sx * cz,
    cx * cy,
    0,
    0,
    0,
    0,
    1
  ]);
}
function radians2(degrees) {
  return degrees * Math.PI / 180;
}
function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value));
}
function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}
function normalize(value) {
  const length2 = Math.hypot(value[0], value[1], value[2]) || 1;
  return [value[0] / length2, value[1] / length2, value[2] / length2];
}
var WALL_SAFETY, memoizedAspect, memoizedDistance, memoizedFov, memoizedHalfHeight;
var init_camera = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/camera.ts"() {
    "use strict";
    init_types();
    WALL_SAFETY = 1.02;
    memoizedAspect = 0;
    memoizedDistance = 0;
    memoizedFov = 0;
    memoizedHalfHeight = 0;
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-bake.wgsl
var environment_bake_default;
var init_environment_bake = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-bake.wgsl"() {
    "use strict";
    environment_bake_default = { version: 1, wgsl: "// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-bake.wgsl\n// Bakes either authored analytic environment into the same equirectangular HDR\n// texture layout used by the environment-map and transmission examples.\n\n     \n     \n     \n\nstruct _vgsl_851c5445__BakeParams {\n  debug: f32,\n}\n\n@group(0) @binding(0) var<uniform> params: _vgsl_851c5445__BakeParams;\n\n@fragment\nfn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {\n  let direction = _vgsl_64a9b351__direction_from_equirect(uv);\n  if (params.debug > 0.5) {\n    return vec4f(_vgsl_c24c5609__sampleDebugEnvironment(direction), 1.0);\n  }\n  return vec4f(_vgsl_4d994031__sampleStudioEnvironment(direction), 1.0);\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-debug-map.wgsl\n// Directional environment used to audit reflection and refraction paths.\n//\n// The six dominant-axis faces deliberately have unrelated colors, matching the\n// topology of a cubemap without requiring a texture. Three great-circle ribbons\n// cross those face boundaries. Their colors come only from the global direction,\n// so the center of every ribbon is continuous even where the face color changes.\n\nconst _vgsl_c24c5609__DEBUG_POSITIVE_X = vec3f(1.0, 0.16, 0.11);\nconst _vgsl_c24c5609__DEBUG_NEGATIVE_X = vec3f(0.05, 0.92, 0.92);\nconst _vgsl_c24c5609__DEBUG_POSITIVE_Y = vec3f(0.18, 1.0, 0.26);\nconst _vgsl_c24c5609__DEBUG_NEGATIVE_Y = vec3f(1.0, 0.12, 0.72);\nconst _vgsl_c24c5609__DEBUG_POSITIVE_Z = vec3f(0.14, 0.32, 1.0);\nconst _vgsl_c24c5609__DEBUG_NEGATIVE_Z = vec3f(1.0, 0.72, 0.06);\n\nstruct _vgsl_c24c5609__DebugFace {\n  color: vec3f,\n  /** WebGPU cubemap face coordinates: (0, 0) is the authored top-left. */\n  uv: vec2f,\n}\n\nfn _vgsl_c24c5609__debugFace(direction: vec3f) -> _vgsl_c24c5609__DebugFace {\n  let absolute = abs(direction);\n  if (absolute.x >= absolute.y && absolute.x >= absolute.z) {\n    let positive = direction.x >= 0.0;\n    let facePosition = select(\n      vec2f(direction.z, -direction.y),\n      vec2f(-direction.z, -direction.y),\n      positive,\n    );\n    return _vgsl_c24c5609__DebugFace(\n      select(_vgsl_c24c5609__DEBUG_NEGATIVE_X, _vgsl_c24c5609__DEBUG_POSITIVE_X, positive),\n      facePosition / absolute.x * 0.5 + 0.5,\n    );\n  }\n  if (absolute.y >= absolute.z) {\n    let positive = direction.y >= 0.0;\n    let facePosition = select(\n      vec2f(direction.x, -direction.z),\n      vec2f(direction.x, direction.z),\n      positive,\n    );\n    return _vgsl_c24c5609__DebugFace(\n      select(_vgsl_c24c5609__DEBUG_NEGATIVE_Y, _vgsl_c24c5609__DEBUG_POSITIVE_Y, positive),\n      facePosition / absolute.y * 0.5 + 0.5,\n    );\n  }\n  let positive = direction.z >= 0.0;\n  let facePosition = select(\n    vec2f(-direction.x, -direction.y),\n    vec2f(direction.x, -direction.y),\n    positive,\n  );\n  return _vgsl_c24c5609__DebugFace(\n    select(_vgsl_c24c5609__DEBUG_NEGATIVE_Z, _vgsl_c24c5609__DEBUG_POSITIVE_Z, positive),\n    facePosition / absolute.z * 0.5 + 0.5,\n  );\n}\n\nfn _vgsl_c24c5609__debugRibbonMask(distanceFromPlane: f32) -> f32 {\n  return 1.0 - smoothstep(0.018, 0.035, abs(distanceFromPlane));\n}\n\nfn _vgsl_c24c5609__debugArrowMask(uv: vec2f) -> f32 {\n  let point = vec2f(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0);\n  let shaft = (1.0 - smoothstep(0.05, 0.075, abs(point.x)))\n    * smoothstep(-0.62, -0.54, point.y)\n    * (1.0 - smoothstep(0.18, 0.25, point.y));\n  let headWidth = max(0.0, (0.68 - point.y) * 0.72);\n  let head = (1.0 - smoothstep(headWidth, headWidth + 0.025, abs(point.x)))\n    * smoothstep(0.12, 0.18, point.y)\n    * (1.0 - smoothstep(0.62, 0.68, point.y));\n  return max(shaft, head);\n}\n\n/** Diagnostic radiance arriving from `direction`, in linear RGB. */\nfn _vgsl_c24c5609__sampleDebugEnvironment(directionInput: vec3f) -> vec3f {\n  let direction = normalize(directionInput);\n  let face = _vgsl_c24c5609__debugFace(direction);\n\n  // This world-space ramp is independent of face-local UV. Negating direction.y\n  // therefore reverses the lighting of all four side faces at once.\n  let worldHeight = direction.y * 0.5 + 0.5;\n  var color = face.color * (0.42 + worldHeight * 0.44) + vec3f(0.025);\n\n  // Dark seams make the analytically selected cubemap face unambiguous.\n  let edgeDistance = min(\n    min(face.uv.x, 1.0 - face.uv.x),\n    min(face.uv.y, 1.0 - face.uv.y),\n  );\n  let faceEdge = 1.0 - smoothstep(0.012, 0.026, edgeDistance);\n  color = mix(color, vec3f(0.012), faceEdge * 0.78);\n\n  // Each ribbon follows a great circle through both ends of its named axis.\n  // Its gradient is derived from that world-space coordinate, not face-local UV,\n  // which makes it a continuous reference across every cubemap seam it crosses.\n  let xRibbon = _vgsl_c24c5609__debugRibbonMask(direction.y);\n  let yRibbon = _vgsl_c24c5609__debugRibbonMask(direction.z);\n  let zRibbon = _vgsl_c24c5609__debugRibbonMask(direction.x);\n  let xGradient = mix(_vgsl_c24c5609__DEBUG_NEGATIVE_X, _vgsl_c24c5609__DEBUG_POSITIVE_X, direction.x * 0.5 + 0.5);\n  let yGradient = mix(_vgsl_c24c5609__DEBUG_NEGATIVE_Y, _vgsl_c24c5609__DEBUG_POSITIVE_Y, direction.y * 0.5 + 0.5);\n  let zGradient = mix(_vgsl_c24c5609__DEBUG_NEGATIVE_Z, _vgsl_c24c5609__DEBUG_POSITIVE_Z, direction.z * 0.5 + 0.5);\n\n  color = mix(color, xGradient * 1.35 + vec3f(0.08), xRibbon * 0.92);\n  color = mix(color, yGradient * 1.35 + vec3f(0.08), yRibbon * 0.92);\n  color = mix(color, zGradient * 1.35 + vec3f(0.08), zRibbon * 0.92);\n\n  // Face-local orientation legend. It is intentionally not symmetric under\n  // either U or V inversion:\n  //   top = white, bottom = black, left = cyan, right = orange.\n  let top = 1.0 - smoothstep(0.035, 0.06, face.uv.y);\n  let bottom = smoothstep(0.94, 0.965, face.uv.y);\n  let left = 1.0 - smoothstep(0.035, 0.06, face.uv.x);\n  let right = smoothstep(0.94, 0.965, face.uv.x);\n  color = mix(color, vec3f(1.8), top * 0.96);\n  color = mix(color, vec3f(0.004), bottom * 0.98);\n  color = mix(color, vec3f(0.0, 1.4, 1.7), left * 0.94);\n  color = mix(color, vec3f(1.8, 0.42, 0.02), right * 0.94);\n\n  // A white upward arrow remains readable away from the face boundaries and\n  // makes a vertical flip obvious even in a small internal reflection.\n  color = mix(color, vec3f(1.8), _vgsl_c24c5609__debugArrowMask(face.uv) * 0.94);\n  return color;\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-map-common.wgsl\nconst _vgsl_64a9b351__PI: f32 = 3.141592653589793;\n\n// Copied from the environment-map and transmission examples. Texture v=0 is\n// the zenith and v=1 the nadir, so the direction-to-texture Y convention stays\n// explicit and shared by every reflection/refraction path.\n\n\nfn _vgsl_64a9b351__direction_from_equirect(uv: vec2f) -> vec3f {\n  let phi = (uv.x - 0.5) * 2.0 * _vgsl_64a9b351__PI;\n  let theta = uv.y * _vgsl_64a9b351__PI;\n  return vec3f(\n    sin(theta) * cos(phi),\n    cos(theta),\n    sin(theta) * sin(phi),\n  );\n}\n\n/** Selects the prefiltered level matching the direction's angular footprint. */\n\n\n/**\n * One texture fetch with the examples' smooth reconstruction. `size` is level\n * zero's extent and `lod` may be fractional for trilinear mip blending.\n */\n\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment.wgsl\n// The deliberately sparse studio the prism reflects.\n//\n// It started as `glass-fractal`'s nine-panel baked cubemap, but this shot only\n// needs three intentional surfaces: a dark back-left wall, a cool right key and\n// a neutral strip below the prism. Defining them here keeps the environment editable\n// in one WGSL file; `environment-bake.wgsl` rasterizes it once into the same 360\xB0 HDR\n// texture layout used by the environment-map and transmission examples.\n//\n// The final line replays the round trip the asset used to perform \u2014 encode to\n// gamma 2.2, decode as sRGB \u2014 so the values a reflection reads here are the values\n// a reflection reads there, including the small mismatch between those two curves.\n//\n// The glass has no material roughness cone, but its pixel footprint can still\n// select a prefiltered mip when a reflection compresses this map on screen.\n\n     \n\nstruct _vgsl_4d994031__StudioPanel {\n  direction: vec3f,\n  /** Half-extents of the panel in tangent space, as a fraction of its distance. */\n  size: vec2f,\n  feather: f32,\n  color: vec3f,\n  intensity: f32,\n}\n\n/** A back-left wall, soft center fill and dominant right key. */\nfn _vgsl_4d994031__studioPanels() -> array<_vgsl_4d994031__StudioPanel, 3> {\n  return array<_vgsl_4d994031__StudioPanel, 3>(\n    // A broad back-left wall, only a touch brighter than the dark floor.\n    _vgsl_4d994031__StudioPanel(\n      vec3f(-0.82, 0.08, 0.57), // direction\n      vec2f(1.35, 1.1), // size\n      0.22, // feather\n      vec3f(0.82, 0.84, 0.88), // color\n      0.011 // intensity\n    ),\n    // A broad, heavily feathered center fill that barely lifts the bottom edge.\n    _vgsl_4d994031__StudioPanel(\n      vec3f(0.0, -0.707, 0.707), // direction\n      vec2f(0.38, 0.62), // size\n      0.18, // feather\n      vec3f(1.0, 0.97, 0.91), // color\n      0.22 // intensity\n    ),\n    // The cool right panel is the dominant key and keeps a more defined edge.\n    _vgsl_4d994031__StudioPanel(\n      vec3f(0.612, 0.354, 0.707), // direction\n      vec2f(0.5, 0.16), // size\n      0.035, // feather\n      vec3f(0.76, 0.88, 1.0), // color\n      20.0 // intensity\n    ),\n  );\n}\n\n/**\n * How much of `panel` a ray heading in `direction` sees: a rectangle projected\n * onto the sphere, feathered at its border so its edge does not alias in a\n * mirror-smooth reflection.\n */\nfn _vgsl_4d994031__studioPanelMask(direction: vec3f, panel: _vgsl_4d994031__StudioPanel) -> f32 {\n  let forward = normalize(panel.direction);\n  // Any helper axis works as long as it is not parallel to the panel's own; the\n  // overhead panels are the ones that need the fallback.\n  let helper = select(vec3f(0.0, 1.0, 0.0), vec3f(0.0, 0.0, 1.0), abs(forward.y) > 0.92);\n  let right = normalize(cross(helper, forward));\n  let up = cross(forward, right);\n  let facing = dot(direction, forward);\n  if (facing <= 0.01) {\n    return 0.0;\n  }\n  let localX = abs(dot(direction, right) / facing);\n  let localY = abs(dot(direction, up) / facing);\n  let edgeX = 1.0 - smoothstep(panel.size.x, panel.size.x + panel.feather, localX);\n  let edgeY = 1.0 - smoothstep(panel.size.y, panel.size.y + panel.feather, localY);\n  return edgeX * edgeY;\n}\n\n/** Rotates a reflection into the studio's frame. Copied from `glass-fractal`. */\n\n\n/** Radiance arriving from `direction`, in linear RGB. */\nfn _vgsl_4d994031__sampleStudioEnvironment(directionInput: vec3f) -> vec3f {\n  let direction = normalize(directionInput);\n  let floorBlend = 1.0 - smoothstep(-0.22, -0.02, direction.y);\n  var room = mix(\n    vec3f(0.00025, 0.0003, 0.0004),\n    vec3f(0.006, 0.007, 0.009),\n    floorBlend,\n  );\n\n  // The projection wall occupies the upper part of the -Z hemisphere. Keep the\n  // floor below it, but drive the wall itself essentially to black so the prism\n  // reflects the same dark surface it physically stands in front of.\n  let negativeZ = 1.0 - smoothstep(-0.08, 0.08, direction.z);\n  let aboveFloor = smoothstep(-0.28, -0.08, direction.y);\n  let backWall = negativeZ * aboveFloor;\n  room = mix(room, vec3f(0.00002), backWall);\n\n  // A restrained seam is just bright enough to preserve the floor/wall read.\n  let horizon = exp(-abs(direction.y + 0.1) * 22.0) * 0.0012;\n  var color = room + vec3f(horizon, horizon * 0.96, horizon * 0.9);\n  let panels = _vgsl_4d994031__studioPanels();\n  for (var index = 0u; index < 3u; index = index + 1u) {\n    let panel = panels[index];\n    color = color + panel.color * (_vgsl_4d994031__studioPanelMask(direction, panel) * panel.intensity);\n  }\n  // Filmic compression, then the asset's gamma-2.2 encode and the sRGB decode a\n  // sample of it performs.\n  let mapped = color / (vec3f(1.0) + color);\n  return _vgsl_9fe494be__srgbToLinear3(pow(max(mapped, vec3f(0.0)), vec3f(1.0 / 2.2)));\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/node_modules/.pnpm/@vgpu+wgsl-std@0.3.1/node_modules/@vgpu/wgsl-std/src/color/index.wgsl\n\n\n\n\nfn _vgsl_9fe494be__srgbToLinear(value: f32) -> f32 {\n  if (value <= 0.04045) {\n    return value / 12.92;\n  }\n  return pow((value + 0.055) / 1.055, 2.4);\n}\n\nfn _vgsl_9fe494be__srgbToLinear3(value: vec3f) -> vec3f {\n  return vec3f(_vgsl_9fe494be__srgbToLinear(value.r), _vgsl_9fe494be__srgbToLinear(value.g), _vgsl_9fe494be__srgbToLinear(value.b));\n}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n" };
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-blur.wgsl
var environment_blur_default;
var init_environment_blur = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-blur.wgsl"() {
    "use strict";
    environment_blur_default = { version: 1, wgsl: "// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-blur.wgsl\n// Copied from the environment-map/transmission environment pyramid. This runs\n// only while baking; runtime glass shading still performs one environment fetch.\n\n     \n\nstruct _vgsl_6c9dc05b__Blur {\n  texel: vec2f,\n  direction: vec2f,\n  radius: f32,\n  equirect_compensation: f32,\n}\n\n@group(0) @binding(0) var<uniform> blur: _vgsl_6c9dc05b__Blur;\n@group(0) @binding(1) var src: texture_2d<f32>;\n@group(0) @binding(2) var src_samp: sampler;\n\n@fragment\nfn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {\n  let sin_theta = max(sin(uv.y * _vgsl_64a9b351__PI), 0.15);\n  let scale = mix(1.0, 1.0 / sin_theta, blur.equirect_compensation);\n  let step = blur.direction * blur.texel * blur.radius * scale;\n\n  var offsets = array<f32, 3>(0.0, 1.3846153846, 3.2307692308);\n  var weights = array<f32, 3>(0.2270270270, 0.3162162162, 0.0702702703);\n  var sum = textureSampleLevel(src, src_samp, uv, 0.0) * weights[0];\n  for (var index = 1; index < 3; index = index + 1) {\n    sum += textureSampleLevel(\n      src,\n      src_samp,\n      uv + step * offsets[index],\n      0.0,\n    ) * weights[index];\n    sum += textureSampleLevel(\n      src,\n      src_samp,\n      uv - step * offsets[index],\n      0.0,\n    ) * weights[index];\n  }\n  return sum;\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-map-common.wgsl\nconst _vgsl_64a9b351__PI: f32 = 3.141592653589793;\n\n// Copied from the environment-map and transmission examples. Texture v=0 is\n// the zenith and v=1 the nadir, so the direction-to-texture Y convention stays\n// explicit and shared by every reflection/refraction path.\n\n\n\n\n/** Selects the prefiltered level matching the direction's angular footprint. */\n\n\n/**\n * One texture fetch with the examples' smooth reconstruction. `size` is level\n * zero's extent and `lod` may be fractional for trilinear mip blending.\n */\n\n" };
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-texture.ts
import { effect, frame, sampler, target } from "vgpu";
function createEnvironmentSampler(gpu) {
  return sampler(gpu, {
    minFilter: "linear",
    magFilter: "linear",
    mipmapFilter: "linear",
    addressModeU: "repeat",
    addressModeV: "clamp-to-edge"
  });
}
function createEnvironmentTexture(gpu, label, debug) {
  const texture = gpu.device.createTexture({
    size: [...ENVIRONMENT_SIZE],
    format: "rgba16float",
    mipLevelCount: ENVIRONMENT_LEVELS,
    usage: ["texture_binding", "copy_dst"],
    label: `${label}.texture`
  });
  const bake = effect(gpu, environment_bake_default, { label: `${label}.bake` });
  const blur = effect(gpu, environment_blur_default, { label: `${label}.blur` });
  bake.set({ params: { debug: debug ? 1 : 0 } });
  return { texture, bake, blur, prepared: false };
}
async function prepareEnvironmentTexture(gpu, environment, samplerState) {
  if (environment.prepared) return;
  let source2 = target(gpu, {
    size: ENVIRONMENT_SIZE,
    format: "rgba16float",
    label: `${environment.texture.label}.level0`
  });
  await Promise.all([
    environment.bake.compile(source2),
    environment.blur.compile(source2)
  ]);
  frame(gpu, (currentFrame) => {
    currentFrame.pass(
      { target: source2, clear: [0, 0, 0, 1] },
      (pass) => pass.draw(environment.bake)
    );
  });
  copyIntoLevel(gpu, source2, environment.texture, 0);
  for (let level = 1; level < ENVIRONMENT_LEVELS; level++) {
    const size = [
      Math.max(1, ENVIRONMENT_SIZE[0] >> level),
      Math.max(1, ENVIRONMENT_SIZE[1] >> level)
    ];
    const horizontal = target(gpu, {
      size,
      format: "rgba16float",
      label: `${environment.texture.label}.blur-h${level}`
    });
    const vertical = target(gpu, {
      size,
      format: "rgba16float",
      label: `${environment.texture.label}.level${level}`
    });
    const texel = [1 / size[0], 1 / size[1]];
    environment.blur.set({
      src: source2,
      src_samp: samplerState,
      blur: {
        texel,
        direction: [1, 0],
        radius: ENVIRONMENT_BLUR_RADIUS,
        equirect_compensation: 1
      }
    });
    frame(gpu, (currentFrame) => {
      currentFrame.pass(
        { target: horizontal },
        (pass) => pass.draw(environment.blur)
      );
    });
    environment.blur.set({
      src: horizontal,
      src_samp: samplerState,
      blur: {
        texel,
        direction: [0, 1],
        radius: ENVIRONMENT_BLUR_RADIUS,
        equirect_compensation: 0
      }
    });
    frame(gpu, (currentFrame) => {
      currentFrame.pass(
        { target: vertical },
        (pass) => pass.draw(environment.blur)
      );
    });
    copyIntoLevel(gpu, vertical, environment.texture, level);
    destroyTarget(horizontal);
    destroyTarget(source2);
    source2 = vertical;
  }
  destroyTarget(source2);
  environment.prepared = true;
}
function copyIntoLevel(gpu, source2, environment, level) {
  const encoder = gpu.gpu.createCommandEncoder({
    label: `${environment.label}.copy-level${level}`
  });
  encoder.copyTextureToTexture(
    { texture: source2.color.gpu },
    { texture: environment.gpu, mipLevel: level },
    [source2.size[0], source2.size[1], 1]
  );
  gpu.gpu.queue.submit([encoder.finish()]);
}
function destroyTarget(colorTarget) {
  colorTarget.destroy?.();
}
function destroyEnvironmentTexture(environment) {
  environment?.texture.destroy();
}
var ENVIRONMENT_SIZE, ENVIRONMENT_LEVELS, ENVIRONMENT_TEXEL_ANGLE, ENVIRONMENT_BLUR_RADIUS;
var init_environment_texture = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-texture.ts"() {
    "use strict";
    init_environment_bake();
    init_environment_blur();
    ENVIRONMENT_SIZE = [1024, 512];
    ENVIRONMENT_LEVELS = 8;
    ENVIRONMENT_TEXEL_ANGLE = 2 * Math.PI / ENVIRONMENT_SIZE[0];
    ENVIRONMENT_BLUR_RADIUS = 1.15;
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/framing.ts
function projectedBounds(matrices, points) {
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const matrix of matrices) {
    for (const [x, y, z] of points) {
      const clipX = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
      const clipY = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
      const clipW = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
      if (!Number.isFinite(clipW) || Math.abs(clipW) < 1e-6) continue;
      const ndcX = clipX / clipW;
      const ndcY = clipY / clipW;
      x0 = Math.min(x0, ndcX);
      y0 = Math.min(y0, ndcY);
      x1 = Math.max(x1, ndcX);
      y1 = Math.max(y1, ndcY);
    }
  }
  if (![x0, y0, x1, y1].every(Number.isFinite)) {
    return { x0: -1, y0: -1, x1: 1, y1: 1 };
  }
  return { x0, y0, x1, y1 };
}
function alignProjection(bounds, viewport) {
  return {
    scale: 1,
    offset: [
      viewport.left + viewport.right - 1 - (bounds.x0 + bounds.x1) / 2,
      1 - viewport.top - viewport.bottom - (bounds.y0 + bounds.y1) / 2
    ]
  };
}
function fitProjectionDistance(viewport, boundsAtDistance, minDistance, maxDistance, iterations = 36) {
  let near = Math.max(1e-4, minDistance);
  let far = Math.max(near, maxDistance);
  let bounds = boundsAtDistance(far);
  for (let attempt = 0; attempt < 8 && !fitsViewport(bounds, viewport); attempt++) {
    far *= 2;
    bounds = boundsAtDistance(far);
  }
  for (let step = 0; step < iterations; step++) {
    const distance = (near + far) / 2;
    const candidate = boundsAtDistance(distance);
    if (fitsViewport(candidate, viewport)) {
      far = distance;
      bounds = candidate;
    } else {
      near = distance;
    }
  }
  return {
    distance: far,
    bounds,
    framing: alignProjection(bounds, viewport)
  };
}
function applyProjectionFraming(viewProjection, framing) {
  if (framing.scale === IDENTITY_PROJECTION_FRAMING.scale && framing.offset[0] === 0 && framing.offset[1] === 0) {
    return viewProjection;
  }
  const result = new Float32Array(viewProjection);
  for (let column = 0; column < 4; column++) {
    const row = column * 4;
    const w = viewProjection[row + 3];
    result[row] = viewProjection[row] * framing.scale + w * framing.offset[0];
    result[row + 1] = viewProjection[row + 1] * framing.scale + w * framing.offset[1];
  }
  return result;
}
function framingCoverage(framing) {
  const scale3 = Math.max(framing.scale, 1e-4);
  return [
    Math.max(1, (1 + Math.abs(framing.offset[0])) / scale3),
    Math.max(1, (1 + Math.abs(framing.offset[1])) / scale3)
  ];
}
function fitsViewport(bounds, viewport) {
  const availableWidth = (viewport.right - viewport.left) * 2;
  const availableHeight = (viewport.bottom - viewport.top) * 2;
  return bounds.x1 - bounds.x0 <= availableWidth && bounds.y1 - bounds.y0 <= availableHeight;
}
var IDENTITY_PROJECTION_FRAMING;
var init_framing = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/framing.ts"() {
    "use strict";
    IDENTITY_PROJECTION_FRAMING = Object.freeze({
      scale: 1,
      offset: Object.freeze([0, 0])
    });
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/optics.ts
function iorAt(wavelengthNm, base, strength) {
  const micrometres = wavelengthNm * 1e-3;
  return base + strength / (micrometres * micrometres);
}
function intersectTriangle(triangle, origin, direction, minT) {
  const vertices = [triangle.a, triangle.b, triangle.c];
  let best;
  for (let index = 0; index < 3; index++) {
    const edgeStart = vertices[index];
    const edgeEnd = vertices[(index + 1) % 3];
    const edge = sub(edgeEnd, edgeStart);
    const denominator = cross2(direction, edge);
    if (denominator === 0) continue;
    const offset = sub(edgeStart, origin);
    const t = cross2(offset, edge) / denominator;
    const s = cross2(offset, direction) / denominator;
    if (t <= minT || s < 0 || s > 1) continue;
    if (best && best.t <= t) continue;
    best = { t, normal: normalize2([edge[1], -edge[0]]), edge: index };
  }
  return best;
}
function refract(incident, normal, eta) {
  const cosIncident = -dot(incident, normal);
  const sinTransmittedSquared = eta * eta * (1 - cosIncident * cosIncident);
  if (sinTransmittedSquared > 1) return void 0;
  const cosTransmitted = Math.sqrt(1 - sinTransmittedSquared);
  return add(scale(incident, eta), scale(normal, eta * cosIncident - cosTransmitted));
}
function reflect(incident, normal) {
  return sub(incident, scale(normal, 2 * dot(incident, normal)));
}
function fresnelTransmittance(incident, normal, incidentIor, transmittedIor) {
  const cosIncident = Math.min(1, Math.max(0, -dot(incident, normal)));
  const eta = incidentIor / transmittedIor;
  const sinTransmittedSquared = eta * eta * (1 - cosIncident * cosIncident);
  if (sinTransmittedSquared >= 1) return 0;
  const cosTransmitted = Math.sqrt(1 - sinTransmittedSquared);
  const sNumerator = incidentIor * cosIncident - transmittedIor * cosTransmitted;
  const sDenominator = incidentIor * cosIncident + transmittedIor * cosTransmitted;
  const pNumerator = incidentIor * cosTransmitted - transmittedIor * cosIncident;
  const pDenominator = incidentIor * cosTransmitted + transmittedIor * cosIncident;
  const reflectance = 0.5 * ((sNumerator / sDenominator) ** 2 + (pNumerator / pDenominator) ** 2);
  return 1 - reflectance;
}
function tracePrismDetailed(triangle, origin, direction, ior, maxBounces = PRISM_MAX_INTERNAL_BOUNCES) {
  const entry = intersectTriangle(triangle, origin, direction, SURFACE_EPSILON);
  if (!entry || dot(direction, entry.normal) >= 0) return void 0;
  let position = add(origin, scale(direction, entry.t));
  let inside = refract(direction, entry.normal, 1 / ior);
  if (!inside) return void 0;
  const points = [position];
  const edges = [entry.edge];
  const entryTransmission = fresnelTransmittance(
    direction,
    entry.normal,
    1,
    ior
  );
  let transmission = entryTransmission;
  for (let bounces = 0; bounces <= maxBounces; bounces++) {
    const exit = intersectTriangle(triangle, position, inside, SURFACE_EPSILON);
    if (!exit) return void 0;
    position = add(position, scale(inside, exit.t));
    points.push(position);
    edges.push(exit.edge);
    const transmitted = refract(inside, scale(exit.normal, -1), ior);
    if (transmitted) {
      transmission *= fresnelTransmittance(inside, scale(exit.normal, -1), ior, 1);
      return {
        origin: position,
        direction: normalize2(transmitted),
        bounces,
        points,
        edges,
        transmission,
        entryTransmission
      };
    }
    inside = reflect(inside, exit.normal);
  }
  return void 0;
}
function cieX(wavelengthNm) {
  const t1 = (wavelengthNm - 442) * (wavelengthNm < 442 ? 0.0624 : 0.0374);
  const t2 = (wavelengthNm - 599.8) * (wavelengthNm < 599.8 ? 0.0264 : 0.0323);
  const t3 = (wavelengthNm - 501.1) * (wavelengthNm < 501.1 ? 0.049 : 0.0382);
  return 0.362 * Math.exp(-0.5 * t1 * t1) + 1.056 * Math.exp(-0.5 * t2 * t2) - 0.065 * Math.exp(-0.5 * t3 * t3);
}
function cieY(wavelengthNm) {
  const t1 = (wavelengthNm - 568.8) * (wavelengthNm < 568.8 ? 0.0213 : 0.0247);
  const t2 = (wavelengthNm - 530.9) * (wavelengthNm < 530.9 ? 0.0613 : 0.0322);
  return 0.821 * Math.exp(-0.5 * t1 * t1) + 0.286 * Math.exp(-0.5 * t2 * t2);
}
function cieZ(wavelengthNm) {
  const t1 = (wavelengthNm - 437) * (wavelengthNm < 437 ? 0.0845 : 0.0278);
  const t2 = (wavelengthNm - 459) * (wavelengthNm < 459 ? 0.0385 : 0.0725);
  return 1.217 * Math.exp(-0.5 * t1 * t1) + 0.681 * Math.exp(-0.5 * t2 * t2);
}
function d65SpectralPower(wavelengthNm) {
  const coordinate = Math.min(
    D65_SPECTRAL_POWER.length - 1,
    Math.max(0, (wavelengthNm - PRISM_WAVELENGTHS.min) / 10)
  );
  const lower = Math.min(
    D65_SPECTRAL_POWER.length - 2,
    Math.floor(coordinate)
  );
  const fraction = coordinate - lower;
  return (D65_SPECTRAL_POWER[lower] * (1 - fraction) + D65_SPECTRAL_POWER[lower + 1] * fraction) / 100;
}
function wavelengthToBeamRgb(wavelengthNm) {
  const wavelength = Math.min(
    PRISM_WAVELENGTHS.max,
    Math.max(PRISM_WAVELENGTHS.min, wavelengthNm)
  );
  const x = cieX(wavelength);
  const y = cieY(wavelength);
  const z = cieZ(wavelength);
  const linearRgb = [
    3.2406 * x - 1.5372 * y - 0.4986 * z,
    -0.9689 * x + 1.8758 * y + 0.0415 * z,
    0.0557 * x - 0.204 * y + 1.057 * z
  ];
  const neutralOffset = Math.min(0, ...linearRgb);
  const positiveRgb = [
    linearRgb[0] - neutralOffset,
    linearRgb[1] - neutralOffset,
    linearRgb[2] - neutralOffset
  ];
  const huePeak = Math.max(...positiveRgb, Number.EPSILON);
  const relativePhotopicPower = d65SpectralPower(wavelength) * y / D65_PHOTOPIC_PEAK;
  const displayPower = (1 - Math.exp(-SPECTRAL_EXPOSURE * relativePhotopicPower)) / (1 - Math.exp(-SPECTRAL_EXPOSURE));
  return [
    positiveRgb[0] / huePeak * displayPower * SPECTRAL_WHITE_BALANCE[0],
    positiveRgb[1] / huePeak * displayPower * SPECTRAL_WHITE_BALANCE[1],
    positiveRgb[2] / huePeak * displayPower * SPECTRAL_WHITE_BALANCE[2]
  ];
}
var SURFACE_EPSILON, add, sub, scale, dot, length, normalize2, cross2, D65_SPECTRAL_POWER, D65_PHOTOPIC_PEAK, SPECTRAL_EXPOSURE, SPECTRAL_WHITE_BALANCE;
var init_optics = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/optics.ts"() {
    "use strict";
    init_types();
    SURFACE_EPSILON = 1e-4;
    add = (a, b) => [a[0] + b[0], a[1] + b[1]];
    sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
    scale = (a, k) => [a[0] * k, a[1] * k];
    dot = (a, b) => a[0] * b[0] + a[1] * b[1];
    length = (a) => Math.hypot(a[0], a[1]);
    normalize2 = (a) => scale(a, 1 / length(a));
    cross2 = (a, b) => a[0] * b[1] - a[1] * b[0];
    D65_SPECTRAL_POWER = [
      82.7549,
      91.486,
      93.4318,
      86.6823,
      104.865,
      117.008,
      117.812,
      114.861,
      115.923,
      108.811,
      109.354,
      107.802,
      104.79,
      107.689,
      104.405,
      104.046,
      100,
      96.3342,
      95.788,
      88.6856,
      90.0062,
      89.5991,
      87.6987,
      83.2886,
      83.6992,
      80.0268,
      80.2146,
      82.2778,
      78.2842,
      69.7213,
      71.6091
    ];
    D65_PHOTOPIC_PEAK = 1.0347;
    SPECTRAL_EXPOSURE = 4.5;
    SPECTRAL_WHITE_BALANCE = [1.1868, 1, 2.2495];
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/light-mesh.ts
function lightVertexCount(samples = PRISM_SPECTRAL_SAMPLES, beamSlices = PRISM_BEAM_SLICES) {
  const intervals = Math.max(1, samples - 1);
  return (whiteQuadCount(beamSlices) + internalQuadCount(samples, beamSlices) + intervals * beamSlices) * VERTICES_PER_QUAD;
}
function beamProfileOrigin(light, profile) {
  const perpendicular = [-light.direction[1], light.direction[0]];
  return add2(
    light.center,
    scale2(
      perpendicular,
      light.beamHalfWidth * Math.min(1, Math.max(-1, profile))
    )
  );
}
function beamBoundaryOrigins(light) {
  return [beamProfileOrigin(light, -1), beamProfileOrigin(light, 1)];
}
function rayToWallBoundary(origin, direction, halfExtent) {
  let nearest = Number.POSITIVE_INFINITY;
  for (let axis = 0; axis < 2; axis++) {
    const component = direction[axis];
    if (Math.abs(component) < 1e-8) continue;
    for (const side of [-halfExtent[axis], halfExtent[axis]]) {
      const distance = (side - origin[axis]) / component;
      if (distance <= 0 || distance >= nearest) continue;
      const other = 1 - axis;
      const otherCoordinate = origin[other] + direction[other] * distance;
      if (Math.abs(otherCoordinate) <= halfExtent[other] + 1e-6)
        nearest = distance;
    }
  }
  return Number.isFinite(nearest) ? add2(origin, scale2(direction, nearest)) : origin;
}
function lineThroughWall(origin, direction, halfExtent) {
  let near = Number.NEGATIVE_INFINITY;
  let far = Number.POSITIVE_INFINITY;
  for (let axis = 0; axis < 2; axis++) {
    const component = direction[axis];
    const coordinate = origin[axis];
    const extent = halfExtent[axis];
    if (Math.abs(component) < 1e-8) {
      if (Math.abs(coordinate) > extent) return void 0;
      continue;
    }
    const first = (-extent - coordinate) / component;
    const second = (extent - coordinate) / component;
    near = Math.max(near, Math.min(first, second));
    far = Math.min(far, Math.max(first, second));
    if (near > far) return void 0;
  }
  near = Math.max(0, near);
  if (!Number.isFinite(near) || !Number.isFinite(far) || far < near)
    return void 0;
  return [add2(origin, scale2(direction, near)), add2(origin, scale2(direction, far))];
}
function beamIntersectsTriangle(triangle, light) {
  const perpendicular = [-light.direction[1], light.direction[0]];
  let polygon = [triangle.a, triangle.b, triangle.c].map((point) => {
    const offset = sub2(point, light.center);
    return [
      offset[0] * light.direction[0] + offset[1] * light.direction[1],
      offset[0] * perpendicular[0] + offset[1] * perpendicular[1]
    ];
  });
  const clip = (inside) => {
    const input2 = polygon;
    polygon = [];
    for (let index = 0; index < input2.length; index++) {
      const start = input2[index];
      const end = input2[(index + 1) % input2.length];
      const startDistance = inside(start);
      const endDistance = inside(end);
      const startInside = startDistance >= 0;
      const endInside = endDistance >= 0;
      if (startInside) polygon.push(start);
      if (startInside === endInside) continue;
      const amount = startDistance / (startDistance - endDistance);
      polygon.push([
        start[0] + (end[0] - start[0]) * amount,
        start[1] + (end[1] - start[1]) * amount
      ]);
    }
  };
  clip((point) => point[0]);
  if (polygon.length === 0) return false;
  clip((point) => point[1] + light.beamHalfWidth);
  if (polygon.length === 0) return false;
  clip((point) => light.beamHalfWidth - point[1]);
  return polygon.length > 0;
}
function matchingTopology(a, b) {
  return a.edges.length === b.edges.length && a.edges.every((edge, index) => edge === b.edges[index]);
}
function traceSpectralBand(triangle, light, dispersion, wavelength) {
  const ior = iorAt(wavelength, dispersion.base, dispersion.strength);
  const [lowerOrigin, upperOrigin] = beamBoundaryOrigins(light);
  const lower = tracePrismDetailed(triangle, lowerOrigin, light.direction, ior);
  const upper = tracePrismDetailed(triangle, upperOrigin, light.direction, ior);
  if (!lower || !upper || !matchingTopology(lower, upper)) return void 0;
  const direction = normalize3(add2(lower.direction, upper.direction));
  const outputWidth = Math.abs(
    cross3(sub2(upper.origin, lower.origin), direction)
  );
  if (outputWidth <= 1e-5) return void 0;
  return {
    wavelength,
    lower,
    upper,
    outputWidth,
    transmission: (lower.transmission + upper.transmission) * 0.5
  };
}
function traceProfilePath(triangle, light, dispersion, wavelength, profile) {
  return tracePrismDetailed(
    triangle,
    beamProfileOrigin(light, profile),
    light.direction,
    iorAt(wavelength, dispersion.base, dispersion.strength)
  );
}
function pushVertex(output, point, intensity) {
  output.push(point[0], point[1], intensity);
}
function pushQuad(output, lowerStart, upperStart, lowerEnd, upperEnd, startIntensity, endIntensity = startIntensity) {
  pushVertex(output, lowerStart, startIntensity);
  pushVertex(output, upperStart, startIntensity);
  pushVertex(output, upperEnd, endIntensity);
  pushVertex(output, lowerStart, startIntensity);
  pushVertex(output, upperEnd, endIntensity);
  pushVertex(output, lowerEnd, endIntensity);
}
function pushSpectralCell(output, lowStart, highStart, lowEnd, highEnd, lowIntensity, highIntensity) {
  pushVertex(output, lowStart, lowIntensity);
  pushVertex(output, highStart, highIntensity);
  pushVertex(output, highEnd, highIntensity);
  pushVertex(output, lowStart, lowIntensity);
  pushVertex(output, highEnd, highIntensity);
  pushVertex(output, lowEnd, lowIntensity);
}
function pushEmptyQuad(output) {
  pushQuad(output, [0, 0], [0, 0], [0, 0], [0, 0], -1);
}
function profileCoordinates(slices) {
  return Array.from(
    { length: slices },
    (_, index) => -1 + 2 * (index + 0.5) / slices
  );
}
function normalizedProfileWeights(profiles, edgeFalloff) {
  const weights = profiles.map((profile) => {
    const edge = Math.min(1, Math.max(0, (Math.abs(profile) - 0.55) / 0.45));
    const smooth = edge * edge * (3 - 2 * edge);
    return Math.exp(-edgeFalloff * profile * profile) * (1 - smooth);
  });
  const sum = weights.reduce((total, weight) => total + weight, 0) || 1;
  return weights.map((weight) => weight / sum);
}
function canConnect(a, b, profileIndex) {
  const aPath = a?.paths[profileIndex];
  const bPath = b?.paths[profileIndex];
  return Boolean(aPath && bPath && matchingTopology(aPath, bPath));
}
function densityReference(path) {
  return add2(path.origin, scale2(path.direction, DENSITY_MEASURE_DISTANCE));
}
function spectralDensity(nodes, nodeIndex, profileIndex, exposure, inputWidth, profileWeight) {
  const node = nodes[nodeIndex];
  const path = node?.paths[profileIndex];
  if (!path) return 0;
  let left = nodeIndex - 1;
  while (left >= 0 && !nodes[left]?.paths[profileIndex]) left--;
  let right = nodeIndex + 1;
  while (right < nodes.length && !nodes[right]?.paths[profileIndex]) right++;
  if (left < 0) left = nodeIndex;
  if (right >= nodes.length) right = nodeIndex;
  if (left === right) return 0;
  const leftPath = nodes[left].paths[profileIndex];
  const rightPath = nodes[right].paths[profileIndex];
  if (!matchingTopology(leftPath, rightPath)) return 0;
  const direction = normalize3(add2(leftPath.direction, rightPath.direction));
  const spectralWidth = Math.abs(
    cross3(
      sub2(densityReference(rightPath), densityReference(leftPath)),
      direction
    )
  );
  const normalizedSpan = (right - left) / (nodes.length - 1);
  const jacobian = spectralWidth / normalizedSpan;
  return exposure * inputWidth * profileWeight * path.transmission / Math.max(jacobian, 1e-4);
}
function buildLightMesh(options, target3, scratch) {
  const triangle = options.triangle ?? PRISM_TRIANGLE;
  const samples = Math.max(
    2,
    Math.floor(options.samples ?? PRISM_SPECTRAL_SAMPLES)
  );
  const beamSlices = Math.max(
    1,
    Math.floor(options.beamSlices ?? PRISM_BEAM_SLICES)
  );
  const exposure = options.exposure ?? PRISM_LIGHT_EXPOSURE;
  const edgeFalloff = Math.max(
    0,
    options.edgeFalloff ?? DEFAULT_LIGHT_FADE_CONTROLS.edgeFalloff
  );
  const expectedVertexCount = lightVertexCount(samples, beamSlices);
  const expectedFloats = expectedVertexCount * LIGHT_VERTEX_FLOATS;
  if (target3 && target3.length !== expectedFloats) {
    throw new RangeError(
      `Light mesh target has ${target3.length} floats; expected ${expectedFloats}.`
    );
  }
  const output = scratch ?? [];
  output.length = 0;
  const inputWidth = options.light.beamHalfWidth * 2;
  const profiles = profileCoordinates(beamSlices);
  const profileWeights = normalizedProfileWeights(profiles, edgeFalloff);
  const boundaryProfiles = Array.from(
    { length: beamSlices + 1 },
    (_, index) => -1 + 2 * index / beamSlices
  );
  const whiteBoundaries = boundaryProfiles.map((profile) => {
    const origin = beamProfileOrigin(options.light, profile);
    const hit = intersectTriangle(
      triangle,
      origin,
      options.light.direction,
      1e-4
    );
    const entry = hit && dot2(options.light.direction, hit.normal) < 0 ? add2(origin, scale2(options.light.direction, hit.t)) : void 0;
    return {
      profile,
      origin,
      entry,
      wall: lineThroughWall(
        origin,
        options.light.direction,
        options.wallHalfExtent
      )
    };
  });
  const backwards = [
    -options.light.direction[0],
    -options.light.direction[1]
  ];
  for (let slice = 0; slice < beamSlices; slice++) {
    const lower = whiteBoundaries[slice];
    const upper = whiteBoundaries[slice + 1];
    if (lower.entry && upper.entry) {
      pushQuad(
        output,
        rayToWallBoundary(lower.entry, backwards, options.wallHalfExtent),
        rayToWallBoundary(upper.entry, backwards, options.wallHalfExtent),
        lower.entry,
        upper.entry,
        0,
        INPUT_BEAM_RADIANCE
      );
    } else {
      const centerProfile = (lower.profile + upper.profile) * 0.5;
      const cellLight = {
        center: beamProfileOrigin(options.light, centerProfile),
        direction: options.light.direction,
        beamHalfWidth: options.light.beamHalfWidth * (upper.profile - lower.profile) * 0.5
      };
      if (!beamIntersectsTriangle(triangle, cellLight) && lower.wall && upper.wall) {
        pushQuad(
          output,
          lower.wall[0],
          upper.wall[0],
          lower.wall[1],
          upper.wall[1],
          INPUT_BEAM_RADIANCE
        );
      } else {
        pushEmptyQuad(output);
      }
    }
  }
  const nodes = [];
  let minOutputWidth = Number.POSITIVE_INFINITY;
  let maxOutputWidth = 0;
  for (let index = 0; index < samples; index++) {
    const wavelength = PRISM_WAVELENGTHS.min + (PRISM_WAVELENGTHS.max - PRISM_WAVELENGTHS.min) * (index / (samples - 1));
    const band = traceSpectralBand(
      triangle,
      options.light,
      options.dispersion,
      wavelength
    );
    const paths = profiles.map(
      (profile) => traceProfilePath(
        triangle,
        options.light,
        options.dispersion,
        wavelength,
        profile
      )
    );
    const boundaryPaths = boundaryProfiles.map(
      (profile) => traceProfilePath(
        triangle,
        options.light,
        options.dispersion,
        wavelength,
        profile
      )
    );
    if (paths.every((path) => !path) && boundaryPaths.every((path) => !path)) {
      nodes.push(void 0);
      continue;
    }
    if (band) {
      minOutputWidth = Math.min(minOutputWidth, band.outputWidth);
      maxOutputWidth = Math.max(maxOutputWidth, band.outputWidth);
    }
    nodes.push({ wavelength, paths, boundaryPaths });
  }
  const densities = nodes.map(
    (node, nodeIndex) => profiles.map(
      (_, profileIndex) => node ? spectralDensity(
        nodes,
        nodeIndex,
        profileIndex,
        exposure,
        inputWidth,
        profileWeights[profileIndex]
      ) : 0
    )
  );
  const internalRgbSum = nodes.reduce(
    (sum, node) => {
      if (!node) return sum;
      const rgb = wavelengthToBeamRgb(node.wavelength);
      return [sum[0] + rgb[0], sum[1] + rgb[1], sum[2] + rgb[2]];
    },
    [0, 0, 0]
  );
  const internalIntensityScale = INPUT_BEAM_RADIANCE / Math.max(internalRgbSum[0], internalRgbSum[1], internalRgbSum[2], 1);
  for (const node of nodes) {
    if (!node) {
      for (let quad = 0; quad < beamSlices * LIGHT_INTERNAL_SEGMENTS; quad++) {
        pushEmptyQuad(output);
      }
      continue;
    }
    for (let slice = 0; slice < beamSlices; slice++) {
      const lower = node.boundaryPaths[slice];
      const upper = node.boundaryPaths[slice + 1];
      const connected = Boolean(
        lower && upper && matchingTopology(lower, upper)
      );
      const intensity = connected ? internalIntensityScale * (lower.entryTransmission + upper.entryTransmission) * 0.5 : 0;
      for (let segment = 0; segment < LIGHT_INTERNAL_SEGMENTS; segment++) {
        const lowerStart = lower?.points[segment];
        const lowerEnd = lower?.points[segment + 1];
        const upperStart = upper?.points[segment];
        const upperEnd = upper?.points[segment + 1];
        if (connected && lowerStart && lowerEnd && upperStart && upperEnd) {
          pushQuad(
            output,
            lowerStart,
            upperStart,
            lowerEnd,
            upperEnd,
            intensity
          );
        } else {
          pushEmptyQuad(output);
        }
      }
    }
  }
  let totalFlux = 0;
  for (let interval = 0; interval < samples - 1; interval++) {
    const low = nodes[interval];
    const high = nodes[interval + 1];
    for (let profileIndex = 0; profileIndex < beamSlices; profileIndex++) {
      const connected = canConnect(low, high, profileIndex);
      if (!connected) {
        pushEmptyQuad(output);
        continue;
      }
      const lowPath = low.paths[profileIndex];
      const highPath = high.paths[profileIndex];
      const lowIntensity = densities[interval][profileIndex];
      const highIntensity = densities[interval + 1][profileIndex];
      totalFlux += exposure * inputWidth * profileWeights[profileIndex] * (lowPath.transmission + highPath.transmission) * 0.5 / (samples - 1);
      pushSpectralCell(
        output,
        lowPath.origin,
        highPath.origin,
        rayToWallBoundary(
          lowPath.origin,
          lowPath.direction,
          options.wallHalfExtent
        ),
        rayToWallBoundary(
          highPath.origin,
          highPath.direction,
          options.wallHalfExtent
        ),
        lowIntensity,
        highIntensity
      );
    }
  }
  const vertexCount = output.length / LIGHT_VERTEX_FLOATS;
  if (output.length !== expectedFloats || vertexCount !== expectedVertexCount) {
    throw new Error(
      `Light mesh wrote ${vertexCount} vertices; expected ${expectedVertexCount}.`
    );
  }
  const vertices = target3 ?? new Float32Array(expectedFloats);
  vertices.set(output);
  const validBands = nodes.filter(Boolean).length;
  return {
    vertices,
    vertexCount,
    stats: {
      samples,
      beamSlices,
      validBands,
      rejectedTopology: samples - validBands,
      minOutputWidth: Number.isFinite(minOutputWidth) ? minOutputWidth : 0,
      maxOutputWidth,
      totalFlux
    }
  };
}
var LIGHT_VERTEX_FLOATS, LIGHT_VERTEX_STRIDE, VERTICES_PER_QUAD, LIGHT_INTERNAL_SEGMENTS, whiteQuadCount, internalQuadCount, LIGHT_WHITE_QUADS, LIGHT_INTERNAL_QUADS, LIGHT_WHITE_VERTICES, LIGHT_INTERNAL_VERTICES, LIGHT_INTERNAL_FIRST_VERTEX, LIGHT_OUTGOING_FIRST_VERTEX, LIGHT_OUTGOING_VERTICES, DENSITY_MEASURE_DISTANCE, INPUT_BEAM_RADIANCE, add2, sub2, scale2, cross3, dot2, normalize3;
var init_light_mesh = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/light-mesh.ts"() {
    "use strict";
    init_optics();
    init_types();
    LIGHT_VERTEX_FLOATS = 3;
    LIGHT_VERTEX_STRIDE = LIGHT_VERTEX_FLOATS * Float32Array.BYTES_PER_ELEMENT;
    VERTICES_PER_QUAD = 6;
    LIGHT_INTERNAL_SEGMENTS = PRISM_MAX_INTERNAL_BOUNCES + 1;
    whiteQuadCount = (beamSlices) => beamSlices;
    internalQuadCount = (samples, beamSlices) => samples * beamSlices * LIGHT_INTERNAL_SEGMENTS;
    LIGHT_WHITE_QUADS = whiteQuadCount(PRISM_BEAM_SLICES);
    LIGHT_INTERNAL_QUADS = internalQuadCount(
      PRISM_SPECTRAL_SAMPLES,
      PRISM_BEAM_SLICES
    );
    LIGHT_WHITE_VERTICES = LIGHT_WHITE_QUADS * VERTICES_PER_QUAD;
    LIGHT_INTERNAL_VERTICES = LIGHT_INTERNAL_QUADS * VERTICES_PER_QUAD;
    LIGHT_INTERNAL_FIRST_VERTEX = LIGHT_WHITE_VERTICES;
    LIGHT_OUTGOING_FIRST_VERTEX = LIGHT_WHITE_VERTICES + LIGHT_INTERNAL_VERTICES;
    LIGHT_OUTGOING_VERTICES = (PRISM_SPECTRAL_SAMPLES - 1) * PRISM_BEAM_SLICES * VERTICES_PER_QUAD;
    DENSITY_MEASURE_DISTANCE = 1;
    INPUT_BEAM_RADIANCE = 6;
    add2 = (a, b) => [a[0] + b[0], a[1] + b[1]];
    sub2 = (a, b) => [a[0] - b[0], a[1] - b[1]];
    scale2 = (a, amount) => [a[0] * amount, a[1] * amount];
    cross3 = (a, b) => a[0] * b[1] - a[1] * b[0];
    dot2 = (a, b) => a[0] * b[0] + a[1] * b[1];
    normalize3 = (a) => {
      const magnitude = Math.hypot(a[0], a[1]) || 1;
      return [a[0] / magnitude, a[1] / magnitude];
    };
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/prism-mesh.ts
import { geometry } from "vgpu";
function prismMeshData(triangle = PRISM_TRIANGLE, backZ = PRISM_BACK_Z, frontZ = PRISM_FRONT_Z) {
  const depth = Math.max(0, frontZ - backZ);
  const radius = Math.min(PRISM_BEVEL_RADIUS, depth * 0.45);
  const contour = roundedTriangleContour(triangle, radius);
  const vertices = [];
  const indices = [];
  const rings = [];
  const push = (position, normal) => {
    const index = vertices.length / 6;
    vertices.push(...position, ...normal);
    return index;
  };
  const addRing = (theta, z, zNormal) => {
    const inset = radius * (1 - Math.cos(theta));
    const xyWeight = Math.cos(theta);
    const ring = contour.map(
      ({ position, normal }) => push(
        [position[0] - normal[0] * inset, position[1] - normal[1] * inset, z],
        [normal[0] * xyWeight, normal[1] * xyWeight, zNormal]
      )
    );
    rings.push(ring);
    return ring;
  };
  const maxTheta = Math.PI / 2 - 0.06;
  const maxSine = Math.sin(maxTheta);
  for (let step = PRISM_BEVEL_SEGMENTS; step >= 0; step--) {
    const theta = maxTheta * step / PRISM_BEVEL_SEGMENTS;
    addRing(
      theta,
      backZ + radius - radius * Math.sin(theta) / maxSine,
      -Math.sin(theta)
    );
  }
  for (let step = 0; step <= PRISM_BEVEL_SEGMENTS; step++) {
    const theta = maxTheta * step / PRISM_BEVEL_SEGMENTS;
    addRing(
      theta,
      frontZ - radius + radius * Math.sin(theta) / maxSine,
      Math.sin(theta)
    );
  }
  for (let band = 0; band < rings.length - 1; band++) {
    const current = rings[band];
    const next = rings[band + 1];
    for (let point = 0; point < contour.length; point++) {
      const following = (point + 1) % contour.length;
      indices.push(
        current[point],
        current[following],
        next[following],
        current[point],
        next[following],
        next[point]
      );
    }
  }
  addCap(rings[0], [0, 0, -1], true);
  addCap(rings[rings.length - 1], [0, 0, 1], false);
  return {
    vertices: new Float32Array(vertices),
    indices: new Uint16Array(indices)
  };
  function addCap(sourceRing, normal, reverse) {
    const cap = sourceRing.map((source2) => {
      const base = source2 * 6;
      return push(
        [vertices[base], vertices[base + 1], vertices[base + 2]],
        normal
      );
    });
    const center = [
      cap.reduce((sum, index) => sum + vertices[index * 6], 0) / cap.length,
      cap.reduce((sum, index) => sum + vertices[index * 6 + 1], 0) / cap.length,
      cap.reduce((sum, index) => sum + vertices[index * 6 + 2], 0) / cap.length
    ];
    const centerIndex = push(center, normal);
    for (let point = 0; point < cap.length; point++) {
      const following = (point + 1) % cap.length;
      if (reverse) indices.push(centerIndex, cap[following], cap[point]);
      else indices.push(centerIndex, cap[point], cap[following]);
    }
  }
}
function prismWireframeIndices(triangleIndices) {
  const seen = /* @__PURE__ */ new Set();
  const edges = [];
  for (let triangle = 0; triangle < triangleIndices.length; triangle += 3) {
    append(triangleIndices[triangle], triangleIndices[triangle + 1]);
    append(triangleIndices[triangle + 1], triangleIndices[triangle + 2]);
    append(triangleIndices[triangle + 2], triangleIndices[triangle]);
  }
  return new Uint16Array(edges);
  function append(a, b) {
    const start = Math.min(a, b);
    const end = Math.max(a, b);
    const key = start * 65536 + end;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push(start, end);
  }
}
function prismPlanes(triangle = PRISM_TRIANGLE, backZ = PRISM_BACK_Z, frontZ = PRISM_FRONT_Z) {
  const corners = [triangle.a, triangle.b, triangle.c];
  const sides = corners.map((start, edge) => {
    const [nx, ny] = outwardNormal(start, corners[(edge + 1) % 3]);
    return [nx, ny, 0, nx * start[0] + ny * start[1]];
  });
  return [...sides, [0, 0, 1, frontZ], [0, 0, -1, -backZ]];
}
function prismGeometry(gpu, label) {
  const { vertices, indices } = prismMeshData();
  return upload(gpu, label, vertices, indices);
}
function prismWireframeGeometry(gpu, label) {
  const { vertices, indices } = prismMeshData();
  return upload(gpu, label, vertices, prismWireframeIndices(indices), true);
}
function upload(gpu, label, vertices, indices, wireframe = false) {
  return geometry(gpu, {
    label,
    ...wireframe ? { topology: "line-list" } : {},
    buffers: [
      {
        data: vertices,
        stride: PRISM_VERTEX_STRIDE,
        attributes: { position: "float32x3", normal: "float32x3" }
      }
    ],
    indices
  });
}
function roundedTriangleContour(triangle, radius) {
  const corners = [triangle.a, triangle.b, triangle.c];
  const arcs = corners.map((corner, index) => {
    const previous = corners[(index + corners.length - 1) % corners.length];
    const next = corners[(index + 1) % corners.length];
    const towardPrevious = normalize22([
      previous[0] - corner[0],
      previous[1] - corner[1]
    ]);
    const towardNext = normalize22([next[0] - corner[0], next[1] - corner[1]]);
    const halfAngle = Math.acos(clamp2(dot22(towardPrevious, towardNext), -1, 1)) / 2;
    const tangentDistance = radius / Math.max(Math.tan(halfAngle), 1e-6);
    const centerDistance = radius / Math.max(Math.sin(halfAngle), 1e-6);
    const bisector = normalize22([
      towardPrevious[0] + towardNext[0],
      towardPrevious[1] + towardNext[1]
    ]);
    const center = [
      corner[0] + bisector[0] * centerDistance,
      corner[1] + bisector[1] * centerDistance
    ];
    const start = [
      corner[0] + towardPrevious[0] * tangentDistance,
      corner[1] + towardPrevious[1] * tangentDistance
    ];
    const end = [
      corner[0] + towardNext[0] * tangentDistance,
      corner[1] + towardNext[1] * tangentDistance
    ];
    const startAngle = Math.atan2(start[1] - center[1], start[0] - center[0]);
    let endAngle = Math.atan2(end[1] - center[1], end[0] - center[0]);
    while (endAngle <= startAngle) endAngle += Math.PI * 2;
    return Array.from(
      { length: PRISM_CORNER_SEGMENTS + 1 },
      (_, step) => {
        const angle = startAngle + (endAngle - startAngle) * step / PRISM_CORNER_SEGMENTS;
        const normal = [Math.cos(angle), Math.sin(angle)];
        return {
          position: [
            center[0] + normal[0] * radius,
            center[1] + normal[1] * radius
          ],
          normal
        };
      }
    );
  });
  return arcs.flatMap((arc, index) => {
    const end = arc[arc.length - 1];
    const nextArc = arcs[(index + 1) % arcs.length];
    const nextStart = nextArc[0];
    const edgeNormal = outwardNormal(
      corners[index],
      corners[(index + 1) % corners.length]
    );
    const straight = Array.from(
      { length: PRISM_EDGE_SEGMENTS - 1 },
      (_, step) => {
        const amount = (step + 1) / PRISM_EDGE_SEGMENTS;
        return {
          position: [
            end.position[0] + (nextStart.position[0] - end.position[0]) * amount,
            end.position[1] + (nextStart.position[1] - end.position[1]) * amount
          ],
          normal: edgeNormal
        };
      }
    );
    return [...arc, ...straight];
  });
}
function normalize22(value) {
  const length2 = Math.hypot(...value) || 1;
  return [value[0] / length2, value[1] / length2];
}
function dot22(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
function clamp2(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function outwardNormal(start, end) {
  const edge = [end[0] - start[0], end[1] - start[1]];
  const length2 = Math.hypot(...edge) || 1;
  return [edge[1] / length2, -edge[0] / length2];
}
var PRISM_VERTEX_STRIDE, PRISM_BEVEL_RADIUS, PRISM_CORNER_SEGMENTS, PRISM_BEVEL_SEGMENTS, PRISM_EDGE_SEGMENTS;
var init_prism_mesh = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/prism-mesh.ts"() {
    "use strict";
    init_types();
    PRISM_VERTEX_STRIDE = 24;
    PRISM_BEVEL_RADIUS = 8e-3;
    PRISM_CORNER_SEGMENTS = 4;
    PRISM_BEVEL_SEGMENTS = 4;
    PRISM_EDGE_SEGMENTS = 16;
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/runtime/normalize-controls.ts
function normalizeTransmission(glass, mode, defaults) {
  const input2 = glass.transmission?.[mode];
  const legacyIor = mode === "dark" ? glass.ior : void 0;
  const legacyAbsorption = mode === "dark" ? glass.absorption : void 0;
  const absorption = input2?.absorption ?? legacyAbsorption ?? defaults.absorption;
  return {
    ior: finite(input2?.ior ?? legacyIor, defaults.ior),
    absorption: [
      finite(absorption[0], defaults.absorption[0]),
      finite(absorption[1], defaults.absorption[1]),
      finite(absorption[2], defaults.absorption[2])
    ]
  };
}
function normalizeReflection(glass, mode, defaults) {
  const input2 = glass.reflection?.[mode];
  const legacyStrength = mode === "dark" ? glass.reflectionStrength : void 0;
  const legacyExposure = mode === "dark" ? glass.environmentExposure : void 0;
  return {
    reflectionStrength: finite(
      input2?.reflectionStrength ?? legacyStrength,
      defaults.reflectionStrength
    ),
    environmentExposure: finite(
      input2?.environmentExposure ?? legacyExposure,
      defaults.environmentExposure
    )
  };
}
function normalizeControls(controls) {
  const defaults = DEFAULT_PRISM_CONTROLS;
  const inputGlass = controls.glass ?? defaults.glass;
  const inputPostprocess = controls.postprocess ?? defaults.postprocess;
  const inputLightFade = controls.lightFade ?? defaults.lightFade;
  const inputLightMode = controls.lightMode ?? defaults.lightMode;
  const inputBeamMouseY = controls.beamMouseY ?? defaults.beamMouseY;
  const legacyLightFade = inputLightFade;
  const inputDispersion = controls.spectralDispersion ?? PRISM_DISPERSION_PRESETS[controls.dispersion ?? defaults.dispersion];
  return {
    ...controls,
    cameraFov: clampCameraFov(controls.cameraFov ?? defaults.cameraFov),
    beamWidth: clampBeamWidth(controls.beamWidth ?? defaults.beamWidth),
    beamMouseY: {
      top: clamp3(
        finite(inputBeamMouseY.top, defaults.beamMouseY.top),
        PRISM_BEAM_MOUSE_Y_RANGES.top.min,
        PRISM_BEAM_MOUSE_Y_RANGES.top.max
      ),
      bottom: clamp3(
        finite(inputBeamMouseY.bottom, defaults.beamMouseY.bottom),
        PRISM_BEAM_MOUSE_Y_RANGES.bottom.min,
        PRISM_BEAM_MOUSE_Y_RANGES.bottom.max
      )
    },
    spectralDispersion: {
      base: clamp3(
        finite(
          inputDispersion.base,
          PRISM_DISPERSION_PRESETS[defaults.dispersion].base
        ),
        PRISM_SPECTRAL_DISPERSION_RANGES.base.min,
        PRISM_SPECTRAL_DISPERSION_RANGES.base.max
      ),
      strength: clamp3(
        finite(
          inputDispersion.strength,
          PRISM_DISPERSION_PRESETS[defaults.dispersion].strength
        ),
        PRISM_SPECTRAL_DISPERSION_RANGES.strength.min,
        PRISM_SPECTRAL_DISPERSION_RANGES.strength.max
      )
    },
    lightFade: {
      beamOpacity: clamp3(
        finite(inputLightFade.beamOpacity, defaults.lightFade.beamOpacity),
        PRISM_LIGHT_FADE_RANGES.beamOpacity.min,
        PRISM_LIGHT_FADE_RANGES.beamOpacity.max
      ),
      edgeFalloff: clamp3(
        finite(inputLightFade.edgeFalloff, defaults.lightFade.edgeFalloff),
        PRISM_LIGHT_FADE_RANGES.edgeFalloff.min,
        PRISM_LIGHT_FADE_RANGES.edgeFalloff.max
      ),
      rainbowFalloffRate: clamp3(
        finite(
          inputLightFade.rainbowFalloffRate ?? legacyLightFade.rainbowFalloff,
          defaults.lightFade.rainbowFalloffRate
        ),
        PRISM_LIGHT_FADE_RANGES.rainbowFalloffRate.min,
        PRISM_LIGHT_FADE_RANGES.rainbowFalloffRate.max
      ),
      rainbowFalloffPower: clamp3(
        finite(
          inputLightFade.rainbowFalloffPower,
          defaults.lightFade.rainbowFalloffPower
        ),
        PRISM_LIGHT_FADE_RANGES.rainbowFalloffPower.min,
        PRISM_LIGHT_FADE_RANGES.rainbowFalloffPower.max
      )
    },
    lightMode: {
      wall: {
        normalStrength: clamp3(
          finite(
            inputLightMode.wall?.normalStrength,
            defaults.lightMode.wall.normalStrength
          ),
          PRISM_LIGHT_MODE_RANGES.wall.normalStrength.min,
          PRISM_LIGHT_MODE_RANGES.wall.normalStrength.max
        ),
        lightmapGamma: clamp3(
          finite(
            inputLightMode.wall?.lightmapGamma,
            defaults.lightMode.wall.lightmapGamma
          ),
          PRISM_LIGHT_MODE_RANGES.wall.lightmapGamma.min,
          PRISM_LIGHT_MODE_RANGES.wall.lightmapGamma.max
        ),
        shadowContrast: clamp3(
          finite(
            inputLightMode.wall?.shadowContrast,
            defaults.lightMode.wall.shadowContrast
          ),
          PRISM_LIGHT_MODE_RANGES.wall.shadowContrast.min,
          PRISM_LIGHT_MODE_RANGES.wall.shadowContrast.max
        ),
        shadowPivot: clamp3(
          finite(
            inputLightMode.wall?.shadowPivot,
            defaults.lightMode.wall.shadowPivot
          ),
          PRISM_LIGHT_MODE_RANGES.wall.shadowPivot.min,
          PRISM_LIGHT_MODE_RANGES.wall.shadowPivot.max
        ),
        shadowFloor: clamp3(
          finite(
            inputLightMode.wall?.shadowFloor,
            defaults.lightMode.wall.shadowFloor
          ),
          PRISM_LIGHT_MODE_RANGES.wall.shadowFloor.min,
          PRISM_LIGHT_MODE_RANGES.wall.shadowFloor.max
        ),
        highlightExposure: clamp3(
          finite(
            inputLightMode.wall?.highlightExposure,
            defaults.lightMode.wall.highlightExposure
          ),
          PRISM_LIGHT_MODE_RANGES.wall.highlightExposure.min,
          PRISM_LIGHT_MODE_RANGES.wall.highlightExposure.max
        ),
        ambientFill: clamp3(
          finite(
            inputLightMode.wall?.ambientFill,
            defaults.lightMode.wall.ambientFill
          ),
          PRISM_LIGHT_MODE_RANGES.wall.ambientFill.min,
          PRISM_LIGHT_MODE_RANGES.wall.ambientFill.max
        )
      },
      caustic: {
        strength: clamp3(
          finite(
            inputLightMode.caustic?.strength,
            defaults.lightMode.caustic.strength
          ),
          PRISM_LIGHT_MODE_RANGES.caustic.strength.min,
          PRISM_LIGHT_MODE_RANGES.caustic.strength.max
        ),
        coverage: clamp3(
          finite(
            inputLightMode.caustic?.coverage,
            defaults.lightMode.caustic.coverage
          ),
          PRISM_LIGHT_MODE_RANGES.caustic.coverage.min,
          PRISM_LIGHT_MODE_RANGES.caustic.coverage.max
        ),
        normalInfluence: clamp3(
          finite(
            inputLightMode.caustic?.normalInfluence,
            defaults.lightMode.caustic.normalInfluence
          ),
          PRISM_LIGHT_MODE_RANGES.caustic.normalInfluence.min,
          PRISM_LIGHT_MODE_RANGES.caustic.normalInfluence.max
        ),
        normalElevation: clamp3(
          finite(
            inputLightMode.caustic?.normalElevation,
            defaults.lightMode.caustic.normalElevation
          ),
          PRISM_LIGHT_MODE_RANGES.caustic.normalElevation.min,
          PRISM_LIGHT_MODE_RANGES.caustic.normalElevation.max
        )
      },
      output: {
        exposure: clamp3(
          finite(
            inputLightMode.output?.exposure,
            defaults.lightMode.output.exposure
          ),
          PRISM_LIGHT_MODE_RANGES.output.exposure.min,
          PRISM_LIGHT_MODE_RANGES.output.exposure.max
        ),
        toneMapping: isLightToneMapping(inputLightMode.output?.toneMapping) ? inputLightMode.output.toneMapping : defaults.lightMode.output.toneMapping
      }
    },
    wireframe: controls.wireframe ?? defaults.wireframe,
    lightWireframe: controls.lightWireframe ?? defaults.lightWireframe,
    environmentDebug: controls.environmentDebug ?? defaults.environmentDebug,
    glass: {
      transmission: {
        dark: normalizeTransmission(
          inputGlass,
          "dark",
          defaults.glass.transmission.dark
        ),
        light: normalizeTransmission(
          inputGlass,
          "light",
          defaults.glass.transmission.light
        )
      },
      reflection: {
        dark: normalizeReflection(
          inputGlass,
          "dark",
          defaults.glass.reflection.dark
        ),
        light: normalizeReflection(
          inputGlass,
          "light",
          defaults.glass.reflection.light
        )
      }
    },
    postprocess: {
      bloomStrength: finite(
        inputPostprocess.bloomStrength,
        defaults.postprocess.bloomStrength
      ),
      bloomThreshold: finite(
        inputPostprocess.bloomThreshold,
        defaults.postprocess.bloomThreshold
      ),
      bloomRadius: finite(
        inputPostprocess.bloomRadius,
        defaults.postprocess.bloomRadius
      )
    }
  };
}
var finite, clamp3, isLightToneMapping;
var init_normalize_controls = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/runtime/normalize-controls.ts"() {
    "use strict";
    init_types();
    finite = (value, fallback) => typeof value === "number" && Number.isFinite(value) ? value : fallback;
    clamp3 = (value, min, max) => Math.min(max, Math.max(min, value));
    isLightToneMapping = (value) => PRISM_LIGHT_TONE_MAPPING_ORDER.some((candidate) => candidate === value);
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/runtime/state.ts
function refreshRuntime(runtime) {
  refreshFraming(runtime);
  refreshCamera(runtime);
  refreshLightMesh(runtime);
}
function setRuntimeControls(runtime, controls) {
  const next = normalizeControls(controls);
  const opticsChanged = next.dispersion !== runtime.controls.dispersion || next.spectralDispersion?.base !== runtime.controls.spectralDispersion?.base || next.spectralDispersion?.strength !== runtime.controls.spectralDispersion?.strength || next.beamWidth !== runtime.controls.beamWidth || next.beamMouseY.top !== runtime.controls.beamMouseY.top || next.beamMouseY.bottom !== runtime.controls.beamMouseY.bottom || next.lightFade.edgeFalloff !== runtime.controls.lightFade.edgeFalloff;
  const cameraChanged = next.cameraFov !== runtime.controls.cameraFov;
  runtime.controls = next;
  if (cameraChanged) {
    refreshFraming(runtime);
    refreshCamera(runtime);
  }
  if (opticsChanged || cameraChanged) refreshLightMesh(runtime);
}
function setRuntimeLampArc(runtime, position) {
  setRuntimeLampAim(runtime, position, runtime.lampTarget);
}
function setRuntimeLampAim(runtime, arcPosition, targetPosition) {
  const nextArc = Math.min(1, Math.max(0, arcPosition));
  const nextTarget = Math.min(1, Math.max(0, targetPosition));
  if (nextArc === runtime.lampArc && nextTarget === runtime.lampTarget) return;
  runtime.lampArc = nextArc;
  runtime.lampTarget = nextTarget;
  refreshLightMesh(runtime);
}
function setRuntimeOrbit(runtime, x, y) {
  runtime.orbit = [Math.min(1, Math.max(-1, x)), Math.min(1, Math.max(-1, y))];
  refreshCamera(runtime);
}
function setRuntimeFramingViewport(runtime, viewport) {
  if (sameViewport(runtime.framingViewport, viewport)) return;
  runtime.framingViewport = viewport;
  refreshRuntime(runtime);
}
function resizeRuntime(runtime, output) {
  if (runtime.outputSize[0] === output[0] && runtime.outputSize[1] === output[1])
    return;
  runtime.outputSize = output;
  runtime.aspect = output[0] / Math.max(1, output[1]);
  refreshRuntime(runtime);
}
function incidenceAt(position, beamMouseY = DEFAULT_PRISM_CONTROLS.beamMouseY) {
  const clamped = Math.min(1, Math.max(0, position));
  if (clamped <= 0.5) {
    return beamMouseY.top + (PRISM_MOUSE_Y_MIDPOINT_INCIDENCE_DEGREES - beamMouseY.top) * clamped * 2;
  }
  return PRISM_MOUSE_Y_MIDPOINT_INCIDENCE_DEGREES + (beamMouseY.bottom - PRISM_MOUSE_Y_MIDPOINT_INCIDENCE_DEGREES) * (clamped - 0.5) * 2;
}
function lampAt(position = PRISM_DEFAULT_ARC, beamWidth = DEFAULT_PRISM_CONTROLS.beamWidth, targetPosition = 0.5, beamMouseY = DEFAULT_PRISM_CONTROLS.beamMouseY) {
  return lampForIncidence(
    incidenceAt(position, beamMouseY),
    beamWidth,
    targetPosition
  );
}
function wallExtent(aspect, cameraDistance = CAMERA_DISTANCE, cameraFov = DEFAULT_PRISM_CONTROLS.cameraFov, framing = IDENTITY_PROJECTION_FRAMING) {
  const halfHeight = wallHalfHeight(aspect, cameraDistance, cameraFov);
  const coverage = framingCoverage(framing);
  return [halfHeight * aspect * coverage[0], halfHeight * coverage[1]];
}
function lightWallExtent(aspect, cameraDistance = CAMERA_DISTANCE, cameraFov = DEFAULT_PRISM_CONTROLS.cameraFov, framing = IDENTITY_PROJECTION_FRAMING) {
  const extent = wallExtent(aspect, cameraDistance, cameraFov, framing);
  const overscan = Math.min(2.5, Math.max(1, 1 / Math.max(aspect, 1e-3)));
  return [extent[0] * overscan, extent[1] * overscan];
}
function refreshCamera(runtime) {
  const view = cameraView(
    runtime.aspect,
    runtime.orbit[0],
    runtime.orbit[1],
    runtime.cameraDistance,
    runtime.controls.cameraFov
  );
  runtime.view = {
    ...view,
    viewProjection: applyProjectionFraming(
      view.viewProjection,
      runtime.framing
    )
  };
}
function refreshFraming(runtime) {
  const viewport = runtime.framingViewport;
  if (!viewport) {
    runtime.cameraDistance = CAMERA_DISTANCE;
    runtime.framing = IDENTITY_PROJECTION_FRAMING;
    return;
  }
  const fit = fitProjectionDistance(
    viewport,
    (distance) => projectedBounds(
      framingMatrices(runtime.aspect, distance, runtime.controls.cameraFov),
      PRISM_FRAME_POINTS
    ),
    CAMERA_FIT_MIN_DISTANCE,
    CAMERA_FIT_MAX_DISTANCE
  );
  runtime.cameraDistance = fit.distance;
  runtime.framing = fit.framing;
}
function refreshLightMesh(runtime) {
  const measurement = runtime.measurementSink;
  const startedAt = measurement?.now();
  const mesh = buildLightMesh(
    {
      light: lampAt(
        runtime.lampArc,
        runtime.controls.beamWidth,
        runtime.lampTarget,
        runtime.controls.beamMouseY
      ),
      dispersion: runtime.controls.spectralDispersion ?? PRISM_DISPERSION_PRESETS[runtime.controls.dispersion],
      edgeFalloff: runtime.controls.lightFade.edgeFalloff,
      wallHalfExtent: lightWallExtent(
        runtime.aspect,
        runtime.cameraDistance,
        runtime.controls.cameraFov,
        runtime.framing
      )
    },
    runtime.lightVertices,
    runtime.lightVertexScratch
  );
  const builtAt = measurement?.now();
  runtime.lightBuffer.write(runtime.lightVertices);
  if (measurement && startedAt !== void 0 && builtAt !== void 0) {
    measurement.recordLightMesh({
      buildMs: builtAt - startedAt,
      uploadMs: measurement.now() - builtAt,
      bytes: mesh.vertices.byteLength
    });
  }
  runtime.lightStats = mesh.stats;
}
function framingMatrices(aspect, distance, fov) {
  const matrices = [];
  for (const orbitX of [-1, 0, 1]) {
    for (const orbitY of [-1, 0, 1]) {
      matrices.push(
        cameraView(aspect, orbitX, orbitY, distance, fov).viewProjection
      );
    }
  }
  return matrices;
}
function sameViewport(a, b) {
  if (!a || !b) return a === b;
  return Math.abs(a.left - b.left) < 1e-5 && Math.abs(a.top - b.top) < 1e-5 && Math.abs(a.right - b.right) < 1e-5 && Math.abs(a.bottom - b.bottom) < 1e-5;
}
var CAMERA_FIT_MIN_DISTANCE, CAMERA_FIT_MAX_DISTANCE, PRISM_FRAME_POINTS;
var init_state = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/runtime/state.ts"() {
    "use strict";
    init_camera();
    init_framing();
    init_light_mesh();
    init_prism_mesh();
    init_types();
    init_normalize_controls();
    CAMERA_FIT_MIN_DISTANCE = PRISM_FRONT_Z + 0.1;
    CAMERA_FIT_MAX_DISTANCE = 32;
    PRISM_FRAME_POINTS = (() => {
      const vertices = prismMeshData().vertices;
      const points = [];
      for (let index = 0; index < vertices.length; index += 6) {
        points.push([vertices[index], vertices[index + 1], vertices[index + 2]]);
      }
      return points;
    })();
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/manifest.ts
var WALL_GLOBAL_LIGHT_MASK_URL, LIGHT_ASSET_MANIFEST, LIGHT_ASSET_IDS;
var init_manifest = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/manifest.ts"() {
    "use strict";
    WALL_GLOBAL_LIGHT_MASK_URL = "data:image/webp;base64,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";
    LIGHT_ASSET_MANIFEST = {
      "wall-material": {
        id: "wall-material",
        size: [512, 512]
      },
      "wall-lighting": {
        id: "wall-lighting",
        size: [512, 512]
      },
      "caustic-profile": {
        id: "caustic-profile",
        size: [1024, 256]
      }
    };
    LIGHT_ASSET_IDS = Object.freeze(
      Object.keys(LIGHT_ASSET_MANIFEST)
    );
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/math.ts
function smoothstep(edge0, edge1, value) {
  const unit = clamp01((value - edge0) / Math.max(edge1 - edge0, 1e-8));
  return unit * unit * (3 - 2 * unit);
}
function hash(x, y) {
  return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123);
}
function noise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = smoothstep(0, 1, fract(x));
  const fy = smoothstep(0, 1, fract(y));
  const top = hash(ix, iy) * (1 - fx) + hash(ix + 1, iy) * fx;
  const bottom = hash(ix, iy + 1) * (1 - fx) + hash(ix + 1, iy + 1) * fx;
  return top * (1 - fy) + bottom * fy;
}
function fbm(x, y, octaves = 4) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let weight = 0;
  for (let octave = 0; octave < octaves; octave++) {
    value += noise(x * frequency, y * frequency) * amplitude;
    weight += amplitude;
    amplitude *= 0.5;
    frequency *= 2.07;
  }
  return value / weight;
}
function segmentDistance(x, y, ax, ay, bx, by) {
  const abx = bx - ax;
  const aby = by - ay;
  const lengthSquared = abx * abx + aby * aby || 1;
  const t = clamp01(((x - ax) * abx + (y - ay) * aby) / lengthSquared);
  return Math.hypot(x - (ax + abx * t), y - (ay + aby * t));
}
function triangleDistance(x, y, vertices) {
  const distances = vertices.map((start, index) => {
    const end = vertices[(index + 1) % vertices.length];
    return segmentDistance(x, y, start[0], start[1], end[0], end[1]);
  });
  return Math.min(...distances);
}
function triangleContains(x, y, vertices) {
  let orientation = 0;
  for (let index = 0; index < vertices.length; index++) {
    const start = vertices[index];
    const end = vertices[(index + 1) % vertices.length];
    const cross5 = (end[0] - start[0]) * (y - start[1]) - (end[1] - start[1]) * (x - start[0]);
    if (Math.abs(cross5) < 1e-9) continue;
    const side = Math.sign(cross5);
    if (orientation !== 0 && side !== orientation) return false;
    orientation = side;
  }
  return true;
}
function writePixel(pixels, index, rgba) {
  for (let channel = 0; channel < 4; channel++) {
    pixels[index + channel] = Math.round(clamp01(rgba[channel]) * 255);
  }
}
var fract, clamp01;
var init_math = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/math.ts"() {
    "use strict";
    fract = (value) => value - Math.floor(value);
    clamp01 = (value) => Math.min(1, Math.max(0, value));
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/generate-caustic.ts
function generateCausticProfile(size) {
  const [width, height] = size;
  const pixels = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    const wavelength = 700 - y / Math.max(1, height - 1) * 300;
    const spectral = wavelengthToBeamRgb(wavelength);
    for (let x = 0; x < width; x++) {
      const travel = x / Math.max(1, width - 1);
      const coarse = fbm(travel * 18, wavelength * 0.018, 4);
      const filament = 0.5 + 0.5 * Math.sin(travel * 104 + wavelength * 0.071);
      const focus = 0.72 + coarse * 0.24 + filament * 0.04;
      const tail = 1 - smoothstep(0.58, 1.08, travel) * 0.44;
      const farNeutral = smoothstep(0.2, 0.88, travel) * 0.36;
      const peak = Math.max(spectral[0], spectral[1], spectral[2], 1e-5);
      const hue = spectral.map((channel) => channel / peak);
      const rgb = hue.map(
        (channel) => clamp01((channel * (1 - farNeutral) + farNeutral) * focus * tail)
      );
      writePixel(pixels, (y * width + x) * 4, [...rgb, focus * tail]);
    }
  }
  return { width, height, pixels };
}
var init_generate_caustic = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/generate-caustic.ts"() {
    "use strict";
    init_optics();
    init_math();
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/generate-wall.ts
function groundingPoint(point) {
  return [
    (point[0] - PRISM_CENTROID[0]) / PRISM_SIDE,
    (PRISM_CENTROID[1] - point[1]) / PRISM_SIDE
  ];
}
function plasterHeight(u, v) {
  return fbm(u * 34, v * 34, 5) * 0.65 + fbm(u * 117, v * 117, 2) * 0.35;
}
function generateWallMaterial(size) {
  const [width, height] = size;
  const pixels = new Uint8Array(width * height * 4);
  const epsilon = 1 / Math.max(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = (x + 0.5) / width;
      const v = (y + 0.5) / height;
      const heightX = plasterHeight(u + epsilon, v) - plasterHeight(u - epsilon, v);
      const heightY = plasterHeight(u, v + epsilon) - plasterHeight(u, v - epsilon);
      const variation = plasterHeight(u, v) - 0.5;
      writePixel(pixels, (y * width + x) * 4, [
        0.8 + variation * 0.06,
        0.5 - heightX * 1.8,
        0.5 - heightY * 1.8,
        0.86 + variation * 0.12
      ]);
    }
  }
  return { width, height, pixels };
}
function softBlob(u, v, centerX, centerY, radiusX, radiusY) {
  const dx = (u - centerX) / radiusX;
  const dy = (v - centerY) / radiusY;
  return Math.exp(-(dx * dx + dy * dy) * 1.8);
}
function overheadLight(u, v) {
  const upperLeft = softBlob(u, v, -0.08, -0.08, 0.58, 0.64) * 0.75;
  const center = softBlob(u, v, 0.42, 0.22, 0.15, 0.17) * 0.7;
  const right = softBlob(u, v, 0.83, 0.3, 0.16, 0.18) * 0.6;
  return clamp01(upperLeft + center + right);
}
function grounding(x, y) {
  const [, left, right] = PRISM_GROUNDING_TRIANGLE;
  const base = segmentDistance(x, y, left[0], left[1], right[0], right[1]);
  const baseContact = Math.exp(-(base * base) / 135e-5);
  const edge = triangleDistance(x, y, PRISM_GROUNDING_TRIANGLE);
  const edgeSpread = triangleContains(x, y, PRISM_GROUNDING_TRIANGLE) ? PRISM_GROUNDING_AO.insideSpread : PRISM_GROUNDING_AO.outsideSpread;
  const edgeOcclusion = Math.exp(-(edge * edge) / edgeSpread);
  const shadow = clamp01(1 - baseContact * 0.15);
  const ao = clamp01(
    1 - edgeOcclusion * PRISM_GROUNDING_AO.opacity - baseContact * 0.25
  );
  return [shadow, ao];
}
function generateWallLighting(size) {
  const [width, height] = size;
  const pixels = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const u = (x + 0.5) / width;
      const v = (y + 0.5) / height;
      const localX = u * 2 - 1;
      const localY = v * 2 - 1;
      const [prismShadow, ao] = grounding(localX, localY);
      writePixel(pixels, (y * width + x) * 4, [
        overheadLight(u, v),
        prismShadow,
        ao,
        1
      ]);
    }
  }
  return { width, height, pixels };
}
var PRISM_GROUNDING_TRIANGLE, PRISM_GROUNDING_AO;
var init_generate_wall = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/generate-wall.ts"() {
    "use strict";
    init_math();
    init_types();
    PRISM_GROUNDING_TRIANGLE = Object.freeze([
      groundingPoint(PRISM_TRIANGLE.a),
      groundingPoint(PRISM_TRIANGLE.b),
      groundingPoint(PRISM_TRIANGLE.c)
    ]);
    PRISM_GROUNDING_AO = Object.freeze({
      insideSpread: 15e-4,
      outsideSpread: 0.014,
      opacity: 0.075
    });
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/global-light-mask.ts
function applyGlobalLightMask(asset, source2, sourceWidth, sourceHeight) {
  for (let y = 0; y < asset.height; y++) {
    const sourceY = (y + 0.5) / asset.height * sourceHeight - 0.5;
    const y0 = Math.max(0, Math.floor(sourceY));
    const y1 = Math.min(sourceHeight - 1, y0 + 1);
    const mixY = sourceY - Math.floor(sourceY);
    for (let x = 0; x < asset.width; x++) {
      const sourceX = (x + 0.5) / asset.width * sourceWidth - 0.5;
      const x0 = Math.max(0, Math.floor(sourceX));
      const x1 = Math.min(sourceWidth - 1, x0 + 1);
      const mixX = sourceX - Math.floor(sourceX);
      const top = source2[(y0 * sourceWidth + x0) * 4] * (1 - mixX) + source2[(y0 * sourceWidth + x1) * 4] * mixX;
      const bottom = source2[(y1 * sourceWidth + x0) * 4] * (1 - mixX) + source2[(y1 * sourceWidth + x1) * 4] * mixX;
      const u = (x + 0.5) / asset.width;
      const v = (y + 0.5) / asset.height;
      const edgeDistance = Math.min(u, 1 - u, v, 1 - v);
      const edgeFade = smoothstep2(0, EDGE_FADE, edgeDistance);
      asset.pixels[(y * asset.width + x) * 4] = Math.round(
        (top * (1 - mixY) + bottom * mixY) * edgeFade
      );
    }
  }
}
function smoothstep2(low, high, value) {
  const t = Math.min(1, Math.max(0, (value - low) / (high - low)));
  return t * t * (3 - 2 * t);
}
function globalLightMaskEdgeMax(pixels, width, height, inset) {
  let result = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x >= inset && x < width - inset && y >= inset && y < height - inset)
        continue;
      result = Math.max(result, pixels[(y * width + x) * 4]);
    }
  }
  return result;
}
var EDGE_FADE;
var init_global_light_mask = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/global-light-mask.ts"() {
    "use strict";
    EDGE_FADE = 0.06;
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/generate.ts
var generate_exports = {};
__export(generate_exports, {
  applyGlobalLightMask: () => applyGlobalLightMask,
  generateLightAsset: () => generateLightAsset,
  globalLightMaskEdgeMax: () => globalLightMaskEdgeMax
});
function generateLightAsset(id) {
  const size = LIGHT_ASSET_MANIFEST[id].size;
  if (id === "wall-material") return generateWallMaterial(size);
  if (id === "wall-lighting") return generateWallLighting(size);
  return generateCausticProfile(size);
}
var init_generate = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/generate.ts"() {
    "use strict";
    init_manifest();
    init_generate_caustic();
    init_generate_wall();
    init_global_light_mask();
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/runtime/uniforms.ts
function schlickFresnelF0(ior) {
  const shaderIor = Math.fround(ior);
  const ratio = Math.fround(
    Math.fround(shaderIor - 1) / Math.fround(shaderIor + 1)
  );
  return Math.fround(ratio * ratio);
}
function sceneUniforms(runtime, beamWidthReveal = 1) {
  const light = lampAt(
    runtime.lampArc,
    runtime.controls.beamWidth,
    runtime.lampTarget,
    runtime.controls.beamMouseY
  );
  const wallColor = runtime.controls.wallColor.match(
    /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i
  );
  return {
    viewProjection: runtime.view.viewProjection,
    wallHalfExtent: runtimeWallExtent(runtime),
    inputBeamDirection: light.direction,
    wallColor: wallColor ? wallColor.slice(1).map((channel) => Number.parseInt(channel, 16) / 255) : [0, 0, 0],
    causticOnly: runtime.controls.view === "caustic" ? 1 : 0,
    lightPlaneZ: PRISM_LIGHT_PLANE_Z,
    lightWhiteQuads: LIGHT_WHITE_QUADS,
    lightBeamSlices: PRISM_BEAM_SLICES,
    lightInternalQuads: LIGHT_INTERNAL_QUADS,
    lightInternalSegments: LIGHT_INTERNAL_SEGMENTS,
    lightOpacity: runtime.controls.lightFade.beamOpacity,
    lightEdgeFalloff: runtime.controls.lightFade.edgeFalloff,
    rainbowFalloffRate: runtime.controls.lightFade.rainbowFalloffRate,
    rainbowFalloffPower: runtime.controls.lightFade.rainbowFalloffPower,
    beamWidthReveal: Math.min(1, Math.max(0, beamWidthReveal))
  };
}
function glassUniforms(runtime, mode) {
  const glass = runtime.controls.glass;
  const transmission = glass.transmission[mode];
  const reflection = glass.reflection[mode];
  return {
    viewProjection: runtime.view.viewProjection,
    environmentRotation: ENVIRONMENT_ROTATION,
    cameraPosition: runtime.view.position,
    absorption: transmission.absorption,
    prismA: PRISM_TRIANGLE.a,
    prismB: PRISM_TRIANGLE.b,
    prismC: PRISM_TRIANGLE.c,
    environmentSize: ENVIRONMENT_SIZE,
    frontZ: PRISM_FRONT_Z,
    backZ: PRISM_BACK_Z,
    ior: transmission.ior,
    reflectionStrength: reflection.reflectionStrength,
    environmentExposure: reflection.environmentExposure,
    environmentDebug: runtime.debugEnvironmentEnabled && runtime.controls.environmentDebug ? 1 : 0,
    environmentTexelAngle: ENVIRONMENT_TEXEL_ANGLE,
    fresnelF0: schlickFresnelF0(transmission.ior),
    prismPlanes: PRISM_PLANES
  };
}
function runtimeWallExtent(runtime) {
  return wallExtent(
    runtime.aspect,
    runtime.cameraDistance,
    runtime.controls.cameraFov,
    runtime.framing
  );
}
var ENVIRONMENT_ROTATION, PRISM_PLANES;
var init_uniforms = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/runtime/uniforms.ts"() {
    "use strict";
    init_camera();
    init_environment_texture();
    init_light_mesh();
    init_prism_mesh();
    init_types();
    init_state();
    ENVIRONMENT_ROTATION = rotationMatrix(PRISM_GLASS.environmentRotation);
    PRISM_PLANES = prismPlanes();
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/caustic.wgsl
var caustic_default;
var init_caustic = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/caustic.wgsl"() {
    "use strict";
    caustic_default = { version: 1, wgsl: "// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/caustic.wgsl\nstruct _vgsl_df80dc5e__CausticParams {\n  strength: f32,\n  coverage: f32,\n  farDesaturation: f32,\n  farBrightness: f32,\n  travelScale: f32,\n  falloffRateScale: f32,\n  falloffPowerScale: f32,\n  materialWorldScale: f32,\n  normalStrength: f32,\n  microNormalFrequency: f32,\n  microNormalStrength: f32,\n  normalInfluence: f32,\n  normalElevation: f32,\n}\n\n@group(0) @binding(0) var<uniform> scene: _vgsl_2e4e59c8__Scene;\n@group(0) @binding(1) var<uniform> caustic: _vgsl_df80dc5e__CausticParams;\n@group(0) @binding(2) var causticProfile: texture_2d<f32>;\n@group(0) @binding(3) var causticSampler: sampler;\n@group(0) @binding(4) var wallMaterial: texture_2d<f32>;\n\nstruct _vgsl_df80dc5e__VertexOut {\n  @builtin(position) position: vec4f,\n  @location(0) color: vec3f,\n  @location(1) profile: f32,\n  @location(2) intensity: f32,\n  @location(3) travel: f32,\n  @location(4) wavelength: f32,\n  @location(5) worldPosition: vec2f,\n  @location(6) revealProfile: f32,\n};\n\n@vertex\nfn vs_main(\n  @builtin(vertex_index) vertexIndex: u32,\n  @location(0) position: vec2f,\n  @location(3) rawIntensity: f32,\n) -> _vgsl_df80dc5e__VertexOut {\n  var out: _vgsl_df80dc5e__VertexOut;\n  // One continuous physical cross-section must keep one depth. Putting the\n  // exterior rays on the wall and the interior rays inside the glass makes the\n  // shared entry/exit vertices project to different pixels under perspective.\n  out.position = scene.viewProjection * vec4f(position, scene.lightPlaneZ, 1.0);\n  let metadata = _vgsl_d5452d10__decodeLightVertex(\n    vertexIndex,\n    scene.lightWhiteQuads,\n    scene.lightBeamSlices,\n    scene.lightInternalQuads,\n    scene.lightInternalSegments,\n  );\n  out.color = vec3f(1.0);\n  out.wavelength = -1.0;\n  // Empty quads carry a negative intensity sentinel and never fetch the LUT.\n  if metadata.white == 0u && rawIntensity >= 0.0 {\n    let spectral = _vgsl_f5e7a5d3__spectralSample(metadata.spectralIndex);\n    out.color = spectral.rgb;\n    out.wavelength = spectral.a;\n  }\n  out.profile = metadata.profile;\n  out.intensity = max(rawIntensity, 0.0);\n  out.travel = metadata.travel;\n  out.worldPosition = position;\n  out.revealProfile = metadata.revealProfile;\n  return out;\n}\n\nfn _vgsl_df80dc5e__wallNormalResponse(in: _vgsl_df80dc5e__VertexOut) -> f32 {\n  // Derivatives must be evaluated uniformly. Explicit-LOD samples below can\n  // then stay inside the exterior-only branch without sampling the dense\n  // internal spectral mesh.\n  let normalLod = _vgsl_87da3e3f__wallNormalTextureLod(\n    in.worldPosition,\n    caustic.materialWorldScale,\n    wallMaterial,\n  );\n  let travelGradient = vec2f(dpdx(in.travel), dpdy(in.travel));\n  let worldPositionDx = dpdx(in.worldPosition);\n  let worldPositionDy = dpdy(in.worldPosition);\n  let hasTravelGradient = dot(travelGradient, travelGradient) > 0.000000000001;\n  // Only the dispersed exterior cells carry both a wavelength and increasing\n  // travel. White light has a negative wavelength; internal spectral strips\n  // keep travel constant at zero.\n  let isExteriorRainbow = in.wavelength >= 0.0 && hasTravelGradient;\n  if (!isExteriorRainbow || caustic.normalInfluence <= 0.0) {\n    return 1.0;\n  }\n\n  let worldTravel = worldPositionDx * travelGradient.x\n    + worldPositionDy * travelGradient.y;\n  var rayDirection = normalize(scene.inputBeamDirection);\n  if (hasTravelGradient && dot(worldTravel, worldTravel) > 0.000000000001) {\n    rayDirection = normalize(worldTravel);\n  }\n\n  let elevation = clamp(caustic.normalElevation, 1.0, 89.0)\n    * 0.01745329252;\n  // The baked wall normals use the projected incident-vector convention.\n  // Negating this tangent swaps lit ridges and cavities along the beam.\n  let incidentLight = normalize(vec3f(\n    rayDirection * cos(elevation),\n    sin(elevation),\n  ));\n  let normal = _vgsl_87da3e3f__evaluateWallNormalsLevel(\n    in.worldPosition,\n    caustic.materialWorldScale,\n    caustic.normalStrength,\n    caustic.microNormalFrequency,\n    caustic.microNormalStrength,\n    normalLod,\n    wallMaterial,\n    causticSampler,\n  ).combined;\n  let flatResponse = max(incidentLight.z, 0.05);\n  let relativeResponse = clamp(\n    max(dot(normal, incidentLight), 0.0) / flatResponse,\n    0.0,\n    2.5,\n  );\n  return mix(\n    1.0,\n    relativeResponse,\n    clamp(caustic.normalInfluence, 0.0, 1.0),\n  );\n}\n\n@fragment\nfn fs_main(in: _vgsl_df80dc5e__VertexOut) -> @location(0) vec4f {\n  let radius = abs(in.profile);\n  let radial = exp(-scene.lightEdgeFalloff * radius * radius)\n    * (1.0 - smoothstep(0.55, 1.0, radius));\n  let widthReveal = _vgsl_eadbce44__beamWidthReveal(\n    in.revealProfile,\n    scene.beamWidthReveal,\n  );\n  let distance = clamp(in.travel / max(caustic.travelScale, 0.001), 0.0, 1.0);\n  let wavelengthUv = clamp((700.0 - max(in.wavelength, 400.0)) / 300.0, 0.0, 1.0);\n  let baked = textureSample(causticProfile, causticSampler, vec2f(distance, wavelengthUv));\n  let outgoingFalloff = 1.0 / pow(\n    1.0\n      + max(scene.rainbowFalloffRate, 0.0)\n        * max(caustic.falloffRateScale, 0.0)\n        * max(in.travel, 0.0),\n    max(\n      scene.rainbowFalloffPower * max(caustic.falloffPowerScale, 0.0),\n      0.0001,\n    ),\n  );\n  let surfaceResponse = _vgsl_df80dc5e__wallNormalResponse(in);\n  let energy = max(in.intensity, 0.0) * radial * widthReveal * outgoingFalloff\n    * max(scene.lightOpacity, 0.0) * baked.a;\n  let bounded = 1.0 - exp(-energy * max(caustic.strength, 0.0));\n  let farMix = smoothstep(0.16, 0.92, distance) * caustic.farDesaturation;\n  let spectral = in.color * mix(vec3f(1.0), baked.rgb, select(0.34, 0.0, in.wavelength < 0.0));\n  let neutral = vec3f(max(max(spectral.r, spectral.g), spectral.b) + caustic.farBrightness * distance);\n  let tint = clamp(mix(spectral, neutral, farMix) * (0.62 + bounded * 0.68), vec3f(0.0), vec3f(1.45));\n  let coverage = clamp(bounded * caustic.coverage, 0.0, 1.0);\n  // The wall has already been shaded. Emit premultiplied radiance with zero\n  // alpha into an additive draw so no wavelength can darken the plaster below.\n  return vec4f(tint * coverage * surfaceResponse, 0.0);\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/scene.wgsl\n// Uniforms shared by the wall and deterministic light-ribbon passes.\n\nstruct _vgsl_2e4e59c8__Scene {\n  viewProjection: mat4x4f,\n  wallHalfExtent: vec2f,\n  /** XY direction in which the white beam travels toward the prism. */\n  inputBeamDirection: vec2f,\n  /** User-selected sRGB wall color; the wall pass linearizes it before lighting. */\n  wallColor: vec3f,\n  /** 1 shows only the generated light over black. */\n  causticOnly: u32,\n  /** World-space depth of the emissive sheet between the glass interfaces. */\n  lightPlaneZ: f32,\n  /** Fixed layout metadata used to decimate the debug wireframe. */\n  lightWhiteQuads: u32,\n  lightBeamSlices: u32,\n  lightInternalQuads: u32,\n  lightInternalSegments: u32,\n  /** User-controlled lateral and outgoing-distance falloff strengths. */\n  lightOpacity: f32,\n  lightEdgeFalloff: f32,\n  rainbowFalloffRate: f32,\n  rainbowFalloffPower: f32,\n  /** Initial reveal aperture shared by white, internal, and spectral beams. */\n  beamWidthReveal: f32,\n}\n\n/** Maps top-origin texture coordinates to the wall plane in world space. */\n\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/shared/beam-reveal.wgsl\n/**\n * Opens a finite-width ray bundle from its center line. The uniform branches\n * keep the settled frame exact and avoid leaving a residual line at zero.\n */\nfn _vgsl_eadbce44__beamWidthReveal(profile: f32, progress: f32) -> f32 {\n  let reveal = clamp(progress, 0.0, 1.0);\n  if reveal <= 0.0 {\n    return 0.0;\n  }\n  if reveal >= 1.0 {\n    return 1.0;\n  }\n  // Outgoing spectral cells carry one flat profile per beam slice, so the\n  // minimum feather lets adjacent rainbow slices join without visible steps.\n  let antialias = max(fwidth(profile) * 1.5, 0.04);\n  return 1.0 - smoothstep(\n    max(reveal - antialias, 0.0),\n    min(reveal + antialias, 1.0),\n    abs(profile),\n  );\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/shared/light-vertex.wgsl\n// Static light-ribbon attributes decoded from the retained global vertex\n// index. The CPU uploads only position.xy and intensity; vertex counts and\n// first-vertex ranges remain identical to the original interleaved mesh.\n\nconst _vgsl_d5452d10__QUAD_UPPER = array<u32, 6>(0u, 1u, 1u, 0u, 1u, 0u);\nconst _vgsl_d5452d10__QUAD_END_TRAVEL = array<f32, 6>(0.0, 0.0, 1.0, 0.0, 1.0, 1.0);\n\n// Exact Float32 results of `-1 + 2 * boundary / 24` from the CPU mesh.\nconst _vgsl_d5452d10__BEAM_BOUNDARY_PROFILES = array<f32, 25>(\n  -1.0, -0.9166666865348816, -0.8333333134651184, -0.75,\n  -0.6666666865348816, -0.5833333134651184, -0.5,\n  -0.4166666567325592, -0.3333333432674408, -0.25,\n  -0.1666666716337204, -0.0833333358168602, 0.0,\n  0.0833333358168602, 0.1666666716337204, 0.25,\n  0.3333333432674408, 0.4166666567325592, 0.5,\n  0.5833333134651184, 0.6666666865348816, 0.75,\n  0.8333333134651184, 0.9166666865348816, 1.0,\n);\n\nstruct _vgsl_d5452d10__LightVertexMetadata {\n  profile: f32,\n  travel: f32,\n  spectralIndex: u32,\n  white: u32,\n  revealProfile: f32,\n}\n\nfn _vgsl_d5452d10__decodeLightVertex(\n  vertexIndex: u32,\n  whiteQuads: u32,\n  beamSlices: u32,\n  internalQuads: u32,\n  internalSegments: u32,\n) -> _vgsl_d5452d10__LightVertexMetadata {\n  let quad = vertexIndex / 6u;\n  let corner = vertexIndex % 6u;\n  let upper = _vgsl_d5452d10__QUAD_UPPER[corner];\n\n  if quad < whiteQuads {\n    return _vgsl_d5452d10__LightVertexMetadata(\n      _vgsl_d5452d10__BEAM_BOUNDARY_PROFILES[quad + upper],\n      0.0,\n      0u,\n      1u,\n      _vgsl_d5452d10__BEAM_BOUNDARY_PROFILES[quad + upper],\n    );\n  }\n\n  let spectralQuad = quad - whiteQuads;\n  if spectralQuad < internalQuads {\n    let quadsPerWavelength = beamSlices * internalSegments;\n    let spectralIndex = spectralQuad / quadsPerWavelength;\n    let slice = (spectralQuad % quadsPerWavelength) / internalSegments;\n    return _vgsl_d5452d10__LightVertexMetadata(\n      _vgsl_d5452d10__BEAM_BOUNDARY_PROFILES[slice + upper],\n      0.0,\n      spectralIndex,\n      0u,\n      _vgsl_d5452d10__BEAM_BOUNDARY_PROFILES[slice + upper],\n    );\n  }\n\n  let outgoingQuad = spectralQuad - internalQuads;\n  let outgoingSlice = outgoingQuad % beamSlices;\n  return _vgsl_d5452d10__LightVertexMetadata(\n    0.0,\n    _vgsl_d5452d10__QUAD_END_TRAVEL[corner],\n    outgoingQuad / beamSlices + upper,\n    0u,\n    0.5 * (\n      _vgsl_d5452d10__BEAM_BOUNDARY_PROFILES[outgoingSlice]\n        + _vgsl_d5452d10__BEAM_BOUNDARY_PROFILES[outgoingSlice + 1u]\n    ),\n  );\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/shared/spectral.wgsl\n// Generated Float32 checkpoint of `wavelengthToBeamRgb` for the fixed\n// 128-sample light mesh. Alpha retains the exact uploaded wavelength so the\n// projected caustic preserves its former interpolation and profile lookup.\nconst _vgsl_f5e7a5d3__SPECTRAL_LUT = array<vec4f, 128>(\n  vec4f(0.0009276652708649635, 0.0, 0.01045608427375555, 400.0),\n  vec4f(0.001637425273656845, 0.0, 0.012818877585232258, 402.3622131347656),\n  vec4f(0.002453181426972151, 0.0, 0.015664873644709587, 404.7243957519531),\n  vec4f(0.0033296814654022455, 0.0, 0.01908119209110737, 407.08660888671875),\n  vec4f(0.004219147376716137, 0.0, 0.023167869076132774, 409.4488220214844),\n  vec4f(0.005016450770199299, 0.0, 0.02767137996852398, 411.81103515625),\n  vec4f(0.005726693198084831, 0.0, 0.03282611444592476, 414.1732177734375),\n  vec4f(0.0063720447942614555, 0.0, 0.038834281265735626, 416.5354309082031),\n  vec4f(0.00697797816246748, 0.0, 0.045814741402864456, 418.89764404296875),\n  vec4f(0.007500954903662205, 0.0, 0.05327555537223816, 421.2598571777344),\n  vec4f(0.007993110455572605, 0.0, 0.06114164739847183, 423.6220397949219),\n  vec4f(0.008597604930400848, 0.0, 0.06995505839586258, 425.9842529296875),\n  vec4f(0.00939855445176363, 0.0, 0.07979211956262589, 428.3464660644531),\n  vec4f(0.010702796280384064, 0.0, 0.09255003929138184, 430.7086486816406),\n  vec4f(0.013043251819908619, 0.0, 0.11191345751285553, 433.07086181640625),\n  vec4f(0.016207652166485786, 0.0, 0.13458603620529175, 435.4330749511719),\n  vec4f(0.02036980912089348, 0.0, 0.16097605228424072, 437.7952880859375),\n  vec4f(0.02453680895268917, 0.0, 0.19133983552455902, 440.157470703125),\n  vec4f(0.02762519381940365, 0.0, 0.223611980676651, 442.5196838378906),\n  vec4f(0.030124200507998466, 0.0, 0.2601846754550934, 444.88189697265625),\n  vec4f(0.03208434209227562, 0.0, 0.30138635635375977, 447.24407958984375),\n  vec4f(0.03319524973630905, 0.0, 0.34751778841018677, 449.6062927246094),\n  vec4f(0.032500505447387695, 0.0, 0.39206168055534363, 451.968505859375),\n  vec4f(0.030062656849622726, 0.0, 0.43913084268569946, 454.3307189941406),\n  vec4f(0.02549462579190731, 0.0, 0.4899933636188507, 456.6929016113281),\n  vec4f(0.01816663332283497, 0.0, 0.5446479916572571, 459.05511474609375),\n  vec4f(0.007985850796103477, 0.0, 0.6007148623466492, 461.4173278808594),\n  vec4f(0.0, 0.004250565078109503, 0.6583616137504578, 463.779541015625),\n  vec4f(0.0, 0.01778329908847809, 0.7188571095466614, 466.1417236328125),\n  vec4f(0.0, 0.03469391539692879, 0.7820181250572205, 468.5039367675781),\n  vec4f(0.0, 0.056442294269800186, 0.8496572971343994, 470.86614990234375),\n  vec4f(0.0, 0.08500456809997559, 0.9234520792961121, 473.22833251953125),\n  vec4f(0.0, 0.12223964929580688, 0.9998624920845032, 475.5905456542969),\n  vec4f(0.0, 0.17022110521793365, 1.0786155462265015, 477.9527587890625),\n  vec4f(0.0, 0.23043279349803925, 1.1576675176620483, 480.3149719238281),\n  vec4f(0.0, 0.3013739287853241, 1.2265548706054688, 482.6771545410156),\n  vec4f(0.0, 0.3849429190158844, 1.2962673902511597, 485.03936767578125),\n  vec4f(0.0, 0.48050656914711, 1.3667092323303223, 487.4015808105469),\n  vec4f(0.0, 0.5868926048278809, 1.4377244710922241, 489.7637939453125),\n  vec4f(0.0, 0.6764097213745117, 1.4525021314620972, 492.1259765625),\n  vec4f(0.0, 0.7141680717468262, 1.364959478378296, 494.4881896972656),\n  vec4f(0.0, 0.7513074278831482, 1.2944350242614746, 496.85040283203125),\n  vec4f(0.0, 0.7872423529624939, 1.235427737236023, 499.21258544921875),\n  vec4f(0.0, 0.820360541343689, 1.182457685470581, 501.5747985839844),\n  vec4f(0.0, 0.8506588339805603, 1.1340235471725464, 503.93701171875),\n  vec4f(0.0, 0.8781104683876038, 1.0891823768615723, 506.2992248535156),\n  vec4f(0.0, 0.9023182392120361, 1.0468008518218994, 508.6614074707031),\n  vec4f(0.0, 0.9227785468101501, 1.0058692693710327, 511.02362060546875),\n  vec4f(0.0, 0.9395197033882141, 0.9660518169403076, 513.3858032226562),\n  vec4f(0.0, 0.9531605243682861, 0.9274855852127075, 515.748046875),\n  vec4f(0.0, 0.9640098214149475, 0.889782726764679, 518.1102294921875),\n  vec4f(0.0, 0.972785234451294, 0.8527419567108154, 520.472412109375),\n  vec4f(0.0, 0.9806240200996399, 0.8162780404090881, 522.8346557617188),\n  vec4f(0.0, 0.9864705204963684, 0.7782756686210632, 525.1968383789062),\n  vec4f(0.0, 0.9907678961753845, 0.7377868294715881, 527.55908203125),\n  vec4f(0.0, 0.9938809871673584, 0.6935604810714722, 529.9212646484375),\n  vec4f(0.0, 0.9953005313873291, 0.6437165141105652, 532.283447265625),\n  vec4f(0.0, 0.9963739514350891, 0.5885664820671082, 534.6456909179688),\n  vec4f(0.0, 0.9972034096717834, 0.5267602801322937, 537.0078735351562),\n  vec4f(0.0, 0.9978204369544983, 0.45638740062713623, 539.3700561523438),\n  vec4f(0.0, 0.9985225200653076, 0.3750465512275696, 541.7322998046875),\n  vec4f(0.0, 0.9991394281387329, 0.27924177050590515, 544.094482421875),\n  vec4f(0.0, 0.9995918869972229, 0.16423428058624268, 546.4566650390625),\n  vec4f(0.0, 0.9998977184295654, 0.023272335529327393, 548.8189086914062),\n  vec4f(0.07590825855731964, 0.9998574256896973, 0.0, 551.1810913085938),\n  vec4f(0.172451451420784, 0.999469518661499, 0.0, 553.5433349609375),\n  vec4f(0.2783505618572235, 0.9989391565322876, 0.0, 555.905517578125),\n  vec4f(0.3948717415332794, 0.9982571601867676, 0.0, 558.2677001953125),\n  vec4f(0.5234453082084656, 0.9974250197410583, 0.0, 560.6299438476562),\n  vec4f(0.6656978130340576, 0.996455729007721, 0.0, 562.9921264648438),\n  vec4f(0.8234602808952332, 0.9952938556671143, 0.0, 565.3543090820312),\n  vec4f(0.9988605976104736, 0.9939171075820923, 0.0, 567.716552734375),\n  vec4f(1.177673578262329, 0.9781429767608643, 0.0, 570.0787353515625),\n  vec4f(1.1760860681533813, 0.8224363327026367, 0.0, 572.44091796875),\n  vec4f(1.1741501092910767, 0.6952834129333496, 0.0, 574.8031616210938),\n  vec4f(1.171817421913147, 0.5896721482276917, 0.0, 577.1653442382812),\n  vec4f(1.169029712677002, 0.50070720911026, 0.0, 579.527587890625),\n  vec4f(1.1640989780426025, 0.4242915213108063, 0.0, 581.8897705078125),\n  vec4f(1.157752513885498, 0.35835379362106323, 0.0, 584.251953125),\n  vec4f(1.1501755714416504, 0.3011019229888916, 0.0, 586.6141967773438),\n  vec4f(1.1411696672439575, 0.2510553002357483, 0.0, 588.9763793945312),\n  vec4f(1.1330195665359497, 0.20752595365047455, 0.0, 591.3385620117188),\n  vec4f(1.125596284866333, 0.16939160227775574, 0.0, 593.7008056640625),\n  vec4f(1.1170347929000854, 0.13555681705474854, 0.0, 596.06298828125),\n  vec4f(1.1071977615356445, 0.10544843226671219, 0.0, 598.4251708984375),\n  vec4f(1.0955544710159302, 0.07866207510232925, 0.0, 600.7874145507812),\n  vec4f(1.081459641456604, 0.05545935034751892, 0.0, 603.1495971679688),\n  vec4f(1.0654693841934204, 0.03556278720498085, 0.0, 605.5118408203125),\n  vec4f(1.047431468963623, 0.018554607406258583, 0.0, 607.8740234375),\n  vec4f(1.0270756483078003, 0.004095226991921663, 0.0, 610.2362060546875),\n  vec4f(1.003137469291687, 0.0, 0.018001360818743706, 612.5984497070312),\n  vec4f(0.9766530394554138, 0.0, 0.0400092750787735, 614.9606323242188),\n  vec4f(0.9475923776626587, 0.0, 0.05749110132455826, 617.3228149414062),\n  vec4f(0.9159792065620422, 0.0, 0.07103116810321808, 619.68505859375),\n  vec4f(0.8794039487838745, 0.0, 0.08088549971580505, 622.0472412109375),\n  vec4f(0.8399484753608704, 0.0, 0.08758203685283661, 624.409423828125),\n  vec4f(0.7982639074325562, 0.0, 0.09153829514980316, 626.7716674804688),\n  vec4f(0.7547056078910828, 0.0, 0.09311319887638092, 629.1338500976562),\n  vec4f(0.7135004997253418, 0.0, 0.09314297139644623, 631.4960327148438),\n  vec4f(0.6734148263931274, 0.0, 0.09178439527750015, 633.8582763671875),\n  vec4f(0.6325734257698059, 0.0, 0.08902440220117569, 636.220458984375),\n  vec4f(0.5913266539573669, 0.0, 0.08510835468769073, 638.5827026367188),\n  vec4f(0.5482004880905151, 0.0, 0.08000007271766663, 640.9448852539062),\n  vec4f(0.5029013156890869, 0.0, 0.07381634414196014, 643.3070678710938),\n  vec4f(0.45871591567993164, 0.0, 0.06719779968261719, 645.6693115234375),\n  vec4f(0.41603878140449524, 0.0, 0.06035161763429642, 648.031494140625),\n  vec4f(0.3757951259613037, 0.0, 0.05354269593954086, 650.3936767578125),\n  vec4f(0.3403148949146271, 0.0, 0.04720335081219673, 652.7559204101562),\n  vec4f(0.30665019154548645, 0.0, 0.04099609702825546, 655.1181030273438),\n  vec4f(0.27495285868644714, 0.0, 0.03501851484179497, 657.4802856445312),\n  vec4f(0.2453300952911377, 0.0, 0.029347775503993034, 659.842529296875),\n  vec4f(0.21886122226715088, 0.0, 0.024153901264071465, 662.2047119140625),\n  vec4f(0.19440701603889465, 0.0, 0.01932777278125286, 664.5669555664062),\n  vec4f(0.17189663648605347, 0.0, 0.014888244681060314, 666.9291381835938),\n  vec4f(0.1513083279132843, 0.0, 0.01084998156875372, 669.2913208007812),\n  vec4f(0.1310787945985794, 0.0, 0.007133417297154665, 671.653564453125),\n  vec4f(0.11246760934591293, 0.0, 0.0038684343453496695, 674.0157470703125),\n  vec4f(0.09605303406715393, 0.0, 0.001074651489034295, 676.3779296875),\n  vec4f(0.08166374266147614, 0.0005675656720995903, 0.0, 678.7401733398438),\n  vec4f(0.06869003921747208, 0.001405493007041514, 0.0, 681.1023559570312),\n  vec4f(0.05708758533000946, 0.0020403882954269648, 0.0, 683.4645385742188),\n  vec4f(0.04721240699291229, 0.002504299860447645, 0.0, 685.8267822265625),\n  vec4f(0.03885701671242714, 0.0028238212689757347, 0.0, 688.18896484375),\n  vec4f(0.032088425010442734, 0.0030484620947390795, 0.0, 690.5512084960938),\n  vec4f(0.027107372879981995, 0.0032661701552569866, 0.0, 692.9133911132812),\n  vec4f(0.02281401865184307, 0.0034154034219682217, 0.0, 695.2755737304688),\n  vec4f(0.019129568710923195, 0.003507711226120591, 0.0, 697.6378173828125),\n  vec4f(0.015981433913111687, 0.0035538729280233383, 0.0, 700.0),\n);\n\nfn _vgsl_f5e7a5d3__spectralSample(index: u32) -> vec4f {\n  return _vgsl_f5e7a5d3__SPECTRAL_LUT[min(index, 127u)];\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/wall-normal.wgsl\nstruct _vgsl_87da3e3f__WallNormals {\n  large: vec3f,\n  micro: vec3f,\n  combined: vec3f,\n}\n\nfn _vgsl_87da3e3f__wallMaterialUv(worldPosition: vec2f, worldScale: f32) -> vec2f {\n  // Repeat in world units so viewport aspect changes reveal more surface\n  // instead of stretching the normal field.\n  return worldPosition / max(worldScale, 0.001);\n}\n\nfn _vgsl_87da3e3f__normalFromXy(normalXy: vec2f) -> vec3f {\n  let limitedXy = normalXy / max(length(normalXy), 1.0);\n  return normalize(vec3f(\n    limitedXy,\n    sqrt(max(1.0 - dot(limitedXy, limitedXy), 0.0001)),\n  ));\n}\n\nfn _vgsl_87da3e3f__wallNormalsFromSamples(\n  material: vec4f,\n  microMaterial: vec4f,\n  normalStrength: f32,\n  microNormalStrength: f32,\n) -> _vgsl_87da3e3f__WallNormals {\n  let largeNormalXy = (material.gb * 2.0 - 1.0) * normalStrength;\n  let microNormalXy = (microMaterial.gb * 2.0 - 1.0)\n    * microNormalStrength;\n  return _vgsl_87da3e3f__WallNormals(\n    _vgsl_87da3e3f__normalFromXy(largeNormalXy),\n    _vgsl_87da3e3f__normalFromXy(microNormalXy),\n    _vgsl_87da3e3f__normalFromXy(largeNormalXy + microNormalXy),\n  );\n}\n\n\n\n\n\nfn _vgsl_87da3e3f__wallNormalTextureLod(\n  worldPosition: vec2f,\n  materialWorldScale: f32,\n  wallMaterial: texture_2d<f32>,\n) -> f32 {\n  let uv = _vgsl_87da3e3f__wallMaterialUv(worldPosition, materialWorldScale);\n  let dimensions = vec2f(textureDimensions(wallMaterial, 0));\n  let footprint = max(\n    length(dpdx(uv) * dimensions),\n    length(dpdy(uv) * dimensions),\n  );\n  return max(log2(max(footprint, 1.0)), 0.0);\n}\n\nfn _vgsl_87da3e3f__evaluateWallNormalsLevel(\n  worldPosition: vec2f,\n  materialWorldScale: f32,\n  normalStrength: f32,\n  microNormalFrequency: f32,\n  microNormalStrength: f32,\n  baseLod: f32,\n  wallMaterial: texture_2d<f32>,\n  materialSampler: sampler,\n) -> _vgsl_87da3e3f__WallNormals {\n  let material = textureSampleLevel(\n    wallMaterial,\n    materialSampler,\n    _vgsl_87da3e3f__wallMaterialUv(worldPosition, materialWorldScale),\n    baseLod,\n  );\n  let frequency = max(microNormalFrequency, 1.0);\n  let microMaterial = textureSampleLevel(\n    wallMaterial,\n    materialSampler,\n    _vgsl_87da3e3f__wallMaterialUv(worldPosition, materialWorldScale / frequency)\n      + vec2f(0.371, 0.613),\n    max(baseLod + log2(frequency) - 2.0, 0.0),\n  );\n  return _vgsl_87da3e3f__wallNormalsFromSamples(\n    material,\n    microMaterial,\n    normalStrength,\n    microNormalStrength,\n  );\n}\n" };
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/shadow.wgsl
var shadow_default;
var init_shadow = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/shadow.wgsl"() {
    "use strict";
    shadow_default = { version: 1, wgsl: "struct PrismShadow {\n  viewProjection: mat4x4f,\n  color: vec3f,\n  opacity: f32,\n  farStrength: f32,\n}\n\n@group(0) @binding(0) var<uniform> shadow: PrismShadow;\n\nstruct VertexOut {\n  @builtin(position) position: vec4f,\n  @location(0) coverage: f32,\n  @location(1) travel: f32,\n};\n\n@vertex\nfn vs_main(\n  @location(0) position: vec2f,\n  @location(1) coverage: f32,\n  @location(2) travel: f32,\n) -> VertexOut {\n  var out: VertexOut;\n  out.position = shadow.viewProjection * vec4f(position, 0.0, 1.0);\n  out.coverage = coverage;\n  out.travel = travel;\n  return out;\n}\n\nfn shadowCoverage(in: VertexOut) -> f32 {\n  let longitudinal = mix(1.0, shadow.farStrength, smoothstep(0.0, 1.0, in.travel));\n  return clamp(in.coverage * shadow.opacity * longitudinal, 0.0, 0.95);\n}\n\n@fragment\nfn fs_main(in: VertexOut) -> @location(0) vec4f {\n  let alpha = shadowCoverage(in);\n  return vec4f(shadow.color * alpha, alpha);\n}\n\n@fragment\nfn fs_debug(in: VertexOut) -> @location(0) vec4f {\n  let coverage = shadowCoverage(in);\n  return vec4f(vec3f(coverage), 1.0);\n}\n" };
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/shadow/mesh.ts
import { geometry as geometry2 } from "vgpu";
function buildShadowMesh(triangle, options) {
  const source2 = [triangle.a, triangle.b, triangle.c];
  const points = source2.flatMap((position) => [
    { position, travel: 0 },
    {
      position: [
        position[0] + options.projection[0],
        position[1] + options.projection[1]
      ],
      travel: 1
    }
  ]);
  const hull = convexHull(points);
  if (hull.length < 3)
    throw new Error("A cast-shadow hull needs three points.");
  const positions = hull.map(({ position }) => position);
  const travel = hull.map(({ travel: travel2 }) => travel2);
  const widths = travel.map(
    (value) => mix(options.nearPenumbra, options.farPenumbra, value)
  );
  const middle = offsetConvexPolygon(
    positions,
    widths.map((width) => width * options.midRing)
  );
  const outer = offsetConvexPolygon(positions, widths);
  const center = polygonCentroid(positions);
  const centerTravel = travel.reduce((sum, value) => sum + value, 0) / travel.length;
  const vertices = [center[0], center[1], 1, centerTravel];
  appendRing(vertices, positions, 1, travel);
  appendRing(vertices, middle, options.midCoverage, travel);
  appendRing(vertices, outer, 0, travel);
  const count = positions.length;
  const coreStart = 1;
  const middleStart = coreStart + count;
  const outerStart = middleStart + count;
  const indices = [];
  for (let index = 0; index < count; index += 1) {
    const next = (index + 1) % count;
    indices.push(0, coreStart + index, coreStart + next);
    appendQuad(
      indices,
      coreStart + index,
      coreStart + next,
      middleStart + index,
      middleStart + next
    );
    appendQuad(
      indices,
      middleStart + index,
      middleStart + next,
      outerStart + index,
      outerStart + next
    );
  }
  return {
    vertices: new Float32Array(vertices),
    // u32 keeps every valid polygon size aligned for queue.writeBuffer; a
    // five-vertex hull produces 75 indices, whose u16 byte length is not / 4.
    indices: new Uint32Array(indices),
    hull: positions,
    hullTravel: travel
  };
}
function createShadowGeometry(gpu, label, triangle, options) {
  const mesh = buildShadowMesh(triangle, options);
  return geometry2(gpu, {
    label,
    buffers: [
      {
        data: mesh.vertices,
        stride: 16,
        attributes: {
          position: "float32x2",
          coverage: "float32",
          travel: "float32"
        }
      }
    ],
    indices: mesh.indices
  });
}
function appendRing(target3, positions, coverage, travel) {
  positions.forEach((position, index) => {
    target3.push(position[0], position[1], coverage, travel[index]);
  });
}
function appendQuad(target3, inner, innerNext, outer, outerNext) {
  target3.push(inner, outer, outerNext, inner, outerNext, innerNext);
}
function convexHull(points) {
  const sorted = [...points].sort(
    (left, right) => left.position[0] - right.position[0] || left.position[1] - right.position[1]
  );
  const half = (entries) => {
    const result = [];
    for (const point of entries) {
      while (result.length >= 2 && cross4(
        result.at(-2).position,
        result.at(-1).position,
        point.position
      ) <= 1e-9) {
        result.pop();
      }
      result.push(point);
    }
    return result;
  };
  const lower = half(sorted);
  const upper = half([...sorted].reverse());
  lower.pop();
  upper.pop();
  return [...lower, ...upper];
}
function offsetConvexPolygon(polygon, widths) {
  return polygon.map((point, index) => {
    const previous = polygon[(index + polygon.length - 1) % polygon.length];
    const next = polygon[(index + 1) % polygon.length];
    const incoming = normalize4([
      point[0] - previous[0],
      point[1] - previous[1]
    ]);
    const outgoing = normalize4([next[0] - point[0], next[1] - point[1]]);
    const previousNormal = [incoming[1], -incoming[0]];
    const nextNormal = [outgoing[1], -outgoing[0]];
    const miter = normalize4([
      previousNormal[0] + nextNormal[0],
      previousNormal[1] + nextNormal[1]
    ]);
    const scale3 = widths[index] / Math.max(dot3(miter, nextNormal), 0.25);
    return [point[0] + miter[0] * scale3, point[1] + miter[1] * scale3];
  });
}
function polygonCentroid(polygon) {
  let weightedX = 0;
  let weightedY = 0;
  let signedArea = 0;
  for (let index = 0; index < polygon.length; index += 1) {
    const point = polygon[index];
    const next = polygon[(index + 1) % polygon.length];
    const area = point[0] * next[1] - next[0] * point[1];
    weightedX += (point[0] + next[0]) * area;
    weightedY += (point[1] + next[1]) * area;
    signedArea += area;
  }
  const divisor = 3 * signedArea;
  return [weightedX / divisor, weightedY / divisor];
}
function normalize4(value) {
  const length2 = Math.hypot(value[0], value[1]);
  return length2 > 1e-9 ? [value[0] / length2, value[1] / length2] : [0, 0];
}
function dot3(left, right) {
  return left[0] * right[0] + left[1] * right[1];
}
function cross4(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}
function mix(from, to, amount) {
  return from + (to - from) * amount;
}
var init_mesh = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/shadow/mesh.ts"() {
    "use strict";
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/shadow/tuning.ts
function createPrismShadowGeometry(gpu, label) {
  return createShadowGeometry(gpu, label, PRISM_TRIANGLE, LIGHT_SHADOW_TUNING);
}
function prismShadowUniforms(viewProjection) {
  return {
    viewProjection,
    color: LIGHT_SHADOW_TUNING.color,
    opacity: LIGHT_SHADOW_TUNING.opacity,
    farStrength: LIGHT_SHADOW_TUNING.farStrength
  };
}
var LIGHT_SHADOW_TUNING;
var init_tuning = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/shadow/tuning.ts"() {
    "use strict";
    init_types();
    init_mesh();
    LIGHT_SHADOW_TUNING = Object.freeze({
      projection: [PRISM_SIDE * 0.65, -PRISM_SIDE * 0.78],
      nearPenumbra: PRISM_SIDE * 0.015,
      farPenumbra: PRISM_SIDE * 0.1,
      midRing: 0.48,
      midCoverage: 0.32,
      opacity: 0.46,
      farStrength: 0.92,
      color: [0.04, 0.037, 0.033]
    });
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/tuning.ts
var LIGHT_PIPELINE_TUNING;
var init_tuning2 = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/tuning.ts"() {
    "use strict";
    LIGHT_PIPELINE_TUNING = Object.freeze({
      wall: {
        materialScale: 2.4,
        normalStrength: 0.22,
        microNormalFrequency: 7,
        microNormalStrength: 1.05,
        ambient: 0.5,
        prismShadowStrength: 1,
        prismAoStrength: 1,
        groundingScale: 2
      },
      caustic: {
        farDesaturation: 0.04,
        farBrightness: 0.02,
        travelScale: 1,
        falloffRateScale: 0.12,
        falloffPowerScale: 0.5
      }
    });
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/presentation.ts
function presentationRevealUniforms(mode, progress = 1) {
  return {
    backgroundColor: PAGE_BACKGROUND_SRGB[mode],
    revealProgress: Math.min(1, Math.max(0, progress))
  };
}
var LIGHT_PAGE_BACKGROUND, OPACITY_REVEAL_SECONDS, BEAM_REVEAL_START_OPACITY, BEAM_REVEAL_START_SECONDS, PAGE_BACKGROUND_SRGB;
var init_presentation = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/presentation.ts"() {
    "use strict";
    LIGHT_PAGE_BACKGROUND = 250 / 255;
    OPACITY_REVEAL_SECONDS = 1;
    BEAM_REVEAL_START_OPACITY = 0.25;
    BEAM_REVEAL_START_SECONDS = OPACITY_REVEAL_SECONDS * (1 - Math.cbrt(1 - BEAM_REVEAL_START_OPACITY));
    PAGE_BACKGROUND_SRGB = {
      dark: [0, 0, 0],
      light: [LIGHT_PAGE_BACKGROUND, LIGHT_PAGE_BACKGROUND, LIGHT_PAGE_BACKGROUND]
    };
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/uniforms.ts
function lightWallUniforms(runtime) {
  const tuning = LIGHT_PIPELINE_TUNING.wall;
  const controls = runtime.controls.lightMode.wall;
  const wallColor = runtime.controls.wallColor.match(
    /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i
  );
  return {
    viewProjection: runtime.view.viewProjection,
    wallHalfExtent: runtimeWallExtent(runtime),
    wallColor: wallColor ? wallColor.slice(1).map((channel) => Number.parseInt(channel, 16) / 255) : [0.87, 0.87, 0.87],
    prismCenter: PRISM_CENTROID,
    // A more grazing upper-left key makes the plaster normals readable while
    // the baked HDR blobs remain responsible for the white illumination peaks.
    lightDirection: [-0.48, 0.56, 0.68],
    materialWorldScale: PRISM_SIDE * tuning.materialScale,
    normalStrength: tuning.normalStrength * controls.normalStrength,
    microNormalFrequency: tuning.microNormalFrequency,
    microNormalStrength: tuning.microNormalStrength * controls.normalStrength,
    ambient: tuning.ambient,
    ambientLightStrength: controls.ambientFill,
    globalLightTransfer: controls.lightmapGamma,
    shadowContrast: controls.shadowContrast,
    shadowPivot: controls.shadowPivot,
    shadowFloor: controls.shadowFloor,
    highlightExposure: controls.highlightExposure,
    // The broad cast shadow is a geometry draw. Preserve only the separately
    // baked contact/AO channel in the wall material composition.
    prismShadowStrength: 0,
    prismAoStrength: tuning.prismAoStrength,
    groundingScale: PRISM_SIDE * tuning.groundingScale
  };
}
function lightCausticUniforms(runtime) {
  const tuning = LIGHT_PIPELINE_TUNING.caustic;
  const controls = runtime.controls.lightMode.caustic;
  const wall = LIGHT_PIPELINE_TUNING.wall;
  const wallControls = runtime.controls.lightMode.wall;
  return {
    strength: controls.strength,
    coverage: controls.coverage,
    farDesaturation: tuning.farDesaturation,
    farBrightness: tuning.farBrightness,
    // Light-mesh travel is already normalized from the prism to the wall edge.
    travelScale: tuning.travelScale,
    falloffRateScale: tuning.falloffRateScale,
    falloffPowerScale: tuning.falloffPowerScale,
    materialWorldScale: PRISM_SIDE * wall.materialScale,
    normalStrength: wall.normalStrength * wallControls.normalStrength,
    microNormalFrequency: wall.microNormalFrequency,
    microNormalStrength: wall.microNormalStrength * wallControls.normalStrength,
    normalInfluence: controls.normalInfluence,
    normalElevation: controls.normalElevation
  };
}
function lightPresentUniforms(runtime, revealProgress = 1) {
  const output = runtime.controls.lightMode.output;
  return {
    ...presentationRevealUniforms("light", revealProgress),
    exposure: output.exposure,
    toneMapping: PRISM_LIGHT_TONE_MAPPING_CODES[output.toneMapping]
  };
}
var init_uniforms2 = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/uniforms.ts"() {
    "use strict";
    init_tuning2();
    init_uniforms();
    init_types();
    init_presentation();
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/debug-entries.ts
var LIGHT_WALL_DEBUG_ENTRIES, LIGHT_CAUSTIC_DEBUG_ENTRY;
var init_debug_entries = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/debug-entries.ts"() {
    "use strict";
    LIGHT_WALL_DEBUG_ENTRIES = Object.freeze({
      "wall-material": "fs_albedo",
      "wall-normal": "fs_normal",
      "wall-roughness": "fs_roughness",
      "global-shadow": "fs_global_shadow",
      "prism-ao": "fs_prism_ao",
      "composed-wall": "fs_composed"
    });
    LIGHT_CAUSTIC_DEBUG_ENTRY = "fs_raw_caustic";
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/caustic-debug.wgsl
var caustic_debug_default;
var init_caustic_debug = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/caustic-debug.wgsl"() {
    "use strict";
    caustic_debug_default = { version: 1, wgsl: "@group(0) @binding(0) var causticProfile: texture_2d<f32>;\n@group(0) @binding(1) var causticSampler: sampler;\n\n@fragment\nfn fs_raw_caustic(@location(0) uv: vec2f) -> @location(0) vec4f {\n  let sample = textureSampleLevel(causticProfile, causticSampler, uv, 0.0);\n  return vec4f(sample.rgb * sample.a, 1.0);\n}\n" };
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/wall-debug.wgsl
var wall_debug_default;
var init_wall_debug = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/wall-debug.wgsl"() {
    "use strict";
    wall_debug_default = { version: 1, wgsl: "// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/wall-debug.wgsl\n@group(0) @binding(0) var<uniform> params: _vgsl_3d5b6794__LightWall;\n@group(0) @binding(1) var wallMaterial: texture_2d<f32>;\n@group(0) @binding(2) var wallLighting: texture_2d<f32>;\n@group(0) @binding(3) var materialSampler: sampler;\n\nstruct _vgsl_23755144__VertexOut {\n  @builtin(position) position: vec4f,\n  @location(0) uv: vec2f,\n  @location(1) worldPosition: vec2f,\n};\n\n@vertex\nfn vs_debug(@builtin(vertex_index) index: u32) -> _vgsl_23755144__VertexOut {\n  let corners = array<vec2f, 6>(\n    vec2f(0.0, 1.0), vec2f(1.0, 1.0), vec2f(1.0, 0.0),\n    vec2f(0.0, 1.0), vec2f(1.0, 0.0), vec2f(0.0, 0.0),\n  );\n  let uv = corners[index];\n  let worldPosition = _vgsl_3d5b6794__wallPoint(params, uv);\n  var out: _vgsl_23755144__VertexOut;\n  out.position = params.viewProjection * vec4f(worldPosition, 0.0, 1.0);\n  out.uv = uv;\n  out.worldPosition = worldPosition;\n  return out;\n}\n\nfn _vgsl_23755144__sample(in: _vgsl_23755144__VertexOut) -> _vgsl_3d5b6794__WallSample {\n  return _vgsl_3d5b6794__evaluateWall(in.worldPosition, in.uv, params, wallMaterial, wallLighting, materialSampler);\n}\n\n@fragment fn fs_albedo(in: _vgsl_23755144__VertexOut) -> @location(0) vec4f { return vec4f(_vgsl_23755144__sample(in).albedo, 1.0); }\n@fragment fn fs_large_normal(in: _vgsl_23755144__VertexOut) -> @location(0) vec4f { return vec4f(_vgsl_23755144__sample(in).largeNormal * 0.5 + 0.5, 1.0); }\n@fragment fn fs_micro_normal(in: _vgsl_23755144__VertexOut) -> @location(0) vec4f { return vec4f(_vgsl_23755144__sample(in).microNormal * 0.5 + 0.5, 1.0); }\n@fragment fn fs_normal(in: _vgsl_23755144__VertexOut) -> @location(0) vec4f { return vec4f(_vgsl_23755144__sample(in).normal * 0.5 + 0.5, 1.0); }\n@fragment fn fs_roughness(in: _vgsl_23755144__VertexOut) -> @location(0) vec4f { return vec4f(vec3f(_vgsl_23755144__sample(in).roughness), 1.0); }\n@fragment fn fs_global_shadow(in: _vgsl_23755144__VertexOut) -> @location(0) vec4f { return vec4f(vec3f(_vgsl_23755144__sample(in).globalLight), 1.0); }\n@fragment fn fs_prism_shadow(in: _vgsl_23755144__VertexOut) -> @location(0) vec4f { return vec4f(vec3f(_vgsl_23755144__sample(in).prismShadow), 1.0); }\n@fragment fn fs_prism_ao(in: _vgsl_23755144__VertexOut) -> @location(0) vec4f { return vec4f(vec3f(_vgsl_23755144__sample(in).prismAo), 1.0); }\n@fragment fn fs_composed(in: _vgsl_23755144__VertexOut) -> @location(0) vec4f {\n  let composed = max(_vgsl_23755144__sample(in).composed, vec3f(0.0));\n  return vec4f(_vgsl_9fe494be__linearToSrgb3(_vgsl_9fe494be__tonemapAces(composed)), 1.0);\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/wall-common.wgsl\nconst _vgsl_3d5b6794__GLOBAL_LIGHT_MASK_ASPECT = 1.5;\n// The art-directed PNG is stored in an unorm KTX channel. Decode its visual\n// (sRGB-like) luminance before using it as incident light in the linear HDR\n// composition. This restores the authored separation between soft shadows.\nstruct _vgsl_3d5b6794__LightWall {\n  viewProjection: mat4x4f,\n  wallHalfExtent: vec2f,\n  wallColor: vec3f,\n  prismCenter: vec2f,\n  lightDirection: vec3f,\n  materialWorldScale: f32,\n  normalStrength: f32,\n  microNormalFrequency: f32,\n  microNormalStrength: f32,\n  ambient: f32,\n  ambientLightStrength: f32,\n  globalLightTransfer: f32,\n  shadowContrast: f32,\n  shadowPivot: f32,\n  shadowFloor: f32,\n  highlightExposure: f32,\n  prismShadowStrength: f32,\n  prismAoStrength: f32,\n  groundingScale: f32,\n}\n\nstruct _vgsl_3d5b6794__WallSample {\n  albedo: vec3f,\n  largeNormal: vec3f,\n  microNormal: vec3f,\n  normal: vec3f,\n  roughness: f32,\n  globalLight: f32,\n  prismShadow: f32,\n  prismAo: f32,\n  composed: vec3f,\n}\n\nfn _vgsl_3d5b6794__wallPoint(params: _vgsl_3d5b6794__LightWall, uv: vec2f) -> vec2f {\n  return (uv - vec2f(0.5)) * vec2f(2.0, -2.0) * params.wallHalfExtent;\n}\n\nfn _vgsl_3d5b6794__shadowContrastCurve(value: f32, contrast: f32, pivot: f32) -> f32 {\n  let safePivot = clamp(pivot, 0.001, 0.999);\n  let safeContrast = max(contrast, 0.001);\n  if (value < safePivot) {\n    return safePivot * pow(value / safePivot, safeContrast);\n  }\n  return 1.0 - (1.0 - safePivot) * pow(\n    (1.0 - value) / (1.0 - safePivot),\n    safeContrast,\n  );\n}\n\nfn _vgsl_3d5b6794__evaluateWall(\n  worldPosition: vec2f,\n  screenUv: vec2f,\n  params: _vgsl_3d5b6794__LightWall,\n  wallMaterial: texture_2d<f32>,\n  wallLighting: texture_2d<f32>,\n  materialSampler: sampler,\n) -> _vgsl_3d5b6794__WallSample {\n  let material = textureSample(\n    wallMaterial,\n    materialSampler,\n    worldPosition / max(params.materialWorldScale, 0.001),\n  );\n  let normals = _vgsl_87da3e3f__evaluateWallNormalsFromMaterial(\n    worldPosition,\n    params.materialWorldScale,\n    params.normalStrength,\n    params.microNormalFrequency,\n    params.microNormalStrength,\n    material,\n    wallMaterial,\n    materialSampler,\n  );\n  let largeNormal = normals.large;\n  let microNormal = normals.micro;\n  let normal = normals.combined;\n  let groundingOffset = vec2f(\n    worldPosition.x - params.prismCenter.x,\n    params.prismCenter.y - worldPosition.y,\n  );\n  let groundingUv = clamp(\n    groundingOffset / params.groundingScale + vec2f(0.5),\n    vec2f(0.001),\n    vec2f(0.999),\n  );\n  // Full-bleed cover fit: wide canvases crop only the bottom of the authored\n  // mask, keeping its top edge anchored; narrow canvases crop both sides.\n  let wallAspect = params.wallHalfExtent.x / max(params.wallHalfExtent.y, 0.001);\n  var lightingUv = screenUv;\n  if (wallAspect > _vgsl_3d5b6794__GLOBAL_LIGHT_MASK_ASPECT) {\n    lightingUv.y = screenUv.y * _vgsl_3d5b6794__GLOBAL_LIGHT_MASK_ASPECT / wallAspect;\n  } else {\n    lightingUv.x =\n      (screenUv.x - 0.5) * wallAspect / _vgsl_3d5b6794__GLOBAL_LIGHT_MASK_ASPECT + 0.5;\n  }\n  lightingUv = clamp(lightingUv, vec2f(0.001), vec2f(0.999));\n  let globalLight = textureSample(wallLighting, materialSampler, lightingUv).r;\n  let globalLightLinear = pow(\n    clamp(globalLight, 0.0, 1.0),\n    max(params.globalLightTransfer, 0.001),\n  );\n  let globalLightShaped = _vgsl_3d5b6794__shadowContrastCurve(\n    globalLightLinear,\n    params.shadowContrast,\n    params.shadowPivot,\n  );\n  let grounding = textureSample(wallLighting, materialSampler, groundingUv);\n  let glassGrounding = _vgsl_84fc8869__evaluateGlassGrounding(grounding.g, grounding.b);\n  let prismShadow = mix(1.0, glassGrounding.x, params.prismShadowStrength);\n  let prismAo = mix(1.0, glassGrounding.y, params.prismAoStrength);\n  let lightFacing = max(dot(normal, normalize(params.lightDirection)), 0.0);\n  let diffuse = mix(\n    params.ambient,\n    1.0,\n    lightFacing,\n  );\n  let halfDirection = normalize(normalize(params.lightDirection) + vec3f(0.0, 0.0, 1.0));\n  let specularPower = mix(48.0, 4.0, material.a);\n  let specular = pow(max(dot(normal, halfDirection), 0.0), specularPower)\n    * mix(0.12, 0.025, material.a);\n  let albedo = _vgsl_9fe494be__srgbToLinear3(params.wallColor) * material.r;\n  let direct = albedo * diffuse + vec3f(specular);\n  // The mask controls both the local wall exposure and the neutral incident\n  // radiance. Merely adding it over a uniformly bright wall lifts its shadows,\n  // then ACES compresses nearly all of the authored detail into white.\n  let globalBaseExposure = mix(\n    params.shadowFloor,\n    params.highlightExposure,\n    globalLightShaped,\n  );\n  let globalDiffuse = mix(0.25, 1.0, lightFacing);\n  let globalSurfaceResponse = material.r * globalDiffuse;\n  let globalIllumination = vec3f(\n    globalLightShaped * params.ambientLightStrength * globalSurfaceResponse\n  );\n  let composed = (\n    direct * globalBaseExposure + globalIllumination\n  ) * prismShadow * prismAo;\n  return _vgsl_3d5b6794__WallSample(\n    albedo,\n    largeNormal,\n    microNormal,\n    normal,\n    material.a,\n    globalLightShaped,\n    glassGrounding.x,\n    glassGrounding.y,\n    composed,\n  );\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/node_modules/.pnpm/@vgpu+wgsl-std@0.3.1/node_modules/@vgpu/wgsl-std/src/color/index.wgsl\n\n\n\n\nfn _vgsl_9fe494be__srgbToLinear(value: f32) -> f32 {\n  if (value <= 0.04045) {\n    return value / 12.92;\n  }\n  return pow((value + 0.055) / 1.055, 2.4);\n}\n\nfn _vgsl_9fe494be__srgbToLinear3(value: vec3f) -> vec3f {\n  return vec3f(_vgsl_9fe494be__srgbToLinear(value.r), _vgsl_9fe494be__srgbToLinear(value.g), _vgsl_9fe494be__srgbToLinear(value.b));\n}\n\n\n\nfn _vgsl_9fe494be__linearToSrgb(value: f32) -> f32 {\n  if (value <= 0.0031308) {\n    return value * 12.92;\n  }\n  return 1.055 * pow(value, 1.0 / 2.4) - 0.055;\n}\n\nfn _vgsl_9fe494be__linearToSrgb3(value: vec3f) -> vec3f {\n  return vec3f(_vgsl_9fe494be__linearToSrgb(value.r), _vgsl_9fe494be__linearToSrgb(value.g), _vgsl_9fe494be__linearToSrgb(value.b));\n}\n\n\n\nfn _vgsl_9fe494be__tonemapAces(value: vec3f) -> vec3f {\n  let a = 2.51;\n  let b = 0.03;\n  let c = 2.43;\n  let d = 0.59;\n  let e = 0.14;\n  return clamp((value * (a * value + b)) / (value * (c * value + d) + e), vec3f(0.0), vec3f(1.0));\n}\n\n\n\n\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/glass-grounding.wgsl\n/** Deepens the already-baked glass shadow/AO without another target or draw. */\nfn _vgsl_84fc8869__evaluateGlassGrounding(prismShadow: f32, prismAo: f32) -> vec2f {\n  return vec2f(\n    pow(clamp(prismShadow, 0.0, 1.0), 1.65),\n    pow(clamp(prismAo, 0.0, 1.0), 1.45),\n  );\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/wall-normal.wgsl\nstruct _vgsl_87da3e3f__WallNormals {\n  large: vec3f,\n  micro: vec3f,\n  combined: vec3f,\n}\n\nfn _vgsl_87da3e3f__wallMaterialUv(worldPosition: vec2f, worldScale: f32) -> vec2f {\n  // Repeat in world units so viewport aspect changes reveal more surface\n  // instead of stretching the normal field.\n  return worldPosition / max(worldScale, 0.001);\n}\n\nfn _vgsl_87da3e3f__normalFromXy(normalXy: vec2f) -> vec3f {\n  let limitedXy = normalXy / max(length(normalXy), 1.0);\n  return normalize(vec3f(\n    limitedXy,\n    sqrt(max(1.0 - dot(limitedXy, limitedXy), 0.0001)),\n  ));\n}\n\nfn _vgsl_87da3e3f__wallNormalsFromSamples(\n  material: vec4f,\n  microMaterial: vec4f,\n  normalStrength: f32,\n  microNormalStrength: f32,\n) -> _vgsl_87da3e3f__WallNormals {\n  let largeNormalXy = (material.gb * 2.0 - 1.0) * normalStrength;\n  let microNormalXy = (microMaterial.gb * 2.0 - 1.0)\n    * microNormalStrength;\n  return _vgsl_87da3e3f__WallNormals(\n    _vgsl_87da3e3f__normalFromXy(largeNormalXy),\n    _vgsl_87da3e3f__normalFromXy(microNormalXy),\n    _vgsl_87da3e3f__normalFromXy(largeNormalXy + microNormalXy),\n  );\n}\n\nfn _vgsl_87da3e3f__evaluateWallNormalsFromMaterial(\n  worldPosition: vec2f,\n  materialWorldScale: f32,\n  normalStrength: f32,\n  microNormalFrequency: f32,\n  microNormalStrength: f32,\n  material: vec4f,\n  wallMaterial: texture_2d<f32>,\n  materialSampler: sampler,\n) -> _vgsl_87da3e3f__WallNormals {\n  let microUv = _vgsl_87da3e3f__wallMaterialUv(\n    worldPosition,\n    materialWorldScale / max(microNormalFrequency, 1.0),\n  ) + vec2f(0.371, 0.613);\n  let microMaterial = textureSampleBias(\n    wallMaterial,\n    materialSampler,\n    microUv,\n    -2.0,\n  );\n  return _vgsl_87da3e3f__wallNormalsFromSamples(\n    material,\n    microMaterial,\n    normalStrength,\n    microNormalStrength,\n  );\n}\n\n\n\n\n\n\n" };
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/debug-draws.ts
var debug_draws_exports = {};
__export(debug_draws_exports, {
  createLightDebugDraws: () => createLightDebugDraws
});
import { draw as draw2, effect as effect3 } from "vgpu";
function createLightDebugDraws(runtime, graph) {
  if (!graph.assets)
    throw new Error("prepare() must load light assets before debug previews.");
  const sources = {};
  const wallPreviews = [];
  for (const [id, fragment] of Object.entries(LIGHT_WALL_DEBUG_ENTRIES)) {
    const preview = draw2(runtime.gpu, {
      shader: wall_debug_default,
      vertices: 6,
      depth: false,
      entry: { vertex: "vs_debug", fragment },
      label: `${runtime.label}.debug.${id}`
    });
    wallPreviews.push(preview);
    sources[id] = preview;
  }
  const rawCaustic = effect3(runtime.gpu, caustic_debug_default, {
    label: `${runtime.label}.debug.raw-caustic.${LIGHT_CAUSTIC_DEBUG_ENTRY}`
  });
  rawCaustic.set({
    causticProfile: graph.assets.causticProfile,
    causticSampler: graph.materialSampler
  });
  sources["raw-caustic"] = rawCaustic;
  const projected = draw2(runtime.gpu, {
    shader: caustic_default,
    geometry: runtime.lightGeometry,
    blend: "additive",
    depth: false,
    cull: "none",
    label: `${runtime.label}.debug.projected-caustic`
  });
  sources["projected-caustic"] = projected;
  const prismShadow = draw2(runtime.gpu, {
    shader: shadow_default,
    geometry: graph.prismShadowGeometry,
    depth: false,
    cull: "none",
    entry: { vertex: "vs_main", fragment: "fs_debug" },
    label: `${runtime.label}.debug.prism-cast-shadow`
  });
  sources["prism-shadow"] = prismShadow;
  const result = {
    sources,
    bind() {
      const assets = graph.assets;
      if (!assets) return;
      const wallBindings = {
        params: lightWallUniforms(runtime),
        wallMaterial: assets.wallMaterial,
        wallLighting: assets.wallLighting,
        materialSampler: graph.materialSampler
      };
      for (const preview of wallPreviews) preview.set(wallBindings);
      projected.set({
        scene: sceneUniforms(runtime),
        caustic: lightCausticUniforms(runtime),
        causticProfile: assets.causticProfile,
        causticSampler: graph.materialSampler,
        wallMaterial: assets.wallMaterial
      });
      prismShadow.set({
        shadow: prismShadowUniforms(runtime.view.viewProjection)
      });
    }
  };
  result.bind();
  return result;
}
var init_debug_draws = __esm({
  "references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/debug-draws.ts"() {
    "use strict";
    init_caustic_debug();
    init_caustic();
    init_shadow();
    init_wall_debug();
    init_uniforms();
    init_debug_entries();
    init_tuning();
    init_uniforms2();
  }
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/runtime/resources.ts
init_camera();
init_environment_texture();
init_framing();
init_light_mesh();
init_prism_mesh();
init_types();
init_normalize_controls();
import { sampler as sampler2 } from "vgpu";

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/runtime/settle.ts
async function settleAllOrThrow(work) {
  let firstFailure;
  let failed = false;
  const tracked = work.map(
    (task) => Promise.resolve(task).catch((error) => {
      if (!failed) {
        failed = true;
        firstFailure = error;
      }
      throw error;
    })
  );
  await Promise.allSettled(tracked);
  if (failed) throw firstFailure;
}

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/runtime/resources.ts
init_state();
function createPrismRuntime(gpu, output, label, options = {}) {
  const controls = normalizeControls(DEFAULT_PRISM_CONTROLS);
  const aspect = output[0] / Math.max(1, output[1]);
  const lightVertexScratch = [];
  const initialMesh = buildLightMesh(
    {
      light: lampAt(
        PRISM_DEFAULT_ARC,
        controls.beamWidth,
        0.5,
        controls.beamMouseY
      ),
      dispersion: controls.spectralDispersion ?? PRISM_DISPERSION_PRESETS[controls.dispersion],
      edgeFalloff: controls.lightFade.edgeFalloff,
      wallHalfExtent: wallExtent(aspect, CAMERA_DISTANCE, controls.cameraFov)
    },
    void 0,
    lightVertexScratch
  );
  const lightBuffer = gpu.device.createBuffer({
    size: initialMesh.vertices.byteLength,
    usage: ["vertex", "copy_dst"],
    label: `${label}.light-vertices`
  });
  lightBuffer.write(initialMesh.vertices);
  const prism = prismGeometry(gpu, `${label}.prism`);
  return {
    gpu,
    label,
    outputSize: output,
    lightBuffer,
    lightVertexScratch,
    lightVertices: initialMesh.vertices,
    lightGeometry: {
      vertexBuffers: [lightBuffer.gpu],
      vertexBufferLayouts: [
        {
          arrayStride: LIGHT_VERTEX_STRIDE,
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x2" },
            { shaderLocation: 3, offset: 8, format: "float32" }
          ]
        }
      ],
      vertexCount: lightVertexCount()
    },
    prism,
    sceneSampler: sampler2(gpu, {
      minFilter: "linear",
      magFilter: "linear",
      addressModeU: "clamp-to-edge",
      addressModeV: "clamp-to-edge"
    }),
    environmentSampler: createEnvironmentSampler(gpu),
    debugEnvironmentEnabled: options.debugEnvironment === true,
    controls,
    lightStats: initialMesh.stats,
    lampArc: PRISM_DEFAULT_ARC,
    lampTarget: 0.5,
    orbit: [0, 0],
    aspect,
    cameraDistance: CAMERA_DISTANCE,
    framing: IDENTITY_PROJECTION_FRAMING,
    view: cameraView(aspect, 0, 0, CAMERA_DISTANCE, controls.cameraFov)
  };
}
function ensurePrismWireframeGeometry(runtime) {
  runtime.prismWireframe ??= prismWireframeGeometry(
    runtime.gpu,
    `${runtime.label}.prism-wireframe`
  );
  return runtime.prismWireframe;
}
function prepareRuntimeEnvironment(runtime) {
  if (runtime.environmentReady) return runtime.environmentReady;
  runtime.studioEnvironment ??= createEnvironmentTexture(
    runtime.gpu,
    `${runtime.label}.environment-studio`,
    false
  );
  const environments = [runtime.studioEnvironment];
  if (runtime.debugEnvironmentEnabled) {
    runtime.debugEnvironment ??= createEnvironmentTexture(
      runtime.gpu,
      `${runtime.label}.environment-debug`,
      true
    );
    environments.push(runtime.debugEnvironment);
  }
  runtime.environmentReady = settleAllOrThrow(
    environments.map(
      (environment) => prepareEnvironmentTexture(
        runtime.gpu,
        environment,
        runtime.environmentSampler
      )
    )
  );
  return runtime.environmentReady;
}
function destroyPrismRuntime(runtime) {
  destroyEnvironmentTexture(runtime.studioEnvironment);
  runtime.studioEnvironment = void 0;
  destroyEnvironmentTexture(runtime.debugEnvironment);
  runtime.debugEnvironment = void 0;
  runtime.environmentReady = void 0;
  runtime.lightBuffer.destroy();
  runtime.prism.destroy();
  runtime.prismWireframe?.destroy();
  runtime.prismWireframe = void 0;
}

// <stdin>
init_state();

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/bake.wgsl
var bake_default = { version: 1, wgsl: "// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/bake.wgsl\n@group(0) @binding(0) var outputTexture: texture_storage_2d<rgba8unorm, write>;\n@group(0) @binding(1) var wallMask: texture_2d<f32>;\n@group(0) @binding(2) var wallMaskSampler: sampler;\n\nfn _vgsl_45d76430__hash2(point: vec2f) -> f32 {\n  return fract(sin(dot(point, vec2f(127.1, 311.7))) * 43758.5453123);\n}\n\nfn _vgsl_45d76430__valueNoise(point: vec2f) -> f32 {\n  let cell = floor(point);\n  let local = fract(point);\n  let blend = local * local * (3.0 - 2.0 * local);\n  let top = mix(_vgsl_45d76430__hash2(cell), _vgsl_45d76430__hash2(cell + vec2f(1.0, 0.0)), blend.x);\n  let bottom = mix(\n    _vgsl_45d76430__hash2(cell + vec2f(0.0, 1.0)),\n    _vgsl_45d76430__hash2(cell + vec2f(1.0, 1.0)),\n    blend.x,\n  );\n  return mix(top, bottom, blend.y);\n}\n\nfn _vgsl_45d76430__fbm(point: vec2f, octaves: u32) -> f32 {\n  var value = 0.0;\n  var amplitude = 0.5;\n  var frequency = 1.0;\n  var weight = 0.0;\n  for (var octave = 0u; octave < octaves; octave++) {\n    value += _vgsl_45d76430__valueNoise(point * frequency) * amplitude;\n    weight += amplitude;\n    amplitude *= 0.5;\n    frequency *= 2.07;\n  }\n  return value / weight;\n}\n\nfn _vgsl_45d76430__plasterHeight(uv: vec2f) -> f32 {\n  return _vgsl_45d76430__fbm(uv * 34.0, 5u) * 0.65 + _vgsl_45d76430__fbm(uv * 117.0, 2u) * 0.35;\n}\n\nfn _vgsl_45d76430__inBounds(pixel: vec2u) -> bool {\n  return all(pixel < textureDimensions(outputTexture));\n}\n\n@compute @workgroup_size(8, 8)\nfn wall_material(@builtin(global_invocation_id) id: vec3u) {\n  if (!_vgsl_45d76430__inBounds(id.xy)) { return; }\n  let size = vec2f(textureDimensions(outputTexture));\n  let uv = (vec2f(id.xy) + 0.5) / size;\n  let epsilon = 1.0 / max(size.x, size.y);\n  let heightX = _vgsl_45d76430__plasterHeight(uv + vec2f(epsilon, 0.0))\n    - _vgsl_45d76430__plasterHeight(uv - vec2f(epsilon, 0.0));\n  let heightY = _vgsl_45d76430__plasterHeight(uv + vec2f(0.0, epsilon))\n    - _vgsl_45d76430__plasterHeight(uv - vec2f(0.0, epsilon));\n  let variation = _vgsl_45d76430__plasterHeight(uv) - 0.5;\n  textureStore(outputTexture, id.xy, vec4f(\n    0.8 + variation * 0.06,\n    0.5 - heightX * 1.8,\n    0.5 - heightY * 1.8,\n    0.86 + variation * 0.12,\n  ));\n}\n\nfn _vgsl_45d76430__segmentDistance(point: vec2f, start: vec2f, end: vec2f) -> f32 {\n  let edge = end - start;\n  let t = clamp(dot(point - start, edge) / max(dot(edge, edge), 1e-8), 0.0, 1.0);\n  return distance(point, start + edge * t);\n}\n\nfn _vgsl_45d76430__cross2(a: vec2f, b: vec2f) -> f32 {\n  return a.x * b.y - a.y * b.x;\n}\n\nfn _vgsl_45d76430__triangleContains(point: vec2f, a: vec2f, b: vec2f, c: vec2f) -> bool {\n  let ab = _vgsl_45d76430__cross2(b - a, point - a);\n  let bc = _vgsl_45d76430__cross2(c - b, point - b);\n  let ca = _vgsl_45d76430__cross2(a - c, point - c);\n  return (ab >= 0.0 && bc >= 0.0 && ca >= 0.0)\n    || (ab <= 0.0 && bc <= 0.0 && ca <= 0.0);\n}\n\nfn _vgsl_45d76430__grounding(point: vec2f) -> vec2f {\n  let apex = vec2f(0.0, -0.5773502692);\n  let left = vec2f(-0.5, 0.2886751346);\n  let right = vec2f(0.5, 0.2886751346);\n  let base = _vgsl_45d76430__segmentDistance(point, left, right);\n  let baseContact = exp(-(base * base) / 0.00135);\n  let edge = min(\n    _vgsl_45d76430__segmentDistance(point, apex, left),\n    min(_vgsl_45d76430__segmentDistance(point, left, right), _vgsl_45d76430__segmentDistance(point, right, apex)),\n  );\n  let spread = select(0.014, 0.0015, _vgsl_45d76430__triangleContains(point, apex, left, right));\n  let edgeOcclusion = exp(-(edge * edge) / spread);\n  return vec2f(\n    clamp(1.0 - baseContact * 0.15, 0.0, 1.0),\n    clamp(1.0 - edgeOcclusion * 0.075 - baseContact * 0.25, 0.0, 1.0),\n  );\n}\n\nfn _vgsl_45d76430__overheadLight(uv: vec2f) -> f32 {\n  let upperLeft = exp(-dot((uv - vec2f(-0.08)) / vec2f(0.58, 0.64), (uv - vec2f(-0.08)) / vec2f(0.58, 0.64)) * 1.8) * 0.75;\n  let center = exp(-dot((uv - vec2f(0.42, 0.22)) / vec2f(0.15, 0.17), (uv - vec2f(0.42, 0.22)) / vec2f(0.15, 0.17)) * 1.8) * 0.7;\n  let right = exp(-dot((uv - vec2f(0.83, 0.3)) / vec2f(0.16, 0.18), (uv - vec2f(0.83, 0.3)) / vec2f(0.16, 0.18)) * 1.8) * 0.6;\n  return clamp(upperLeft + center + right, 0.0, 1.0);\n}\n\nfn _vgsl_45d76430__storeWallLighting(pixel: vec2u, globalLight: f32) {\n  let size = vec2f(textureDimensions(outputTexture));\n  let uv = (vec2f(pixel) + 0.5) / size;\n  let local = uv * 2.0 - 1.0;\n  let contact = _vgsl_45d76430__grounding(local);\n  let edgeDistance = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));\n  let edgeFade = smoothstep(0.0, 0.06, edgeDistance);\n  textureStore(outputTexture, pixel, vec4f(globalLight * edgeFade, contact, 1.0));\n}\n\n@compute @workgroup_size(8, 8)\nfn wall_lighting(@builtin(global_invocation_id) id: vec3u) {\n  if (!_vgsl_45d76430__inBounds(id.xy)) { return; }\n  let uv = (vec2f(id.xy) + 0.5) / vec2f(textureDimensions(outputTexture));\n  _vgsl_45d76430__storeWallLighting(id.xy, textureSampleLevel(wallMask, wallMaskSampler, uv, 0.0).r);\n}\n\n@compute @workgroup_size(8, 8)\nfn wall_lighting_fallback(@builtin(global_invocation_id) id: vec3u) {\n  if (!_vgsl_45d76430__inBounds(id.xy)) { return; }\n  let uv = (vec2f(id.xy) + 0.5) / vec2f(textureDimensions(outputTexture));\n  _vgsl_45d76430__storeWallLighting(id.xy, _vgsl_45d76430__overheadLight(uv));\n}\n\nfn _vgsl_45d76430__beamColor(wavelength: f32) -> vec3f {\n  let coordinate = clamp((wavelength - 400.0) / 300.0 * 127.0, 0.0, 127.0);\n  let lower = min(u32(floor(coordinate)), 126u);\n  return mix(_vgsl_f5e7a5d3__spectralSample(lower).rgb, _vgsl_f5e7a5d3__spectralSample(lower + 1u).rgb, fract(coordinate));\n}\n\n@compute @workgroup_size(8, 8)\nfn caustic_profile(@builtin(global_invocation_id) id: vec3u) {\n  if (!_vgsl_45d76430__inBounds(id.xy)) { return; }\n  let size = vec2f(textureDimensions(outputTexture));\n  let travel = f32(id.x) / max(size.x - 1.0, 1.0);\n  let wavelength = 700.0 - f32(id.y) / max(size.y - 1.0, 1.0) * 300.0;\n  let coarse = _vgsl_45d76430__fbm(vec2f(travel * 18.0, wavelength * 0.018), 4u);\n  let filament = 0.5 + 0.5 * sin(travel * 104.0 + wavelength * 0.071);\n  let focus = 0.72 + coarse * 0.24 + filament * 0.04;\n  let tail = 1.0 - smoothstep(0.58, 1.08, travel) * 0.44;\n  let farNeutral = smoothstep(0.2, 0.88, travel) * 0.36;\n  let spectral = _vgsl_45d76430__beamColor(wavelength);\n  let hue = spectral / max(max(spectral.r, spectral.g), max(spectral.b, 1e-5));\n  let rgb = clamp(mix(hue, vec3f(1.0), farNeutral) * focus * tail, vec3f(0.0), vec3f(1.0));\n  textureStore(outputTexture, id.xy, vec4f(rgb, focus * tail));\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/shared/spectral.wgsl\n// Generated Float32 checkpoint of `wavelengthToBeamRgb` for the fixed\n// 128-sample light mesh. Alpha retains the exact uploaded wavelength so the\n// projected caustic preserves its former interpolation and profile lookup.\nconst _vgsl_f5e7a5d3__SPECTRAL_LUT = array<vec4f, 128>(\n  vec4f(0.0009276652708649635, 0.0, 0.01045608427375555, 400.0),\n  vec4f(0.001637425273656845, 0.0, 0.012818877585232258, 402.3622131347656),\n  vec4f(0.002453181426972151, 0.0, 0.015664873644709587, 404.7243957519531),\n  vec4f(0.0033296814654022455, 0.0, 0.01908119209110737, 407.08660888671875),\n  vec4f(0.004219147376716137, 0.0, 0.023167869076132774, 409.4488220214844),\n  vec4f(0.005016450770199299, 0.0, 0.02767137996852398, 411.81103515625),\n  vec4f(0.005726693198084831, 0.0, 0.03282611444592476, 414.1732177734375),\n  vec4f(0.0063720447942614555, 0.0, 0.038834281265735626, 416.5354309082031),\n  vec4f(0.00697797816246748, 0.0, 0.045814741402864456, 418.89764404296875),\n  vec4f(0.007500954903662205, 0.0, 0.05327555537223816, 421.2598571777344),\n  vec4f(0.007993110455572605, 0.0, 0.06114164739847183, 423.6220397949219),\n  vec4f(0.008597604930400848, 0.0, 0.06995505839586258, 425.9842529296875),\n  vec4f(0.00939855445176363, 0.0, 0.07979211956262589, 428.3464660644531),\n  vec4f(0.010702796280384064, 0.0, 0.09255003929138184, 430.7086486816406),\n  vec4f(0.013043251819908619, 0.0, 0.11191345751285553, 433.07086181640625),\n  vec4f(0.016207652166485786, 0.0, 0.13458603620529175, 435.4330749511719),\n  vec4f(0.02036980912089348, 0.0, 0.16097605228424072, 437.7952880859375),\n  vec4f(0.02453680895268917, 0.0, 0.19133983552455902, 440.157470703125),\n  vec4f(0.02762519381940365, 0.0, 0.223611980676651, 442.5196838378906),\n  vec4f(0.030124200507998466, 0.0, 0.2601846754550934, 444.88189697265625),\n  vec4f(0.03208434209227562, 0.0, 0.30138635635375977, 447.24407958984375),\n  vec4f(0.03319524973630905, 0.0, 0.34751778841018677, 449.6062927246094),\n  vec4f(0.032500505447387695, 0.0, 0.39206168055534363, 451.968505859375),\n  vec4f(0.030062656849622726, 0.0, 0.43913084268569946, 454.3307189941406),\n  vec4f(0.02549462579190731, 0.0, 0.4899933636188507, 456.6929016113281),\n  vec4f(0.01816663332283497, 0.0, 0.5446479916572571, 459.05511474609375),\n  vec4f(0.007985850796103477, 0.0, 0.6007148623466492, 461.4173278808594),\n  vec4f(0.0, 0.004250565078109503, 0.6583616137504578, 463.779541015625),\n  vec4f(0.0, 0.01778329908847809, 0.7188571095466614, 466.1417236328125),\n  vec4f(0.0, 0.03469391539692879, 0.7820181250572205, 468.5039367675781),\n  vec4f(0.0, 0.056442294269800186, 0.8496572971343994, 470.86614990234375),\n  vec4f(0.0, 0.08500456809997559, 0.9234520792961121, 473.22833251953125),\n  vec4f(0.0, 0.12223964929580688, 0.9998624920845032, 475.5905456542969),\n  vec4f(0.0, 0.17022110521793365, 1.0786155462265015, 477.9527587890625),\n  vec4f(0.0, 0.23043279349803925, 1.1576675176620483, 480.3149719238281),\n  vec4f(0.0, 0.3013739287853241, 1.2265548706054688, 482.6771545410156),\n  vec4f(0.0, 0.3849429190158844, 1.2962673902511597, 485.03936767578125),\n  vec4f(0.0, 0.48050656914711, 1.3667092323303223, 487.4015808105469),\n  vec4f(0.0, 0.5868926048278809, 1.4377244710922241, 489.7637939453125),\n  vec4f(0.0, 0.6764097213745117, 1.4525021314620972, 492.1259765625),\n  vec4f(0.0, 0.7141680717468262, 1.364959478378296, 494.4881896972656),\n  vec4f(0.0, 0.7513074278831482, 1.2944350242614746, 496.85040283203125),\n  vec4f(0.0, 0.7872423529624939, 1.235427737236023, 499.21258544921875),\n  vec4f(0.0, 0.820360541343689, 1.182457685470581, 501.5747985839844),\n  vec4f(0.0, 0.8506588339805603, 1.1340235471725464, 503.93701171875),\n  vec4f(0.0, 0.8781104683876038, 1.0891823768615723, 506.2992248535156),\n  vec4f(0.0, 0.9023182392120361, 1.0468008518218994, 508.6614074707031),\n  vec4f(0.0, 0.9227785468101501, 1.0058692693710327, 511.02362060546875),\n  vec4f(0.0, 0.9395197033882141, 0.9660518169403076, 513.3858032226562),\n  vec4f(0.0, 0.9531605243682861, 0.9274855852127075, 515.748046875),\n  vec4f(0.0, 0.9640098214149475, 0.889782726764679, 518.1102294921875),\n  vec4f(0.0, 0.972785234451294, 0.8527419567108154, 520.472412109375),\n  vec4f(0.0, 0.9806240200996399, 0.8162780404090881, 522.8346557617188),\n  vec4f(0.0, 0.9864705204963684, 0.7782756686210632, 525.1968383789062),\n  vec4f(0.0, 0.9907678961753845, 0.7377868294715881, 527.55908203125),\n  vec4f(0.0, 0.9938809871673584, 0.6935604810714722, 529.9212646484375),\n  vec4f(0.0, 0.9953005313873291, 0.6437165141105652, 532.283447265625),\n  vec4f(0.0, 0.9963739514350891, 0.5885664820671082, 534.6456909179688),\n  vec4f(0.0, 0.9972034096717834, 0.5267602801322937, 537.0078735351562),\n  vec4f(0.0, 0.9978204369544983, 0.45638740062713623, 539.3700561523438),\n  vec4f(0.0, 0.9985225200653076, 0.3750465512275696, 541.7322998046875),\n  vec4f(0.0, 0.9991394281387329, 0.27924177050590515, 544.094482421875),\n  vec4f(0.0, 0.9995918869972229, 0.16423428058624268, 546.4566650390625),\n  vec4f(0.0, 0.9998977184295654, 0.023272335529327393, 548.8189086914062),\n  vec4f(0.07590825855731964, 0.9998574256896973, 0.0, 551.1810913085938),\n  vec4f(0.172451451420784, 0.999469518661499, 0.0, 553.5433349609375),\n  vec4f(0.2783505618572235, 0.9989391565322876, 0.0, 555.905517578125),\n  vec4f(0.3948717415332794, 0.9982571601867676, 0.0, 558.2677001953125),\n  vec4f(0.5234453082084656, 0.9974250197410583, 0.0, 560.6299438476562),\n  vec4f(0.6656978130340576, 0.996455729007721, 0.0, 562.9921264648438),\n  vec4f(0.8234602808952332, 0.9952938556671143, 0.0, 565.3543090820312),\n  vec4f(0.9988605976104736, 0.9939171075820923, 0.0, 567.716552734375),\n  vec4f(1.177673578262329, 0.9781429767608643, 0.0, 570.0787353515625),\n  vec4f(1.1760860681533813, 0.8224363327026367, 0.0, 572.44091796875),\n  vec4f(1.1741501092910767, 0.6952834129333496, 0.0, 574.8031616210938),\n  vec4f(1.171817421913147, 0.5896721482276917, 0.0, 577.1653442382812),\n  vec4f(1.169029712677002, 0.50070720911026, 0.0, 579.527587890625),\n  vec4f(1.1640989780426025, 0.4242915213108063, 0.0, 581.8897705078125),\n  vec4f(1.157752513885498, 0.35835379362106323, 0.0, 584.251953125),\n  vec4f(1.1501755714416504, 0.3011019229888916, 0.0, 586.6141967773438),\n  vec4f(1.1411696672439575, 0.2510553002357483, 0.0, 588.9763793945312),\n  vec4f(1.1330195665359497, 0.20752595365047455, 0.0, 591.3385620117188),\n  vec4f(1.125596284866333, 0.16939160227775574, 0.0, 593.7008056640625),\n  vec4f(1.1170347929000854, 0.13555681705474854, 0.0, 596.06298828125),\n  vec4f(1.1071977615356445, 0.10544843226671219, 0.0, 598.4251708984375),\n  vec4f(1.0955544710159302, 0.07866207510232925, 0.0, 600.7874145507812),\n  vec4f(1.081459641456604, 0.05545935034751892, 0.0, 603.1495971679688),\n  vec4f(1.0654693841934204, 0.03556278720498085, 0.0, 605.5118408203125),\n  vec4f(1.047431468963623, 0.018554607406258583, 0.0, 607.8740234375),\n  vec4f(1.0270756483078003, 0.004095226991921663, 0.0, 610.2362060546875),\n  vec4f(1.003137469291687, 0.0, 0.018001360818743706, 612.5984497070312),\n  vec4f(0.9766530394554138, 0.0, 0.0400092750787735, 614.9606323242188),\n  vec4f(0.9475923776626587, 0.0, 0.05749110132455826, 617.3228149414062),\n  vec4f(0.9159792065620422, 0.0, 0.07103116810321808, 619.68505859375),\n  vec4f(0.8794039487838745, 0.0, 0.08088549971580505, 622.0472412109375),\n  vec4f(0.8399484753608704, 0.0, 0.08758203685283661, 624.409423828125),\n  vec4f(0.7982639074325562, 0.0, 0.09153829514980316, 626.7716674804688),\n  vec4f(0.7547056078910828, 0.0, 0.09311319887638092, 629.1338500976562),\n  vec4f(0.7135004997253418, 0.0, 0.09314297139644623, 631.4960327148438),\n  vec4f(0.6734148263931274, 0.0, 0.09178439527750015, 633.8582763671875),\n  vec4f(0.6325734257698059, 0.0, 0.08902440220117569, 636.220458984375),\n  vec4f(0.5913266539573669, 0.0, 0.08510835468769073, 638.5827026367188),\n  vec4f(0.5482004880905151, 0.0, 0.08000007271766663, 640.9448852539062),\n  vec4f(0.5029013156890869, 0.0, 0.07381634414196014, 643.3070678710938),\n  vec4f(0.45871591567993164, 0.0, 0.06719779968261719, 645.6693115234375),\n  vec4f(0.41603878140449524, 0.0, 0.06035161763429642, 648.031494140625),\n  vec4f(0.3757951259613037, 0.0, 0.05354269593954086, 650.3936767578125),\n  vec4f(0.3403148949146271, 0.0, 0.04720335081219673, 652.7559204101562),\n  vec4f(0.30665019154548645, 0.0, 0.04099609702825546, 655.1181030273438),\n  vec4f(0.27495285868644714, 0.0, 0.03501851484179497, 657.4802856445312),\n  vec4f(0.2453300952911377, 0.0, 0.029347775503993034, 659.842529296875),\n  vec4f(0.21886122226715088, 0.0, 0.024153901264071465, 662.2047119140625),\n  vec4f(0.19440701603889465, 0.0, 0.01932777278125286, 664.5669555664062),\n  vec4f(0.17189663648605347, 0.0, 0.014888244681060314, 666.9291381835938),\n  vec4f(0.1513083279132843, 0.0, 0.01084998156875372, 669.2913208007812),\n  vec4f(0.1310787945985794, 0.0, 0.007133417297154665, 671.653564453125),\n  vec4f(0.11246760934591293, 0.0, 0.0038684343453496695, 674.0157470703125),\n  vec4f(0.09605303406715393, 0.0, 0.001074651489034295, 676.3779296875),\n  vec4f(0.08166374266147614, 0.0005675656720995903, 0.0, 678.7401733398438),\n  vec4f(0.06869003921747208, 0.001405493007041514, 0.0, 681.1023559570312),\n  vec4f(0.05708758533000946, 0.0020403882954269648, 0.0, 683.4645385742188),\n  vec4f(0.04721240699291229, 0.002504299860447645, 0.0, 685.8267822265625),\n  vec4f(0.03885701671242714, 0.0028238212689757347, 0.0, 688.18896484375),\n  vec4f(0.032088425010442734, 0.0030484620947390795, 0.0, 690.5512084960938),\n  vec4f(0.027107372879981995, 0.0032661701552569866, 0.0, 692.9133911132812),\n  vec4f(0.02281401865184307, 0.0034154034219682217, 0.0, 695.2755737304688),\n  vec4f(0.019129568710923195, 0.003507711226120591, 0.0, 697.6378173828125),\n  vec4f(0.015981433913111687, 0.0035538729280233383, 0.0, 700.0),\n);\n\nfn _vgsl_f5e7a5d3__spectralSample(index: u32) -> vec4f {\n  return _vgsl_f5e7a5d3__SPECTRAL_LUT[min(index, 127u)];\n}\n" };

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/downsample.wgsl
var downsample_default = { version: 1, wgsl: "@group(0) @binding(0) var sourceTexture: texture_2d<f32>;\n@group(0) @binding(1) var outputTexture: texture_storage_2d<rgba8unorm, write>;\n\n@compute @workgroup_size(8, 8)\nfn main(@builtin(global_invocation_id) id: vec3u) {\n  let outputSize = textureDimensions(outputTexture);\n  if (any(id.xy >= outputSize)) { return; }\n  let sourceSize = vec2i(textureDimensions(sourceTexture));\n  let origin = vec2i(id.xy * 2u);\n  var color = vec4f(0.0);\n  for (var y = 0; y < 2; y++) {\n    for (var x = 0; x < 2; x++) {\n      color += textureLoad(sourceTexture, min(origin + vec2i(x, y), sourceSize - 1), 0);\n    }\n  }\n  textureStore(outputTexture, id.xy, color * 0.25);\n}\n" };

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/bake.ts
init_manifest();

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/preload.ts
init_manifest();
var pendingMask;
async function fetchBlob(url) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`${response.status} ${response.statusText}`);
  return response.blob();
}
function loadPreloadedWallMask() {
  if (pendingMask) return pendingMask;
  pendingMask = fetchBlob(WALL_GLOBAL_LIGHT_MASK_URL).catch(
    (error) => {
      pendingMask = void 0;
      throw error;
    }
  );
  return pendingMask;
}

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/bake.ts
var WORKGROUP_SIZE = 8;
var WALL_MASK_SIZE = [768, 512];
async function bakeLightAssetTextures(gpu) {
  const wallMask = await loadWallMaskTexture(gpu);
  const baked = [];
  try {
    const bakeModule = gpu.gpu.createShaderModule({
      code: bake_default.wgsl,
      label: "prism.light.bake"
    });
    const downsampleModule = gpu.gpu.createShaderModule({
      code: downsample_default.wgsl,
      label: "prism.light.downsample"
    });
    const [
      wallMaterialPipeline,
      causticPipeline,
      downsamplePipeline,
      wallLightingPipeline
    ] = await Promise.all([
      createPipeline(gpu.gpu, bakeModule, "wall_material"),
      createPipeline(gpu.gpu, bakeModule, "caustic_profile"),
      createPipeline(gpu.gpu, downsampleModule, "main"),
      createPipeline(
        gpu.gpu,
        bakeModule,
        wallMask ? "wall_lighting" : "wall_lighting_fallback"
      )
    ]);
    baked.push(
      createBakedTexture(gpu, LIGHT_ASSET_MANIFEST["wall-material"]),
      createBakedTexture(gpu, LIGHT_ASSET_MANIFEST["wall-lighting"]),
      createBakedTexture(gpu, LIGHT_ASSET_MANIFEST["caustic-profile"])
    );
    const encoder = gpu.gpu.createCommandEncoder({
      label: "prism.light.bake"
    });
    encodeBase(
      gpu,
      encoder,
      wallMaterialPipeline,
      baked[0].texture
    );
    encodeBase(
      gpu,
      encoder,
      wallLightingPipeline,
      baked[1].texture,
      wallMask
    );
    encodeBase(gpu, encoder, causticPipeline, baked[2].texture);
    for (const { texture } of baked)
      encodeMipChain(gpu, encoder, downsamplePipeline, texture);
    gpu.gpu.queue.submit([encoder.finish()]);
    await gpu.gpu.queue.onSubmittedWorkDone();
    return {
      wallMaterial: baked[0].texture,
      wallLighting: baked[1].texture,
      causticProfile: baked[2].texture
    };
  } catch (error) {
    for (const { texture } of baked) texture.destroy();
    throw error;
  } finally {
    wallMask?.destroy();
  }
}
function createBakedTexture(gpu, spec) {
  return {
    texture: gpu.device.createTexture({
      size: spec.size,
      format: "rgba8unorm",
      mipLevelCount: mipLevelCount(spec.size),
      usage: ["texture_binding", "storage_binding"],
      label: `prism.light.${spec.id}`
    })
  };
}
function mipLevelCount(size) {
  return Math.floor(Math.log2(Math.max(...size))) + 1;
}
function encodeBase(gpu, encoder, pipeline, output, mask) {
  const entries = [
    {
      binding: 0,
      resource: output.gpu.createView({
        baseMipLevel: 0,
        mipLevelCount: 1
      })
    }
  ];
  if (mask) {
    entries.push(
      { binding: 1, resource: mask.view },
      {
        binding: 2,
        resource: gpu.gpu.createSampler({
          minFilter: "linear",
          magFilter: "linear"
        })
      }
    );
  }
  const pass = encoder.beginComputePass({
    label: `${output.label}.base`
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(
    0,
    gpu.gpu.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries
    })
  );
  pass.dispatchWorkgroups(
    Math.ceil(output.size[0] / WORKGROUP_SIZE),
    Math.ceil(output.size[1] / WORKGROUP_SIZE)
  );
  pass.end();
}
function encodeMipChain(gpu, encoder, pipeline, texture) {
  for (let level = 1; level < texture.mipLevelCount; level++) {
    const width = Math.max(1, texture.size[0] >> level);
    const height = Math.max(1, texture.size[1] >> level);
    const pass = encoder.beginComputePass({
      label: `${texture.label}.mip${level}`
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(
      0,
      gpu.gpu.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: texture.gpu.createView({
              baseMipLevel: level - 1,
              mipLevelCount: 1
            })
          },
          {
            binding: 1,
            resource: texture.gpu.createView({
              baseMipLevel: level,
              mipLevelCount: 1
            })
          }
        ]
      })
    );
    pass.dispatchWorkgroups(
      Math.ceil(width / WORKGROUP_SIZE),
      Math.ceil(height / WORKGROUP_SIZE)
    );
    pass.end();
  }
}
async function createPipeline(device, module, entryPoint) {
  const descriptor = {
    layout: "auto",
    compute: { module, entryPoint },
    label: `prism.light.${entryPoint}`
  };
  return device.createComputePipelineAsync ? device.createComputePipelineAsync(descriptor) : device.createComputePipeline(descriptor);
}
async function loadWallMaskTexture(gpu) {
  let bitmap;
  let texture;
  try {
    const blob = await loadPreloadedWallMask();
    if (typeof createImageBitmap === "undefined") return void 0;
    try {
      bitmap = await createImageBitmap(blob, {
        colorSpaceConversion: "none",
        premultiplyAlpha: "none"
      });
    } catch {
      bitmap = await createImageBitmap(blob);
    }
    if (bitmap.width !== WALL_MASK_SIZE[0] || bitmap.height !== WALL_MASK_SIZE[1])
      throw new Error(
        `Wall mask is ${bitmap.width}x${bitmap.height}; expected ${WALL_MASK_SIZE.join("x")}.`
      );
    texture = gpu.device.createTexture({
      size: WALL_MASK_SIZE,
      format: "rgba8unorm",
      usage: ["texture_binding", "copy_dst", "render_attachment"],
      label: "prism.light.wall-mask"
    });
    gpu.gpu.queue.copyExternalImageToTexture(
      { source: bitmap },
      { texture: texture.gpu },
      [...WALL_MASK_SIZE, 1]
    );
    return texture;
  } catch {
    texture?.destroy();
    return void 0;
  } finally {
    bitmap?.close();
  }
}

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/loader.ts
init_manifest();

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/mips.ts
function generateMipChain(base) {
  const levels = [base];
  let current = base;
  while (current.width > 1 || current.height > 1) {
    const width = Math.max(1, current.width >> 1);
    const height = Math.max(1, current.height >> 1);
    const pixels = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let channel = 0; channel < 4; channel++) {
          let sum = 0;
          for (let oy = 0; oy < 2; oy++) {
            for (let ox = 0; ox < 2; ox++) {
              const sourceX = Math.min(current.width - 1, x * 2 + ox);
              const sourceY = Math.min(current.height - 1, y * 2 + oy);
              sum += current.pixels[(sourceY * current.width + sourceX) * 4 + channel];
            }
          }
          pixels[(y * width + x) * 4 + channel] = Math.round(sum / 4);
        }
      }
    }
    current = { width, height, pixels };
    levels.push(current);
  }
  return levels;
}

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/assets/light/loader.ts
function createLightTextureLoader(options = {}) {
  return {
    async load(gpu, spec) {
      const generated = options.fallback ? await options.fallback(spec.id) : (await Promise.resolve().then(() => (init_generate(), generate_exports))).generateLightAsset(spec.id);
      const levels = generateMipChain(generated);
      return upload2(gpu, spec.id, levels);
    }
  };
}
async function loadLightAssetTextures(gpu, loader) {
  if (!loader) {
    try {
      return await bakeLightAssetTextures(gpu);
    } catch {
      return loadLightAssetTextures(gpu, createLightTextureLoader());
    }
  }
  const settled = await Promise.allSettled(
    LIGHT_ASSET_IDS.map((id) => loader.load(gpu, LIGHT_ASSET_MANIFEST[id]))
  );
  const failure = settled.find(
    (result) => result.status === "rejected"
  );
  if (failure) {
    for (const result of settled) {
      if (result.status === "fulfilled") result.value.destroy();
    }
    throw failure.reason;
  }
  const loaded = settled.map(
    (result) => result.value
  );
  return {
    wallMaterial: loaded[0],
    wallLighting: loaded[1],
    causticProfile: loaded[2]
  };
}
function upload2(gpu, id, levels) {
  const base = levels[0];
  const texture = gpu.device.createTexture({
    size: [base.width, base.height],
    format: "rgba8unorm",
    mipLevelCount: levels.length,
    usage: ["texture_binding", "copy_dst"],
    label: `prism.light.${id}`
  });
  try {
    levels.forEach((level, mipLevel) => {
      gpu.gpu.queue.writeTexture(
        { texture: texture.gpu, mipLevel },
        level.pixels,
        { bytesPerRow: level.width * 4, rowsPerImage: level.height },
        [level.width, level.height, 1]
      );
    });
  } catch (error) {
    texture.destroy();
    throw error;
  }
  return texture;
}
function destroyLightAssetTextures(textures) {
  if (!textures) return;
  textures.wallMaterial.destroy();
  textures.wallLighting.destroy();
  textures.causticProfile.destroy();
}

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/debug/sources.ts
var PRISM_DEBUG_SOURCES = [
  source("wall-material", "Wall material / albedo", "asset", "srgb"),
  source("wall-normal", "Wall normal", "view", "normal", [
    input("wall-material", "unpack GB")
  ]),
  source("wall-roughness", "Wall roughness", "view", "scalar", [
    input("wall-material", "unpack A")
  ]),
  source("global-shadow", "Ambient light blobs", "asset", "scalar"),
  source("prism-shadow", "Prism cast shadow (analytic)", "view", "scalar"),
  source("prism-ao", "Prism contact AO", "asset", "scalar"),
  source("raw-caustic", "Raw spectral caustic", "asset", "hdr"),
  source("projected-caustic", "Projected caustic", "view", "hdr", [
    input("raw-caustic", "project onto wall")
  ]),
  source("composed-wall", "Composed wall", "pass", "hdr", [
    input("wall-material", "base color"),
    input("wall-normal", "shade normal"),
    input("wall-roughness", "rough response"),
    input("global-shadow", "multiply"),
    input("prism-shadow", "draw core + penumbra"),
    input("prism-ao", "multiply diffuse"),
    input("projected-caustic", "add after AO")
  ]),
  source("backdrop-hdr", "Backdrop HDR", "target", "hdr", [
    input("composed-wall", "Pass L0")
  ]),
  source("front-glass", "Front glass", "pass", "hdr", [
    input("backdrop-hdr", "transmit / reflect")
  ]),
  source("scene-hdr", "Scene HDR", "target", "hdr", [
    input("backdrop-hdr", "copy background"),
    input("front-glass", "composite")
  ]),
  source("final-output", "Final output", "target", "srgb", [
    input("scene-hdr", "tone map + sRGB")
  ])
];
var PRISM_DARK_DEBUG_SOURCES = [
  source("dark-wall", "Dark wall", "pass", "none"),
  source("dark-backdrop-hdr", "Backdrop HDR", "target", "hdr", [
    input("dark-wall", "base wall")
  ]),
  source("dark-front-glass", "Front glass", "pass", "hdr", [
    input("dark-backdrop-hdr", "transmit / reflect")
  ]),
  source("dark-scene-hdr", "Scene HDR", "target", "hdr", [
    input("dark-backdrop-hdr", "copy background"),
    input("dark-front-glass", "composite")
  ]),
  source("dark-bloom-0", "Bloom 1/2", "target", "hdr", [
    input("dark-scene-hdr", "threshold + blur")
  ]),
  source("dark-bloom-1", "Bloom 1/4", "target", "hdr", [
    input("dark-bloom-0", "downsample + blur")
  ]),
  source("dark-bloom-2", "Bloom 1/8", "target", "hdr", [
    input("dark-bloom-1", "downsample + blur")
  ]),
  source("dark-bloom-composite", "Bloom composite", "target", "hdr", [
    input("dark-bloom-0", "near halo"),
    input("dark-bloom-1", "medium halo"),
    input("dark-bloom-2", "far halo")
  ]),
  source("dark-particle-light", "Particle light 1/16", "target", "hdr", [
    input("dark-scene-hdr", "particle illumination")
  ])
];
function input(sourceId, operation) {
  return { source: sourceId, operation };
}
function source(id, label, kind, visualization, inputs = []) {
  return { id, label, kind, inputs, visualization };
}

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/index.ts
init_state();
init_types();

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/bind.ts
init_uniforms();

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/create-graph.ts
import { draw, effect as effect2, sampler as sampler3 } from "vgpu";

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/copy-linear.wgsl
var copy_linear_default = { version: 1, wgsl: "// Raw resolved copy. The scene stays in linear HDR until presentation.\n\n@group(0) @binding(0) var sceneTexture: texture_2d<f32>;\n\n@fragment\nfn fs_main(@builtin(position) position: vec4f) -> @location(0) vec4f {\n  return textureLoad(sceneTexture, vec2i(position.xy), 0);\n}\n" };

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/glass-back.wgsl
var glass_back_default = { version: 1, wgsl: "// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/glass-back.wgsl\n// Inner/back interface of the prism.\n//\n// This is an environment-only background layer: it never reads the scene target.\n// Premultiplied Fresnel blending supplies its reflection while the previously\n// drawn wall and external light remain the transmitted component. Internal light\n// is drawn afterwards. The front interface refracts this resolved composition.\n\n \n  \n  \n  \n  \n  \n\n@group(0) @binding(0) var<uniform> params: _vgsl_102509b7__Glass;\n@group(0) @binding(1) var studioEnvironment: texture_2d<f32>;\n@group(0) @binding(2) var debugEnvironment: texture_2d<f32>;\n@group(0) @binding(3) var environmentSampler: sampler;\n\nstruct _vgsl_ac1118cf__VertexOut {\n  @builtin(position) position: vec4f,\n  @location(0) worldPosition: vec3f,\n  @location(1) worldNormal: vec3f,\n};\n\nstruct _vgsl_ac1118cf__SurfaceHit {\n  distance: f32,\n  outwardNormal: vec3f,\n};\n\nstruct _vgsl_ac1118cf__ExitPath {\n  position: vec3f,\n  direction: vec3f,\n  incidentDirection: vec3f,\n  inwardNormal: vec3f,\n  escaped: u32,\n};\n\nconst _vgsl_ac1118cf__NO_HIT: f32 = 100000.0;\nconst _vgsl_ac1118cf__SURFACE_EPSILON: f32 = 0.0002;\nconst _vgsl_ac1118cf__MAX_INTERNAL_BOUNCES: u32 = 3u;\n\nfn _vgsl_ac1118cf__sampleEnvironment(direction: vec3f) -> vec3f {\n  return _vgsl_102509b7__glassEnvironment(\n    direction,\n    params,\n    studioEnvironment,\n    debugEnvironment,\n    environmentSampler,\n    _vgsl_102509b7__glassEnvironmentLod(direction, params),\n  );\n}\n\n@vertex\nfn vs_main(@location(0) position: vec3f, @location(1) normal: vec3f) -> _vgsl_ac1118cf__VertexOut {\n  var out: _vgsl_ac1118cf__VertexOut;\n  out.position = params.viewProjection * vec4f(position, 1.0);\n  out.worldPosition = position;\n  out.worldNormal = normal;\n  return out;\n}\n\nfn _vgsl_ac1118cf__planeHitDistance(origin: vec3f, direction: vec3f, plane: vec4f) -> f32 {\n  let denominator = dot(plane.xyz, direction);\n  if (denominator <= 0.00001) { return _vgsl_ac1118cf__NO_HIT; }\n  let distance = (plane.w - dot(plane.xyz, origin)) / denominator;\n  return select(_vgsl_ac1118cf__NO_HIT, distance, distance > _vgsl_ac1118cf__SURFACE_EPSILON);\n}\n\n/** Nearest ideal prism plane reached by a ray already inside the glass. */\nfn _vgsl_ac1118cf__nextSurface(origin: vec3f, direction: vec3f) -> _vgsl_ac1118cf__SurfaceHit {\n  // Keep the old front -> back -> side comparison order for exact tie parity.\n  let frontPlane = params.prismPlanes[3];\n  let backPlane = params.prismPlanes[4];\n  var nearest = _vgsl_ac1118cf__planeHitDistance(origin, direction, frontPlane);\n  var normal = frontPlane.xyz;\n\n  let backDistance = _vgsl_ac1118cf__planeHitDistance(origin, direction, backPlane);\n  if (backDistance < nearest) {\n    nearest = backDistance;\n    normal = backPlane.xyz;\n  }\n\n  for (var index = 0u; index < 3u; index = index + 1u) {\n    let plane = params.prismPlanes[index];\n    let distance = _vgsl_ac1118cf__planeHitDistance(origin, direction, plane);\n    if (distance < nearest) {\n      nearest = distance;\n      normal = plane.xyz;\n    }\n  }\n  return _vgsl_ac1118cf__SurfaceHit(nearest, normal);\n}\n\n/**\n * Follow glass -> air transmission, continuing through real TIR bounces.\n *\n * The rasterized back face supplies the first interface normal. Subsequent hits\n * use the same five ideal planes as the outer shader and CPU tracer. Three\n * bounces are enough for this convex prism and match `PRISM_MAX_INTERNAL_BOUNCES`.\n */\nfn _vgsl_ac1118cf__traceExit(\n  firstPosition: vec3f,\n  firstDirection: vec3f,\n  firstInwardNormal: vec3f,\n) -> _vgsl_ac1118cf__ExitPath {\n  var position = firstPosition;\n  var direction = firstDirection;\n  var inwardNormal = firstInwardNormal;\n\n  for (var bounce = 0u; bounce <= _vgsl_ac1118cf__MAX_INTERNAL_BOUNCES; bounce = bounce + 1u) {\n    let transmitted = refract(direction, inwardNormal, params.ior);\n    if (length(transmitted) > 0.00001) {\n      return _vgsl_ac1118cf__ExitPath(position, normalize(transmitted), direction, inwardNormal, 1u);\n    }\n\n    direction = normalize(reflect(direction, inwardNormal));\n    let hit = _vgsl_ac1118cf__nextSurface(position + direction * _vgsl_ac1118cf__SURFACE_EPSILON, direction);\n    if (hit.distance >= 10.0) { break; }\n    position = position + direction * (hit.distance + _vgsl_ac1118cf__SURFACE_EPSILON);\n    inwardNormal = -hit.outwardNormal;\n  }\n\n  return _vgsl_ac1118cf__ExitPath(position, direction, direction, inwardNormal, 0u);\n}\n\n/**\n * An inner-face reflection remains inside the solid. Follow it to the next\n * interface (and through any subsequent TIR bounces) before using its direction\n * to sample the exterior studio environment.\n */\nfn _vgsl_ac1118cf__traceReflectedEnvironmentExit(\n  surfacePosition: vec3f,\n  incidentDirection: vec3f,\n  inwardNormal: vec3f,\n) -> _vgsl_ac1118cf__ExitPath {\n  let direction = normalize(reflect(incidentDirection, inwardNormal));\n  let shiftedPosition = surfacePosition + direction * _vgsl_ac1118cf__SURFACE_EPSILON;\n  let hit = _vgsl_ac1118cf__nextSurface(shiftedPosition, direction);\n  if (hit.distance >= 10.0) {\n    return _vgsl_ac1118cf__ExitPath(surfacePosition, direction, direction, inwardNormal, 0u);\n  }\n  let position = shiftedPosition + direction * hit.distance;\n  return _vgsl_ac1118cf__traceExit(position, direction, -hit.outwardNormal);\n}\n\n@fragment\nfn fs_main(in: _vgsl_ac1118cf__VertexOut) -> @location(0) vec4f {\n  let view = normalize(params.cameraPosition - in.worldPosition);\n  let incident = -view;\n  // Back-facing triangles expose their inward normal to the camera ray.\n  let inwardNormal = -normalize(in.worldNormal);\n  let exit = _vgsl_ac1118cf__traceExit(in.worldPosition, incident, inwardNormal);\n\n  let reflectedExit = _vgsl_ac1118cf__traceReflectedEnvironmentExit(\n    exit.position,\n    exit.incidentDirection,\n    exit.inwardNormal,\n  );\n  let reflectedFacing = clamp(\n    -dot(reflectedExit.incidentDirection, reflectedExit.inwardNormal),\n    0.0,\n    1.0,\n  );\n  let reflectedExitTransmission = select(\n    0.0,\n    1.0 - _vgsl_102509b7__dielectricFresnel(params.fresnelF0, reflectedFacing),\n    reflectedExit.escaped != 0u,\n  );\n  let reflectedEnvironment = _vgsl_ac1118cf__sampleEnvironment(reflectedExit.direction)\n    * params.reflectionStrength\n    * reflectedExitTransmission;\n  let facing = clamp(-dot(exit.incidentDirection, exit.inwardNormal), 0.0, 1.0);\n  let fresnel = _vgsl_102509b7__dielectricFresnel(params.fresnelF0, facing);\n  let reflectionWeight = select(\n    1.0,\n    fresnel,\n    exit.escaped != 0u,\n  );\n  return vec4f(reflectedEnvironment * reflectionWeight, reflectionWeight);\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/glass-common.wgsl\n// Uniform layout and optical helpers shared by the two glass interfaces.\n\n      \n     \n\nstruct _vgsl_102509b7__Glass {\n  viewProjection: mat4x4f,\n  environmentRotation: mat4x4f,\n  cameraPosition: vec3f,\n  /** Beer-Lambert absorption per scene unit, in linear RGB. */\n  absorption: vec3f,\n  /** The cross-section, wound counter-clockwise, as `types.ts` derives it. */\n  prismA: vec2f,\n  prismB: vec2f,\n  prismC: vec2f,\n  environmentSize: vec2f,\n  frontZ: f32,\n  backZ: f32,\n  ior: f32,\n  reflectionStrength: f32,\n  environmentExposure: f32,\n  environmentDebug: f32,\n  environmentTexelAngle: f32,\n  /** Schlick reflectance at normal incidence, derived from `ior` on the CPU. */\n  fresnelF0: f32,\n  /** AB, BC, CA, front and back as `(normal, offset)`. */\n  prismPlanes: array<vec4f, 5>,\n}\n\nfn _vgsl_102509b7__glassEnvironment(\n  direction: vec3f,\n  params: _vgsl_102509b7__Glass,\n  studioEnvironment: texture_2d<f32>,\n  debugEnvironment: texture_2d<f32>,\n  environmentSampler: sampler,\n  lod: f32,\n) -> vec3f {\n  let rotatedDirection = _vgsl_4d994031__rotateEnvironmentDirection(\n    direction,\n    params.environmentRotation,\n  );\n  let maxLod = f32(textureNumLevels(studioEnvironment) - 1u);\n  let safeLod = clamp(lod, 0.0, maxLod);\n  if (params.environmentDebug > 0.5) {\n    return _vgsl_64a9b351__sample_env(\n      debugEnvironment,\n      environmentSampler,\n      rotatedDirection,\n      safeLod,\n      params.environmentSize,\n    ) * params.environmentExposure;\n  }\n  return _vgsl_64a9b351__sample_env(\n    studioEnvironment,\n    environmentSampler,\n    rotatedDirection,\n    safeLod,\n    params.environmentSize,\n  ) * params.environmentExposure;\n}\n\nfn _vgsl_102509b7__glassEnvironmentLod(direction: vec3f, params: _vgsl_102509b7__Glass) -> f32 {\n  return _vgsl_64a9b351__env_lod(\n    0.0,\n    dpdx(direction),\n    dpdy(direction),\n    params.environmentTexelAngle,\n  );\n}\n\nfn _vgsl_102509b7__dielectricFresnel(f0: f32, facing: f32) -> f32 {\n  let oneMinusFacing = 1.0 - clamp(facing, 0.0, 1.0);\n  let squared = oneMinusFacing * oneMinusFacing;\n  let fifth = squared * squared * oneMinusFacing;\n  return f0 + (1.0 - f0) * fifth;\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-map-common.wgsl\nconst _vgsl_64a9b351__PI: f32 = 3.141592653589793;\n\n// Copied from the environment-map and transmission examples. Texture v=0 is\n// the zenith and v=1 the nadir, so the direction-to-texture Y convention stays\n// explicit and shared by every reflection/refraction path.\nfn _vgsl_64a9b351__equirect_uv(direction: vec3f) -> vec2f {\n  let d = normalize(direction);\n  return vec2f(\n    atan2(d.z, d.x) / (2.0 * _vgsl_64a9b351__PI) + 0.5,\n    acos(clamp(d.y, -1.0, 1.0)) / _vgsl_64a9b351__PI,\n  );\n}\n\n\n\n/** Selects the prefiltered level matching the direction's angular footprint. */\nfn _vgsl_64a9b351__env_lod(\n  cone: f32,\n  ddx: vec3f,\n  ddy: vec3f,\n  texel_angle: f32,\n) -> f32 {\n  let footprint = max(length(ddx), length(ddy));\n  return max(log2(max(cone, footprint) / texel_angle), 0.0);\n}\n\n/**\n * One texture fetch with the examples' smooth reconstruction. `size` is level\n * zero's extent and `lod` may be fractional for trilinear mip blending.\n */\nfn _vgsl_64a9b351__sample_env(\n  env: texture_2d<f32>,\n  env_samp: sampler,\n  direction: vec3f,\n  lod: f32,\n  size: vec2f,\n) -> vec3f {\n  let level_size = max(size / exp2(lod), vec2f(2.0));\n  let texel = _vgsl_64a9b351__equirect_uv(direction) * level_size - 0.5;\n  let corner = floor(texel);\n  let f = fract(texel);\n  let uv = (corner + f * f * (3.0 - 2.0 * f) + 0.5) / level_size;\n  return textureSampleLevel(env, env_samp, uv, lod).rgb;\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment.wgsl\n// The deliberately sparse studio the prism reflects.\n//\n// It started as `glass-fractal`'s nine-panel baked cubemap, but this shot only\n// needs three intentional surfaces: a dark back-left wall, a cool right key and\n// a neutral strip below the prism. Defining them here keeps the environment editable\n// in one WGSL file; `environment-bake.wgsl` rasterizes it once into the same 360\xB0 HDR\n// texture layout used by the environment-map and transmission examples.\n//\n// The final line replays the round trip the asset used to perform \u2014 encode to\n// gamma 2.2, decode as sRGB \u2014 so the values a reflection reads here are the values\n// a reflection reads there, including the small mismatch between those two curves.\n//\n// The glass has no material roughness cone, but its pixel footprint can still\n// select a prefiltered mip when a reflection compresses this map on screen.\n\n     \n\n\n\n/** A back-left wall, soft center fill and dominant right key. */\n\n\n/**\n * How much of `panel` a ray heading in `direction` sees: a rectangle projected\n * onto the sphere, feathered at its border so its edge does not alias in a\n * mirror-smooth reflection.\n */\n\n\n/** Rotates a reflection into the studio's frame. Copied from `glass-fractal`. */\nfn _vgsl_4d994031__rotateEnvironmentDirection(direction: vec3f, rotation: mat4x4f) -> vec3f {\n  return normalize((rotation * vec4f(direction, 0.0)).xyz);\n}\n\n/** Radiance arriving from `direction`, in linear RGB. */\n\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/node_modules/.pnpm/@vgpu+wgsl-std@0.3.1/node_modules/@vgpu/wgsl-std/src/color/index.wgsl\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n" };

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/glass.wgsl
var glass_default = { version: 1, wgsl: "// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/glass.wgsl\n// Outer/front interface of the prism, based on `glass-fractal`'s\n// `hero-glass-transmission.wgsl`.\n//\n// The material keeps that shader's dielectric response: one refracted scene\n// lookup, one studio reflection, Beer-Lambert absorption over the distance\n// travelled inside the solid, a thin-film tint that grows towards grazing\n// angles, and an additive HDR highlight so a bright studio panel keeps its shape\n// on a low-IOR frontal face. Geometric antialiasing belongs to the 4x MSAA target.\n//\n// Two things had to change, and both are simplifications. That example's glass is\n// a shell around a fractal, so it approximates the interior with a nested\n// tetrahedron and samples at the shell gap; this one is solid, so the refracted\n// ray is followed to the face it actually leaves through \u2014 the intersection of\n// the same three edges the CPU ray bundle refracts through, capped front and back.\n// Environment reads use the same equirectangular texture path as the repository's\n// environment-map and transmission examples.\n//\n// `sceneTexture` contains external light, the transparent back-side interface\n// and internal light. The front shader follows air -> glass only as far as the\n// first inner face and samples that resolved background there. The back-side\n// material already owns glass -> air and TIR; tracing them again here would bend\n// the same image twice.\n\n \n  \n  \n  \n  \n  \n\n/**\n * Returned instead of a distance when a plane cannot be the one a ray leaves\n * through. Large enough that `min` never picks it and the caller's `< 10.0` test\n * \u2014 the prism is under a unit across, so a real exit is always well inside that \u2014\n * reads it as a miss.\n */\nconst _vgsl_aee32450__NO_EXIT: f32 = 100000.0;\n\n@group(0) @binding(0) var<uniform> params: _vgsl_102509b7__Glass;\n@group(0) @binding(1) var sceneTexture: texture_2d<f32>;\n@group(0) @binding(2) var sceneSampler: sampler;\n@group(0) @binding(3) var studioEnvironment: texture_2d<f32>;\n@group(0) @binding(4) var debugEnvironment: texture_2d<f32>;\n@group(0) @binding(5) var environmentSampler: sampler;\n\nstruct _vgsl_aee32450__VertexOut {\n  @builtin(position) position: vec4f,\n  @location(0) worldPosition: vec3f,\n  @location(1) worldNormal: vec3f,\n};\n\nstruct _vgsl_aee32450__SurfaceHit {\n  distance: f32,\n  outwardNormal: vec3f,\n};\n\nstruct _vgsl_aee32450__InteriorHit {\n  position: vec3f,\n  distance: f32,\n  valid: u32,\n};\n\n/** The mesh is built in world coordinates, so there is no model matrix to apply. */\n@vertex\nfn vs_main(@location(0) position: vec3f, @location(1) normal: vec3f) -> _vgsl_aee32450__VertexOut {\n  var out: _vgsl_aee32450__VertexOut;\n  out.position = params.viewProjection * vec4f(position, 1.0);\n  out.worldPosition = position;\n  out.worldNormal = normal;\n  return out;\n}\n\nconst _vgsl_aee32450__SURFACE_EPSILON: f32 = 0.0002;\n\n/** Distance to one outward plane `dot(plane.xyz, p) = plane.w`, or `NO_EXIT`. */\nfn _vgsl_aee32450__planeExitDistance(origin: vec3f, direction: vec3f, plane: vec4f) -> f32 {\n  let denominator = dot(plane.xyz, direction);\n  if (denominator <= 0.00001) { return _vgsl_aee32450__NO_EXIT; }\n  let distance = (plane.w - dot(plane.xyz, origin)) / denominator;\n  return select(_vgsl_aee32450__NO_EXIT, distance, distance > 0.0001);\n}\n\n/**\n * How far a ray inside the glass travels before it leaves.\n *\n * The prism is convex, so this is the nearest of its five bounding planes: three\n * from the cross-section's edges, rotated outward by the same rule `optics.ts`\n * uses, and the two caps the extrusion added.\n */\nfn _vgsl_aee32450__nextSurface(origin: vec3f, direction: vec3f) -> _vgsl_aee32450__SurfaceHit {\n  // Keep the old front -> back -> side comparison order. At a geometric tie,\n  // strict `<` therefore selects the same surface as the previous derivation.\n  let frontPlane = params.prismPlanes[3];\n  let backPlane = params.prismPlanes[4];\n  let frontDistance = _vgsl_aee32450__planeExitDistance(origin, direction, frontPlane);\n  let backDistance = _vgsl_aee32450__planeExitDistance(origin, direction, backPlane);\n  var nearest = frontDistance;\n  var outwardNormal = frontPlane.xyz;\n  if (backDistance < nearest) {\n    nearest = backDistance;\n    outwardNormal = backPlane.xyz;\n  }\n  for (var index = 0u; index < 3u; index = index + 1u) {\n    let plane = params.prismPlanes[index];\n    let distance = _vgsl_aee32450__planeExitDistance(origin, direction, plane);\n    if (distance < nearest) {\n      nearest = distance;\n      outwardNormal = plane.xyz;\n    }\n  }\n  return _vgsl_aee32450__SurfaceHit(nearest, outwardNormal);\n}\n\nfn _vgsl_aee32450__traceInteriorHit(\n  entryPosition: vec3f,\n  insideDirection: vec3f,\n) -> _vgsl_aee32450__InteriorHit {\n  let shiftedPosition = entryPosition + insideDirection * _vgsl_aee32450__SURFACE_EPSILON;\n  let hit = _vgsl_aee32450__nextSurface(shiftedPosition, insideDirection);\n  let valid = hit.distance < 10.0;\n  let distance = select(0.0, hit.distance, valid);\n  return _vgsl_aee32450__InteriorHit(\n    shiftedPosition + insideDirection * distance,\n    distance,\n    select(0u, 1u, valid),\n  );\n}\n\nfn _vgsl_aee32450__sampleEnvironment(direction: vec3f) -> vec3f {\n  return _vgsl_102509b7__glassEnvironment(\n    direction,\n    params,\n    studioEnvironment,\n    debugEnvironment,\n    environmentSampler,\n    _vgsl_102509b7__glassEnvironmentLod(direction, params),\n  );\n}\n\nfn _vgsl_aee32450__projectToUv(point: vec3f) -> vec2f {\n  let clip = params.viewProjection * vec4f(point, 1.0);\n  let ndc = clip.xy / max(clip.w, 0.00001);\n  return vec2f(ndc.x * 0.5 + 0.5, 0.5 - ndc.y * 0.5);\n}\n\nfn _vgsl_aee32450__sampleBackground(uv: vec2f) -> vec3f {\n  let resolution = max(vec2f(textureDimensions(sceneTexture)), vec2f(1.0));\n  let halfTexel = 0.5 / resolution;\n  let safeUv = clamp(uv, halfTexel, vec2f(1.0) - halfTexel);\n  return textureSampleLevel(sceneTexture, sceneSampler, safeUv, 0.0).rgb;\n}\n\n@fragment\nfn fs_main(in: _vgsl_aee32450__VertexOut) -> @location(0) vec4f {\n  let normal = normalize(in.worldNormal);\n  let view = normalize(params.cameraPosition - in.worldPosition);\n  let incident = -view;\n  let facing = clamp(dot(view, normal), 0.0, 1.0);\n  let reflectedEnvironment = _vgsl_aee32450__sampleEnvironment(reflect(incident, normal));\n  let fresnel = _vgsl_102509b7__dielectricFresnel(params.fresnelF0, facing);\n  let insideDirection = normalize(refract(incident, normal, 1.0 / params.ior));\n  let interiorHit = _vgsl_aee32450__traceInteriorHit(\n    in.worldPosition,\n    insideDirection,\n  );\n  let resolution = max(vec2f(textureDimensions(sceneTexture)), vec2f(1.0));\n  let originalUv = in.position.xy / resolution;\n  let refractedUv = select(\n    originalUv,\n    _vgsl_aee32450__projectToUv(interiorHit.position),\n    interiorHit.valid != 0u,\n  );\n  let background = _vgsl_aee32450__sampleBackground(refractedUv);\n  let transmittance = exp(-params.absorption * interiorHit.distance);\n  let transmitted = select(\n    vec3f(0.0),\n    background * transmittance,\n    interiorHit.valid != 0u,\n  );\n  let reflected = reflectedEnvironment * params.reflectionStrength;\n  let grazingWeight = pow(1.0 - facing, 1.5);\n\n  // Bright studio panels need a visible footprint even on a low-IOR frontal\n  // face. Reuse the environment sample to isolate them; the darker room stays\n  // governed by physical Fresnel.\n  let environmentLuminance = dot(reflectedEnvironment, vec3f(0.2126, 0.7152, 0.0722));\n  let studioPanelMask = smoothstep(0.5, 0.82, environmentLuminance);\n  let physicalGlass = transmitted * (1.0 - fresnel) + reflected * fresnel;\n\n  // An energy-conserving mix alone can make a white panel disappear when the\n  // transmitted scene is also bright. Add the isolated panel in linear HDR so\n  // its radiance survives until the final ACES pass, without another environment\n  // sample or making the whole shell opaque.\n  let studioPanelStrength = studioPanelMask\n    * clamp(params.reflectionStrength * 0.4, 0.0, 0.7)\n    * (0.65 + 0.35 * grazingWeight);\n  let studioPanelHighlight = max(reflected * studioPanelStrength, vec3f(0.0));\n  let finalGlass = max(physicalGlass, vec3f(0.0)) + studioPanelHighlight;\n  return vec4f(finalGlass, 1.0);\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/glass-common.wgsl\n// Uniform layout and optical helpers shared by the two glass interfaces.\n\n      \n     \n\nstruct _vgsl_102509b7__Glass {\n  viewProjection: mat4x4f,\n  environmentRotation: mat4x4f,\n  cameraPosition: vec3f,\n  /** Beer-Lambert absorption per scene unit, in linear RGB. */\n  absorption: vec3f,\n  /** The cross-section, wound counter-clockwise, as `types.ts` derives it. */\n  prismA: vec2f,\n  prismB: vec2f,\n  prismC: vec2f,\n  environmentSize: vec2f,\n  frontZ: f32,\n  backZ: f32,\n  ior: f32,\n  reflectionStrength: f32,\n  environmentExposure: f32,\n  environmentDebug: f32,\n  environmentTexelAngle: f32,\n  /** Schlick reflectance at normal incidence, derived from `ior` on the CPU. */\n  fresnelF0: f32,\n  /** AB, BC, CA, front and back as `(normal, offset)`. */\n  prismPlanes: array<vec4f, 5>,\n}\n\nfn _vgsl_102509b7__glassEnvironment(\n  direction: vec3f,\n  params: _vgsl_102509b7__Glass,\n  studioEnvironment: texture_2d<f32>,\n  debugEnvironment: texture_2d<f32>,\n  environmentSampler: sampler,\n  lod: f32,\n) -> vec3f {\n  let rotatedDirection = _vgsl_4d994031__rotateEnvironmentDirection(\n    direction,\n    params.environmentRotation,\n  );\n  let maxLod = f32(textureNumLevels(studioEnvironment) - 1u);\n  let safeLod = clamp(lod, 0.0, maxLod);\n  if (params.environmentDebug > 0.5) {\n    return _vgsl_64a9b351__sample_env(\n      debugEnvironment,\n      environmentSampler,\n      rotatedDirection,\n      safeLod,\n      params.environmentSize,\n    ) * params.environmentExposure;\n  }\n  return _vgsl_64a9b351__sample_env(\n    studioEnvironment,\n    environmentSampler,\n    rotatedDirection,\n    safeLod,\n    params.environmentSize,\n  ) * params.environmentExposure;\n}\n\nfn _vgsl_102509b7__glassEnvironmentLod(direction: vec3f, params: _vgsl_102509b7__Glass) -> f32 {\n  return _vgsl_64a9b351__env_lod(\n    0.0,\n    dpdx(direction),\n    dpdy(direction),\n    params.environmentTexelAngle,\n  );\n}\n\nfn _vgsl_102509b7__dielectricFresnel(f0: f32, facing: f32) -> f32 {\n  let oneMinusFacing = 1.0 - clamp(facing, 0.0, 1.0);\n  let squared = oneMinusFacing * oneMinusFacing;\n  let fifth = squared * squared * oneMinusFacing;\n  return f0 + (1.0 - f0) * fifth;\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-map-common.wgsl\nconst _vgsl_64a9b351__PI: f32 = 3.141592653589793;\n\n// Copied from the environment-map and transmission examples. Texture v=0 is\n// the zenith and v=1 the nadir, so the direction-to-texture Y convention stays\n// explicit and shared by every reflection/refraction path.\nfn _vgsl_64a9b351__equirect_uv(direction: vec3f) -> vec2f {\n  let d = normalize(direction);\n  return vec2f(\n    atan2(d.z, d.x) / (2.0 * _vgsl_64a9b351__PI) + 0.5,\n    acos(clamp(d.y, -1.0, 1.0)) / _vgsl_64a9b351__PI,\n  );\n}\n\n\n\n/** Selects the prefiltered level matching the direction's angular footprint. */\nfn _vgsl_64a9b351__env_lod(\n  cone: f32,\n  ddx: vec3f,\n  ddy: vec3f,\n  texel_angle: f32,\n) -> f32 {\n  let footprint = max(length(ddx), length(ddy));\n  return max(log2(max(cone, footprint) / texel_angle), 0.0);\n}\n\n/**\n * One texture fetch with the examples' smooth reconstruction. `size` is level\n * zero's extent and `lod` may be fractional for trilinear mip blending.\n */\nfn _vgsl_64a9b351__sample_env(\n  env: texture_2d<f32>,\n  env_samp: sampler,\n  direction: vec3f,\n  lod: f32,\n  size: vec2f,\n) -> vec3f {\n  let level_size = max(size / exp2(lod), vec2f(2.0));\n  let texel = _vgsl_64a9b351__equirect_uv(direction) * level_size - 0.5;\n  let corner = floor(texel);\n  let f = fract(texel);\n  let uv = (corner + f * f * (3.0 - 2.0 * f) + 0.5) / level_size;\n  return textureSampleLevel(env, env_samp, uv, lod).rgb;\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment.wgsl\n// The deliberately sparse studio the prism reflects.\n//\n// It started as `glass-fractal`'s nine-panel baked cubemap, but this shot only\n// needs three intentional surfaces: a dark back-left wall, a cool right key and\n// a neutral strip below the prism. Defining them here keeps the environment editable\n// in one WGSL file; `environment-bake.wgsl` rasterizes it once into the same 360\xB0 HDR\n// texture layout used by the environment-map and transmission examples.\n//\n// The final line replays the round trip the asset used to perform \u2014 encode to\n// gamma 2.2, decode as sRGB \u2014 so the values a reflection reads here are the values\n// a reflection reads there, including the small mismatch between those two curves.\n//\n// The glass has no material roughness cone, but its pixel footprint can still\n// select a prefiltered mip when a reflection compresses this map on screen.\n\n     \n\n\n\n/** A back-left wall, soft center fill and dominant right key. */\n\n\n/**\n * How much of `panel` a ray heading in `direction` sees: a rectangle projected\n * onto the sphere, feathered at its border so its edge does not alias in a\n * mirror-smooth reflection.\n */\n\n\n/** Rotates a reflection into the studio's frame. Copied from `glass-fractal`. */\nfn _vgsl_4d994031__rotateEnvironmentDirection(direction: vec3f, rotation: mat4x4f) -> vec3f {\n  return normalize((rotation * vec4f(direction, 0.0)).xyz);\n}\n\n/** Radiance arriving from `direction`, in linear RGB. */\n\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/node_modules/.pnpm/@vgpu+wgsl-std@0.3.1/node_modules/@vgpu/wgsl-std/src/color/index.wgsl\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n" };

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/light-wireframe.wgsl
var light_wireframe_default = { version: 1, wgsl: "// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/light-wireframe.wgsl\n// Triangle topology of the generated light sheet. Every six vertices are one\n// quad split into two triangles, so the diagonal is intentionally visible.\n\n     \n\n@group(0) @binding(0) var<uniform> scene: _vgsl_2e4e59c8__Scene;\n\nstruct _vgsl_25b1a539__VertexOut {\n  @builtin(position) position: vec4f,\n  @location(0) barycentric: vec3f,\n  @location(1) @interpolate(flat, either) quadIndex: u32,\n};\n\n@vertex\nfn vs_main(\n  @builtin(vertex_index) index: u32,\n  @location(0) position: vec2f,\n) -> _vgsl_25b1a539__VertexOut {\n  var corners = array<vec3f, 3>(\n    vec3f(1.0, 0.0, 0.0),\n    vec3f(0.0, 1.0, 0.0),\n    vec3f(0.0, 0.0, 1.0),\n  );\n  var out: _vgsl_25b1a539__VertexOut;\n  out.position = scene.viewProjection * vec4f(position, scene.lightPlaneZ, 1.0);\n  out.barycentric = corners[index % 3u];\n  out.quadIndex = index / 6u;\n  return out;\n}\n\n@fragment\nfn fs_main(in: _vgsl_25b1a539__VertexOut) -> @location(0) vec4f {\n  if in.quadIndex >= scene.lightWhiteQuads {\n    let spectralQuad = in.quadIndex - scene.lightWhiteQuads;\n    if spectralQuad < scene.lightInternalQuads {\n      let ray = spectralQuad / scene.lightInternalSegments;\n      let wavelength = ray / scene.lightBeamSlices;\n      let profile = ray % scene.lightBeamSlices;\n      // The full 128 x 24 internal grid is denser than a pixel.\n      if wavelength % 8u != 0u || profile % 6u != 0u {\n        discard;\n      }\n    } else {\n      let outgoingCell = spectralQuad - scene.lightInternalQuads;\n      let interval = outgoingCell / scene.lightBeamSlices;\n      let profile = outgoingCell % scene.lightBeamSlices;\n      if interval % 8u != 0u || profile % 6u != 0u {\n        discard;\n      }\n    }\n  }\n  let closest = min(in.barycentric.x, min(in.barycentric.y, in.barycentric.z));\n  let pixel = max(fwidth(closest), 1e-5);\n  let line = 1.0 - smoothstep(pixel * 0.7, pixel * 1.7, closest);\n  let alpha = line * 0.72;\n  return vec4f(vec3f(0.08, 0.42, 0.46) * alpha, alpha);\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/scene.wgsl\n// Uniforms shared by the wall and deterministic light-ribbon passes.\n\nstruct _vgsl_2e4e59c8__Scene {\n  viewProjection: mat4x4f,\n  wallHalfExtent: vec2f,\n  /** XY direction in which the white beam travels toward the prism. */\n  inputBeamDirection: vec2f,\n  /** User-selected sRGB wall color; the wall pass linearizes it before lighting. */\n  wallColor: vec3f,\n  /** 1 shows only the generated light over black. */\n  causticOnly: u32,\n  /** World-space depth of the emissive sheet between the glass interfaces. */\n  lightPlaneZ: f32,\n  /** Fixed layout metadata used to decimate the debug wireframe. */\n  lightWhiteQuads: u32,\n  lightBeamSlices: u32,\n  lightInternalQuads: u32,\n  lightInternalSegments: u32,\n  /** User-controlled lateral and outgoing-distance falloff strengths. */\n  lightOpacity: f32,\n  lightEdgeFalloff: f32,\n  rainbowFalloffRate: f32,\n  rainbowFalloffPower: f32,\n  /** Initial reveal aperture shared by white, internal, and spectral beams. */\n  beamWidthReveal: f32,\n}\n\n/** Maps top-origin texture coordinates to the wall plane in world space. */\n\n" };

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/create-graph.ts
init_caustic();

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/glass-accent.wgsl
var glass_accent_default = { version: 1, wgsl: "// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/glass-accent.wgsl\n// Light-theme-only reflected layer. The shared physical glass stays untouched;\n// this pass restores the broad neutral bands and bevel highlights that disappear\n// when that transparent material is viewed against an almost-white wall.\n\n \n  \n  \n  \n  \n  \n\nstruct _vgsl_cf570a86__GlassAccent {\n  bandCenter: f32,\n  bandWidth: f32,\n  bandStrength: f32,\n  baseReflection: f32,\n  rimStrength: f32,\n  baseRimStrength: f32,\n  environmentLodBias: f32,\n  highlightStrength: f32,\n}\n\n@group(0) @binding(0) var<uniform> params: _vgsl_102509b7__Glass;\n@group(0) @binding(1) var<uniform> accent: _vgsl_cf570a86__GlassAccent;\n@group(0) @binding(2) var studioEnvironment: texture_2d<f32>;\n@group(0) @binding(3) var debugEnvironment: texture_2d<f32>;\n@group(0) @binding(4) var environmentSampler: sampler;\n\nstruct _vgsl_cf570a86__VertexOut {\n  @builtin(position) position: vec4f,\n  @location(0) worldPosition: vec3f,\n  @location(1) worldNormal: vec3f,\n}\n\n@vertex\nfn vs_main(@location(0) position: vec3f, @location(1) normal: vec3f) -> _vgsl_cf570a86__VertexOut {\n  var out: _vgsl_cf570a86__VertexOut;\n  out.position = params.viewProjection * vec4f(position, 1.0);\n  out.worldPosition = position;\n  out.worldNormal = normal;\n  return out;\n}\n\nfn _vgsl_cf570a86__lineDistance(point: vec2f, start: vec2f, end: vec2f) -> f32 {\n  let edge = end - start;\n  let crossDistance = abs(\n    edge.x * (point.y - start.y) - edge.y * (point.x - start.x)\n  );\n  return crossDistance / max(length(edge), 0.0001);\n}\n\nfn _vgsl_cf570a86__band(distance: f32, center: f32, width: f32) -> f32 {\n  let coordinate = (distance - center) / max(width, 0.0001);\n  return exp(-coordinate * coordinate);\n}\n\nfn _vgsl_cf570a86__rim(distance: f32, width: f32) -> f32 {\n  return 1.0 - smoothstep(width * 0.35, width, distance);\n}\n\n@fragment\nfn fs_main(in: _vgsl_cf570a86__VertexOut) -> @location(0) vec4f {\n  let normal = normalize(in.worldNormal);\n  let view = normalize(params.cameraPosition - in.worldPosition);\n  let incident = -view;\n  let reflectedDirection = reflect(incident, normal);\n  let reflected = _vgsl_102509b7__glassEnvironment(\n    reflectedDirection,\n    params,\n    studioEnvironment,\n    debugEnvironment,\n    environmentSampler,\n    _vgsl_102509b7__glassEnvironmentLod(reflectedDirection, params) + accent.environmentLodBias,\n  );\n\n  let leftDistance = _vgsl_cf570a86__lineDistance(in.worldPosition.xy, params.prismA, params.prismB);\n  let rightDistance = _vgsl_cf570a86__lineDistance(in.worldPosition.xy, params.prismA, params.prismC);\n  let baseDistance = _vgsl_cf570a86__lineDistance(in.worldPosition.xy, params.prismB, params.prismC);\n  let leftBand = _vgsl_cf570a86__band(leftDistance, accent.bandCenter, accent.bandWidth);\n  let rightBand = _vgsl_cf570a86__band(rightDistance, accent.bandCenter, accent.bandWidth);\n  let lowerBand = _vgsl_cf570a86__band(baseDistance, accent.bandCenter, accent.bandWidth);\n  // The studio key is on the right: the left internal return is broadest and\n  // darkest, while the base is dominated by its warm reflected rim.\n  let innerBand = max(leftBand, max(rightBand * 0.68, lowerBand * 0.38));\n  let frontRim = max(\n    _vgsl_cf570a86__rim(leftDistance, accent.bandWidth * 0.55),\n    max(\n      _vgsl_cf570a86__rim(rightDistance, accent.bandWidth * 0.55),\n      _vgsl_cf570a86__rim(baseDistance, accent.bandWidth * 0.55),\n    ),\n  );\n  let baseRim = _vgsl_cf570a86__band(baseDistance, 0.0, accent.bandWidth * 0.7);\n\n  let facing = clamp(dot(view, normal), 0.0, 1.0);\n  let fresnel = _vgsl_102509b7__dielectricFresnel(params.fresnelF0, facing);\n  let bevel = pow(clamp(1.0 - abs(normal.z), 0.0, 1.0), 2.2);\n  let coverage = clamp(\n    accent.baseReflection\n      + innerBand * accent.bandStrength\n      + bevel * (0.18 + fresnel * 0.48),\n    0.0,\n    0.56,\n  );\n\n  let reflectedLuminance = dot(reflected, vec3f(0.2126, 0.7152, 0.0722));\n  let panel = smoothstep(0.08, 0.72, reflectedLuminance);\n  let neutralBand = vec3f(0.052, 0.057, 0.066);\n  let reflectedTone = max(reflected * accent.highlightStrength, vec3f(0.0));\n  let tone = mix(neutralBand, reflectedTone, panel);\n  let neutralRim = vec3f(0.92, 0.95, 1.0)\n    * (bevel + frontRim * 0.72)\n    * accent.rimStrength;\n  let warmBaseRim = vec3f(1.0, 0.91, 0.78) * baseRim * accent.baseRimStrength;\n\n  return vec4f(tone * coverage + neutralRim + warmBaseRim, coverage);\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/glass-common.wgsl\n// Uniform layout and optical helpers shared by the two glass interfaces.\n\n      \n     \n\nstruct _vgsl_102509b7__Glass {\n  viewProjection: mat4x4f,\n  environmentRotation: mat4x4f,\n  cameraPosition: vec3f,\n  /** Beer-Lambert absorption per scene unit, in linear RGB. */\n  absorption: vec3f,\n  /** The cross-section, wound counter-clockwise, as `types.ts` derives it. */\n  prismA: vec2f,\n  prismB: vec2f,\n  prismC: vec2f,\n  environmentSize: vec2f,\n  frontZ: f32,\n  backZ: f32,\n  ior: f32,\n  reflectionStrength: f32,\n  environmentExposure: f32,\n  environmentDebug: f32,\n  environmentTexelAngle: f32,\n  /** Schlick reflectance at normal incidence, derived from `ior` on the CPU. */\n  fresnelF0: f32,\n  /** AB, BC, CA, front and back as `(normal, offset)`. */\n  prismPlanes: array<vec4f, 5>,\n}\n\nfn _vgsl_102509b7__glassEnvironment(\n  direction: vec3f,\n  params: _vgsl_102509b7__Glass,\n  studioEnvironment: texture_2d<f32>,\n  debugEnvironment: texture_2d<f32>,\n  environmentSampler: sampler,\n  lod: f32,\n) -> vec3f {\n  let rotatedDirection = _vgsl_4d994031__rotateEnvironmentDirection(\n    direction,\n    params.environmentRotation,\n  );\n  let maxLod = f32(textureNumLevels(studioEnvironment) - 1u);\n  let safeLod = clamp(lod, 0.0, maxLod);\n  if (params.environmentDebug > 0.5) {\n    return _vgsl_64a9b351__sample_env(\n      debugEnvironment,\n      environmentSampler,\n      rotatedDirection,\n      safeLod,\n      params.environmentSize,\n    ) * params.environmentExposure;\n  }\n  return _vgsl_64a9b351__sample_env(\n    studioEnvironment,\n    environmentSampler,\n    rotatedDirection,\n    safeLod,\n    params.environmentSize,\n  ) * params.environmentExposure;\n}\n\nfn _vgsl_102509b7__glassEnvironmentLod(direction: vec3f, params: _vgsl_102509b7__Glass) -> f32 {\n  return _vgsl_64a9b351__env_lod(\n    0.0,\n    dpdx(direction),\n    dpdy(direction),\n    params.environmentTexelAngle,\n  );\n}\n\nfn _vgsl_102509b7__dielectricFresnel(f0: f32, facing: f32) -> f32 {\n  let oneMinusFacing = 1.0 - clamp(facing, 0.0, 1.0);\n  let squared = oneMinusFacing * oneMinusFacing;\n  let fifth = squared * squared * oneMinusFacing;\n  return f0 + (1.0 - f0) * fifth;\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment-map-common.wgsl\nconst _vgsl_64a9b351__PI: f32 = 3.141592653589793;\n\n// Copied from the environment-map and transmission examples. Texture v=0 is\n// the zenith and v=1 the nadir, so the direction-to-texture Y convention stays\n// explicit and shared by every reflection/refraction path.\nfn _vgsl_64a9b351__equirect_uv(direction: vec3f) -> vec2f {\n  let d = normalize(direction);\n  return vec2f(\n    atan2(d.z, d.x) / (2.0 * _vgsl_64a9b351__PI) + 0.5,\n    acos(clamp(d.y, -1.0, 1.0)) / _vgsl_64a9b351__PI,\n  );\n}\n\n\n\n/** Selects the prefiltered level matching the direction's angular footprint. */\nfn _vgsl_64a9b351__env_lod(\n  cone: f32,\n  ddx: vec3f,\n  ddy: vec3f,\n  texel_angle: f32,\n) -> f32 {\n  let footprint = max(length(ddx), length(ddy));\n  return max(log2(max(cone, footprint) / texel_angle), 0.0);\n}\n\n/**\n * One texture fetch with the examples' smooth reconstruction. `size` is level\n * zero's extent and `lod` may be fractional for trilinear mip blending.\n */\nfn _vgsl_64a9b351__sample_env(\n  env: texture_2d<f32>,\n  env_samp: sampler,\n  direction: vec3f,\n  lod: f32,\n  size: vec2f,\n) -> vec3f {\n  let level_size = max(size / exp2(lod), vec2f(2.0));\n  let texel = _vgsl_64a9b351__equirect_uv(direction) * level_size - 0.5;\n  let corner = floor(texel);\n  let f = fract(texel);\n  let uv = (corner + f * f * (3.0 - 2.0 * f) + 0.5) / level_size;\n  return textureSampleLevel(env, env_samp, uv, lod).rgb;\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/environment.wgsl\n// The deliberately sparse studio the prism reflects.\n//\n// It started as `glass-fractal`'s nine-panel baked cubemap, but this shot only\n// needs three intentional surfaces: a dark back-left wall, a cool right key and\n// a neutral strip below the prism. Defining them here keeps the environment editable\n// in one WGSL file; `environment-bake.wgsl` rasterizes it once into the same 360\xB0 HDR\n// texture layout used by the environment-map and transmission examples.\n//\n// The final line replays the round trip the asset used to perform \u2014 encode to\n// gamma 2.2, decode as sRGB \u2014 so the values a reflection reads here are the values\n// a reflection reads there, including the small mismatch between those two curves.\n//\n// The glass has no material roughness cone, but its pixel footprint can still\n// select a prefiltered mip when a reflection compresses this map on screen.\n\n     \n\n\n\n/** A back-left wall, soft center fill and dominant right key. */\n\n\n/**\n * How much of `panel` a ray heading in `direction` sees: a rectangle projected\n * onto the sphere, feathered at its border so its edge does not alias in a\n * mirror-smooth reflection.\n */\n\n\n/** Rotates a reflection into the studio's frame. Copied from `glass-fractal`. */\nfn _vgsl_4d994031__rotateEnvironmentDirection(direction: vec3f, rotation: mat4x4f) -> vec3f {\n  return normalize((rotation * vec4f(direction, 0.0)).xyz);\n}\n\n/** Radiance arriving from `direction`, in linear RGB. */\n\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/node_modules/.pnpm/@vgpu+wgsl-std@0.3.1/node_modules/@vgpu/wgsl-std/src/color/index.wgsl\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n" };

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/present.wgsl
var present_default = { version: 1, wgsl: "// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/present.wgsl\n@group(0) @binding(0) var sceneTexture: texture_2d<f32>;\n\nstruct _vgsl_f94bd7ef__PresentParams {\n  backgroundColor: vec3f,\n  exposure: f32,\n  revealProgress: f32,\n  toneMapping: u32,\n}\n\n@group(0) @binding(1) var<uniform> params: _vgsl_f94bd7ef__PresentParams;\n\n@fragment\nfn fs_main(@builtin(position) position: vec4f) -> @location(0) vec4f {\n  let scene = textureLoad(sceneTexture, vec2i(position.xy), 0).rgb\n    * max(params.exposure, 0.0);\n  let presented = _vgsl_9fe494be__linearToSrgb3(\n    _vgsl_0669a8c0__applyPrismToneMapping(scene, params.toneMapping),\n  );\n  let reveal = clamp(params.revealProgress, 0.0, 1.0);\n  if (reveal >= 1.0) { return vec4f(presented, 1.0); }\n  return vec4f(mix(params.backgroundColor, presented, reveal), 1.0);\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/node_modules/.pnpm/@vgpu+wgsl-std@0.3.1/node_modules/@vgpu/wgsl-std/src/color/index.wgsl\nfn _vgsl_9fe494be__luminance(value: vec3f) -> f32 {\n  return dot(value, vec3f(0.2126, 0.7152, 0.0722));\n}\n\n\n\n\n\n\n\n\n\nfn _vgsl_9fe494be__linearToSrgb(value: f32) -> f32 {\n  if (value <= 0.0031308) {\n    return value * 12.92;\n  }\n  return 1.055 * pow(value, 1.0 / 2.4) - 0.055;\n}\n\nfn _vgsl_9fe494be__linearToSrgb3(value: vec3f) -> vec3f {\n  return vec3f(_vgsl_9fe494be__linearToSrgb(value.r), _vgsl_9fe494be__linearToSrgb(value.g), _vgsl_9fe494be__linearToSrgb(value.b));\n}\n\n\n\nfn _vgsl_9fe494be__tonemapAces(value: vec3f) -> vec3f {\n  let a = 2.51;\n  let b = 0.03;\n  let c = 2.43;\n  let d = 0.59;\n  let e = 0.14;\n  return clamp((value * (a * value + b)) / (value * (c * value + d) + e), vec3f(0.0), vec3f(1.0));\n}\n\nfn _vgsl_9fe494be__tonemapReinhard(value: vec3f) -> vec3f {\n  return value / (1.0 + _vgsl_9fe494be__luminance(value));\n}\n\n\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/shared/tone-mapping.wgsl\nfn _vgsl_0669a8c0__tonemapNeutral(value: vec3f) -> vec3f {\n  var color = max(value, vec3f(0.0));\n  let startCompression = 0.76;\n  let desaturation = 0.15;\n  let lowest = min(color.r, min(color.g, color.b));\n  let offset = select(0.04, lowest - 6.25 * lowest * lowest, lowest < 0.08);\n  color -= vec3f(offset);\n\n  let peak = max(color.r, max(color.g, color.b));\n  if (peak < startCompression) {\n    return color;\n  }\n\n  let distance = 1.0 - startCompression;\n  let compressedPeak = 1.0 - distance * distance /\n    (peak + distance - startCompression);\n  color *= compressedPeak / max(peak, 0.0001);\n  let amount = 1.0 - 1.0 /\n    (desaturation * (peak - compressedPeak) + 1.0);\n  return mix(color, vec3f(compressedPeak), amount);\n}\n\nfn _vgsl_0669a8c0__applyPrismToneMapping(value: vec3f, mode: u32) -> vec3f {\n  let color = max(value, vec3f(0.0));\n  if (mode == 1u) {\n    return clamp(_vgsl_0669a8c0__tonemapNeutral(color), vec3f(0.0), vec3f(1.0));\n  }\n  if (mode == 2u) {\n    return clamp(_vgsl_9fe494be__tonemapReinhard(color), vec3f(0.0), vec3f(1.0));\n  }\n  if (mode == 3u) {\n    return clamp(color, vec3f(0.0), vec3f(1.0));\n  }\n  return _vgsl_9fe494be__tonemapAces(color);\n}\n" };

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/create-graph.ts
init_shadow();

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/wall.wgsl
var wall_default = { version: 1, wgsl: "// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/wall.wgsl\n@group(0) @binding(0) var<uniform> params: _vgsl_3d5b6794__LightWall;\n@group(0) @binding(1) var wallMaterial: texture_2d<f32>;\n@group(0) @binding(2) var wallLighting: texture_2d<f32>;\n@group(0) @binding(3) var materialSampler: sampler;\n\nstruct _vgsl_fe6c4daf__VertexOut {\n  @builtin(position) position: vec4f,\n  @location(0) uv: vec2f,\n  @location(1) worldPosition: vec2f,\n};\n\n@vertex\nfn vs_main(@builtin(vertex_index) index: u32) -> _vgsl_fe6c4daf__VertexOut {\n  let corners = array<vec2f, 6>(\n    vec2f(0.0, 1.0), vec2f(1.0, 1.0), vec2f(1.0, 0.0),\n    vec2f(0.0, 1.0), vec2f(1.0, 0.0), vec2f(0.0, 0.0),\n  );\n  let uv = corners[index];\n  let worldPosition = _vgsl_3d5b6794__wallPoint(params, uv);\n  var out: _vgsl_fe6c4daf__VertexOut;\n  out.position = params.viewProjection * vec4f(worldPosition, 0.0, 1.0);\n  out.uv = uv;\n  out.worldPosition = worldPosition;\n  return out;\n}\n\n@fragment\nfn fs_main(in: _vgsl_fe6c4daf__VertexOut) -> @location(0) vec4f {\n  let wall = _vgsl_3d5b6794__evaluateWall(\n    in.worldPosition,\n    in.uv,\n    params,\n    wallMaterial,\n    wallLighting,\n    materialSampler,\n  );\n  return vec4f(max(wall.composed, vec3f(0.0)), 1.0);\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/wall-common.wgsl\nconst _vgsl_3d5b6794__GLOBAL_LIGHT_MASK_ASPECT = 1.5;\n// The art-directed PNG is stored in an unorm KTX channel. Decode its visual\n// (sRGB-like) luminance before using it as incident light in the linear HDR\n// composition. This restores the authored separation between soft shadows.\nstruct _vgsl_3d5b6794__LightWall {\n  viewProjection: mat4x4f,\n  wallHalfExtent: vec2f,\n  wallColor: vec3f,\n  prismCenter: vec2f,\n  lightDirection: vec3f,\n  materialWorldScale: f32,\n  normalStrength: f32,\n  microNormalFrequency: f32,\n  microNormalStrength: f32,\n  ambient: f32,\n  ambientLightStrength: f32,\n  globalLightTransfer: f32,\n  shadowContrast: f32,\n  shadowPivot: f32,\n  shadowFloor: f32,\n  highlightExposure: f32,\n  prismShadowStrength: f32,\n  prismAoStrength: f32,\n  groundingScale: f32,\n}\n\nstruct _vgsl_3d5b6794__WallSample {\n  albedo: vec3f,\n  largeNormal: vec3f,\n  microNormal: vec3f,\n  normal: vec3f,\n  roughness: f32,\n  globalLight: f32,\n  prismShadow: f32,\n  prismAo: f32,\n  composed: vec3f,\n}\n\nfn _vgsl_3d5b6794__wallPoint(params: _vgsl_3d5b6794__LightWall, uv: vec2f) -> vec2f {\n  return (uv - vec2f(0.5)) * vec2f(2.0, -2.0) * params.wallHalfExtent;\n}\n\nfn _vgsl_3d5b6794__shadowContrastCurve(value: f32, contrast: f32, pivot: f32) -> f32 {\n  let safePivot = clamp(pivot, 0.001, 0.999);\n  let safeContrast = max(contrast, 0.001);\n  if (value < safePivot) {\n    return safePivot * pow(value / safePivot, safeContrast);\n  }\n  return 1.0 - (1.0 - safePivot) * pow(\n    (1.0 - value) / (1.0 - safePivot),\n    safeContrast,\n  );\n}\n\nfn _vgsl_3d5b6794__evaluateWall(\n  worldPosition: vec2f,\n  screenUv: vec2f,\n  params: _vgsl_3d5b6794__LightWall,\n  wallMaterial: texture_2d<f32>,\n  wallLighting: texture_2d<f32>,\n  materialSampler: sampler,\n) -> _vgsl_3d5b6794__WallSample {\n  let material = textureSample(\n    wallMaterial,\n    materialSampler,\n    worldPosition / max(params.materialWorldScale, 0.001),\n  );\n  let normals = _vgsl_87da3e3f__evaluateWallNormalsFromMaterial(\n    worldPosition,\n    params.materialWorldScale,\n    params.normalStrength,\n    params.microNormalFrequency,\n    params.microNormalStrength,\n    material,\n    wallMaterial,\n    materialSampler,\n  );\n  let largeNormal = normals.large;\n  let microNormal = normals.micro;\n  let normal = normals.combined;\n  let groundingOffset = vec2f(\n    worldPosition.x - params.prismCenter.x,\n    params.prismCenter.y - worldPosition.y,\n  );\n  let groundingUv = clamp(\n    groundingOffset / params.groundingScale + vec2f(0.5),\n    vec2f(0.001),\n    vec2f(0.999),\n  );\n  // Full-bleed cover fit: wide canvases crop only the bottom of the authored\n  // mask, keeping its top edge anchored; narrow canvases crop both sides.\n  let wallAspect = params.wallHalfExtent.x / max(params.wallHalfExtent.y, 0.001);\n  var lightingUv = screenUv;\n  if (wallAspect > _vgsl_3d5b6794__GLOBAL_LIGHT_MASK_ASPECT) {\n    lightingUv.y = screenUv.y * _vgsl_3d5b6794__GLOBAL_LIGHT_MASK_ASPECT / wallAspect;\n  } else {\n    lightingUv.x =\n      (screenUv.x - 0.5) * wallAspect / _vgsl_3d5b6794__GLOBAL_LIGHT_MASK_ASPECT + 0.5;\n  }\n  lightingUv = clamp(lightingUv, vec2f(0.001), vec2f(0.999));\n  let globalLight = textureSample(wallLighting, materialSampler, lightingUv).r;\n  let globalLightLinear = pow(\n    clamp(globalLight, 0.0, 1.0),\n    max(params.globalLightTransfer, 0.001),\n  );\n  let globalLightShaped = _vgsl_3d5b6794__shadowContrastCurve(\n    globalLightLinear,\n    params.shadowContrast,\n    params.shadowPivot,\n  );\n  let grounding = textureSample(wallLighting, materialSampler, groundingUv);\n  let glassGrounding = _vgsl_84fc8869__evaluateGlassGrounding(grounding.g, grounding.b);\n  let prismShadow = mix(1.0, glassGrounding.x, params.prismShadowStrength);\n  let prismAo = mix(1.0, glassGrounding.y, params.prismAoStrength);\n  let lightFacing = max(dot(normal, normalize(params.lightDirection)), 0.0);\n  let diffuse = mix(\n    params.ambient,\n    1.0,\n    lightFacing,\n  );\n  let halfDirection = normalize(normalize(params.lightDirection) + vec3f(0.0, 0.0, 1.0));\n  let specularPower = mix(48.0, 4.0, material.a);\n  let specular = pow(max(dot(normal, halfDirection), 0.0), specularPower)\n    * mix(0.12, 0.025, material.a);\n  let albedo = _vgsl_9fe494be__srgbToLinear3(params.wallColor) * material.r;\n  let direct = albedo * diffuse + vec3f(specular);\n  // The mask controls both the local wall exposure and the neutral incident\n  // radiance. Merely adding it over a uniformly bright wall lifts its shadows,\n  // then ACES compresses nearly all of the authored detail into white.\n  let globalBaseExposure = mix(\n    params.shadowFloor,\n    params.highlightExposure,\n    globalLightShaped,\n  );\n  let globalDiffuse = mix(0.25, 1.0, lightFacing);\n  let globalSurfaceResponse = material.r * globalDiffuse;\n  let globalIllumination = vec3f(\n    globalLightShaped * params.ambientLightStrength * globalSurfaceResponse\n  );\n  let composed = (\n    direct * globalBaseExposure + globalIllumination\n  ) * prismShadow * prismAo;\n  return _vgsl_3d5b6794__WallSample(\n    albedo,\n    largeNormal,\n    microNormal,\n    normal,\n    material.a,\n    globalLightShaped,\n    glassGrounding.x,\n    glassGrounding.y,\n    composed,\n  );\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/node_modules/.pnpm/@vgpu+wgsl-std@0.3.1/node_modules/@vgpu/wgsl-std/src/color/index.wgsl\n\n\n\n\nfn _vgsl_9fe494be__srgbToLinear(value: f32) -> f32 {\n  if (value <= 0.04045) {\n    return value / 12.92;\n  }\n  return pow((value + 0.055) / 1.055, 2.4);\n}\n\nfn _vgsl_9fe494be__srgbToLinear3(value: vec3f) -> vec3f {\n  return vec3f(_vgsl_9fe494be__srgbToLinear(value.r), _vgsl_9fe494be__srgbToLinear(value.g), _vgsl_9fe494be__srgbToLinear(value.b));\n}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/glass-grounding.wgsl\n/** Deepens the already-baked glass shadow/AO without another target or draw. */\nfn _vgsl_84fc8869__evaluateGlassGrounding(prismShadow: f32, prismAo: f32) -> vec2f {\n  return vec2f(\n    pow(clamp(prismShadow, 0.0, 1.0), 1.65),\n    pow(clamp(prismAo, 0.0, 1.0), 1.45),\n  );\n}\n\n// vgsl-module: /Users/jingyang/zjy365/vfx-ui/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/wall-normal.wgsl\nstruct _vgsl_87da3e3f__WallNormals {\n  large: vec3f,\n  micro: vec3f,\n  combined: vec3f,\n}\n\nfn _vgsl_87da3e3f__wallMaterialUv(worldPosition: vec2f, worldScale: f32) -> vec2f {\n  // Repeat in world units so viewport aspect changes reveal more surface\n  // instead of stretching the normal field.\n  return worldPosition / max(worldScale, 0.001);\n}\n\nfn _vgsl_87da3e3f__normalFromXy(normalXy: vec2f) -> vec3f {\n  let limitedXy = normalXy / max(length(normalXy), 1.0);\n  return normalize(vec3f(\n    limitedXy,\n    sqrt(max(1.0 - dot(limitedXy, limitedXy), 0.0001)),\n  ));\n}\n\nfn _vgsl_87da3e3f__wallNormalsFromSamples(\n  material: vec4f,\n  microMaterial: vec4f,\n  normalStrength: f32,\n  microNormalStrength: f32,\n) -> _vgsl_87da3e3f__WallNormals {\n  let largeNormalXy = (material.gb * 2.0 - 1.0) * normalStrength;\n  let microNormalXy = (microMaterial.gb * 2.0 - 1.0)\n    * microNormalStrength;\n  return _vgsl_87da3e3f__WallNormals(\n    _vgsl_87da3e3f__normalFromXy(largeNormalXy),\n    _vgsl_87da3e3f__normalFromXy(microNormalXy),\n    _vgsl_87da3e3f__normalFromXy(largeNormalXy + microNormalXy),\n  );\n}\n\nfn _vgsl_87da3e3f__evaluateWallNormalsFromMaterial(\n  worldPosition: vec2f,\n  materialWorldScale: f32,\n  normalStrength: f32,\n  microNormalFrequency: f32,\n  microNormalStrength: f32,\n  material: vec4f,\n  wallMaterial: texture_2d<f32>,\n  materialSampler: sampler,\n) -> _vgsl_87da3e3f__WallNormals {\n  let microUv = _vgsl_87da3e3f__wallMaterialUv(\n    worldPosition,\n    materialWorldScale / max(microNormalFrequency, 1.0),\n  ) + vec2f(0.371, 0.613);\n  let microMaterial = textureSampleBias(\n    wallMaterial,\n    materialSampler,\n    microUv,\n    -2.0,\n  );\n  return _vgsl_87da3e3f__wallNormalsFromSamples(\n    material,\n    microMaterial,\n    normalStrength,\n    microNormalStrength,\n  );\n}\n\n\n\n\n\n\n" };

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/wireframe.wgsl
var wireframe_default = { version: 1, wgsl: "struct Params {\n  viewProjection: mat4x4f,\n}\n@group(0) @binding(0) var<uniform> params: Params;\n\n@vertex\nfn vs_main(\n  @location(0) position: vec3f,\n  @location(1) normal: vec3f,\n) -> @builtin(position) vec4f {\n  _ = normal;\n  return params.viewProjection * vec4f(position, 1.0);\n}\n\n@fragment\nfn fs_main() -> @location(0) vec4f {\n  let alpha = 0.72;\n  return vec4f(vec3f(0.24, 0.86, 1.0) * alpha, alpha);\n}\n" };

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/create-graph.ts
init_tuning();
function createLightGraph(runtime) {
  const { gpu, label } = runtime;
  const prismShadowGeometry = createPrismShadowGeometry(
    gpu,
    `${label}.light.prism-shadow-geometry`
  );
  return {
    wall: draw(gpu, {
      shader: wall_default,
      vertices: 6,
      cull: "back",
      depth: false,
      label: `${label}.light.wall`
    }),
    prismShadowGeometry,
    prismShadow: draw(gpu, {
      shader: shadow_default,
      geometry: prismShadowGeometry,
      blend: "premultiplied",
      cull: "none",
      depth: false,
      label: `${label}.light.prism-cast-shadow`
    }),
    caustic: draw(gpu, {
      shader: caustic_default,
      geometry: runtime.lightGeometry,
      blend: "additive",
      cull: "none",
      depth: false,
      label: `${label}.light.projected-caustic`
    }),
    glassBack: draw(gpu, {
      shader: glass_back_default,
      geometry: runtime.prism,
      cull: "front",
      depth: false,
      blend: "premultiplied",
      label: `${label}.light.glass-back`
    }),
    copyBackdrop: effect2(gpu, copy_linear_default, {
      label: `${label}.light.copy-backdrop`
    }),
    glassFront: draw(gpu, {
      shader: glass_default,
      geometry: runtime.prism,
      cull: "back",
      depth: false,
      label: `${label}.light.glass-front`
    }),
    glassAccent: draw(gpu, {
      shader: glass_accent_default,
      geometry: runtime.prism,
      cull: "back",
      depth: false,
      blend: "premultiplied",
      label: `${label}.light.glass-accent`
    }),
    present: effect2(gpu, present_default, {
      label: `${label}.light.present`
    }),
    materialSampler: sampler3(gpu, {
      minFilter: "linear",
      magFilter: "linear",
      mipmapFilter: "linear",
      // Material coordinates are world-space and intentionally repeat. Shadow
      // lookups clamp their UVs explicitly before sharing this sampler.
      addressModeU: "repeat",
      addressModeV: "repeat"
    })
  };
}
function ensureLightWireframeDraws(graph, runtime) {
  const { gpu, label } = runtime;
  if (runtime.controls.wireframe && !graph.wireframe) {
    graph.wireframe = draw(gpu, {
      shader: wireframe_default,
      geometry: ensurePrismWireframeGeometry(runtime),
      cull: "none",
      depth: false,
      blend: "premultiplied",
      label: `${label}.light.wireframe`
    });
  }
  if (runtime.controls.lightWireframe && !graph.lightWireframe) {
    graph.lightWireframe = draw(gpu, {
      shader: light_wireframe_default,
      geometry: runtime.lightGeometry,
      cull: "none",
      depth: false,
      blend: "premultiplied",
      label: `${label}.light.light-wireframe`
    });
  }
}

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/materials/light/glass-tuning.ts
var LIGHT_GLASS_ACCENT_TUNING = Object.freeze({
  bandCenter: 0.052,
  bandWidth: 0.034,
  bandStrength: 0.52,
  baseReflection: 0.05,
  rimStrength: 0.45,
  baseRimStrength: 0.28,
  environmentLodBias: 1.6,
  highlightStrength: 0.95
});

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/glass-accent.ts
function lightGlassAccentUniforms() {
  return { ...LIGHT_GLASS_ACCENT_TUNING };
}

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/bind.ts
init_tuning();
init_uniforms2();
function bindLightGraph(graph, runtime, updateScene = true, revealProgress = 1, beamWidthReveal = 1) {
  const backdrop = graph.backdropHDR;
  const scene = graph.sceneHDR;
  const assets = graph.assets;
  const studio = runtime.studioEnvironment;
  if (!backdrop || !scene || !assets) {
    throw new Error(
      "prepare() must create light targets and assets before bind()."
    );
  }
  if (!studio) {
    throw new Error("prepare() must create prism environments before bind().");
  }
  if (!updateScene) {
    graph.present.set({
      sceneTexture: scene,
      params: lightPresentUniforms(runtime, revealProgress)
    });
    return;
  }
  const debug = runtime.debugEnvironment ?? studio;
  ensureLightWireframeDraws(graph, runtime);
  const glassParams = glassUniforms(runtime, "light");
  graph.wall.set({
    params: lightWallUniforms(runtime),
    wallMaterial: assets.wallMaterial,
    wallLighting: assets.wallLighting,
    materialSampler: graph.materialSampler
  });
  graph.prismShadow.set({
    shadow: prismShadowUniforms(runtime.view.viewProjection)
  });
  graph.caustic.set({
    scene: sceneUniforms(runtime, beamWidthReveal),
    caustic: lightCausticUniforms(runtime),
    causticProfile: assets.causticProfile,
    causticSampler: graph.materialSampler,
    wallMaterial: assets.wallMaterial
  });
  graph.glassBack.set({
    params: glassParams,
    studioEnvironment: studio.texture,
    debugEnvironment: debug.texture,
    environmentSampler: runtime.environmentSampler
  });
  graph.copyBackdrop.set({ sceneTexture: backdrop });
  graph.glassFront.set({
    params: glassParams,
    sceneTexture: backdrop,
    sceneSampler: runtime.sceneSampler,
    studioEnvironment: studio.texture,
    debugEnvironment: debug.texture,
    environmentSampler: runtime.environmentSampler
  });
  graph.glassAccent.set({
    params: glassParams,
    accent: lightGlassAccentUniforms(),
    studioEnvironment: studio.texture,
    debugEnvironment: debug.texture,
    environmentSampler: runtime.environmentSampler
  });
  graph.wireframe?.set({
    params: { viewProjection: runtime.view.viewProjection }
  });
  graph.lightWireframe?.set({
    scene: sceneUniforms(runtime, beamWidthReveal)
  });
  graph.present.set({
    sceneTexture: scene,
    params: lightPresentUniforms(runtime, revealProgress)
  });
}

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/bundles.ts
init_light_mesh();
import { bundle } from "vgpu";
function recordLightBackdropBundle(graph, runtime) {
  if (graph.backdropBundle || !graph.backdropHDR) return;
  graph.backdropBundle = bundle(
    runtime.gpu,
    {
      target: graph.backdropHDR,
      label: `${runtime.label}.light.backdrop-bundle`
    },
    (recorded) => {
      recorded.draw(graph.wall);
      recorded.draw(graph.prismShadow);
      recorded.draw(graph.caustic, {
        firstVertex: 0,
        vertices: LIGHT_WHITE_VERTICES
      });
      recorded.draw(graph.caustic, {
        firstVertex: LIGHT_OUTGOING_FIRST_VERTEX,
        vertices: LIGHT_OUTGOING_VERTICES
      });
      recorded.draw(graph.glassBack);
      recorded.draw(graph.caustic, {
        firstVertex: LIGHT_INTERNAL_FIRST_VERTEX,
        vertices: LIGHT_INTERNAL_VERTICES
      });
    }
  );
}

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/render.ts
init_light_mesh();
function renderLightGraph(current, graph, runtime, output, options = {}) {
  const backdrop = graph.backdropHDR;
  const scene = graph.sceneHDR;
  if (!backdrop || !scene) {
    throw new Error("prepare() must run before rendering the light pipeline.");
  }
  if (options.updateScene ?? true) {
    renderBackdrop(current, graph, runtime, options.profile);
    current.pass(
      profilePass(
        { target: scene, clear: [0, 0, 0, 1] },
        options.profile,
        "light.scene"
      ),
      (pass) => {
        pass.draw(graph.copyBackdrop);
        if (runtime.controls.view === "glass") {
          pass.draw(graph.glassFront);
          pass.draw(graph.glassAccent);
          if (runtime.controls.wireframe && graph.wireframe)
            pass.draw(graph.wireframe);
        }
      }
    );
  }
  current.pass(
    profilePass({ target: output }, options.profile, "light.present"),
    (pass) => pass.draw(graph.present)
  );
}
function renderBackdrop(current, graph, runtime, profile) {
  const target3 = graph.backdropHDR;
  const showWall = runtime.controls.view !== "caustic";
  const showLight = runtime.controls.view !== "wall";
  const showGlass = runtime.controls.view === "glass" || runtime.controls.view === "back";
  current.pass(
    profilePass({ target: target3, clear: [0, 0, 0, 1] }, profile, "light.backdrop"),
    (pass) => {
      if (runtime.controls.view === "glass" && !runtime.controls.lightWireframe && graph.backdropBundle) {
        pass.bundles(graph.backdropBundle);
        return;
      }
      if (showWall) {
        pass.draw(graph.wall);
        pass.draw(graph.prismShadow);
      }
      if (showLight) {
        pass.draw(graph.caustic, {
          firstVertex: 0,
          vertices: LIGHT_WHITE_VERTICES
        });
        pass.draw(graph.caustic, {
          firstVertex: LIGHT_OUTGOING_FIRST_VERTEX,
          vertices: LIGHT_OUTGOING_VERTICES
        });
      }
      if (showGlass) pass.draw(graph.glassBack);
      if (showLight) {
        pass.draw(graph.caustic, {
          firstVertex: LIGHT_INTERNAL_FIRST_VERTEX,
          vertices: LIGHT_INTERNAL_VERTICES
        });
      }
      if (runtime.controls.lightWireframe && graph.lightWireframe) {
        pass.draw(graph.lightWireframe);
      }
    }
  );
}
function profilePass(options, profile, name) {
  const timer = profile?.pass(name);
  return timer ? { ...options, timer } : options;
}

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/targets.ts
import { target as target2 } from "vgpu";
function ensureLightTargets(graph, runtime, size) {
  graph.backdropHDR ??= createTarget(runtime, size, "backdrop-hdr");
  graph.sceneHDR ??= createTarget(runtime, size, "scene-hdr");
  resizeLightTargets(graph, size);
}
function createTarget(runtime, size, name) {
  return target2(runtime.gpu, {
    size,
    format: "rgba16float",
    msaa: runtime.gpu.device.isCompatibilityMode ? void 0 : 4,
    label: `${runtime.label}.light.${name}`
  });
}
function resizeLightTargets(graph, size) {
  graph.backdropHDR?.resize(size);
  graph.sceneHDR?.resize(size);
}
function destroyTarget2(value) {
  value?.destroy?.();
}
function destroyLightTargets(graph) {
  destroyTarget2(graph.backdropHDR);
  destroyTarget2(graph.sceneHDR);
  graph.backdropHDR = void 0;
  graph.sceneHDR = void 0;
  graph.backdropBundle = void 0;
}

// references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background/pipelines/light/index.ts
init_debug_entries();
function createLightPipeline(runtime, options = {}) {
  const graph = createLightGraph(runtime);
  const loader = options.assetLoader;
  let destroyed = false;
  let debugDraws;
  let debugDrawsPromise;
  return {
    mode: "light",
    get targets() {
      return { backdropHDR: graph.backdropHDR, sceneHDR: graph.sceneHDR };
    },
    async prepare(output) {
      if (destroyed)
        throw new Error("Cannot prepare a destroyed light pipeline.");
      resizeRuntime(runtime, output.size);
      ensureLightTargets(graph, runtime, output.size);
      ensureLightWireframeDraws(graph, runtime);
      const environmentReady = prepareRuntimeEnvironment(runtime);
      const ownedAssets = graph.assets;
      const assetsReady = ownedAssets ? Promise.resolve(ownedAssets) : loadLightAssetTextures(runtime.gpu, loader);
      const graphReady = Promise.resolve().then(
        () => Promise.all(compileGraph(graph, output))
      );
      const [assetsResult, environmentResult, graphResult] = await Promise.allSettled([assetsReady, environmentReady, graphReady]);
      const loaded = assetsResult.status === "fulfilled" ? assetsResult.value : void 0;
      if (destroyed) {
        if (!ownedAssets) destroyLightAssetTextures(loaded);
        return;
      }
      if (assetsResult.status === "rejected") throw assetsResult.reason;
      if (environmentResult.status === "rejected") {
        if (!ownedAssets) destroyLightAssetTextures(loaded);
        throw environmentResult.reason;
      }
      if (graphResult.status === "rejected") {
        if (!ownedAssets) destroyLightAssetTextures(loaded);
        throw graphResult.reason;
      }
      graph.assets = loaded;
      bindLightGraph(graph, runtime);
      if (destroyed) return;
      recordLightBackdropBundle(graph, runtime);
    },
    resize(size) {
      if (destroyed) return;
      resizeLightTargets(graph, size);
    },
    bind(_time, options2) {
      if (destroyed) return;
      bindLightGraph(
        graph,
        runtime,
        options2?.updateScene ?? true,
        options2?.revealProgress ?? 1,
        options2?.beamWidthReveal ?? 1
      );
      debugDraws?.bind();
    },
    render(currentFrame, output, renderOptions) {
      renderLightGraph(currentFrame, graph, runtime, output, renderOptions);
    },
    debugSources: () => PRISM_DEBUG_SOURCES,
    debugTarget(sourceId) {
      return resolveLightDebugTarget(graph, runtime, sourceId);
    },
    async createDebugDraws() {
      if (destroyed)
        throw new Error(
          "Cannot create previews for a destroyed light pipeline."
        );
      if (!graph.assets)
        throw new Error(
          "prepare() must load light assets before debug previews."
        );
      debugDrawsPromise ??= Promise.resolve().then(() => (init_debug_draws(), debug_draws_exports)).then(
        ({ createLightDebugDraws: createLightDebugDraws2 }) => {
          if (destroyed)
            throw new Error(
              "Cannot create previews for a destroyed light pipeline."
            );
          debugDraws = createLightDebugDraws2(runtime, graph);
          return debugDraws;
        }
      );
      try {
        return await debugDrawsPromise;
      } catch (error) {
        debugDrawsPromise = void 0;
        throw error;
      }
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      debugDraws = void 0;
      debugDrawsPromise = void 0;
      destroyLightTargets(graph);
      graph.prismShadowGeometry.destroy();
      destroyLightAssetTextures(graph.assets);
      graph.assets = void 0;
    }
  };
}
function resolveLightDebugTarget(graph, runtime, sourceId) {
  const backdrop = graph.backdropHDR;
  const scene = graph.sceneHDR;
  if (sourceId === "backdrop-hdr" && backdrop) return { primary: backdrop };
  if (sourceId === "scene-hdr" && scene) return { primary: scene };
  if (sourceId === "final-output" && scene)
    return {
      primary: scene,
      exposure: runtime.controls.lightMode.output.exposure,
      toneMapping: PRISM_LIGHT_TONE_MAPPING_CODES[runtime.controls.lightMode.output.toneMapping]
    };
  if (sourceId === "front-glass" && scene && backdrop) {
    return {
      primary: scene,
      secondary: backdrop,
      mode: "difference",
      differenceGain: 5
    };
  }
  return void 0;
}
function compileGraph(graph, output) {
  const backdrop = graph.backdropHDR;
  const scene = graph.sceneHDR;
  const outputSignature = { colors: [output.format] };
  return [
    graph.wall.compile(backdrop),
    graph.prismShadow.compile(backdrop),
    graph.caustic.compile(backdrop),
    graph.glassBack.compile(backdrop),
    ...graph.lightWireframe ? [graph.lightWireframe.compile(backdrop)] : [],
    graph.copyBackdrop.compile(scene),
    graph.glassFront.compile(scene),
    graph.glassAccent.compile(scene),
    ...graph.wireframe ? [graph.wireframe.compile(scene)] : [],
    graph.present.compile(outputSignature)
  ];
}

// <stdin>
init_types();
export {
  DEFAULT_PRISM_CONTROLS,
  createLightPipeline,
  createPrismRuntime,
  destroyPrismRuntime,
  ensurePrismWireframeGeometry,
  incidenceAt,
  lampAt,
  lightWallExtent,
  prepareRuntimeEnvironment,
  resizeRuntime,
  setRuntimeControls,
  setRuntimeFramingViewport,
  setRuntimeLampAim,
  setRuntimeLampArc,
  setRuntimeOrbit,
  wallExtent
};
