/** Compatibility redirects for URLs that were published by the original site. */
import {
  LEGACY_SHADER_CATEGORY_SEGMENTS,
  RENAMED_SHADER_IDS,
  RENAMED_SHADER_VARIANTS,
} from "../apps/docs/src/routes.js";
export function legacyRedirects(components) {
  const rules = new Map([
    ["/installation", "/docs/installation/"],
    ["/pro", "/templates/"],
    ["/browse", "/components/"],
  ]);
  for (const item of components) {
    const canonical = item.path + "/";
    const category = item.path.split("/")[1];
    const legacyCategory = LEGACY_SHADER_CATEGORY_SEGMENTS[item.id];
    const candidates = new Set([
      `/${category}/${item.id}`,
      ...(legacyCategory
        ? [
            `/${legacyCategory}/${item.id}`,
            `/${legacyCategory}/${item.path.split("/").at(-1)}`,
          ]
        : []),
    ]);
    for (const [old, current] of Object.entries(RENAMED_SHADER_IDS))
      if (current === item.id) candidates.add(`/${category}/${old}`);
    for (const path of candidates)
      if (path !== item.path) {
        rules.set(path, canonical);
        for (const variant of item.variants || [])
          rules.set(path + "/" + variant.id, canonical + variant.id + "/");
      }
    for (const variant of item.variants || [])
      rules.set(
        `/${category}/${variant.id}/${item.path.split("/").at(-1)}`,
        canonical + variant.id + "/",
      );
    for (const [old, current] of Object.entries(
      RENAMED_SHADER_VARIANTS[item.id] || {},
    ))
      rules.set(item.path + "/" + old, canonical + current + "/");
  }
  return [...rules];
}
