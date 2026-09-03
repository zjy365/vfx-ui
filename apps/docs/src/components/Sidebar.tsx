import { Suspense, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import type { ReadyShader, ReadyShaderCategory } from "../data/registry";
import { READY_SHADER_CATEGORIES } from "../data/registry";
import { COMMUNITY_NEWEST_SHADER_IDS } from "../data/communityOrder";
import { VISIBLE_READY_SHADERS } from "../data/publicShaders";
import { BrandMark } from "./BrandMark";
import { ChevronIcon, MaximizeIcon, SearchIcon } from "./icons";
import { ThemeButtons } from "./ThemeButtons";
import type { ThemeMode } from "../theme";

type SidebarProps = {
  active?: ReadyShader;
  browseActive: boolean;
  installationActive: boolean;
  open: boolean;
  theme: ThemeMode;
  onSelect: (id: ReadyShader["id"]) => void;
  onHome: () => void;
  onBrowse: () => void;
  onInstallation: () => void;
  onSearch: () => void;
  onTheme: (mode: ThemeMode) => void;
};

type SidebarCatalogSectionProps = Pick<SidebarProps, "active" | "installationActive" | "onSelect"> & {
  label: string;
  shaders: readonly ReadyShader[];
  onPreview: (shader: ReadyShader, target: HTMLButtonElement) => void;
  onPreviewEnd: () => void;
};

type SidebarPreview = {
  shader: ReadyShader;
  thumbnail: string;
  top: number;
  left: number;
};

function getSidebarPreviewThumbnail(shader: ReadyShader) {
  // Heroes render as stills in the tooltip (no live mini render) — show the
  // real Dawn render, not the first variant's flat palette gradient.
  if (shader.category === "Heroes") return shader.thumbnail;
  return shader.variants?.[0]?.thumbnail ?? shader.thumbnail;
}

const NEWEST_SHADER_RANK = new Map<ReadyShader["id"], number>(
  COMMUNITY_NEWEST_SHADER_IDS.map((id, index) => [id, index]),
);

function orderNewestFirst(shaders: readonly ReadyShader[]) {
  return shaders
    .map((shader, index) => ({ shader, index }))
    .sort((a, b) => (
      (NEWEST_SHADER_RANK.get(a.shader.id) ?? Number.MAX_SAFE_INTEGER)
      - (NEWEST_SHADER_RANK.get(b.shader.id) ?? Number.MAX_SAFE_INTEGER)
      || a.index - b.index
    ))
    .map(({ shader }) => shader);
}

const NEWEST_SHADER_ID_SET = new Set<ReadyShader["id"]>(COMMUNITY_NEWEST_SHADER_IDS);
export const RECENT_SHADERS = orderNewestFirst(VISIBLE_READY_SHADERS).filter((shader) => NEWEST_SHADER_ID_SET.has(shader.id));

const COMMUNITY_SHADERS = orderNewestFirst(VISIBLE_READY_SHADERS);

function SidebarCatalogSection({ label, shaders, active, installationActive, onSelect, onPreview, onPreviewEnd }: SidebarCatalogSectionProps) {
  const [expanded, setExpanded] = useState(true);
  const [openCategories, setOpenCategories] = useState<Set<ReadyShaderCategory>>(
    () => new Set(READY_SHADER_CATEGORIES),
  );
  const categories = READY_SHADER_CATEGORIES.filter((category) => (
    shaders.some((shader) => shader.category === category)
  ));

  return (
    <div className="nav-section">
      <h2 className="nav-label">
        <button
          className="nav-section-toggle"
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          <span>{label}</span>
          <MaximizeIcon className="maximize-icon" />
        </button>
      </h2>
      <div className={`nav-children${expanded ? " is-open" : ""}`}>
        <div>
          {categories.map((category) => {
            const categoryExpanded = openCategories.has(category);
            return (
              <div className="nav-block" key={category}>
                <button
                  className="nav-group"
                  aria-expanded={categoryExpanded}
                  onClick={() => setOpenCategories((current) => {
                    const next = new Set(current);
                    if (next.has(category)) next.delete(category);
                    else next.add(category);
                    return next;
                  })}
                >
                  {category}
                  <ChevronIcon className="chev" />
                </button>
                <div className={`nav-children${categoryExpanded ? " is-open" : ""}`}>
                  <div>
                    <div className="nav-list">
                      {shaders.filter((shader) => shader.category === category).map((shader) => (
                        <button
                          className={`nav-link${!installationActive && active?.id === shader.id ? " active" : ""}`}
                          key={shader.id}
                          aria-current={!installationActive && active?.id === shader.id ? "page" : undefined}
                          onPointerEnter={(event) => onPreview(shader, event.currentTarget)}
                          onPointerLeave={onPreviewEnd}
                          onFocus={(event) => onPreview(shader, event.currentTarget)}
                          onBlur={onPreviewEnd}
                          onClick={() => {
                            onPreviewEnd();
                            onSelect(shader.id);
                          }}
                        >
                          <span>{shader.label}</span>
                          <span className="nav-link-badges">
                            {shader.variants && shader.variants.length > 1 ? (
                              <span
                                className="variant-count"
                                aria-label={`${shader.variants.length} variants`}
                                title={`${shader.variants.length} variants`}
                              >
                                {shader.variants.length}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ active, browseActive, installationActive, open, theme, onSelect, onHome, onBrowse, onInstallation, onSearch, onTheme }: SidebarProps) {
  const [preview, setPreview] = useState<SidebarPreview | null>(null);
  const Preview = preview?.shader.component;

  const showPreview = (shader: ReadyShader, target: HTMLButtonElement) => {
    const bounds = target.getBoundingClientRect();
    const width = 240;
    const height = 135;
    const viewportPadding = 12;
    const top = Math.min(
      window.innerHeight - height - viewportPadding,
      Math.max(viewportPadding, bounds.top + bounds.height / 2 - height / 2),
    );
    const left = Math.min(window.innerWidth - width - viewportPadding, bounds.right + 12);
    setPreview({ shader, thumbnail: getSidebarPreviewThumbnail(shader), top, left });
  };

  return (
    <aside className={`sidebar${open ? " open" : ""}`} id="sidebar">
      <div className="sb-head">
        <div className="sb-brand-row">
          <button className="brand-button" aria-label="vfx-ui home" onClick={onHome}>
            <BrandMark />
          </button>
        </div>
        <button className="search inset-shadow" onClick={onSearch}>
          <SearchIcon style={{ opacity: 0.7 }} />
          <span className="ph">Search...</span>
          <kbd>⌘ K</kbd>
        </button>
      </div>
      <div className="sb-scroll scroll-area" onScroll={() => setPreview(null)}>
        <nav className="sb-nav" aria-label="vfx-ui documentation">
          <div className="nav-section">
            <h2 className="nav-label">Documentation</h2>
            <div className="nav-list nav-list-root">
              <button
                className={`nav-link${browseActive ? " active" : ""}`}
                aria-current={browseActive ? "page" : undefined}
                onClick={onBrowse}
              >
                <span>Browse</span>
              </button>
              <button
                className={`nav-link${installationActive ? " active" : ""}`}
                aria-current={installationActive ? "page" : undefined}
                onClick={onInstallation}
              >
                <span>Installation</span>
              </button>
            </div>
          </div>
          <SidebarCatalogSection
            label="Components"
            shaders={COMMUNITY_SHADERS}
            active={active}
            installationActive={installationActive || browseActive}
            onSelect={onSelect}
            onPreview={showPreview}
            onPreviewEnd={() => setPreview(null)}
          />
        </nav>
      </div>
      <div className="sb-foot">
        <ThemeButtons mode={theme} onChange={onTheme} />
      </div>
      {preview && typeof document !== "undefined" ? createPortal(
        <div
          className="sidebar-preview-tooltip"
          style={{ "--sidebar-preview-top": `${preview.top}px`, "--sidebar-preview-left": `${preview.left}px` } as CSSProperties}
          aria-hidden="true"
        >
          <img src={preview.thumbnail} alt="" />
          {/* Heroes are full-page layouts — miniaturized into a 240px card
              their copy overflows and reads broken, so they show the still. */}
          {preview.shader.component && preview.shader.category !== "Heroes" ? (
            <Suspense fallback={null}>
              <span className="sidebar-preview-live" style={{ "--hero-min-height": "0px" } as CSSProperties}>
                <preview.shader.component {...(preview.shader.variants?.[0]?.props ?? {})} />
              </span>
            </Suspense>
          ) : null}
        </div>,
        document.body,
      ) : null}
    </aside>
  );
}
