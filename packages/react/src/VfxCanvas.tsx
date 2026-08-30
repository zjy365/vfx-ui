"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import {
  createVfxRenderer,
  type VfxRenderer,
  type VfxRendererOptions,
} from "@vfx-ui/core";

export interface VfxCanvasProps extends Omit<VfxRendererOptions, "uniforms"> {
  shader: string;
  /** Uniform values (WGSL field names). Updated on change without re-init. */
  uniforms?: VfxRendererOptions["uniforms"];
  className?: string;
  style?: CSSProperties;
  /** Rendered when WebGPU is unavailable or init fails. */
  fallback?: ReactNode;
  /** Called once the renderer is live (browser only). */
  onReady?: (renderer: VfxRenderer) => void;
}

/**
 * Shared canvas host for every vfx-ui component. Owns the renderer
 * lifecycle: client-only init, reduced-motion handling, uniform
 * updates, and dispose. Server rendering yields a plain canvas element.
 */
export function VfxCanvas({
  shader,
  uniforms,
  animate,
  dpr,
  fps,
  label,
  className,
  style,
  fallback,
  onReady,
}: VfxCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<VfxRenderer | null>(null);
  const [failed, setFailed] = useState(false);
  const uniformsKey = JSON.stringify(uniforms ?? {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let renderer: VfxRenderer | null = null;
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    createVfxRenderer(canvas, {
      shader,
      uniforms,
      animate: animate !== false && !reduced,
      dpr,
      fps,
      label,
    })
      .then((r) => {
        if (disposed) {
          r.dispose();
          return;
        }
        renderer = r;
        rendererRef.current = r;
        onReady?.(r);
      })
      .catch(() => {
        if (!disposed) setFailed(true);
      });

    return () => {
      disposed = true;
      renderer?.dispose();
      rendererRef.current = null;
    };
    // Init runs once per mount; shader/label identity is stable per component type.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shader, label]);

  useEffect(() => {
    rendererRef.current?.setUniforms(JSON.parse(uniformsKey) as Record<string, number>);
  }, [uniformsKey]);

  useEffect(() => {
    rendererRef.current?.setAnimate(animate !== false);
  }, [animate]);

  if (failed) {
    return <>{fallback ?? null}</>;
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
    />
  );
}
