import { describe, expect, it } from "vitest";
import { init, effect, target, frame } from "vgpu/node";
import { MESH_GRADIENT_SHADER } from "../src/components/MeshGradient.tsx";
import { IRIDESCENT_SHADER } from "../src/components/Iridescent.tsx";
import { VORTEX_SHADER } from "../src/components/Vortex.tsx";
import { LIVE_CHART_SHADER } from "../src/components/LiveChart.tsx";

const BASE = {
  time: 0, speed: 1, scale: 3.2, softness: 0.09,
  c0r: 0.04, c0g: 0.07, c0b: 0.13,
  c1r: 0.08, c1g: 0.37, c1b: 0.46,
  c2r: 0.49, c2g: 0.23, c2b: 0.93,
  c3r: 0.96, c3g: 0.45, c3b: 0.71,
};

async function render(shader: string, uniforms: Record<string, unknown>): Promise<Uint8Array> {
  const gpu = await init();
  const t = target(gpu, { size: [16, 16], format: "rgba8unorm" });
  const fx = effect(gpu, shader, { set: uniforms });
  frame(gpu, (f) => f.pass({ target: t }, (p) => p.draw(fx)));
  return t.read();
}

describe("MeshGradient", () => {
  const u = { ...BASE };
  it("renders opaque pixels and is time-animated", async () => {
    const a = await render(MESH_GRADIENT_SHADER, u);
    const b = await render(MESH_GRADIENT_SHADER, { ...u, time: 3 });
    expect(a.length).toBe(16 * 16 * 4);
    expect(a[3]).toBe(255);
    expect([...a]).not.toEqual([...b]);
  }, 60_000);
});

describe("Iridescent", () => {
  const u = { time: 0, speed: 1, scale: 2.4, hueShift: 0, saturation: 1, brightness: 1 };
  it("renders and hue-shifts change the image", async () => {
    const a = await render(IRIDESCENT_SHADER, u);
    const b = await render(IRIDESCENT_SHADER, { ...u, hueShift: 0.5 });
    expect(a[3]).toBe(255);
    expect([...a]).not.toEqual([...b]);
  }, 60_000);
});

describe("Vortex", () => {
  const u = {
    time: 0, speed: 1, swirl: 2.4, arms: 2, coreGlow: 1.2,
    cr: 0.5, cg: 0.55, cb: 0.97, er: 0.88, eg: 0.95, eb: 1,
  };
  it("renders with a bright core and rotates over time", async () => {
    const a = await render(VORTEX_SHADER, u);
    const b = await render(VORTEX_SHADER, { ...u, time: 2 });
    // Center pixel (core glow) must be lit.
    const center = (8 * 16 + 8) * 4;
    expect(a[center + 3]!).toBeGreaterThan(0);
    expect([...a]).not.toEqual([...b]);
  }, 60_000);
});

describe("LiveChart", () => {
  const pts = Array.from({ length: 64 }, (_, i) => {
    const v = Math.max(0, Math.min(1, 0.5 + 0.35 * Math.sin(i * 0.4)));
    return [v, v, 0, 0];
  });
  const u = {
    time: 0, count: 64, lineWidth: 0.01, glow: 0.5, fill: 0.6,
    cr: 0.22, cg: 0.74, cb: 0.97, er: 0.49, eg: 0.83, eb: 0.99,
    pts,
  };
  it("draws the line (some pixels lit) and reacts to data changes", async () => {
    const a = await render(LIVE_CHART_SHADER, u);
    const lit = Array.from({ length: 64 }, (_, i) => a[i * 4 + 3]!).filter((v) => v > 0).length;
    expect(lit).toBeGreaterThan(8);
    const b = await render(LIVE_CHART_SHADER, { ...u, pts: pts.map(([v]) => [v! > 0.5 ? 0.1 : 0.9, v! > 0.5 ? 0.1 : 0.9, 0, 0]) });
    expect([...a]).not.toEqual([...b]);
  }, 60_000);
});
