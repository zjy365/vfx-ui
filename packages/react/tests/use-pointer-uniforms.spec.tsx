// @vitest-environment jsdom
import { act } from "react";
import { createElement, type RefObject } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POINTER_REST, usePointerUniforms, type PointerUniform } from "../src/usePointerUniforms.ts";

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;

/** Manual rAF queue: the hook only schedules frames while converging. */
let rafQueue: FrameRequestCallback[] = [];

function flushFrames(max = 300): number {
  let ran = 0;
  // React 18 batches the setState inside each tick until act() exits, and the
  // next frame is only scheduled when that update renders — so drain one act
  // block per frame until the hook stops scheduling (converged).
  while (ran < max) {
    let ranThisBlock = 0;
    act(() => {
      while (rafQueue.length && ran + ranThisBlock < max) {
        const cb = rafQueue.shift()!;
        cb(performance.now());
        ranThisBlock += 1;
      }
    });
    ran += ranThisBlock;
    if (!rafQueue.length) break;
  }
  return ran;
}

interface Probe {
  ref: RefObject<HTMLDivElement>;
  pointer: PointerUniform;
  active: boolean;
}

let latest: Probe;

function ProbeComponent() {
  const [ref, pointer, active] = usePointerUniforms<HTMLDivElement>();
  latest = { ref, pointer, active };
  return createElement("div", { ref });
}

const RECT = { left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: () => ({}) };

function move(el: HTMLDivElement, x: number, y: number) {
  act(() => {
    el.dispatchEvent(new MouseEvent("pointermove", { bubbles: true, clientX: x, clientY: y }));
  });
}

describe("usePointerUniforms", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    rafQueue = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      rafQueue.push(cb);
      return rafQueue.length;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    act(() => root.render(createElement(ProbeComponent)));
    const el = latest.ref.current!;
    el.getBoundingClientRect = () => RECT as DOMRect;
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.unstubAllGlobals();
  });

  it("rests at POINTER_REST with no scheduled frames", () => {
    expect(latest.pointer).toEqual(POINTER_REST);
    expect(latest.active).toBe(false);
    expect(flushFrames()).toBe(0);
  });

  it("eases toward the pointer and stops once converged", () => {
    const el = latest.ref.current!;
    move(el, 25, 75);
    const frames = flushFrames();
    expect(frames).toBeGreaterThan(10); // eased over many frames, not a snap
    expect(latest.pointer.x).toBeCloseTo(0.25, 3);
    expect(latest.pointer.y).toBeCloseTo(0.75, 3);
    expect(latest.active).toBe(true);
    expect(rafQueue.length).toBe(0); // loop stopped after converging
  });

  it("tracks successive moves through the same loop", () => {
    const el = latest.ref.current!;
    move(el, 90, 10);
    flushFrames();
    expect(latest.pointer.x).toBeCloseTo(0.9, 3);
    move(el, 10, 90);
    flushFrames();
    expect(latest.pointer.x).toBeCloseTo(0.1, 3);
    expect(latest.pointer.y).toBeCloseTo(0.9, 3);
  });

  it("returns to rest and inactive on pointerleave", () => {
    const el = latest.ref.current!;
    move(el, 80, 20);
    flushFrames();
    expect(latest.active).toBe(true);
    act(() => {
      el.dispatchEvent(new MouseEvent("pointerleave"));
    });
    flushFrames();
    expect(latest.pointer).toEqual(POINTER_REST);
    expect(latest.active).toBe(false);
    expect(rafQueue.length).toBe(0);
  });

  it("clamps coordinates at the element edges", () => {
    const el = latest.ref.current!;
    move(el, 250, -50);
    flushFrames();
    expect(latest.pointer).toEqual({ x: 1, y: 0 });
  });
});
