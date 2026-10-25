#!/usr/bin/env node
/**
 * vfx-ui CLI — copy-paste shader components (shadcn registry format).
 *
 *   npx @vfx-ui/cli add wave-background
 *   npx @vfx-ui/cli add wave-background fluid-gradient --overwrite
 *   npx @vfx-ui/cli add wave-background --registry ./registry/dist/r
 *
 * Zero runtime dependencies by design: the CLI must run anywhere npx runs.
 */
import { constants, existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, resolve, sep } from "node:path";
import process from "node:process";

const DEFAULT_REGISTRY = "https://vfx-ui.com/r";
const TARGET_ROOT = "components";

function parseArgs(argv) {
  const names = [];
  let registry = DEFAULT_REGISTRY;
  let overwrite = false;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "add") continue; // subcommand
    if (a === "--registry") registry = argv[++i] ?? registry;
    else if (a === "--overwrite") overwrite = true;
    else if (a === "-h" || a === "--help") names.push("__help");
    else names.push(a);
  }
  return { names, registry, overwrite };
}

async function fetchItem(registry, name) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) throw new Error(`invalid component name: ${name}`);
  const isUrl = /^https?:\/\//.test(registry);
  const url = isUrl ? `${registry.replace(/\/$/, "")}/${name}.json` : resolve(registry, `${name}.json`);
  const res = isUrl ? await fetch(url) : { ok: existsSync(url), json: async () => JSON.parse(readFileSync(url, "utf8")) };
  if (!res.ok) throw new Error(`registry item not found: ${url}`);
  return res.json();
}

function targetPath(file, root) {
  const path = file.target ?? file.path;
  if (typeof path !== "string" || path.includes("\\") || path.split("/").some(part => part === ".." || part === "." || !part)) {
    throw new Error(`unsafe registry target: ${path}`);
  }
  const local = path.startsWith("@components/") ? `components/${path.slice(12)}` : path;
  if (!local.startsWith("components/") || typeof file.content !== "string") throw new Error(`invalid registry file: ${path}`);
  const target = resolve(root, local);
  if (!target.startsWith(resolve(root, TARGET_ROOT) + sep)) throw new Error(`unsafe registry target: ${path}`);
  assertNoSymlinks(root, target);
  return target;
}

function assertNoSymlinks(root, target) {
  for (let path = target; path !== root; path = dirname(path)) {
    try {
      if (lstatSync(path).isSymbolicLink()) throw new Error(`refusing symlink destination: ${path}`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}

async function installationPlan(registry, names, root) {
  const visited = new Set(), files = new Map(), dependencies = new Set();
  async function collect(name) {
    if (visited.has(name)) return;
    visited.add(name);
    const item = await fetchItem(registry, name);
    if (!Array.isArray(item.files) || !item.files.length) throw new Error(`registry item has no files: ${name}`);
    for (const dependency of item.registryDependencies ?? []) {
      // Resolve catalog dependencies against --registry, including offline mirrors.
      const id = /^https?:\/\//.test(dependency)
        ? new URL(dependency).pathname.split("/").at(-1).replace(/\.json$/, "")
        : dependency;
      await collect(id);
    }
    for (const dependency of item.dependencies ?? []) {
      if (!/^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+(?:@[a-zA-Z0-9.*^~+-]+)?$/.test(dependency)) throw new Error(`invalid npm dependency: ${dependency}`);
      dependencies.add(dependency);
    }
    for (const file of item.files) {
      const target = targetPath(file, root);
      if (files.has(target) && files.get(target) !== file.content) throw new Error(`conflicting registry files: ${target}`);
      files.set(target, file.content);
    }
  }
  for (const name of names) await collect(name);
  return { files, dependencies };
}

function writeFiles(files, root, overwrite) {
  const written = [];
  for (const [target, content] of files) {
    assertNoSymlinks(root, target);
    if (existsSync(target) && !overwrite) {
      console.log(`  skip (exists, use --overwrite): ${target}`);
      continue;
    }
    mkdirSync(dirname(target), { recursive: true });
    assertNoSymlinks(root, target);
    writeFileSync(target, content, { flag: overwrite
      ? constants.O_WRONLY | constants.O_CREAT | constants.O_TRUNC | constants.O_NOFOLLOW
      : "wx" });
    written.push(target);
  }
  return written;
}

async function main() {
  const { names, registry, overwrite } = parseArgs(process.argv.slice(2));
  if (!names.length || names.includes("__help")) {
    console.log(`vfx-ui — shader effect components for React (WebGPU via vgpu)

Usage:
  npx @vfx-ui/cli add <component> [more...] [--overwrite] [--registry <url|dir>]

Components: wave-background, fluid-gradient, aurora, starfield, particle-field,
glass-card, liquid-glass, footer-tidal, footer-fold, footer-phosphor

Sources land in components/, with shared helpers in components/vfx/.
Required npm dependencies are listed after installation.
`);
    return;
  }

  // Fetch and validate the entire graph before touching the user's project.
  const root = realpathSync(process.cwd());
  const plan = await installationPlan(registry, names, root);
  const written = writeFiles(plan.files, root, overwrite);
  console.log(`${written.length} file(s) → ${TARGET_ROOT}/`);
  for (const path of written) console.log(`  + ${path}`);
  if (plan.dependencies.size) console.log(`\nNext: npm install ${[...plan.dependencies].sort().join(" ")}`);
  console.log("Import components from components/*; shared helpers are in components/vfx/.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
