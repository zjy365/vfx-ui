import { cp, mkdir, rm, writeFile, readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { legacyRedirects } from "../catalog/redirects.mjs";
const root = fileURLToPath(new URL("..", import.meta.url));
const publicDir = resolve(root, "apps/site/public");
execFileSync(process.execPath, ["scripts/build-catalog.mjs"], {
  cwd: root,
  stdio: "inherit",
});
execFileSync(process.execPath, ["registry/build.mjs"], {
  cwd: root,
  stdio: "inherit",
});
execFileSync(process.execPath, ["scripts/generate-agentic.mjs"], {
  cwd: root,
  stdio: "inherit",
});
execFileSync(process.execPath, ["scripts/generate-prompts.mjs"], {
  cwd: root,
  stdio: "pipe",
});
await rm(publicDir, { recursive: true, force: true });
await mkdir(publicDir, { recursive: true });
for (const name of [
  "showcase",
  "components",
  "prompts",
  "favicon.svg",
  "favicon.ico",
  "og-cover.png",
  "llms.txt",
  "agents.md",
]) {
  await cp(resolve(root, "apps/docs/public", name), resolve(publicDir, name), {
    recursive: true,
  });
}
await cp(resolve(root, "registry/dist/r"), resolve(publicDir, "r"), {
  recursive: true,
});
await cp(
  resolve(root, "registry/dist/index.json"),
  resolve(publicDir, "r/index.json"),
);
await cp(
  resolve(root, "registry/dist/registry.json"),
  resolve(publicDir, "r/registry.json"),
);
await cp(
  resolve(root, "previews/thumbnails"),
  resolve(publicDir, "templates/thumbnails"),
  { recursive: true },
);
execFileSync("pnpm", ["--filter", "@vfx-ui/preview", "build"], {
  cwd: root,
  stdio: "inherit",
});
await cp(
  resolve(root, "apps/preview/dist"),
  resolve(publicDir, "preview-runtime"),
  { recursive: true },
);
await writeFile(
  resolve(publicDir, "robots.txt"),
  "User-agent: *\nAllow: /\nSitemap: https://vfx-ui.com/sitemap.xml\n",
);
await writeFile(
  resolve(publicDir, "_headers"),
  "/r/*\n  Access-Control-Allow-Origin: *\n  X-Content-Type-Options: nosniff\n/*\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Content-Type-Options: nosniff\n",
);
const catalog = JSON.parse(
  await readFile(resolve(root, "catalog/generated.json"), "utf8"),
);
await writeFile(
  resolve(publicDir, "_redirects"),
  legacyRedirects(catalog.components)
    .map(([from, to]) => `${from} ${to} 301`)
    .join("\n") + "\n",
);
