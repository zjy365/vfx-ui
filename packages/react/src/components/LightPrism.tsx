"use client";

import { PrismScene } from "./PrismScene";
import { opticalShader } from "./OpticalGlass";
import { type VfxCanvasProps } from "../VfxCanvas";

/** @deprecated Legacy single-pass approximation. LightPrism now uses the complete optical pipeline. */
export const LIGHT_PRISM_SHADER = opticalShader(
  /* wgsl */ `struct Params {
  time: f32,
  speed: f32,
  prismSize: f32,
  beamWidth: f32,
  refraction: f32,
  dispersion: f32,
  shadow: f32,
  px: f32,
  py: f32,
  pActive: f32,
  resX: f32,
  resY: f32,
  c0r: f32, c0g: f32, c0b: f32,
  c1r: f32, c1g: f32, c1b: f32,
  c2r: f32, c2g: f32, c2b: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

`,
  `return Material(params.time*params.speed, params.refraction*5.0, params.dispersion*2.0, 0.0, 1.0, params.prismSize/0.3, 0.03, mix(vec3f(1.0),vec3f(params.c1r,params.c1g,params.c1b),0.32), (vec2f(params.px,params.py)-0.5)*params.pActive, vec2f(params.resX,params.resY));`,
  3,
);

export interface LightPrismProps {
  /** Animation speed multiplier (light pools drift, frost shimmers). */
  speed?: number;
  /** Prism circumradius in normalized-height units. */
  prismSize?: number;
  /** Half-width of the beam core. */
  beamWidth?: number;
  /** Refractive-index offset inside the glass frame. */
  refraction?: number;
  /** Spectral fringe strength (R/G/B displacement split). */
  dispersion?: number;
  /** Cast-shadow strength. */
  shadow?: number;
  /** Paper base color. */
  from?: string;
  /** @deprecated Spectral colors now come from optical dispersion. */
  to?: string;
  /** @deprecated The optical pipeline uses a white incident beam. */
  accent?: string;
  /**
   * When true, the beam tilts and the light pools drift toward the
   * pointer. Off by default — a calm, pointer-free backdrop.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const LIGHT_PRISM_DEFAULTS = {
  speed: 1,
  prismSize: 0.3,
  beamWidth: 0.0045,
  refraction: 0.16,
  dispersion: 0.22,
  shadow: 1,
  from: "#d2ccc2",
  to: "#a8a49b",
  accent: "#ffffff",
} as const;

export const LIGHT_PRISM_PRESETS = {
  paper: {
    speed: 1,
    prismSize: 0.3,
    beamWidth: 0.0045,
    refraction: 0.16,
    dispersion: 0.22,
    shadow: 1,
    from: "#d2ccc2",
    to: "#a8a49b",
    accent: "#ffffff",
  },
  moonstone: {
    speed: 0.9,
    prismSize: 0.32,
    beamWidth: 0.004,
    refraction: 0.19,
    dispersion: 0.8,
    shadow: 0.9,
    from: "#e4e7ec",
    to: "#93a3b8",
    accent: "#f2f7ff",
  },
  amber: {
    speed: 1.1,
    prismSize: 0.28,
    beamWidth: 0.005,
    refraction: 0.14,
    dispersion: 0.35,
    shadow: 1.1,
    from: "#efe6d8",
    to: "#b39a76",
    accent: "#fff3d9",
  },
} as const;

export function LightPrism(props: LightPrismProps) {
  return <PrismScene {...props} />;
}
