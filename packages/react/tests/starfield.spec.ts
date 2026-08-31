import { describe, expect, it } from "vitest";
import { STARFIELD_DEFAULTS, STARFIELD_SHADER } from "../src/components/Starfield.tsx";
import { hexToRgb01 } from "../src/utils/color.ts";
import {
  brightCount,
  createRenderer,
  expectDeterministicAndAnimated,
} from "./helpers.ts";

function starfieldUniforms(time: number, density: number = STARFIELD_DEFAULTS.density): Record<string, number> {
  const c = hexToRgb01(STARFIELD_DEFAULTS.color);
  return {
    time,
    density,
    speed: STARFIELD_DEFAULTS.speed,
    twinkle: STARFIELD_DEFAULTS.twinkle,
    c0r: c[0], c0g: c[1], c0b: c[2],
    px: 0.5,
    py: 0.5,
  };
}

describe("Starfield (Dawn pixel tests)", () => {
  it("is deterministic for identical uniforms and animates over time", async () => {
    const render = await createRenderer();
    await expectDeterministicAndAnimated(render, STARFIELD_SHADER, starfieldUniforms);
  }, 60_000);

  it("responds to density: a sparser field lights fewer pixels", async () => {
    const render = await createRenderer();
    const sparse = await render(STARFIELD_SHADER, starfieldUniforms(0.5, 0.2));
    const dense = await render(STARFIELD_SHADER, starfieldUniforms(0.5, 0.7));
    // Star positions come from fixed hashes, so density only toggles stars on/off.
    expect(brightCount(sparse, 18)).toBeLessThan(brightCount(dense, 18));
  }, 60_000);
});
