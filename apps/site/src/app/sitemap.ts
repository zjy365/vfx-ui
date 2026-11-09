import type { MetadataRoute } from "next";
import { components, categories, templates } from "@/lib/catalog";
import { source } from "@/lib/source";
import { blogSource } from "@/lib/blog";
import { canonicalUrl, routeSegment } from "@/lib/seo";
import { PRO_PUBLISHED } from "../../../../catalog/publication.mjs";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/components/",
    ...(PRO_PUBLISHED ? ["/templates/"] : []),
    "/blog/",
    ...blogSource.getPages().map(page => page.url),
    ...source.getPages().map(page => page.url),
    "/privacy/",
    "/terms/",
    ...categories.map(
      (x) => "/" + routeSegment(x) + "/",
    ),
    ...components.filter(x => x.visible).map((x) => x.path + "/"),
    ...templates.map((x) => "/templates/" + x.id + "/"),
  ];
  return [...new Set(paths.map(canonicalUrl))].map(url => ({ url }));
}
