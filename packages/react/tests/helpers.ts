import { afterAll, expect } from "vitest";

type TestGpu = Awaited<ReturnType<typeof import("vgpu/node").init>>;
let gpuPromise: Promise<TestGpu> | undefined;

// Dawn's native instance must stay alive until every device in the file has
// finished. Repeated software init() calls replace that instance in vgpu 0.3.1.
export function getTestGpu(): Promise<TestGpu> {
  return gpuPromise ??= import("vgpu/node").then(({ init }) => init());
}

afterAll(async () => {
  const pending = gpuPromise;
  gpuPromise = undefined;
  // Initialization failures are already reported by the test that requested it.
  if (pending) (await pending.catch(() => undefined))?.dispose();
});

/** Offscreen target edge used by every component pixel test. */
export const SIZE = 16;

/**
 * Dawn test harness: boots vgpu/node once and returns a render function
 * that rasterizes a shader into a 16x16 rgba8unorm target and reads it back.
 */
export async function createRenderer(): Promise<
  (shader: string, uniforms: Record<string, number>) => Promise<Uint8Array>
> {
  const { effect, target, frame } = await import("vgpu/node");
  const gpu = await getTestGpu();
  return async (shader, uniforms) => {
    const t = target(gpu, { size: [SIZE, SIZE], format: "rgba8unorm" });
    try {
      const fx = effect(gpu, shader, { set: uniforms });
      frame(gpu, (f) => f.pass({ target: t }, (p) => p.draw(fx)));
      return await t.read();
    } finally {
      t.color.destroy();
    }
  };
}

/** Mean of every byte in the RGBA readback. */
export function mean(rgba: Uint8Array): number {
  let sum = 0;
  for (const v of rgba) sum += v;
  return sum / rgba.length;
}

/** Number of pixels whose brightest channel exceeds the threshold. */
export function brightCount(rgba: Uint8Array, threshold: number): number {
  let count = 0;
  for (let i = 0; i < rgba.length; i += 4) {
    const r = rgba[i] ?? 0;
    const g = rgba[i + 1] ?? 0;
    const b = rgba[i + 2] ?? 0;
    if (Math.max(r, g, b) > threshold) count += 1;
  }
  return count;
}

/** Shared assertions: deterministic for identical uniforms, alive over time. */
export async function expectDeterministicAndAnimated(
  render: (shader: string, uniforms: Record<string, number>) => Promise<Uint8Array>,
  shader: string,
  uniformsAt: (time: number) => Record<string, number>,
): Promise<void> {
  const a = await render(shader, uniformsAt(0.37));
  const a2 = await render(shader, uniformsAt(0.37));
  const b = await render(shader, uniformsAt(2.1));

  expect(a.length).toBe(SIZE * SIZE * 4);
  expect(a[3]).toBe(255);
  expect([...a]).toEqual([...a2]);
  expect([...a]).not.toEqual([...b]);
}
