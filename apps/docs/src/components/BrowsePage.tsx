import { Suspense, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  CATALOG_RESULTS,
  catalogResultId,
  catalogResultLabel,
  catalogResultMatchesQuery,
  createCatalogResults,
} from "../data/catalogResults";
import type { ReadyShader } from "../data/registry";
import { READY_SHADERS } from "../data/publicShaders";
import { sortCatalogResultsByPopularity } from "../catalogPresentation.js";
import { BROWSE_CATEGORIES, browseRouteContent } from "../browseTaxonomy.js";
import {
  browseCategoryRoutePath,
  browseTagRoutePath,
  shaderRoutePath,
  STATIC_ROUTE_PATHS,
} from "../routes.js";
import { RECENT_SHADERS } from "./Sidebar";
import "./browse-sort-toggle.css";
import { SearchIcon } from "./icons";

type BrowsePageProps = {
  activeCategory?: ReadyShader["category"];
  activeTag?: string;
  onCategorySelect: (category?: ReadyShader["category"]) => void;
  onSelect: (id: ReadyShader["id"], variantId?: string) => void;
  onTagSelect: (tag: string) => void;
};

const MAX_VISIBLE_TAGS = 3;

const BROWSE_SORT_MODES = [
  { id: "popular", label: "Popular" },
  { id: "recent", label: "Recent" },
] as const;

type BrowseSortMode = (typeof BROWSE_SORT_MODES)[number]["id"];

// Ordering seed for the "Popular" sort. Additional ids slot in as components ship.
const POPULAR_SHADER_IDS = [
  "wave-background",
] as const;
const POPULARITY = Object.fromEntries(POPULAR_SHADER_IDS.map((id, index) => [
  id,
  { views: POPULAR_SHADER_IDS.length - index, copies: 0 },
]));

export const SITE_TITLE = "Shader effect components for React";
export const SITE_DESCRIPTION = "Fully customizable. Copyable as prompts.";

const RECENT_SHADER_IDS = new Set<ReadyShader["id"]>(RECENT_SHADERS.map((shader) => shader.id));
const BROWSE_RESULTS = [
  ...createCatalogResults(RECENT_SHADERS),
  ...CATALOG_RESULTS.filter(({ shader }) => !RECENT_SHADER_IDS.has(shader.id)),
];

const COMING_SOON_SHADERS = READY_SHADERS.filter((shader) => !shader.visible);

