import { describe, expect, it } from "vitest";
import { FLUID_DEFAULTS, FLUID_SHADER } from "../src/components/FluidGradient.tsx";
import { hexToRgb01 } from "../src/utils/color.ts";
import {
  createRenderer,
  expectDeterministicAndAnimated,
  mean,
} from "./helpers.ts";

function fluidUniforms(
  time: number,
  colors: { from: string; to: string; accent: string } = {
    from: FLUID_DEFAULTS.from,
    to: FLUID_DEFAULTS.to,
    accent: FLUID_DEFAULTS.accent,
  },
): Record<string, number> {
  const a = hexToRgb01(colors.from);
  const b = hexToRgb01(colors.to);
  const c = hexToRgb01(colors.accent);
  return {
    time,
    speed: FLUID_DEFAULTS.speed,
    warp: FLUID_DEFAULTS.warp,
    scale: FLUID_DEFAULTS.scale,
    c0r: a[0], c0g: a[1], c0b: a[2],
    c1r: b[0], c1g: b[1], c1b: b[2],
    c2r: c[0], c2g: c[1], c2b: c[2],
  };
}

describe("FluidGradient (Dawn pixel tests)", () => {
  it("is deterministic for identical uniforms and animates over time", async () => {
    const render = await createRenderer();
    await expectDeterministicAndAnimated(render, FLUID_SHADER, fluidUniforms);
  }, 60_000);

  it("responds to color params: a different accent shifts the 16x16 pixel mean", async () => {
    const render = await createRenderer();
    const base = await render(FLUID_SHADER, fluidUniforms(0.5));
    const alt = await render(
      FLUID_SHADER,
      fluidUniforms(0.5, {
        from: FLUID_DEFAULTS.from,
        to: FLUID_DEFAULTS.to,
        accent: "#e0543e",
      }),
    );
    expect(mean(base)).not.toBe(mean(alt));
  }, 60_000);
});
