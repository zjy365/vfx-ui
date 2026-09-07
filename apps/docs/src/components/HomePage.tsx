import { FooterCollection } from "./FooterCollection";
import {
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { HeroShell, KineticText, Magnetic, SpectralCard } from "@vfx-ui/react";
import { VISIBLE_READY_SHADERS } from "../data/publicShaders";
import { shaderRoutePath, STATIC_ROUTE_PATHS } from "../routes.js";
import { BrandMark } from "./BrandMark";
import { ThemeButtons } from "./ThemeButtons";
import { CheckIcon, CopyIcon, GitHubIcon, SearchIcon } from "./icons";
import type { ThemeMode } from "../theme";
import "./home.css";

const BlackHole = lazy(() =>
  import("@vfx-ui/react").then((m) => ({ default: m.BlackHole })),
);
const Aurora = lazy(() =>
  import("@vfx-ui/react").then((m) => ({ default: m.Aurora })),
);
const ChromaFlow = lazy(() =>
  import("@vfx-ui/react").then((m) => ({ default: m.ChromaFlow })),
);
const ARTWORKS = [
  {
    id: "black-hole",
    name: "Event horizon",
    caption: "Bend a little space.",
    component: "BlackHole",
  },
  {
    id: "aurora",
    name: "Northern lights",
    caption: "Give the light a nudge.",
    component: "Aurora",
  },
  {
    id: "chroma-flow",
    name: "Color in motion",
    caption: "Push the color around.",
    component: "ChromaFlow",
  },
] as const;
const INSTALL = "npm install @vfx-ui/react vgpu";
const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

type HomePageProps = {
  theme: ThemeMode;
  onNavigate: (path: string) => void;
  onSearch: () => void;
  onTheme: (mode: ThemeMode) => void;
};

function CopyInstall() {
  const [state, setState] = useState("Copy command");
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <button
      className="install-command"
      type="button"
      aria-label={state}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(INSTALL);
          setState("Copied");
        } catch {
          setState("Select the command to copy");
        }
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setState("Copy command"), 2400);
      }}
    >
      <code>{INSTALL}</code>
      {state === "Copied" ? <CheckIcon /> : <CopyIcon />}
      <span className="sr-only" role="status">
        {state}
      </span>
    </button>
  );
}

