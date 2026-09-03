/**
 * Core contracts for vfx-ui renderers.
 *
 * The only binding layer between React components and GPU runtimes.
 * vgpu is the primary implementation; its API changes must be
 * absorbed here and nowhere else (see PLAN.md §4).
 */

/** Uniforms bag: keys are WGSL struct field names. Scalars for f32 fields; nested arrays pack vec/array uniforms. */
export type VfxUniforms = Record<string, number | number[][]>;

/** A WGSL fullscreen-fragment effect source. No @vertex stage required — vgpu injects one. */
export type VfxShaderSource = string;

/** Canonical uniform name for animation time, in seconds. */
export const TIME_UNIFORM = "time";

export interface VfxRendererOptions {
  /** WGSL effect source (fullscreen fragment). */
  shader: VfxShaderSource;
  /** Initial uniform values. `time` is managed by the renderer unless `animate` is false. */
  uniforms?: VfxUniforms;
  /** Advance the `time` uniform every frame. Defaults to true. */
  animate?: boolean;
  /** Device pixel ratio, or a [min, max] clamp. Defaults to the display's DPR. */
  dpr?: number | readonly [number, number];
  /** Frame rate cap for the render loop. */
  fps?: number;
  /** Debug label surfaced in vgpu errors. */
  label?: string;
  /**
   * Aborted before attach = the mount is stale (e.g. StrictMode double-mount):
   * the factory rejects with an AbortError instead of touching the canvas, so a
   * stale mount can never configure — or unconfigure — a canvas it no longer owns.
   */
  signal?: AbortSignal;
}

export interface VfxRenderer {
  readonly label: string;
  /** Update uniform values (WGSL field names). */
  setUniforms(values: VfxUniforms): void;
  /** Pause/resume time advancement. Resuming resets the delta clock. */
  setAnimate(animate: boolean): void;
  /** Stop the frame loop and release GPU resources. */
  dispose(): void;
}

/**
 * Create a renderer bound to a canvas. The canvas must already be in the
 * document (layout-backed), and the caller owns its lifecycle.
 */
export type VfxRendererFactory = (
  canvas: HTMLCanvasElement,
  options: VfxRendererOptions,
) => Promise<VfxRenderer>;