function useInView(rootMargin = "256px 0px") {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) setInView(entry.isIntersecting);
    }, { rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

type LivePreviewProps = {
  shader: ReadyShader;
  props: Readonly<Record<string, boolean | number | string | number[]>>;
  thumbnail: string;
};

// Small live instance of the component. Mounts on viewport entry and unmounts
// on exit so a large grid never keeps dozens of WebGPU renderers alive.
function LivePreview({ shader, props, thumbnail }: LivePreviewProps) {
  const { ref, inView } = useInView();
  const Preview = shader.component;

  return (
    <span className="browse-media" aria-hidden="true" style={{ pointerEvents: "none" }}>
      {inView && Preview ? (
        <Suspense fallback={<img src={thumbnail} alt="" width="640" height="360" decoding="async" />}>
          <Preview {...props} />
        </Suspense>
      ) : (
        <img src={thumbnail} alt="" width="640" height="360" loading="lazy" decoding="async" />
      )}
    </span>
  );
}

export function BrowsePage({ activeCategory, activeTag, onCategorySelect, onSelect, onTagSelect }: BrowsePageProps) {
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<BrowseSortMode>("popular");
  const visibleBrowseResults = useMemo(
    () => sortMode === "recent"
      ? BROWSE_RESULTS
      : sortCatalogResultsByPopularity(BROWSE_RESULTS, POPULARITY),
    [sortMode],
  );
  const filteredResults = useMemo(
    () => visibleBrowseResults.filter((result) => (
      (!activeCategory || result.shader.category === activeCategory)
      && (!activeTag || result.shader.tags.includes(activeTag))
      && catalogResultMatchesQuery(result, query)
    )),
    [activeCategory, activeTag, query, visibleBrowseResults],
  );
  const filteredComingSoon = useMemo(
    () => COMING_SOON_SHADERS.filter((shader) => (
      (!activeCategory || shader.category === activeCategory)
      && (!activeTag || shader.tags.includes(activeTag))
      && catalogResultMatchesQuery({ shader }, query)
    )),
    [activeCategory, activeTag, query],
  );
  const routeResultCount = BROWSE_RESULTS.filter(({ shader }) => (
    (!activeCategory || shader.category === activeCategory)
    && (!activeTag || shader.tags.includes(activeTag))
  )).length;
  const pageContent = browseRouteContent({ browseCategory: activeCategory, browseTag: activeTag }, routeResultCount);

  return (
    <main className="browse-page" aria-labelledby="browse-title">
      <header className="browse-header">
        <div className="browse-heading-row">
          <div>
            <h1 id="browse-title">{pageContent.heading}</h1>
            <p className="lede">{pageContent.description}</p>
            {activeTag ? (
              <a
                className="browse-active-filter"
                href={STATIC_ROUTE_PATHS.browse}
                onClick={(event) => {
                  event.preventDefault();
                  onCategorySelect();
                }}
              >
                Tagged {activeTag} <span aria-hidden="true">×</span>
              </a>
            ) : null}
          </div>
        </div>
        <div className="browse-controls-row">
          <div className="browse-category-filters" role="group" aria-label="Filter components by category">
            {(BROWSE_CATEGORIES as readonly ReadyShader["category"][]).map((category) => {
              const isActive = activeCategory === category;
              const href = isActive ? STATIC_ROUTE_PATHS.browse : browseCategoryRoutePath(category);
              return (
                <a
                  key={category}
                  aria-current={isActive ? "page" : undefined}
                  href={href}
                  title={isActive ? "Show all categories" : `Filter by ${category}`}
                  onClick={(event) => {
                    event.preventDefault();
                    onCategorySelect(isActive ? undefined : category);
                  }}
                >
                  {category}
                </a>
              );
            })}
          </div>
          <div className="browse-search-controls">
            <label className="browse-filter">
              <SearchIcon />
              <input
                type="search"
                value={query}
                placeholder={`Search ${routeResultCount} components`}
                aria-label={`Search ${routeResultCount} components`}
                autoComplete="off"
                spellCheck={false}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <div className="browse-sort-toggle" role="group" aria-label="Sort components">
              {BROWSE_SORT_MODES.map((mode) => (
                <button
                  type="button"
                  key={mode.id}
                  aria-pressed={sortMode === mode.id}
                  onClick={() => setSortMode(mode.id)}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {filteredResults.length ? (
        <div className="browse-grid">
          {filteredResults.map(({ shader, variant }, index) => {
            const result = { shader, variant };
            const resultId = catalogResultId(result);
            const label = catalogResultLabel(result);
            const thumbnail = variant?.thumbnail ?? shader.thumbnail;
            const variantProps = variant?.props ?? {};
            return (
              <article className="browse-item" key={resultId} style={{ "--browse-index": index } as CSSProperties}>
                <a
                  className="browse-item-link"
                  href={shaderRoutePath(shader, variant?.id)}
                  aria-label={`${label}. ${shader.tags.slice(0, MAX_VISIBLE_TAGS).join(", ")}. WebGPU component.`}
                  onClick={(event) => {
                    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    onSelect(shader.id, variant?.id);
                  }}
                >
                  <LivePreview shader={shader} props={variantProps} thumbnail={thumbnail} />
                  <span className="browse-details">
                    <span className="browse-title-row">
                      <strong>{label}</strong>
                    </span>
                  </span>
                </a>
                <nav className="browse-tags" aria-label={`${label} tags`}>
                  {shader.tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
                    <a
                      href={browseTagRoutePath(tag)}
                      key={tag}
                      onClick={(event) => {
                        event.preventDefault();
                        onTagSelect(tag);
                      }}
                    >
                      {tag}
                    </a>
                  ))}
                </nav>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="browse-empty" role="status">
          <strong>{query ? `No components match “${query}”.` : "No components match this category."}</strong>
          <span>Try another title, tag, category, or technology.</span>
        </div>
      )}

      {filteredComingSoon.length ? (
        <section className="browse-coming-soon" aria-labelledby="coming-soon-title">
          <h2 id="coming-soon-title">Coming soon</h2>
          <div className="browse-grid">
            {filteredComingSoon.map((shader, index) => (
              <article className="browse-item is-coming-soon" key={shader.id} style={{ "--browse-index": index } as CSSProperties}>
                <span className="browse-item-link" aria-disabled="true">
                  <span className="browse-media" aria-hidden="true">
                    <img src={shader.thumbnail} alt="" width="640" height="360" loading="lazy" decoding="async" />
                    <span className="coming-soon-badge">Coming soon</span>
                  </span>
                  <span className="browse-details">
                    <span className="browse-title-row">
                      <strong>{shader.label}</strong>
                      <span className="coming-soon-note">{shader.category}</span>
                    </span>
                  </span>
                </span>
                <p className="coming-soon-description">{shader.description}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
