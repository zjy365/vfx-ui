#!/usr/bin/env node
/**
 * M5-Q quality snapshot pipeline.
 *
 * Renders every catalog component at 512×512 with the Dawn adapter, writes
 * PNGs to private/screenshots/, and reports pixel statistics that make
 * "flat demo background" and banding measurable:
 *   stddev      — channel standard deviation (flat image gate)
 *   colors      — unique RGB triples (palette richness)
 *   maxFlatRun  — longest horizontal run of identical pixels (banding proxy)
 *
 * Usage: node scripts/quality-snapshot.mjs [component ...]   (default: all)
 * Requires Node 22 on PATH (Dawn native module).
 */
import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = join(root, "packages/core/.cache");
const outDir = join(root, "private/screenshots");

const SHADER_IMPORTS = {
  "wave-background": ["WAVE_SHADER", "./WaveBackground.tsx"],
  "fluid-gradient": ["FLUID_SHADER", "./FluidGradient.tsx"],
  aurora: ["AURORA_SHADER", "./Aurora.tsx"],
  starfield: ["STARFIELD_SHADER", "./Starfield.tsx"],
  "particle-field": ["PARTICLE_SHADER", "./ParticleField.tsx"],
  "glass-card": ["GLASS_CARD_SHADER", "./GlassCard.tsx"],
  "liquid-glass": ["LIQUID_GLASS_SHADER", "./LiquidGlass.tsx"],
  "glass-lens": ["GLASS_LENS_SHADER", "./GlassLens.tsx"],
  // black-hole + hero-black-hole are multi-pass pipelines (bake/refine/shade/
  // bloom/composite) — rendered through renderBlackHoleThumbnail below instead
  // of the single-effect loop.
  "mesh-gradient": ["MESH_GRADIENT_SHADER", "./MeshGradient.tsx"],
  iridescent: ["IRIDESCENT_SHADER", "./Iridescent.tsx"],
  vortex: ["VORTEX_SHADER", "./Vortex.tsx"],
  "web-globe": ["WEB_GLOBE_SHADER", "./WebGlobe.tsx"],
  "live-chart": ["LIVE_CHART_SHADER", "./LiveChart.tsx"],
  "energy-orb": ["ENERGY_ORB_SHADER", "./EnergyOrb.tsx"],
  "ribbon-field": ["RIBBON_FIELD_SHADER", "./RibbonField.tsx"],
  "fiber-flow": ["FIBER_FLOW_SHADER", "./FiberFlow.tsx"],
  "chroma-flow": ["CHROMA_FLOW_SHADER", "./ChromaFlow.tsx"],
  "light-prism": ["LIGHT_PRISM_SHADER", "./LightPrism.tsx"],
  // Heroes reuse their base shader; the entries below pin the hero's default
  // palette so the pixel gate covers what the hero actually renders.
  "hero-fluid": ["FLUID_SHADER", "./FluidGradient.tsx"],
  "hero-aurora": ["AURORA_SHADER", "./Aurora.tsx"],
  "hero-fiber": ["FIBER_FLOW_SHADER", "./FiberFlow.tsx"],
  // hero-globe is excluded: its visual is react-globe.gl (three.js WebGL),
  // not a WGSL shader — no Dawn rasterization to gate here.
  "hero-mesh": ["MESH_GRADIENT_SHADER", "./MeshGradient.tsx"],
  "hero-iridescent": ["IRIDESCENT_SHADER", "./Iridescent.tsx"],
  "hero-vortex": ["VORTEX_SHADER", "./Vortex.tsx"],
  "hero-ribbon": ["RIBBON_FIELD_SHADER", "./RibbonField.tsx"],
  "hero-particles": ["PARTICLE_SHADER", "./ParticleField.tsx"],
  "hero-starfield": ["STARFIELD_SHADER", "./Starfield.tsx"],
  "hero-chroma": ["CHROMA_FLOW_SHADER", "./ChromaFlow.tsx"],
};

