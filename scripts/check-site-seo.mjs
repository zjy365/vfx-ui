import assert from "node:assert/strict";
import { readFile, access, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PRO_PUBLISHED } from "../catalog/publication.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(new URL("../apps/site/package.json", import.meta.url));
const { JSDOM } = require("jsdom");
const output = resolve(root, "apps/site/out");
const origin = "https://vfx-ui.com";
const analyticsScript = "https://stats.lzgpt.top/api/script.js?siteId=5";
const xml = new JSDOM(await readFile(resolve(output, "sitemap.xml"), "utf8"), { contentType: "text/xml" });
const urls = [...xml.window.document.querySelectorAll("loc")].map(node => node.textContent);
xml.window.close();
assert(urls.length > 100, "The sitemap must contain the full catalog and docs");
assert.equal(new Set(urls).size, urls.length, "Duplicate sitemap URLs");
const routes = new Set(urls.map(url => new URL(url).pathname));
const graph = new Map();
const titles = new Set();
const descriptions = new Set();
const expectedAccountOrigin = PRO_PUBLISHED ? (process.env.NEXT_PUBLIC_ACCOUNT_URL || "").replace(/\/+$/, "") : "";
let accountLinks = 0;
const meta = (document, key) => document.querySelector(`meta[name="${key}"], meta[property="${key}"]`)?.getAttribute("content");

async function load(path) {
  return new JSDOM(await readFile(resolve(output, "." + path, "index.html"), "utf8"));
}