export function HomePage({
  theme,
  onNavigate,
  onSearch,
  onTheme,
}: HomePageProps) {
  const [art, setArt] = useState(0);
  const [presses, setPresses] = useState(0);
  const [motion, setMotion] = useState(true);
  const active = ARTWORKS[art];
  const heroRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>(
      "a[href]",
    );
    const href = anchor?.getAttribute("href");
    if (
      !anchor ||
      !href?.startsWith("/") ||
      anchor.target ||
      /\.[a-z0-9]+$/i.test(href)
    )
      return;
    event.preventDefault();
    onNavigate(href);
  };
  const componentPath = (id: string) =>
    shaderRoutePath(VISIBLE_READY_SHADERS.find((item) => item.id === id)!);
  const poster = (
    <img
      className="exhibition-poster"
      src={`/showcase/${active.id}.png`}
      alt=""
    />
  );
  const background =
    inView && motion ? (
      <Suspense fallback={poster}>
        {art === 0 ? (
          <BlackHole
            interactive
            centerX={0.42}
            centerY={0.08}
            distance={13.5}
            brightness={0.8}
            tilt={0.16}
            fallback={poster}
          />
        ) : art === 1 ? (
          <Aurora
            interactive
            primary="#81ded3"
            secondary="#8192ef"
            bands={4}
            fallback={poster}
          />
        ) : (
          <ChromaFlow interactive momentum={24} fallback={poster} />
        )}
      </Suspense>
    ) : (
      poster
    );

  return (
    <div className="home-page" onClick={onClick}>
      <header className="home-nav">
        <a className="home-nav-brand" href="/" aria-label="vfx-ui home">
          <BrandMark />
        </a>
        <nav className="home-nav-links" aria-label="Site">
          <a href={STATIC_ROUTE_PATHS.browse}>
            Components <span>{VISIBLE_READY_SHADERS.length}</span>
          </a>
          <a href="/heroes">Heroes</a>
          <a href="/footers">Footers</a>
          <a
            href="https://github.com/zjy365/vfx-ui"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Arrow diagonal />
          </a>
        </nav>
        <div className="home-nav-actions">
          <button
            className="home-search-btn"
            onClick={onSearch}
            aria-label="Search components"
          >
            <SearchIcon />
            <kbd>⌘ K</kbd>
          </button>
          <ThemeButtons compact mode={theme} onChange={onTheme} />
        </div>
      </header>

      <main>
        <section
          ref={heroRef}
          className="exhibition"
          aria-label="Interactive visual effects"
        >
          <HeroShell
            layout="left"
            background={background}
            style={{ "--hero-min-height": "100%" } as CSSProperties}
          >
            <div className="exhibition-copy">
              <h1>
                Make the web
                <br />
                feel <span>something.</span>
              </h1>
              <p>
                Expressive components for React.
                <br />A little atmosphere. A lot of possibility.
              </p>
              <a className="exhibition-cta" href={STATIC_ROUTE_PATHS.browse}>
                Explore the collection <Arrow />
              </a>
            </div>
          </HeroShell>
          <div className="exhibition-topline">
            <span>Open-source. Open to possibilities.</span>
            <span className="exhibition-live">
              <span />
              {motion ? "LIVE RENDER" : "STILL FRAME"}
            </span>
          </div>
          <div className="exhibition-bottom">
            <div className="artwork-caption">
              <span className="artwork-cross" aria-hidden="true">
                +
              </span>
              <div>
                <strong>{active.name}</strong>
                <span>{motion ? active.caption : "Motion is paused."}</span>
              </div>
            </div>
            <div
              className="artwork-selector"
              role="group"
              aria-label="Choose an artwork"
            >
              {ARTWORKS.map((item, index) => (
                <button
                  key={item.id}
                  aria-label={item.name}
                  aria-pressed={index === art}
                  onClick={() => setArt(index)}
                >
                  <img src={`/showcase/${item.id}.png`} alt="" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
            <button
              className="motion-toggle"
              aria-pressed={motion}
              onClick={() => setMotion((value) => !value)}
              aria-label={
                motion ? "Pause artwork motion" : "Play artwork motion"
              }
            >
              {motion ? (
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    d="M7 5v10M13 5v10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="m7 4 9 6-9 6Z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
        </section>

        <section className="interaction-studio" aria-labelledby="studio-title">
          <div className="studio-heading">
            <h2 id="studio-title">
              Made for
              <br />
              interaction.
            </h2>
            <div>
              <p>
                Good interfaces respond.
                <br />
                These ones have a little personality.
              </p>
              <a href={componentPath("spectral-card")}>
                Meet the interactions <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="type-specimen">
            <div className="specimen-caption">
              <span>Kinetic Text</span>
              <span className="pointer-instruction">
                Move across the letters
              </span>
            </div>
            <div className="type-playground">
              <KineticText text="Hello, human." strength={44} spread={0.2} />
            </div>
            <a
              className="specimen-open"
              href={componentPath("kinetic-text")}
              aria-label="Explore Kinetic Text"
            >
              <Arrow diagonal />
            </a>
          </div>
          <div className="studio-pair">
            <div className="material-specimen">
              <div className="specimen-caption">
                <span>Spectral Card</span>
                <span className="pointer-instruction">Catch the light</span>
              </div>
              <div className="material-card">
                <SpectralCard tilt={16} glare={0.5}>
                  <div className="material-content">
                    <span>VFX — MATERIAL EXPLORATION</span>
                    <div className="material-orbit" aria-hidden="true">
                      <div />
                      <div />
                      <div />
                    </div>
                    <div className="material-title">
                      <strong>
                        Stay
                        <br />
                        curious.
                      </strong>
                      <span>
                        Light follows
                        <br />
                        your lead.
                      </span>
                    </div>
                  </div>
                </SpectralCard>
              </div>
              <a
                className="specimen-open"
                href={componentPath("spectral-card")}
                aria-label="Explore Spectral Card"
              >
                <Arrow diagonal />
              </a>
            </div>
            <div className="magnet-specimen">
              <div className="specimen-caption">
                <span>Magnetic</span>
                <span className="pointer-instruction">
                  Move your pointer closer
                </span>
              </div>
              <div className="magnetic-field">
                <svg viewBox="0 0 400 400" aria-hidden="true">
                  <circle cx="200" cy="200" r="82" />
                  <circle cx="200" cy="200" r="128" />
                  <circle cx="200" cy="200" r="174" />
                </svg>
                <Magnetic strength={28}>
                  <button
                    className="magnet-action"
                    onClick={() => setPresses((value) => value + 1)}
                  >
                    {presses ? "Once more?" : "Give it a push"}
                  </button>
                </Magnetic>
              </div>
              <span className="magnet-feedback" role="status">
                {presses
                  ? `${presses} ${presses === 1 ? "good feeling" : "good feelings"}. Keep going.`
                  : "A small pull. A satisfying click."}
              </span>
              <a
                className="specimen-open"
                href={componentPath("magnetic")}
                aria-label="Explore Magnetic"
              >
                <Arrow diagonal />
              </a>
            </div>
          </div>
        </section>

        <section className="scene-collection" aria-labelledby="scene-title">
          <div className="scene-heading">
            <h2 id="scene-title">Set the scene.</h2>
            <p>
              Your story deserves a first impression.
              <br />
              Keep the atmosphere. Bring your own words.
            </p>
          </div>
          <div className="scene-grid">
            {["hero-black-hole", "hero-aurora", "hero-fiber"].map((id) => {
              const shader = VISIBLE_READY_SHADERS.find(
                (item) => item.id === id,
              )!;
              return (
                <a
                  className="scene-card"
                  href={shaderRoutePath(shader)}
                  key={id}
                >
                  <div className="scene-image">
                    <img
                      src={`/showcase/${id}.png`}
                      alt={`${shader.label} composition`}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <strong>{shader.label}</strong>
                    <span>
                      {shader.variants?.length} moods <Arrow diagonal />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
          <a className="collection-link" href={STATIC_ROUTE_PATHS.browse}>
            <span>Find your signature.</span>
            <span>
              Explore all {VISIBLE_READY_SHADERS.length} components <Arrow />
            </span>
          </a>
        </section>

        <section className="home-install" aria-labelledby="install-title">
          <div>
            <h2 id="install-title">
              From this page
              <br />
              to your project.
            </h2>
            <p>
              Real components. Your content.
              <br />
              Copy the code, or hand your agent the prompt.
            </p>
          </div>
          <div className="home-install-code">
            <CopyInstall />
            <pre>
              <code>
                <span>import</span> {"{ HeroAurora }"} <span>from</span>{" "}
                <em>"@vfx-ui/react"</em>;{"\n\n"}
                {"<HeroAurora\n  title="}
                <em>"Your next big idea."</em>
                {"\n  interactive\n/>"}
              </code>
            </pre>
            <a href={STATIC_ROUTE_PATHS.installation}>
              Read the installation guide <Arrow />
            </a>
          </div>
        </section>
      </main>
      <FooterCollection />
    </div>
  );
}
