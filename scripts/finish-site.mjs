import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
const root = fileURLToPath(new URL("..", import.meta.url));
const destination = resolve(root, "apps/docs/dist");
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(
  resolve(root, "apps/site/out/api/search"),
  resolve(root, "apps/site/out/search-index.json"),
);
await cp(resolve(root, "apps/site/out"), destination, { recursive: true });
console.log(
  "New static site staged at apps/docs/dist (existing Cloudflare Pages output).",
);
