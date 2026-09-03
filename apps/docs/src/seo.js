import { shaderRoutePath, STATIC_ROUTE_PATHS } from "./routes.js";
import { browseRouteContent, browseRouteFaqs } from "./browseTaxonomy.js";

export const SITE_TITLE = "Shader effect components for React";
export const SITE_DESCRIPTION = "Shader-native visual effect components for React, rendered on the GPU via WebGPU. Wave backgrounds, auroras, liquid glass, globes, and live charts. Copy, paste, and ship.";

const CATEGORY_DESCRIPTORS = {
  Heroes: "Hero Section",
  Backgrounds: "Shader Background",
  Text: "Text Effect",
  Glass: "Glass Effect",
  Data: "Data Visual",
  Globe: "Globe Component",
};

function compactText(value, maxLength) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= maxLength) return text;
  const clipped = text.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  const end = lastSpace > maxLength * 0.7 ? lastSpace : clipped.length;
  return `${clipped.slice(0, end).trim()}…`;
}

function brandedTitle(primary) {
  const suffix = " | VFX UI";
  return `${compactText(primary, 62 - suffix.length)}${suffix}`;
}

function absoluteUrl(origin, path) {
  return new URL(path, `${origin}/`).href;
}

function catalogItems(catalog, origin) {
  return catalog.flatMap((shader) => {
    const variants = shader.variants?.length ? shader.variants : [undefined];
    return variants.map((variant) => ({
      "@type": "ListItem",
      position: 0,
      name: variant ? `${shader.label} — ${variant.label}` : shader.label,
      url: absoluteUrl(origin, shaderRoutePath(shader, variant?.id)),
    }));
  }).map((item, index) => ({ ...item, position: index + 1 }));
}

function faqPage(faqs, name, url) {
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    name,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildRouteSeo(route, origin, catalog = []) {
  const defaultImage = absoluteUrl(origin, "/og-cover.png");
  const indexable = route.page !== "not-found" && route.page !== "capture";
  let title = brandedTitle(SITE_TITLE);
  let description = SITE_DESCRIPTION;
  let canonicalPath = route.canonicalPath ?? STATIC_ROUTE_PATHS.browse;
  let image = defaultImage;
  let structuredData;

  if (route.page === "home") {
    // Brand leads on the homepage; the catalog pages keep the keyword-led title.
    title = "VFX UI — Shader-native WebGPU Components for React";
    description = SITE_DESCRIPTION;
    structuredData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "VFX UI",
      description,
      url: absoluteUrl(origin, "/"),
      about: { "@type": "SoftwareApplication", name: "vfx-ui for React", applicationCategory: "DeveloperApplication" },
    };
  } else if (route.page === "installation") {
    title = brandedTitle("Install vfx-ui for React");
    description = "Install @vfx-ui/react, check WebGPU requirements, and render your first GPU shader component.";
    structuredData = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: "Install vfx-ui for React",
      description,
      url: absoluteUrl(origin, canonicalPath),
      about: { "@type": "SoftwareApplication", name: "vfx-ui for React", applicationCategory: "DeveloperApplication" },
    };
  } else if ((route.page === "shader" || route.page === "capture") && route.shader) {
    const { shader, variant } = route;
    const descriptor = CATEGORY_DESCRIPTORS[shader.category] ?? "Shader Component";
    // Skip the descriptor when the label already carries its leading word —
    // "Hero Aurora Hero Section" reads as a stutter.
    const descriptorWord = descriptor.split(" ")[0].toLowerCase();
    const labelWithDescriptor = shader.label.toLowerCase().includes(descriptorWord)
      ? shader.label
      : `${shader.label} ${descriptor}`;
    const primary = variant
      ? `${variant.label} ${descriptor} — ${shader.label}`
      : labelWithDescriptor;
    title = brandedTitle(primary);
    description = compactText(variant?.description ?? shader.description, 160);
    canonicalPath = shaderRoutePath(shader, variant?.id);
    image = absoluteUrl(origin, variant?.thumbnail ?? shader.thumbnail);
    structuredData = route.page === "capture" ? undefined : {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: variant ? `${shader.label} — ${variant.label}` : shader.label,
      description,
      url: absoluteUrl(origin, canonicalPath),
      image,
      programmingLanguage: ["TypeScript", "WGSL"],
      runtimePlatform: shader.runtime,
      isPartOf: {
        "@type": "CollectionPage",
        name: "VFX UI",
        url: absoluteUrl(origin, STATIC_ROUTE_PATHS.browse),
      },
      ...(variant ? { isBasedOn: absoluteUrl(origin, shaderRoutePath(shader)) } : {}),
    };
  } else if (route.page === "not-found") {
    title = brandedTitle("Page Not Found");
    description = "The requested vfx-ui page could not be found. Browse the complete component collection instead.";
  } else {
    const browseCatalog = route.browseCategory
      ? catalog.filter((shader) => shader.category === route.browseCategory)
      : route.browseTag
        ? catalog.filter((shader) => shader.tags?.includes(route.browseTag))
        : catalog;
    const items = catalogItems(browseCatalog, origin);
    const browseContent = browseRouteContent(route, items.length);
    const browseFaqs = browseRouteFaqs(route);
    const browseUrl = absoluteUrl(origin, canonicalPath);
    title = brandedTitle(browseContent.title);
    description = browseContent.description;
    structuredData = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: browseContent.heading,
      description,
      url: browseUrl,
      hasPart: [
        { "@type": "TechArticle", name: "Installation", url: absoluteUrl(origin, STATIC_ROUTE_PATHS.installation) },
        ...(browseFaqs.length > 0
          ? [faqPage(browseFaqs, `Frequently asked questions about ${browseContent.heading}`, browseUrl)]
          : []),
      ],
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: items.length,
        itemListElement: items,
      },
    };
  }

  return {
    title,
    description,
    canonical: absoluteUrl(origin, canonicalPath),
    image,
    robots: indexable ? "index, follow, max-image-preview:large" : "noindex, nofollow",
    structuredData,
  };
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.append(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
}

export function applyRouteSeo(route, catalog = []) {
  const seo = buildRouteSeo(route, window.location.origin, catalog);
  document.title = seo.title;
  upsertMeta('meta[name="description"]', { name: "description", content: seo.description });
  upsertMeta('meta[name="robots"]', { name: "robots", content: seo.robots });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "VFX UI" });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: seo.title });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: seo.description });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: seo.canonical });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: seo.image });
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: seo.title });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: seo.description });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: seo.image });

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.append(canonical);
  }
  canonical.setAttribute("href", seo.canonical);

  let structuredData = document.head.querySelector("#vfx-ui-structured-data");
  if (seo.structuredData) {
    if (!structuredData) {
      structuredData = document.createElement("script");
      structuredData.id = "vfx-ui-structured-data";
      structuredData.setAttribute("type", "application/ld+json");
      document.head.append(structuredData);
    }
    structuredData.textContent = JSON.stringify(seo.structuredData);
  } else {
    structuredData?.remove();
  }
}
