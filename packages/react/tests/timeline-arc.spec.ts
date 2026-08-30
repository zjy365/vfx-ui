import { describe, expect, it } from "vitest";
import { init, effect, target, frame } from "vgpu/node";
import { TIMELINE_ARC_SHADER } from "../src/components/TimelineArc.tsx";

const BASE = {
  time: 1.2, speed: 1, activeT: 0.5714, yearCount: 8,
  cr: 0.145, cg: 0.388, cb: 0.922, resX: 64, resY: 64,
};

async function render(gpu: Awaited<ReturnType<typeof init>>, uniforms: Record<string, unknown>): Promise<Uint8Array> {
  const t = target(gpu, { size: [64, 64], format: "rgba8unorm" });
  const fx = effect(gpu, TIMELINE_ARC_SHADER, { set: { ...BASE, ...uniforms } });
  frame(gpu, (f) => f.pass({ target: t }, (p) => p.draw(fx)));
  return t.read();
}

describe("TimelineArc shader", () => {
  it("renders deterministically", async () => {
    const gpu = await init();
    const a = await render(gpu, {});
    const a2 = await render(gpu, {});
    expect([...a]).toEqual([...a2]);
  }, 60_000);

  it("draws the accent hexagon node at the active milestone", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    // aspect=1: node at mix(YEAR_A0, YEAR_A1, 0.5714) ≈ (0.394, 0.145) y-up.
    const idx = (55 * 64 + 25) * 4;
    expect(px[idx + 2]!).toBeGreaterThan(px[idx]! + 40); // clearly blue
  }, 60_000);

  it("dashes march and the pulse breathes over time", async () => {
    const gpu = await init();
    const t0 = await render(gpu, { time: 0 });
    const t1 = await render(gpu, { time: 4 });
    expect([...t0]).not.toEqual([...t1]);
  }, 60_000);

  it("moving the active milestone changes the frame", async () => {
    const gpu = await init();
    const a = await render(gpu, {});
    const b = await render(gpu, { activeT: 0.1429 });
    expect([...a]).not.toEqual([...b]);
  }, 60_000);
});
