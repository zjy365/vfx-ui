# @vfx-ui/react

Shader-native visual effect components for React, rendered on the GPU via [WebGPU](https://www.w3.org/TR/webgpu/) ([vgpu](https://github.com/vercel-labs/vgpu)). Every effect's core visual is something DOM/CSS cannot reproduce.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

Requires React >= 18 and a browser with WebGPU.

## Usage

```tsx
import { HeroFluid, WaveBackground, FLUID_PRESETS } from "@vfx-ui/react";

export function Landing() {
  return <HeroFluid title="Ship the first screen" preset={FLUID_PRESETS.dusk} />;
}
```

## Components

Effects: `WaveBackground` · `FluidGradient` · `Aurora` · `Starfield` · `ParticleField` · `GlassCard` · `LiquidGlass` · `GlassLens` · `BlackHole` · `MeshGradient` · `Iridescent` · `Vortex` · `WebGlobe` · `LiveChart` · `EnergyOrb` · `RibbonField` · `FiberFlow` · `LightPrism` · `ChromaFlow`

Drop-in hero sections: `HeroFluid` · `HeroAurora` · `HeroFiber` · `HeroGlobe` · `HeroMesh` · `HeroIridescent` · `HeroVortex` · `HeroRibbon` · `HeroParticles` · `HeroStarfield` · `HeroBlackHole` · `HeroChroma`

Live previews, props, and variants for every component: [vfx-ui.com/components](https://vfx-ui.com/components). Machine-readable docs: [llms.txt](https://vfx-ui.com/llms.txt).

Prefer copy-paste over an npm dependency? Use [the registry](https://vfx-ui.com/r) via `npx @vfx-ui/cli add <name>`.

## License

MIT — © vfx-ui contributors. Renderer core: [vercel-labs/vgpu](https://github.com/vercel-labs/vgpu) (MIT).
