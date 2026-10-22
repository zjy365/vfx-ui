import { effect, frame, frameLoop, init, surface } from "vgpu";
import type { Gpu, Frame } from "vgpu";
import { TIME_UNIFORM, type VfxRenderer, type VfxRendererFactory, type VfxRendererOptions } from "./types.ts";

export interface CreateVfxRendererOptions extends VfxRendererOptions {
  /**
   * Pre-created Gpu context. When omitted, one is created via `init()`.
   * Tests inject a deterministic mock Gpu here (see packages/core/tests).
   */
  gpu?: Gpu;
}

/*
 * One Gpu per page: init() creates a fresh kernel every call, and vgpu's
 * surface-duplicate guard is per kernel — so two in-flight mounts on the same
 * canvas (React StrictMode double-mount) would both configure the shared
 * canvas context, and the stale mount's dispose() unconfigures it out from
 * under the live one. Sharing the Gpu makes the duplicate guard authoritative:
 * the stale attach throws VGPU-SURFACE-DUPLICATE instead of poisoning the
 * context, and the live mount renders on undisturbed.
 */
let browserGpu: Promise<Gpu> | null = null;

function sharedBrowserGpu(): Promise<Gpu> {
  browserGpu ??= init().catch((err: unknown) => {
    // A failed init (WebGPU unavailable) must not wedge every future canvas.
    browserGpu = null;
    throw err;
  });
  return browserGpu;
}

/**
 * vgpu-backed renderer: the primary (and currently only) implementation
 * of the vfx-ui renderer contract. Browser entry point.
 */
export const createVfxRenderer: VfxRendererFactory & { withGpu: (gpu: Gpu) => VfxRendererFactory } =
  Object.assign(
    async (canvas: HTMLCanvasElement, options: CreateVfxRendererOptions): Promise<VfxRenderer> => {
      const gpu = options.gpu ?? (await sharedBrowserGpu());
      return attachRenderer(gpu, canvas, options);
    },
    {
      /** Variant used by tests and multi-canvas hosts that own a Gpu already. */
      withGpu: (gpu: Gpu): VfxRendererFactory =>
        async (canvas, options) => attachRenderer(gpu, canvas, options),
    },
  );

async function attachRenderer(
  gpu: Gpu,
  canvas: HTMLCanvasElement,
  options: CreateVfxRendererOptions,
): Promise<VfxRenderer> {
  if (options.signal?.aborted) {
    throw new DOMException("vfx renderer attach aborted", "AbortError");
  }
  const label = options.label ?? "vfx";
  const surf = surface(gpu, canvas, {
    dpr: options.dpr,
    alphaMode: "premultiplied",
    label: `${label}-surface`,
  });
  const fx = effect(gpu, options.shader, {
    set: { ...(options.uniforms ?? {}) },
    label,
  });

  let animate = options.animate !== false;
  let elapsed = 0;
  let last = performance.now();
  let disposed = false;
  let refreshPending = false;
  let loop: ReturnType<typeof frameLoop> | undefined;
  const draw = (current: Frame) => {
    current.pass({ target: surf }, (pass) => pass.draw(fx));
  };
  // Surface auto-sizing runs when a frame opens. Observing the element wakes a
  // paused renderer without a permanent rAF or a reentrant surface.onResize frame.
  const refresh = () => {
    if (disposed || animate || refreshPending) return;
    refreshPending = true;
    queueMicrotask(() => {
      refreshPending = false;
      if (!disposed && !animate) frame(gpu, draw);
    });
  };
  const start = () => {
    if (disposed || loop) return;
    last = performance.now();
    loop = frameLoop(gpu, (current) => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      elapsed += dt;
      fx.set({ [TIME_UNIFORM]: elapsed });
      draw(current);
    }, options.fps != null ? { fps: options.fps } : undefined);
  };
  const observer = typeof ResizeObserver === "function" ? new ResizeObserver(refresh) : undefined;
  observer?.observe(canvas);
  if (typeof window !== "undefined") window.addEventListener("resize", refresh);
  if (animate) start();
  else refresh();

  return {
    label,
    setUniforms(values) {
      if (disposed) return;
      fx.set(values);
      refresh();
    },
    setAnimate(next) {
      if (disposed || next === animate) return;
      animate = next;
      if (next) start();
      else {
        loop?.stop();
        loop = undefined;
        refresh();
      }
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      loop?.stop();
      observer?.disconnect();
      if (typeof window !== "undefined") window.removeEventListener("resize", refresh);
      surf.dispose();
    },
  };
}
