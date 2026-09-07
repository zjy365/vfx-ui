import { describe, it, expect } from "vitest";
import { GLASS_LENS_SHADER } from "../src/components/GlassLens";
import { createRenderer, expectDeterministicAndAnimated } from "./helpers";
const uniforms = (time: number) => ({ time, speed: 1, refraction: 0.85, dispersion: 0.7, blur: 0.8, rim: 0.9, tintR: 0.88, tintG: 0.93, tintB: 0.96, px: 0.5, py: 0.5, pActive: 0, resX: 16, resY: 16 });
describe("GlassLens optical rendering", () => {
  it("is deterministic and changes with studio motion", async () => {
    await expectDeterministicAndAnimated(await createRenderer(), GLASS_LENS_SHADER, uniforms);
  });
  it("changes transmission when the refractive index changes", async () => {
    const render = await createRenderer();
    const a = await render(GLASS_LENS_SHADER, uniforms(0.8));
    const b = await render(GLASS_LENS_SHADER, { ...uniforms(0.8), refraction: 2 });
    expect([...a]).not.toEqual([...b]);
  });
});
