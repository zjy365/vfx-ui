import { Suspense, useEffect, useState } from "react";
import { BrandMark } from "./components/BrandMark";
import { BrowsePage } from "./components/BrowsePage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HomePage } from "./components/HomePage";
import { InstallationDocumentation } from "./components/InstallationDocumentation";
import { MainContentFooter } from "./components/MainContentFooter";
import { SearchDialog } from "./components/SearchDialog";
import { ShaderDocumentation } from "./components/ShaderDocumentation";
import { Sidebar } from "./components/Sidebar";
import { ThemeButtons } from "./components/ThemeButtons";
import { MenuIcon } from "./components/icons";
import type { ReadyShader } from "./data/registry";
import { getReadyShader, READY_SHADERS, VISIBLE_READY_SHADERS } from "./data/publicShaders";
import {
  browseCategoryRoutePath,
  browseTagRoutePath,
  navigationUrl,
  resolveAppRoute,
  shaderRoutePath,
  STATIC_ROUTE_PATHS,
} from "./routes.js";
import { applyRouteSeo } from "./seo.js";
import {
  THEME_STORAGE_KEY,
  applyAppearance,
  readStoredTheme,
  type ThemeMode,
} from "./theme";

type AppPage = "home" | "shader" | "browse" | "installation" | "not-found";

type RouteState = {
  active: ReadyShader;
  activeVariantId?: string;
  browseCategory?: ReadyShader["category"];
  browseTag?: string;
  routedVariantId?: string;
  page: AppPage;
  canonicalPath: string;
  legacy?: boolean;
};

type ResolvedRoute = {
  browseCategory?: ReadyShader["category"];
  browseTag?: string;
  page: AppPage | "not-found";
  canonicalPath: string;
  shader?: ReadyShader;
  variantId?: string;
  legacy?: boolean;
};

function routeStateFromUrl(): RouteState {
  const route = resolveAppRoute(window.location, READY_SHADERS) as ResolvedRoute;
  const active = route.page === "shader" && route.shader
    ? route.shader as ReadyShader
    : VISIBLE_READY_SHADERS[0];
  const routedVariantId = route.page === "shader" ? route.variantId : undefined;
  const activeVariantId = active?.variants?.find((variant) => variant.id === routedVariantId)?.id
    ?? active?.variants?.[0]?.id;

  return {
    active,
    activeVariantId,
    browseCategory: route.browseCategory,
    browseTag: route.browseTag,
    routedVariantId,
    page: route.page === "not-found" ? "not-found" : route.page,
    canonicalPath: route.canonicalPath,
    legacy: route.legacy,
  };
}

function captureFromUrl() {
  return new URLSearchParams(window.location.search).get("capture") === "preview";
}

function captureSchemeFromUrl() {
  return new URLSearchParams(window.location.search).get("scheme") === "light" ? "light" : "dark";
}

function capturePropsForShader(shader: ReadyShader, scheme: "light" | "dark", variant?: NonNullable<ReadyShader["variants"]>[number]) {
  const controls = variant?.controls ?? shader.controls ?? [];
  const props = Object.fromEntries(controls.map((control) => {
    if (control.kind === "choice" && control.key === "mode" && control.options.some((option) => option.value === scheme)) {
      return [control.key, scheme];
    }
    return [control.key, control.default];
  }));

  return props;
}

function ShaderCapturePage() {
  const route = routeStateFromUrl();
  const shader = route.active;
  const variant = shader?.variants?.find((item) => item.id === route.activeVariantId);
  const captureScheme = captureSchemeFromUrl();
  const captureProps = { ...variant?.props, ...capturePropsForShader(shader, captureScheme, variant) };
  const Preview = shader?.component;

  useEffect(() => {
    applyAppearance("dark");
    if (!shader) return;
    applyRouteSeo({
      page: "capture",
      shader,
      variant,
      canonicalPath: shaderRoutePath(shader, route.routedVariantId),
    });
  }, [route.routedVariantId, shader, variant]);

  if (!shader) return null;

  return (
    <main className="capture-shell" aria-label={`${shader.label} preview capture`}>
      <div className={`capture-preview shader-preview ${shader.id}`} data-variant={variant?.id}>
        <Suspense fallback={<div className="preview-loading" role="status">Loading renderer…</div>}>
          {Preview ? <Preview {...captureProps} /> : null}
        </Suspense>
        <span className="capture-ready" data-capture-ready={shader.id} aria-hidden="true" />
      </div>
    </main>
  );
}

