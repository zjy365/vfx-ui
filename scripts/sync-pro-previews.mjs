import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { PRODUCT } from "../catalog/templates.mjs";

// Explicit release operation. Regular public builds only use the checked-in previews.
const root = fileURLToPath(new URL("..", import.meta.url));
const artifacts = resolve(
  process.argv[2] || resolve(root, "../vfx-ui-pro/artifacts"),
);
const manifest = JSON.parse(
  await readFile(join(artifacts, "manifest.json"), "utf8"),
);
assert.equal(manifest.productId, PRODUCT.id);
assert.deepEqual(
  [...manifest.contents].sort(),
  [...PRODUCT.templateIds].sort(),
);
async function checkPreview(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    assert(!entry.isSymbolicLink(), "Preview symlinks are not allowed");
    assert(
      !/\.(?:zip|tsx?|map)$/.test(entry.name) && !entry.name.startsWith(".env"),
      "Private source in preview: " + path,
    );
    if (entry.isDirectory()) await checkPreview(path);
  }
}
for (const id of PRODUCT.templateIds) {
  const from = join(artifacts, "previews", id);
  await checkPreview(from);
  const to = join(root, "previews/templates", id);
  await rm(to, { recursive: true, force: true });
  await mkdir(to, { recursive: true });
  await cp(from, to, { recursive: true });
  await mkdir(join(root, "previews/thumbnails"), { recursive: true });
  await cp(
    join(artifacts, "thumbnails", id + ".png"),
    join(root, "previews/thumbnails", id + ".png"),
  );
}
await writeFile(
  join(root, "previews/catalog.json"),
  JSON.stringify(
    { version: manifest.version, templates: PRODUCT.templateIds },
    null,
    2,
  ) + "\n",
);
console.log(
  "Copied five compiled previews and covers. Paid source archives remain private.",
);
