import { describe, expect, it } from "vitest";
import { init, effect, target, frame } from "vgpu/node";
import { LIGHT_PRISM_SHADER } from "../src/components/LightPrism.tsx";

// Fullscreen opaque field (no clear); res 128×128 for a fast Dawn render.
const SIZE = 128;
const BASE = {
  time: 1.3, speed: 1, prismSize: 0.3, beamWidth: 0.0045, refraction: 0.16,
  dispersion: 0.5, shadow: 1, px: 0.5, py: 0.5, pActive: 0, resX: SIZE, resY: SIZE,
  c0r: 0.914, c0g: 0.902, c0b: 0.875, // #e9e6df paper
  c1r: 0.659, c1g: 0.643, c1b: 0.608, // #a8a49b glass
  c2r: 1, c2g: 1, c2b: 1, // white beam
};

async function render(
  gpu: Awaited<ReturnType<typeof init>>,
  uniforms: Record<string, unknown>,
): Promise<Uint8Array> {
  const t = target(gpu, { size: [SIZE, SIZE], format: "rgba8unorm" });
  const fx = effect(gpu, LIGHT_PRISM_SHADER, { set: { ...BASE, ...uniforms } });
  frame(gpu, (f) => f.pass({ target: t }, (p) => p.draw(fx)));
  return t.read();
}

function at(px: Uint8Array, x: number, y: number): [number, number, number, number] {
  const i = (y * SIZE + x) * 4;
  return [px[i]!, px[i + 1]!, px[i + 2]!, px[i + 3]!];
}

function lum(px: Uint8Array, x: number, y: number): number {
  const [r, g, b] = at(px, x, y);
  return (r + g + b) / 3;
}

function maxLuminance(px: Uint8Array): number {
  let m = 0;
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      m = Math.max(m, lum(px, x, y));
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

describe("LightPrism shader", () => {
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

  it("draws the white beam bright over dark paper", async () => {
    const gpu = await init();
    const px = await render(gpu, { c0r: 0.5, c0g: 0.5, c0b: 0.5, c1r: 0.3, c1g: 0.3, c1b: 0.3 });
    expect(maxLuminance(px)).toBeGreaterThan(200);
  }, 60_000);

  it("darkens the interior of the prism relative to bare paper", async () => {
    const gpu = await init();
    // (64, 40) sits inside the default triangle, clear of the beam and shadow.
    const glass = await render(gpu, {});
    const noPrism = await render(gpu, { prismSize: 0.05, shadow: 0 });
    expect(lum(noPrism, 64, 40) - lum(glass, 64, 40)).toBeGreaterThan(12);
  }, 60_000);

  it("bends the beam with the refraction uniform", async () => {
    const gpu = await init();
    const straight = await render(gpu, { refraction: 0 });
    const bent = await render(gpu, { refraction: 0.3 });
    expect(diffCount(straight, bent)).toBeGreaterThan(SIZE * SIZE * 0.005);
  }, 60_000);

  it("splits spectral fringes with the dispersion uniform", async () => {
    const gpu = await init();
    const mono = await render(gpu, { dispersion: 0 });
    const split = await render(gpu, { dispersion: 3 });
    expect(diffCount(mono, split)).toBeGreaterThan(SIZE * SIZE * 0.002);
  }, 60_000);

  it("grounds the prism with the cast shadow", async () => {
    const gpu = await init();
    const off = await render(gpu, { shadow: 0 });
    const on = await render(gpu, { shadow: 1 });
    expect(diffCount(off, on)).toBeGreaterThan(SIZE * SIZE * 0.005);
  }, 60_000);

  it("animates with time", async () => {
    const gpu = await init();
    const a = await render(gpu, { time: 0 });
    const b = await render(gpu, { time: 6 });
    expect(diffCount(a, b)).toBeGreaterThan(SIZE * SIZE * 0.01);
  }, 60_000);

  it("responds to the pointer only when active", async () => {
    const gpu = await init();
    const rest = await render(gpu, { px: 0.2, py: 0.3, pActive: 0 });
    const idle = await render(gpu, {});
    expect(diffCount(rest, idle)).toBeLessThan(SIZE * SIZE * 0.001); // gated at rest
    const near = await render(gpu, { px: 0.2, py: 0.3, pActive: 1 });
    expect(diffCount(near, idle)).toBeGreaterThan(SIZE * SIZE * 0.01); // tilt + pools move
  }, 60_000);
});
