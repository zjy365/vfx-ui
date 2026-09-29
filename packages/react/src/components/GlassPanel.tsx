"use client";
import type { ReactNode } from "react";
import { opticalShader, useOpticalSize } from "./OpticalGlass";
import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms, POINTER_REST } from "../usePointerUniforms.ts";

/** GlassPanel: an original ray-marched optical slab built to carry content. */
export const GLASS_PANEL_SHADER = opticalShader(
  /* wgsl */ `struct Params {
  time: f32,
  shine: f32,
  borderGlow: f32,
  panelScale: f32,
  radius: f32,
  c0r: f32, c0g: f32, c0b: f32,
  px: f32,
  py: f32,
  pActive: f32,
  resX: f32, resY: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

`,
  `return Material(params.time, 0.9, params.shine, 0.14, params.borderGlow, params.panelScale, params.radius, vec3f(params.c0r,params.c0g,params.c0b), (vec2f(params.px,params.py)-0.5), vec2f(params.resX,params.resY));`,
  0,
);

export interface GlassPanelProps {
  /** Real content laid out across the glass panel. */
  children?: ReactNode;
  /** Corner radius in normalized units. A tight bevel reads as a cut slab. */
  radius?: number;
  /** Strength of Fresnel edge reflections. */
  borderGlow?: number;
  /** Spectral separation at the beveled edges. */
  shine?: number;
  /** Slab size as a fraction of the canvas (clamped 0.32..1.45 by the shader). */
  panelScale?: number;
  /** Glass tint color. */
  tint?: string;
  /** Content column width in percent of the panel. */
  contentWidth?: number;
  /** When true, the slab tilts toward the pointer. */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const GLASS_PANEL_DEFAULTS = {
  radius: 0.022,
  borderGlow: 0.5,
  shine: 0.62,
  panelScale: 1.12,
  tint: "#dfe9ec",
  contentWidth: 92,
} as const;

export const GLASS_PANEL_PRESETS = {
  clear: {
    radius: 0.022,
    borderGlow: 0.5,
    shine: 0.62,
    panelScale: 1.12,
    tint: "#dfe9ec",
  },
  smoke: {
    radius: 0.03,
    borderGlow: 0.34,
    shine: 0.42,
    panelScale: 1.24,
    tint: "#c9ced2",
  },
  cobalt: {
    radius: 0.018,
    borderGlow: 0.66,
    shine: 0.9,
    panelScale: 1.02,
    tint: "#cfe0f2",
  },
} as const;

export function GlassPanel({
  radius = GLASS_PANEL_DEFAULTS.radius,
  borderGlow = GLASS_PANEL_DEFAULTS.borderGlow,
  shine = GLASS_PANEL_DEFAULTS.shine,
  panelScale = GLASS_PANEL_DEFAULTS.panelScale,
  tint = GLASS_PANEL_DEFAULTS.tint,
  contentWidth = GLASS_PANEL_DEFAULTS.contentWidth,
  interactive = true,
  className,
  style,
  fallback,
  children,
}: GlassPanelProps) {
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
        shader={GLASS_PANEL_SHADER}
        label="glass-panel"
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
          panelScale,
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
            width: `${Math.min(100, Math.max(20, contentWidth))}%`,
            height: "100%",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: "#202522",
            padding: "clamp(20px, 4vw, 44px)",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
