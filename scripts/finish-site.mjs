import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { PRO_PUBLISHED } from "../catalog/publication.mjs";
const root = fileURLToPath(new URL("..", import.meta.url));
const destination = resolve(root, "apps/docs/dist");
if (!PRO_PUBLISHED) {
  // Next still compiles the preserved source routes. Remove their notFound
  // HTML and RSC payloads so direct requests use the host's real 404 page.
  for (const path of [
    "templates", "templates.txt", "templates.html", "templates.__PAGE__.txt", "templates._full.txt", "templates._tree.txt",
    "_next/static/chunks/app/templates",
    "docs/free-and-pro", "docs/pro-license", "blog/nextjs-landing-page-templates",
  ]) await rm(resolve(root, "apps/site/out", path), { recursive: true, force: true });
}
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
