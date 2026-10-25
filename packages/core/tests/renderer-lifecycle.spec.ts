import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Frame, Gpu } from "vgpu";
import { createVfxRenderer } from "../src/renderer.ts";

const runtime = vi.hoisted(() => ({
  callbacks: [] as Array<(value: Frame) => void>,
  stops: [] as Array<ReturnType<typeof vi.fn>>,
  draw: vi.fn(), set: vi.fn(), dispose: vi.fn(), single: vi.fn(),
}));
vi.mock("vgpu", () => ({
  init: vi.fn(),
  surface: () => ({ dispose: runtime.dispose }),
  effect: () => ({ set: runtime.set }),
  frame: (_gpu: unknown, callback: (value: Frame) => void) => {
    runtime.single();
    callback({ pass: (_target: unknown, body: (pass: unknown) => void) => body({ draw: runtime.draw }) } as unknown as Frame);
  },
  frameLoop: (_gpu: unknown, callback: (value: Frame) => void) => {
    runtime.callbacks.push(callback);
    const stop = vi.fn();
    runtime.stops.push(stop);
    return { stop };
  },
}));
let resized: () => void;
const disconnect = vi.fn();
const attach = (animate: boolean) => createVfxRenderer.withGpu({} as Gpu)({} as HTMLCanvasElement, { shader: "test", animate });
beforeEach(() => {
  vi.clearAllMocks();
  runtime.callbacks.length = 0;
  runtime.stops.length = 0;
  vi.stubGlobal("ResizeObserver", class {
    constructor(callback: () => void) { resized = callback; }
    observe() {}
    disconnect = disconnect;
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("renderer scheduling", () => {
  it("draws static canvases once and coalesces uniform and resize refreshes", async () => {
    const renderer = await attach(false);
    expect(runtime.callbacks).toHaveLength(0);
    expect(runtime.single).toHaveBeenCalledOnce();
    renderer.setUniforms({ speed: 2 });
    renderer.setUniforms({ speed: 3 });
    await Promise.resolve();
    expect(runtime.single).toHaveBeenCalledTimes(2);
    resized();
    await Promise.resolve();
    expect(runtime.single).toHaveBeenCalledTimes(3);
    expect(runtime.set).not.toHaveBeenCalledWith(expect.objectContaining({ time: expect.anything() }));
    renderer.dispose();
  });

  it("stops continuous drawing, resumes with a new loop, and disposes idempotently", async () => {
    const renderer = await attach(true);
    expect(runtime.callbacks).toHaveLength(1);
    renderer.setAnimate(false);
    expect(runtime.stops[0]).toHaveBeenCalledOnce();
    await Promise.resolve();
    renderer.setAnimate(true);
    renderer.setAnimate(true);
    expect(runtime.callbacks).toHaveLength(2);
    renderer.dispose();
    renderer.dispose();
    expect(runtime.stops[1]).toHaveBeenCalledOnce();
    expect(runtime.dispose).toHaveBeenCalledOnce();
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("cancels queued refresh work before resource teardown", async () => {
    const renderer = await attach(false);
    const count = runtime.single.mock.calls.length;
    renderer.setUniforms({ speed: 2 });
    renderer.dispose();
    await Promise.resolve();
    resized();
    renderer.setUniforms({ speed: 3 });
    renderer.setAnimate(true);
    await Promise.resolve();
    expect(runtime.single).toHaveBeenCalledTimes(count);
    expect(runtime.callbacks).toHaveLength(0);
  });
});
