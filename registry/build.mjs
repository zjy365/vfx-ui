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

/** Catalog metadata: the single source of truth for the public registry. */
const CATALOG = [
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
    title: "Glass Card",
    description: "Rounded-rect SDF glass card with sweeping inner highlight and edge refraction.",
    categories: ["Glass"],
    tags: ["glass", "card", "sdf"],
    files: ["components/GlassCard.tsx"],
  },
  {
    name: "liquid-glass",
    component: "LiquidGlass",
    title: "Liquid Glass",
    description: "Fullscreen liquid refraction with approximate chromatic dispersion.",
    categories: ["Glass"],
    tags: ["glass", "refraction", "liquid"],
    files: ["components/LiquidGlass.tsx"],
  },
  {
    name: "glass-lens",
    component: "GlassLens",
    title: "Glass Lens",
    description: "Floating liquid-glass pill lens over a living color field: cylindrical rim refraction, RGB dispersion, rotating specular sweep.",
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
    name: "web-globe",
    component: "WebGlobe",
    title: "Web Globe",
    description: "WebGPU re-creation of shuding/cobe (MIT): a tiny dot-matrix globe.",
    categories: ["Globe"],
    tags: ["globe", "map", "3d"],
    files: ["components/WebGlobe.tsx"],
  },
  {
    name: "live-chart",
    component: "LiveChart",
    title: "Live Chart",
    description: "Real-time streaming line chart rendered entirely on the GPU.",
    categories: ["Data"],
    tags: ["chart", "streaming", "realtime"],
    files: ["components/LiveChart.tsx"],
  },
  {
    name: "energy-orb",
    component: "EnergyOrb",
    title: "Energy Orb",
    description: "Volumetric smoke sphere with fresnel rim and outer glow — WGSL port of ThreeUI's EnergyOrb (MIT, Copyright 2026 Meng To).",
    categories: ["Globe"],
    tags: ["globe", "orb", "smoke", "glow"],
    files: ["components/EnergyOrb.tsx"],
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
    title: "Light Prism",
    description: "Frosted glass prism on warm paper with a light beam bending through it — SDF triangle glass, cast shadow, and RGB dispersion (pointer tilt opt-in).",
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
];

/** Shared runtime files every registry item needs (copy-paste is self-contained). */
const SHARED_FILES = [
  { path: "vfx/VfxCanvas.tsx", from: join(reactSrc, "VfxCanvas.tsx") },
  { path: "vfx/color.ts", from: join(reactSrc, "utils/color.ts") },
  { path: "vfx/usePointerUniforms.tsx", from: join(reactSrc, "usePointerUniforms.ts") },
];

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
 * with "./"; the item file reaches into "./vfx/".
 */
function rewriteImports(content, depNames, inVfx) {
  const p = inVfx ? "./" : "./vfx/";
  let out = content
    .replace(/from "\.\.\/VfxCanvas"/g, `from "${p}VfxCanvas"`)
    .replace(/from "\.\.\/utils\/color"/g, `from "${p}color"`)
    .replace(/from "\.\.\/usePointerUniforms(\.ts)?"/g, `from "${p}usePointerUniforms"`);
  for (const dep of depNames) {
    out = out.replace(new RegExp(`from "\\./${dep}"`, "g"), `from "${p}${dep}"`);
  }
  return out;
}

function componentCode(component) {
  const p = join(reactSrc, "components", `${component}.tsx`);
  return existsSync(p) ? read(p) : null;
}

function buildItem(entry) {
  const source = componentCode(entry.component);
  if (source == null) return null;
  const deps = entry.deps ?? [];
  const depFiles = deps.map((dep) => {
    const depSource = componentCode(dep);
    if (depSource == null) throw new Error(`registry: missing dependency component ${dep} (item ${entry.name})`);
    return {
      path: `vfx/${dep}.tsx`,
      type: "registry:component",
      content: rewriteImports(depSource, deps, true),
      target: `components/vfx/${dep}.tsx`,
    };
  });
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: entry.name,
    title: entry.title,
    description: entry.description,
    type: "registry:component",
    registryDependencies: [],
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
      ...depFiles,
      {
        path: `components/${entry.component}.tsx`,
        type: "registry:component",
        content: rewriteImports(source, deps, false),
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
    const item = buildItem(entry);
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
    homepage: "https://vfx-ui.dev",
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

  const total = items.length;
  console.log(`registry: wrote ${total}/${CATALOG.length} items to ${outDir}`);
  if (missing.length) {
    console.log(`registry: pending components (agent work in flight): ${missing.join(", ")}`);
    console.log("registry: rerun after components land; index only includes present sources.");
  }
}

main();
