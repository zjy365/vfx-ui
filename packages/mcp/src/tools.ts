import { STYLES_MARKDOWN, DESIGN_NOTES_MARKDOWN } from "./design.js";
import {
  getIndex,
  getItem,
  getDocsMarkdown,
  docsUrl,
  installCommand,
  type IndexResult,
  type RegistryItemDetail,
  type RegistryItemSummary,
} from "./registry.js";

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

function countLines(text: string): number {
  return text.split(/\r?\n/).length;
}

function listCategories(items: RegistryItemSummary[]): Map<string, RegistryItemSummary[]> {
  const byCategory = new Map<string, RegistryItemSummary[]>();
  for (const item of items) {
    const categories = item.categories?.length ? item.categories : ["Uncategorized"];
    for (const category of categories) {
      const bucket = byCategory.get(category) ?? [];
      bucket.push(item);
      byCategory.set(category, bucket);
    }
  }
  return byCategory;
}

/** vfx_list_components */
export async function listComponents(rawCategory?: unknown): Promise<string> {
  const index = await getIndex();
  const headerBase = `VFX UI registry — ${String(index.items.length)} components (source: ${index.source}, base: ${index.base}, fetched at: ${index.fetchedAt})`;

  if (typeof rawCategory === "string" && rawCategory.trim().length > 0) {
    const wanted = rawCategory.trim().toLowerCase();
    const byCategory = listCategories(index.items);
    const match = [...byCategory.entries()].find(
      ([category]) => category.toLowerCase() === wanted,
    );
    if (!match) {
      const available = [...byCategory.entries()]
        .map(([category, bucket]) => `- ${category} (${String(bucket.length)})`)
        .join("\n");
      return `${headerBase}\n\nNo category named "${rawCategory}". Available categories:\n${available}`;
    }
    const [category, bucket] = match;
    const lines = bucket.map(
      (item) => `- ${item.name} — ${item.title ?? item.name}: ${item.description ?? "(no description)"}`,
    );
    return [
      headerBase,
      "",
      `## ${category} (${String(bucket.length)})`,
      ...lines,
      "",
      `Install any component: \`${installCommand("<name>")}\``,
    ].join("\n");
  }

  const sections: string[] = [headerBase, ""];
  const byCategory = listCategories(index.items);
  for (const [category, bucket] of byCategory) {
    sections.push(`## ${category} (${String(bucket.length)})`);
    for (const item of bucket) {
      sections.push(`- ${item.name} — ${item.title ?? item.name}: ${item.description ?? "(no description)"}`);
    }
    sections.push("");
  }
  sections.push(`Install any component: \`${installCommand("<name>")}\``);
  return sections.join("\n");
}

/** vfx_search_components */
export async function searchComponents(rawQuery: unknown): Promise<string> {
  if (typeof rawQuery !== "string" || rawQuery.trim().length === 0) {
    throw new Error("query is required (non-empty string)");
  }
  const index = await getIndex();
  const tokens = rawQuery.toLowerCase().split(/\s+/).filter(Boolean);

  interface Scored {
    item: RegistryItemSummary;
    score: number;
    matched: Set<string>;
  }

  const scored: Scored[] = [];
  for (const item of index.items) {
    const name = item.name.toLowerCase();
    const title = (item.title ?? "").toLowerCase();
    const description = (item.description ?? "").toLowerCase();
    const tags = (item.tags ?? []).map((tag) => tag.toLowerCase());
    const categories = (item.categories ?? []).map((category) => category.toLowerCase());

    let score = 0;
    const matched = new Set<string>();
    for (const token of tokens) {
      if (name === token) {
        score += 120;
        matched.add("name");
      } else if (name.startsWith(token)) {
        score += 90;
        matched.add("name");
      } else if (name.includes(token)) {
        score += 70;
        matched.add("name");
      }
      if (title.includes(token)) {
        score += 45;
        matched.add("title");
      }
      if (tags.some((tag) => tag === token)) {
        score += 55;
        matched.add("tags");
      } else if (tags.some((tag) => tag.includes(token))) {
        score += 40;
        matched.add("tags");
      }
      if (categories.some((category) => category.includes(token))) {
        score += 30;
        matched.add("categories");
      }
      if (description.includes(token)) {
        score += 20;
        matched.add("description");
      }
    }
    if (score > 0) {
      scored.push({ item, score, matched });
    }
  }

  if (scored.length === 0) {
    const byCategory = listCategories(index.items);
    const available = [...byCategory.keys()].join(", ");
    return `No components match "${rawQuery}" (searched name, title, description, tags, categories; source: ${index.source}).\n\nTry another keyword, or call vfx_list_components to browse. Categories: ${available}`;
  }

  scored.sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));
  const lines = scored.slice(0, 25).map(({ item, matched }) => {
    const where = [...matched].join(", ");
    return `- ${item.name} — ${item.title ?? item.name}: ${item.description ?? "(no description)"} [categories: ${(item.categories ?? []).join(", ") || "—"}; matched: ${where}]`;
  });
  return [
    `Search "${rawQuery}" — ${String(scored.length)} match(es) (source: ${index.source}):`,
    "",
    ...lines,
    ...(scored.length > 25 ? [`...and ${String(scored.length - 25)} more. Refine the query or use vfx_list_components.`] : []),
    "",
    `Get details: vfx_get_component(name) · Install: \`${installCommand("<name>")}\``,
  ].join("\n");
}

