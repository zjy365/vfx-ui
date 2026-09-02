import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import {
  Aurora,
  BlackHole,
  ChromaFlow,
  EnergyOrb,
  FiberFlow,
  FluidGradient,
  GlassCard,
  GlassLens,
  HeroAurora,
  HeroBlackHole,
  HeroChroma,
  HeroFiber,
  HeroFluid,
  HeroGlobe,
  HeroIridescent,
  HeroMesh,
  HeroParticles,
  HeroRibbon,
  HeroStarfield,
  HeroVortex,
  Iridescent,
  LightPrism,
  LiquidGlass,
  LiveChart,
  MeshGradient,
  ParticleField,
  RibbonField,
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
        <GlassLens />
        <LiquidGlass />
        <BlackHole />
        <MeshGradient />
        <Iridescent />
        <Vortex />
        <WebGlobe />
        <LiveChart data={[0.1, 0.5, 0.9, 0.3]} />
        <EnergyOrb />
        <RibbonField />
        <FiberFlow />
        <LightPrism />
        <ChromaFlow />
        <HeroFluid />
        <HeroAurora />
        <HeroFiber />
        <HeroGlobe />
        <HeroMesh />
        <HeroIridescent />
        <HeroVortex />
        <HeroRibbon />
        <HeroParticles />
        <HeroStarfield />
        <HeroBlackHole />
        <HeroChroma />
        <VfxCanvas shader="/* empty */" fallback={<span>no webgpu</span>} />
      </div>,
    );
    const canvasCount = (tree.match(/<canvas/g) ?? []).length;
    // 32 canvases: 19 shader components (incl. GlassLens, BlackHole, ChromaFlow) +
    // 11 WebGPU heroes + HeroGlobe's inert cobe canvas (the WebGL globe
    // itself mounts client-side only) + the bare VfxCanvas below.
    expect(canvasCount).toBe(32);
    expect(tree).not.toContain("no webgpu");
    // Heroes must ship real selectable DOM text, not texture-rendered type.
    expect(tree).toContain("<h1");
    expect(tree).toContain("Your product, in one sentence.");
    expect(tree).toContain("aria-hidden");
  });

  it("keeps uniform props out of the server payload", () => {
    const tree = renderToString(<WaveBackground from="#123456" />);
    expect(tree).toContain("<canvas");
    expect(tree).not.toContain("#123456");
  });
});
