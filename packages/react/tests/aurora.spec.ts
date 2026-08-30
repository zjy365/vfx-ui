import { describe, expect, it } from "vitest";
import { AURORA_DEFAULTS, AURORA_SHADER } from "../src/components/Aurora.tsx";
import { hexToRgb01 } from "../src/utils/color.ts";
import {
  createRenderer,
  expectDeterministicAndAnimated,
  mean,
} from "./helpers.ts";

function auroraUniforms(time: number, primary: string = AURORA_DEFAULTS.primary): Record<string, number> {
  const a = hexToRgb01(primary);
  const b = hexToRgb01(AURORA_DEFAULTS.secondary);
  return {
    time,
    speed: AURORA_DEFAULTS.speed,
    intensity: AURORA_DEFAULTS.intensity,
    bands: AURORA_DEFAULTS.bands,
    c0r: a[0], c0g: a[1], c0b: a[2],
    c1r: b[0], c1g: b[1], c1b: b[2],
  };
}

describe("Aurora (Dawn pixel tests)", () => {
  it("is deterministic for identical uniforms and animates over time", async () => {
    const render = await createRenderer();
    await expectDeterministicAndAnimated(render, AURORA_SHADER, auroraUniforms);
  }, 60_000);

  it("responds to color params: a different primary shifts the 16x16 pixel mean", async () => {
    const render = await createRenderer();
    const base = await render(AURORA_SHADER, auroraUniforms(0.5));
    const alt = await render(AURORA_SHADER, auroraUniforms(0.5, "#ff5470"));
    expect(mean(base)).not.toBe(mean(alt));
  }, 60_000);
});
