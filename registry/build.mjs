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
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

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
import { CATALOG } from "../catalog/components.mjs";

/** Shared runtime helpers, included only when an item's sources import them. */
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

/** Inspect actual module references, including multiline and dynamic imports. */
function moduleSpecifiers(content) {
  const source = ts.createSourceFile("component.tsx", content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const result = new Set();
  const visit = (node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      result.add(node.moduleSpecifier.text);
    } else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
      result.add(node.arguments[0].text);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return [...result];
}

function stripRelativeImports(content) {
  const source = ts.createSourceFile("core.ts", content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const imports = source.statements.filter((node) =>
    (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
    node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier) && node.moduleSpecifier.text.startsWith("."),
  );
  let result = content;
  for (const node of [...imports].reverse()) result = result.slice(0, node.getStart(source)) + result.slice(node.end);
  return result;
}

/**
 * The copy-paste bundle has no @vfx-ui/core — inline its sources into the
 * top of VfxCanvas.tsx so the emitted file is self-contained (npm users get
 * the same behavior via the package dependency).
 */
function inlinedVfxCanvas() {
  const coreSrc = join(root, "packages", "core", "src");
  const core = ["types.ts", "capability.ts", "renderer.ts"]
    .map((f) => stripRelativeImports(read(join(coreSrc, f))))
    .join("\n\n");
  const canvas = read(join(reactSrc, "VfxCanvas.tsx")).replace(
    /import\s*\{[^}]*\}\s*from\s*["']@vfx-ui\/core["'];?\n/,
    "",
  );
  return `"use client";\n/* @vfx-ui/core (inlined by registry/build.mjs — do not edit) */\n${core}\n${canvas.replace(/^"use client";\s*/, "")}`;
}

/**
 * Rewrite workspace-relative imports to the bundled layout:
 * item file lands at the configured components alias/<Name>.tsx, every
 * dependency in its vfx/<Name>.tsx child directory. @components/ targets are
 * resolved by shadcn from components.json, including src and custom aliases.
 * Files emitted inside vfx/ resolve siblings
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
  const dependencySources = deps.map((dep) => {
    const content = componentCode(dep);
    if (content == null) throw new Error(`registry: missing dependency component ${dep} (item ${entry.name})`);
    return content;
  });
  const imports = [source, ...dependencySources].flatMap(moduleSpecifiers);
  // Older variant manifests can say sharedFiles:false while embedding a GPU
  // component. Source imports determine both helpers and the GPU dependency.
  const sharedNames = new Set(imports.filter((name) => name.startsWith(".")).map((name) => basename(name).replace(/\.tsx?$/, "")));
  const sharedFiles = SHARED_FILES.filter((file) => sharedNames.has(basename(file.path).replace(/\.tsx?$/, "")));
  const needsGpu = sharedNames.has("VfxCanvas") || imports.some((name) => name === "vgpu" || name.startsWith("vgpu/"));
  const depFiles = deps.map((dep) => {
    const depSource = componentCode(dep);
    if (depSource == null) throw new Error(`registry: missing dependency component ${dep} (item ${entry.name})`);
    return {
      path: `vfx/${dep}.tsx`,
      type: "registry:component",
      content: rewriteImports(depSource, [...deps, ...(entry.blockShared ? ["blockShared"] : [])], true, registryDepComponents),
      target: `@components/vfx/${dep}.tsx`,
    };
  });
  const blockSharedFiles = entry.blockShared
    ? [{ path: BLOCK_SHARED.path, type: "registry:component", content: read(BLOCK_SHARED.from), target: `@components/${BLOCK_SHARED.path}` }]
    : [];
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: entry.name,
    title: entry.title,
    description: entry.description,
    type: "registry:component",
    registryDependencies: registryDeps.map((id) => `${REGISTRY_BASE}${id}.json`),
    dependencies: [...new Set([...(needsGpu ? ["vgpu@0.3.1"] : []), ...(entry.npmDependencies ?? [])])],
    categories: entry.categories,
    docs: entry.description,
    files: [
      ...sharedFiles.map((f) => ({
            path: f.path,
            type: "registry:component",
            content: f.path === "vfx/VfxCanvas.tsx" ? inlinedVfxCanvas() : read(f.from),
            target: `@components/${f.path}`,
          })),
      ...(sharedNames.has("usePointerMotion") ? [{ path: "vfx/usePointerMotion.ts", type: "registry:component", content: read(join(reactSrc, "usePointerMotion.ts")), target: "@components/vfx/usePointerMotion.ts" }] : []),
      ...blockSharedFiles,
      ...depFiles,
      {
        path: `components/${entry.component}.tsx`,
        type: "registry:component",
        content: rewriteImports(source, [...deps, ...(entry.blockShared ? ["blockShared"] : [])], false, registryDepComponents),
        target: `@components/${entry.component}.tsx`,
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

  if (missing.length) throw new Error(`Registry source is incomplete: ${missing.join(", ")}`);
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
