import { describe, it, expect } from "vitest";
import {
  createScene,
  destroyScene,
  prepareScene,
  renderLighting,
  presentScene,
  scaledSize,
  type RadianceSettings,
} from "../src/components/RadianceEngine";

describe("RadiantDots multi-pass light field", () => {
  it("caps field resolution without changing the aspect ratio", () => {
    expect(scaledSize(1600, 800, 1, 320)).toEqual([320, 160]);
    expect(scaledSize(0, 0, 1, 320)).toEqual([1, 1]);
  });
  it("renders repeatable lighting and responds to layout, time and emitter color", async () => {
    const { init, target } = await import("vgpu/node");
    const gpu = await init();
    const scene = createScene(gpu, [64, 64]);
    const out = target(gpu, { size: [64, 64], format: "rgba8unorm" });
    const settings: RadianceSettings = {
      animation: "center-out",
      color: [0.95, 0.98, 1],
      layout: 0,
      intensity: 1,
      px: 0.5,
      py: 0.5,
      active: 0,
    };
    try {
      await prepareScene(scene, "rgba8unorm");
      const render = async (
        time: number,
        patch: Partial<RadianceSettings> = {},
      ) => {
        const p = { ...settings, ...patch };
        renderLighting(scene, time, "final", p.animation, p);
        presentScene(scene, out, "final", p.intensity);
        return [...(await out.read())];
      };
      const a = await render(0.8);
      expect(a).toEqual(await render(0.8));
      expect(a.filter((v, i) => i % 4 !== 3 && v > 20).length).toBeGreaterThan(
        200,
      );
      expect(a).not.toEqual(await render(2));
      expect(a).not.toEqual(await render(0.8, { layout: 1 }));
      expect(a).not.toEqual(await render(0.8, { color: [1, 0.4, 0.15] }));
    } finally {
      destroyScene(scene);
      (out as typeof out & { destroy(): void }).destroy();
      gpu.dispose();
    }
  }, 60_000);
});
