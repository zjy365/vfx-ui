import { describe, expect, it } from "vitest";
import { init, effect, target, frame } from "vgpu/node";
import { WEB_GLOBE_SHADER } from "../src/components/WebGlobe.tsx";

const BASE = {
  time: 0,
  speed: 0.35,
  phi: 0,
  theta: 0.35,
  dotSize: 0.62,
  globeScale: 0.98,
  backside: 0.5,
  cr: 0.58, cg: 0.64, cb: 0.72,
  er: 0.97, eg: 0.98, eb: 1,
};

async function render(gpu: Awaited<ReturnType<typeof init>>, uniforms: Record<string, number>): Promise<Uint8Array> {
  const t = target(gpu, { size: [32, 32], format: "rgba8unorm" });
  const fx = effect(gpu, WEB_GLOBE_SHADER, { set: { ...BASE, ...uniforms } });
  frame(gpu, (f) => f.pass({ target: t }, (p) => p.draw(fx)));
  return t.read();
}

describe("WebGlobe shader", () => {
  it("renders deterministically", async () => {
    const gpu = await init();
    const a = await render(gpu, {});
    const a2 = await render(gpu, {});
    expect([...a]).toEqual([...a2]);
  }, 60_000);

  it("paints lit dots inside the sphere and stays transparent outside", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    // Center pixel is on the sphere; some dot coverage should be lit (alpha > 0).
    const center = (16 * 32 + 16) * 4;
    // Corner pixel is outside the globe → fully transparent.
    const corner = 0;
    expect(px[corner]!).toBe(0);
    expect(px[center + 3]!).toBeGreaterThan(0);
  }, 60_000);

  it("spins: pixels change over time", async () => {
    const gpu = await init();
    const t0 = await render(gpu, { time: 0 });
    const t1 = await render(gpu, { time: 4 });
    expect([...t0]).not.toEqual([...t1]);
  }, 60_000);

  it("emission color changes the rim", async () => {
    const gpu = await init();
    const defaultPx = await render(gpu, {});
    const redRim = await render(gpu, { er: 1, eg: 0, eb: 0 });
    expect([...defaultPx]).not.toEqual([...redRim]);
  }, 60_000);
});
