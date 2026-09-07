"use client";
import type { ReactNode } from "react";
import { opticalShader, useOpticalSize } from "./OpticalGlass";
import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/** GlassCard: an original ray-marched optical solid in a printed studio scene. */
export const GLASS_CARD_SHADER = opticalShader(
  /* wgsl */ `struct Params {
  time: f32,
  shine: f32,
  borderGlow: f32,
  cardScale: f32,
  radius: f32,
  c0r: f32, c0g: f32, c0b: f32,
  px: f32,
  py: f32,
  pActive: f32,
  resX: f32, resY: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

`,
  `return Material(params.time, 0.9, params.shine, 0.2, params.borderGlow, params.cardScale/0.62, params.radius, vec3f(params.c0r,params.c0g,params.c0b), (vec2f(params.px,params.py)-0.5), vec2f(params.resX,params.resY));`,
  0,
);

export interface GlassCardProps {
  /** Real content above the decorative glass field. */
  children?: ReactNode;
  /** Corner radius in normalized units. */
  radius?: number;
  /** Strength of Fresnel edge reflections. */
  borderGlow?: number;
  /** Spectral separation at the beveled edges. */
  shine?: number;
  /** Card size as a fraction of the canvas (0..1). */
  cardScale?: number;
  /** Glass tint color. */
  tint?: string;
  /** When true, the solid tilts toward the pointer. */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const GLASS_CARD_DEFAULTS = {
  radius: 0.05,
  borderGlow: 0.7,
  shine: 0.8,
  cardScale: 0.62,
  tint: "#e4edf0",
} as const;

export const GLASS_CARD_PRESETS = {
  frosted: {
    tint: "#e4edf0",
    radius: 0.05,
    borderGlow: 0.7,
    shine: 0.8,
    cardScale: 0.62,
  },
  champagne: {
    tint: "#fff0cc",
    radius: 0.07,
    borderGlow: 0.55,
    shine: 1.0,
    cardScale: 0.56,
  },
  rose: {
    tint: "#f4d6d3",
    radius: 0.04,
    borderGlow: 0.85,
    shine: 0.65,
    cardScale: 0.68,
  },
} as const;

export function GlassCard({
  radius = GLASS_CARD_DEFAULTS.radius,
  borderGlow = GLASS_CARD_DEFAULTS.borderGlow,
  shine = GLASS_CARD_DEFAULTS.shine,
  cardScale = GLASS_CARD_DEFAULTS.cardScale,
  tint = GLASS_CARD_DEFAULTS.tint,
  interactive = false,
  className,
  style,
  fallback,
  children,
}: GlassCardProps) {
  const c = hexToRgb01(tint);
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
        shader={GLASS_CARD_SHADER}
        label="glass-card"
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
          shine,
          borderGlow,
          cardScale,
          radius,
          c0r: c[0],
          c0g: c[1],
          c0b: c[2],
          px: ptr.x,
          py: ptr.y,
          pActive: interactive && pActive ? 1 : 0,
        }}
      />
      {children != null && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: `${Math.min(85, Math.max(20, cardScale * 100))}%`,
            margin: "auto",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#202522",
            padding: "clamp(16px, 3vw, 32px)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