function extractPropsSection(markdown: string): string | null {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => /^##\s+Props\s*$/i.test(line.trim()));
  if (start === -1) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => /^##\s+/.test(line.trim()));
  const section = (end === -1 ? rest : rest.slice(0, end)).join("\n").trim();
  return section.length > 0 ? section : null;
}

function fenceLanguage(path: string): string {
  if (path.endsWith(".tsx")) return "tsx";
  if (path.endsWith(".ts")) return "ts";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".json")) return "json";
  return "";
}

interface FileRow {
  path: string;
  type?: string;
  content?: string;
}

function fileRows(detail: RegistryItemDetail | null, summary: RegistryItemSummary): FileRow[] {
  const files = (detail?.files?.length ? detail.files : summary.files) ?? [];
  return files.map((file) => ({
    path: file.path,
    type: file.type,
    content: "content" in file ? (file as { content?: string }).content : undefined,
  }));
}

/** vfx_get_component */
export async function getComponent(
  rawName: unknown,
  rawIncludeFiles: unknown,
): Promise<string> {
  if (typeof rawName !== "string" || rawName.trim().length === 0) {
    throw new Error("name is required (non-empty string)");
  }
  const name = normalizeName(rawName);
  const includeFiles = rawIncludeFiles === true;

  const index = await getIndex();
  const summary = index.items.find((item) => item.name === name);
  if (!summary) {
    const suggestions = index.items
      .filter((item) => item.name.includes(name.split("-")[0] ?? name))
      .slice(0, 8)
      .map((item) => item.name);
    const hint = suggestions.length > 0 ? ` Similar names: ${suggestions.join(", ")}.` : "";
    return `Component "${rawName}" not found in the registry (source: ${index.source}).${hint}\n\nUse vfx_search_components or vfx_list_components to discover names.`;
  }

  const detailResult = await getItem(name);
  const detail = detailResult?.item ?? null;
  const source = detailResult?.source ?? "registry index only";

  const sections: string[] = [];
  sections.push(`# ${summary.title ?? name} (${name})`);
  if (detail?.description ?? summary.description) {
    sections.push("", detail?.description ?? summary.description ?? "");
  }

  sections.push(
    "",
    `- Install: \`${installCommand(name)}\``,
    `- Categories: ${(summary.categories ?? []).join(", ") || "—"}`,
    `- Tags: ${(summary.tags ?? []).join(", ") || "—"}`,
  );
  if (detail?.dependencies?.length) {
    sections.push(`- npm dependencies: ${detail.dependencies.join(", ")}`);
  }
  if (detail?.registryDependencies?.length) {
    sections.push(`- registry dependencies: ${detail.registryDependencies.join(", ")}`);
  }
  sections.push(`- Agent docs: ${docsUrl(name)}`);

  const docsMd = await getDocsMarkdown(name);
  const usageImport = docsMd?.match(/^import\s*\{[^}]*\}\s*from\s*"@vfx-ui\/react";\s*$/m)?.[0];
  if (usageImport) {
    sections.push(`- npm package usage: \`${usageImport.replace(/\s+/g, " ").trim()}\` (requires \`npm install @vfx-ui/react\` plus any deps above)`);
  }
  const propsSection = docsMd ? extractPropsSection(docsMd) : null;
  sections.push("", "## Props");
  if (propsSection) {
    sections.push(propsSection);
  } else if (detail?.docs) {
    sections.push(detail.docs);
    sections.push("");
    sections.push(`(Props table unavailable — registry reachable? Full docs: ${docsUrl(name)})`);
  } else {
    sections.push(`(Props unavailable — full docs at ${docsUrl(name)})`);
  }

  const rows = fileRows(detail, summary);
  sections.push("", `## Files (${String(rows.length)})`);
  for (const row of rows) {
    if (typeof row.content === "string") {
      sections.push(
        `- ${row.path} (${row.type ?? "registry:component"}, ${String(row.content.length)} bytes, ~${String(countLines(row.content))} lines)`,
      );
    } else {
      sections.push(`- ${row.path} (${row.type ?? "registry:component"}, content not fetched)`);
    }
  }

  if (includeFiles) {
    const withContent = rows.filter((row) => typeof row.content === "string");
    if (withContent.length === 0) {
      sections.push(
        "",
        "## Source",
        "",
        "(Full source unavailable: the registry item could not be fetched. The install command above still works, or retry with a reachable VFX_REGISTRY_BASE.)",
      );
    } else {
      sections.push("", "## Source");
      for (const row of withContent) {
        const content = row.content ?? "";
        sections.push("", `### ${row.path}`, "", "```" + fenceLanguage(row.path), content, "```");
      }
    }
  }

  sections.push("", `(detail source: ${source})`);
  return sections.join("\n");
}

/** vfx_get_styles */
export function getStyles(): string {
  return STYLES_MARKDOWN;
}

/** vfx_design_notes */
export function getDesignNotes(): string {
  return DESIGN_NOTES_MARKDOWN;
}

export type { IndexResult };
