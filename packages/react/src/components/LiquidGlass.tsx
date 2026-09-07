"use client";
import { opticalShader, useOpticalSize } from "./OpticalGlass";
import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/** LiquidGlass: an original ray-marched optical solid in a printed studio scene. */
export const LIQUID_GLASS_SHADER = opticalShader(
  /* wgsl */ `struct Params {
  time: f32,
  speed: f32,
  distortion: f32,
  chromatic: f32,
  scale: f32,
  px: f32,
  py: f32,
  pActive: f32,
  resX: f32, resY: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

`,
  `return Material(params.time*params.speed*max(params.scale,0.1), params.distortion*2.0, params.chromatic, 0.0, 1.0, 1.0, 0.05, vec3f(0.92,0.98,0.97), (vec2f(params.px,params.py)-0.5), vec2f(params.resX,params.resY));`,
  2,
);

export interface LiquidGlassProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Refraction strength. */
  distortion?: number;
  /** RGB chromatic split amount. */
  chromatic?: number;
  /** Travelling wave frequency multiplier. */
  scale?: number;
  /** When true, the molten glass ring tilts toward the pointer. */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const LIQUID_GLASS_DEFAULTS = {
  speed: 0.8,
  distortion: 0.45,
  chromatic: 0.6,
  scale: 1.2,
} as const;

export const LIQUID_GLASS_PRESETS = {
  calm: { speed: 0.6, distortion: 0.3, chromatic: 0.4, scale: 1.0 },
  storm: { speed: 1.6, distortion: 0.9, chromatic: 1.2, scale: 1.6 },
  velvet: { speed: 0.5, distortion: 0.55, chromatic: 0.8, scale: 0.8 },
} as const;

export function LiquidGlass({
  speed = LIQUID_GLASS_DEFAULTS.speed,
  distortion = LIQUID_GLASS_DEFAULTS.distortion,
  chromatic = LIQUID_GLASS_DEFAULTS.chromatic,
  scale = LIQUID_GLASS_DEFAULTS.scale,
  interactive = false,
  className,
  style,
  fallback,
}: LiquidGlassProps) {
  const [wrapRef, pointer, pActive] = usePointerUniforms<HTMLDivElement>({
    enabled: interactive,
  });
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
        shader={LIQUID_GLASS_SHADER}
        label="liquid-glass"
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
          ...size,
          speed,
          distortion,
          chromatic,
          scale,
          px: ptr.x,
          py: ptr.y,
          pActive: interactive && pActive ? 1 : 0,
        }}
      />
    </div>
  );
}
