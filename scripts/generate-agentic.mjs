#!/usr/bin/env node
/**
 * Agentic docs generator (M4 differentiator).
 *
 * Reads the built registry (registry/dist) and emits machine-consumable
 * documentation: llms.txt (index), agents.md, and one .md per component
 * with props, variants, usage, and pitfalls — so coding agents can pick
 * and integrate components without browsing a website.
 *
 * Usage: node scripts/generate-agentic.mjs [--out <dir>]
 */
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registryDir = join(root, "registry", "dist");
const outDir = process.argv.includes("--out")
  ? resolve(process.argv[process.argv.indexOf("--out") + 1])
  : join(root, "apps", "docs", "public");

if (!existsSync(join(registryDir, "index.json"))) {
  console.error("agentic: registry/dist/index.json missing — run `node registry/build.mjs` first.");
  process.exit(1);
}

const index = JSON.parse(readFileSync(join(registryDir, "index.json"), "utf8"));

function itemDoc(name) {
  const item = JSON.parse(readFileSync(join(registryDir, "r", `${name}.json`), "utf8"));
  // The item's own component lands at components/<Name>.tsx; every dependency
  // (shared runtime + base shaders) is namespaced under components/vfx/.
  const componentFile = item.files.find((f) => (f.target ?? f.path).endsWith(".tsx") && !(f.target ?? f.path).includes("vfx/"));
  const source = componentFile?.content ?? "";
  const propsMatch = source.match(/export interface (\w+Props)[^{]*\{([\s\S]*?)\n\}/);
  const presetsMatch = source.match(/export const (\w+_PRESETS)/);
  // Shader detection spans the whole bundle: heroes carry their base shader's
  // WGSL export inside the embedded vfx/ dependency file.
  const shaderMatch = source.match(/export const (\w+_SHADER)/)
    ?? item.files.map((f) => f.content.match(/export const (\w+_SHADER)/)).find(Boolean);
  const props = propsMatch
    ? propsMatch[2]
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("/") && !l.startsWith("*"))
        .map((l) => l.replace(/\s*;$/, ""))
    : [];
  const deps = item.dependencies ?? [];
  const needsVgpu = deps.some((d) => d.startsWith("vgpu"));
  const extraDeps = deps.filter((d) => !d.startsWith("vgpu"));
  const lines = [
    `# ${item.title ?? name}`,
    "",
    item.description ?? "",
    "",
    "## Install",
    "",
    "```bash",
    `npm install @vfx-ui/react${needsVgpu ? " vgpu@0.3.1" : ""}${extraDeps.length ? ` ${extraDeps.join(" ")}` : ""}`,
    "```",
    "",
    "```tsx",
    `import { ${nameToComponent(name)} } from "@vfx-ui/react";`,
    "",
    `export function Demo() {`,
    `  return <${nameToComponent(name)} />;`,
    `}`,
    "```",
    "",
    "## Props",
    "",
    ...(props.length ? props.map((p) => `- \`${p}\``) : ["(see source)"]),
    "",
  ];
  if (presetsMatch) {
    lines.push("## Variants", "", "Import the preset bag and spread it into props:", "", "```tsx", `import { ${presetsMatch[1]} } from "@vfx-ui/react";`, "```", "");
  }
  if (shaderMatch) {
    lines.push("## Shader", "", `WGSL source is exported as \`${shaderMatch[1]}\` — read it to learn how the effect works.`, "");
  }
  lines.push(
    "## Notes for agents",
    "",
    ...(shaderMatch
      ? [
          "- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).",
          "- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.",
          "- `prefers-reduced-motion` freezes animation automatically.",
          "- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.",
        ]
      : [
          "- Not a WGSL shader component: the visual is provided by a third-party renderer (see Install deps).",
          "- SSR-safe: the visual mounts client-side only; server output is the inert DOM layer.",
          "- `prefers-reduced-motion` skips animation automatically.",
        ]),
    "",
  );
  return lines.join("\n");
}

function nameToComponent(name) {
  return name.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join("");
}

function main() {
  mkdirSync(join(outDir, "components"), { recursive: true });
  const names = readdirSync(join(registryDir, "r")).map((f) => f.replace(/\.json$/, ""));

  const llms = [
    "# VFX UI",
    "",
    "> Shader-native visual effect components for React, rendered via WebGPU (vgpu).",
    "> All effects are GPU-only by design: they cannot be reproduced with DOM/CSS.",
    "",
    "## Install",
    "",
    "```bash",
    "npm install @vfx-ui/react vgpu@0.3.1",
    "```",
    "",
    "## Component catalog",
    "",
    ...index.items.map((it) => `- [${it.title}](https://vfx-ui.com/components/${it.name}.md): ${it.description}`),
    "",
    "## Per-component docs (machine-readable)",
    "",
    ...names.map((n) => `- https://vfx-ui.com/components/${n}.md`),
    "",
    "## Scope guard",
    "",
    "This library ships GPU-only visuals and drop-in hero sections.",
    "Do not request standalone DOM animation widgets, carousels/counters, layout components,",
    "full-page templates, or heavy 3D scenes (meshes/lights/cameras) — out of scope by charter.",
    "",
  ].join("\n");
  writeFileSync(join(outDir, "llms.txt"), llms);

  const agents = [
    "# VFX UI — agent guide",
    "",
    llms,
    "",
    ...names.map((n) => itemDoc(n)),
  ].join("\n");
  writeFileSync(join(outDir, "agents.md"), agents);

  for (const n of names) {
    writeFileSync(join(outDir, "components", `${n}.md`), itemDoc(n));
  }
  // Drop stale docs for components that no longer exist in the registry.
  const keep = new Set(names.map((n) => `${n}.md`));
  for (const f of readdirSync(join(outDir, "components"))) {
    if (f.endsWith(".md") && !keep.has(f)) rmSync(join(outDir, "components", f));
  }
  console.log(`agentic: wrote llms.txt, agents.md, and ${names.length} component docs to ${outDir}`);
}

main();