/** Multi-pass pipelines: rendered via their own thumbnail export, not the
 *  single-effect loop. Maps component name -> { module, fn, settings }. */
const PIPELINES = {
  "black-hole": {
    module: "./BlackHole.tsx",
    fn: "renderBlackHoleThumbnail",
    settings: {},
  },
  "hero-black-hole": {
    module: "./BlackHole.tsx",
    fn: "renderBlackHoleThumbnail",
    // Hero framing: hole right of center over the left-copy scrim.
    settings: { centerX: 0.45, centerY: 0.12 },
  },
};

/** Per-component gate overrides (stddev floor is 12 unless listed here). */
const GATE_OVERRIDES = {};

/** Default-prop uniform snapshots (mirrors component defaults / catalog "classic" variant).
 *  Interactive components pin px/py at the rest position (0.5) and pActive at 0,
 *  so snapshots match what a browser shows before any pointer movement. */
const UNIFORMS = {
  "wave-background": { time: 1.0, speed: 1, amplitude: 1, frequency: 2.5, c0r: 0.0078, c0g: 0.0235, c0b: 0.0902, c1r: 0.1137, c1g: 0.3059, c1b: 0.8471, c2r: 0.2196, c2g: 0.7412, c2b: 0.9725, px: 0.5, py: 0.5 },
  "fluid-gradient": { time: 1.1, speed: 0.55, warp: 2.4, scale: 1.6, c0r: 0.043, c0g: 0.071, c0b: 0.125, c1r: 0.29, c1g: 0.35, c1b: 0.65, c2r: 0.55, c2g: 0.75, c2b: 0.95, px: 0.5, py: 0.5 },
  aurora: { time: 1.2, speed: 0.7, intensity: 1, bands: 4, c0r: 0.176, c0g: 0.831, c0b: 0.749, c1r: 0.506, c1g: 0.549, c1b: 0.973, px: 0.5, py: 0.5 },
  starfield: { time: 1.3, density: 0.35, twinkle: 0.8, speed: 1, c0r: 0.812, c0g: 0.894, c0b: 1, px: 0.5, py: 0.5 },
  "particle-field": { time: 1.4, density: 0.45, size: 0.16, speed: 0.8, c0r: 0.62, c0g: 0.796, c0b: 1, px: 0.5, py: 0.5 },
  "glass-card": { time: 1.5, radius: 0.05, borderGlow: 0.7, shine: 0.8, cardScale: 0.62, c0r: 0.647, c0g: 0.784, c0b: 1, px: 0.5, py: 0.5, pActive: 0 },
  "liquid-glass": { time: 1.6, speed: 0.8, distortion: 0.45, chromatic: 0.6, scale: 1.2, px: 0.5, py: 0.5, pActive: 0 },
  "glass-lens": { time: 1.7, speed: 1.0, refraction: 0.85, dispersion: 0.7, blur: 0.8, rim: 0.9, tintR: 0.812, tintG: 0.894, tintB: 1, px: 0.5, py: 0.5, pActive: 0, resX: 512, resY: 512 },
  "mesh-gradient": { time: 0.8, speed: 0.6, scale: 3.2, softness: 0.09, c0r: 0.043, c0g: 0.067, c0b: 0.125, c1r: 0.082, c1g: 0.369, c1b: 0.459, c2r: 0.486, c2g: 0.227, c2b: 0.929, c3r: 0.957, c3g: 0.447, c3b: 0.714, px: 0.5, py: 0.5 },
  iridescent: { time: 1.5, speed: 0.8, scale: 2.4, hueShift: 0, saturation: 1, brightness: 0.9, px: 0.5, py: 0.5 },
  vortex: { time: 0.6, speed: 0.5, swirl: 2.4, arms: 2, coreGlow: 1.2, cr: 0.506, cg: 0.549, cb: 0.973, er: 0.878, eg: 0.949, eb: 0.996, px: 0.5, py: 0.5 },
  "energy-orb": { time: 1.4, speed: 1, smokeScale: 1, smokeStrength: 1, smokeSpeed: 1, hue: 0, saturation: 1, glow: 1, px: 0.5, py: 0.5 },
  "ribbon-field": { time: 1.2, speed: 1, intensity: 1, drift: 0, grain: 1, resX: 512, resY: 512 },
  "fiber-flow": { time: 1.3, speed: 1, intensity: 1, scale: 1.6, strands: 22, sharp: 6, px: 0.5, py: 0.5, pActive: 0, resX: 512, resY: 512, c0r: 0.118, c0g: 0.106, c0b: 0.294, c1r: 0.310, c1g: 0.275, c1b: 0.898, c2r: 0.647, c2g: 0.706, c2b: 0.988 },
  "chroma-flow": { time: 1.3, speed: 1, intensity: 1, radius: 0.45, momentum: 16, ambient: 0.55, px: 0.5, py: 0.5, pActive: 0, vx: 0, vy: 0, c0r: 0.027, c0g: 0.063, c0b: 0.129, c1r: 0.114, c1g: 0.306, c1b: 0.847, c2r: 0.796, c2g: 0.835, c2b: 0.882, c3r: 0.055, c3g: 0.647, c3b: 0.914, c4r: 0.961, c4g: 0.620, c4b: 0.043 },
  "light-prism": { time: 1.3, speed: 1, prismSize: 0.3, beamWidth: 0.0045, refraction: 0.16, dispersion: 0.22, shadow: 1, px: 0.5, py: 0.5, pActive: 0, resX: 512, resY: 512, c0r: 0.914, c0g: 0.902, c0b: 0.875, c1r: 0.659, c1g: 0.643, c1b: 0.608, c2r: 1, c2g: 1, c2b: 1 },
  "web-globe": { time: 0.8, speed: 0.35, phi: 0, theta: 0.35, dots: 520, dotScale: 1.15, diffuse: 1.2, dark: 0.92, atmosphere: 0.8, seaLevel: 0.46, globeScale: 0.98, cr: 0.616, cg: 0.706, cb: 0.839, gr: 0.49, gg: 0.827, gb: 0.988 },
  "live-chart": null, // data-driven; generated in the entry below
  "hero-fluid": { time: 1.0, speed: 0.5, warp: 2.2, scale: 1.5, c0r: 0.043, c0g: 0.063, c0b: 0.149, c1r: 0.114, c1g: 0.306, c1b: 0.847, c2r: 0.490, c2g: 0.827, c2b: 0.988, px: 0.5, py: 0.5 },
  "hero-aurora": { time: 1.1, speed: 0.7, intensity: 1, bands: 4, c0r: 0.176, c0g: 0.831, c0b: 0.749, c1r: 0.506, c1g: 0.549, c1b: 0.973, px: 0.5, py: 0.5 },
  "hero-fiber": { time: 1.2, speed: 1, intensity: 1, scale: 1.6, strands: 22, sharp: 6, px: 0.5, py: 0.5, pActive: 0, resX: 512, resY: 512, c0r: 0.118, c0g: 0.106, c0b: 0.294, c1r: 0.310, c1g: 0.275, c1b: 0.898, c2r: 0.647, c2g: 0.706, c2b: 0.988 },
  "hero-mesh": { time: 1.0, speed: 0.6, scale: 3.2, softness: 0.09, c0r: 0.043, c0g: 0.067, c0b: 0.125, c1r: 0.075, c1g: 0.306, c1b: 0.290, c2r: 0.486, c2g: 0.227, c2b: 0.929, c3r: 0.957, c3g: 0.447, c3b: 0.714, px: 0.5, py: 0.5 },
  "hero-iridescent": { time: 1.3, speed: 0.8, scale: 2.4, hueShift: 0, saturation: 1, brightness: 0.9, px: 0.5, py: 0.5 },
  "hero-vortex": { time: 0.7, speed: 0.5, swirl: 2.4, arms: 2, coreGlow: 1.2, cr: 0.506, cg: 0.549, cb: 0.973, er: 0.878, eg: 0.906, eb: 1, px: 0.5, py: 0.5 },
  "hero-ribbon": { time: 1.1, speed: 1, intensity: 1, drift: 0.2, grain: 1, resX: 512, resY: 512 },
  "hero-particles": { time: 1.2, density: 0.45, size: 0.16, speed: 0.8, c0r: 0.612, c0g: 0.792, c0b: 1, px: 0.5, py: 0.5 },
  "hero-starfield": { time: 1.4, density: 0.35, twinkle: 0.8, speed: 1, c0r: 0.816, c0g: 0.894, c0b: 1, px: 0.5, py: 0.5 },
  "hero-chroma": { time: 1.2, speed: 1, intensity: 1, radius: 0.45, momentum: 16, ambient: 0.55, px: 0.5, py: 0.5, pActive: 0, vx: 0, vy: 0, c0r: 0.027, c0g: 0.063, c0b: 0.129, c1r: 0.114, c1g: 0.306, c1b: 0.847, c2r: 0.796, c2g: 0.835, c2b: 0.882, c3r: 0.055, c3g: 0.647, c3b: 0.914, c4r: 0.961, c4g: 0.620, c4b: 0.043 },
};

