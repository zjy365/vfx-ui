# VFX UI

Product conventions and design guidance are documented in [PRODUCT.md](PRODUCT.md) and [DESIGN.md](DESIGN.md).

**Expressive React components: GPU atmospheres, customizable Hero and Footer sections, tactile content interactions, and complete installable page Blocks for marketing sites.** Explore the real effects, tune their props, and bring your own words, images, links, and buttons.

GPU effects use [vgpu](https://github.com/vercel-labs/vgpu). The four Footers, Magnetic, SpectralCard, and KineticText use DOM/CSS/Canvas and work without WebGPU. All ship as TypeScript React components and copy-paste registry items.

```bash
npx shadcn@latest add https://vfx-ui.com/r/wave-background.json
```

```tsx
import { WaveBackground } from "@/components/WaveBackground";

export function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <WaveBackground />
      <h1 style={{ position: "relative", zIndex: 1 }}>GPU effects, native React.</h1>
    </section>
  );
}
```

The npm registry still serves the earlier `0.1.0` packages. This catalog targets the unreleased `0.1.1` distribution; use the registry source command above until the new packages have been published and independently verified. Local tarball validation is available with `pnpm test:consumer`.

## The catalog

| Category | Components |
|---|---|
| Blocks | BlockNav · BlockShowcase · BlockFeatureGrid · BlockFeatureTabs · BlockScrollStory · BlockProcessSteps · BlockIntegrations · BlockComparison · BlockTestimonials · BlockPricing · BlockFaq · BlockCta |
| Example pages | ExampleLaunch · ExampleStudio |
| Heroes | HeroFluid · HeroAurora · HeroFiber · HeroGlobe · HeroMesh · HeroIridescent · HeroVortex · HeroRibbon · HeroParticles · HeroStarfield · HeroBlackHole · HeroChroma · HeroEclipse · HeroContour |
| Footers | FooterTidal · FooterFold · FooterPhosphor · FooterVinyl |
| Backgrounds | RadiantDots · WaveBackground · FluidGradient · Aurora · Starfield · ParticleField · MeshGradient · Iridescent · Vortex · RibbonField · FiberFlow · ChromaFlow |
| Glass | GlassCard · LiquidGlass · GlassLens · LightPrism |
| Interactions | SpectralCard · Magnetic |
| Text | KineticText |

Components ship typed props, SSR-safe rendering and `prefers-reduced-motion` handling. GPU effects include presets and a fallback for unsupported browsers; Footers expose brand, content, navigation and colors. Blocks are pure DOM/CSS sections — navigation, showcase, features, pricing, FAQ, CTA and more — whose copy, links, items and colors all arrive through props, and they compose into the two installable example pages.

## Product direction

VFX UI is a general React component library with a focus on shaders, expressive headers, heroes and footers. Existing components stay independently usable. New basic UI is added when a real page or template needs it.

Hero copy is replaceable through typed props. Blocks and examples use visibly marked fictional content; replace it before publishing your own site.

## Copy-paste instead of install

```bash
npx shadcn@latest add https://vfx-ui.com/r/wave-background.json
npx shadcn@latest add https://vfx-ui.com/r/liquid-glass.json
```

Self-contained sources land in `components/` — you own the code. Registry follows the [shadcn registry format](https://ui.shadcn.com/docs/registry); index at [`registry/dist/index.json`](registry/dist/index.json).

## Free library

The public website currently publishes the free MIT component library, installation guides and three practical React UI articles. Browsing and source installation require no account. No checkout or account service is exposed by this release.

## For AI agents

Machine-readable docs: [`public/llms.txt`](apps/docs/public/llms.txt), [`public/agents.md`](apps/docs/public/agents.md), and one markdown doc per component (props, variants, guardrails). Tests include `vgpu/mock`, renderer lifecycle checks and deterministic Dawn pixel readback.

## Development

```bash
pnpm install
pnpm -r typecheck && pnpm -r test   # deterministic tests incl. Dawn pixel readback
pnpm -r build
pnpm catalog:check                   # free catalog / registry / MCP parity
pnpm test:consumer                   # real React 18/Vite and React 19/Next tarballs
pnpm dev:docs                        # new site at localhost:3100
node registry/build.mjs              # rebuild copy-paste registry from sources
node scripts/generate-agentic.mjs    # rebuild llms.txt / agents.md
```

Before advertising npm installation again, publish the tested Core, React and CLI versions in that order, then run `node scripts/check-npm-release.mjs`. That separate release check verifies npm's actual `latest` metadata, export maps and a clean registry consumer. The manual “Verify public npm release” workflow runs the same check; ordinary site CI validates the source/registry distribution without pretending unpublished packages are available. npm credentials and two-factor authentication are managed outside this repository.

Monorepo: `packages/core` (vgpu-backed renderer contract) · `packages/react` (components) · `packages/cli` · `apps/site` (Next.js product site and documentation) · `apps/preview` (isolated React 18 examples) · `apps/docs` (legacy metadata/source assets) · `registry` · `scripts`.

## Website deployment

[vfx-ui.com](https://vfx-ui.com) is hosted by the Cloudflare Pages project
`vfx-ui`, connected directly to this GitHub repository. Every push to `main`
automatically rebuilds and publishes the landing page, component catalog,
copy-paste registry, and agent documentation. Local edits must be committed and
pushed to trigger an update. Preview branch deployments are disabled.

Pages build settings: repository root, Node.js `22`, pnpm `8.15.9`, output
`apps/docs/dist`, and this build command:

```sh
pnpm --filter @vfx-ui/docs build
```

The `Check public product build` GitHub workflow validates builds; Cloudflare handles
publishing through its GitHub integration without a GitHub Actions API token.
The publication policy in `catalog/publication.mjs` currently exports only the free library. Account links remain disabled regardless of `NEXT_PUBLIC_ACCOUNT_URL`; deferred template routes, documentation and assets are omitted from the final static export.
Custom domains are configured in Pages and use proxied CNAME records pointing
to `vfx-ui-site.pages.dev`. This is the sole Pages project for this website.

For a local deployment handoff, run `pnpm release:free`. It builds the static site,
verifies its SEO and crawlable links, and writes a checksummed archive under
`output/free-site/`. It never uploads or deploys. See [the deployment handoff](docs/free-site-deployment.md).
Three free articles are published from `apps/site/content/blog/`; the template-selection article is preserved but excluded by the publication policy. The original
`content-drafts/` reference files are not part of the site build.

## License & credits

The free library is MIT. Legacy catalog code retained in `apps/docs` was derived from [MengTo/threeui](https://github.com/MengTo/threeui) (MIT, © 2026 Meng To). The new product site follows our Paper designs; Fumadocs is used for technical documentation. Renderer core: [vercel-labs/vgpu](https://github.com/vercel-labs/vgpu) (MIT). HeroGlobe uses [shuding/cobe](https://github.com/shuding/cobe) (MIT).

Adapted component sources and generated distributions retain their upstream copyright and MIT notices; preserve those notices when redistributing them.

## Footers

`FooterTidal` draws copper tidal lines beneath your wordmark. `FooterFold` prints it across hinged paper panels. `FooterPhosphor` builds it from light cells that scatter around the pointer. `FooterVinyl` turns the closing navigation into a pink record sleeve. All four are complete semantic footers, with real DOM navigation and a static reduced-motion composition.

```tsx
import { FooterTidal } from "@/components/FooterTidal";

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

### Optical glass and radiance

The Glass collection now uses original ray-marched solids: a beveled card, a biconvex lens, a molten loop, and a triangular glass frame. Rays cross entry and exit interfaces, with spectral transmission and studio reflections. These are procedural scenes, not filters that refract arbitrary DOM. Existing exports and preset URLs remain available; their appearance has changed.

`RadiantDots` adds an orbital or square light field with real jump-flooded distance fields and radiance cascades. The pipeline is adapted from [Vercel's MIT example](https://vgpu.labs.vercel.dev/examples/agent-radiance-cascades); the arrangement and choreography are VFX UI's. It suspends continuous rendering offscreen, in hidden tabs, and under reduced motion. See [the design and implementation record](docs/design/glass.md).

The MIT license covers the free component library and its applicable open-source notices. Deferred preview assets in `previews/` are not part of the published free-site export; their own notices remain with their source files.
