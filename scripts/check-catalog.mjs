import assert from "node:assert/strict";
import { readFile, access, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { CATALOG } from "../catalog/components.mjs";
import { PRODUCT, TEMPLATES } from "../catalog/templates.mjs";
const root = fileURLToPath(new URL("..", import.meta.url));
const before = await readFile(resolve(root, "catalog/generated.json"), "utf8");
const previewBefore = await readFile(
  resolve(root, "catalog/preview.json"),
  "utf8",
);
execFileSync(process.execPath, ["scripts/build-catalog.mjs"], {
  cwd: root,
  stdio: "inherit",
});
assert.equal(
  await readFile(resolve(root, "catalog/generated.json"), "utf8"),
  before,
  "Generated catalog was stale. Commit the regenerated output.",
);
assert.equal(
  await readFile(resolve(root, "catalog/preview.json"), "utf8"),
  previewBefore,
  "Generated preview metadata was stale.",
);
const data = JSON.parse(before);
const ids = new Set();
const paths = new Set();
assert.equal(
  data.components.length,
  93,
  "All existing free components must remain available.",
);
for (const item of data.components) {
  assert(!ids.has(item.id), "Duplicate component id: " + item.id);
  ids.add(item.id);
  assert(!paths.has(item.path), "Duplicate route: " + item.path);
  paths.add(item.path);
  assert.equal(item.tier, "free");
  assert.equal(item.license, "MIT");
  assert(CATALOG.some((x) => x.name === item.id));
  await access(resolve(root, item.sourcePath));
  assert(item.sourceCode && item.description);
  assert(
    item.registrySourceCode &&
      !item.registrySourceCode.includes('from "@vfx-ui/react"'),
    "Registry example must use installed local imports",
  );
  assert(item.registryUsageIds.includes(item.id));
  for (const exampleId of item.registryUsageIds)
    assert(
      CATALOG.some((entry) => entry.name === exampleId),
      "Missing example dependency: " + exampleId,
    );
  for (const dependency of item.dependencies)
    assert(
      CATALOG.some((x) => x.name === dependency),
      "Unknown registry dependency",
    );
  if (!item.thumbnail.startsWith("data:"))
    await access(resolve(root, "apps/docs/public", item.thumbnail.slice(1)));
  const registry = JSON.parse(
    await readFile(resolve(root, "registry/dist/r", item.id + ".json"), "utf8"),
  );
  assert.equal(registry.title, item.title);
  assert.equal(registry.description, item.description);
  for (const file of registry.files) {
    assert(!file.target.split("/").includes(".."));
    assert(
      !/vfx-ui-pro|CREEM_API_KEY|R2_SECRET_ACCESS_KEY/.test(file.content),
      "Private content in free registry",
    );
  }
  assert(!item.sourcePath.startsWith("pro/"));
}
assert.equal(TEMPLATES.length, 5);
assert.equal(PRODUCT.templateIds.length, 5);
for (const item of TEMPLATES) {
  assert.equal(item.tier, "pro");
  assert.equal(item.productId, PRODUCT.id);
  assert.equal(item.kind, "template");
  assert(!("sourceCode" in item));
  assert(!("objectKey" in item));
  assert(!("downloadUrl" in item));
  assert.equal(item.preview, `/templates/previews/${item.id}/`);
  assert.equal(item.thumbnail, `/templates/thumbnails/${item.id}.png`);
  await access(resolve(root, "previews/templates", item.id, "index.html"));
  await access(resolve(root, "previews/thumbnails", item.id + ".png"));
}
async function checkPreviewBoundary(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    assert(!entry.isSymbolicLink(), "Preview symlink crossed public boundary");
    assert(
      !/\.(?:zip|tsx?|map)$/.test(entry.name) && !entry.name.startsWith(".env"),
      "Private source file in public preview: " + entry.name,
    );
    if (entry.isDirectory())
      await checkPreviewBoundary(resolve(directory, entry.name));
  }
}
await checkPreviewBoundary(resolve(root, "previews"));
const snapshot = JSON.parse(
  await readFile(
    resolve(root, "packages/mcp/src/data/registry.snapshot.json"),
    "utf8",
  ),
);
const registryIndex = JSON.parse(
  await readFile(resolve(root, "registry/dist/index.json"), "utf8"),
);
assert.deepEqual(
  snapshot,
  registryIndex,
  "MCP snapshot content differs from the generated free registry.",
);
assert.deepEqual(
  snapshot.items.map((x) => x.name).sort(),
  [...ids].sort(),
  "MCP snapshot differs from the free catalog.",
);
console.log(
  "Catalog parity passed: 93 free components, routes, registry, MCP snapshot and 5 public Pro summaries.",
);
