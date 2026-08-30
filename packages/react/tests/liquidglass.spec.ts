import { describe, expect, it } from "vitest";
import { LIQUID_GLASS_DEFAULTS, LIQUID_GLASS_SHADER } from "../src/components/LiquidGlass.tsx";
import {
  createRenderer,
  expectDeterministicAndAnimated,
  mean,
} from "./helpers.ts";

function liquidGlassUniforms(time: number, distortion: number = LIQUID_GLASS_DEFAULTS.distortion): Record<string, number> {
  return {
    time,
    speed: LIQUID_GLASS_DEFAULTS.speed,
    distortion,
    chromatic: LIQUID_GLASS_DEFAULTS.chromatic,
    scale: LIQUID_GLASS_DEFAULTS.scale,
  };
}

describe("LiquidGlass (Dawn pixel tests)", () => {
  it("is deterministic for identical uniforms and animates over time", async () => {
    const render = await createRenderer();
    await expectDeterministicAndAnimated(render, LIQUID_GLASS_SHADER, liquidGlassUniforms);
  }, 60_000);

  it("responds to distortion: stronger refraction shifts the 16x16 pixel mean", async () => {
    const render = await createRenderer();
    const base = await render(LIQUID_GLASS_SHADER, liquidGlassUniforms(0.5));
    const alt = await render(LIQUID_GLASS_SHADER, liquidGlassUniforms(0.5, 1.3));
    expect(mean(base)).not.toBe(mean(alt));
  }, 60_000);
});
