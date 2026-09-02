import { describe, expect, it } from "vitest";
import { init, effect, target, frame } from "vgpu/node";
import { CHROMA_FLOW_SHADER, CHROMA_FLOW_DEFAULTS } from "../src/components/ChromaFlow.tsx";

// Fullscreen opaque field (no clear); res 128×128 for a fast Dawn render.
const SIZE = 128;
const D = CHROMA_FLOW_DEFAULTS;
const rgb = (hex: string) => [
  parseInt(hex.slice(1, 3), 16) / 255,
  parseInt(hex.slice(3, 5), 16) / 255,
  parseInt(hex.slice(5, 7), 16) / 255,
];
const c = [D.baseColor, D.upColor, D.downColor, D.leftColor, D.rightColor].map(rgb);
const BASE = {
  time: 1.3, speed: D.speed, intensity: D.intensity, radius: D.radius,
  momentum: D.momentum, ambient: D.ambient,
  px: 0.5, py: 0.5, pActive: 0, vx: 0, vy: 0,
  c0r: c[0]![0], c0g: c[0]![1], c0b: c[0]![2],
  c1r: c[1]![0], c1g: c[1]![1], c1b: c[1]![2],
  c2r: c[2]![0], c2g: c[2]![1], c2b: c[2]![2],
  c3r: c[3]![0], c3g: c[3]![1], c3b: c[3]![2],
  c4r: c[4]![0], c4g: c[4]![1], c4b: c[4]![2],
};

async function render(
  gpu: Awaited<ReturnType<typeof init>>,
  uniforms: Record<string, unknown>,
): Promise<Uint8Array> {
  const t = target(gpu, { size: [SIZE, SIZE], format: "rgba8unorm" });
  const fx = effect(gpu, CHROMA_FLOW_SHADER, { set: { ...BASE, ...uniforms } });
  frame(gpu, (f) => f.pass({ target: t }, (p) => p.draw(fx)));
  return t.read();
}

function at(px: Uint8Array, x: number, y: number): [number, number, number, number] {
  const i = (y * SIZE + x) * 4;
  return [px[i]!, px[i + 1]!, px[i + 2]!, px[i + 3]!];
}

/** Mean channel triple over a horizontal band (rows y0..y1). */
function bandMean(px: Uint8Array, y0: number, y1: number): [number, number, number] {
  let r = 0, g = 0, b = 0, n = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = 0; x < SIZE; x++) {
      const [pr, pg, pb] = at(px, x, y);
      r += pr; g += pg; b += pb; n++;
    }
  }
  return [r / n, g / n, b / n];
}

function diffCount(a: Uint8Array, b: Uint8Array): number {
  let n = 0;
  for (let i = 0; i < a.length; i += 4) {
    if (Math.abs(a[i]! - b[i]!) + Math.abs(a[i + 1]! - b[i + 1]!) + Math.abs(a[i + 2]! - b[i + 2]!) > 6) n++;
  }
  return n;
}

describe("ChromaFlow shader", () => {
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

  it("paints the top band blue and the bottom band light", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    const top = bandMean(px, 0, 12);
    const bottom = bandMean(px, SIZE - 12, SIZE);
    expect(top[2] - top[0]).toBeGreaterThan(30); // blue-dominant at top
    expect(bottom[0]).toBeGreaterThan(top[0]); // bottom (near-white) brighter red than top
    expect(bottom[2]).toBeGreaterThan(100); // and clearly light
  }, 60_000);

  it("keeps the true center darker than the top edge", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    // A tight square around the middle — a full-width band would include the
    // bright left/right edge bleeds and invert the comparison.
    let center = 0;
    for (let y = SIZE / 2 - 6; y < SIZE / 2 + 6; y++) {
      for (let x = SIZE / 2 - 6; x < SIZE / 2 + 6; x++) {
        const [r, g, b] = at(px, x, y);
        center += r + g + b;
      }
    }
    const top = bandMean(px, 0, 12);
    expect(center / 144).toBeLessThan(top[0] + top[1] + top[2]);
  }, 60_000);

  it("floods the top edge on an upward sweep", async () => {
    const gpu = await init();
    const rest = await render(gpu, {});
    const sweepUp = await render(gpu, { vy: -0.05 });
    const sweepDown = await render(gpu, { vy: 0.05 });
    // The two sweeps must disagree, and both differ from rest.
    expect(diffCount(rest, sweepUp)).toBeGreaterThan(SIZE * SIZE * 0.01);
    expect(diffCount(rest, sweepDown)).toBeGreaterThan(SIZE * SIZE * 0.01);
    expect(diffCount(sweepUp, sweepDown)).toBeGreaterThan(SIZE * SIZE * 0.01);
    // Upward sweep (vy<0 in CSS-down coords) floods the top edge with blue:
    // the top band's blue channel gains over the downward sweep.
    const blue = (px: Uint8Array) => bandMean(px, 0, 12)[2];
    expect(blue(sweepUp)).toBeGreaterThan(blue(sweepDown));
  }, 60_000);

  it("ignores velocity at rest (vx=vy=0 is the resting frame)", async () => {
    const gpu = await init();
    const a = await render(gpu, { vx: 0, vy: 0 });
    const b = await render(gpu, { vx: 0, vy: 0 });
    expect(diffCount(a, b)).toBe(0);
  }, 60_000);

  it("animates with time", async () => {
    const gpu = await init();
    const a = await render(gpu, { time: 0 });
    const b = await render(gpu, { time: 6 });
    expect(diffCount(a, b)).toBeGreaterThan(SIZE * SIZE * 0.01);
  }, 60_000);

  it("recolors the field with the color uniforms", async () => {
    const gpu = await init();
    const px = await render(gpu, {
      c1r: 1, c1g: 0, c1b: 0, c2r: 1, c2g: 0, c2b: 0,
      c3r: 1, c3g: 0, c3b: 0, c4r: 1, c4g: 0, c4b: 0,
    });
    const top = bandMean(px, 0, 12);
    expect(top[0] - top[2]).toBeGreaterThan(30); // red top when all edges are red
  }, 60_000);
});
