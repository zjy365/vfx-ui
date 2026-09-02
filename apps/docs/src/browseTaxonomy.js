const DEFAULT_BROWSE_CONTENT = Object.freeze({
  title: "Shader effect components for React",
  heading: "WebGPU shader effect components for React",
  description: "Browse copy-ready WebGPU shader components, GPU backgrounds, text effects, glass surfaces, data visuals, and globes for React.",
});

const CATEGORY_CONTENT = Object.freeze({
  Heroes: Object.freeze({
    title: "Hero Section Components for React",
    heading: "Drop-in WebGPU hero sections",
    description: "Copy-paste hero sections: GPU-rendered backgrounds with real selectable text, CTAs, and production-grade defaults. The first screen of paid templates, as a component.",
  }),
  Backgrounds: Object.freeze({
    title: "WebGPU Background Components",
    heading: "WebGPU shader backgrounds",
    description: "Browse interactive WebGPU shader backgrounds, gradient fields, and ambient GPU effects for React interfaces.",
  }),
  Text: Object.freeze({
    title: "Shader Text Effect Components",
    heading: "Shader text effects",
    description: "Browse GPU shader text components for headings, reveals, kinetic typography, and metallic type.",
  }),
  Glass: Object.freeze({
    title: "Glass Effect Components",
    heading: "Glass and refraction effects",
    description: "Browse GPU glass components with refraction, blur, and liquid glass surfaces for React.",
  }),
  Data: Object.freeze({
    title: "Data Visualization Components",
    heading: "GPU data visuals",
    description: "Browse shader-driven data components, live charts, and particle fields rendered on the GPU.",
  }),
  Globe: Object.freeze({
    title: "Globe Components",
    heading: "WebGPU globes",
    description: "Browse interactive WebGL and WebGPU globe components for React dashboards and hero sections.",
  }),
});

const CATEGORY_FAQS = Object.freeze({});

const TOKEN_LABELS = Object.freeze({
  "2d": "2D",
  "3d": "3D",
  ai: "AI",
  api: "API",
  css: "CSS",
  glsl: "GLSL",
  gpu: "GPU",
  gsap: "GSAP",
  html: "HTML",
  js: "JS",
  mcp: "MCP",
  saas: "SaaS",
  svg: "SVG",
  ui: "UI",
  ux: "UX",
  vr: "VR",
  webgl: "WebGL",
  webgl2: "WebGL2",
  webgpu: "WebGPU",
  wgsl: "WGSL",
  xr: "XR",
});

export const BROWSE_CATEGORIES = Object.freeze(Object.keys(CATEGORY_CONTENT));

export function browseCategoryContent(category) {
  return CATEGORY_CONTENT[category] ?? DEFAULT_BROWSE_CONTENT;
}

export function browseRouteFaqs(route) {
  if (!route.browseCategory || route.browseTag) return [];
  return CATEGORY_FAQS[route.browseCategory] ?? [];
}

export function browseTagLabel(tag) {
  return tag
    .trim()
    .split(/\s+/)
    .map((token) => TOKEN_LABELS[token.toLowerCase()] ?? `${token.charAt(0).toUpperCase()}${token.slice(1)}`)
    .join(" ");
}

export function browseTagContent(tag, resultCount = 0) {
  const label = browseTagLabel(tag);
  const countText = resultCount > 0 ? `${resultCount} ` : "";
  return {
    title: `${label} Components`,
    heading: `${label} components`,
    description: `Explore ${countText}vfx-ui components and interactive GPU effects tagged ${label}, with live previews and copy-ready usage code.`,
  };
}

export function browseRouteContent(route, resultCount = 0) {
  if (route.browseTag) return browseTagContent(route.browseTag, resultCount);
  if (route.browseCategory) return browseCategoryContent(route.browseCategory);
  return DEFAULT_BROWSE_CONTENT;
}