function liveChartUniforms() {
  const data = Array.from({ length: 48 }, (_, i) => Math.max(0, Math.min(1, 0.5 + 0.32 * Math.sin(i * 0.35) + 0.1 * Math.sin(i * 0.9))));
  const pts = data.map((v) => [v, v, 0, 0]);
  while (pts.length < 64) pts.push([0, 0, 0, 0]);
  return { time: 0, count: 48, lineWidth: 0.006, glow: 0.4, fill: 0.6, cr: 0.22, cg: 0.74, cb: 0.97, er: 0.49, eg: 0.83, eb: 0.99, px: 0.5, pActive: 0, pts };
}

function makeEntrySource(requested) {
  const shaderNames = requested.filter((n) => SHADER_IMPORTS[n]);
  const pipelineNames = requested.filter((n) => PIPELINES[n]);
  const imports = [
    ...new Set(shaderNames.map((n) => { const [sym, p] = SHADER_IMPORTS[n]; return `import { ${sym} } from "${join(root, "packages/react/src/components", p.slice(2))}";` })),
    ...new Set(pipelineNames.map((n) => { const p = PIPELINES[n]; return `import { ${p.fn} } from "${join(root, "packages/react/src/components", p.module.slice(2))}";` })),
  ].join("\n");
  const table = shaderNames
    .map((n) => `  ${JSON.stringify(n)}: { shader: ${SHADER_IMPORTS[n][0]}, uniforms: ${JSON.stringify(n === "live-chart" ? liveChartUniforms() : UNIFORMS[n])} },`)
    .join("\n");
  const pipelineTable = pipelineNames
    .map((n) => `  ${JSON.stringify(n)}: { render: ${PIPELINES[n].fn}, settings: ${JSON.stringify(PIPELINES[n].settings)} },`)
    .join("\n");
  return `
${imports}
import { init, effect, target, frame } from "vgpu/node";
import { PNG } from "pngjs";
import { writeFileSync } from "node:fs";

const GATE_OVERRIDES = ${JSON.stringify(GATE_OVERRIDES)};
const CATALOG = {
${table}
};
const PIPELINE_CATALOG = {
${pipelineTable}
};

const gpu = await init();
const out = [];
const frames = [];

for (const [name, { render, settings }] of Object.entries(PIPELINE_CATALOG)) {
  const t = target(gpu, { size: [512, 512], format: "rgba8unorm" });
  await render(gpu, t, { time: 2.5, settings });
  frames.push([name, t]);
}
for (const [name, { shader, uniforms }] of Object.entries(CATALOG)) {
  const t = target(gpu, { size: [512, 512], format: "rgba8unorm" });
  const fx = effect(gpu, shader, { set: structuredClone(uniforms) });
  frame(gpu, (f) => f.pass({ target: t, clear: [0, 0, 0, 0] }, (p) => p.draw(fx)));
  frames.push([name, t]);
}

for (const [name, t] of frames) {
  const rgba = await t.read();
  const png = new PNG({ width: 512, height: 512 });
  Buffer.from(rgba).copy(png.data);
  writeFileSync(process.argv[2] + "/" + name + ".png", PNG.sync.write(png));

  let sum = 0, sum2 = 0;
  const colors = new Set();
  const d = png.data;
  for (let i = 0; i < d.length; i += 4) {
    sum += d[i] + d[i + 1] + d[i + 2];
    sum2 += d[i] * d[i] + d[i + 1] * d[i + 1] + d[i + 2] * d[i + 2];
    colors.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
  }
  const n = 512 * 512;
  const mean = sum / (n * 3);
  const stddev = Math.sqrt(Math.max(0, sum2 / (n * 3) - mean * mean));
  let run = 0, maxRun = 0;
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const i = (y * 512 + x) * 4 + 1;
      const opaque = d[(y * 512 + x) * 4 + 3] > 8;
      if (opaque && x > 0 && d[i] === d[i - 4] && d[i - 3] > 8) { run++; if (run > maxRun) maxRun = run; }
      else run = 0;
    }
  }
  const stddevMin = (GATE_OVERRIDES[name] ?? {}).stddevMin ?? 12;
  const verdict = stddev < stddevMin ? "FLAT" : maxRun > 170 ? "BANDING" : "OK";
  out.push({ name, stddev: +stddev.toFixed(1), colors: colors.size, maxRun, verdict });
}
console.log("REPORT:" + JSON.stringify(out));
`;
}

