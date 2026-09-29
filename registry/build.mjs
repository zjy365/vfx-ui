#!/usr/bin/env node
/**
 * vfx-ui registry builder.
 *
 * Generates shadcn-registry-format JSON (registry/index.json + registry/r/*.json)
 * from the live component sources, so the copy-paste catalog can never drift
 * from the npm package. This is the lesson learned from threeui: its catalog
 * generator lived in a private repo; ours lives here.
 *
 * Usage: node registry/build.mjs [--out <dir>]
 */
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reactSrc = join(root, "packages/react/src");
const outDir = process.argv.includes("--out")
  ? resolve(process.argv[process.argv.indexOf("--out") + 1])
  : join(root, "registry", "dist");
/**
 * Base URL registryDependencies resolve against. shadcn CLI treats bare names
 * as shadcn.com items, so cross-item references must be absolute URLs. Pass
 * --base http://127.0.0.1:4199/r/ when validating against a local server.
 */
const REGISTRY_BASE = process.argv.includes("--base")
  ? process.argv[process.argv.indexOf("--base") + 1]
  : "https://vfx-ui.com/r/";

/** Catalog metadata: the single source of truth for the public registry. */
const CATALOG = [
  ...[
    ["hero-eclipse", "HeroEclipse", "Hero Eclipse", "An engraved astronomical dial with a pointer-controlled eclipse."],
    ["hero-contour", "HeroContour", "Hero Contour", "A seeded topographic paper landscape that lifts around the pointer."],
  ].map(([name, component, title, description]) => ({ name, component, title, description, categories: ["Heroes"], tags: ["hero", "pointer", "editorial"], sharedFiles: false, motion: true, deps: ["StudioHeroFrame", "HeroShell"] })),
  { name: "footer-vinyl", component: "FooterVinyl", title: "Footer Vinyl", description: "A record-sleeve footer with a pointer-rotated vinyl and your own label.", categories: ["Footers"], tags: ["footer", "vinyl", "pointer"], sharedFiles: false, motion: true, deps: ["FooterFrame"] },
  { name: "astra-field", component: "AstraField", title: "Astra Field", description: "A rotatable spiral galaxy of glowing stars.", categories: ["Backgrounds"], tags: ["galaxy", "stars"], sharedFiles: false },
  { name: "radiant-dots", component: "RadiantDots", title: "Radiant Dots", description: "Orbital emitters with jump-flooded distance fields and radiance cascades.", categories: ["Backgrounds"], tags: ["radiance", "light", "dots"], deps: ["RadianceEngine"] },
  ...[
    ["footer-tidal", "FooterTidal", "Footer Tidal", "Copper tidal lines beneath your brand, with pointer-driven currents."],
    ["footer-fold", "FooterFold", "Footer Fold", "A wordmark printed across hinged paper panels that respond to the pointer."],
    ["footer-phosphor", "FooterPhosphor", "Footer Phosphor", "A luminous cell wordmark that disperses around your pointer and settles home."],
  ].map(([name, component, title, description]) => ({ name, component, title, description, categories: ["Footers"], tags: ["footer", "pointer", "typography"], sharedFiles: false, motion: component === "FooterFold", deps: component === "FooterFold" ? ["FooterFrame"] : ["FooterFrame", "FooterArtwork"] })),
  ...[
    ["spectral-card", "SpectralCard", "Spectral Card", "Holographic light and spatial tilt around your own content.", "Interactions"],
    ["kinetic-text", "KineticText", "Kinetic Text", "A pointer-driven force field lifts your words into a soft wave.", "Text"],
    ["magnetic", "Magnetic", "Magnetic", "A gentle magnetic pull for your own buttons, links, and content.", "Interactions"],
  ].map(([name, component, title, description, category]) => ({ name, component, title, description, categories: [category], tags: ["pointer", "interactive"], sharedFiles: false, motion: true })),
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
    description: "Vertical light curtains driven by fBm perturbation and gaussian bands.",
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
    description: "Procedural cell-hashed particles with drift and size breathing.",
    categories: ["Backgrounds"],
    tags: ["background", "particles"],
    files: ["components/ParticleField.tsx"],
  },
  {
    name: "glass-card",
    component: "GlassCard",
    deps: ["OpticalGlass"],
    title: "Glass Card",
    description: "Thick-cut optical glass with two-interface refraction and studio reflections.",
    categories: ["Glass"],
    tags: ["glass", "card", "sdf"],
    files: ["components/GlassCard.tsx"],
  },
  {
    name: "liquid-glass",
    component: "LiquidGlass",
    deps: ["OpticalGlass"],
    title: "Liquid Glass",
    description: "A molten glass annulus with a travelling silhouette and spectral transmission.",
    categories: ["Glass"],
    tags: ["glass", "refraction", "liquid"],
    files: ["components/LiquidGlass.tsx"],
  },
  {
    name: "glass-lens",
    component: "GlassLens",
    deps: ["OpticalGlass"],
    title: "Glass Lens",
    description: "A biconvex glass lens that magnifies and inverts a printed studio scene.",
    categories: ["Glass"],
    tags: ["glass", "refraction", "lens", "liquid-glass"],
    files: ["components/GlassLens.tsx"],
  },
  {
    name: "black-hole",
    component: "BlackHole",
    title: "Black Hole",
    description: "The vgpu optimized-black-hole pipeline as a component: baked null-geodesic G-buffer, HDR bloom, prefiltered lensed star field, Doppler beaming — a verbatim port (MIT, Vercel).",
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
    description: "Silky thin-film interference colors drifting across the surface.",
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
    description: "Three Gaussian light ribbons over a dot-matrix grid with bloom and grain — WGSL port of ThreeUI's RibbonField (MIT, Copyright 2026 Meng To).",
    categories: ["Backgrounds"],
    tags: ["background", "ribbon", "dots", "glow"],
    files: ["components/RibbonField.tsx"],
  },
  {
    name: "fiber-flow",
    component: "FiberFlow",
    title: "Fiber Flow",
    description: "Luminous silk fibers streaming through the dark — domain-warped fbm ridge field with pointer parallax (opt-in).",
    categories: ["Backgrounds"],
    tags: ["background", "fibers", "silk", "flow", "waves"],
    files: ["components/FiberFlow.tsx"],
  },
  {
    name: "light-prism",
    component: "LightPrism",
    deps: ["OpticalGlass", "PrismScene", "PrismEngine"],
    title: "Light Prism",
    description: "A solid beveled optical prism using Vercel’s complete MIT spectral optics and multi-pass glass pipeline.",
    categories: ["Glass"],
    tags: ["glass", "prism", "refraction", "hero", "paper"],
    files: ["components/LightPrism.tsx"],
  },
  {
    name: "hero-fluid",
    component: "HeroFluid",
    title: "Hero Fluid",
    description: "Drop-in hero section: centered headline over a GPU liquid-gradient field with real selectable DOM text, scrim-backed contrast, and a reduced-motion static fallback.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "gradient", "fluid"],
    files: ["components/HeroFluid.tsx"],
    deps: ["HeroShell", "FluidGradient"],
  },
  {
    name: "hero-aurora",
    component: "HeroAurora",
    title: "Hero Aurora",
    description: "Drop-in hero section: bottom-left copy anchored under full-bleed aurora curtains rendered per-pixel on the GPU.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "aurora", "night"],
    files: ["components/HeroAurora.tsx"],
    deps: ["HeroShell", "Aurora"],
  },
  {
    name: "hero-fiber",
    component: "HeroFiber",
    title: "Hero Fiber",
    description: "Drop-in hero section: top-weighted headline over luminous silk fibers streaming through the dark.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "fibers", "silk"],
    files: ["components/HeroFiber.tsx"],
    deps: ["HeroShell", "FiberFlow"],
  },
  {
    name: "hero-globe",
    component: "HeroGlobe",
    title: "Hero Globe",
    description: "Drop-in split hero: copy on the left, the dot-matrix cobe planet (the globe behind vercel.com) glowing on the right.",
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
    description: "Drop-in hero section: centered headline over a slow Voronoi mesh-gradient field — every frame a different poster.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "gradient", "mesh"],
    files: ["components/HeroMesh.tsx"],
    deps: ["HeroShell", "MeshGradient"],
  },
  {
    name: "hero-iridescent",
    component: "HeroIridescent",
    title: "Hero Iridescent",
    description: "Drop-in hero section: left copy over a holographic thin-film sheen — the premium product-launch look, computed per-pixel.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "holographic", "silk"],
    files: ["components/HeroIridescent.tsx"],
    deps: ["HeroShell", "Iridescent"],
  },
  {
    name: "hero-vortex",
    component: "HeroVortex",
    title: "Hero Vortex",
    description: "Drop-in hero section: centered headline at the eye of a spiral galaxy with star speckles and trailing arms.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "galaxy", "spiral"],
    files: ["components/HeroVortex.tsx"],
    deps: ["HeroShell", "Vortex"],
  },
  {
    name: "hero-ribbon",
    component: "HeroRibbon",
    title: "Hero Ribbon",
    description: "Drop-in split hero: copy left, three Gaussian light ribbons sweeping the right over a dot-matrix grid.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "ribbon", "split"],
    files: ["components/HeroRibbon.tsx"],
    deps: ["HeroShell", "RibbonField"],
  },
  {
    name: "hero-particles",
    component: "HeroParticles",
    title: "Hero Particles",
    description: "Drop-in hero section: top-weighted headline with a badge row over a drifting GPU particle field.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "particles"],
    files: ["components/HeroParticles.tsx"],
    deps: ["HeroShell", "ParticleField"],
  },
  {
    name: "hero-starfield",
    component: "HeroStarfield",
    title: "Hero Starfield",
    description: "Drop-in hero section: bottom-left copy under a twinkling hashed star grid with parallax drift.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "stars", "space"],
    files: ["components/HeroStarfield.tsx"],
    deps: ["HeroShell", "Starfield"],
  },
  {
    name: "hero-black-hole",
    component: "HeroBlackHole",
    title: "Hero Black Hole",
    description: "Drop-in hero section: left copy beside a ray-traced accretion disk with relativistic beaming and a lensed star field.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "space", "black-hole"],
    files: ["components/HeroBlackHole.tsx"],
    deps: ["HeroShell", "BlackHole"],
  },
  {
    name: "chroma-flow",
    component: "ChromaFlow",
    title: "Chroma Flow",
    description: "Four-edge liquid color field that floods inward toward the direction the cursor sweeps — fbm-noise bleed boundaries driven by pointer velocity.",
    categories: ["Backgrounds"],
    tags: ["background", "gradient", "chromatic", "pointer"],
    files: ["components/ChromaFlow.tsx"],
  },
  {
    name: "hero-chroma",
    component: "HeroChroma",
    title: "Hero Chroma",
    description: "Drop-in hero section: bottom-left copy over a four-edge liquid color field that floods toward the cursor's sweep direction.",
    categories: ["Heroes"],
    tags: ["hero", "landing", "chromatic", "gradient"],
    files: ["components/HeroChroma.tsx"],
    deps: ["HeroShell", "ChromaFlow"],
  },
  ...[
    ["block-nav", "BlockNav", "Block Nav", "Complete navigation bar: brand, desktop links, actions, and an accessible mobile sheet with Escape handling.", ["navigation", "menu", "mobile"]],
    ["block-showcase", "BlockShowcase", "Block Showcase", "Product showcase stage: browser-chrome frame with a replaceable screenshot or video (CSS demo UI by default), headline and actions.", ["showcase", "product", "media"]],
    ["block-feature-grid", "BlockFeatureGrid", "Block Feature Grid", "Feature grid with real hierarchy: one bento feature card plus supporting cells, replaceable icons and media.", ["features", "bento", "grid"]],
    ["block-feature-tabs", "BlockFeatureTabs", "Block Feature Tabs", "Feature tabs where list, copy and illustration switch together; WAI-ARIA keyboard pattern, touch-friendly strip on mobile.", ["tabs", "features", "keyboard"]],
    ["block-scroll-story", "BlockScrollStory", "Block Scroll Story", "Scroll narrative: a sticky scene crossfades as story steps cross the viewport; docks above the steps on mobile.", ["scroll", "story", "sticky"]],
    ["block-process-steps", "BlockProcessSteps", "Block Process Steps", "Three-to-four step process with a self-drawing connector line and replaceable media per step.", ["steps", "process", "timeline"]],
    ["block-integrations", "BlockIntegrations", "Block Integrations", "Integrations hub with static connection rings of rebrandable tool tiles and an always-available link grid fallback.", ["integrations", "logos", "orbit"]],
    ["block-comparison", "BlockComparison", "Block Comparison", "Before/after comparison with a draggable, keyboard- and touch-operable reveal handle (a real range input).", ["comparison", "before-after", "slider"]],
    ["block-testimonials", "BlockTestimonials", "Block Testimonials", "Testimonials with a featured quote and field notes; fictional demo copy is visibly marked and fully replaceable.", ["testimonials", "quotes", "social-proof"]],
    ["block-pricing", "BlockPricing", "Block Pricing", "Pricing plans with a working monthly/annual switch — amounts, basis lines and savings render from data.", ["pricing", "plans", "billing"]],
    ["block-faq", "BlockFaq", "Block FAQ", "FAQ accordion with real disclosure semantics, arrow-key traversal and CSS grid-rows animation; long answers welcome.", ["faq", "accordion", "keyboard"]],
    ["block-cta", "BlockCta", "Block CTA", "Closing call to action with primary/secondary actions and a replaceable brand visual layer (concentric line artwork by default).", ["cta", "closing", "conversion"]],
  ].map(([name, component, title, description, extraTags]) => ({
    name, component, title, description,
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
    description: "Complete fictional software launch page (\"Orbit\" by Lumen Labs): hero, showcase, feature grid, tabs, scroll story, integrations, pricing, testimonials, FAQ, CTA. All copy is demo content.",
    categories: ["Blocks"],
    tags: ["example", "landing", "launch", "product"],
    sharedFiles: false,
    registryDeps: ["block-nav", "block-showcase", "block-feature-grid", "block-feature-tabs", "block-scroll-story", "block-integrations", "block-pricing", "block-testimonials", "block-faq", "block-cta"],
  },
  {
    name: "example-studio",
    component: "ExampleStudio",
    title: "Example — Design Studio",
    description: "Complete fictional design-studio service page (Atelier North): daylight editorial hero, engagement steps, portfolio showcase, before/after slider, services grid, fixed-fee engagements, testimonials, FAQ and a typographic footer.",
    categories: ["Blocks"],
    tags: ["example", "portfolio", "studio", "services"],
    sharedFiles: false,
    registryDeps: ["block-nav", "block-process-steps", "block-showcase", "block-comparison", "block-feature-grid", "block-pricing", "block-testimonials", "block-faq", "block-cta"],
  },

  /* ── 2026-09-28 agent batches: the manifests are the single source of truth. ──
     registry/batches/<batch>.manifest.json entries are loaded here; edit the
     manifests, not a copy of them. */
  ...readdirSync(join(root, "registry", "batches"))
    .filter((f) => f.endsWith(".manifest.json"))
    .sort()
    .flatMap((f) => JSON.parse(readFileSync(join(root, "registry", "batches", f), "utf8"))),
];

/** Shared runtime files every registry item needs (copy-paste is self-contained). */
const SHARED_FILES = [
  { path: "vfx/VfxCanvas.tsx", from: join(reactSrc, "VfxCanvas.tsx") },
  { path: "vfx/color.ts", from: join(reactSrc, "utils/color.ts") },
  { path: "vfx/usePointerUniforms.tsx", from: join(reactSrc, "usePointerUniforms.ts") },
];

/** Design-token module shared by all blocks (emitted next to the vfx deps). */
const BLOCK_SHARED = { path: "vfx/blockShared.tsx", from: join(reactSrc, "components/blockShared.tsx") };

function read(p) {
  return readFileSync(p, "utf8");
}

/**
 * The copy-paste bundle has no @vfx-ui/core — inline its sources into the
 * top of VfxCanvas.tsx so the emitted file is self-contained (npm users get
 * the same behavior via the package dependency).
 */
function inlinedVfxCanvas() {
  const coreSrc = join(root, "packages", "core", "src");
  const core = ["types.ts", "capability.ts", "renderer.ts"]
    .map((f) =>
      read(join(coreSrc, f))
        .split("\n")
        .filter((l) => !/^(import|export)[^;\n]*from "\.\//.test(l))
        .join("\n"),
    )
    .join("\n\n");
  const canvas = read(join(reactSrc, "VfxCanvas.tsx")).replace(
    /import\s*\{[^}]*\}\s*from\s*["']@vfx-ui\/core["'];?\n/,
    "",
  );
  return `/* @vfx-ui/core (inlined by registry/build.mjs — do not edit) */\n${core}\n${canvas}`;
}

/**
 * Rewrite workspace-relative imports to the bundled layout:
 * item file lands at components/<Name>.tsx, every dependency at
 * components/vfx/<Name>.tsx. Files emitted inside vfx/ resolve siblings
 * with "./"; the item file reaches into "./vfx/". Names listed in
 * keepImports stay unrewritten — those resolve as siblings because the
 * consumer installs them via registryDependencies.
 */
function rewriteImports(content, depNames, inVfx, keepImports = []) {
  const p = inVfx ? "./" : "./vfx/";
  let out = content
    .replace(/from "\.\.\/VfxCanvas"/g, `from "${p}VfxCanvas"`)
    .replace(/from "\.\.\/utils\/color"/g, `from "${p}color"`)
    .replace(/from "\.\.\/usePointerMotion"/g, `from "${p}usePointerMotion"`)
    .replace(/from "\.\.\/usePointerUniforms(\.ts)?"/g, `from "${p}usePointerUniforms"`);
  for (const dep of depNames) {
    if (keepImports.includes(dep)) continue;
    out = out.replace(new RegExp(`from "\\.\\./${dep}"`, "g"), `from "${p}${dep}"`);
    out = out.replace(new RegExp(`from "\\./${dep}"`, "g"), `from "${p}${dep}"`);
  }
  return out;
}

function componentCode(component) {
  const p = join(reactSrc, "components", `${component}.tsx`);
  return existsSync(p) ? read(p) : null;
}

function buildItem(entry, catalog) {
  const source = componentCode(entry.component);
  if (source == null) return null;
  const registryDeps = entry.registryDeps ?? [];
  const registryDepComponents = registryDeps
    .map((id) => catalog.find((candidate) => candidate.name === id)?.component)
    .filter((name) => typeof name === "string");
  const deps = entry.deps ?? [];
  const depFiles = deps.map((dep) => {
    const depSource = componentCode(dep);
    if (depSource == null) throw new Error(`registry: missing dependency component ${dep} (item ${entry.name})`);
    return {
      path: `vfx/${dep}.tsx`,
      type: "registry:component",
      content: rewriteImports(depSource, [...deps, ...(entry.blockShared ? ["blockShared"] : [])], true, registryDepComponents),
      target: `components/vfx/${dep}.tsx`,
    };
  });
  const blockSharedFiles = entry.blockShared
    ? [{ path: BLOCK_SHARED.path, type: "registry:component", content: read(BLOCK_SHARED.from), target: `components/${BLOCK_SHARED.path}` }]
    : [];
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: entry.name,
    title: entry.title,
    description: entry.description,
    type: "registry:component",
    registryDependencies: registryDeps.map((id) => `${REGISTRY_BASE}${id}.json`),
    dependencies: entry.sharedFiles === false
      ? [...(entry.npmDependencies ?? [])]
      : ["vgpu@0.3.1", ...(entry.npmDependencies ?? [])],
    categories: entry.categories,
    docs: entry.description,
    files: [
      ...(entry.sharedFiles === false
        ? []
        : SHARED_FILES.map((f) => ({
            path: f.path,
            type: "registry:component",
            content: f.path === "vfx/VfxCanvas.tsx" ? inlinedVfxCanvas() : read(f.from),
            target: `components/${f.path}`,
          }))),
      ...(entry.motion ? [{ path: "vfx/usePointerMotion.ts", type: "registry:component", content: read(join(reactSrc, "usePointerMotion.ts")), target: "components/vfx/usePointerMotion.ts" }] : []),
      ...(entry.sharedFiles === false && deps.includes("HeroShell") ? [{ path: "vfx/usePointerUniforms.tsx", type: "registry:component", content: read(join(reactSrc, "usePointerUniforms.ts")), target: "components/vfx/usePointerUniforms.tsx" }] : []),
      ...blockSharedFiles,
      ...depFiles,
      {
        path: `components/${entry.component}.tsx`,
        type: "registry:component",
        content: rewriteImports(source, [...deps, ...(entry.blockShared ? ["blockShared"] : [])], false, registryDepComponents),
        target: `components/${entry.component}.tsx`,
      },
    ],
  };
  return item;
}

function main() {
  const items = [];
  const missing = [];
  for (const entry of CATALOG) {
    const item = buildItem(entry, CATALOG);
    if (!item) {
      missing.push(entry.component);
      continue;
    }
    items.push({ item, entry });
  }

  mkdirSync(join(outDir, "r"), { recursive: true });
  // Drop stale per-item JSON so removed components don't linger in the
  // generated docs (generate-agentic.mjs enumerates this directory).
  for (const f of readdirSync(join(outDir, "r"))) {
    if (f.endsWith(".json")) rmSync(join(outDir, "r", f));
  }
  for (const { item } of items) {
    writeFileSync(join(outDir, "r", `${item.name}.json`), JSON.stringify(item, null, 2) + "\n");
  }

  const index = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "vfx-ui",
    homepage: "https://vfx-ui.com",
    items: items.map(({ item, entry }) => ({
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: item.name,
      title: entry.title,
      type: "registry:component",
      description: entry.description,
      categories: entry.categories,
      tags: entry.tags,
      files: item.files.map((f) => ({ path: f.target ?? f.path, type: f.type })),
    })),
  };
  writeFileSync(join(outDir, "index.json"), JSON.stringify(index, null, 2) + "\n");
  // shadcn CLI convention: the registry index is served at <base>/registry.json.
  // Emit it alongside index.json so `npx shadcn add https://vfx-ui.com/r/<item>.json`
  // and any tool listing the registry both resolve.
  writeFileSync(join(outDir, "registry.json"), JSON.stringify(index, null, 2) + "\n");

  /* Mirror the site-facing copies (apps/docs/public/r is served at
     https://vfx-ui.com/r/) so the website's install endpoints can never drift
     from the npm package. Skipped when --out points somewhere custom. */
  if (outDir === join(root, "registry", "dist")) {
    const siteDir = join(root, "apps", "docs", "public", "r");
    mkdirSync(siteDir, { recursive: true });
    for (const f of readdirSync(siteDir)) {
      if (f.endsWith(".json")) rmSync(join(siteDir, f));
    }
    writeFileSync(join(siteDir, "index.json"), readFileSync(join(outDir, "index.json")));
    writeFileSync(join(siteDir, "registry.json"), readFileSync(join(outDir, "registry.json")));
    for (const { item } of items) {
      writeFileSync(join(siteDir, `${item.name}.json`), JSON.stringify(item, null, 2) + "\n");
    }
  }

  const total = items.length;
  console.log(`registry: wrote ${total}/${CATALOG.length} items to ${outDir}`);
  if (missing.length) {
    console.log(`registry: pending components (agent work in flight): ${missing.join(", ")}`);
    console.log("registry: rerun after components land; index only includes present sources.");
  }
}

main();
