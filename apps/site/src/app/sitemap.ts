import type { MetadataRoute } from "next";
import { components, categories, templates, siteUrl } from "@/lib/catalog";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/components/",
    "/templates/",
    "/docs/",
    "/docs/installation/",
    "/docs/license/",
    "/docs/free-and-pro/",
    "/docs/accessibility/",
    "/docs/agents/",
    "/privacy/",
    "/terms/",
    ...categories.map(
      (x) => "/" + x.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "/",
    ),
    ...components.map((x) => x.path + "/"),
    ...templates.map((x) => "/templates/" + x.id + "/"),
  ];
  return [...new Set(paths)].map((path) => ({ url: siteUrl + path }));
}
