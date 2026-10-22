/** Public component source manifest. Free entries only; no paid source files. */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

const SOURCES = [
  ...[
    [
      "hero-eclipse",
      "HeroEclipse",
      "Hero Eclipse",
      "An engraved astronomical dial with a pointer-controlled eclipse.",
    ],
    [
      "hero-contour",
      "HeroContour",
      "Hero Contour",
      "A seeded topographic paper landscape that lifts around the pointer.",
    ],
  ].map(([name, component, title, description]) => ({
    name,
    component,
    title,
    description,
    categories: ["Heroes"],
    tags: ["hero", "pointer", "editorial"],
    sharedFiles: false,
    motion: true,
    deps: ["StudioHeroFrame", "HeroShell"],
  })),
  {
    name: "footer-vinyl",
    component: "FooterVinyl",
    title: "Footer Vinyl",
    description:
      "A record-sleeve footer with a pointer-rotated vinyl and your own label.",
    categories: ["Footers"],
    tags: ["footer", "vinyl", "pointer"],
    sharedFiles: false,
    motion: true,
    deps: ["FooterFrame"],
  },
  {
    name: "astra-field",
    component: "AstraField",
    title: "Astra Field",
    description: "A rotatable spiral galaxy of glowing stars.",
    categories: ["Backgrounds"],
    tags: ["galaxy", "stars"],
    sharedFiles: false,
  },
  {
    name: "radiant-dots",
    component: "RadiantDots",
    title: "Radiant Dots",
    description:
      "Orbital emitters with jump-flooded distance fields and radiance cascades.",
    categories: ["Backgrounds"],
    tags: ["radiance", "light", "dots"],
    deps: ["RadianceEngine"],
  },
  ...[
    [
      "footer-tidal",
      "FooterTidal",
      "Footer Tidal",
      "Copper tidal lines beneath your brand, with pointer-driven currents.",
    ],
    [
      "footer-fold",
      "FooterFold",
      "Footer Fold",
      "A wordmark printed across hinged paper panels that respond to the pointer.",
    ],
    [
      "footer-phosphor",
      "FooterPhosphor",
      "Footer Phosphor",
      "A luminous cell wordmark that disperses around your pointer and settles home.",
    ],
  ].map(([name, component, title, description]) => ({
    name,
    component,
    title,
    description,
    categories: ["Footers"],
    tags: ["footer", "pointer", "typography"],
    sharedFiles: false,
    motion: component === "FooterFold",
    deps:
      component === "FooterFold"
        ? ["FooterFrame"]
        : ["FooterFrame", "FooterArtwork"],
  })),
  ...[
    [
      "spectral-card",
      "SpectralCard",
      "Spectral Card",
      "Holographic light and spatial tilt around your own content.",
      "Interactions",
    ],
    [
      "kinetic-text",
      "KineticText",
      "Kinetic Text",
      "A pointer-driven force field lifts your words into a soft wave.",
      "Text",
    ],
    [
      "magnetic",
      "Magnetic",
      "Magnetic",
      "A gentle magnetic pull for your own buttons, links, and content.",
      "Interactions",
    ],
  ].map(([name, component, title, description, category]) => ({
    name,
    component,
    title,
    description,
    categories: [category],
    tags: ["pointer", "interactive"],
    sharedFiles: false,
    motion: true,
  })),
  {
    name: "wave-background",
    component: "WaveBackground",
    title: "Wave Background",
    description:
      "Three layered sine bands sweeping over a tri-color gradient. GPU-rendered via WebGPU; DOM cannot reproduce it.",
    categories: ["Backgrounds"],
    tags: ["background", "gradient", "wave", "hero"],
    files: ["components/WaveBackground.tsx"],
  },
  {
    name: "fluid-gradient",
    component: "FluidGradient",
    title: "Fluid Gradient",
    description: "Domain-warped fBm noise flowing through a tri-color palette.",
    categories: ["Backgrounds"],
    tags: ["background", "fluid", "noise"],
    files: ["components/FluidGradient.tsx"],
  },
  {
    name: "aurora",
    component: "Aurora",
    title: "Aurora",
    description:
      "Vertical light curtains driven by fBm perturbation and gaussian bands.",
    categories: ["Backgrounds"],
    tags: ["background", "aurora", "night"],
    files: ["components/Aurora.tsx"],
  },
  {
    name: "starfield",
    component: "Starfield",
    title: "Starfield",
    description: "Hashed star grid with twinkle and slow parallax drift.",
    categories: ["Backgrounds"],
    tags: ["background", "stars", "space"],
    files: ["components/Starfield.tsx"],
  },
  {
    name: "particle-field",
    component: "ParticleField",
    title: "Particle Field",
    description:
      "Procedural cell-hashed particles with drift and size breathing.",
    categories: ["Backgrounds"],
    tags: ["background", "particles"],
    files: ["components/ParticleField.tsx"],
  },
  {
    name: "glass-card",
    component: "GlassCard",
    deps: ["OpticalGlass"],
    title: "Glass Card",
    description:
      "Thick-cut optical glass with two-interface refraction and studio reflections.",
    categories: ["Glass"],
    tags: ["glass", "card", "sdf"],
    files: ["components/GlassCard.tsx"],
  },
  {
    name: "liquid-glass",
    component: "LiquidGlass",
    deps: ["OpticalGlass"],
    title: "Liquid Glass",
    description:
      "A molten glass annulus with a travelling silhouette and spectral transmission.",
    categories: ["Glass"],
    tags: ["glass", "refraction", "liquid"],
    files: ["components/LiquidGlass.tsx"],
  },
  {
    name: "glass-lens",
    component: "GlassLens",
    deps: ["OpticalGlass"],
    title: "Glass Lens",
    description:
      "A biconvex glass lens that magnifies and inverts a printed studio scene.",
    categories: ["Glass"],
    tags: ["glass", "refraction", "lens", "liquid-glass"],
    files: ["components/GlassLens.tsx"],
  },
  {
    name: "black-hole",
    component: "BlackHole",
    title: "Black Hole",
    description:
      "The vgpu optimized-black-hole pipeline as a component: baked null-geodesic G-buffer, HDR bloom, prefiltered lensed star field, Doppler beaming — a verbatim port (MIT, Vercel).",
    categories: ["Backgrounds"],
    tags: ["background", "space", "black-hole", "ray-tracing"],
    files: ["components/BlackHole.tsx"],
  },
  {
    name: "mesh-gradient",
    component: "MeshGradient",
    title: "Mesh Gradient",
    description: "Voronoi-cell color fields flowing through a curated palette.",
    categories: ["Backgrounds"],
    tags: ["background", "gradient", "voronoi"],
    files: ["components/MeshGradient.tsx"],
  },
  {
    name: "iridescent",
    component: "Iridescent",
    title: "Iridescent",
    description:
      "Silky thin-film interference colors drifting across the surface.",
    categories: ["Backgrounds"],
    tags: ["background", "holographic", "silk"],
    files: ["components/Iridescent.tsx"],
  },
  {
    name: "vortex",
    component: "Vortex",
    title: "Vortex",
    description: "Spiral galaxy swirl with star speckles and trailing arms.",
    categories: ["Backgrounds"],
    tags: ["background", "galaxy", "spiral"],
    files: ["components/Vortex.tsx"],
  },
  {
    name: "ribbon-field",
    component: "RibbonField",
    title: "Ribbon Field",
    description:
      "Three Gaussian light ribbons over a dot-matrix grid with bloom and grain — WGSL port of ThreeUI's RibbonField (MIT, Copyright 2026 Meng To).",
    categories: ["Backgrounds"],
    tags: ["background", "ribbon", "dots", "glow"],
    files: ["components/RibbonField.tsx"],
  },
  {
    name: "fiber-flow",
    component: "FiberFlow",
    title: "Fiber Flow",
    description:
      "Luminous silk fibers streaming through the dark — domain-warped fbm ridge field with pointer parallax (opt-in).",
    categories: ["Backgrounds"],
    tags: ["background", "fibers", "silk", "flow", "waves"],
    files: ["components/FiberFlow.tsx"],
  },
  {
    name: "light-prism",
    component: "LightPrism",
    deps: ["OpticalGlass", "PrismScene", "PrismEngine"],
    title: "Light Prism",
    description:
      "A solid beveled optical prism using Vercel’s complete MIT spectral optics and multi-pass glass pipeline.",
    categories: ["Glass"],
    tags: ["glass", "prism", "refraction", "hero", "paper"],
    files: ["components/LightPrism.tsx"],
  },
  {
    name: "hero-fluid",
    component: "HeroFluid",
    title: "Hero Fluid",
    description:
      "Drop-in hero section: centered headline over a GPU liquid-gradient field with real selectable DOM text, scrim-backed contrast, and a reduced-motion static fallback.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "gradient", "fluid"],
    files: ["components/HeroFluid.tsx"],
    deps: ["HeroShell", "FluidGradient"],
  },
  {
    name: "hero-aurora",
    component: "HeroAurora",
    title: "Hero Aurora",
    description:
      "Drop-in hero section: bottom-left copy anchored under full-bleed aurora curtains rendered per-pixel on the GPU.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "aurora", "night"],
    files: ["components/HeroAurora.tsx"],
    deps: ["HeroShell", "Aurora"],
  },
  {
    name: "hero-fiber",
    component: "HeroFiber",
    title: "Hero Fiber",
    description:
      "Drop-in hero section: top-weighted headline over luminous silk fibers streaming through the dark.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "fibers", "silk"],
    files: ["components/HeroFiber.tsx"],
    deps: ["HeroShell", "FiberFlow"],
  },
  {
    name: "hero-globe",
    component: "HeroGlobe",
    title: "Hero Globe",
    description:
      "Drop-in split hero: copy on the left, the dot-matrix cobe planet (the globe behind vercel.com) glowing on the right.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "globe", "split"],
    files: ["components/HeroGlobe.tsx"],
    deps: ["HeroShell"],
    sharedFiles: false,
    npmDependencies: ["cobe@^2.0.1"],
  },
  {
    name: "hero-mesh",
    component: "HeroMesh",
    title: "Hero Mesh",
    description:
      "Drop-in hero section: centered headline over a slow Voronoi mesh-gradient field — every frame a different poster.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "gradient", "mesh"],
    files: ["components/HeroMesh.tsx"],
    deps: ["HeroShell", "MeshGradient"],
  },
  {
    name: "hero-iridescent",
    component: "HeroIridescent",
    title: "Hero Iridescent",
    description:
      "Drop-in hero section: left copy over a holographic thin-film sheen — the premium product-launch look, computed per-pixel.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "holographic", "silk"],
    files: ["components/HeroIridescent.tsx"],
    deps: ["HeroShell", "Iridescent"],
  },
  {
    name: "hero-vortex",
    component: "HeroVortex",
    title: "Hero Vortex",
    description:
      "Drop-in hero section: centered headline at the eye of a spiral galaxy with star speckles and trailing arms.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "galaxy", "spiral"],
    files: ["components/HeroVortex.tsx"],
    deps: ["HeroShell", "Vortex"],
  },
  {
    name: "hero-ribbon",
    component: "HeroRibbon",
    title: "Hero Ribbon",
    description:
      "Drop-in split hero: copy left, three Gaussian light ribbons sweeping the right over a dot-matrix grid.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "ribbon", "split"],
    files: ["components/HeroRibbon.tsx"],
    deps: ["HeroShell", "RibbonField"],
  },
  {
    name: "hero-particles",
    component: "HeroParticles",
    title: "Hero Particles",
    description:
      "Drop-in hero section: top-weighted headline with a badge row over a drifting GPU particle field.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "particles"],
    files: ["components/HeroParticles.tsx"],
    deps: ["HeroShell", "ParticleField"],
  },
  {
    name: "hero-starfield",
    component: "HeroStarfield",
    title: "Hero Starfield",
    description:
      "Drop-in hero section: bottom-left copy under a twinkling hashed star grid with parallax drift.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "stars", "space"],
    files: ["components/HeroStarfield.tsx"],
    deps: ["HeroShell", "Starfield"],
  },
  {
    name: "hero-black-hole",
    component: "HeroBlackHole",
    title: "Hero Black Hole",
    description:
      "Drop-in hero section: left copy beside a ray-traced accretion disk with relativistic beaming and a lensed star field.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "space", "black-hole"],
    files: ["components/HeroBlackHole.tsx"],
    deps: ["HeroShell", "BlackHole"],
  },
  {
    name: "chroma-flow",
    component: "ChromaFlow",
    title: "Chroma Flow",
    description:
      "Four-edge liquid color field that floods inward toward the direction the cursor sweeps — fbm-noise bleed boundaries driven by pointer velocity.",
    categories: ["Backgrounds"],
    tags: ["background", "gradient", "chromatic", "pointer"],
    files: ["components/ChromaFlow.tsx"],
  },
  {
    name: "hero-chroma",
    component: "HeroChroma",
    title: "Hero Chroma",
    description:
      "Drop-in hero section: bottom-left copy over a four-edge liquid color field that floods toward the cursor's sweep direction.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "chromatic", "gradient"],
    files: ["components/HeroChroma.tsx"],
    deps: ["HeroShell", "ChromaFlow"],
  },
  ...[
    [
      "block-nav",
      "BlockNav",
      "Block Nav",
      "Complete navigation bar: brand, desktop links, actions, and an accessible mobile sheet with Escape handling.",
      ["navigation", "menu", "mobile"],
    ],
    [
      "block-showcase",
      "BlockShowcase",
      "Block Showcase",
      "Product showcase stage: browser-chrome frame with a replaceable screenshot or video (CSS demo UI by default), headline and actions.",
      ["showcase", "product", "media"],
    ],
    [
      "block-feature-grid",
      "BlockFeatureGrid",
      "Block Feature Grid",
      "Feature grid with real hierarchy: one bento feature card plus supporting cells, replaceable icons and media.",
      ["features", "bento", "grid"],
    ],
    [
      "block-feature-tabs",
      "BlockFeatureTabs",
      "Block Feature Tabs",
      "Feature tabs where list, copy and illustration switch together; WAI-ARIA keyboard pattern, touch-friendly strip on mobile.",
      ["tabs", "features", "keyboard"],
    ],
    [
      "block-scroll-story",
      "BlockScrollStory",
      "Block Scroll Story",
      "Scroll narrative: a sticky scene crossfades as story steps cross the viewport; docks above the steps on mobile.",
      ["scroll", "story", "sticky"],
    ],
    [
      "block-process-steps",
      "BlockProcessSteps",
      "Block Process Steps",
      "Three-to-four step process with a self-drawing connector line and replaceable media per step.",
      ["steps", "process", "timeline"],
    ],
    [
      "block-integrations",
      "BlockIntegrations",
      "Block Integrations",
      "Integrations hub with static connection rings of rebrandable tool tiles and an always-available link grid fallback.",
      ["integrations", "logos", "orbit"],
    ],
    [
      "block-comparison",
      "BlockComparison",
      "Block Comparison",
      "Before/after comparison with a draggable, keyboard- and touch-operable reveal handle (a real range input).",
      ["comparison", "before-after", "slider"],
    ],
    [
      "block-testimonials",
      "BlockTestimonials",
      "Block Testimonials",
      "Testimonials with a featured quote and field notes; fictional demo copy is visibly marked and fully replaceable.",
      ["testimonials", "quotes", "social-proof"],
    ],
    [
      "block-pricing",
      "BlockPricing",
      "Block Pricing",
      "Pricing plans with a working monthly/annual switch — amounts, basis lines and savings render from data.",
      ["pricing", "plans", "billing"],
    ],
    [
      "block-faq",
      "BlockFaq",
      "Block FAQ",
      "FAQ accordion with real disclosure semantics, arrow-key traversal and CSS grid-rows animation; long answers welcome.",
      ["faq", "accordion", "keyboard"],
    ],
    [
      "block-cta",
      "BlockCta",
      "Block CTA",
      "Closing call to action with primary/secondary actions and a replaceable brand visual layer (concentric line artwork by default).",
      ["cta", "closing", "conversion"],
    ],
  ].map(([name, component, title, description, extraTags]) => ({
    name,
    component,
    title,
    description,
    categories: ["Blocks"],
    tags: ["block", "section", "landing", ...extraTags],
    sharedFiles: false,
    motion: component === "BlockShowcase",
    blockShared: true,
  })),
  {
    name: "example-launch",
    component: "ExampleLaunch",
    title: "Example — Product Launch",
    description:
      'Complete fictional software launch page ("Orbit" by Lumen Labs): hero, showcase, feature grid, tabs, scroll story, integrations, pricing, testimonials, FAQ, CTA. All copy is demo content.',
    categories: ["Blocks"],
    tags: ["example", "landing", "launch", "product"],
    sharedFiles: false,
    registryDeps: [
      "block-nav",
      "block-showcase",
      "block-feature-grid",
      "block-feature-tabs",
      "block-scroll-story",
      "block-integrations",
      "block-pricing",
      "block-testimonials",
      "block-faq",
      "block-cta",
    ],
  },
  {
    name: "example-studio",
    component: "ExampleStudio",
    title: "Example — Design Studio",
    description:
      "Complete fictional design-studio service page (Atelier North): daylight editorial hero, engagement steps, portfolio showcase, before/after slider, services grid, fixed-fee engagements, testimonials, FAQ and a typographic footer.",
    categories: ["Blocks"],
    tags: ["example", "portfolio", "studio", "services"],
    sharedFiles: false,
    registryDeps: [
      "block-nav",
      "block-process-steps",
      "block-showcase",
      "block-comparison",
      "block-feature-grid",
      "block-pricing",
      "block-testimonials",
      "block-faq",
      "block-cta",
    ],
  },

  /* ── 2026-09-28 agent batches: the manifests are the single source of truth. ──
     registry/batches/<batch>.manifest.json entries are loaded here; edit the
     manifests, not a copy of them. */
  ...readdirSync(join(root, "registry", "batches"))
    .filter((f) => f.endsWith(".manifest.json"))
    .sort()
    .flatMap((f) =>
      JSON.parse(readFileSync(join(root, "registry", "batches", f), "utf8")),
    ),
];

// Human-facing metadata has one canonical home, shared with the website.
const metadata = new Map(
  JSON.parse(readFileSync(join(root, "catalog/metadata.json"), "utf8")).map(
    (item) => [item.id, item],
  ),
);
export const CATALOG = SOURCES.map((source) => {
  const item = metadata.get(source.name);
  if (!item) throw new Error(`Missing catalog metadata: ${source.name}`);
  return {
    ...source,
    title: item.label,
    description: item.description,
    categories: [item.category],
    tags: item.tags,
  };
});
