import { describe, expect, it } from "vitest";
import { init, target } from "vgpu/node";
import { renderPrismThumbnail } from "../src/components/PrismThumbnail";

describe("LightPrism complete optical pipeline", () => {
  it("renders opaque geometry and changes spectral caustics with dispersion", async () => {
    const gpu = await init();
    const output = target(gpu, { size: [96, 96], format: "rgba8unorm" });
    try {
      await renderPrismThumbnail(gpu, output, { settings: { dispersion: 0 } });
      const mono = await output.read();
      await renderPrismThumbnail(gpu, output, {
        settings: { dispersion: 0.15 },
      });
      const spectrum = await output.read();
      let changed = 0,
        range = 0;
      for (let i = 0; i < mono.length; i += 4) {
        expect(spectrum[i + 3]).toBe(255);
        if (Math.abs(mono[i]! - spectrum[i]!) > 3) changed++;
        range = Math.max(range, Math.abs(spectrum[i]! - spectrum[i + 2]!));
      }
      expect(changed).toBeGreaterThan(30);
      expect(range).toBeGreaterThan(20);
    } finally {
      gpu.dispose();
    }
  }, 60000);
});
