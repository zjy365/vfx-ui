import { describe, expect, it } from "vitest";
import { PARTICLE_DEFAULTS, PARTICLE_SHADER } from "../src/components/ParticleField.tsx";
import { hexToRgb01 } from "../src/utils/color.ts";
import {
  brightCount,
  createRenderer,
  expectDeterministicAndAnimated,
} from "./helpers.ts";

function particleUniforms(time: number, size: number = PARTICLE_DEFAULTS.size): Record<string, number> {
  const c = hexToRgb01(PARTICLE_DEFAULTS.color);
  return {
    time,
    density: PARTICLE_DEFAULTS.density,
    speed: PARTICLE_DEFAULTS.speed,
    size,
    c0r: c[0], c0g: c[1], c0b: c[2],
  };
}

describe("ParticleField (Dawn pixel tests)", () => {
  it("is deterministic for identical uniforms and animates over time", async () => {
    const render = await createRenderer();
    await expectDeterministicAndAnimated(render, PARTICLE_SHADER, particleUniforms);
  }, 60_000);

  it("responds to size: larger particles cover more pixels", async () => {
    const render = await createRenderer();
    const small = await render(PARTICLE_SHADER, particleUniforms(0.5, 0.05));
    const large = await render(PARTICLE_SHADER, particleUniforms(0.5, 0.16));
    expect(brightCount(small, 18)).toBeLessThan(brightCount(large, 18));
  }, 60_000);
});
