"use client";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  createPrismRuntime,
  destroyPrismRuntime,
  createLightPipeline,
  DEFAULT_PRISM_CONTROLS,
  setRuntimeControls,
  setRuntimeLampAim,
  setRuntimeOrbit,
  resizeRuntime,
} from "./PrismEngine";

/** Complete MIT Vercel optical pipeline, with a React-owned lifecycle. */
export function PrismScene({
  speed = 1,
  prismSize = 0.3,
  beamWidth = 0.0045,
  refraction = 0.16,
  dispersion = 0.22,
  from = "#d2ccc2",
  shadow = 1,
  interactive = false,
  className,
  style,
  fallback,
}: {
  speed?: number;
  prismSize?: number;
  beamWidth?: number;
  refraction?: number;
  dispersion?: number;
  from?: string;
  shadow?: number;
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  fallback?: ReactNode;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const invalidate = useRef(() => {});
  const latest = useRef({
    speed,
    prismSize,
    beamWidth,
    refraction,
    dispersion,
    from,
    shadow,
    interactive,
  });
  latest.current = {
    speed,
    prismSize,
    beamWidth,
    refraction,
    dispersion,
    from,
    shadow,
    interactive,
  };
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const canvas = element;
    let disposed = false,
      ready = false,
      raf = 0,
      visible = true,
      last = 0,
      elapsed = 0;
    let release = () => {};
    const pointer = { x: 0, y: 0 };
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      wake();
    };
    const leave = () => {
      pointer.x = 0;
      pointer.y = 0;
      wake();
    };
    let draw = () => {};
    const tick = (now: number) => {
      raf = 0;
      if (disposed || !ready || !visible || document.hidden) return;
      if (!last || now - last > 1000 / 45) {
        elapsed += last
          ? Math.min(0.1, (now - last) / 1000) * latest.current.speed
          : 0;
        last = now;
        try {
          draw();
        } catch (error) {
          console.error("[vfx-ui] prism", error);
          setFailed(true);
          cleanup();
          return;
        }
      }
      if (!media.matches && latest.current.speed > 0)
        raf = requestAnimationFrame(tick);
    };
    function wake() {
      last=0;
      if (!raf && !disposed && ready && visible && !document.hidden)
        raf = requestAnimationFrame(tick);
    }
    invalidate.current = wake;
    const ro = new ResizeObserver(wake);
    ro.observe(canvas);
    const visibility = () => {
      last = 0;
      wake();
    };
    const io = new IntersectionObserver((entries) => {
      visible = entries.at(-1)?.isIntersecting ?? true;
      visibility();
    });
    io.observe(canvas);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    media.addEventListener("change", visibility);
    function cleanup() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      invalidate.current = () => {};
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      media.removeEventListener("change", visibility);
      if (ready) release();
    }
    void (async () => {
      const api = await import("vgpu");
      if (disposed) return;
      const gpu = await api.init();
      if (disposed) {
        gpu.dispose();
        return;
      }
      let runtime: any, pipeline: any;
      release = () => {
        pipeline?.destroy();
        if (runtime) destroyPrismRuntime(runtime);
        gpu.dispose();
      };
      try {
        const output = api.surface(gpu, canvas, {
          dpr: Math.min(devicePixelRatio, 1.5),
        });
        runtime = createPrismRuntime(gpu, output.size, "vfx-prism");
        pipeline = createLightPipeline(runtime);
        await pipeline.prepare(output);
        if (disposed) {
          release();
          return;
        }
        ready = true;
        draw = () => {
          const p = latest.current;
          resizeRuntime(runtime, output.size);
          pipeline.resize(output.size);
          setRuntimeControls(runtime, {
            ...DEFAULT_PRISM_CONTROLS,
            wallColor: p.from,
            lightMode: {
              ...DEFAULT_PRISM_CONTROLS.lightMode,
              wall: {
                ...DEFAULT_PRISM_CONTROLS.lightMode.wall,
                shadowContrast: 6.85 * p.shadow,
              },
            },
            cameraFov: (48 * 0.3) / Math.max(0.15, p.prismSize),
            beamWidth:
              (DEFAULT_PRISM_CONTROLS.beamWidth * p.beamWidth) / 0.0045,
            spectralDispersion: {
              base: 1.2 + (p.refraction - 0.16),
              strength: (0.1 * p.dispersion) / 0.22,
            },
          });
          const x = p.interactive ? pointer.x : 0,
            y = p.interactive ? pointer.y : 0;
          setRuntimeLampAim(
            runtime,
            0.5 +
              x * 0.2 +
              (media.matches ? 0 : Math.sin(elapsed * 0.18) * 0.08),
            0.5 + y * 0.15,
          );
          setRuntimeOrbit(runtime, x * 0.2, y * 0.12);
          pipeline.bind(elapsed, { revealProgress: 1, beamWidthReveal: 1 });
          api.frame(gpu, (frame) => pipeline.render(frame, output));
          canvas.dataset.ready = "true";
        };
        wake();
      } catch (error) {
        release();
        if (!disposed) {
          setFailed(true);
          console.error("[vfx-ui] prism initialization", error);
        }
        cleanup();
      }
    })().catch((error) => {
      if (!disposed) {
        console.error("[vfx-ui] prism", error);
        setFailed(true);
        cleanup();
      }
    });
    return cleanup;
  }, []);
  useEffect(
    () => invalidate.current(),
    [
      speed,
      prismSize,
      beamWidth,
      refraction,
      dispersion,
      from,
      shadow,
      interactive,
    ],
  );
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#d2ccc2",
        ...style,
      }}
    >
      {failed ? (
        (fallback ?? <div style={{ padding: 24 }}>WebGPU unavailable</div>)
      ) : (
        <canvas
          ref={ref}
          aria-hidden="true"
          style={{ display: "block", width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