for (const url of urls) {
  const path = new URL(url).pathname;
  assert.equal(new URL(url).origin, origin);
  assert(path.endsWith("/") && !/[?#]/.test(url), `Noncanonical sitemap URL: ${url}`);
  const dom = await load(path);
  const document = dom.window.document;
  const prefix = `${path}: `;
  // Check the exported artifact, rather than just source: analytics was once
  // left in the retired Vite entry while the Next.js export shipped without it.
  assert(document.querySelector(`link[rel="preload"][as="script"][href="${analyticsScript}"], script[src="${analyticsScript}"]`), prefix + "Rybbit site 5 script missing from export");
  // Docs uses its own Fumadocs navigation instead of the marketing header.
  if (!path.startsWith("/docs/")) {
    for (const event of ["github_click", "get_started_click"]) {
      assert(document.querySelector(`[data-rybbit-event="${event}"]`), prefix + `missing Rybbit event: ${event}`);
    }
  }
  if (path === "/") assert(document.querySelector('[data-rybbit-event="copy_install_click"]'), prefix + "installation copy event missing");
  if (path === "/backgrounds/fluid-gradient/") assert(document.querySelector('[data-rybbit-event="copy_code_click"][data-rybbit-prop-component="fluid-gradient"]'), prefix + "component code copy event missing");
  assert(!document.querySelector('[data-rybbit-prop-value]'), prefix + "copied content must not be attached to analytics events");
  assert.equal(document.querySelectorAll('link[rel="canonical"]').length, 1, prefix + "one canonical required");
  assert.equal(document.querySelector('link[rel="canonical"]').href, url, prefix + "wrong canonical");
  assert(!meta(document, "robots")?.includes("noindex"), prefix + "noindex in sitemap");
  assert.equal(document.querySelectorAll("h1").length, 1, prefix + "one visible page heading required");
  assert(document.querySelector("h1").textContent.trim(), prefix + "empty heading");
  const title = document.title;
  const description = meta(document, "description");
  assert(title && !titles.has(title), prefix + "missing or duplicate title");
  assert(description && !descriptions.has(description), prefix + "missing or duplicate description");
  titles.add(title);
  descriptions.add(description);
  assert.equal(meta(document, "og:title"), title, prefix + "social title differs");
  assert.equal(meta(document, "og:description"), description, prefix + "social description differs");
  assert.equal(meta(document, "og:url"), url, prefix + "wrong social URL");
  assert.equal(meta(document, "twitter:title"), title, prefix + "missing Twitter title");
  assert.equal(meta(document, "twitter:description"), description, prefix + "missing Twitter description");
  assert.equal(meta(document, "twitter:card"), "summary_large_image", prefix + "missing Twitter card");
  const image = new URL(meta(document, "og:image"));
  assert.equal(image.origin, origin, prefix + "unexpected social image origin");
  await access(resolve(output, "." + image.pathname));
  if (path !== "/privacy/" && path !== "/terms/") {
    const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')];
    assert(scripts.length, prefix + "missing structured data");
    for (const script of scripts) {
      const data = JSON.parse(script.textContent);
      for (const entity of Array.isArray(data) ? data : [data]) {
        assert(entity["@context"] && entity["@type"], prefix + "invalid schema entity");
        // These pages expose source and previews; checkout remains unavailable.
        assert(!entity.offers && !entity.aggregateRating, prefix + "unsupported commercial claims");
      }
    }
  }
  const links = [...document.querySelectorAll("a[href]")].map(a => new URL(a.getAttribute("href"), url))
    .filter(link => link.origin === origin && routes.has(link.pathname)).map(link => link.pathname);
  graph.set(path, links);
  for (const link of document.querySelectorAll('a[href]')) {
    const target = new URL(link.getAttribute("href"), url);
    assert(!["localhost", "127.0.0.1", "[::1]"].includes(target.hostname), prefix + "local development link in production HTML");
    if (target.hostname === "account.vfx-ui.com" || (target.origin !== origin && /^\/(sign-in|buy|purchases|account)(\/|$)/.test(target.pathname))) {
      assert(expectedAccountOrigin && target.origin === expectedAccountOrigin, prefix + "account link differs from release configuration");
      accountLinks++;
    }
  }
  if (path.startsWith("/blog/") && path !== "/blog/") {
    assert(document.querySelector("article"), prefix + "missing article body");
    const body = document.querySelector(".blog-body");
    assert(body?.textContent.trim().length > 1000, prefix + "article body is empty or incomplete");
    for (const link of body.querySelectorAll('a[href^="/"]')) {
      const target = new URL(link.getAttribute("href"), origin);
      assert(routes.has(target.pathname), prefix + `broken or noncanonical article link: ${target.pathname}`);
    }
    for (const link of document.querySelectorAll('.blog-toc a[href^="#"]')) {
      assert(document.getElementById(decodeURIComponent(link.hash.slice(1))), prefix + "broken table-of-contents anchor");
    }
  }
  dom.window.close();
}

// A sitemap alone cannot replace crawlable navigation. Every canonical page
// must be reachable through real HTML links starting at the homepage.
const depths = new Map([["/", 0]]);
const queue = ["/"];
for (const path of queue) {
  for (const target of graph.get(path) || []) {
    if (!depths.has(target)) {
      depths.set(target, depths.get(path) + 1);
      queue.push(target);
    }
  }
}
for (const path of routes) {
  assert(depths.has(path), `Orphaned sitemap page: ${path}`);
  assert(depths.get(path) <= 4, `Page is more than four clicks from home: ${path}`);
}
if (expectedAccountOrigin) assert(accountLinks > 0, "Configured account entry is missing from exported HTML");

const catalog = JSON.parse(await readFile(resolve(root, "catalog/generated.json"), "utf8"));
const example = catalog.components.find(item => item.id === "example-launch");
const tagged = catalog.components.find(item => item.tags.length);
const segment = value => value.toLowerCase().replace(/\.js\b/g, "-js").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
for (const path of [`/preview/${tagged.id}/`, "/examples/launch/", `/components/tag/${segment(tagged.tags[0])}/`]) {
  assert(!routes.has(path), `Utility route in sitemap: ${path}`);
  const dom = await load(path);
  assert(meta(dom.window.document, "robots")?.includes("noindex"), `Utility route must be noindex: ${path}`);
  if (path === "/examples/launch/") assert.equal(dom.window.document.querySelector('link[rel="canonical"]').href, origin + example.path + "/");
  dom.window.close();
}
const preset = catalog.components.find(item => item.variants?.length);
if (preset) {
  const path = `${preset.path}/${preset.variants[0].id}/`;
  const dom = await load(path);
  assert.equal(dom.window.document.querySelector('link[rel="canonical"]').href, origin + preset.path + "/");
  assert(!routes.has(path), "Preset duplicates should not appear in the sitemap");
  dom.window.close();
}
const headers = await readFile(resolve(output, "_headers"), "utf8");
assert(headers.includes("/preview-runtime/index.html\n  X-Robots-Tag: noindex, follow"));
if (!PRO_PUBLISHED) {
  const blocked = /^\/(?:templates(?:\/|$)|pro(?:\/|$)|buy(?:\/|$)|purchases(?:\/|$)|sign-in(?:\/|$)|docs\/(?:free-and-pro|pro-license)(?:\/|$)|blog\/nextjs-landing-page-templates(?:\/|$))/;
  for (const path of routes) assert(!blocked.test(path), `Unpublished Pro route in sitemap: ${path}`);
  for (const path of ["templates", "_next/static/chunks/app/templates", "docs/free-and-pro", "docs/pro-license", "blog/nextjs-landing-page-templates"]) {
    await assert.rejects(access(resolve(output, path)), `Unpublished Pro route exported: ${path}`);
  }
  let htmlCount = 0;
  async function inspectHtml(directory) {
    for (const file of await readdir(directory, { withFileTypes: true })) {
      const path = resolve(directory, file.name);
      if (file.isDirectory()) { await inspectHtml(path); continue; }
      if (!file.name.endsWith(".html")) continue;
      const dom = new JSDOM(await readFile(path, "utf8"));
      for (const link of dom.window.document.querySelectorAll("a[href]")) {
        const target = new URL(link.getAttribute("href"), origin);
        assert(target.hostname !== "account.vfx-ui.com" && !(target.origin === origin && blocked.test(target.pathname)), `Pro entry in free HTML: ${path} ${target.pathname}`);
      }
      assert(!/Pro Lifetime|Get Pro|My purchases|Source library/.test(dom.window.document.body.textContent), `Pro sales copy in free HTML: ${path}`);
      dom.window.close();
      htmlCount++;
    }
  }
  await inspectHtml(output);
  for (const file of ["llms.txt", "agents.md", "_redirects"]) {
    const text = await readFile(resolve(output, file), "utf8");
    assert(!/\/templates\/|\/docs\/free-and-pro\/|\/blog\/nextjs-landing-page-templates\/|account\.vfx-ui\.com/.test(text), `Pro promotion in free public reference: ${file}`);
  }
  console.log(`Free-only publication verified: ${htmlCount} HTML files; no Pro routes, navigation, checkout or account entries.`);
}
console.log(`SEO export verified: ${urls.length} canonical pages, unique titles/descriptions, social cards, structured data, HTML links and utility/preset indexing rules. Maximum click depth: ${Math.max(...depths.values())}.`);
console.log(`Rybbit export verified: site 5 script on ${urls.length} canonical pages, marketing navigation and installation/code-copy events, no copied-content event properties.`);
