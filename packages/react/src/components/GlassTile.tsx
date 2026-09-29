"use client";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { opticalShader, useOpticalSize } from "./OpticalGlass";
import { VfxCanvas, type VfxCanvasProps } from "../VfxCanvas";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms } from "../usePointerUniforms.ts";

/**
 * GlassTile: a wall of glass bricks on the shared OpticalGlass pipeline.
 * One biconvex lens (SDF shape 1) lives in a layer that travels to the
 * hovered brick; pActive drives its bulge (refraction + dispersion + rim),
 * so the wall stays a single renderer no matter how many bricks there are.
 */
export const GLASS_TILE_SHADER = opticalShader(
  /* wgsl */ `struct Params {
  time: f32,
  speed: f32,
  refraction: f32,
  dispersion: f32,
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
  `return Material(params.time*params.speed, params.refraction + params.pActive*0.42, params.dispersion + params.pActive*0.5, 0.7, params.rim + params.pActive*0.55, 1.0, 0.05, vec3f(params.tintR,params.tintG,params.tintB), (vec2f(params.px,params.py)-0.5)*params.pActive, vec2f(params.resX,params.resY));`,
  1,
);

/** Where the shared lens layer currently sits (CSS pixels, wall-relative). */
interface LensCell {
  index: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

const GLASS_TILE_TILES = [
  "Frost",
  "Prism",
  "Amber",
  "Slate",
  "Cobalt",
  "Fern",
  "Pearl",
  "Onyx",
] as const;

export interface GlassTileProps {
  /** One node per brick; replace the fictional defaults with your own. */
  tiles?: readonly ReactNode[];
  /** Brick columns in the wall. */
  columns?: number;
  /** Gap between bricks in pixels. */
  gap?: number;
  /** Minimum brick height in pixels. */
  tileHeight?: number;
  /** Glass tint color of the lens. */
  tint?: string;
  /** Resting lens bending strength (the bulge adds on top while hovered). */
  refraction?: number;
  /** Resting RGB dispersion spread. */
  dispersion?: number;
  /** Resting rim and bevel highlight. */
  rim?: number;
  className?: string;
  style?: CSSProperties;
  fallback?: VfxCanvasProps["fallback"];
}

export const GLASS_TILE_DEFAULTS = {
  columns: 4,
  gap: 10,
  tileHeight: 118,
  tint: "#e0eef4",
  refraction: 0.55,
  dispersion: 0.45,
  rim: 0.45,
} as const;

export function GlassTile({
  tiles = GLASS_TILE_TILES,
  columns = GLASS_TILE_DEFAULTS.columns,
  gap = GLASS_TILE_DEFAULTS.gap,
  tileHeight = GLASS_TILE_DEFAULTS.tileHeight,
  tint = GLASS_TILE_DEFAULTS.tint,
  refraction = GLASS_TILE_DEFAULTS.refraction,
  dispersion = GLASS_TILE_DEFAULTS.dispersion,
  rim = GLASS_TILE_DEFAULTS.rim,
  className,
  style,
  fallback,
}: GlassTileProps) {
  const brickRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cell, setCell] = useState<LensCell | null>(null);
  const [calm, setCalm] = useState(false);
  const [wrapRef, pointer, pActive] = usePointerUniforms<HTMLDivElement>();
  const size = useOpticalSize(wrapRef);
  const c = hexToRgb01(tint);

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const update = () => setCalm(media?.matches ?? false);
    update();
    media?.addEventListener?.("change", update);
    return () => media?.removeEventListener?.("change", update);
  }, []);

  /** Park the lens layer over a brick, measured wall-relative. */
  const focusBrick = (index: number) => {
    const wall = wrapRef.current;
    const brick = brickRefs.current[index];
    if (!wall || !brick) return;
    const wr = wall.getBoundingClientRect();
    const br = brick.getBoundingClientRect();
    setCell({
      index,
      x: br.left - wr.left,
      y: br.top - wr.top,
      w: br.width,
      h: br.height,
    });
  };

  /** Keyboard parity: focusing content inside a brick moves the lens there. */
  const onFocusIn = (event: React.FocusEvent<HTMLDivElement>) => {
    const brick = (event.target as HTMLElement).closest?.("[data-glass-tile]");
    const index = Number(brick?.getAttribute("data-glass-tile") ?? -1);
    if (index >= 0) focusBrick(index);
  };

  return (
    <div
      ref={wrapRef}
      className={className}
      onPointerLeave={() => setCell(null)}
      onFocusCapture={onFocusIn}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 18,
        background:
          "linear-gradient(160deg,#10161b 0%,#161f26 52%,#0d1318 100%)",
        padding: gap,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: `repeat(${Math.max(1, columns)},minmax(0,1fr))`,
          gap,
        }}
      >
        {tiles.map((tile, index) => (
          <div
            key={index}
            data-glass-tile={index}
            ref={(el) => {
              brickRefs.current[index] = el;
            }}
            onPointerEnter={() => focusBrick(index)}
            style={{
              position: "relative",
              minHeight: tileHeight,
              borderRadius: 12,
              border: `1px solid ${
                cell?.index === index
                  ? "rgba(255,255,255,0.34)"
                  : "rgba(255,255,255,0.12)"
              }`,
              background:
                cell?.index === index
                  ? "rgba(190,214,224,0.10)"
                  : "rgba(148,178,190,0.06)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.10), 0 10px 22px -16px #000c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#dfe7ea",
              font: "600 12px/1.4 ui-sans-serif,system-ui,sans-serif",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              transition: calm
                ? "none"
                : "border-color 200ms ease, background 200ms ease",
            }}
          >
            {tile}
          </div>
        ))}
      </div>
      {cell != null && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: cell.w,
            height: cell.h,
            transform: `translate3d(${cell.x}px,${cell.y}px,0)`,
            transition: calm
              ? "opacity 160ms ease"
              : "transform 280ms cubic-bezier(.22,.9,.24,1), opacity 200ms ease",
            opacity: 1,
            zIndex: 2,
            pointerEvents: "none",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <VfxCanvas
            dpr={1.25}
            fps={30}
            shader={GLASS_TILE_SHADER}
            label="glass-tile"
            style={{ position: "absolute", inset: 0 }}
            fallback={
              fallback ?? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "#c2bfb4",
                  }}
                />
              )
            }
            uniforms={{
              time: 0,
              speed: 0.9,
              refraction,
              dispersion,
              rim,
              tintR: c[0],
              tintG: c[1],
              tintB: c[2],
              px: pointer.x,
              py: pointer.y,
              pActive: pActive ? 1 : 0,
              ...size,
            }}
          />
        </div>
      )}
    </div>
  );
}
