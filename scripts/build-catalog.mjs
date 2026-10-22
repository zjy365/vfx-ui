import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { CATALOG } from "../catalog/components.mjs";
import { PRODUCT, TEMPLATES } from "../catalog/templates.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const richItems = JSON.parse(
  await readFile(resolve(root, "catalog/metadata.json"), "utf8"),
);
const sources = new Map(CATALOG.map((item) => [item.name, item]));
const components = new Map(CATALOG.map((item) => [item.component, item]));
const items = richItems.map((item) => {
  const source = sources.get(item.id);
  if (!source) throw new Error(`Missing source manifest: ${item.id}`);
  const registryUsageIds = new Set([item.id]);
  const registrySourceCode = item.sourceCode.replace(
    /import\s*\{([^}]+)\}\s*from\s*(["'])@vfx-ui\/react\2/g,
    (statement, names) => {
      const component = components.get(
        names
          .split(",")[0]
          .trim()
          .split(/\s+as\s+/)[0],
      );
      if (!component)
        throw new Error(`Unknown example import for ${item.id}: ${names}`);
      registryUsageIds.add(component.name);
      return `import {${names}} from "@/components/${component.component}"`;
    },
  );
  return {
    ...item,
    title: item.label,
    tier: "free",
    license: "MIT",
    kind: item.tags?.includes("example")
      ? "example"
      : item.category === "Blocks"
        ? "block"
        : "component",
    componentName: source.component,
    sourcePath: `packages/react/src/components/${source.component}.tsx`,
    registryUrl: `https://vfx-ui.com/r/${item.id}.json`,
    registrySourceCode,
    registryUsageIds: [...registryUsageIds],
    dependencies: source.registryDeps ?? [],
  };
});
const output = resolve(root, "catalog/generated.json");
await writeFile(
  output,
  JSON.stringify(
    {
      schemaVersion: 1,
      components: items,
      templates: TEMPLATES,
      product: PRODUCT,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Catalog: ${items.length} free components, ${TEMPLATES.length} Pro template descriptions.`,
);
await writeFile(
  resolve(root, "catalog/preview.json"),
  JSON.stringify(
    {
      components: items.map(
        ({ id, componentName, category, runtime, previewProps }) => ({
          id,
          componentName,
          category,
          runtime,
          previewProps,
        }),
      ),
    },
    null,
    2,
  ) + "\n",
);
