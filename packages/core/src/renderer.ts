import { effect, frameLoop, init, surface } from "vgpu";
import type { Gpu } from "vgpu";
import { TIME_UNIFORM, type VfxRenderer, type VfxRendererFactory, type VfxRendererOptions } from "./types.ts";

export interface CreateVfxRendererOptions extends VfxRendererOptions {
  /**
   * Pre-created Gpu context. When omitted, one is created via `init()`.
   * Tests inject a deterministic mock Gpu here (see packages/core/tests).
   */
  gpu?: Gpu;
}

/**
 * vgpu-backed renderer: the primary (and currently only) implementation
 * of the vfx-ui renderer contract. Browser entry point.
 */
export const createVfxRenderer: VfxRendererFactory & { withGpu: (gpu: Gpu) => VfxRendererFactory } =
  Object.assign(
    async (canvas: HTMLCanvasElement, options: CreateVfxRendererOptions): Promise<VfxRenderer> => {
      const gpu = options.gpu ?? (await init());
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

  const loop = frameLoop(
    gpu,
    (frame) => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (animate) {
        elapsed += dt;
        fx.set({ [TIME_UNIFORM]: elapsed });
      }
      frame.pass({ target: surf }, (p) => {
        p.draw(fx);
      });
    },
    options.fps != null ? { fps: options.fps } : undefined,
  );

  return {
    label,
    setUniforms(values) {
      fx.set(values);
    },
    setAnimate(next) {
      if (next && !animate) last = performance.now();
      animate = next;
    },
    dispose() {
      loop.stop();
      surf.dispose();
    },
  };
}
