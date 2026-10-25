/** Public product descriptions. Paid files and download URLs never belong here. */
export const PRODUCT = Object.freeze({
  id: "vfx-pro-landing-collection-01",
  title: "VFX UI Pro Lifetime",
  price: 199,
  templatePrice: 59,
  currency: "USD",
  billing: "one-time",
  updates: "lifetime",
  status: "rebuilding",
  templateIds: ["agency", "marketing", "playful", "saas", "startup", "signal"],
});

export const TEMPLATES = [
  {
    id: "agency",
    title: "Agency",
    brand: "Gather",
    category: "Creative services",
    headline: "Bring every part of the work into focus.",
    description:
      "A complete SaaS website for independent studios, with product stories, example pricing, FAQs, a journal and a private client-project workspace powered by Better Auth, PostgreSQL and Drizzle.",
    accent: "#CEF79E",
    background: "#222F30",
    pages: ["Home", "Product", "Workflow", "Pricing", "Project starting points", "Journal", "Account", "Project workspace"],
  },
  {
    id: "marketing",
    title: "Marketing",
    brand: "Cadence",
    category: "Marketing & growth",
    headline: "Bring your next campaign to life.",
    description:
      "A complete campaign-planning SaaS website with product stories, role scenarios, example pricing, FAQs, contact and a journal. Better Auth, PostgreSQL and Drizzle power the private campaign workspace.",
    accent: "#0447FF",
    background: "#FDFCFC",
    pages: ["Home", "Features", "Pricing", "Journal", "Contact", "Account", "Campaign workspace"],
  },
  {
    id: "playful",
    title: "User Research",
    brand: "VFX Research",
    category: "User research",
    headline: "User research that feels like play.",
    description:
      "A Next.js user-research product with expressive research cards, pricing and an MDX journal. Account and research workspace modules are being integrated.",
    accent: "#E2EC79",
    background: "#FFFFFF",
    pages: ["Home", "Pricing", "MDX journal", "Sign up", "Research workspace (in progress)"],
  },
  {
    id: "saas",
    title: "AI Workspace",
    brand: "VFX AI Workspace",
    category: "AI products",
    headline: "Every generative model. One calm canvas.",
    description:
      "A Next.js AI product foundation with pricing, an MDX journal and account pages. A persistent project workspace is being integrated; model execution is not included.",
    accent: "#EDD49E",
    background: "#17191C",
    pages: ["Home", "Pricing", "MDX journal", "Contact", "Login & sign up", "Project workspace (in progress)"],
  },
  {
    id: "startup",
    title: "Hosting",
    brand: "VFX Launch",
    category: "Deployment tools",
    headline: "Ready for what’s next.",
    description:
      "A complete release-planning SaaS website with product stories, scenarios, workflow, example pricing, FAQs and field notes. Better Auth, PostgreSQL and Drizzle power saved private release records; hosting infrastructure is not included.",
    accent: "#D3AC7E",
    background: "#111D2B",
    pages: ["Home", "Product features", "Workflow", "Pricing", "Field notes", "Contact", "Account", "Release workspace"],
  },
  {
    id: "signal",
    title: "Signal",
    brand: "Signal",
    category: "Product",
    headline: "Make room for the work that matters.",
    description:
      "A focused product website and private issue tracking application. Built on Next.js with Better Auth accounts, PostgreSQL, Drizzle, and persistent issue planning.",
    accent: "#C53E00",
    background: "#F7F7F4",
    pages: ["Home", "Product", "Workflow", "Pricing", "Contact", "Journal", "Account", "Issue workspace"],
  },
].map((template) =>
  Object.freeze({
    ...template,
    tier: "pro",
    kind: "template",
    status: "rebuilding",
    productId: `vfx-pro-template-${template.id}`,
    collectionId: PRODUCT.id,
    price: PRODUCT.templatePrice,
    currency: PRODUCT.currency,
    billing: PRODUCT.billing,
    updates: PRODUCT.updates,
    runtime: "dom",
    // Full application previews require a separately hosted Node runtime.
    preview: null,
    thumbnail: `/templates/thumbnails/${template.id}.png`,
  }),
);
