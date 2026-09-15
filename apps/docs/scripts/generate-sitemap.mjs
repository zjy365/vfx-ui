/*
 * Regenerates public/sitemap.xml from the same catalog the app routes on, so
 * every indexable route (static pages, category/tag listings, shader and
 * variant pages) is listed with the exact path resolveAppRoute serves.
 */
import { build } from "esbuild";
import { rmSync, writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(scriptsDir, "..");
const bundlePath = path.join(scriptsDir, ".sitemap-data.bundle.mjs");
const siteOrigin = "https://vfx-ui.com";

try {
  await build({
    entryPoints: [path.join(scriptsDir, "sitemap-data.ts")],
    outfile: bundlePath,
    bundle: true,
    platform: "node",
    format: "esm",
    logLevel: "silent",
  });

  const { SITEMAP_SHADERS } = await import(pathToFileURL(bundlePath).href);
  const routes = await import(pathToFileURL(path.join(docsDir, "src", "routes.js")).href);
  const { STATIC_ROUTE_PATHS, TAG_ROUTE_PREFIX, categoryRouteSegment, tagRouteSegment, shaderRoutePath } = routes;

  const locations = new Set(
    Object.values(STATIC_ROUTE_PATHS).map((routePath) => `${siteOrigin}${routePath}`),
  );
  for (const shader of SITEMAP_SHADERS) {
    locations.add(`${siteOrigin}${shaderRoutePath(shader)}`);
    for (const variantId of shader.variantIds) {
      locations.add(`${siteOrigin}${shaderRoutePath(shader, variantId)}`);
    }
    locations.add(`${siteOrigin}/${categoryRouteSegment(shader.category)}`);
    for (const tag of shader.tags) {
      locations.add(`${siteOrigin}${TAG_ROUTE_PREFIX}/${tagRouteSegment(tag)}`);
    }
  }

  const escapeXml = (value) =>
    value.replace(/[&<>"']/g, (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char],
    );

  const urls = [...locations].sort().map((location) => `  <url><loc>${escapeXml(location)}</loc></url>`);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
  writeFileSync(path.join(docsDir, "public", "sitemap.xml"), xml);
  console.log(`sitemap: ${urls.length} URLs from ${SITEMAP_SHADERS.length} components`);
} finally {
  rmSync(bundlePath, { force: true });
}
