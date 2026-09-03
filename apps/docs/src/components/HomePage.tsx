import { Suspense, lazy, useEffect, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { HeroShell } from "@vfx-ui/react";
import { VISIBLE_READY_SHADERS, READY_SHADER_COLLECTION_COUNT } from "../data/publicShaders";
import { shaderRoutePath, STATIC_ROUTE_PATHS } from "../routes.js";
import { BrandMark } from "./BrandMark";
import { ThemeButtons } from "./ThemeButtons";
import { CheckIcon, CopyIcon, GitHubIcon, SearchIcon } from "./icons";
import type { ThemeMode } from "../theme";
import "./home.css";

const AuroraBg = lazy(() => import("@vfx-ui/react").then((m) => ({ default: m.Aurora })));
const LiquidGlassBg = lazy(() => import("@vfx-ui/react").then((m) => ({ default: m.LiquidGlass })));
const BlackHoleBg = lazy(() => import("@vfx-ui/react").then((m) => ({ default: m.BlackHole })));
const ChromaFlowBg = lazy(() => import("@vfx-ui/react").then((m) => ({ default: m.ChromaFlow })));

const HERO_BACKGROUNDS = [
  { id: "aurora", label: "Aurora", component: "Aurora", render: () => <AuroraBg bands={4} primary="#2dd4bf" secondary="#818cf8" /> },
  { id: "liquid-glass", label: "Liquid Glass", component: "LiquidGlass", render: () => <LiquidGlassBg /> },
  { id: "black-hole", label: "Black Hole", component: "BlackHole", render: () => <BlackHoleBg /> },
  { id: "chroma-flow", label: "Chroma Flow", component: "ChromaFlow", render: () => <ChromaFlowBg /> },
] as const;

type HeroBackgroundId = (typeof HERO_BACKGROUNDS)[number]["id"];

const SHOWCASE_IDS = [
  "aurora",
  "liquid-glass",
  "black-hole",
  "chroma-flow",
  "web-globe",
  "iridescent",
  "fluid-gradient",
  "energy-orb",
  "live-chart",
  "glass-lens",
  "starfield",
  "wave-background",
  "vortex",
  "fiber-flow",
  "mesh-gradient",
  "particle-field",
  "ribbon-field",
  "light-prism",
  "glass-card",
] as const;

const FEATURES = [
  {
    title: "WebGPU-native",
    body: "Every component renders per-pixel on the GPU through vgpu — dot-matrix globes, volumetric smoke, liquid refraction. Effects DOM and CSS literally cannot produce.",
    meta: "WGSL shaders · zero canvas hacks",
  },
  {
    title: "Deterministically tested",
    body: "Each component ships with pixel-level render tests that run with or without a GPU — Dawn in CI, mock adapter locally. A shader that stops animating fails the build.",
    meta: "Pixel-diff gates · Dawn + mock",
  },
  {
    title: "Agentic-first",
    body: "llms.txt, per-component markdown docs, and a shadcn-style registry your AI agent can install from directly. Copy a prompt, or let the agent do it.",
    meta: "llms.txt · registry · SKILL.md",
  },
] as const;

const INSTALL_SNIPPET = "npm install @vfx-ui/react vgpu";
const USAGE_SNIPPET = `import { Aurora } from "@vfx-ui/react";

export function Landing() {
  return (
    <Aurora bands={4} primary="#2dd4bf" secondary="#818cf8" />
  );
}`;

type HomePageProps = {
  theme: ThemeMode;
  onNavigate: (path: string) => void;
  onSearch: () => void;
  onTheme: (mode: ThemeMode) => void;
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={`home-copy-btn${copied ? " copied" : ""}`}
      aria-label={label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          // Clipboard unavailable; the snippet stays selectable.
        }
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

export function HomePage({ theme, onNavigate, onSearch, onTheme }: HomePageProps) {
  const [heroBg, setHeroBg] = useState<HeroBackgroundId>("aurora");
  const activeBackground = HERO_BACKGROUNDS.find((item) => item.id === heroBg) ?? HERO_BACKGROUNDS[0];

  const showcaseItems = SHOWCASE_IDS
    .map((id) => VISIBLE_READY_SHADERS.find((shader) => shader.id === id))
    .filter((shader): shader is NonNullable<typeof shader> => Boolean(shader));

  // SPA navigation for every in-page anchor; external links pass through.
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as HTMLElement).closest("a[href]");
    const href = anchor?.getAttribute("href");
    if (!anchor || !href?.startsWith("/")) return;
    event.preventDefault();
    onNavigate(href);
  };

  const marqueeRow = (ariaHidden: boolean): ReactNode => (
    <div className="home-marquee-track" aria-hidden={ariaHidden || undefined}>
      {showcaseItems.map((shader) => (
        <a className="home-marquee-card" href={shaderRoutePath(shader)} key={shader.id} tabIndex={ariaHidden ? -1 : undefined}>
          <img src={`/showcase/${shader.id}.png`} alt="" width="512" height="512" loading="lazy" decoding="async" />
          <span className="home-marquee-label">
            <strong>{shader.label}</strong>
            <span>{shader.category}</span>
          </span>
        </a>
      ))}
    </div>
  );

  return (
    <div className="home-page" onClick={onClick}>
      <header className="home-nav">
        <a className="home-nav-brand" href="/" aria-label="vfx-ui home">
          <BrandMark />
        </a>
        <nav className="home-nav-links" aria-label="Site">
          <a href={STATIC_ROUTE_PATHS.browse}>Components</a>
          <a href={STATIC_ROUTE_PATHS.installation}>Installation</a>
          <a href="/llms.txt">llms.txt</a>
          <a href="https://github.com/zjy365/vfx-ui" target="_blank" rel="noreferrer" aria-label="GitHub repository">
            <GitHubIcon />
          </a>
        </nav>
        <div className="home-nav-actions">
          <button type="button" className="home-search-btn" onClick={onSearch} aria-label="Search components">
            <SearchIcon />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
          <ThemeButtons compact mode={theme} onChange={onTheme} />
        </div>
      </header>

      <section className="home-hero" aria-label="vfx-ui hero">
        <HeroShell
          key={activeBackground.id}
          layout="centered"
          scheme="dark"
          eyebrow="WebGPU component library"
          title={"Shaders you can\ndrop into React."}
          subtitle="Auroras, liquid glass, dot-matrix globes, live GPU charts — shader-native components rendered per-pixel on the GPU. One import, no WebGL boilerplate, MIT."
          primaryCta={{ label: "Browse components", href: STATIC_ROUTE_PATHS.browse }}
          secondaryCta={{ label: "npm i @vfx-ui/react", href: STATIC_ROUTE_PATHS.installation }}
          badges={["WebGPU", "TypeScript", "MIT", "Agentic-first"]}
          accent="#2dd4bf"
          background={(
            <Suspense fallback={null}>
              {activeBackground.render()}
            </Suspense>
          )}
          style={{ "--hero-min-height": "min(calc(100svh - 65px), 900px)" } as CSSProperties}
        />
        <div className="home-hero-switcher" role="group" aria-label="Change hero background">
          <span className="home-hero-switcher-note">
            Live WebGPU — rendered by <code>{`<${activeBackground.component} />`}</code>
          </span>
          <div className="home-hero-switcher-pills">
            {HERO_BACKGROUNDS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={item.id === heroBg}
                onClick={() => setHeroBg(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-showcase" aria-labelledby="home-showcase-title">
        <div className="home-section-head">
          <p className="home-eyebrow">The catalog</p>
          <h2 id="home-showcase-title">{READY_SHADER_COLLECTION_COUNT} drops, all GPU-rendered</h2>
          <p className="home-section-lede">
            Shader backgrounds, glass surfaces, globes, data visuals, and twelve ship-ready hero sections.
            Every card below is a real render from the deterministic test suite.
          </p>
        </div>
        <div className="home-marquee">
          <div className="home-marquee-row">
            {marqueeRow(false)}
            {marqueeRow(true)}
          </div>
        </div>
        <div className="home-showcase-more">
          <a className="home-text-link" href={STATIC_ROUTE_PATHS.browse}>
            Browse the full catalog →
          </a>
        </div>
      </section>

      <section className="home-section" aria-labelledby="home-features-title">
        <div className="home-section-head">
          <p className="home-eyebrow">Why vfx-ui</p>
          <h2 id="home-features-title">A component library the GPU deserves</h2>
        </div>
        <div className="home-features">
          {FEATURES.map((feature) => (
            <article className="home-feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
              <span className="home-feature-meta">{feature.meta}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="home-code-title">
        <div className="home-section-head">
          <p className="home-eyebrow">Quick start</p>
          <h2 id="home-code-title">Three lines to the GPU</h2>
        </div>
        <div className="home-code-grid">
          <div className="home-code-card">
            <div className="home-code-head">
              <span>Install</span>
              <CopyButton text={INSTALL_SNIPPET} label="Copy install command" />
            </div>
            <pre><code>{INSTALL_SNIPPET}</code></pre>
          </div>
          <div className="home-code-card">
            <div className="home-code-head">
              <span>Render</span>
              <CopyButton text={USAGE_SNIPPET} label="Copy usage example" />
            </div>
            <pre><code>{USAGE_SNIPPET}</code></pre>
          </div>
        </div>
      </section>

      <section className="home-section home-cta" aria-labelledby="home-cta-title">
        <h2 id="home-cta-title">Ship a hero section tonight.</h2>
        <p className="home-section-lede">
          Twelve drop-in heroes — including the one at the top of this page. Copy the code, or hand your agent the prompt.
        </p>
        <div className="home-cta-actions">
          <a className="home-btn home-btn--primary" href={STATIC_ROUTE_PATHS.browse}>Browse components</a>
          <a className="home-btn home-btn--ghost" href="https://github.com/zjy365/vfx-ui" target="_blank" rel="noreferrer">
            <GitHubIcon /> Star on GitHub
          </a>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-footer-brand">
          <BrandMark />
          <p>
            This page is built with vfx-ui — the hero above is <code>{`<${activeBackground.component} />`}</code> inside{" "}
            <code>{"<HeroShell />"}</code>. MIT licensed.
          </p>
        </div>
        <nav className="home-footer-links" aria-label="Footer">
          <a href={STATIC_ROUTE_PATHS.browse}>Components</a>
          <a href={STATIC_ROUTE_PATHS.installation}>Installation</a>
          <a href="/llms.txt">llms.txt</a>
          <a href="/agents.md">agents.md</a>
          <a href="https://github.com/zjy365/vfx-ui" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </footer>
    </div>
  );
}
