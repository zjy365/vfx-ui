import { describe, expect, it } from "vitest";
import { init, effect, target, frame } from "vgpu/node";
import { RIBBON_FIELD_SHADER } from "../src/components/RibbonField.tsx";

const BASE = {
  time: 1.2, speed: 1, intensity: 1, drift: 0, grain: 1, resX: 64, resY: 64,
};

async function render(gpu: Awaited<ReturnType<typeof init>>, uniforms: Record<string, unknown>): Promise<Uint8Array> {
  const t = target(gpu, { size: [64, 64], format: "rgba8unorm" });
  const fx = effect(gpu, RIBBON_FIELD_SHADER, { set: { ...BASE, ...uniforms } });
  frame(gpu, (f) => f.pass({ target: t }, (p) => p.draw(fx)));
  return t.read();
}

describe("RibbonField shader", () => {
  it("renders deterministically", async () => {
    const gpu = await init();
    const a = await render(gpu, {});
    const a2 = await render(gpu, {});
    expect([...a]).toEqual([...a2]);
  }, 60_000);

  it("lights the ribbon region brighter than the far corner", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    // Ribbon r1 sits near y≈0.58 (GL coords) → uv y ≈ 0.42 from the top, right side favored.
    const ribbonIdx = (Math.round(0.42 * 64) * 64 + 52) * 4;
    const cornerIdx = 3 * 4; // top-left, left of rightFade
    const lum = (i: number) => px[i]! + px[i + 1]! + px[i + 2]!;
    expect(lum(ribbonIdx)).toBeGreaterThan(lum(cornerIdx));
  }, 60_000);

  it("ribbons drift over time", async () => {
    const gpu = await init();
    const t0 = await render(gpu, { time: 0 });
    const t1 = await render(gpu, { time: 6 });
    expect([...t0]).not.toEqual([...t1]);
  }, 60_000);

  it("intensity scales the light output", async () => {
    const gpu = await init();
    const dim = await render(gpu, { intensity: 0.2 });
    const bright = await render(gpu, { intensity: 1.4 });
    expect([...dim]).not.toEqual([...bright]);
  }, 60_000);
});
