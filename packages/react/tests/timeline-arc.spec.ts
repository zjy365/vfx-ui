import { describe, expect, it } from "vitest";
import { init, effect, target, frame } from "vgpu/node";
import { TIMELINE_ARC_SHADER } from "../src/components/TimelineArc.tsx";

// Dial texture geometry (see TimelineArc.tsx): r-units where 1 = half the
// canvas; paper disk r<=0.9148; major accent ticks every 18° at r
// [0.8136, 0.9689]; dotted accent ring every 2.5° at r=0.7447.
const SIZE = 256;
const BASE = { cr: 0, cg: 0.357, cb: 1, resX: SIZE, resY: SIZE };

async function render(
  gpu: Awaited<ReturnType<typeof init>>,
  uniforms: Record<string, unknown>,
): Promise<Uint8Array> {
  const t = target(gpu, { size: [SIZE, SIZE], format: "rgba8unorm" });
  const fx = effect(gpu, TIMELINE_ARC_SHADER, { set: { ...BASE, ...uniforms } });
  frame(gpu, (f) => f.pass({ target: t }, (p) => p.draw(fx)));
  return t.read();
}

// y-down screen angle (0 = right, positive clockwise), radius in r-units.
function pxAt(px: Uint8Array, angleDeg: number, rUnits: number): [number, number, number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  const half = SIZE / 2;
  const x = Math.round(half + Math.cos(rad) * rUnits * half);
  const y = Math.round(half + Math.sin(rad) * rUnits * half);
  const i = (y * SIZE + x) * 4;
  return [px[i]!, px[i + 1]!, px[i + 2]!, px[i + 3]!];
}

describe("TimelineArc dial shader", () => {
  it("renders deterministically", async () => {
    const gpu = await init();
    const a = await render(gpu, {});
    const a2 = await render(gpu, {});
    expect([...a]).toEqual([...a2]);
  }, 60_000);

  it("is transparent outside the paper disk", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    const corner = (4 * SIZE + 4) * 4;
    expect(px[corner + 3]).toBe(0);
  }, 60_000);

  it("fills the disk with near-white paper", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    const center = (SIZE / 2 * SIZE + SIZE / 2) * 4;
    expect(px[center + 3]).toBeGreaterThan(200);
    expect(Math.abs(px[center]! - 250)).toBeLessThan(8); // #fafafa + grain
    expect(Math.abs(px[center]! - px[center + 1]!)).toBeLessThan(4);
  }, 60_000);

  it("draws accent major ticks every 18°", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    // Angle 0 (pointing right), mid-tick radius — clearly blue, not gray/paper.
    const [r, g, b, a] = pxAt(px, 0, 0.89);
    expect(a).toBeGreaterThan(200);
    expect(b).toBeGreaterThan(r + 100);
    expect(b).toBeGreaterThan(g + 60);
  }, 60_000);

  it("draws the accent dotted ring at r=0.7447", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    const [r, , b, a] = pxAt(px, 0, 0.7447);
    expect(a).toBeGreaterThan(120);
    expect(b).toBeGreaterThan(r + 60);
  }, 60_000);

  it("draws neutral gray minor ticks between the majors", async () => {
    const gpu = await init();
    const px = await render(gpu, {});
    // Angle 3° (a minor tick, not a major), in the gray ring's radial span.
    const [r, g, b, a] = pxAt(px, 3, 0.915);
    expect(a).toBeGreaterThan(120);
    expect(Math.abs(r - g)).toBeLessThan(8);
    expect(Math.abs(g - b)).toBeLessThan(8);
    expect(r).toBeGreaterThan(170); // #d9d9d9 ≈ 217
  }, 60_000);

  it("recolors majors and dots with the accent uniform", async () => {
    const gpu = await init();
    const px = await render(gpu, { cr: 1, cg: 0, cb: 0 });
    const [r, , b] = pxAt(px, 0, 0.89);
    expect(r).toBeGreaterThan(b + 100);
  }, 60_000);
});