function VfxUiApp() {
  const [routeState, setRouteState] = useState<RouteState>(() => routeStateFromUrl());
  const { active, activeVariantId, browseCategory, browseTag, routedVariantId, page, canonicalPath } = routeState;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<ThemeMode>(() => readStoredTheme());
  const seoVariant = active?.variants?.find((variant) => variant.id === routedVariantId);

  const openSearch = (query = "") => {
    setSearchQuery(query);
    setSearchOpen(true);
  };

  const selectShader = (id: ReadyShader["id"], variantId?: string) => {
    const requestedShader = getReadyShader(id);
    const shader = requestedShader;
    const requestedVariantId = variantId ?? undefined;
    const routedVariant = shader.variants?.find((item) => item.id === requestedVariantId);
    const renderedVariant = routedVariant ?? shader.variants?.[0];
    const path = shaderRoutePath(shader, renderedVariant?.id);
    setRouteState({
      active: shader,
      activeVariantId: renderedVariant?.id,
      routedVariantId: routedVariant?.id,
      page: "shader",
      canonicalPath: path,
    });
    setSearchOpen(false);
    setSidebarOpen(false);
    window.history.pushState({}, "", navigationUrl(path));
  };

  const selectVariant = (id: string) => {
    const variant = active?.variants?.find((item) => item.id === id);
    if (!active || !variant) return;
    const path = shaderRoutePath(active, variant.id);
    setRouteState({
      active,
      activeVariantId: variant.id,
      routedVariantId: variant.id,
      page: "shader",
      canonicalPath: path,
    });
    window.history.pushState({}, "", navigationUrl(path));
  };

  const selectInstallation = () => {
    setRouteState((current) => ({ ...current, page: "installation", canonicalPath: STATIC_ROUTE_PATHS.installation }));
    setSidebarOpen(false);
    window.history.pushState({}, "", navigationUrl(STATIC_ROUTE_PATHS.installation));
  };

  const selectBrowse = () => {
    setRouteState((current) => ({
      ...current,
      browseCategory: undefined,
      browseTag: undefined,
      page: "browse",
      canonicalPath: STATIC_ROUTE_PATHS.browse,
    }));
    setSidebarOpen(false);
    window.history.pushState({}, "", navigationUrl(STATIC_ROUTE_PATHS.browse));
  };

  const selectBrowseCategory = (category?: ReadyShader["category"]) => {
    const path = category ? browseCategoryRoutePath(category) : STATIC_ROUTE_PATHS.browse;
    setRouteState((current) => ({
      ...current,
      browseCategory: category,
      browseTag: undefined,
      page: "browse",
      canonicalPath: path,
    }));
    setSidebarOpen(false);
    window.history.pushState({}, "", navigationUrl(path));
  };

  const selectBrowseTag = (tag: string) => {
    const path = browseTagRoutePath(tag);
    setRouteState((current) => ({
      ...current,
      browseCategory: undefined,
      browseTag: tag,
      page: "browse",
      canonicalPath: path,
    }));
    setSearchOpen(false);
    setSidebarOpen(false);
    window.history.pushState({}, "", navigationUrl(path));
  };

  const selectFooterRoute = (path: string) => {
    window.history.pushState({}, "", navigationUrl(path));
    setRouteState(routeStateFromUrl());
    setSearchOpen(false);
    setSidebarOpen(false);
  };

  const selectTheme = (mode: ThemeMode) => {
    setTheme(mode);
    applyAppearance(mode);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch {
      // The selected theme still applies when storage is unavailable.
    }
  };

  const selectHome = () => {
    setRouteState((current) => ({
      ...current,
      browseCategory: undefined,
      browseTag: undefined,
      page: "home",
      canonicalPath: STATIC_ROUTE_PATHS.home,
    }));
    setSidebarOpen(false);
    window.history.pushState({}, "", navigationUrl(STATIC_ROUTE_PATHS.home));
  };

  useEffect(() => {
    applyRouteSeo({
      page,
      browseCategory: page === "browse" ? browseCategory : undefined,
      browseTag: page === "browse" ? browseTag : undefined,
      shader: page === "shader" ? active : undefined,
      variant: page === "shader" ? seoVariant : undefined,
      canonicalPath,
    }, VISIBLE_READY_SHADERS);
  }, [active, browseCategory, browseTag, canonicalPath, page, seoVariant]);

  useEffect(() => {
    if (!routeState.legacy && window.location.pathname === canonicalPath) return;
    window.history.replaceState({}, "", navigationUrl(canonicalPath));
  }, []);

  useEffect(() => {
    applyAppearance(theme);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSchemeChange = () => {
      if (theme === "system") applyAppearance("system", media.matches);
    };
    media.addEventListener("change", onSchemeChange);
    return () => media.removeEventListener("change", onSchemeChange);
  }, [theme]);

  useEffect(() => {
    document.querySelector<HTMLElement>(".pane-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
  }, [canonicalPath]);

  useEffect(() => {
    const onPopState = () => {
      setRouteState(routeStateFromUrl());
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchQuery("");
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setSidebarOpen(false);
      }
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (page === "home") {
    return (
      <>
        <ErrorBoundary>
          <HomePage
            theme={theme}
            onNavigate={selectFooterRoute}
            onSearch={() => openSearch()}
            onTheme={selectTheme}
          />
        </ErrorBoundary>
        <SearchDialog
          open={searchOpen}
          initialQuery={searchQuery}
          onClose={() => setSearchOpen(false)}
          onSelect={selectShader}
        />
      </>
    );
  }

  return (
    <>
      <header className="topbar">
        <button className="icon-btn" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}>
          <MenuIcon />
        </button>
        <button className="topbar-brand-button" aria-label="vfx-ui home" onClick={selectHome}>
          <BrandMark compact />
        </button>
        <div className="topbar-actions">
          <ThemeButtons compact mode={theme} onChange={selectTheme} />
        </div>
      </header>
      <div className="app">
        <Sidebar
          active={active}
          browseActive={page === "browse"}
          installationActive={page === "installation"}
          open={sidebarOpen}
          theme={theme}
          onSelect={selectShader}
          onHome={selectHome}
          onBrowse={selectBrowse}
          onInstallation={selectInstallation}
          onSearch={() => openSearch()}
          onTheme={selectTheme}
        />
        {sidebarOpen && <button className="mobile-nav-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
        <div className="pane">
          <div className="pane-scroll scroll-area">
            {page === "browse" ? (
              <ErrorBoundary>
                <BrowsePage
                  activeCategory={browseCategory}
                  activeTag={browseTag}
                  onCategorySelect={selectBrowseCategory}
                  onSelect={selectShader}
                  onTagSelect={selectBrowseTag}
                />
              </ErrorBoundary>
            ) : page === "installation" ? (
              <InstallationDocumentation onSelect={selectShader} />
            ) : page === "not-found" ? (
              <main className="browse-page" aria-labelledby="not-found-title">
                <header className="browse-header">
                  <h1 id="not-found-title">Page not found</h1>
                  <p className="lede">This vfx-ui URL does not match a component, variant, or documentation page.</p>
                  <a href={STATIC_ROUTE_PATHS.browse} onClick={(event) => {
                    event.preventDefault();
                    selectBrowse();
                  }}>Browse all components</a>
                </header>
              </main>
            ) : active ? (
              <ErrorBoundary key={active.id}>
                <ShaderDocumentation
                  shader={active}
                  activeVariantId={activeVariantId}
                  onSearchTag={openSearch}
                  onSelect={selectShader}
                  onVariantSelect={selectVariant}
                />
              </ErrorBoundary>
            ) : null}
            <MainContentFooter onNavigate={selectFooterRoute} />
          </div>
        </div>
      </div>
      <SearchDialog
        open={searchOpen}
        initialQuery={searchQuery}
        onClose={() => setSearchOpen(false)}
        onSelect={selectShader}
      />
    </>
  );
}

export default function App() {
  return captureFromUrl() ? <ShaderCapturePage /> : <VfxUiApp />;
}
