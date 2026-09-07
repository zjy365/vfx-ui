// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { RadiantDots } from "../src/components/RadiantDots";
const mock = vi.hoisted(() => ({
  init: vi.fn(),
  dispose: vi.fn(),
  create: vi.fn(),
  destroy: vi.fn(),
  render: vi.fn(),
  present: vi.fn(),
}));
vi.mock("vgpu", () => ({
  init: mock.init,
  surface: () => ({ format: "rgba8unorm" }),
}));
vi.mock("../src/components/RadianceEngine", () => ({
  scaledSize: () => [320, 200],
  createScene: mock.create,
  destroyScene: mock.destroy,
  prepareScene: async () => {},
  renderLighting: mock.render,
  presentScene: mock.present,
}));
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let host: HTMLDivElement;
let frames: Map<number, FrameRequestCallback>;
let next = 0;
let reduced = false;
let changes: Set<() => void>;
let intersect: (entries: { isIntersecting: boolean }[]) => void;
function step(time = 40) {
  const callbacks = [...frames.values()];
  frames.clear();
  act(() => callbacks.forEach((fn) => fn(time)));
}
beforeEach(() => {
  vi.clearAllMocks();
  next = 0;
  reduced = false;
  frames = new Map();
  changes = new Set();
  mock.init.mockResolvedValue({ dispose: mock.dispose });
  mock.create.mockReturnValue({ size: [320, 200] });
  vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => {
    frames.set(++next, fn);
    return next;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return reduced;
    },
    addEventListener: (_: string, fn: () => void) => changes.add(fn),
    removeEventListener: (_: string, fn: () => void) => changes.delete(fn),
  }));
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(fn: typeof intersect) {
        intersect = fn;
      }
      observe() {}
      disconnect() {}
    },
  );
  host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
});
afterEach(() => {
  act(() => root.unmount());
  host.remove();
  vi.unstubAllGlobals();
});
it("suspends offscreen and under reduced motion, resumes, then releases GPU resources", async () => {
  await act(async () => root.render(<RadiantDots />));
  step();
  expect(mock.render).toHaveBeenCalledOnce();
  expect(frames.size).toBe(1);
  act(() => intersect([{ isIntersecting: false }]));
  expect(frames.size).toBe(0);
  act(() => intersect([{ isIntersecting: true }]));
  step(100);
  expect(frames.size).toBe(1);
  reduced = true;
  act(() => changes.forEach((fn) => fn()));
  step(140);
  expect(frames.size).toBe(0);
  reduced = false;
  act(() => changes.forEach((fn) => fn()));
  step(180);
  expect(frames.size).toBe(1);
  act(() => root.render(null));
  expect(frames.size).toBe(0);
  expect(mock.destroy).toHaveBeenCalledOnce();
  expect(mock.dispose).toHaveBeenCalledOnce();
});
it("updates a paused composition without starting an animation loop", async () => {
  await act(async () => root.render(<RadiantDots animate={false} />));
  step();
  expect(frames.size).toBe(0);
  await act(async () =>
    root.render(<RadiantDots animate={false} layout="grid" color="#ff0000" />),
  );
  step(100);
  expect(mock.render.mock.lastCall?.[4]).toMatchObject({
    layout: 1,
    color: [1, 0, 0],
  });
  expect(frames.size).toBe(0);
});
it("disposes a device that arrives after unmount without allocating the field", async () => {
  let finish: (value: unknown) => void = () => {};
  mock.init.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  await act(async () => root.render(<RadiantDots />));
  act(() => root.render(null));
  await act(async () => finish({ dispose: mock.dispose }));
  expect(mock.create).not.toHaveBeenCalled();
  expect(mock.dispose).toHaveBeenCalledOnce();
  expect(frames.size).toBe(0);
});
it("shows the supplied fallback when GPU initialization fails", async () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  mock.init.mockRejectedValue(new Error("WebGPU unavailable"));
  await act(async () =>
    root.render(<RadiantDots fallback={<span>Static artwork</span>} />),
  );
  expect(host.textContent).toBe("Static artwork");
  expect(frames.size).toBe(0);
  error.mockRestore();
});
