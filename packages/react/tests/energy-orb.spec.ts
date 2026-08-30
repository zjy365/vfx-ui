import { describe, expect, it } from "vitest";
import { init, effect, target, frame } from "vgpu/node";
import { ENERGY_ORB_SHADER } from "../src/components/EnergyOrb.tsx";

const BASE = {
  time: 0.8, speed: 1, smokeScale: 1, smokeStrength: 1, smokeSpeed: 1,
  hue: 0, saturation: 1, glow: 1,
};

async function render(gpu: Awaited<ReturnType<typeof init>>, uniforms: Record<string, unknown>): Promise<Uint8Array> {
  const t = target(gpu, { size: [32, 32], format: "rgba8unorm" });
  const fx = effect(gpu, ENERGY_ORB_SHADER, { set: { ...BASE, ...uniforms } });
  frame(gpu, (f) => f.pass({ target: t }, (p) => p.draw(fx)));
  return t.read();
}

describe("EnergyOrb shader", () => {
  it("renders deterministically", async () => {
    const gpu = await init();
    const a = await render(gpu, {});
    const a2 = await render(gpu, {});
    expect([...a]).toEqual([...a2]);
  }, 60_000);

  it("lights the core and halo, stays transparent in corners", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    const center = (16 * 32 + 16) * 4;
    expect(px[center + 3]!).toBeGreaterThan(0);
    expect(px[0]!).toBe(0); // corner outside the halo
  }, 60_000);

  it("smoke rotates over time", async () => {
    const gpu = await init();
    const t0 = await render(gpu, { time: 0 });
    const t1 = await render(gpu, { time: 5 });
    expect([...t0]).not.toEqual([...t1]);
  }, 60_000);

  it("hue rotation shifts colors", async () => {
    const gpu = await init();
    const a = await render(gpu, {});
    const b = await render(gpu, { hue: 3.1 });
    expect([...a]).not.toEqual([...b]);
  }, 60_000);
});
