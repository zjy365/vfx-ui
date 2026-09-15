import { VISIBLE_READY_SHADERS } from "../src/data/registry";

export type SitemapShader = {
  id: string;
  category: string;
  tags: readonly string[];
  variantIds: readonly string[];
};

export const SITEMAP_SHADERS: readonly SitemapShader[] = VISIBLE_READY_SHADERS.map((shader) => ({
  id: shader.id,
  category: shader.category,
  tags: shader.tags ?? [],
  variantIds: shader.variants.map((variant) => variant.id),
}));
