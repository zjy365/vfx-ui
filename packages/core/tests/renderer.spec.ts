import { describe, expect, it } from "vitest";
import { isWebGPUAvailable } from "../src/capability.ts";

const TEST_SHADER = /* wgsl */ `
struct Params { time: f32, speed: f32 }
@group(0) @binding(0) var<uniform> params: Params;
@fragment fn main(@location(0) uv: vec2f) -> @location(0) vec4f {
  return vec4f(uv.x, uv.y, sin(params.time * params.speed) * 0.5 + 0.5, 1);
}
`;

describe("mock runtime (no GPU required)", () => {
  it("initializes, records frames, and disposes without throwing", async () => {
    const { init, target, frame } = await import("vgpu/mock");
    const gpu = await init();
    const t = target(gpu, { size: [4, 4], format: "rgba8unorm" });
    expect(() => frame(gpu, (f) => f.pass({ target: t }, () => {}))).not.toThrow();
  });

  it("reports capability in non-browser runtime", () => {
    expect(isWebGPUAvailable()).toBe(false);
  });
});

describe("vgpu/node (Dawn) pixel determinism", () => {
  it("renders an effect offscreen, reads back deterministic pixels", async () => {
    const { init, effect, target, frame } = await import("vgpu/node");
    const gpu = await init();

    const renderAt = async (time: number): Promise<Uint8Array> => {
      const t = target(gpu, { size: [8, 8], format: "rgba8unorm" });
      const fx = effect(gpu, TEST_SHADER, { set: { time, speed: 1 } });
      frame(gpu, (f) => f.pass({ target: t }, (p) => p.draw(fx)));
      const rgba = await t.read();
      return rgba;
    };

    const a = await renderAt(0.25);
    const a2 = await renderAt(0.25);
    const b = await renderAt(0.75);

    expect(a.length).toBe(8 * 8 * 4);
    // uv (0,0) pixel center → r = round(1/16 * 255) = 16; alpha fully opaque.
    expect(a[0]!).toBeLessThanOrEqual(17);
    expect(a[1]!).toBeLessThanOrEqual(17);
    expect(a[3]!).toBe(255);
    // Deterministic: identical params → identical pixels.
    expect([...a]).toEqual([...a2]);
    // Time uniform drives the blue channel (sin(time*speed) mapping).
    expect([...a]).not.toEqual([...b]);
  }, 60_000);
});
