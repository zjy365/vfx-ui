# Pro templates

Complete, production-shaped page compositions assembled from the free `@vfx-ui/react`
catalog — the paid layer's ready-to-ship starting points. Each template is a single
self-contained `.tsx` file (no dependencies beyond `@vfx-ui/react` and React), every
string is prop-driven fictional demo content, and each carries a visible screen-top
`PRO TEMPLATE DEMO` marker plus per-section demo notes, following the honest-labeling
convention of the free examples (`ExampleLaunch`, `ExampleStudio`). Install through the
token-gated private registry; see each template's README for the section manifest and
swap-in-your-content notes.

| Template | One-liner | Components (count) |
|---|---|---|
| [`ai-launch/`](./ai-launch/) | Dark, violet AI product launch page — vortex hero, stats that count, phosphor footer | BlockBanner, BlockNav, HeroVortexCentered, BlockShowcase, BlockFeatureTabs, BlockStats, BlockPricing, BlockFaq, BlockCta, FooterPhosphor (10) |
| [`saas-site/`](./saas-site/) | Light editorial SaaS marketing site — serif masthead under an aurora, copper tide to close | BlockNav, HeroAuroraEditorial, BlockLogos, BlockFeatureGrid, BlockComparison, BlockTestimonials, BlockNewsletter, BlockContact, FooterTidal (9) |
| [`portfolio/`](./portfolio/) | Colorful one-person portfolio — chroma hero, lightbox gallery, quote wall, paper fold footer | BlockNav, HeroChromaFull, BlockGallery, BlockStats, BlockTimeline, BlockQuoteWall, BlockTeam, BlockCta, FooterFold (9) |

Common conventions across all three:

- **One file per page** — copy it anywhere, change the copy, delete the demo marker, ship.
- **8–12 components per page**, all free-tier MIT blocks; the Pro value is the composition,
  theming, copy architecture, and the polish of seams between sections.
- **Pro iris violet** (`#6D5AE0` light / `#9D8CFF` dark, per `DESIGN.md`) appears only in
  the demo marker and `ai-launch`'s accents — swap or keep when you remove the demo layer.
- **Accessibility carries through**: real links, focus-visible styles, reduced-motion
  fallbacks, and a lightbox/rotor that behave — because the underlying blocks provide them.

More templates land with later Pro batches.
