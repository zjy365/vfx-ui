// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { VfxCanvas } from "../src/VfxCanvas";
const mock = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock("@vfx-ui/core", () => ({ createVfxRenderer: mock.create }));
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
let root: Root;
let host: HTMLDivElement;
let reduced = false;
let change: (() => void) | undefined;
let resolve: (renderer: any) => void;
const renderer = {
  setUniforms: vi.fn(),
  setAnimate: vi.fn(),
  dispose: vi.fn(),
  label: "test",
};
beforeEach(() => {
  vi.clearAllMocks();
  reduced = false;
  change = undefined;
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return reduced;
    },
    addEventListener: (_: string, fn: () => void) => {
      change = fn;
    },
    removeEventListener() {},
  }));
  mock.create.mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
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
it("applies the latest uniforms after asynchronous GPU initialization", async () => {
  act(() => root.render(<VfxCanvas shader="test" uniforms={{ px: 0.5 }} />));
  act(() => root.render(<VfxCanvas shader="test" uniforms={{ px: 0.9 }} />));
  await act(async () => {
    resolve(renderer);
  });
  expect(mock.create).toHaveBeenCalledOnce();
  expect(renderer.setUniforms).toHaveBeenLastCalledWith({ px: 0.9 });
});
it("reacts to reduced-motion changes and does not let animate=true override them", async () => {
  act(() => root.render(<VfxCanvas shader="test" animate={false} />));
  await act(async () => {
    resolve(renderer);
  });
  reduced = true;
  act(() => {
    change?.();
  });
  act(() => root.render(<VfxCanvas shader="test" animate />));
  expect(renderer.setAnimate).toHaveBeenLastCalledWith(false);
  reduced = false;
  act(() => {
    change?.();
  });
  expect(renderer.setAnimate).toHaveBeenLastCalledWith(true);
});
it("disposes a renderer that arrives after its canvas unmounted", async () => {
  act(() => root.render(<VfxCanvas shader="test" />));
  act(() => root.render(null));
  expect(mock.create.mock.calls[0]![1].signal.aborted).toBe(true);
  await act(async () => {
    resolve(renderer);
  });
  expect(renderer.dispose).toHaveBeenCalledOnce();
  expect(renderer.setUniforms).not.toHaveBeenCalled();
});
