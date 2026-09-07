"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { hexToRgb01 } from "../utils/color";
import { usePointerUniforms } from "../usePointerUniforms.ts";
import {
  createScene,
  destroyScene,
  prepareScene,
  presentScene,
  renderLighting,
  scaledSize,
  type AgentRadianceAnimation,
  type RadianceSettings,
} from "./RadianceEngine";

export interface RadiantDotsProps {
  /** Orbit or square arrangement; independent from Vercel's Agent mark. */
  layout?: "orbit" | "grid";
  /** Lighting choreography. */
  motion?: "wave" | "chase" | "pulse";
  /** Emitter color. */
  color?: string;
  /** Exposure multiplier. */
  intensity?: number;
  /** Animation speed; zero freezes the composition. */
  speed?: number;
  /** Illuminate emitters near the pointer. */
  interactive?: boolean;
  /** Freeze time while retaining a complete rendered light field. */
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
  fallback?: ReactNode;
}

export const RADIANT_DOTS_PRESETS = {
  pearl: {
    layout: "orbit",
    motion: "wave",
    color: "#eff5ff",
    intensity: 1,
    speed: 0.7,
  },
  ember: {
    layout: "grid",
    motion: "chase",
    color: "#ffb276",
    intensity: 1.1,
    speed: 0.6,
  },
  ice: {
    layout: "orbit",
    motion: "chase",
    color: "#a3dcff",
    intensity: 1,
    speed: 0.8,
  },
} as const;

const MOTIONS: Record<
  NonNullable<RadiantDotsProps["motion"]>,
  AgentRadianceAnimation
> = {
  wave: "center-out",
  chase: "edge-orbit",
  pulse: "edge-then-center",
};

/** Real jump-flooded distance fields + six-level radiance cascades, adapted
 * from Vercel's MIT example. Computation is capped at 320px; presentation
 * resolves neighboring probes at full canvas size. */
export function RadiantDots({
  layout = "orbit",
  motion = "wave",
  color = "#eff5ff",
  intensity = 1,
  speed = 0.7,
  interactive = false,
  animate = true,
  className,
  style,
  fallback,
}: RadiantDotsProps) {
  const [wrapRef, pointer, active] = usePointerUniforms<HTMLDivElement>({
    enabled: interactive,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const latest = useRef({
    layout,
    motion,
    color,
    intensity,
    speed,
    animate,
    pointer,
    active,
  });
  latest.current = {
    layout,
    motion,
    color,
    intensity,
    speed,
    animate,
    pointer,
    active,
  };
  const invalidate = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let raf = 0;
    let visible = true;
    let last = 0;
    let elapsed = 0.9;
    let dirty = true;
    let gpu: import("vgpu").Gpu | undefined;
    let output: import("vgpu").Surface | undefined;
    let scene: ReturnType<typeof createScene> | undefined;
    let api: typeof import("vgpu") | undefined;
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const canMove = () =>
      latest.current.animate && latest.current.speed > 0 && !media?.matches;
    const draw = () => {
      if (!scene || !output) return;
      const p = latest.current;
      const settings: RadianceSettings = {
        animation: MOTIONS[p.motion] ?? "center-out",
        color: hexToRgb01(p.color),
        layout: p.layout === "grid" ? 1 : 0,
        intensity: Math.max(0, p.intensity),
        px: p.pointer.x,
        py: p.pointer.y,
        active: p.active && !media?.matches ? 1 : 0,
      };
      renderLighting(scene, elapsed, "final", settings.animation, settings);
      presentScene(scene, output, "final", settings.intensity);
      canvas.dataset.ready = "true";
    };
    const fail = (error: unknown) => {
      if (disposed) return;
      console.error("[vfx-ui] radiance pipeline failed:", error);
      setFailed(true);
      dispose();
    };
    const tick = (now: number) => {
      raf = 0;
      if (disposed || !visible || document.hidden || !scene) return;
      if (dirty || now - last >= 1000 / 30) {
        if (canMove() && last)
          elapsed +=
            Math.min((now - last) / 1000, 0.1) *
            Math.max(0, latest.current.speed);
        last = now;
        dirty = false;
        try {
          draw();
        } catch (error) {
          fail(error);
          return;
        }
      }
      if (canMove()) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      dirty = true;
      if (!raf && scene && !disposed && visible && !document.hidden)
        raf = requestAnimationFrame(tick);
    };
    const reconcile = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
      wake();
    };
    const resize = () => {
      if (!gpu || !api || disposed) return;
      const size = scaledSize(
        canvas.clientWidth || 640,
        canvas.clientHeight || 480,
        1,
        320,
      );
      if (scene && scene.size[0] === size[0] && scene.size[1] === size[1]) {
        wake();
        return;
      }
      try {
        const next = createScene(gpu, size);
        if (scene) destroyScene(scene);
        scene = next;
        wake();
      } catch (error) {
        fail(error);
      }
    };
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(resize);
    const intersection =
      typeof IntersectionObserver === "undefined"
        ? undefined
        : new IntersectionObserver((entries) => {
            visible = entries[entries.length - 1]?.isIntersecting ?? true;
            reconcile();
          });
    function dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      intersection?.disconnect();
      media?.removeEventListener?.("change", reconcile);
      document.removeEventListener("visibilitychange", reconcile);
      try {
        if (scene) destroyScene(scene);
      } finally {
        gpu?.dispose();
      }
      invalidate.current = () => {};
    }
    invalidate.current = wake;
    media?.addEventListener?.("change", reconcile);
    document.addEventListener("visibilitychange", reconcile);
    void (async () => {
      api = await import("vgpu");
      if (disposed) return;
      const nextGpu = await api.init();
      if (disposed) {
        nextGpu.dispose();
        return;
      }
      gpu = nextGpu;
      output = api.surface(gpu, canvas, { dpr: 1 });
      const size = scaledSize(
        canvas.clientWidth || 640,
        canvas.clientHeight || 480,
        1,
        320,
      );
      scene = createScene(gpu, size);
      await prepareScene(scene, output.format);
      if (disposed) return;
      resizeObserver?.observe(canvas);
      intersection?.observe(canvas);
      wake();
    })().catch(fail);
    return dispose;
  }, []);

  useEffect(
    () => invalidate.current(),
    [layout, motion, color, intensity, speed, animate, pointer, active],
  );
  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#030405",
        ...style,
      }}
    >
      {failed ? (
        (fallback ?? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: "#eff5ff",
            }}
          >
            Light field unavailable
          </div>
        ))
      ) : (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
