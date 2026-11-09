import type { Metadata } from "next";
import type { CatalogComponent, Template } from "./catalog";

export const siteOrigin = "https://vfx-ui.com";
export const homeTitle = "Free React Components & Animated Backgrounds";
export const homeDescription =
  "Build React and Next.js sites with free hero sections, animated backgrounds, footers and UI effects. Preview components and install editable MIT source.";

export const routeSegment = (value: string) =>
  value.toLowerCase().replace(/\.js\b/g, "-js").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function canonicalUrl(path: string) {
  const pathname = path.split(/[?#]/)[0];
  return new URL(pathname.replace(/\/+$/, "") + "/", siteOrigin).href;
}

export function pageMetadata({
  title, description, path, image = "/og-cover.png", index = true,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  index?: boolean;
}): Metadata {
  const url = canonicalUrl(path);
  const brandedTitle = `${title} · VFX UI`;
  return {
    title: { absolute: brandedTitle },
    description,
    alternates: { canonical: url },
    robots: { index, follow: true, "max-image-preview": "large" },
    // Next.js replaces nested metadata rather than merging it. Keep the full
    // social card on each route so an image override cannot drop its text/URL.
    openGraph: {
      type: "website", siteName: "VFX UI", locale: "en_US",
      title: brandedTitle, description, url,
      images: [{ url: new URL(image, siteOrigin).href, alt: title }],
    },
    twitter: {
      card: "summary_large_image", title: brandedTitle, description,
      images: [new URL(image, siteOrigin).href],
    },
  };
}

export const categoryContent: Record<string, { title: string; description: string; descriptor: string }> = {
  Heroes: {
    title: "Free React Hero Sections",
    description: "Explore editable React hero sections for landing pages: SVG layouts, animated headers and GPU backgrounds. Preview each design and copy its MIT source.",
    descriptor: "Hero Section",
  },
  Backgrounds: {
    title: "Animated React Backgrounds & Shaders",
    description: "Preview animated React backgrounds, from fluid gradients and auroras to particles and mesh shaders. Check GPU requirements and install editable source.",
    descriptor: "Animated Background",
  },
  Footers: {
    title: "Free React Footer Components",
    description: "Find responsive React footer sections with editable navigation, typography and interactions. Preview the layouts and install MIT source for your website.",
    descriptor: "Footer Component",
  },
  Blocks: {
    title: "Free React Landing Page Blocks",
    description: "Build React landing pages with editable pricing, feature, testimonial, navigation and contact blocks. Preview each section and install its MIT source.",
    descriptor: "Page Block",
  },
  Interactions: {
    title: "Interactive React Cards & Hover Effects",
    description: "Explore React hover effects, magnetic controls, tilt cards and pointer interactions. Try live previews and adapt the MIT source to your own interface.",
    descriptor: "Interaction",
  },
  Text: {
    title: "Animated React Text Effects",
    description: "Try kinetic typography, ripple text and chromatic React text effects. Preview the animation, inspect the props and install editable MIT component source.",
    descriptor: "Text Effect",
  },
  Glass: {
    title: "React Glass Effects & Glassmorphism",
    description: "Preview React glass cards, liquid glass, lenses and light effects. Check WebGPU requirements and customize the editable source for your website.",
    descriptor: "Glass Effect",
  },
};

export function componentTitle(item: Pick<CatalogComponent, "title" | "category">) {
  return `${item.title} — React ${categoryContent[item.category]?.descriptor || "Component"}`;
}

const templateTopics: Record<string, string> = {
  agency: "Next.js Agency Template",
  marketing: "Next.js Marketing Website Template",
  playful: "Next.js User Research Template",
  saas: "Next.js AI SaaS Template",
  startup: "Next.js Startup & Hosting Website Template",
  signal: "Next.js Product Website & Issue Tracker Template",
};

export function templateTitle(item: Pick<Template, "id" | "title">) {
  return templateTopics[item.id] || `Next.js ${item.title} Template`;
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [{ name: "VFX UI", path: "/" }, ...items].map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name, item: canonicalUrl(item.path),
    })),
  };
}

export function collectionData(title: string, description: string, path: string, items: { title: string; path: string }[]) {
  return {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: title, description, url: canonicalUrl(path),
    mainEntity: {
      "@type": "ItemList", numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem", position: index + 1, name: item.title, url: canonicalUrl(item.path),
      })),
    },
  };
}
