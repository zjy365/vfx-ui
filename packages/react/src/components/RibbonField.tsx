"use client";

import { useEffect, useState } from "react";
import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { usePointerUniforms } from "../usePointerUniforms.ts";

/**
 * RibbonField — a faithful WGSL port of ThreeUI's RibbonField (MIT,
 * Copyright 2026 Meng To — references/threeui/src/shaders/ribbon-field/).
 * Three Gaussian light ribbons drifting on sine paths, two bloom cores,
 * a 7px dot-matrix grid modulated by hash noise and a scanline sweep,
 * plus micro grain. resX/resY carry the canvas backing-store size so the
 * dot grid stays true to the original's pixel scale.
 */
export const RIBBON_FIELD_SHADER = /* wgsl */ `
struct Params {
  time: f32,
  speed: f32,
  intensity: f32,
  drift: f32,
  grain: f32,
  resX: f32,
  resY: f32,
}
@group(0) @binding(0) var<uniform> params: Params;

fn hash2(pIn: vec2f) -> f32 {
  var p = fract(pIn * vec2f(123.34, 456.21));
  p = p + dot(p, p + 45.32);
  return fract(p.x * p.y);
}

fn ribbon(uv: vec2f, offset: f32, width: f32, phase: f32) -> f32 {
  let y = 0.55 + 0.20 * sin(uv.x * 2.15 + phase) + 0.045 * sin(uv.x * 7.0 - phase * 0.7);
  let d = abs(uv.y - y - offset);
  return exp(-(d * d) / width);
}

@fragment
fn main(@location(0) uvIn: vec2f) -> @location(0) vec4f {
  let p = params;
  // vgpu uv is top-origin; GLSL gl_FragCoord was bottom-origin.
  let uv = vec2f(uvIn.x, 1.0 - uvIn.y);
  let frag = uv * vec2f(p.resX, p.resY);
  let t = p.time * p.speed * 0.22;
  let drift = p.drift * 0.06;

  let rightFade = smoothstep(0.28, 0.72, uv.x);
  let centerDark = 1.0 - smoothstep(0.0, 0.88, distance(uv, vec2f(0.18, 0.48)));

  let r1 = ribbon(vec2f(uv.x + drift, uv.y), 0.03, 0.0065, t + 0.9);
  let r2 = ribbon(vec2f(uv.x - drift * 0.7, uv.y), -0.23, 0.0085, t + 3.25);
  let r3 = ribbon(vec2f(uv.x + drift * 0.4, uv.y), 0.25, 0.014, t + 1.85);

  let glow = r1 * 1.14 + r2 * 1.05 + r3 * 0.48;

  var col = vec3f(0.0);
  col += vec3f(0.22, 0.82, 0.96) * r1 * 0.92; // cyan
  col += vec3f(0.17, 0.83, 0.75) * r1 * 0.62; // teal
  col += vec3f(0.39, 0.38, 0.92) * r3 * 0.42; // indigo
  col += vec3f(0.23, 0.51, 0.96) * r2 * 0.66; // blue
  col += vec3f(0.66, 0.33, 0.98) * (r2 + r3) * 0.30; // purple

  var bloom = exp(-pow(distance(uv, vec2f(0.76, 0.40 + 0.035 * sin(t))), 2.0) / 0.050);
  bloom += exp(-pow(distance(uv, vec2f(0.71, 0.75 + 0.025 * cos(t))), 2.0) / 0.030);
  col += vec3f(0.42, 0.85, 1.0) * bloom * 0.34;

  let grid = fract(frag / 7.0) - 0.5;
  let dotShape = smoothstep(0.29, 0.11, length(grid));
  let noise = hash2(floor(frag / 7.0));
  let scan = 0.72 + 0.28 * sin((uv.x + uv.y) * 38.0 + p.time * p.speed * 1.3);
  let dots = dotShape * (0.48 + 0.52 * noise) * scan;

  let micro = hash2(frag + vec2f(p.time * p.speed)) * 0.035 * p.grain;
  var alpha = clamp((glow * 1.55 + bloom * 0.50) * dots * rightFade, 0.0, 1.0);
  alpha = alpha * (1.0 - centerDark * 0.56);

  let base = vec3f(0.005, 0.005, 0.005);
  var finalColor = mix(base, col, clamp(alpha * 1.55 * p.intensity, 0.0, 1.0));
  finalColor += micro * rightFade;
  return vec4f(finalColor, 1.0);
}
`;

export interface RibbonFieldProps {
  /** Animation speed multiplier. */
  speed?: number;
  /** Ribbon/bloom brightness multiplier. */
  intensity?: number;
  /** Horizontal drift of the ribbons (-1..1). Overridden by pointer when interactive. */
  drift?: number;
  /** Micro-grain strength multiplier. */
  grain?: number;
  /**
   * When true (default), the ribbons' horizontal drift follows the pointer's
   * x position across the component — the pointer interaction from the
   * original threeui ribbon-field. Set false to pin drift to the prop.
   */
  interactive?: boolean;
  className?: string;
  style?: VfxCanvasProps["style"];
  fallback?: VfxCanvasProps["fallback"];
}

export const RIBBON_FIELD_DEFAULTS = {
  speed: 1,
  intensity: 1,
  drift: 0,
  grain: 1,
} as const;

export const RIBBON_FIELD_PRESETS = {
  classic: { speed: 1, intensity: 1, drift: 0, grain: 1 },
  calm: { speed: 0.55, intensity: 0.8, drift: -0.2, grain: 0.7 },
  vivid: { speed: 1.3, intensity: 1.3, drift: 0.15, grain: 1.2 },
} as const;

export function RibbonField({
  speed = RIBBON_FIELD_DEFAULTS.speed,
  intensity = RIBBON_FIELD_DEFAULTS.intensity,
  drift = RIBBON_FIELD_DEFAULTS.drift,
  grain = RIBBON_FIELD_DEFAULTS.grain,
  interactive = true,
  className,
  style,
  fallback,
}: RibbonFieldProps) {
  const [wrapRef, pointer] = usePointerUniforms<HTMLDivElement>();
  const [res, setRes] = useState<[number, number]>([800, 600]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = el.getBoundingClientRect();
      setRes([Math.max(1, Math.round(r.width * dpr)), Math.max(1, Math.round(r.height * dpr))]);
    };
    update();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveDrift = interactive ? drift + (pointer.x - 0.5) * 2 : drift;

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", ...style }}
    >
      <VfxCanvas
        shader={RIBBON_FIELD_SHADER}
        label="ribbon-field"
        style={{ position: "absolute", inset: 0 }}
        fallback={fallback}
        uniforms={{
          time: 0,
          speed,
          intensity,
          drift: effectiveDrift,
          grain,
          resX: res[0],
          resY: res[1],
        }}
      />
    </div>
  );
}
