import { describe, expect, it } from "vitest";
import { init, effect, target, frame } from "vgpu/node";
import { FIBER_FLOW_SHADER } from "../src/components/FiberFlow.tsx";

// Fullscreen opaque field (no clear); res 128×128 for a fast Dawn render.
const SIZE = 128;
const BASE = {
  time: 1.3, speed: 1, intensity: 1, scale: 1.6, strands: 22, sharp: 6,
  px: 0.5, py: 0.5, pActive: 0, resX: SIZE, resY: SIZE,
  c0r: 0.118, c0g: 0.106, c0b: 0.294, // #1e1b4b
  c1r: 0.310, c1g: 0.275, c1b: 0.898, // #4f46e5
  c2r: 0.647, c2g: 0.706, c2b: 0.988, // #a5b4fc
};

async function render(
  gpu: Awaited<ReturnType<typeof init>>,
  uniforms: Record<string, unknown>,
): Promise<Uint8Array> {
  const t = target(gpu, { size: [SIZE, SIZE], format: "rgba8unorm" });
  const fx = effect(gpu, FIBER_FLOW_SHADER, { set: { ...BASE, ...uniforms } });
  frame(gpu, (f) => f.pass({ target: t }, (p) => p.draw(fx)));
  return t.read();
}

function at(px: Uint8Array, x: number, y: number): [number, number, number, number] {
  const i = (y * SIZE + x) * 4;
  return [px[i]!, px[i + 1]!, px[i + 2]!, px[i + 3]!];
}

function maxLuminance(px: Uint8Array): number {
  let m = 0;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const [r, g, b] = at(px, x, y);
      m = Math.max(m, (r + g + b) / 3);
    }
  }
  return m;
}

function diffCount(a: Uint8Array, b: Uint8Array): number {
  let n = 0;
  for (let i = 0; i < a.length; i += 4) {
    if (Math.abs(a[i]! - b[i]!) + Math.abs(a[i + 1]! - b[i + 1]!) + Math.abs(a[i + 2]! - b[i + 2]!) > 6) n++;
  }
  return n;
}

describe("FiberFlow shader", () => {
  it("renders deterministically", async () => {
    const gpu = await init();
    const a = await render(gpu, {});
    const a2 = await render(gpu, {});
    expect([...a]).toEqual([...a2]);
  }, 60_000);

  it("is fully opaque", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    for (let i = 3; i < px.length; i += 4) expect(px[i]).toBe(255);
  }, 60_000);

  it("draws luminous fibers above the near-black base", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    // Near-black base ≈ (2,2,8)+deep*0.1 — any real fiber peak pushes well above.
    expect(maxLuminance(px)).toBeGreaterThan(40);
  }, 60_000);

  it("keeps fiber color indigo-dominant by default", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    let best = -Infinity;
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const [r, , b] = at(px, x, y);
        best = Math.max(best, b - r);
      }
    }
    expect(best).toBeGreaterThan(25); // brightest fiber is clearly blue-ish
  }, 60_000);

  it("recolors the field with the color uniforms", async () => {
    const gpu = await init();
    const px = await render(gpu, {
      c0r: 0.35, c0g: 0, c0b: 0, c1r: 1, c1g: 0, c1b: 0, c2r: 1, c2g: 0.4, c2b: 0.4,
    });
    let best = -Infinity;
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        const [r, , b] = at(px, x, y);
        best = Math.max(best, r - b);
      }
    }
    expect(best).toBeGreaterThan(40); // red field, red-dominant peaks
  }, 60_000);

  it("animates with time", async () => {
    const gpu = await init();
    const a = await render(gpu, { time: 0 });
    const b = await render(gpu, { time: 6 });
    const n = diffCount(a, b);
    expect(n).toBeGreaterThan(SIZE * SIZE * 0.01);
  }, 60_000);

  it("responds to the pointer (glow + parallax move the frame)", async () => {
    const gpu = await init();
    const rest = await render(gpu, { px: 0.1, py: 0.1, pActive: 0 });
    const near = await render(gpu, { px: 0.1, py: 0.1, pActive: 1 });
    const far = await render(gpu, { px: 0.9, py: 0.9, pActive: 1 });
    expect(diffCount(rest, near)).toBeGreaterThan(SIZE * SIZE * 0.005); // glow pocket
    expect(diffCount(near, far)).toBeGreaterThan(SIZE * SIZE * 0.005); // parallax
  }, 60_000);
});
