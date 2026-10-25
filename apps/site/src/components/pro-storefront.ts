import { accountUrl, type Template } from "@/lib/catalog";

const descriptions: Record<string, string> = {
  agency: "A considered home for your studio, and a workspace for your client projects.",
  marketing: "Bring campaigns, creative plans and the next launch into one place.",
  playful: "Research studies, an editorial journal and room to understand your users.",
  saas: "An expressive starting point for an AI product and its project workspace.",
  startup: "A product story and private workspace for planning your next release.",
  signal: "A focused product website, with a private home for issue planning.",
};

export function templateSummary(template: Template) {
  return descriptions[template.id] ?? template.description;
}

export function templateCover(template: Template) {
  return template.thumbnail;
}

export function canPurchase(status: string) {
  return Boolean(accountUrl) && (status === "available" || status === "ready");
}
