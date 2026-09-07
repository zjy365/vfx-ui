// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroAurora } from "../src/components/HeroAurora";
import { Magnetic } from "../src/components/Magnetic";
import { SpectralCard } from "../src/components/SpectralCard";
import { KineticText } from "../src/components/KineticText";

const capture = vi.hoisted(() => ({ uniforms: {} as Record<string, number> }));
vi.mock("../src/VfxCanvas.tsx", () => ({
  VfxCanvas: ({ uniforms }: { uniforms: Record<string, number> }) => {
    capture.uniforms = uniforms;
    return <canvas />;
  },
}));
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
let container: HTMLDivElement;
let root: Root;
let frames: Map<number, FrameRequestCallback>;
let frameId = 0;
let reduced = false;
function settle() {
  let count = 0;
  while (frames.size && count < 220) {
    const callbacks = [...frames.values()];
    frames.clear();
    act(() => callbacks.forEach((fn) => fn(++count * 16)));
  }
  expect(frames.size).toBe(0);
}
function bounds(el: Element) {
  el.getBoundingClientRect = () => ({
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    width: 200,
    height: 100,
    right: 200,
    bottom: 100,
    toJSON() {},
  });
}
function move(el: Element) {
  act(() => {
    el.dispatchEvent(
      new MouseEvent("pointermove", {
        bubbles: true,
        clientX: 180,
        clientY: 80,
      }),
    );
  });
}
beforeEach(() => {
  reduced = false;
  frames = new Map();
  frameId = 0;
  vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) => {
    frames.set(++frameId, fn);
    return frameId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
  vi.stubGlobal("matchMedia", () => ({
    get matches() {
      return reduced;
    },
    addEventListener() {},
    removeEventListener() {},
  }));
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  vi.unstubAllGlobals();
});

describe("consumer interaction contracts", () => {
  it("delivers pointer movement over Hero text to the decorative background", () => {
    act(() => root.render(<HeroAurora interactive title="My headline" />));
    bounds(container.querySelector("section")!);
    move(container.querySelector("h1")!);
    settle();
    expect(capture.uniforms.px).toBeCloseTo(0.9);
    expect(capture.uniforms.py).toBeCloseTo(0.8);
  });
  it("leaves a disabled Hero background at rest", () => {
    act(() => root.render(<HeroAurora interactive={false} />));
    bounds(container.querySelector("section")!);
    move(container.querySelector("h1")!);
    expect(frames.size).toBe(0);
    expect(capture.uniforms.px).toBe(0.5);
  });
  it("preserves real CTA destinations and button behavior", () => {
    const click = vi.fn();
    act(() =>
      root.render(
        <HeroAurora
          primaryCta={{ label: "Start", href: "/start" }}
          secondaryCta={{ label: "Open", onClick: click }}
        />,
      ),
    );
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/start");
    act(() => container.querySelector("button")!.click());
    expect(click).toHaveBeenCalledOnce();
    expect(container.querySelector('a[href="#"]')).toBeNull();
  });
  it("lets consumers replace the content and remove default CTAs", () => {
    act(() =>
      root.render(
        <HeroAurora primaryCta={null} secondaryCta={null}>
          <h2>Custom composition</h2>
        </HeroAurora>,
      ),
    );
    expect(container.querySelector("h2")?.textContent).toBe(
      "Custom composition",
    );
    expect(container.querySelector("h1, a, button")).toBeNull();
  });
  it("magnetic content moves, settles, and releases all animation frames", () => {
    act(() =>
      root.render(
        <Magnetic strength={20}>
          <a href="/go">Go</a>
        </Magnetic>,
      ),
    );
    const outer = container.firstElementChild!;
    bounds(outer);
    move(outer);
    settle();
    const inner = outer.firstElementChild as HTMLElement;
    expect(inner.style.transform).toContain("16");
    act(() => outer.dispatchEvent(new Event("pointerleave")));
    settle();
    expect(inner.style.transform).toBe("translate3d(0px,0px,0)");
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/go");
  });
  it("does not animate interaction components with reduced motion", () => {
    reduced = true;
    act(() =>
      root.render(
        <SpectralCard>
          <button>Content</button>
        </SpectralCard>,
      ),
    );
    const outer = container.firstElementChild!;
    bounds(outer);
    move(outer);
    expect(frames.size).toBe(0);
    expect(container.querySelector("button")?.textContent).toBe("Content");
  });
  it("cancels pending motion on unmount", () => {
    act(() => root.render(<Magnetic />));
    const outer = container.firstElementChild!;
    bounds(outer);
    move(outer);
    expect(frames.size).toBeGreaterThan(0);
    act(() => root.render(null));
    expect(frames.size).toBe(0);
  });
  it("renders the new components on the server with one accessible text label", () => {
    const html = renderToString(
      <>
        <KineticText text="Hello world" />
        <SpectralCard>
          <h2>Your content</h2>
        </SpectralCard>
        <Magnetic>
          <a href="/start">Start</a>
        </Magnetic>
      </>,
    );
    expect(html).toContain('aria-label="Hello world"');
    expect(html).toContain("Your content");
    expect(html).not.toContain("<canvas");
  });
});
