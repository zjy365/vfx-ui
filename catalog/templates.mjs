/** Public product descriptions. Paid files and download URLs never belong here. */
export const PRODUCT = Object.freeze({
  id: "vfx-pro-landing-collection-01",
  title: "The landing page collection",
  price: 59,
  currency: "USD",
  billing: "one-time",
  updateMonths: 12,
  status: "preview",
  templateIds: ["agency", "marketing", "playful", "saas", "startup"],
});

export const TEMPLATES = [
  {
    id: "agency",
    title: "Agency",
    brand: "Index Studio",
    category: "Creative services",
    headline: "Work that makes its mark.",
    description:
      "An editorial website for independent studios: selected work, services, project stories, and a clear path to an enquiry.",
    accent: "#17191C",
    background: "#EDEBE6",
    pages: ["Home", "Work", "Project", "Services", "Contact"],
  },
  {
    id: "marketing",
    title: "Marketing",
    brand: "Signal",
    category: "Marketing & growth",
    headline: "Make your next move.",
    description:
      "A confident product website with campaign stories, practical features, pricing, and a useful journal.",
    accent: "#2758D8",
    background: "#FFFFFF",
    pages: ["Home", "Features", "Pricing", "Journal", "Contact"],
  },
  {
    id: "playful",
    title: "Playful",
    brand: "Goodfolk",
    category: "Consumer & community",
    headline: "Good things. Together.",
    description:
      "A warm, expressive website for a consumer product or community, with playful interactions and room for real stories.",
    accent: "#E2EC79",
    background: "#FFFFFF",
    pages: ["Home", "About", "Stories", "Story", "Join"],
  },
  {
    id: "saas",
    title: "SaaS",
    brand: "Trace",
    category: "Developer tools",
    headline: "Every event. In focus.",
    description:
      "A precise product website for a developer tool, with an interactive event explorer, product details, pricing, and a changelog.",
    accent: "#EDD49E",
    background: "#17191C",
    pages: ["Home", "Product", "Pricing", "Changelog", "Contact"],
  },
  {
    id: "startup",
    title: "Startup",
    brand: "Fieldwork",
    category: "New ventures",
    headline: "Room for what matters.",
    description:
      "A considered launch website for a new venture, with a clear product story, an approach page, updates, and an early-access form.",
    accent: "#3D4B35",
    background: "#E9E6DA",
    pages: ["Home", "Our approach", "Updates", "Update", "Early access"],
  },
].map((template) =>
  Object.freeze({
    ...template,
    tier: "pro",
    kind: "template",
    status: "preview",
    productId: PRODUCT.id,
    runtime: "dom",
    preview: `/templates/previews/${template.id}/`,
    thumbnail: `/templates/thumbnails/${template.id}.png`,
  }),
);
