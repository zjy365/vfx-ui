"use client";

import { opticalShader, useOpticalSize } from "./OpticalGlass";
import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/** GlassLens: an original ray-marched optical solid in a printed studio scene. */
export const GLASS_LENS_SHADER = opticalShader(
  /* wgsl */ `struct Params {
  time: f32,
  speed: f32,
  refraction: f32,
  dispersion: f32,
  blur: f32,
  rim: f32,
  tintR: f32, tintG: f32, tintB: f32,
  px: f32,
  py: f32,
  pActive: f32,
  resX: f32,
  resY: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

`,
  `return Material(params.time*params.speed, params.refraction, params.dispersion, params.blur, params.rim, 1.0, 0.05, vec3f(params.tintR,params.tintG,params.tintB), (vec2f(params.px,params.py)-0.5), vec2f(params.resX,params.resY));`,
  1,
);

export interface GlassLensProps {
  /** Backdrop drift and rim-light rotation speed. */
  speed?: number;
  /** Lens bending strength. */
  refraction?: number;
  /** RGB dispersion spread. */
  dispersion?: number;
  /** Rim depth-of-field softness. */
  blur?: number;
  /** Rim and bevel highlight strength. */
  rim?: number;
  /** Glass tint color. */
  tint?: string;
  /** When true, the biconvex lens tilts toward the pointer. */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const GLASS_LENS_DEFAULTS = {
  speed: 1.0,
  refraction: 0.85,
  dispersion: 0.7,
  blur: 0.8,
  rim: 0.9,
  tint: "#e0eef4",
} as const;

export const GLASS_LENS_PRESETS = {
  aqua: {
    speed: 1.0,
    refraction: 0.85,
    dispersion: 0.7,
    blur: 0.8,
    rim: 0.9,
    tint: "#e0eef4",
  },
  prism: {
    speed: 1.3,
    refraction: 1.2,
    dispersion: 1.4,
    blur: 0.6,
    rim: 1.1,
    tint: "#e9e3f4",
  },
  honey: {
    speed: 0.7,
    refraction: 0.7,
    dispersion: 0.4,
    blur: 1.1,
    rim: 0.75,
    tint: "#ffe8c7",
  },
} as const;

export function GlassLens({
  speed = GLASS_LENS_DEFAULTS.speed,
  refraction = GLASS_LENS_DEFAULTS.refraction,
  dispersion = GLASS_LENS_DEFAULTS.dispersion,
  blur = GLASS_LENS_DEFAULTS.blur,
  rim = GLASS_LENS_DEFAULTS.rim,
  tint = GLASS_LENS_DEFAULTS.tint,
  interactive = false,
  className,
  style,
  fallback,
}: GlassLensProps) {
  const [wrapRef, pointer, pActive] = usePointerUniforms<HTMLDivElement>({
    enabled: interactive,
  });
  const c = hexToRgb01(tint);
  const size = useOpticalSize(wrapRef);
  const ptr = interactive ? pointer : POINTER_REST;

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        dpr={1.25}
        fps={30}
        shader={GLASS_LENS_SHADER}
        label="glass-lens"
        style={{ position: "absolute", inset: 0 }}
        fallback={
          fallback ?? (
            <div
              style={{ position: "absolute", inset: 0, background: "#c2bfb4" }}
            />
          )
        }
        uniforms={{
          time: 0,
          speed,
          refraction,
          dispersion,
          blur,
          rim,
          tintR: c[0],
          tintG: c[1],
          tintB: c[2],
          px: ptr.x,
          py: ptr.y,
          pActive: interactive && pActive ? 1 : 0,
          ...size,
        }}
      />
    </div>
  );
}
