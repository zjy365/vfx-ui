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
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
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
];

/** Shared runtime files every registry item needs (copy-paste is self-contained). */
const SHARED_FILES = [
  { path: "vfx/VfxCanvas.tsx", from: join(reactSrc, "VfxCanvas.tsx") },
  { path: "vfx/color.ts", from: join(reactSrc, "utils/color.ts") },
];

function read(p) {
  return readFileSync(p, "utf8");
}

function componentCode(component) {
  const p = join(reactSrc, "components", `${component}.tsx`);
  return existsSync(p) ? read(p) : null;
}

function buildItem(entry) {
  const source = componentCode(entry.component);
  if (source == null) return null;
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: entry.name,
    title: entry.title,
    description: entry.description,
    type: "registry:component",
    registryDependencies: [],
    dependencies: ["vgpu@0.3.1"],
    categories: entry.categories,
    docs: entry.description,
    files: [
      ...SHARED_FILES.map((f) => ({
        path: f.path,
        type: "registry:component",
        content: read(f.from),
        target: `components/${f.path}`,
      })),
      {
        path: `components/${entry.component}.tsx`,
        type: "registry:component",
        content: source,
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
