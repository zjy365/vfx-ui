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
  "mesh-gradient": ["MESH_GRADIENT_SHADER", "./MeshGradient.tsx"],
  iridescent: ["IRIDESCENT_SHADER", "./Iridescent.tsx"],
  vortex: ["VORTEX_SHADER", "./Vortex.tsx"],
  "web-globe": ["WEB_GLOBE_SHADER", "./WebGlobe.tsx"],
  "live-chart": ["LIVE_CHART_SHADER", "./LiveChart.tsx"],
};

/** Default-prop uniform snapshots (mirrors component defaults / catalog "classic" variant). */
const UNIFORMS = {
  "wave-background": { time: 1.0, speed: 1, amplitude: 1, frequency: 2.5, c0r: 0.0078, c0g: 0.0235, c0b: 0.0902, c1r: 0.1137, c1g: 0.3059, c1b: 0.8471, c2r: 0.2196, c2g: 0.7412, c2b: 0.9725 },
  "fluid-gradient": { time: 1.1, speed: 0.55, warp: 2.4, scale: 1.6, c0r: 0.043, c0g: 0.071, c0b: 0.125, c1r: 0.29, c1g: 0.35, c1b: 0.65, c2r: 0.55, c2g: 0.75, c2b: 0.95 },
  aurora: { time: 1.2, speed: 0.7, intensity: 1, bands: 4, c0r: 0.176, c0g: 0.831, c0b: 0.749, c1r: 0.506, c1g: 0.549, c1b: 0.973 },
  starfield: { time: 1.3, density: 0.35, twinkle: 0.8, speed: 1, c0r: 0.812, c0g: 0.894, c0b: 1 },
  "particle-field": { time: 1.4, density: 0.45, size: 0.16, speed: 0.8, c0r: 0.62, c0g: 0.796, c0b: 1 },
  "glass-card": { time: 1.5, radius: 0.05, borderGlow: 0.7, shine: 0.8, cardScale: 0.62, c0r: 0.647, c0g: 0.784, c0b: 1 },
  "liquid-glass": { time: 1.6, speed: 0.8, distortion: 0.45, chromatic: 0.6, scale: 1.2 },
  "mesh-gradient": { time: 0.8, speed: 0.6, scale: 3.2, softness: 0.09, c0r: 0.043, c0g: 0.067, c0b: 0.125, c1r: 0.082, c1g: 0.369, c1b: 0.459, c2r: 0.486, c2g: 0.227, c2b: 0.929, c3r: 0.957, c3g: 0.447, c3b: 0.714 },
  iridescent: { time: 1.5, speed: 0.8, scale: 2.4, hueShift: 0, saturation: 1, brightness: 0.9 },
  vortex: { time: 0.6, speed: 0.5, swirl: 2.4, arms: 2, coreGlow: 1.2, cr: 0.506, cg: 0.549, cb: 0.973, er: 0.878, eg: 0.949, eb: 0.996 },
  "web-globe": { time: 0.8, speed: 0.35, phi: 0, theta: 0.35, dots: 520, dotScale: 1.15, diffuse: 1.2, dark: 0.92, atmosphere: 0.8, seaLevel: 0.46, globeScale: 0.98, cr: 0.616, cg: 0.706, cb: 0.839, gr: 0.49, gg: 0.827, gb: 0.988 },
  "live-chart": null, // data-driven; generated in the entry below
};

function liveChartUniforms() {
  const data = Array.from({ length: 48 }, (_, i) => Math.max(0, Math.min(1, 0.5 + 0.32 * Math.sin(i * 0.35) + 0.1 * Math.sin(i * 0.9))));
  const pts = data.map((v) => [v, v, 0, 0]);
  while (pts.length < 64) pts.push([0, 0, 0, 0]);
  return { time: 0, count: 48, lineWidth: 0.006, glow: 0.4, fill: 0.6, cr: 0.22, cg: 0.74, cb: 0.97, er: 0.49, eg: 0.83, eb: 0.99, pts };
}

function makeEntrySource(requested) {
  const imports = requested
    .map((n) => { const [sym, p] = SHADER_IMPORTS[n]; return `import { ${sym} } from "${join(root, "packages/react/src/components", p.slice(2))}";`; })
    .join("\n");
  const table = requested
    .map((n) => `  ${JSON.stringify(n)}: { shader: ${SHADER_IMPORTS[n][0]}, uniforms: ${JSON.stringify(n === "live-chart" ? liveChartUniforms() : UNIFORMS[n])} },`)
    .join("\n");
  return `
${imports}
import { init, effect, target, frame } from "vgpu/node";
import { PNG } from "pngjs";
import { writeFileSync } from "node:fs";

const CATALOG = {
${table}
};

const gpu = await init();
const out = [];
for (const [name, { shader, uniforms }] of Object.entries(CATALOG)) {
  const t = target(gpu, { size: [512, 512], format: "rgba8unorm" });
  const fx = effect(gpu, shader, { set: structuredClone(uniforms) });
  frame(gpu, (f) => f.pass({ target: t, clear: [0, 0, 0, 0] }, (p) => p.draw(fx)));
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
      if (x > 0 && d[i] === d[i - 4]) { run++; if (run > maxRun) maxRun = run; }
      else run = 0;
    }
  }
  const verdict = stddev < 12 ? "FLAT" : maxRun > 170 ? "BANDING" : "OK";
  out.push({ name, stddev: +stddev.toFixed(1), colors: colors.size, maxRun, verdict });
}
console.log("REPORT:" + JSON.stringify(out));
`;
}

async function main() {
  const argNames = process.argv.slice(3);
  const requested = argNames.length ? argNames : Object.keys(SHADER_IMPORTS);
  for (const n of requested) if (!SHADER_IMPORTS[n]) throw new Error(`unknown component: ${n}`);

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
