import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** Where the bundled fallback snapshot lives, relative to the compiled file. */
const SNAPSHOT_URL = new URL("./data/registry.snapshot.json", import.meta.url);

export interface RegistryFileRef {
  path: string;
  type?: string;
}

export interface RegistryItemSummary {
  name: string;
  title?: string;
  type?: string;
  description?: string;
  categories?: string[];
  tags?: string[];
  files?: RegistryFileRef[];
}

export interface RegistryFile extends RegistryFileRef {
  content?: string;
  target?: string;
}

export interface RegistryItemDetail extends RegistryItemSummary {
  registryDependencies?: string[];
  dependencies?: string[];
  docs?: string;
  files?: RegistryFile[];
}

interface RegistryIndexFile {
  name?: string;
  homepage?: string;
  items?: RegistryItemSummary[];
}

export type DataSource = "live" | "bundled-snapshot";

export interface IndexResult {
  items: RegistryItemSummary[];
  source: DataSource;
  base: string;
  fetchedAt: string;
}

export interface DetailResult {
  item: RegistryItemDetail;
  source: DataSource;
}

const DEFAULT_BASE = "https://vfx-ui.com/r/";
const INDEX_TTL_MS = 5 * 60 * 1000;
const INDEX_FALLBACK_TTL_MS = 30 * 1000;
const ITEM_TTL_MS = 5 * 60 * 1000;
const ITEM_CACHE_MAX = 64;
const REQUEST_TIMEOUT_MS = 10_000;

/** Base URL of the registry index/items. Override with VFX_REGISTRY_BASE. */
export function registryBase(): string {
  const raw = process.env.VFX_REGISTRY_BASE?.trim();
  if (!raw) return DEFAULT_BASE;
  return raw.endsWith("/") ? raw : `${raw}/`;
}

export function itemUrl(name: string): string {
  return `${registryBase()}${name}.json`;
}

/** Best-effort base for the agents.md-style component docs (`<name>.md`). */
export function docsBaseUrl(): string {
  const base = registryBase();
  if (/\/r\/$/.test(base)) {
    return `${base.slice(0, -2)}components/`;
  }
  return base;
}

export function docsUrl(name: string): string {
  return `${docsBaseUrl()}${name}.md`;
}

export function installCommand(name: string): string {
  return `npx shadcn@latest add ${itemUrl(name)}`;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { accept: "application/json, text/markdown, */*" },
    redirect: "follow",
  });
  if (!response.ok) {
    throw new Error(`GET ${url} -> HTTP ${String(response.status)}`);
  }
  return await response.text();
}

async function fetchJson<T>(url: string): Promise<T> {
  const text = await fetchText(url);
  return JSON.parse(text) as T;
}

function warn(message: string): void {
  process.stderr.write(`[vfx-ui-mcp] ${message}\n`);
}

function readSnapshot(): RegistryItemSummary[] {
  try {
    const parsed = JSON.parse(
      readFileSync(fileURLToPath(SNAPSHOT_URL), "utf8"),
    ) as RegistryIndexFile;
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch (error) {
    warn(`bundled snapshot unreadable: ${String(error)}`);
    return [];
  }
}

interface CachedIndex {
  result: IndexResult;
  expires: number;
}

let cachedIndex: CachedIndex | null = null;

/**
 * Load the registry index. Tries `<base>registry.json` at runtime and falls
 * back to the snapshot bundled inside the package when the fetch fails.
 */
export async function getIndex(): Promise<IndexResult> {
  const now = Date.now();
  if (cachedIndex && cachedIndex.expires > now) {
    return cachedIndex.result;
  }
  try {
    const raw = await fetchJson<RegistryIndexFile>(`${registryBase()}registry.json`);
    const items = Array.isArray(raw?.items) ? raw.items : [];
    if (items.length === 0) {
      throw new Error("registry index contained no items");
    }
    const result: IndexResult = {
      items,
      source: "live",
      base: registryBase(),
      fetchedAt: new Date().toISOString(),
    };
    cachedIndex = { result, expires: now + INDEX_TTL_MS };
    return result;
  } catch (error) {
    warn(`registry fetch failed, using bundled snapshot: ${String(error)}`);
    const result: IndexResult = {
      items: readSnapshot(),
      source: "bundled-snapshot",
      base: registryBase(),
      fetchedAt: new Date().toISOString(),
    };
    // Short TTL so a recovering network is picked up quickly.
    cachedIndex = { result, expires: now + INDEX_FALLBACK_TTL_MS };
    return result;
  }
}

interface CachedItem {
  detail: DetailResult;
  expires: number;
}

const itemCache = new Map<string, CachedItem>();

function cacheItem(url: string, detail: DetailResult, ttl: number): void {
  itemCache.set(url, { detail, expires: Date.now() + ttl });
  while (itemCache.size > ITEM_CACHE_MAX) {
    const oldest = itemCache.keys().next();
    if (oldest.done === true) break;
    itemCache.delete(oldest.value);
  }
}

/** Load one registry item (`<base><name>.json`). Returns null when unreachable. */
export async function getItem(name: string): Promise<DetailResult | null> {
  const url = itemUrl(name);
  const hit = itemCache.get(url);
  if (hit && hit.expires > Date.now()) {
    return hit.detail;
  }
  try {
    const item = await fetchJson<RegistryItemDetail>(url);
    if (!item || typeof item.name !== "string") {
      throw new Error(`item payload at ${url} has no name`);
    }
    const detail: DetailResult = { item, source: "live" };
    cacheItem(url, detail, ITEM_TTL_MS);
    return detail;
  } catch (error) {
    warn(`item fetch failed for ${name}: ${String(error)}`);
    return null;
  }
}

/** Load the agents.md-style docs page for a component. Returns null when unreachable. */
export async function getDocsMarkdown(name: string): Promise<string | null> {
  try {
    return await fetchText(docsUrl(name));
  } catch (error) {
    warn(`docs fetch failed for ${name}: ${String(error)}`);
    return null;
  }
}
