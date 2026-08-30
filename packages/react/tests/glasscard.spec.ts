import { describe, expect, it } from "vitest";
import { GLASS_CARD_DEFAULTS, GLASS_CARD_SHADER } from "../src/components/GlassCard.tsx";
import { hexToRgb01 } from "../src/utils/color.ts";
import {
  createRenderer,
  expectDeterministicAndAnimated,
  mean,
} from "./helpers.ts";

function glassCardUniforms(time: number, cardScale: number = GLASS_CARD_DEFAULTS.cardScale): Record<string, number> {
  const c = hexToRgb01(GLASS_CARD_DEFAULTS.tint);
  return {
    time,
    shine: GLASS_CARD_DEFAULTS.shine,
    borderGlow: GLASS_CARD_DEFAULTS.borderGlow,
    cardScale,
    radius: GLASS_CARD_DEFAULTS.radius,
    c0r: c[0], c0g: c[1], c0b: c[2],
  };
}

describe("GlassCard (Dawn pixel tests)", () => {
  it("is deterministic for identical uniforms and animates over time", async () => {
    // time drives the shine sweep channel, so the frame is expected to move.
    const render = await createRenderer();
    await expectDeterministicAndAnimated(render, GLASS_CARD_SHADER, glassCardUniforms);
  }, 60_000);

  it("responds to cardScale: a smaller card shifts the 16x16 pixel mean", async () => {
    const render = await createRenderer();
    const base = await render(GLASS_CARD_SHADER, glassCardUniforms(0.5));
    const alt = await render(GLASS_CARD_SHADER, glassCardUniforms(0.5, 0.25));
    expect(mean(base)).not.toBe(mean(alt));
  }, 60_000);
});
