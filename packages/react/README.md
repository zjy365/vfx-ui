# @vfx-ui/react

Expressive React components: GPU atmospheres via [vgpu](https://github.com/vercel-labs/vgpu), customizable Hero and Footer sections, and focused DOM/CSS interactions.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

Requires React >= 18. GPU effects need WebGPU and accept a `fallback`; the Footers, `Magnetic`, `SpectralCard`, and `KineticText` work without it.

## Usage

```tsx
import { HeroFluid } from "@vfx-ui/react";

export function Landing() {
  return (
    <section style={{ height: 680 }}>
      <HeroFluid title="Your next big idea." interactive
        primaryCta={{ label: "Get started", href: "/start" }}
        secondaryCta={null} />
    </section>
  );
}
```

## Components

Effects: `RadiantDots` · `WaveBackground` · `FluidGradient` · `Aurora` · `Starfield` · `ParticleField` · `GlassCard` · `LiquidGlass` · `GlassLens` · `BlackHole` · `MeshGradient` · `Iridescent` · `Vortex` · `RibbonField` · `FiberFlow` · `LightPrism` · `ChromaFlow`

Drop-in hero sections: `HeroFluid` · `HeroAurora` · `HeroFiber` · `HeroGlobe` · `HeroMesh` · `HeroIridescent` · `HeroVortex` · `HeroRibbon` · `HeroParticles` · `HeroStarfield` · `HeroBlackHole` · `HeroChroma`

Live previews, props, and variants for every component: [vfx-ui.com/components](https://vfx-ui.com/components). Machine-readable docs: [llms.txt](https://vfx-ui.com/llms.txt).

Prefer copy-paste over an npm dependency? Use [the registry](https://vfx-ui.com/r) via `npx @vfx-ui/cli add <name>`.

## License

MIT — © vfx-ui contributors. Renderer core: [vercel-labs/vgpu](https://github.com/vercel-labs/vgpu) (MIT).

## Content and interaction

Hero defaults are examples, not required copy. `title` and `subtitle` accept React nodes. CTA objects accept a real `href` or a button `onClick`; `null` hides an action. `children` replaces the entire default content stack. `className` and `style` apply to the section.

`Magnetic` and `SpectralCard` accept your own `children`; `KineticText` accepts `text`. Pointer motion is smoothed without per-frame React renders, stops at rest, and respects reduced motion and touch. `GlassCard` also accepts DOM content above its decorative shader; it does not refract arbitrary DOM behind it.

```tsx
import { SpectralCard, Magnetic, KineticText } from "@vfx-ui/react";

export function Feature() {
  return <SpectralCard>
    <div style={{ padding: 40 }}>
      <h2><KineticText text="Stay curious." /></h2>
      <Magnetic><a href="/explore">Explore</a></Magnetic>
    </div>
  </SpectralCard>;
}
```

## Footer sections

`FooterTidal`, `FooterFold`, and `FooterPhosphor` accept `brand`, `title`, `description`, `cta: { label, href }`, `groups: [{ label, links: [{ label, href }] }]`, `legal`, and `copyright`. `children` replaces the intro and navigation; the artwork remains. Brand text is generated into the artwork, not baked into an image. `interactive` defaults to true and respects reduced motion and touch. The canvas-based effects sleep offscreen. `FooterTidal` also accepts `animate`; `FooterFold` accepts `depth` (0–55 degrees). All accept `color`, `background`, `className`, and `style`.

The current source removes `LiveChart`, `WebGlobe`, and `EnergyOrb`. Keep an earlier published version if you still rely on those exports; `HeroGlobe` is unaffected.


The Glass components render original optical solids over procedural scenes. `RadiantDots` implements a multi-pass light field adapted from the MIT-licensed Vercel VGPU example. It accepts `layout`, `motion`, `color`, `intensity`, `speed`, `animate`, and `interactive`; it does not include status text or imply a real loading state.
