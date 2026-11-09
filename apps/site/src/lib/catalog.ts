import data from "../../../../catalog/generated.json";
import { PRO_PUBLISHED } from "../../../../catalog/publication.mjs";

export interface Control {
  kind?: string;
  key: string;
  label: string;
  default?: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  digits?: number;
  options?: { value: string; label: string }[];
}
export interface Variant {
  id: string;
  label: string;
  description?: string;
  thumbnail?: string;
  props?: Record<string, unknown>;
}
export interface CatalogComponent {
  id: string;
  title: string;
  label: string;
  visible: boolean;
  category: string;
  description: string;
  path: string;
  thumbnail: string;
  tags: string[];
  runtime: string;
  sourceCode: string;
  sourcePath: string;
  registryUrl: string;
  registrySourceCode: string;
  registryUsageIds: string[];
  componentName: string;
  previewProps?: Record<string, unknown>;
  variants?: Variant[];
  controls?: Control[];
  api?: { name: string; type: string; value: string }[];
  agentNotes?: string;
}
export const components = data.components as CatalogComponent[];
export const templates = PRO_PUBLISHED ? data.templates : [];
// Route generation uses the preserved IDs even when publication is disabled;
// those routes render notFound and are removed from the final static export.
export const deferredTemplateIds = data.templates.map(item => item.id);
export const product = data.product;
export type Template = (typeof data.templates)[number];
export const categories = [
  ...new Set(
    components.filter((item) => item.visible).map((item) => item.category),
  ),
];
export const featuredIds = [
  "hero-contour",
  "footer-vinyl",
  "fluid-gradient",
  "hero-eclipse",
  "spectral-card",
  "magnetic",
];
export function componentById(id: string) {
  return components.find((item) => item.id === id);
}
export function templateById(id: string) {
  return templates.find((item) => item.id === id);
}
export const siteUrl = "https://vfx-ui.com";
export const accountUrl = PRO_PUBLISHED ? (
  process.env.NEXT_PUBLIC_ACCOUNT_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3200" : "")
).replace(
  /\/+$/,
  "",
) : "";
