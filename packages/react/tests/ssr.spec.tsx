import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  Aurora,
  FluidGradient,
  GlassCard,
  Iridescent,
  LiquidGlass,
  LiveChart,
  MeshGradient,
  ParticleField,
  Starfield,
  Vortex,
  VfxCanvas,
  WaveBackground,
  WebGlobe,
} from "../src/index.ts";

/** SSR contract: every component must render an inert canvas with zero server-side GPU access. */
describe("SSR safety", () => {
  it("renders every component server-side without touching GPU APIs", () => {
    const tree = renderToString(
      <div>
        <WaveBackground />
        <FluidGradient />
        <Aurora />
        <Starfield />
        <ParticleField />
        <GlassCard />
        <LiquidGlass />
        <MeshGradient />
        <Iridescent />
        <Vortex />
        <WebGlobe />
        <LiveChart data={[0.1, 0.5, 0.9, 0.3]} />
        <VfxCanvas shader="/* empty */" fallback={<span>no webgpu</span>} />
      </div>,
    );
    const canvasCount = (tree.match(/<canvas/g) ?? []).length;
    expect(canvasCount).toBe(13);
    expect(tree).not.toContain("no webgpu");
  });

  it("keeps uniform props out of the server payload", () => {
    const tree = renderToString(<WaveBackground from="#123456" />);
    expect(tree).toContain("<canvas");
    expect(tree).not.toContain("#123456");
  });
});