async function main() {
  const argNames = process.argv.slice(2);
  const requested = argNames.length ? argNames : [...Object.keys(SHADER_IMPORTS), ...Object.keys(PIPELINES)];
  for (const n of requested) {
    if (!SHADER_IMPORTS[n] && !PIPELINES[n]) throw new Error(`unknown component: ${n}`);
  }

  mkdirSync(cacheDir, { recursive: true });
  mkdirSync(outDir, { recursive: true });
  const entry = join(cacheDir, "snapshot-entry.mts");
  const bundle = join(cacheDir, "snapshot-bundle.mjs");
  writeFileSync(entry, makeEntrySource(requested));
  await build({
    entryPoints: [entry],
    outfile: bundle,
    bundle: true,
    platform: "node",
    format: "esm",
    jsx: "automatic",
    external: ["vgpu", "vgpu/node", "webgpu"],
    banner: { js: `import { createRequire } from "node:module"; const require = createRequire(import.meta.url);` },
    logLevel: "silent",
  });

  const nodeBin = process.execPath;
  const res = spawnSync(nodeBin, [bundle, outDir], { cwd: join(root, "packages/core"), encoding: "utf8", timeout: 120_000 });
  const lines = (res.stdout ?? "").split("\n").filter((l) => l.startsWith("REPORT:"));
  if (!lines.length) {
    console.error("snapshot failed:", (res.stderr ?? "").slice(0, 1200), res.stdout?.slice(0, 400));
    process.exit(1);
  }
  const report = JSON.parse(lines[0].slice(7));
  for (const r of report) {
    console.log(`${r.name.padEnd(16)} stddev=${String(r.stddev).padStart(6)}  colors=${String(r.colors).padStart(6)}  maxFlatRun=${String(r.maxRun).padStart(4)}  ${r.verdict}`);
  }
  const bad = report.filter((r) => r.verdict !== "OK");
  console.log(`\n${report.length - bad.length}/${report.length} pass pixel gate -> ${outDir}`);
  if (bad.length) console.log("below the gate:", bad.map((b) => `${b.name}(${b.verdict})`).join(", "));
}

main().catch((err) => { console.error(err); process.exit(1); });
