# VFX UI

**Expressive React components: GPU atmospheres, customizable Hero and Footer sections, and tactile content interactions.** Explore the real effects, tune their props, and bring your own words, images, links, and buttons.

GPU effects use [vgpu](https://github.com/vercel-labs/vgpu). The three Footers, Magnetic, SpectralCard, and KineticText use DOM/CSS/Canvas and work without WebGPU. All ship as TypeScript React components and copy-paste registry items.

```bash
npm install @vfx-ui/react vgpu
```

```tsx
import { WaveBackground } from "@vfx-ui/react";

export function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <WaveBackground />
      <h1 style={{ position: "relative", zIndex: 1 }}>GPU effects, native React.</h1>
    </section>
  );
}
```

## The catalog

| Category | Components |
|---|---|
| Heroes | HeroFluid · HeroAurora · HeroFiber · HeroGlobe · HeroMesh · HeroIridescent · HeroVortex · HeroRibbon · HeroParticles · HeroStarfield · HeroBlackHole · HeroChroma |
| Footers | FooterTidal · FooterFold · FooterPhosphor |
| Backgrounds | WaveBackground · FluidGradient · Aurora · Starfield · ParticleField · MeshGradient · Iridescent · Vortex · RibbonField · FiberFlow · ChromaFlow |
| Glass | GlassCard · LiquidGlass · GlassLens · LightPrism |
| Interactions | SpectralCard · Magnetic |
| Text | KineticText |

Components ship typed props, SSR-safe rendering and `prefers-reduced-motion` handling. GPU effects include presets and a fallback for unsupported browsers; Footers expose brand, content, navigation and colors.

## What it is not

The library focuses on visual atmosphere and content interaction, not general UI primitives or full-page templates. Hero sample copy is replaceable: pass `title`/`subtitle`, configure CTA objects with `href` or `onClick`, or supply `children` to replace the content layout.

## Copy-paste instead of install

```bash
npx @vfx-ui/cli add wave-background liquid-glass
npm install vgpu
```

Self-contained sources land in `components/` — you own the code. Registry follows the [shadcn registry format](https://ui.shadcn.com/docs/registry); index at [`registry/dist/index.json`](registry/dist/index.json).

## For AI agents

Machine-readable docs: [`public/llms.txt`](apps/docs/public/llms.txt), [`public/agents.md`](apps/docs/public/agents.md), and one markdown doc per component (props, variants, guardrails). Deterministic GPU testing is built in — `vgpu/mock` + Dawn readback pixel tests run in CI without a GPU.

## Development

```bash
pnpm install
pnpm -r typecheck && pnpm -r test   # deterministic tests incl. Dawn pixel readback
pnpm -r build
pnpm dev:docs                        # catalog at localhost:5173
node registry/build.mjs              # rebuild copy-paste registry from sources
node scripts/generate-agentic.mjs    # rebuild llms.txt / agents.md
```

Monorepo: `packages/core` (vgpu-backed renderer contract) · `packages/react` (components) · `packages/cli` · `apps/docs` (catalog site) · `registry` · `scripts`.

## License & credits

MIT. The docs shell is derived from [MengTo/threeui](https://github.com/MengTo/threeui) (MIT, © 2026 Meng To) — thank you for showing what a component catalog can be. Renderer core: [vercel-labs/vgpu](https://github.com/vercel-labs/vgpu) (MIT). HeroGlobe uses [shuding/cobe](https://github.com/shuding/cobe) (MIT).

## Footers

`FooterTidal` draws copper tidal lines beneath your wordmark. `FooterFold` prints it across hinged paper panels. `FooterPhosphor` builds it from light cells that scatter around the pointer. All three are complete semantic footers, with real DOM navigation and a static reduced-motion composition.

```tsx
import { FooterTidal } from "@vfx-ui/react";

<FooterTidal
  brand="YOUR STUDIO"
  title="Let’s talk."
  cta={{ label: "Contact", href: "mailto:hello@example.com" }}
  groups={[{ label: "Explore", links: [{ label: "Work", href: "/work" }] }]}
  copyright="© Your studio"
/>
```

Use your own destinations and copy. `children` replaces the introduction and navigation while retaining the artwork and legal row. The font inherits your site; `--vfx-footer-display` overrides the wordmark face.

LiveChart, WebGlobe and EnergyOrb have been removed from the current source and install catalog. Their old exports and routes are no longer available. HeroGlobe remains supported.
