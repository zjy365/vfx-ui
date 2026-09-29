import { lazy, type ComponentType } from "react";
import {
  FLUID_PRESETS,
  AURORA_PRESETS,
  STARFIELD_PRESETS,
  PARTICLE_PRESETS,
  GLASS_CARD_PRESETS,
  RADIANT_DOTS_PRESETS, ASTRA_FIELD_PRESETS,
  LIQUID_GLASS_PRESETS,
  GLASS_LENS_PRESETS,
  BLACK_HOLE_PRESETS,
  MESH_GRADIENT_PRESETS,
  IRIDESCENT_PRESETS,
  VORTEX_PRESETS,
  RIBBON_FIELD_PRESETS,
  FIBER_FLOW_PRESETS,
  CHROMA_FLOW_PRESETS,
  LIGHT_PRISM_PRESETS,
  HERO_FLUID_PRESETS,
  HERO_AURORA_PRESETS,
  HERO_FIBER_PRESETS,
  HERO_GLOBE_PRESETS,
  HERO_MESH_PRESETS,
  HERO_IRIDESCENT_PRESETS,
  HERO_VORTEX_PRESETS,
  HERO_RIBBON_PRESETS,
  HERO_PARTICLES_PRESETS,
  HERO_STARFIELD_PRESETS,
  HERO_BLACK_HOLE_PRESETS,
  HERO_CHROMA_PRESETS,
  EMBER_DRIFT_PRESETS,
  CAUSTICS_FIELD_PRESETS,
  HALO_RINGS_PRESETS,
  TERRAIN_RIDGE_PRESETS,
  SILK_VEIL_PRESETS,
  PLASMA_SHEET_PRESETS,
  STAR_TIDE_PRESETS,
  INK_BLOOM_PRESETS,
  SOLAR_CORONA_PRESETS,
  DUST_MOTES_PRESETS,
  HERO_AURORA_EDITORIAL_PRESETS,
  HERO_STARFIELD_SPLIT_PRESETS,
  HERO_VORTEX_CENTERED_PRESETS,
  HERO_MESH_BOLD_PRESETS,
  HERO_FIBER_TOP_PRESETS,
  HERO_CHROMA_FULL_PRESETS,
  HERO_BLACK_HOLE_CINEMA_PRESETS,
  HERO_PARTICLES_BADGE_PRESETS,
  HERO_RIBBON_LEFT_PRESETS,
  HERO_FLUID_MINIMAL_PRESETS,
  GLASS_PANEL_PRESETS,
} from "@vfx-ui/react";

/*
 * vfx-ui component registry.
 *
 * Type shape follows the threeui ReadyShader contract (MIT, Copyright 2026 Meng To),
 * slimmed down for the vfx-ui docs shell. Entries point at @vfx-ui/react exports.
 */

export type ContractRow = { name: string; type: string; value: string };
export type RangeControl = { kind?: "range"; key: string; label: string; min: number; max: number; step: number; digits: number; default: number };
export type ChoiceControl = { kind: "choice"; key: string; label: string; options: readonly { value: string; label: string }[]; default: string };
export type CheckpointControl = { kind: "checkpoint"; key: string; label: string; options: readonly { value: string; label: string }[]; default: string };
export type ColorControl = { kind: "color"; key: string; label: string; default: `#${string}` };
export type TextControl = { kind: "text"; key: string; label: string; default: string; maxLength?: number; placeholder?: string };
export type ToggleControl = { kind: "toggle"; key: string; label: string; default: boolean };
export type ShaderControl = ToggleControl | RangeControl | ChoiceControl | CheckpointControl | ColorControl | TextControl;
export type ShaderVariant = {
  id: string;
  label: string;
  description: string;
  thumbnail: string;
  preview?: string;
  props: Readonly<Record<string, boolean | number | string | number[]>>;
  controls?: readonly ShaderControl[];
};
export const READY_SHADER_CATEGORIES = ["Blocks", "Heroes", "Footers", "Backgrounds", "Glass", "Text", "Interactions"] as const;
export type ReadyShaderCategory = (typeof READY_SHADER_CATEGORIES)[number];
export type ReadyShader = {
  id: string;
  visible: boolean;
  category: ReadyShaderCategory;
  label: string;
  thumbnail: string;
  preview?: string;
  previewProps?: Readonly<Record<string, unknown>>;
  tags: readonly string[];
  description: string;
  runtime: "webgpu" | "webgl" | "dom";
  component?: ComponentType<any>;
  importName: string;
  sourceCode?: string;
  agentNotes?: string;
  controls?: readonly ShaderControl[];
  api?: readonly ContractRow[];
  variants?: readonly ShaderVariant[];
};

const GENERIC_VARIANT_THUMBNAIL_COLORS = ["#111318", "#1d2130", "#3b4252"] as const;

function gradientThumbnail(from: string, to: string, accent: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${from}"/><stop offset="0.6" stop-color="${to}"/><stop offset="1" stop-color="${accent}"/></linearGradient></defs><rect width="640" height="360" fill="url(#g)"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/** Convert a component PRESETS bag into catalog variants. */
function presetVariants(
  presets: Record<string, Record<string, number | string | number[]>>,
  descriptions: Record<string, string>,
  thumbnail?: (
    props: Record<string, number | string | number[]>,
    id: string,
  ) => string,
): ShaderVariant[] {
  return Object.entries(presets).map(([id, props]) => ({
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1),
    description: descriptions[id] ?? "",
    thumbnail: thumbnail ? thumbnail(props, id) : gradientThumbnail("#111318", "#1d2130", "#3b4252"),
    props,
  }));
}

const range = (key: string, label: string, min: number, max: number, step: number, default_: number): RangeControl => ({ key, label, min, max, step, digits: 2, default: default_ });
const color = (key: string, label: string, default_: `#${string}`): ColorControl => ({ kind: "color", key, label, default: default_ });

function paletteThumb(props: Record<string, number | string | number[]>): string {
  const from = (props.from as string) ?? "#111318";
  const to = (props.to as string) ?? (props.color as string) ?? (props.primary as string) ?? "#1d2130";
  const accent = (props.accent as string) ?? (props.emission as string) ?? (props.secondary as string) ?? "#3b4252";
  return gradientThumbnail(from, to, accent);
}

function rgb01ToHex(c: [number, number, number]): string {
  return `#${c.map((v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, "0")).join("")}`;
}

/** Thumbnail for Iridescent: mirrors the WGSL cosinePalette at thickness v. */
function cosineThumb(v: number): string {
  const a: [number, number, number] = [1, 0.81, 0.62];
  const b: [number, number, number] = [0.12, 0.34, 0.62];
  const out = a.map((ai, i) => 0.5 + 0.5 * Math.cos(6.28318 * (ai * v + b[i]))) as [number, number, number];
  return rgb01ToHex(out);
}

const glassThumb = (props: Record<string, number | string | number[]>) =>
  gradientThumbnail("#0f172a", (props.tint as string) ?? "#a5c8ff", "#f8fafc");

const liquidThumb = () => gradientThumbnail("#020617", "#7dd3fc", "#c4b5fd");

const ribbonThumb = () => gradientThumbnail("#05060a", "#38bdf8", "#818cf8");

const iridescentThumb = (props: Record<string, number | string | number[]>) => {
  const v = 0.5 + ((props.hueShift as number) ?? 0);
  return gradientThumbnail("#111014", cosineThumb(v), cosineThumb(v + 0.25));
};

const globeThumb = (props: Record<string, number | string | number[]>) => {
  const glow = rgb01ToHex(((props.glowColor as number[]) ?? [0.4, 0.6, 1]) as [number, number, number]);
  const marker = rgb01ToHex(((props.markerColor as number[]) ?? [1, 0.5, 1]) as [number, number, number]);
  return gradientThumbnail("#020617", marker, glow);
};

/**
 * 2026-09-28 batch stills: real 512×512 showcase PNGs were captured for every
 * agent-batch addition. Until each entry's own thumbnail helper is migrated,
 * entry() overrides with the real still so grids, the sidebar and search
 * never render a gradient placeholder.
 */
const SHOWCASE_STILLS = new Set([
  "ember-drift", "caustics-field", "halo-rings", "terrain-ridge", "silk-veil", "plasma-sheet", "star-tide", "ink-bloom", "solar-corona", "dust-motes",
  "hero-aurora-editorial", "hero-starfield-split", "hero-vortex-centered", "hero-mesh-bold", "hero-fiber-top", "hero-chroma-full", "hero-black-hole-cinema", "hero-particles-badge", "hero-ribbon-left", "hero-fluid-minimal",
  "glass-panel", "glass-tile", "chromatic-text", "ripple-text", "spectrum-text", "tilt-card", "pointer-glow", "spotlight-card", "elastic-hover", "magnetic-grid",
  "block-logos", "block-stats", "block-team", "block-gallery", "block-timeline", "block-newsletter", "block-contact", "block-banner", "block-milestones", "block-quote-wall",
]);

function entry(
  config: {
    id: string;
    category: ReadyShaderCategory;
    label: string;
    tags: string[];
    description: string;
    importName: string;
    thumbnail: string;
    sourceCode: string;
    agentNotes: string[];
    controls: readonly ShaderControl[];
    variants: ShaderVariant[];
    runtime?: "webgpu" | "webgl" | "dom";
    previewProps?: Readonly<Record<string, unknown>>;
    api?: readonly ContractRow[];
  },
): ReadyShader {
  return {
    id: config.id,
    visible: true,
    category: config.category,
    label: config.label,
    thumbnail: SHOWCASE_STILLS.has(config.id) ? `/showcase/${config.id}.png` : config.thumbnail,
    tags: config.tags,
    description: config.description,
    runtime: config.runtime ?? "webgpu",
    importName: config.importName,
    component: lazy(() =>
      import("@vfx-ui/react").then((m) => ({ default: (m as unknown as Record<string, ComponentType<any>>)[config.importName] })),
    ),
    sourceCode: config.sourceCode,
    previewProps: config.previewProps,
    agentNotes: config.agentNotes.join("\n"),
    controls: [
      ...(config.runtime === "dom" ? [] : [{ kind: "toggle" as const, key: "interactive", label: config.id === "astra-field" ? "Drag to rotate" : "Follow pointer", default: true }]),
      ...(config.category === "Heroes" ? [
        { kind: "text" as const, key: "title", label: "Your headline", default: "Make something memorable." },
        { kind: "text" as const, key: "subtitle", label: "Your description", default: "Your story. Your words. A little atmosphere from us." },
      ] : []),
      ...config.controls,
    ],
    api: config.api ?? (config.category === "Footers" ? [
      { name: "brand", type: "string", value: "Your brand; the artwork is generated from this text" },
      { name: "title / description", type: "ReactNode", value: "Replaceable example copy" },
      { name: "cta", type: "FooterLink | null", value: "{ label, href }; omitted by default" },
      { name: "groups", type: "FooterLinkGroup[]", value: "[{ label, links: [{ label, href }] }]; empty by default" },
      { name: "legal", type: "FooterLink[]", value: "Optional legal or social links" },
      { name: "copyright", type: "ReactNode", value: "Optional bottom line" },
      { name: "children", type: "ReactNode", value: "Replaces the introduction and navigation; artwork remains" },
      { name: "interactive", type: "boolean", value: "true; pointer motion respects reduced-motion and touch" },
      { name: "className / style", type: "string / CSSProperties", value: "Applied to footer; --vfx-footer-display sets the display font" },
    ] : config.category === "Heroes" ? [
      { name: "title / subtitle", type: "ReactNode", value: "Your content; named heroes include example copy" },
      { name: "eyebrow", type: "string", value: "Optional short label" },
      { name: "primaryCta / secondaryCta", type: "string | HeroCta | null", value: "{ label, href } or { label, onClick }; null hides the action" },
      { name: "children", type: "ReactNode", value: "Replaces the entire default content stack" },
      { name: "interactive", type: "boolean", value: "false in the library; enabled in this preview" },
      { name: "scheme", type: '"dark" | "light"', value: "dark" },
      { name: "className / style", type: "string / CSSProperties", value: "Applied to the hero section" },
      { name: "fallback", type: "ReactNode", value: "Content shown if the background renderer is unavailable" },
    ] : [
      ...(config.runtime === "dom" ? [
        ...(config.id === "kinetic-text" ? [] : [{ name: "children", type: "ReactNode", value: "Your own content; the default is a demonstration" }]),
        { name: "disabled", type: "boolean", value: "false; motion also respects system preferences" },
        ...(config.id === "spectral-card" ? [{ name: "radius", type: "number", value: "24 pixels" }] : []),
      ] : [
        { name: "interactive", type: "boolean", value: "false in the library; enabled in this preview" },
        { name: "fallback", type: "ReactNode", value: "Shown when the renderer is unavailable" },
        ...(config.id === "glass-card" ? [{ name: "children", type: "ReactNode", value: "DOM content above the decorative glass field" }] : []),
      ]),
      { name: "className / style", type: "string / CSSProperties", value: "Applied to the outer container" },
    ]),
    // Variants without a meaningful thumbnail (numeric presets fall through
    // paletteThumb to the generic gradient) inherit the shader's real still.
    variants: config.variants.map((variant) =>
      variant.thumbnail === gradientThumbnail(...GENERIC_VARIANT_THUMBNAIL_COLORS)
        ? { ...variant, thumbnail: config.thumbnail }
        : variant
    ),
  };
}

const heroUsage = (name: string) => `import { ${name} } from "@vfx-ui/react";

export function Landing() {
  return (
    <section style={{ height: "max(640px, 100svh)" }}>
      <${name}
        title="Your next big idea."
        subtitle="Replace this with your own story."
        primaryCta={{ label: "Get started", href: "/start" }}
        secondaryCta={null}
        interactive
      />
    </section>
  );
}`;

const HERO_NOTES = (base: string, layout: string) => [
  `Purpose: drop-in hero section — a full first screen with real, selectable DOM text (${layout} layout) over a GPU ${base} background. Copy it, ship it.`,
  `Mount: give the parent an explicit height (e.g. height: 100dvh or a min-height); the shell fills it and clamps its own type with container queries.`,
  `Props: eyebrow, title, subtitle, primaryCta, secondaryCta, badges, scheme ("dark" | "light"), accent, plus the ${base} shader uniforms. Default copy is for demonstration. Supply your own content and CTA href or onClick; children replaces the content stack.`,
  `Interaction: the ${base} background animates on its own; text and CTAs are plain DOM (WCAG AA scrim, screen-reader readable).`,
  `Guardrails: WebGPU required with graceful degradation; SSR renders inert DOM; prefers-reduced-motion freezes the shader and skips the entrance animation. Do not stack two heroes on one screen.`,
];

const WAVE_USAGE = `import { WaveBackground } from "@vfx-ui/react";

export function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <WaveBackground
        speed={1}
        amplitude={1}
        frequency={2.5}
        from="#020617"
        to="#1d4ed8"
        accent="#38bdf8"
      />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>GPU effects, native React</h1>
      </div>
    </section>
  );
}`;

const fluidUsage = (preset: string) => `import { FluidGradient, FLUID_PRESETS } from "@vfx-ui/react";

export function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <FluidGradient {...FLUID_PRESETS.${preset}} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Fluid by default</h1>
      </div>
    </section>
  );
}`;


const FOOTER_PREVIEW = {
  cta: { label: "Start a conversation", href: "mailto:hello@example.com" },
  groups: [
    { label: "Explore", links: [{ label: "Our work", href: "/heroes" }, { label: "The collection", href: "/footers" }, { label: "Get started", href: "/installation" }] },
    { label: "Elsewhere", links: [{ label: "GitHub", href: "https://github.com/zjy365/vfx-ui" }, { label: "For agents", href: "/llms.txt" }] },
  ],
  copyright: "© 2026 Your studio",
  legal: [{ label: "Back to the collection", href: "/footers" }],
};
export function footerUsage(name: string, settings: Readonly<Record<string, unknown>> = {}) {
  const props = { ...FOOTER_PREVIEW, ...settings };
  const lines = Object.entries(props).map(([key, value]) => `      ${key}={${JSON.stringify(value)}}`).join("\n");
  return `import { ${name} } from "@vfx-ui/react";\n\nexport function PageFooter() {\n  return (\n    <${name}\n${lines}\n    />\n  );\n}`;
}
const FOOTER_ENTRIES = [
  { id: "footer-vinyl", name: "FooterVinyl", label: "Footer Vinyl", brand: "SIDE B", title: "Good things stay on repeat.", color: "#252a20", background: "#e8a0ae", description: "A closing track for your website. A grooved record turns with your pointer, framed by a bold pink sleeve.", extra: [color("labelColor", "Record label", "#ef623b")] },
  { id: "footer-tidal", name: "FooterTidal", label: "Footer Tidal", brand: "AFTER", title: "Every ending. A new beginning.", color: "#e8b58b", background: "#151b20", description: "Copper tidal lines beneath monumental lettering. Move across the footer and reshape the current.", extra: [{ kind: "toggle" as const, key: "animate", label: "Flowing tide", default: true }] },
  { id: "footer-fold", name: "FooterFold", label: "Footer Fold", brand: "FORM", title: "Leave it wide open.", color: "#292454", background: "#e5e0f0", description: "Your wordmark becomes a hinged paper screen. Each panel turns toward the passing pointer.", extra: [range("depth", "Fold depth", 0, 55, 1, 32)] },
  { id: "footer-phosphor", name: "FooterPhosphor", label: "Footer Phosphor", brand: "STILL", title: "Keep in touch.", color: "#d2f8a2", background: "#17201b", description: "A wordmark made of light. Its cells scatter around your pointer and settle back into place.", extra: [] },
].map((footer) => entry({
  id: footer.id, category: "Footers", label: footer.label, runtime: "dom", importName: footer.name,
  tags: ["footer", "typography", "pointer"], description: footer.description, thumbnail: `/showcase/${footer.id}.png`,
  previewProps: { ...FOOTER_PREVIEW, copyright: `© 2026 ${footer.brand}`, cta: { label: footer.id === "footer-fold" ? "Begin a project" : footer.id === "footer-phosphor" ? "Say hello" : "Start a conversation", href: "mailto:hello@example.com" } },
  sourceCode: footerUsage(footer.name, { brand: footer.brand, title: footer.title, color: footer.color, background: footer.background, copyright: `© 2026 ${footer.brand}`, cta: { label: footer.id === "footer-fold" ? "Begin a project" : footer.id === "footer-phosphor" ? "Say hello" : "Start a conversation", href: "mailto:hello@example.com" } }),
  controls: [
    { kind: "text", key: "brand", label: "Your brand", default: footer.brand, maxLength: 24 },
    { kind: "text", key: "title", label: "Your headline", default: footer.title, maxLength: 120 },
    { kind: "toggle", key: "interactive", label: "Follow pointer", default: true },
    color("color", "Ink / light", footer.color as `#${string}`), color("background", "Surface", footer.background as `#${string}`),
    ...footer.extra,
  ], variants: [],
  agentNotes: ["A semantic footer with customizable brand, title, description, CTA, navigation groups, copyright and legal links. Example links belong to the demo; replace them with your own routes. children replaces the intro and navigation. No WebGPU or animation library required. Touch and reduced-motion preserve a composed static design. Canvas work sleeps offscreen. Set --vfx-footer-display through style to use your brand font."],
}));

const STUDIO_HERO_ENTRIES = [
  { id: "hero-eclipse", name: "HeroEclipse", label: "Hero Eclipse", title: "A rare\nalignment.", subtitle: "For ideas that only come around once. Make this moment yours.", color: "#e9ad73", background: "#171916", description: "An astronomical instrument in warm copper. Move the pointer to shift the eclipse and rotate its engraved dial.", tags: ["eclipse", "astronomy", "editorial"], extra: [range("parallax", "Orbit travel", 0, 1, .05, .7)] },
  { id: "hero-contour", name: "HeroContour", label: "Hero Contour", title: "Find your\nown way.", subtitle: "A different perspective changes everything. Step off the familiar path.", color: "#ed5b31", background: "#eeeade", description: "A sunlit topographic print. Seed your own landscape and let the paper ridges rise around your pointer.", tags: ["terrain", "topography", "generative"], extra: [range("seed", "Landscape seed", 0, 100, 1, 17), range("relief", "Elevation", .3, 1.6, .05, 1)] },
].map((hero) => {
  const shader = entry({
    id: hero.id, importName: hero.name, category: "Heroes", label: hero.label, runtime: "dom",
    description: hero.description, tags: ["hero", "pointer", ...hero.tags], thumbnail: `/showcase/${hero.id}.png`,
    previewProps: { primaryCta: { label: "Explore the collection", href: "/heroes" } },
    sourceCode: `import { ${hero.name} } from "@vfx-ui/react";\n\nexport function Hero() {\n  return <${hero.name} title={${JSON.stringify(hero.title)}} interactive primaryCta={{ label: "Explore", href: "/work" }} />;\n}`,
    controls: [
      { kind: "toggle", key: "interactive", label: "Follow pointer", default: true },
      color("color", "Accent", hero.color as `#${string}`), color("background", "Paper", hero.background as `#${string}`), ...hero.extra,
    ], variants: [],
    agentNotes: ["Original SVG/CSS artwork. No WebGPU, canvas, external images or animation library. Pointer motion settles and sleeps; reduced-motion and touch retain static artwork. Example copy is replaceable; CTA links and buttons remain native. Set interactive to enable motion. Mobile reflows the illustration below the text."],
  });
  return { ...shader, controls: shader.controls?.map((control) => control.kind === "text" && control.key === "title" ? { ...control, default: hero.title } : control.kind === "text" && control.key === "subtitle" ? { ...control, default: hero.subtitle } : control), api: shader.api?.filter((row) => row.name !== "scheme" && row.name !== "fallback") };
});

const BLOCK_COMMON_NOTES = (purpose: string, extra: string[] = []) => [
  `Purpose: ${purpose}. Copy it, ship it — every string, link and color arrives through props.`,
  "Runtime: pure DOM + CSS. No WebGPU, canvas, animation library or external assets; SSR-safe on first render.",
  "Theming: root custom properties (--vb-bg, --vb-fg, --vb-accent, --vb-border, --vb-radius, --vb-container) or the accent/scheme/className/style props. scheme flips the dark default to light.",
  "Guardrails: responsive via container queries down to 320px; interactive behavior degrades on touch; prefers-reduced-motion drops entrance/scroll motion while content stays complete.",
  ...extra,
];

const BLOCK_USAGE = {
  "block-nav": `import { BlockNav } from "@vfx-ui/react";

export function SiteHeader() {
  return (
    <BlockNav
      brand="Northwind"
      links={[
        { label: "Product", href: "#product" },
        { label: "Pricing", href: "#pricing" },
        { label: "FAQ", href: "#faq" },
      ]}
      action={{ label: "Get started", href: "/start" }}
      sticky
    />
  );
}`,
  "block-showcase": `import { BlockShowcase } from "@vfx-ui/react";

export function Tour() {
  return (
    <BlockShowcase
      eyebrow="Product tour"
      title="Every launch, in one orbit."
      description="Plan the release, watch the numbers move."
      primaryCta={{ label: "Start free", href: "/start" }}
      media={<img src="/app-screenshot.png" alt="Orbit release dashboard" />}
      caption="Replace the built-in demo screen with your own media."
    />
  );
}`,
  "block-feature-grid": `import { BlockFeatureGrid } from "@vfx-ui/react";

export function Features() {
  return (
    <BlockFeatureGrid
      eyebrow="Why Orbit"
      title="Built for the way teams ship."
      items={[
        { title: "A release graph", description: "Deploys, flags and rollbacks on one canvas.", featured: true },
        { title: "Explained flags", description: "Owner, rollout and expiry on every flag." },
        { title: "Incident replays", description: "Metrics, logs and deploys scrubbed together." },
      ]}
    />
  );
}`,
  "block-feature-tabs": `import { BlockFeatureTabs } from "@vfx-ui/react";

export function Surfaces() {
  return (
    <BlockFeatureTabs
      title="One graph. Three ways to look at it."
      tabs={[
        { label: "Plan", description: "Sketch the release as a graph." },
        { label: "Ship", description: "Flags with staged rollouts." },
        { label: "Review", description: "Replay the week on one timeline." },
      ]}
    />
  );
}`,
  "block-scroll-story": `import { BlockScrollStory } from "@vfx-ui/react";

export function Story() {
  return (
    <BlockScrollStory
      title="A release week, told in three scenes."
      steps={[
        { eyebrow: "Monday", title: "Sketch the week.", text: "Drop deploys onto one canvas." },
        { eyebrow: "Wednesday", title: "Ship behind a canary.", text: "Orbit pauses drift for you." },
        { eyebrow: "Friday", title: "Replay it.", text: "One scrubbable timeline." },
      ]}
    />
  );
}`,
  "block-process-steps": `import { BlockProcessSteps } from "@vfx-ui/react";

export function HowItWorks() {
  return (
    <BlockProcessSteps
      title="From install to insight in an afternoon."
      steps={[
        { title: "Connect your repos", text: "One OAuth flow, automatic indexing." },
        { title: "Describe a release", text: "The graph assembles itself." },
        { title: "Ship and watch", text: "Staged rollouts with auto-pause." },
      ]}
      action={{ label: "Read the quickstart", href: "/docs" }}
    />
  );
}`,
  "block-integrations": `import { BlockIntegrations } from "@vfx-ui/react";

export function Stack() {
  return (
    <BlockIntegrations
      brand="Orbit"
      title="Plugs into the tools you already trust."
      integrations={[
        { name: "GitHub", href: "/integrations/github", description: "Sync releases with GitHub." },
        { name: "Linear", href: "/integrations/linear" },
        { name: "Slack", href: "/integrations/slack" },
      ]}
    />
  );
}`,
  "block-comparison": `import { BlockComparison } from "@vfx-ui/react";

export function BeforeAfter() {
  return (
    <BlockComparison
      title="Drag to see the redesign."
      before={<img src="/before.png" alt="Before the redesign" />}
      after={<img src="/after.png" alt="After the redesign" />}
      beforeLabel="Old site"
      afterLabel="Our work"
    />
  );
}`,
  "block-testimonials": `import { BlockTestimonials } from "@vfx-ui/react";

export function Voices() {
  return (
    <BlockTestimonials
      title="The teams who ship weekly, talk like this."
      testimonials={[
        {
          quote: "The replay is the status update.",
          name: "Mara Ellison",
          role: "Head of Platform, Fieldnote",
          href: "/customers/fieldnote",
        },
      ]}
    />
  );
}`,
  "block-pricing": `import { BlockPricing } from "@vfx-ui/react";

export function Plans() {
  return (
    <BlockPricing
      title="Start free. Scale when the graph does."
      plans={[
        { name: "Solo", priceMonthly: 0, basis: "month", features: ["1 release graph"], cta: { label: "Start free", href: "/start" } },
        { name: "Team", priceMonthly: 24, priceAnnual: 20, featured: true, cta: { label: "Start trial", href: "/trial" } },
      ]}
    />
  );
}`,
  "block-faq": `import { BlockFaq } from "@vfx-ui/react";

export function Answers() {
  return (
    <BlockFaq
      title="Questions engineers actually ask."
      items={[
        {
          question: "How long does setup take?",
          answer: "Most teams see their first graph within ten minutes.",
        },
      ]}
    />
  );
}`,
  "block-cta": `import { BlockCta } from "@vfx-ui/react";
import { WaveBackground } from "@vfx-ui/react";

export function Closing() {
  return (
    <BlockCta
      title="Your next release could feel like this."
      primaryCta={{ label: "Get started free", href: "/start" }}
      secondaryCta={{ label: "See the docs", href: "/docs" }}
      media={<WaveBackground speed={0.55} interactive={false} />}
    />
  );
}`,
  "block-logos": `import { BlockLogos } from "@vfx-ui/react";

export function Trust() {
  return (
    <BlockLogos
      title="In good company."
      logos={[
        { name: "Acme", href: "/customers/acme" },
        { name: "Northwind", logo: <img src="/acme-mark.svg" alt="" /> },
      ]}
      columns={5}
    />
  );
}`,
  "block-stats": `import { BlockStats } from "@vfx-ui/react";

export function Numbers() {
  return (
    <BlockStats
      title="The graph, measured."
      stats={[
        { value: 128, suffix: "ms", label: "Median deploy window" },
        { value: 99.98, decimals: 2, suffix: "%", label: "Rollouts clean" },
      ]}
    />
  );
}`,
  "block-team": `import { BlockTeam } from "@vfx-ui/react";

export function People() {
  return (
    <BlockTeam
      title="The people behind the graph."
      members={[
        { name: "Mara Ellison", role: "Head of Platform", href: "/team/mara" },
        { name: "Iris Chen", role: "Design", links: [{ label: "Site", href: "https://iris.example" }] },
      ]}
    />
  );
}`,
  "block-gallery": `import { BlockGallery } from "@vfx-ui/react";

export function Work() {
  return (
    <BlockGallery
      title="Recent releases, up close."
      items={[
        { title: "Fieldnote launch", caption: "2026 · identity + site", media: <img src="/work/fieldnote.png" alt="" /> },
        { title: "Orbit 2.4", caption: "2026 · product film" },
      ]}
    />
  );
}`,
  "block-timeline": `import { BlockTimeline } from "@vfx-ui/react";

export function History() {
  return (
    <BlockTimeline
      title="How we got here."
      events={[
        { date: "2023", title: "First graph", text: "A whiteboard and a cron job." },
        { date: "2025", title: "Replays", text: "One scrubbable timeline." },
      ]}
    />
  );
}`,
  "block-newsletter": `import { BlockNewsletter } from "@vfx-ui/react";

export function Signup() {
  return (
    <BlockNewsletter
      title="One careful email a month."
      onSubscribe={async (email) => {
        await fetch("/api/subscribe", { method: "POST", body: JSON.stringify({ email }) });
      }}
    />
  );
}`,
  "block-contact": `import { BlockContact } from "@vfx-ui/react";

export function Reach() {
  return (
    <BlockContact
      title="Talk to a human."
      channels={[{ label: "Email", value: "hello@example.com", href: "mailto:hello@example.com" }]}
      fields={[{ name: "message", label: "What are you building?", type: "textarea", required: true }]}
      onSubmit={async (values) => console.log(values)}
    />
  );
}`,
  "block-banner": `import { BlockBanner } from "@vfx-ui/react";

export function Announce() {
  return (
    <BlockBanner
      message="Orbit 2.4 is rolling out this week — release replays for every plan."
      action={{ label: "Read the changelog", href: "/changelog" }}
      onDismiss={() => localStorage.setItem("banner-dismissed", "1")}
    />
  );
}`,
  "block-milestones": `import { BlockMilestones } from "@vfx-ui/react";

export function Roadmap() {
  return (
    <BlockMilestones
      title="Where we are in the plan."
      milestones={[
        { name: "Whiteboard", note: "The first graph." },
        { name: "Replays", note: "Scrub the week." },
        { name: "Self-hosted", note: "In progress.", current: true },
      ]}
      current={2}
    />
  );
}`,
  "block-quote-wall": `import { BlockQuoteWall } from "@vfx-ui/react";

export function Voices() {
  return (
    <BlockQuoteWall
      title="Field notes from release teams."
      mode="wall"
      quotes={[
        { quote: "The replay is the status update.", name: "Mara Ellison", role: "Head of Platform, Fieldnote" },
      ]}
    />
  );
}`,
  "example-launch": `import { ExampleLaunch } from "@vfx-ui/react";

export default function LaunchPage() {
  return <ExampleLaunch />;
}`,
  "example-studio": `import { ExampleStudio } from "@vfx-ui/react";

export default function StudioPage() {
  return <ExampleStudio />;
}`,
} as const;

const BLOCK_API = {
  shared: [
    { name: "scheme", type: '"dark" | "light"', value: "dark" },
    { name: "accent", type: "string (hex)", value: "Sets --vb-accent for the whole block" },
    { name: "className / style", type: "string / CSSProperties", value: "Applied to the section root" },
    { name: "children", type: "ReactNode", value: "Replaces the default content entirely" },
  ],
} as const;

const BLOCK_ENTRIES = [
  {
    id: "block-nav", importName: "BlockNav", label: "Block Nav",
    tags: ["navigation", "header", "menu", "mobile"],
    description: "Complete navigation bar: brand, desktop links, actions, and an accessible mobile sheet. Sticky variant gains a scrim once the page scrolls.",
    thumbnail: "/showcase/block-nav.png",
    controls: [
      { kind: "text", key: "brand", label: "Brand", default: "Northwind", maxLength: 24 } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "brand", type: "string", value: "Your brand; the monogram tile is generated from it" },
      { name: "brandHref", type: "string", value: "#top; destination for the brand link" },
      { name: "links", type: "readonly NavLink[]", value: "[{ label, href }]; desktop nav and mobile sheet" },
      { name: "action", type: "{ label, href } | null", value: "Primary right-side action; real link" },
      { name: "secondaryAction", type: "{ label, href } | null", value: "Quiet secondary link; null hides it" },
      { name: "sticky", type: "boolean", value: "false; sticky bars overlay content when enabled" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("complete navigation bar with a real mobile menu (Escape closes, links stay keyboard reachable)", [
      "The mobile sheet renders only when open; at 860px+ the burger disappears entirely.",
    ]),
  },
  {
    id: "block-showcase", importName: "BlockShowcase", label: "Block Showcase",
    tags: ["showcase", "product", "media", "screenshot"],
    description: "Product showcase stage: browser-chrome frame with a replaceable screenshot or video (built-in CSS demo screen by default), headline and actions, with a gentle pointer tilt.",
    thumbnail: "/showcase/block-showcase.png",
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "Every launch, in one orbit.", maxLength: 90 } as const,
      color("accent", "Accent", "#d5ed9a"),
      { kind: "toggle", key: "interactive", label: "Pointer tilt", default: true } as const,
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Replaceable example copy" },
      { name: "primaryCta / secondaryCta", type: "{ label, href? , onClick? } | null", value: "Actions under the headline" },
      { name: "media", type: "ReactNode", value: "Your screenshot/video; defaults to a fictional CSS demo UI" },
      { name: "mediaAlt", type: "string", value: "Accessible description for the default demo screen" },
      { name: "caption", type: "ReactNode", value: "Note under the stage; pass null to remove" },
      { name: "interactive", type: "boolean", value: "true; pointer tilt on the frame, still on touch/reduced-motion" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("product showcase with a device frame and replaceable media", [
      "The default screen is a fictional release dashboard drawn in CSS (role=img, labeled as demo) — pass media to replace it; the frame scales any aspect via object-fit.",
    ]),
  },
  {
    id: "block-feature-grid", importName: "BlockFeatureGrid", label: "Block Feature Grid",
    tags: ["features", "bento", "grid"],
    description: "Feature grid with real hierarchy: one bento feature card with media plus supporting cells. Icons, media, links and copy all replaceable.",
    thumbnail: "/showcase/block-feature-grid.png",
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "Less managing. More making.", maxLength: 90 } as const,
      { kind: "choice", key: "layout", label: "Layout", default: "bento", options: [{ value: "bento", label: "Bento" }, { value: "even", label: "Even" }] } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "items", type: "readonly FeatureGridItem[]", value: "{ title, description, icon?, media?, href?, featured? }" },
      { name: "layout", type: '"bento" | "even"', value: "bento leads with a wide media card; even equalizes" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("feature grid with one featured bento cell", [
      "The first item is featured by default (featured:false opts out); items with href get a stretched link hit area while staying one accessible name.",
    ]),
  },
  {
    id: "block-feature-tabs", importName: "BlockFeatureTabs", label: "Block Feature Tabs",
    tags: ["tabs", "features", "keyboard", "interactive"],
    description: "Feature tabs where the list, copy and illustration switch together. WAI-ARIA tabs pattern with arrow keys; a scrollable strip above the stage on touch layouts.",
    thumbnail: "/showcase/block-feature-tabs.png",
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "Every part of the release. In reach.", maxLength: 90 } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "tabs", type: "readonly FeatureTab[]", value: "{ label, description, media?, href? }" },
      { name: "action", type: "{ label, href? , onClick? } | null", value: "Per-tab action; tab.href wins when set" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("interactive feature tabs", [
      "Keyboard: Left/Right (and Up/Down) cycle, Home/End jump, Tab moves into the panel; the panel is focusable and labeled by the active tab.",
      "Each tab's default illustration is a CSS scene; pass media per tab for real screenshots.",
    ]),
  },
  {
    id: "block-scroll-story", importName: "BlockScrollStory", label: "Block Scroll Story",
    tags: ["scroll", "story", "sticky", "narrative"],
    description: "Scroll narrative: a sticky scene crossfades as story steps cross the viewport center; on small screens the scene docks above the steps so the story reads end to end.",
    thumbnail: "/showcase/block-scroll-story.png",
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "A release week, told in three scenes.", maxLength: 90 } as const,
      { kind: "toggle", key: "interactive", label: "Follow scroll", default: true } as const,
      { kind: "toggle", key: "flip", label: "Media right", default: false } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "steps", type: "readonly StoryStep[]", value: "{ eyebrow?, title, text, media? }" },
      { name: "flip", type: "boolean", value: "false; media column on the right when true (desktop)" },
      { name: "interactive", type: "boolean", value: "true; false pins the first scene (also respects reduced motion)" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("scroll-linked narrative with sticky media", [
      "Active step detection is IntersectionObserver over the middle band of the viewport; CSS swaps scenes, so no scroll listeners or JS animation.",
      "Reduced motion keeps every step at full opacity with an instant scene swap — the narrative never hides content.",
    ]),
  },
  {
    id: "block-process-steps", importName: "BlockProcessSteps", label: "Block Process Steps",
    tags: ["steps", "process", "timeline", "how-it-works"],
    description: "Three-to-four step process with numbered badges and a connector line that draws itself in on scroll; vertical timeline on narrow screens, replaceable media per step.",
    thumbnail: "/showcase/block-process-steps.png",
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "Your next release starts here.", maxLength: 90 } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "steps", type: "readonly ProcessStep[]", value: "{ title, text, media?, label? } — 3-4 recommended" },
      { name: "action", type: "{ label, href } | null", value: "Call to action under the steps" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("process/how-it-works steps", [
      "The connector draws once when the section enters the viewport (IntersectionObserver + CSS transform); reduced motion shows the finished line and settled layout immediately.",
    ]),
  },
  {
    id: "block-integrations", importName: "BlockIntegrations", label: "Block Integrations",
    tags: ["integrations", "logos", "orbit", "compatibility"],
    description: "Integrations hub: your product at the center of two connection rings of rebrandable tool tiles, with an always-available link grid below and on touch layouts.",
    thumbnail: "/showcase/block-integrations.png",
    controls: [
      { kind: "text", key: "brand", label: "Center brand", default: "Orbit", maxLength: 16 } as const,
      { kind: "choice", key: "layout", label: "Layout", default: "orbit", options: [{ value: "orbit", label: "Orbit" }, { value: "grid", label: "Grid" }] } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "brand", type: "string", value: "Center node label; logo replaces its monogram" },
      { name: "logo", type: "ReactNode", value: "Your mark for the center node" },
      { name: "integrations", type: "readonly Integration[]", value: "{ name, description?, href?, logo? } — first 8 orbit" },
      { name: "action", type: "{ label, href? , onClick? } | null", value: "Button under the diagram" },
      { name: "layout", type: '"orbit" | "grid"', value: "orbit; grid skips the diagram everywhere" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("integration/compatibility hub", [
      "The connection diagram is static and every tile stays upright; every tool tile is a real link you rebrand and relink. Touch layouts (<=820px) always get the grid.",
    ]),
  },
  {
    id: "block-comparison", importName: "BlockComparison", label: "Block Comparison",
    tags: ["comparison", "before-after", "slider"],
    description: "Before/after comparison with a draggable reveal handle — keyboard (arrow keys, Home/End), touch and screen readers all work because the handle is a real range input.",
    thumbnail: "/showcase/block-comparison.png",
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "A new look. The same good coffee.", maxLength: 90 } as const,
      range("defaultPosition", "Handle start", 0, 100, 1, 50),
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "before / after", type: "ReactNode", value: "The two layers; defaults are CSS demo panels" },
      { name: "beforeLabel / afterLabel", type: "string", value: "Chip labels (and the slider's accessible name)" },
      { name: "defaultPosition", type: "number", value: "0-100 handle start; user moves are uncontrolled" },
      { name: "caption", type: "ReactNode", value: "Note under the stage" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("before/after comparison slider", [
      "The overlay range input owns interaction (drag, touch, keyboard, aria-valuetext); the visible handle is pointer-events:none decoration.",
    ]),
  },
  {
    id: "block-testimonials", importName: "BlockTestimonials", label: "Block Testimonials",
    tags: ["testimonials", "quotes", "social-proof"],
    description: "Testimonials with a featured quote plus a field-note grid. The built-in quotes are fictional and visibly marked — swap in real customers via props and clear the marker.",
    thumbnail: "/showcase/block-testimonials.png",
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "Built around the people who build.", maxLength: 90 } as const,
      { kind: "toggle", key: "featured", label: "Featured quote", default: true } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "testimonials", type: "readonly Testimonial[]", value: "{ quote, name, role?, href?, linkLabel?, avatar? }" },
      { name: "featured", type: "boolean", value: "true; enlarges the first quote" },
      { name: "demoNote", type: "ReactNode | null", value: "Fictional-content marker; pass null once your quotes are real" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("testimonial/case-study wall", [
      "Default content is invented on purpose and says so on screen — never ship it as real social proof.",
    ]),
  },
  {
    id: "block-pricing", importName: "BlockPricing", label: "Block Pricing",
    tags: ["pricing", "plans", "billing"],
    description: "Pricing plans with a working monthly/annual switch: amounts, billing basis and the savings pill all render from data, so the toggle can never lie. No payment backend.",
    thumbnail: "/showcase/block-pricing.png",
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "Good work deserves a simple plan.", maxLength: 90 } as const,
      { kind: "choice", key: "defaultPeriod", label: "Start period", default: "annual", options: [{ value: "monthly", label: "Monthly" }, { value: "annual", label: "Annual" }] } as const,
      { kind: "text", key: "annualNote", label: "Annual badge", default: "2 months free", maxLength: 20 } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "plans", type: "readonly PricingPlan[]", value: "{ name, priceMonthly, priceAnnual?, basis?, description?, features?, cta?, featured?, badge? }" },
      { name: "periodToggle", type: "boolean", value: "true; hidden automatically when no plan has priceAnnual" },
      { name: "defaultPeriod", type: '"monthly" | "annual"', value: "annual" },
      { name: "annualNote", type: "string", value: 'Pill on the annual toggle, e.g. "2 months free"' },
      { name: "footnote", type: "ReactNode", value: "Fine print under the grid" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("pricing section with billing-period switching", [
      "basis:'month' prices per seat per month and flips with the toggle; basis:'once' ignores the toggle (one-time). CTAs are plain links/buttons — wire your checkout.",
    ]),
  },
  {
    id: "block-faq", importName: "BlockFaq", label: "Block FAQ",
    tags: ["faq", "accordion", "keyboard", "questions"],
    description: "FAQ accordion with real disclosure semantics: buttons + aria-expanded/controls, arrow-key traversal, CSS grid-rows height animation, long answers with links and lists welcome.",
    thumbnail: "/showcase/block-faq.png",
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "A few things worth knowing.", maxLength: 90 } as const,
      { kind: "toggle", key: "multiple", label: "Allow many open", default: false } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header (sticky on wide screens)" },
      { name: "items", type: "readonly FaqItem[]", value: "{ question, answer: ReactNode }" },
      { name: "multiple", type: "boolean", value: "false; one answer open at a time" },
      { name: "contact", type: "{ text, action } | null", value: "Support line under the header; null hides it" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("frequently-asked-questions accordion", [
      "Answers stay in the accessibility tree only while open (visibility flips with the same transition as the height), and ArrowUp/Down/Home/End move between questions.",
    ]),
  },
  {
    id: "block-cta", importName: "BlockCta", label: "Block CTA",
    tags: ["cta", "closing", "conversion"],
    description: "Closing call to action: headline, supporting copy, primary and secondary actions and a replaceable brand visual layer — a concentric line artwork by default, any background component or media if you pass one.",
    thumbnail: "/showcase/block-cta.png",
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "Your next release could feel like this.", maxLength: 80 } as const,
      { kind: "text", key: "description", label: "Supporting line", default: "A little less coordination. A lot more making. Bring your next idea to Orbit.", maxLength: 140 } as const,
      { kind: "text", key: "note", label: "Fine print", default: "Free for solo projects · no card required · demo copy", maxLength: 80 } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Replaceable copy" },
      { name: "primaryCta / secondaryCta", type: "{ label, href? , onClick? } | null", value: "Actions; null hides one" },
      { name: "media", type: "ReactNode", value: "Decorative layer (WaveBackground, image, video); default is concentric line artwork" },
      { name: "note", type: "ReactNode", value: "Reassurance line under the actions" },
      { name: "layout", type: '"panel" | "banner"', value: "panel floats a card; banner runs full-bleed" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("closing call-to-action section", [
      "Concentric line artwork gives the closing panel its structure. Supply media for a custom image, video or GPU background; the default block uses DOM/CSS only.",
    ]),
  },
  /* ---- 2026-09 batch D: content blocks ----
   * TODO(showcase): real /showcase/*.png stills are not captured for this
   * batch yet; these entries carry generated gradient placeholders. Swap
   * thumbnail to `/showcase/<id>.png` once stills exist. */
  {
    id: "block-logos", importName: "BlockLogos", label: "Block Logos",
    tags: ["logos", "social-proof", "trust", "customers"],
    description: "Customer logo wall: a hairline grid of brand tiles that sit desaturated until hover. Real marks via logo (img or inline svg) or styled wordmarks — no assets required.",
    thumbnail: gradientThumbnail("#0b0e14", "#1a2030", "#d5ed9a"),
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "In good company.", maxLength: 90 } as const,
      { kind: "range", key: "columns", label: "Columns", min: 3, max: 7, step: 1, digits: 0, default: 5 } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "logos", type: "readonly LogoItem[]", value: "{ name, href?, logo? } — empty falls back to fictional demo brands" },
      { name: "columns", type: "number", value: "5; grid column count" },
      { name: "demoNote", type: "ReactNode | null", value: "Fictional-content marker; pass null once your logos are real" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("customer/trust logo wall", [
      "Every tile is an optional real link; hover restores each mark's color while the wall rests desaturated.",
    ]),
  },
  {
    id: "block-stats", importName: "BlockStats", label: "Block Stats",
    tags: ["stats", "numbers", "metrics", "count-up"],
    description: "Stats band where every number counts up from zero on scroll-in, with a settled, screen-reader-friendly final value always present. Prefixes, suffixes and formatting are props.",
    thumbnail: gradientThumbnail("#0b0e14", "#1a2030", "#d5ed9a"),
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "The graph, measured.", maxLength: 90 } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header; all three optional for a bare band" },
      { name: "stats", type: "readonly StatItem[]", value: "{ value, decimals?, prefix?, suffix?, label, description?, format? }" },
      { name: "demoNote", type: "ReactNode | null", value: "Fictional-figures marker; pass null with real data" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("stats/metrics band with count-up", [
      "Numbers render settled for SSR and no-JS; the count-up re-arms once in view. Reduced motion shows final figures immediately.",
    ]),
  },
  {
    id: "block-team", importName: "BlockTeam", label: "Block Team",
    tags: ["team", "people", "about", "grid"],
    description: "Team grid: cards with an avatar (your image node or an auto-generated initials badge), name, role and profile links. Names can link out.",
    thumbnail: gradientThumbnail("#0b0e14", "#1a2030", "#d5ed9a"),
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "The people behind the graph.", maxLength: 90 } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "members", type: "readonly TeamMember[]", value: "{ name, role?, href?, links?: TeamLink[], avatar? }" },
      { name: "demoNote", type: "ReactNode | null", value: "Fictional-people marker; pass null with your real team" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("team/about grid", [
      "Avatar accepts any ReactNode; without one, an initials badge is generated from the name so no image assets are required.",
    ]),
  },
  {
    id: "block-gallery", importName: "BlockGallery", label: "Block Gallery",
    tags: ["gallery", "portfolio", "lightbox", "work"],
    description: "Work gallery: a responsive grid of tiles that lift on hover, with an optional lightbox — a real dialog (focus moves in, Escape closes, arrows navigate, Tab stays trapped, focus returns).",
    thumbnail: gradientThumbnail("#0b0e14", "#1a2030", "#d5ed9a"),
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "Recent releases, up close.", maxLength: 90 } as const,
      { kind: "toggle", key: "lightbox", label: "Lightbox", default: true } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "items", type: "readonly GalleryItem[]", value: "{ title, caption?, media? } — media is any node; default artwork is generated in CSS" },
      { name: "lightbox", type: "boolean", value: "true; tiles open the dialog when set" },
      { name: "closeLabel / previousLabel / nextLabel", type: "string", value: "Accessible labels for the dialog controls" },
      { name: "demoNote", type: "ReactNode | null", value: "Fictional-artwork marker; pass null with real work" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("portfolio/work gallery with an accessible lightbox", [
      "The default artwork is fictional CSS scenery visibly marked as demo; pass media for real screenshots and photography.",
    ]),
  },
  {
    id: "block-timeline", importName: "BlockTimeline", label: "Block Timeline",
    tags: ["timeline", "history", "story", "company"],
    description: "Company or product timeline: a vertical rail that draws itself in on scroll, alternating left/right on wide screens and collapsing to one rail on small ones.",
    thumbnail: gradientThumbnail("#0b0e14", "#1a2030", "#d5ed9a"),
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "How we got here.", maxLength: 90 } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "events", type: "readonly TimelineEvent[]", value: "{ date, title, text, tags? }" },
      { name: "demoNote", type: "ReactNode | null", value: "Fictional-history marker; pass null with real events" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("company/product timeline", [
      "The rail draws once when the section enters the viewport; reduced motion shows the settled timeline immediately.",
    ]),
  },
  {
    id: "block-newsletter", importName: "BlockNewsletter", label: "Block Newsletter",
    tags: ["newsletter", "signup", "form", "email"],
    description: "Newsletter signup that is a working form, not a mockup: client-side validation with inline announced errors, and a confirmation panel on success. Wire onSubscribe; without it, demo mode says so on screen.",
    thumbnail: gradientThumbnail("#0b0e14", "#1a2030", "#d5ed9a"),
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "One careful email a month.", maxLength: 90 } as const,
      { kind: "text", key: "submitLabel", label: "Button", default: "Subscribe", maxLength: 24 } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "emailLabel / placeholder / submitLabel", type: "string", value: "Form copy" },
      { name: "onSubscribe", type: "(email: string) => void | Promise<void>", value: "Your handler; absent = local demo mode" },
      { name: "invalidEmailMessage / successTitle / successNote / resetLabel", type: "ReactNode", value: "Validation and confirmation copy" },
      { name: "demoNote", type: "ReactNode | null", value: "Demo-mode marker; pass null once wired" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("newsletter signup form", [
      "Errors are aria-invalid + role=alert; success swaps to a role=status confirmation. Demo mode validates and confirms locally without sending anything.",
    ]),
  },
  {
    id: "block-contact", importName: "BlockContact", label: "Block Contact",
    tags: ["contact", "form", "channels", "email"],
    description: "Contact section: a direct-channels list (email, phone, office — real links) beside a configurable form skeleton with labels wired to inputs and native validation intact.",
    thumbnail: gradientThumbnail("#0b0e14", "#1a2030", "#d5ed9a"),
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "Talk to a human.", maxLength: 90 } as const,
      { kind: "text", key: "submitLabel", label: "Button", default: "Send message", maxLength: 24 } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "channels", type: "readonly ContactChannel[]", value: "{ label, value, href?, icon? } — real links you relink freely" },
      { name: "fields", type: "readonly ContactField[]", value: "{ name, label, type?, required?, placeholder? }" },
      { name: "onSubmit", type: "(values: Record<string, string>) => void | Promise<void>", value: "Your handler; absent = local demo mode" },
      { name: "demoNote", type: "ReactNode | null", value: "Demo-details marker; pass null once real" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("contact section with channels and a form", [
      "Default channels use reserved fictional contact details visibly marked as demo; without onSubmit nothing is sent anywhere.",
    ]),
  },
  {
    id: "block-banner", importName: "BlockBanner", label: "Block Banner",
    tags: ["banner", "announcement", "topbar", "dismissible"],
    description: "Announcement banner: a slim accent-tinted strip for one important message with an optional action. Dismissible for real — labeled button, Escape works, onDismiss persists the choice.",
    thumbnail: gradientThumbnail("#0b0e14", "#1a2030", "#d5ed9a"),
    controls: [
      { kind: "text", key: "message", label: "Message", default: "Orbit 2.4 is rolling out this week — release replays for every plan. (demo)", maxLength: 120 } as const,
      { kind: "toggle", key: "sticky", label: "Stick to top", default: true } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "message", type: "ReactNode", value: "The one important thing" },
      { name: "action", type: "{ label, href? , onClick? } | null", value: "Optional inline action" },
      { name: "dismissible / dismissLabel / onDismiss", type: "boolean / string / () => void", value: "Dismiss control; persist the choice yourself" },
      { name: "sticky", type: "boolean", value: "true; false keeps the strip inline in flow" },
      { name: "regionLabel", type: "string", value: "Landmark label, \"Announcement\" by default" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("announcement banner", [
      "Sticky banners overlay the top of the viewport; set sticky={false} for an in-flow strip. Escape dismisses while focus is inside.",
    ]),
  },
  {
    id: "block-milestones", importName: "BlockMilestones", label: "Block Milestones",
    tags: ["roadmap", "progress", "milestones", "steps"],
    description: "Milestone progress: a roadmap strip whose completed steps light up in sequence on scroll-in, the current step breathes, and upcoming steps stay dimmed. Which steps are done is pure data.",
    thumbnail: gradientThumbnail("#0b0e14", "#1a2030", "#d5ed9a"),
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "Where we are in the plan.", maxLength: 90 } as const,
      { kind: "range", key: "current", label: "Current step", min: 0, max: 3, step: 1, digits: 0, default: 0 } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "milestones", type: "readonly Milestone[]", value: "{ name, note?, current? }" },
      { name: "current", type: "number", value: "Index in progress; steps before it count as done" },
      { name: "demoNote", type: "ReactNode | null", value: "Fictional-roadmap marker; pass null with your plan" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("roadmap/milestone progress strip", [
      "The aria-label is \"Milestone progress\"; a vertical version renders on narrow screens. Reduced motion shows the settled strip.",
    ]),
  },
  {
    id: "block-quote-wall", importName: "BlockQuoteWall", label: "Block Quote Wall",
    tags: ["quotes", "testimonials", "masonry", "rotator"],
    description: "Quote wall: many quotes as a masonry wall, or one at a time in a keyboard-friendly rotator (real prev/next controls, focus and hover pause, reduced motion disables auto-advance).",
    thumbnail: gradientThumbnail("#0b0e14", "#1a2030", "#d5ed9a"),
    controls: [
      { kind: "text", key: "title", label: "Headline", default: "Field notes from release teams.", maxLength: 90 } as const,
      { kind: "choice", key: "mode", label: "Mode", default: "wall", options: [{ value: "wall", label: "Wall" }, { value: "rotator", label: "Rotator" }] } as const,
      color("accent", "Accent", "#d5ed9a"),
    ],
    api: [
      { name: "eyebrow / title / description", type: "ReactNode", value: "Section header" },
      { name: "quotes", type: "readonly WallQuote[]", value: "{ quote, name, role?, href? }" },
      { name: "mode", type: '"wall" | "rotator"', value: "wall; rotator shows one quote at a time" },
      { name: "interval / pauseOnHover", type: "number / boolean", value: "6000ms auto-advance; hover and focus pause it" },
      { name: "demoNote", type: "ReactNode | null", value: "Fictional-quotes marker; pass null with real customers" },
      ...BLOCK_API.shared,
    ],
    notes: BLOCK_COMMON_NOTES("testimonial/quote wall or rotator", [
      "Default quotes are invented on purpose and say so on screen — never ship them as real social proof.",
    ]),
  },
  {
    id: "example-launch", importName: "ExampleLaunch", label: "Example — Product Launch",
    tags: ["example", "landing", "launch", "product"],
    description: "Complete fictional software launch page (“Orbit” by Lumen Labs): hero, showcase, feature grid, tabs, scroll story, integrations, pricing, testimonials, FAQ, CTA and footer. All copy is demo content.",
    thumbnail: "/showcase/example-launch.png",
    controls: [],
    api: [
      { name: "className / style", type: "string / CSSProperties", value: "Applied to the page root" },
      { name: "(compose yourself)", type: "—", value: "The page composes ten blocks; copy it and delete or reorder any section" },
    ],
    notes: [
      "Purpose: proof that the blocks compose — a full launch page in one import. Every section is also installed separately.",
      "Content: fictional product \"Orbit\" by \"Lumen Labs\"; quotes and prices are invented and labeled. Links target in-page anchors or # demo routes.",
      "Requires: @vfx-ui/react. The complete example is DOM/CSS; its registry entry installs the referenced block-* items.",
      "Guardrails: give the page normal document flow (no fixed-height parent); anchors use scroll-margin so navigation never covers them.",
    ],
  },
  {
    id: "example-studio", importName: "ExampleStudio", label: "Example — Design Studio",
    tags: ["example", "portfolio", "studio", "services"],
    description: "Complete fictional design-studio page (Atelier North): daylight editorial hero, engagement steps, portfolio showcase, before/after slider, services grid, fixed-fee engagements, testimonials, FAQ and a typographic footer.",
    thumbnail: "/showcase/example-studio.png",
    controls: [],
    api: [
      { name: "className / style", type: "string / CSSProperties", value: "Applied to the page root" },
      { name: "(compose yourself)", type: "—", value: "The page composes nine blocks; copy it and delete or reorder any section" },
    ],
    notes: [
      "Purpose: proof of cross-scenario reuse — a services/portfolio page with a daylight palette, built from the same blocks as the launch example.",
      "Content: fictional studio \"Atelier North\"; clients, quotes and prices are invented and labeled on screen. Links target in-page anchors.",
      "Requires: @vfx-ui/react. The daylight composition, packaging artwork, hero and footer are DOM/CSS; the registry installs the referenced block-* items.",
      "Guardrails: the entire page uses the light scheme; the before/after slider is keyboard-operable without JS gestures.",
    ],
  },
].map((block) => entry({
  id: block.id,
  category: "Blocks",
  label: block.label,
  runtime: "dom",
  importName: block.importName,
  tags: ["block", ...block.tags],
  description: block.description,
  thumbnail: block.thumbnail,
  sourceCode: BLOCK_USAGE[block.id as keyof typeof BLOCK_USAGE],
  api: block.api,
  controls: block.id.startsWith("example-") ? block.controls : [...block.controls, { kind: "choice", key: "scheme", label: "Color scheme", default: "dark", options: [{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }] }],
  variants: [],
  agentNotes: block.notes,
}));

/* Replace the generic hero copy controls with the component's real defaults. */
function heroCopy(shader: ReadyShader, title: string, subtitle?: string): ReadyShader {
  return {
    ...shader,
    controls: shader.controls?.map((control) =>
      control.kind === "text" && control.key === "title" ? { ...control, default: title }
        : control.kind === "text" && control.key === "subtitle" && subtitle != null ? { ...control, default: subtitle }
        : control,
    ),
  };
}

export const READY_SHADERS: readonly ReadyShader[] = [
  ...STUDIO_HERO_ENTRIES,
  ...FOOTER_ENTRIES,
  ...BLOCK_ENTRIES,
  entry({
    id: "spectral-card", category: "Interactions", label: "Spectral Card", runtime: "dom",
    tags: ["card", "holographic", "pointer"], importName: "SpectralCard",
    description: "A touch of iridescence. Real content, spatial tilt, and light that follows you.",
    thumbnail: "/showcase/spectral-card.png",
    sourceCode: `import { SpectralCard } from "@vfx-ui/react";

export function Card() {
  return <SpectralCard><div style={{ padding: 40 }}><h2>Your content, in a new light.</h2><p>Any text, image or link belongs here.</p></div></SpectralCard>;
}`,
    controls: [
      { key: "tilt", label: "Tilt", min: 0, max: 24, step: 1, digits: 0, default: 12 },
      { key: "glare", label: "Light", min: 0, max: 1, step: .05, digits: 2, default: .6 },
    ], variants: [],
    agentNotes: ["Accepts children, tilt, glare, radius, disabled, className and style. Works without WebGPU. Touch and reduced-motion keep content still. Use native links/buttons inside children."],
  }),
  entry({
    id: "kinetic-text", category: "Text", label: "Kinetic Text", runtime: "dom",
    tags: ["text", "pointer", "typography"], importName: "KineticText",
    description: "Letters lift into a soft wave as your cursor passes through.",
    thumbnail: "/showcase/kinetic-text.png",
    sourceCode: `import { KineticText } from "@vfx-ui/react";

export function Headline() {
  return <h1><KineticText text="Feel something." strength={32} /></h1>;
}`,
    controls: [
      { kind: "text", key: "text", label: "Your words", default: "Feel something.", maxLength: 60 },
      { key: "strength", label: "Lift", min: 0, max: 60, step: 1, digits: 0, default: 32 },
      { key: "spread", label: "Field width", min: .05, max: .6, step: .01, digits: 2, default: .28 },
    ], variants: [],
    agentNotes: ["Accepts text, strength, spread, disabled, className and style. Wrap in a heading for heading semantics. Text has one accessible label; individual letters are hidden from screen readers. Respects reduced motion; no GPU dependency."],
  }),
  entry({
    id: "magnetic", category: "Interactions", label: "Magnetic", runtime: "dom",
    tags: ["button", "pointer", "magnetic"], importName: "Magnetic",
    description: "Give a button, link, or any small piece of content a gentle pull.",
    thumbnail: "/showcase/magnetic.png",
    sourceCode: `import { Magnetic } from "@vfx-ui/react";

export function Action() {
  return <Magnetic strength={18}><a href="/start">Get started</a></Magnetic>;
}`,
    controls: [{ key: "strength", label: "Pull", min: 0, max: 40, step: 1, digits: 0, default: 18 }],
    variants: [], agentNotes: ["Accepts children, strength, disabled, className and style. Supply your own link or button; its semantics are preserved. Stable outer hit area. Touch and reduced-motion disable movement. No WebGPU dependency."],
  }),
  entry({
    id: "hero-fluid",
    category: "Heroes",
    label: "Hero Fluid",
    tags: ["hero", "landing", "gradient", "fluid"],
    description: "Drop-in hero: centered headline over a GPU liquid-gradient field with real selectable text and scrim-backed contrast.",
    importName: "HeroFluid",
    thumbnail: "/showcase/hero-fluid.png",
    sourceCode: heroUsage("HeroFluid"),
    agentNotes: HERO_NOTES("liquid-gradient", "centered"),
    controls: [],
    variants: presetVariants(HERO_FLUID_PRESETS, {
      midnight: "Navy depths rising into electric blue.",
      magma: "Charcoal into rose with a hot highlight.",
      moss: "Deep green sea at a calm drift.",
    }, paletteThumb),
  }),
  entry({
    id: "hero-aurora",
    category: "Heroes",
    label: "Hero Aurora",
    tags: ["hero", "landing", "aurora", "night"],
    description: "Drop-in hero: bottom-left copy anchored under full-bleed aurora curtains rendered per-pixel on the GPU.",
    importName: "HeroAurora",
    thumbnail: "/showcase/hero-aurora.png",
    sourceCode: heroUsage("HeroAurora"),
    agentNotes: HERO_NOTES("aurora", "left"),
    controls: [],
    variants: presetVariants(HERO_AURORA_PRESETS, {
      glacier: "Teal curtains under a violet sky.",
      ember: "Orange-to-crimson fire aurora.",
      violet: "Violet and cyan bands, five curtains.",
    }, paletteThumb),
  }),
  entry({
    id: "hero-fiber",
    category: "Heroes",
    label: "Hero Fiber",
    tags: ["hero", "landing", "fibers", "silk"],
    description: "Drop-in hero: top-weighted headline over luminous silk fibers streaming through the dark.",
    importName: "HeroFiber",
    thumbnail: "/showcase/hero-fiber.png",
    sourceCode: heroUsage("HeroFiber"),
    agentNotes: HERO_NOTES("fiber-flow", "stacked"),
    controls: [],
    variants: presetVariants(HERO_FIBER_PRESETS, {
      indigo: "Indigo silk with a periwinkle sheen.",
      gold: "Molten gold threads, crisper edges.",
      rose: "Rose fibers at higher density.",
    }, paletteThumb),
  }),
  entry({
    id: "hero-globe",
    category: "Heroes",
    label: "Hero Globe",
    tags: ["hero", "landing", "globe", "split"],
    description: "Drop-in split hero: copy on the left, the dot-matrix cobe planet (the globe behind vercel.com) glowing on the right.",
    importName: "HeroGlobe",
    thumbnail: "/showcase/hero-globe.png",
    sourceCode: heroUsage("HeroGlobe"),
    agentNotes: [
      "Purpose: drop-in hero section — a full first screen with real, selectable DOM text (split layout) over the cobe dot-matrix globe (MIT, the globe behind vercel.com). Copy it, ship it.",
      "Mount: give the parent an explicit height (e.g. height: 100dvh or a min-height); the shell fills it and clamps its own type with container queries.",
      "Props: eyebrow, title (\\n breaks lines), subtitle, primaryCta, secondaryCta, scheme (\"dark\" | \"light\"), spin (rad/s, 0 holds the authored view), mapSamples, baseColor/markerColor/glowColor (0-1 rgb tuples), markers ([lat, lng, size]), globeProps (escape hatch merged into cobe update()).",
      "Interaction: the globe auto-rotates via a rAF loop driving cobe.update(); text and CTAs are plain DOM (WCAG AA scrim, screen-reader readable).",
      "Guardrails: requires the cobe peer (npm install cobe); the globe loads client-side only (SSR renders an inert canvas); prefers-reduced-motion renders one static frame; no texture or network assets — the dot matrix is procedural.",
    ],
    runtime: "webgl",
    controls: [],
    variants: presetVariants(HERO_GLOBE_PRESETS, {
      azure: "Blue glow with magenta city markers.",
      teal: "Teal glow for infra brands.",
      ember: "Amber glow, slower spin.",
    }, globeThumb),
  }),
  entry({
    id: "hero-mesh",
    category: "Heroes",
    label: "Hero Mesh",
    tags: ["hero", "landing", "gradient", "mesh"],
    description: "Drop-in hero: centered headline over a slow Voronoi mesh-gradient field — every frame a different poster.",
    importName: "HeroMesh",
    thumbnail: "/showcase/hero-mesh.png",
    sourceCode: heroUsage("HeroMesh"),
    agentNotes: HERO_NOTES("mesh-gradient", "centered"),
    controls: [],
    variants: presetVariants(HERO_MESH_PRESETS, {
      orchid: "Teal-violet-pink poster field.",
      citrus: "Amber and cream over charcoal.",
      arctic: "Ice-blue cells on deep navy.",
    }, paletteThumb),
  }),
  entry({
    id: "hero-iridescent",
    category: "Heroes",
    label: "Hero Iridescent",
    tags: ["hero", "landing", "holographic", "silk"],
    description: "Drop-in hero: left copy over a holographic thin-film sheen — the premium product-launch look.",
    importName: "HeroIridescent",
    thumbnail: "/showcase/hero-iridescent.png",
    sourceCode: heroUsage("HeroIridescent"),
    agentNotes: HERO_NOTES("iridescent", "left"),
    controls: [],
    variants: presetVariants(HERO_IRIDESCENT_PRESETS, {
      hologram: "Full-saturation holographic silk.",
      oil: "Oil-slick sheen, wider scale.",
      pearl: "Desaturated pearl finish.",
    }, iridescentThumb),
  }),
  entry({
    id: "hero-vortex",
    category: "Heroes",
    label: "Hero Vortex",
    tags: ["hero", "landing", "galaxy", "spiral"],
    description: "Drop-in hero: centered headline at the eye of a spiral galaxy with star speckles and trailing arms.",
    importName: "HeroVortex",
    thumbnail: "/showcase/hero-vortex.png",
    sourceCode: heroUsage("HeroVortex"),
    agentNotes: HERO_NOTES("vortex", "centered"),
    controls: [],
    variants: presetVariants(HERO_VORTEX_PRESETS, {
      indigo: "Indigo spiral with a pale core.",
      sol: "Three-arm golden galaxy.",
      nebula: "Pink nebula with a hotter core glow.",
    }, paletteThumb),
  }),
  entry({
    id: "hero-ribbon",
    category: "Heroes",
    label: "Hero Ribbon",
    tags: ["hero", "landing", "ribbon", "split"],
    description: "Drop-in split hero: copy left, three Gaussian light ribbons sweeping the right over a dot-matrix grid.",
    importName: "HeroRibbon",
    thumbnail: "/showcase/hero-ribbon.png",
    sourceCode: heroUsage("HeroRibbon"),
    agentNotes: HERO_NOTES("ribbon-field", "split"),
    controls: [],
    variants: presetVariants(HERO_RIBBON_PRESETS, {
      signal: "Balanced ribbons drifting right.",
      quiet: "Dimmer, slower — for dense pages.",
      surge: "Bright, fast, strong drift.",
    }, ribbonThumb),
  }),
  entry({
    id: "hero-particles",
    category: "Heroes",
    label: "Hero Particles",
    tags: ["hero", "landing", "particles"],
    description: "Drop-in hero: top-weighted headline with a badge row over a drifting GPU particle field.",
    importName: "HeroParticles",
    thumbnail: "/showcase/hero-particles.png",
    sourceCode: heroUsage("HeroParticles"),
    agentNotes: HERO_NOTES("particle-field", "stacked"),
    controls: [],
    variants: presetVariants(HERO_PARTICLES_PRESETS, {
      azure: "Classic blue particles.",
      mint: "Mint field, larger grains.",
      dune: "Amber dust at lower speed.",
    }, paletteThumb),
  }),
  entry({
    id: "hero-starfield",
    category: "Heroes",
    label: "Hero Starfield",
    tags: ["hero", "landing", "stars", "space"],
    description: "Drop-in hero: bottom-left copy under a twinkling hashed star grid with parallax drift.",
    importName: "HeroStarfield",
    thumbnail: "/showcase/hero-starfield.png",
    sourceCode: heroUsage("HeroStarfield"),
    agentNotes: HERO_NOTES("starfield", "left"),
    controls: [],
    variants: presetVariants(HERO_STARFIELD_PRESETS, {
      classic: "Steady blue-white field.",
      deep: "Denser, slower, violet-leaning.",
      warm: "Sparse gold stars, fast twinkle.",
    }, paletteThumb),
  }),

  entry({
    id: "hero-black-hole",
    category: "Heroes",
    label: "Hero Black Hole",
    tags: ["hero", "landing", "space", "black-hole", "physics"],
    description: "Drop-in hero: left copy beside a ray-traced accretion disk with relativistic beaming and a lensed star field.",
    importName: "HeroBlackHole",
    thumbnail: "/showcase/hero-black-hole.png",
    sourceCode: heroUsage("HeroBlackHole"),
    agentNotes: HERO_NOTES("black-hole", "left"),
    controls: [],
    variants: presetVariants(HERO_BLACK_HOLE_PRESETS, {
      interstellar: "The default Gargantua-adjacent disk.",
      gargantua: "Closer orbit, bigger disk, near edge-on.",
      ember: "Hotter, faster, denser smoke.",
    }, paletteThumb),
  }),
  entry({
    id: "hero-chroma",
    category: "Heroes",
    label: "Hero Chroma",
    tags: ["hero", "landing", "chromatic", "gradient", "pointer"],
    description: "Drop-in hero section: bottom-left copy over a four-edge liquid color field that floods toward the cursor's sweep direction.",
    importName: "HeroChroma",
    thumbnail: "/showcase/hero-chroma.png",
    sourceCode: heroUsage("HeroChroma"),
    agentNotes: HERO_NOTES("chroma-flow", "left"),
    controls: [],
    variants: presetVariants(HERO_CHROMA_PRESETS, {
      classic: "Midnight navy with blue above and amber at right.",
      dusk: "Violet dusk with pink and gold edges.",
      tide: "Cyan tide, wider bleed.",
    }, (props) => gradientThumbnail((props.baseColor as string) ?? "#071021", (props.upColor as string) ?? "#1d4ed8", (props.rightColor as string) ?? "#f59e0b")),
  }),

  entry({
    id: "wave-background",
    category: "Backgrounds",
    label: "Wave Background",
    tags: ["background", "gradient", "waves", "hero"],
    description: "Three layered sine bands sweeping over a tri-color gradient, rendered fully on the GPU via WebGPU.",
    importName: "WaveBackground",
    thumbnail: "/showcase/wave-background.png",
    sourceCode: WAVE_USAGE,
    agentNotes: [
      "Purpose: ambient full-bleed animated background; three layered sine bands over a tri-color gradient. GPU-only via WebGPU.",
      "Mount: absolutely-positioned or fixed layer behind content; canvas fills its parent, give the parent an explicit size.",
      "Props: speed (0-4), amplitude (0-2.5), frequency (0.5-6), from/to/accent hex colors.",
      "Pointer: moving the cursor sloshes the wave phase (x) and lifts the water level (y); interactive={false} pins the authored look.",
      "Guardrails: pass fallback for non-WebGPU clients; SSR renders an inert canvas; reduced-motion freezes automatically; do not stack multiple instances on one screen.",
    ],
    controls: [
      range("speed", "Speed", 0, 4, 0.05, 1),
      range("amplitude", "Amplitude", 0, 2.5, 0.05, 1),
      range("frequency", "Frequency", 0.5, 6, 0.1, 2.5),
      color("from", "From", "#020617"),
      color("to", "To", "#1d4ed8"),
      color("accent", "Accent", "#38bdf8"),
    ],
    variants: [
      { id: "subtle", label: "Subtle", description: "Slow, low-amplitude waves in muted slate tones.", thumbnail: gradientThumbnail("#020617", "#1e293b", "#64748b"), props: { speed: 0.35, amplitude: 0.55, frequency: 1.6, from: "#020617", to: "#1e293b", accent: "#64748b" } },
      { id: "classic", label: "Classic", description: "Navy depths rising into electric blue with a sky accent.", thumbnail: gradientThumbnail("#020617", "#1d4ed8", "#38bdf8"), props: { speed: 1, amplitude: 1, frequency: 2.5, from: "#020617", to: "#1d4ed8", accent: "#38bdf8" } },
      { id: "storm", label: "Storm", description: "Fast, tall waves over violet with a fuchsia accent.", thumbnail: gradientThumbnail("#0a0a0a", "#4c1d95", "#f0abfc"), props: { speed: 2.2, amplitude: 1.6, frequency: 3.4, from: "#0a0a0a", to: "#4c1d95", accent: "#f0abfc" } },
    ],
  }),

  entry({
    id: "fluid-gradient",
    category: "Backgrounds",
    label: "Fluid Gradient",
    tags: ["background", "fluid", "noise"],
    description: "Domain-warped fBm noise flowing through a curated palette — organic liquid color, zero video.",
    importName: "FluidGradient",
    thumbnail: "/showcase/fluid-gradient.png",
    sourceCode: fluidUsage("sunset"),
    agentNotes: [
      "Purpose: organic animated background built from domain-warped fractal noise; every frame is computed on the GPU.",
      "Mount: full-bleed layer behind content; the canvas fills its parent.",
      "Props: from/to/accent hex palette, speed, warp (distortion strength), scale (blob size, lower = larger).",
      "Pointer: the liquid plane parallax-shifts against the cursor; interactive={false} pins it.",
      "Guardrails: WebGPU required with fallback prop; reduced-motion aware; avoid more than one instance per viewport.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 0.45),
      range("warp", "Warp", 0.5, 4, 0.05, 2.6),
      range("scale", "Scale", 0.5, 5, 0.1, 1.5),
      color("from", "From", "#355c7d"),
      color("to", "To", "#6c5b7b"),
      color("accent", "Accent", "#c06c84"),
    ],
    variants: presetVariants(FLUID_PRESETS, {
      sunset: "Warm dusk palette with slow, heavy warping.",
      ocean: "Deep teal sea tones at a calm drift.",
      ember: "Charcoal and molten copper for dramatic heroes.",
    }, paletteThumb),
  }),

  entry({
    id: "aurora",
    category: "Backgrounds",
    label: "Aurora",
    tags: ["background", "aurora", "night"],
    description: "Polar-light curtains: fBm-perturbed Gaussian bands drifting across a near-black GPU sky.",
    importName: "Aurora",
    thumbnail: "/showcase/aurora.png",
    sourceCode: `import { Aurora, AURORA_PRESETS } from "@vfx-ui/react";

export function NightHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <Aurora {...AURORA_PRESETS.emerald} />
      <div style={{ position: "relative", zIndex: 1, padding: "10rem 2rem" }}>
        <h1>Northern lights, no video file</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: cinematic night-sky background with up to five animated light curtains; pairs well with white or light-accent typography.",
      "Mount: full-bleed fixed or absolute layer; keep content z-index above.",
      "Props: primary/secondary hex curtain colors, speed, intensity (brightness), bands (1-5).",
      "Pointer: the cursor sways the curtains sideways (x) and lifts them (y); interactive={false} pins them.",
      "Guardrails: designed for dark themes — on light themes lower intensity below 0.5; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 0.7),
      range("intensity", "Intensity", 0, 2, 0.05, 0.45),
      range("bands", "Bands", 1, 5, 1, 3),
      color("primary", "Primary", "#2dd4bf"),
      color("secondary", "Secondary", "#818cf8"),
    ],
    variants: presetVariants(AURORA_PRESETS, {
      emerald: "Classic green curtains with a cool blue mix.",
      violet: "Violet-to-pink ribbons, denser band count.",
      arctic: "Ice-blue curtains, calmer and sparser.",
    }, paletteThumb),
  }),

  entry({
    id: "starfield",
    category: "Backgrounds",
    label: "Starfield",
    tags: ["background", "stars", "space"],
    description: "Hashed star grid with twinkle and slow parallax drift — deep-space depth from one fullscreen pass.",
    importName: "Starfield",
    thumbnail: "/showcase/starfield.png",
    sourceCode: `import { Starfield, STARFIELD_PRESETS } from "@vfx-ui/react";

export function SpaceSection() {
  return (
    <section style={{ position: "relative", minHeight: "80vh" }}>
      <Starfield {...STARFIELD_PRESETS.midnight} />
      <div style={{ position: "relative", zIndex: 1, padding: "6rem 2rem" }}>
        <h2>Built for the dark</h2>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: subtle animated star backdrop for dark sections; cheapest of the background effects (few ALU ops per pixel).",
      "Mount: absolute layer inside any sized container; safe to run several instances per page.",
      "Props: color (star tint), density (0-1 star coverage), twinkle (0-1), speed (drift rate).",
      "Pointer: the three star layers parallax against the cursor, near layers shifting most; interactive={false} pins them.",
      "Guardrails: on light backgrounds set color to a dark tone or visibility suffers; WebGPU required with fallback prop.",
    ],
    controls: [
      range("density", "Density", 0, 1, 0.01, 0.4),
      range("twinkle", "Twinkle", 0, 1, 0.01, 0.85),
      range("speed", "Speed", 0, 3, 0.05, 1),
      color("color", "Star color", "#d6e4ff"),
    ],
    variants: presetVariants(STARFIELD_PRESETS, {
      midnight: "Cool white stars at a calm drift.",
      golden: "Warm starlight, sparse and quiet.",
      nebula: "Lavender-tinted stars with fast twinkle.",
    }, paletteThumb),
  }),

  entry({
    id: "particle-field",
    category: "Backgrounds",
    label: "Particle Field",
    tags: ["background", "particles"],
    description: "Procedural cell-hashed particles with drift and size breathing — a living texture, no sprite sheet.",
    importName: "ParticleField",
    thumbnail: "/showcase/particle-field.png",
    sourceCode: `import { ParticleField, PARTICLE_PRESETS } from "@vfx-ui/react";

export function AmbientBanner() {
  return (
    <div style={{ position: "relative", height: 420 }}>
      <ParticleField {...PARTICLE_PRESETS.frost} />
      <div style={{ position: "relative", zIndex: 1 }}>…</div>
    </div>
  );
}`,
    agentNotes: [
      "Purpose: soft ambient particle texture for banners and cards; reads as depth rather than decoration when kept below 0.5 density.",
      "Mount: absolute layer inside a sized container.",
      "Props: color, density (0-1), size (0-1 dot scale), speed.",
      "Pointer: parallax viewpoint offset, near bokeh orbs shifting most; interactive={false} pins it.",
      "Guardrails: keep density under 0.6 for legibility of overlaid text; WebGPU required with fallback prop.",
    ],
    controls: [
      range("density", "Density", 0, 1, 0.01, 0.45),
      range("size", "Size", 0, 1, 0.01, 0.16),
      range("speed", "Speed", 0, 3, 0.05, 0.8),
      color("color", "Color", "#a8d8ff"),
    ],
    variants: presetVariants(PARTICLE_PRESETS, {
      frost: "Icy blue motes, medium density.",
      blossom: "Soft pink petals drifting slowly.",
      ember: "Warm sparks rising faster.",
    }, paletteThumb),
  }),

  entry({
    id: "glass-card", category: "Glass", label: "Glass Card", tags: ["glass", "optical", "refraction"],
    description: "Thick-cut glass over a printed studio scene. Beveled edges split light while the solid tilts toward your pointer.",
    importName: "GlassCard", thumbnail: "/showcase/glass-card.png",
    sourceCode: `import { GlassCard } from "@vfx-ui/react";

export function GlassPanel() {
  return <div style={{ height: 520 }}><GlassCard interactive /></div>;
}`,
    agentNotes: [
      "Original ray-marched rounded solid with entry/exit refraction, Fresnel reflections and thickness-dependent absorption.",
      "The printed scene is procedural; this component does not refract arbitrary DOM behind the canvas.",
      "children accepts real DOM content above the artwork. No demonstration copy is built in.",
      "Pointer tilts the solid. Set interactive=false for autonomous studio motion. Reduced motion freezes time and disables pointer motion.",
      "Provide a sized parent. Existing preset IDs and props remain supported; their visual rendering has been replaced.",
    ],
    controls: [range("radius", "Bevel", 0.015, 0.12, 0.005, 0.05), range("borderGlow", "Edge reflection", 0, 2, 0.05, 0.7), range("shine", "Dispersion", 0, 2, 0.05, 0.8), range("cardScale", "Size", 0.2, 0.85, 0.01, 0.62), color("tint", "Glass tint", "#e4edf0")],
    variants: presetVariants(GLASS_CARD_PRESETS, { frosted: "Clear cool glass with a polished bevel.", champagne: "Warm optical glass with amber absorption.", rose: "Rose-tinted glass with a narrower bevel." }, () => "/showcase/glass-card.png"),
  }),
  entry({
    id: "liquid-glass", category: "Glass", label: "Liquid Glass", tags: ["glass", "sculpture", "liquid"],
    description: "A molten glass loop. Travelling waves reshape its silhouette and the image transmitted through it.",
    importName: "LiquidGlass", thumbnail: "/showcase/liquid-glass.png",
    sourceCode: `import { LiquidGlass } from "@vfx-ui/react";

export function GlassStudy() {
  return <div style={{ height: 520 }}><LiquidGlass interactive /></div>;
}`,
    agentNotes: ["Original ray-marched glass annulus with moving geometry, spectral transmission and studio reflections.", "Procedural printed backdrop; arbitrary DOM is not sampled. Mount inside a sized parent.", "Pointer tilts the sculpture. Distortion reshapes the silhouette; chromatic controls spectral separation; scale changes the travelling wave tempo.", "The previous contour-line field has been replaced. Existing prop names and preset IDs remain valid."],
    controls: [range("speed", "Speed", 0, 2, 0.05, 0.6), range("distortion", "Deformation", 0, 2, 0.05, 0.3), range("chromatic", "Dispersion", 0, 2, 0.05, 0.4), range("scale", "Wave frequency", 0.3, 3, 0.05, 1)],
    variants: presetVariants(LIQUID_GLASS_PRESETS, { calm: "A slowly breathing glass loop.", storm: "Stronger waves reshape the silhouette.", velvet: "Broad, languid deformations." }, () => "/showcase/liquid-glass.png"),
  }),
  entry({
    id: "glass-lens", category: "Glass", label: "Glass Lens", tags: ["glass", "lens", "optical"],
    description: "A biconvex lens: magnification through the center, inversion at the edges, and fine spectral fringes.",
    importName: "GlassLens", thumbnail: "/showcase/glass-lens.png",
    sourceCode: `import { GlassLens } from "@vfx-ui/react";

export function LensStudy() {
  return <div style={{ height: 520 }}><GlassLens interactive /></div>;
}`,
    agentNotes: ["Original three-dimensional biconvex lens; the light ray passes through both air/glass interfaces.", "The printed backdrop is procedural, not a DOM backdrop filter. No copy is built in.", "Pointer tilts the lens. Refraction controls refractive index, dispersion splits RGB, blur softens the material response, rim adjusts Fresnel reflection.", "Provide a sized parent. Existing preset IDs remain valid."],
    controls: [range("speed", "Speed", 0, 2, 0.05, 1), range("refraction", "Refraction", 0, 2, 0.05, 0.85), range("dispersion", "Dispersion", 0, 2, 0.05, 0.7), range("blur", "Softness", 0, 2, 0.05, 0.8), range("rim", "Reflection", 0, 2, 0.05, 0.9), color("tint", "Glass tint", "#e0eef4")],
    variants: presetVariants(GLASS_LENS_PRESETS, { aqua: "Cool, clear optical glass.", prism: "A higher refractive index and stronger spectral separation.", honey: "Warm transmission with a softer reflection." }, () => "/showcase/glass-lens.png"),
  }),
  entry({
    id: "astra-field", category: "Backgrounds", label: "Astra Field", runtime: "webgl", tags: ["galaxy", "particles", "stars", "hero"],
    description: "A spiral written in starlight. Cool stellar dust, warm distant suns and a luminous core, suspended in a deep blue field.",
    importName: "AstraField", thumbnail: "/showcase/astra-field.png",
    sourceCode: `import { AstraField } from "@vfx-ui/react";

export function Galaxy() {
  return <div style={{ height: 640 }}><AstraField interactive /></div>;
}`,
    agentNotes: ["Original WebGL point-sprite implementation inspired by the OpenAI Astra page; no remote assets or Three.js dependency.", "Stars gather from a scattered 3D cloud into the spiral on mount (4.8 seconds). intro=false skips assembly; introDuration changes its duration independently of ambient speed. Restart animation replays it. Reduced motion shows the finished field immediately.", "shape chooses the six-shaped spiral or a galaxy. Drag and arrow keys rotate; Home resets. All copy belongs in your own DOM.", "Seeded particles, additive stellar glow, DPR capped at 1.5, 45fps. Hidden and offscreen scenes pause; reduced motion freezes ambient movement."],
    controls: [{ kind: "toggle", key: "intro", label: "Gather stars on entry", default: true }, range("introDuration", "Gather duration", 1, 10, .1, 4.8), { kind: "choice", key: "shape", label: "Shape", default: "six", options: [{value:"six",label:"Six"},{value:"galaxy",label:"Galaxy"}] }, color("color", "Starlight", "#8cbeed"), range("intensity", "Brightness", .2, 2, .05, 1), range("speed", "Speed", 0, 2, .05, .35)],
    variants: presetVariants(ASTRA_FIELD_PRESETS, {astra:"An extended spiral of ice and gold starlight.",galaxy:"A compact spiral galaxy.",ember:"Warm stellar dust in a dark sky."},()=>"/showcase/astra-field.png"),
  }),
  entry({
    id: "radiant-dots", category: "Backgrounds", label: "Radiant Dots", tags: ["radiance", "dots", "light", "loading"],
    description: "A constellation of light. Each dot emits and occludes, sending soft illumination through a real radiance-cascade field.",
    importName: "RadiantDots", thumbnail: "/showcase/radiant-dots.png",
    sourceCode: `import { RadiantDots } from "@vfx-ui/react";

export function LightField() {
  return <div style={{ height: 520 }}><RadiantDots interactive /></div>;
}`,
    agentNotes: ["Real multi-pass radiance cascades adapted from Vercel's MIT Agent Radiance Cascades example. Original orbit/grid layouts replace the Agent mark.", "Jump flood -> signed distance field -> up to six cascades -> HDR presentation. The working field is capped at 320px; updates are capped at 30fps.", "layout chooses orbit/grid; motion chooses wave/chase/pulse; color sets emitters; intensity sets exposure; speed sets tempo.", "interactive illuminates dots near the pointer. animate=false freezes time. Offscreen, hidden-tab and reduced-motion states suspend continuous rendering.", "Decorative effect only. If used as a loading indicator, provide a separate accessible status in your own DOM."],
    controls: [
      { kind: "choice", key: "layout", label: "Arrangement", default: "orbit", options: [{ value: "orbit", label: "Orbit" }, { value: "grid", label: "Grid" }] },
      { kind: "choice", key: "motion", label: "Light sequence", default: "wave", options: [{ value: "wave", label: "Wave" }, { value: "chase", label: "Chase" }, { value: "pulse", label: "Pulse" }] },
      color("color", "Light color", "#eff5ff"), range("intensity", "Exposure", 0.2, 2, 0.05, 1), range("speed", "Speed", 0, 2, 0.05, 0.7),
      { kind: "toggle", key: "animate", label: "Animate", default: true },
    ],
    variants: presetVariants(RADIANT_DOTS_PRESETS, { pearl: "Pearl light spreading through an orbital arrangement.", ember: "Warm emitters taking turns across a square field.", ice: "An icy light chasing around the orbit." }, () => "/showcase/radiant-dots.png"),
  }),

  entry({
    id: "mesh-gradient",
    category: "Backgrounds",
    label: "Mesh Gradient",
    tags: ["background", "gradient", "voronoi"],
    description: "Voronoi-cell color fields flowing through a curated palette — the classic mesh-gradient look, live on the GPU.",
    importName: "MeshGradient",
    thumbnail: "/showcase/mesh-gradient.png",
    sourceCode: `import { MeshGradient, MESH_GRADIENT_PRESETS } from "@vfx-ui/react";

export function MeshHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <MeshGradient {...MESH_GRADIENT_PRESETS.aurora} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Color fields, computed live</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: animated mesh-gradient background for product heroes and pricing walls.",
      "Mount: full-bleed layer behind content.",
      "Props: from/to/accent/deep palette, speed, scale (cell size, lower = larger), softness (edge crispness).",
      "Pointer: the color field drifts with the cursor; interactive={false} pins it.",
      "Guardrails: four-color palette — keep at least one dark tone for text contrast; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 0.6),
      range("scale", "Scale", 0.5, 6, 0.1, 3.2),
      range("softness", "Softness", 0, 0.3, 0.005, 0.09),
      color("from", "From", "#0b1120"),
      color("to", "To", "#155e75"),
      color("accent", "Accent", "#7c3aed"),
      color("deep", "Deep", "#f472b6"),
    ],
    variants: presetVariants(MESH_GRADIENT_PRESETS, {
      aurora: "Deep navy into teal and violet cells.",
      sunset: "Indigo, magenta and amber field.",
      ember: "Charcoal with molten red-gold cells.",
    }, paletteThumb),
  }),

  entry({
    id: "iridescent",
    category: "Backgrounds",
    label: "Iridescent",
    tags: ["background", "holographic", "silk"],
    description: "Thin-film interference colors drifting as silk — cosine-palette holography in a single pass.",
    importName: "Iridescent",
    thumbnail: "/showcase/iridescent.png",
    sourceCode: `import { Iridescent, IRIDESCENT_PRESETS } from "@vfx-ui/react";

export function IridescentHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <Iridescent {...IRIDESCENT_PRESETS.pearl} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Holographic, minus the video</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: holographic/silk background for brand moments; reads best with dark overlays and white type.",
      "Mount: full-bleed layer behind content.",
      "Props: speed, scale, hueShift (palette rotation), saturation, brightness.",
      "Pointer: cursor x rotates the hue and y tilts the silk sheen; interactive={false} pins both.",
      "Guardrails: saturation below 0.5 turns it gray — keep above 0.7 unless desaturation is intentional; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 0.8),
      range("scale", "Scale", 0.5, 5, 0.1, 2.4),
      range("hueShift", "Hue shift", 0, 1, 0.01, 0),
      range("saturation", "Saturation", 0, 1.5, 0.05, 1),
      range("brightness", "Brightness", 0.2, 1.5, 0.05, 0.9),
    ],
    variants: presetVariants(IRIDESCENT_PRESETS, {
      pearl: "Soft pearl sheen at a calm pace.",
      oil: "Oil-slick saturation, fast and loud.",
      deepSea: "Muted teal-silk at low brightness.",
    }, iridescentThumb),
  }),

  entry({
    id: "vortex",
    category: "Backgrounds",
    label: "Vortex",
    tags: ["background", "galaxy", "spiral"],
    description: "Spiral galaxy with logarithmic arms, hashed starlight and a breathing core.",
    importName: "Vortex",
    thumbnail: "/showcase/vortex.png",
    sourceCode: `import { Vortex, VORTEX_PRESETS } from "@vfx-ui/react";

export function GalaxyHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <Vortex {...VORTEX_PRESETS.galaxy} />
      <div style={{ position: "relative", zIndex: 1, padding: "10rem 2rem" }}>
        <h1>Pull them in</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: galaxy/swirl backdrop for launch heroes; center-weighted so content works best offset to one side.",
      "Mount: full-bleed layer behind content.",
      "Props: color (dust), emission (core/stars), speed, swirl (tightness), arms (arm count), coreGlow.",
      "Pointer: the vortex center leans toward the cursor; interactive={false} pins it.",
      "Guardrails: transparent background by design — place over a dark solid; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 0.45),
      range("swirl", "Swirl", 0.5, 6, 0.05, 2.4),
      range("arms", "Arms", 1, 6, 1, 2),
      range("coreGlow", "Core glow", 0, 3, 0.05, 1.2),
      color("color", "Dust", "#818cf8"),
      color("emission", "Core", "#e0f2fe"),
    ],
    variants: presetVariants(VORTEX_PRESETS, {
      galaxy: "Violet arms with a white-hot core.",
      hurricane: "Tight cyan spiral, fast rotation.",
      ember: "Orange inferno with a heavy core.",
    }, paletteThumb),
  }),

  entry({
    id: "black-hole",
    category: "Backgrounds",
    label: "Black Hole",
    tags: ["background", "space", "black-hole", "ray-tracing", "physics"],
    description: "The vgpu optimized-black-hole example as a drop-in component: a baked null-geodesic G-buffer, 4×4 photon-ring AA, animated disk shading, and HDR bloom — a verbatim port of the official pipeline (MIT, Vercel).",
    importName: "BlackHole",
    thumbnail: "/showcase/black-hole.png",
    sourceCode: `import { BlackHole, BLACK_HOLE_PRESETS } from "@vfx-ui/react";

export function PhysicsHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <BlackHole {...BLACK_HOLE_PRESETS.interstellar} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Bend spacetime, not your budget</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: the most physics-accurate background in the library — the real vgpu optimized-black-hole pipeline. Bake pass integrates one null geodesic per pixel (a = -1.5·h²·x/r⁵) into a G-buffer; refine measures 4×4 photon-ring coverage; shade animates the disk (thermal ramp, shear, Doppler beaming, redshift) over a prefiltered lensed star field; bloom + ACES composite the output.",
      "Mount: full-bleed opaque layer (near-black sky + stars) in a sized container; it owns its own canvas and resize handling. centerX/centerY frame the hole in NDC -1..1 (the example's desktop defaults are 0.8/0.3).",
      "Props: distance (camera orbit, horizon=1), diskRadius, fov, tilt (elevation rad), brightness, turbulence, density, doppler, stars (tint spread), roll, centerFade, bloom.",
      "Performance: the expensive bake runs once per geometry change; animation only re-shades (the example's core trick). Still the heaviest component here — one instance per page, desktop-first.",
      "Pointer: interactive={true} leans the scene yaw toward the cursor (the example's mouseYaw), applied per-frame without re-baking.",
      "Guardrails: WebGPU required with graceful fallback; SSR renders an inert canvas; prefers-reduced-motion bakes one static frame.",
    ],
    controls: [
      range("speed", "Speed", 0, 2, 0.05, 0.75),
      range("distance", "Distance", 8, 24, 0.1, 13.5),
      range("diskRadius", "Disk radius", 4, 16, 0.1, 9),
      range("tilt", "Tilt", 0, 1.3, 0.01, 0.16),
      range("brightness", "Brightness", 0.1, 2, 0.05, 0.75),
      range("doppler", "Doppler", 0, 2.5, 0.05, 1.21),
      range("centerX", "Center X", -1, 1, 0.01, 0),
      range("centerY", "Center Y", -1, 1, 0.01, 0),
    ],
    variants: presetVariants(BLACK_HOLE_PRESETS, {
      interstellar: "The example's desktop framing — hole right of center.",
      centered: "Hole dead center for symmetric layouts.",
      gargantua: "Closer orbit, taller disk, almost edge-on.",
      topDown: "High camera elevation, full spiral visible.",
      ember: "Hotter, denser, faster smoke.",
    }, paletteThumb),
  }),



  entry({
    id: "ribbon-field",
    category: "Backgrounds",
    label: "Ribbon Field",
    tags: ["background", "ribbon", "dots", "glow"],
    description: "Three Gaussian light ribbons drifting over a dot-matrix grid with bloom cores and film grain — WGSL port of ThreeUI's RibbonField (MIT).",
    importName: "RibbonField",
    thumbnail: "/showcase/ribbon-field.png",
    sourceCode: `import { RibbonField, RIBBON_FIELD_PRESETS } from "@vfx-ui/react";

export function RibbonHero() {
  return (
    <div style={{ position: "relative", width: "100%", height: 420 }}>
      <RibbonField {...RIBBON_FIELD_PRESETS.classic} />
    </div>
  );
}`,
    agentNotes: [
      "Purpose: dark hero/backdrop with three drifting light ribbons on a dot-matrix grid; reads as a high-tech data surface.",
      "Mount: wide container (hero band); opaque near-black base — no background needed behind it.",
      "Props: speed, intensity (ribbon brightness), drift (-1..1 horizontal sway), grain (micro-noise strength).",
      "Pointer: ribbon drift follows the cursor x (the original threeui interaction); interactive={false} pins drift to the prop.",
      "Guardrails: the dot grid is pixel-true (component measures its own backing store); keep the canvas unscaled (no CSS transform) or dots blur; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("intensity", "Intensity", 0, 2, 0.05, 1),
      range("drift", "Drift", -1, 1, 0.05, 0),
      range("grain", "Grain", 0, 2, 0.05, 1),
    ],
    variants: presetVariants(RIBBON_FIELD_PRESETS, {
      classic: "Original three-ribbon teal/cyan field.",
      calm: "Slower, dimmer, left-leaning drift.",
      vivid: "Brighter ribbons with heavier grain.",
    }, ribbonThumb),
  }),

  entry({
    id: "fiber-flow",
    category: "Backgrounds",
    label: "Fiber Flow",
    tags: ["background", "fibers", "silk", "flow", "waves"],
    description: "Luminous silk fibers streaming through the dark — a domain-warped fbm ridge field with strands that ebb and flow, pointer parallax and a soft cursor glow. Original vfx-ui design.",
    importName: "FiberFlow",
    thumbnail: "/showcase/fiber-flow.png",
    sourceCode: `import { FiberFlow, FIBER_FLOW_PRESETS } from "@vfx-ui/react";

export function FiberHero() {
  return (
    <div style={{ position: "relative", width: "100%", height: 420 }}>
      <FiberFlow {...FIBER_FLOW_PRESETS.classic} />
    </div>
  );
}`,
    agentNotes: [
      "Purpose: dark hero/backdrop of flowing luminous fiber strands (silk-wave family) — an original vfx-ui implementation (value-noise fbm + domain warp + ridge comb), not a port of any third-party code.",
      "Mount: full-bleed hero band (100% x 420px+); opaque near-black indigo base — no background needed behind it.",
      "Props: speed, intensity, scale (field zoom), strands (fiber density), sharp (edge crispness), from/to/accent (deep/mid/sheen colors).",
      "Pointer: interactive is off by default (field stays pinned to center); set interactive to parallax the field toward the cursor with a soft glow pocket — keep off for a calm static backdrop.",
      "Guardrails: pointer glow is gated by pActive so the resting render is pointer-independent; text overlays sit fine above (z-index); WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("intensity", "Intensity", 0, 2, 0.05, 1),
      range("scale", "Scale", 0.5, 3.5, 0.05, 1.6),
      range("strands", "Strands", 8, 40, 1, 22),
      range("sharp", "Sharpness", 2, 12, 0.5, 6),
      color("from", "Deep", "#1e1b4b"),
      color("to", "Mid", "#4f46e5"),
      color("accent", "Sheen", "#a5b4fc"),
    ],
    variants: presetVariants(FIBER_FLOW_PRESETS, {
      classic: "Indigo silk under moonlight.",
      ocean: "Cool cyan current, denser strands.",
      ember: "Slow warm ember ribbons.",
    }, paletteThumb),
  }),

  entry({
    id: "chroma-flow",
    category: "Backgrounds",
    label: "Chroma Flow",
    tags: ["background", "gradient", "chromatic", "pointer", "hero"],
    description: "Four-edge liquid color field on a midnight base — the palette sloshes from the edges in whichever direction the cursor sweeps. Original vfx-ui design.",
    importName: "ChromaFlow",
    thumbnail: "/showcase/chroma-flow.png",
    sourceCode: `import { ChromaFlow, CHROMA_FLOW_PRESETS } from "@vfx-ui/react";

export function ChromaHero() {
  return (
    <div style={{ position: "relative", width: "100%", height: 420 }}>
      <ChromaFlow {...CHROMA_FLOW_PRESETS.classic} />
    </div>
  );
}`,
    agentNotes: [
      "Purpose: full-bleed living color backdrop — base gradient with top/bottom/left/right edge colors that bleed inward; an original vfx-ui implementation (fbm-noise bleed boundaries + pointer velocity), not a port of any third-party code.",
      "Mount: full-bleed hero band (100% x 420px+); opaque base — no background needed behind it.",
      "Props: speed (ambient drift), intensity, radius (how far edges bleed), momentum (sweep sensitivity), ambient (resting bleed 0..1), baseColor/upColor/downColor/leftColor/rightColor.",
      "Pointer: interactive is off by default (calm ambient slosh, pointer-independent); set interactive to flood edge colors toward the cursor's sweep direction — the effect self-decays as the pointer settles.",
      "Guardrails: velocity is per-frame eased delta so it never gets stuck; pActive gates the glow pocket; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("intensity", "Intensity", 0, 2, 0.05, 1),
      range("radius", "Bleed radius", 0.2, 1.4, 0.05, 0.45),
      range("momentum", "Momentum", 4, 40, 1, 16),
      range("ambient", "Ambient", 0, 0.8, 0.02, 0.55),
      color("baseColor", "Base", "#071021"),
      color("upColor", "Top", "#1d4ed8"),
      color("downColor", "Bottom", "#cbd5e1"),
      color("leftColor", "Left", "#0ea5e9"),
      color("rightColor", "Right", "#f59e0b"),
    ],
    variants: presetVariants(CHROMA_FLOW_PRESETS, {
      classic: "Midnight navy, electric blue above, amber at right.",
      dusk: "Violet dusk with pink and gold edges.",
      tide: "Cyan tide with a wider bleed.",
    }, (props) => gradientThumbnail((props.baseColor as string) ?? "#071021", (props.upColor as string) ?? "#1d4ed8", (props.rightColor as string) ?? "#f59e0b")),
  }),

  entry({
    id: "light-prism",
    category: "Glass",
    label: "Light Prism",
    tags: ["glass", "prism", "refraction", "hero", "paper"],
    description: "A solid optical prism with internal reflections, spectral caustics and a textured light field. Powered by Vercel’s complete MIT prism pipeline.",
    importName: "LightPrism",
    thumbnail: "/showcase/light-prism.png",
    sourceCode: `import { LightPrism, LIGHT_PRISM_PRESETS } from "@vfx-ui/react";

export function PrismHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <LightPrism {...LIGHT_PRISM_PRESETS.paper} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Refract the ordinary</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Vercel VGPU MIT light pipeline: actual beveled prism geometry, spectral ray optics, HDR environment, wall bake, back/front glass and caustic passes.",
      "Adapted from the public Vercel source with its MIT license. All assets are embedded; no external network requests.",
      "The compatibility LIGHT_PRISM_SHADER export is deprecated; the component renders a complete multi-pass pipeline.",
      "Mount in a sized parent. Pointer orbits the solid and changes the incident beam. The legacy to/accent props are deprecated; spectral colors come from optical dispersion.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("prismSize", "Prism size", 0.15, 0.45, 0.005, 0.3),
      range("beamWidth", "Beam width", 0.002, 0.012, 0.0005, 0.0045),
      range("refraction", "Refraction", 0, 0.4, 0.01, 0.16),
      range("dispersion", "Dispersion", 0, 3, 0.05, 0.22),
      range("shadow", "Shadow", 0, 1.5, 0.05, 1),
      color("from", "Paper", "#d2ccc2"),
    ],
    variants: presetVariants(LIGHT_PRISM_PRESETS, {
      paper: "Warm paper, white beam — the default editorial look.",
      moonstone: "Cool blue-grey paper with strong spectral fringes.",
      amber: "Kraft paper under a warm amber beam.",
    }, paletteThumb),
  }),

  /* ---- 2026-09 batch B: hero cuts ----
   * TODO(showcase): real /showcase/*.png stills are not captured for this
   * batch yet; these entries carry generated gradient placeholders built from
   * each preset's palette. Swap thumbnail to `/showcase/<id>.png` once stills
   * exist. */
  heroCopy(entry({
    id: "hero-aurora-editorial", category: "Heroes", label: "Hero Aurora Editorial",
    tags: ["hero", "landing", "aurora", "editorial", "serif"],
    description: "Drop-in hero: a centered serif masthead — display title, two standfirst lines, dual CTAs — under full-bleed aurora curtains, with a radial scrim holding WCAG AA contrast.",
    importName: "HeroAuroraEditorial",
    thumbnail: gradientThumbnail("#06131c", "#2dd4bf", "#818cf8"),
    sourceCode: heroUsage("HeroAuroraEditorial"),
    agentNotes: HERO_NOTES("aurora", "centered"),
    controls: [],
    variants: presetVariants(HERO_AURORA_EDITORIAL_PRESETS, {
      press: "Teal and indigo curtains behind the masthead.",
      midnight: "Five violet-blue bands at a calmer drift.",
      dawn: "Amber and pink — first light over the fold.",
    }, paletteThumb),
  }), "Letters written\nin light.", "One aurora, computed per-pixel behind your headline — no two visits see the same sky twice."),

  heroCopy(entry({
    id: "hero-starfield-split", category: "Heroes", label: "Hero Starfield Split",
    tags: ["hero", "landing", "stars", "split", "badges"],
    description: "Drop-in split hero: copy left, a badge wall in frosted chips right, so the twinkling star grid reads as the trust-panel backdrop.",
    importName: "HeroStarfieldSplit",
    thumbnail: gradientThumbnail("#04060f", "#0b1120", "#d0e4ff"),
    sourceCode: heroUsage("HeroStarfieldSplit"),
    agentNotes: HERO_NOTES("starfield", "split"),
    controls: [],
    variants: presetVariants(HERO_STARFIELD_SPLIT_PRESETS, {
      ops: "Blue-white operations field at a working drift.",
      golden: "Sparse warm starlight, quiet twinkle.",
      nebula: "Denser lavender stars, faster twinkle.",
    }, paletteThumb),
  }), "Every launch,\nplotted in stars.", "A hashed star grid with twinkle and parallax drift on the right of your copy — the space-tech look without the space-program budget."),

  heroCopy(entry({
    id: "hero-vortex-centered", category: "Heroes", label: "Hero Vortex Centered",
    tags: ["hero", "landing", "galaxy", "spiral", "centered"],
    description: "Drop-in hero: the eye-of-the-storm cut — a tighter, slower spiral whose bright core lands exactly behind a short centered headline.",
    importName: "HeroVortexCentered",
    thumbnail: paletteThumb({ color: "#6366f1", emission: "#e0f2fe" }),
    sourceCode: heroUsage("HeroVortexCentered"),
    agentNotes: HERO_NOTES("vortex", "centered"),
    controls: [],
    variants: presetVariants(HERO_VORTEX_CENTERED_PRESETS, {
      eye: "Indigo arms with a pale core at reading height.",
      storm: "Slate storm, five arms, heavy core glow.",
      pinwheel: "Pink and gold pinwheel, faster turn.",
    }, paletteThumb),
  }), "Calm at the\ncenter.", "A tight spiral galaxy, slowed to a breath, with your headline sitting in the still eye where the arms never reach."),

  heroCopy(entry({
    id: "hero-mesh-bold", category: "Heroes", label: "Hero Mesh Bold",
    tags: ["hero", "landing", "gradient", "mesh", "poster"],
    description: "Drop-in hero: the poster cut — one oversized ultra-bold headline shouting over a vivid Voronoi mesh field. Keep the title short; the type is drawn to fill the frame.",
    importName: "HeroMeshBold",
    thumbnail: paletteThumb({ from: "#140b24", to: "#7c3aed", accent: "#ec4899" }),
    sourceCode: heroUsage("HeroMeshBold"),
    agentNotes: HERO_NOTES("mesh-gradient", "centered"),
    controls: [],
    variants: presetVariants(HERO_MESH_BOLD_PRESETS, {
      poster: "Violet and pink poster field with a gold spark.",
      citrus: "Lime and amber over charcoal.",
      ultraviolet: "Blue-cyan cells at a livelier tempo.",
    }, paletteThumb),
  }), "Make noise.\nBe heard.", "One sentence, one shader, nothing else in the way."),

  heroCopy(entry({
    id: "hero-fiber-top", category: "Heroes", label: "Hero Fiber Top",
    tags: ["hero", "landing", "fibers", "silk", "studio"],
    description: "Drop-in hero: a left-set masthead pressed against the top edge while the silk-fiber field streams beneath it — fibers carry the lower two-thirds, the scrim carries the type.",
    importName: "HeroFiberTop",
    thumbnail: paletteThumb({ from: "#1e1b4b", to: "#4f46e5", accent: "#a5b4fc" }),
    sourceCode: heroUsage("HeroFiberTop"),
    agentNotes: HERO_NOTES("fiber-flow", "stacked"),
    controls: [],
    variants: presetVariants(HERO_FIBER_TOP_PRESETS, {
      classic: "Indigo silk under moonlight.",
      ocean: "Cool cyan current, slower stream.",
      ember: "Warm amber threads, faster flow.",
    }, paletteThumb),
  }), "Work woven\nfrom light.", "Luminous silk fibers streaming through the dark, computed per-pixel. Your name goes at the top; the current does the rest."),

  heroCopy(entry({
    id: "hero-chroma-full", category: "Heroes", label: "Hero Chroma Full",
    tags: ["hero", "landing", "chromatic", "gradient", "full-bleed"],
    description: "Drop-in hero: the full-bleed cut — the four-edge chroma field runs wall to wall with copy anchored bottom-left over the side scrim, a dusk palette by default.",
    importName: "HeroChromaFull",
    thumbnail: gradientThumbnail("#071021", "#1d4ed8", "#f59e0b"),
    sourceCode: heroUsage("HeroChromaFull"),
    agentNotes: HERO_NOTES("chroma-flow", "left"),
    controls: [],
    variants: presetVariants(HERO_CHROMA_FULL_PRESETS, {
      dusk: "Violet dusk with pink and gold edges, wide bleed.",
      tide: "Cyan tide flooding a deeper base.",
      classic: "Midnight navy, blue above, amber at right.",
    }, (props) => gradientThumbnail((props.baseColor as string) ?? "#071021", (props.upColor as string) ?? "#1d4ed8", (props.rightColor as string) ?? "#f59e0b")),
  }), "Color on\nevery edge.", "A four-edge liquid field flooding a midnight base behind real, selectable text — set it full-bleed and let the copy sit low."),

  heroCopy(entry({
    id: "hero-black-hole-cinema", category: "Heroes", label: "Hero Black Hole Cinema",
    tags: ["hero", "landing", "space", "black-hole", "cinema"],
    description: "Drop-in hero: the cinema cut — hard letterbox bars top and bottom, the accretion disk framed like a feature film, and your title card centered in the quiet band.",
    importName: "HeroBlackHoleCinema",
    thumbnail: gradientThumbnail("#020204", "#2a1c0e", "#f59e0b"),
    sourceCode: heroUsage("HeroBlackHoleCinema"),
    agentNotes: HERO_NOTES("black-hole", "centered"),
    controls: [],
    variants: presetVariants(HERO_BLACK_HOLE_CINEMA_PRESETS, {
      feature: "The default framing — mid orbit, measured brightness.",
      wide: "Farther out, wider disk, shallower tilt.",
      noir: "Hotter beaming, sparse stars, deeper fade.",
    }),
  }), "The calm\nbetween stars.", "A ray-traced accretion disk with relativistic beaming, letterboxed like a feature film. Your title card plays in the quiet band."),

  heroCopy(entry({
    id: "hero-particles-badge", category: "Heroes", label: "Hero Particles Badge",
    tags: ["hero", "landing", "particles", "badges", "community"],
    description: "Drop-in hero: the badge-first cut — trust chips lead the stack at the very top on their own frosted backing, then a centered headline over the drifting particle field.",
    importName: "HeroParticlesBadge",
    thumbnail: paletteThumb({ color: "#9ccaff" }),
    sourceCode: heroUsage("HeroParticlesBadge"),
    agentNotes: HERO_NOTES("particle-field", "centered"),
    controls: [],
    variants: presetVariants(HERO_PARTICLES_BADGE_PRESETS, {
      azure: "Classic blue field with badge chips.",
      mint: "Mint particles, larger grains, slower.",
      dune: "Denser amber dust at low speed.",
    }, paletteThumb),
  }), "Where your people\ngather next.", "Cell-hashed particles with drift and size breathing, computed on the GPU — a calm field that lets the headline carry the room."),

  heroCopy(entry({
    id: "hero-ribbon-left", category: "Heroes", label: "Hero Ribbon Left",
    tags: ["hero", "landing", "ribbon", "split", "telemetry"],
    description: "Drop-in hero: the mirrored cut — copy left with a vertical eyebrow rail along its edge, three Gaussian light ribbons sweeping the right over a dot-matrix grid.",
    importName: "HeroRibbonLeft",
    thumbnail: ribbonThumb(),
    sourceCode: heroUsage("HeroRibbonLeft"),
    agentNotes: HERO_NOTES("ribbon-field", "split"),
    controls: [],
    variants: presetVariants(HERO_RIBBON_LEFT_PRESETS, {
      signal: "Balanced ribbons drifting right of the copy.",
      quiet: "Dimmer, slower — for dense pages.",
      surge: "Bright, fast, strong drift.",
    }),
  }), "Noise, combed\ninto light.", "Three Gaussian light ribbons sweep the right of your copy over a dot-matrix grid — the data-center aesthetic, typeset like a broadsheet."),

  heroCopy(entry({
    id: "hero-fluid-minimal", category: "Heroes", label: "Hero Fluid Minimal",
    tags: ["hero", "landing", "fluid", "minimal", "gradient"],
    description: "Drop-in hero: the minimal cut — one line of copy, one CTA, one liquid gradient. The entire hero for products that can be named in a breath.",
    importName: "HeroFluidMinimal",
    thumbnail: paletteThumb({ from: "#0b1220", to: "#1e4a5f", accent: "#7fb8c9" }),
    sourceCode: heroUsage("HeroFluidMinimal"),
    agentNotes: HERO_NOTES("liquid-gradient", "centered"),
    controls: [],
    variants: presetVariants(HERO_FLUID_MINIMAL_PRESETS, {
      mist: "Cold mist at a calm drift.",
      ember: "Slow heavy warping in hearth tones.",
      moss: "Deep green sea, larger blobs.",
    }, paletteThumb),
  }), "One line. One button. Shipped.", undefined),

  /* ---- 2026-09 batch A: backgrounds ----
   * TODO(showcase): real /showcase/*.png stills are not captured for this
   * batch yet; these entries carry generated gradient placeholders built from
   * each preset's palette. Swap thumbnail to `/showcase/<id>.png` once stills
   * exist. */
  entry({
    id: "ember-drift",
    category: "Backgrounds",
    label: "Ember Drift",
    tags: ["background", "embers", "fire", "sparks"],
    description: "Sparks rising from a bed of coals, cooling from gold to red through shimmering heat — two cell-hashed ember layers under an fbm thermal warp.",
    importName: "EmberDrift",
    thumbnail: gradientThumbnail("#0f0705", "#ffb45e", "#c22b0f"),
    sourceCode: `import { EmberDrift, EMBER_DRIFT_PRESETS } from "@vfx-ui/react";

export function HearthHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <EmberDrift {...EMBER_DRIFT_PRESETS.campfire} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Keep the fire going</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: warm ambient backdrop of rising sparks over a charcoal bed; the lower third is bent by heat shimmer (fbm refraction).",
      "Mount: full-bleed layer behind content; opaque near-black base — no background needed behind it.",
      "Props: speed, intensity, embers (count multiplier), rise (ascent speed), shimmer (heat refraction), from/to (fresh/cool spark colors).",
      "Pointer: interactive is off by default — sparks rise straight up; set it and the pointer blows a sideways wind that leans the plume.",
      "Guardrails: WebGPU required with fallback prop; reduced motion freezes time; designed for dark themes.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("intensity", "Intensity", 0, 2, 0.05, 1),
      range("embers", "Embers", 0.2, 2.5, 0.05, 1),
      color("from", "Fresh sparks", "#ffb45e"),
      color("to", "Cooled sparks", "#c22b0f"),
    ],
    variants: presetVariants(EMBER_DRIFT_PRESETS, {
      campfire: "Gold sparks cooling to deep red.",
      furnace: "Hotter, denser, faster — white-hot cores.",
      blueFlame: "Blue flame over a cool night base.",
    }, paletteThumb),
  }),

  entry({
    id: "caustics-field",
    category: "Backgrounds",
    label: "Caustics Field",
    tags: ["background", "water", "caustics", "pool"],
    description: "Sunlit pool-floor caustics dancing over deep water — a jittered-grid Voronoi net of focused light in three stacked octaves, with drifting silt motes.",
    importName: "CausticsField",
    thumbnail: gradientThumbnail("#03161d", "#0b5568", "#bfeef7"),
    sourceCode: `import { CausticsField, CAUSTICS_FIELD_PRESETS } from "@vfx-ui/react";

export function PoolHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <CausticsField {...CAUSTICS_FIELD_PRESETS.lagoon} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Light on water</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: underwater light-net backdrop (F1/F2 edge distance Voronoi with orbiting cell seeds); three octaves at different scales keep the ripples from repeating.",
      "Mount: full-bleed layer behind content; the depth-graded water gradient is opaque.",
      "Props: speed, intensity, scale (cell size), sharpness (net focus), from/to/accent (deep water, mid water, light).",
      "Pointer: interactive is off by default; set it to shift the sun's beam center across the pool floor.",
      "Guardrails: WebGPU required with fallback prop; reduced motion freezes the net; pairs best with light type.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("intensity", "Intensity", 0, 2, 0.05, 1),
      range("scale", "Scale", 0.4, 4, 0.05, 1.4),
      color("from", "Deep water", "#03161d"),
      color("to", "Mid water", "#0b5568"),
      color("accent", "Light", "#bfeef7"),
    ],
    variants: presetVariants(CAUSTICS_FIELD_PRESETS, {
      lagoon: "Classic lagoon net in teal.",
      reef: "Greener reef water, finer cells.",
      nightPool: "Indigo pool under cooler light.",
    }, paletteThumb),
  }),

  entry({
    id: "halo-rings",
    category: "Backgrounds",
    label: "Halo Rings",
    tags: ["background", "rings", "light", "dispersion"],
    description: "Concentric light rings breathing outward from a luminous core, each sampled at three radii so the band edges split into spectral fringes like light through a prism.",
    importName: "HaloRings",
    thumbnail: gradientThumbnail("#101018", "#fef3c7", "#7dd3fc"),
    sourceCode: `import { HaloRings, HALO_RINGS_PRESETS } from "@vfx-ui/react";

export function HaloHero() {
  return (
    <div style={{ position: "relative", width: "100%", height: 420 }}>
      <HaloRings {...HALO_RINGS_PRESETS.dawn} />
    </div>
  );
}`,
    agentNotes: [
      "Purpose: breathing halo backdrop — rings emitted in staggered phases, each fading as it grows, with chromatic dispersion (R/G/B sampled at slightly different radii).",
      "Mount: full-bleed layer behind content on a dark base.",
      "Props: speed, intensity, rings (1-6), dispersion (spectral split), from/to/accent (core, mid, rim colors).",
      "Pointer: interactive is off by default; set it and the halo center gently drifts toward the cursor.",
      "Guardrails: WebGPU required with fallback prop; reduced motion freezes the breath; keep overlaid text off the core for contrast.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("intensity", "Intensity", 0, 2, 0.05, 1),
      range("rings", "Rings", 1, 6, 1, 3),
      range("dispersion", "Dispersion", 0, 1.5, 0.05, 0.55),
      color("from", "Core", "#fef3c7"),
      color("to", "Mid", "#7dd3fc"),
      color("accent", "Rim", "#c4b5fd"),
    ],
    variants: presetVariants(HALO_RINGS_PRESETS, {
      dawn: "Warm core, cool bands, soft fringes.",
      prism: "Four rings at full spectral split.",
      ember: "Two heavy orange-red rings.",
    }, paletteThumb),
  }),

  entry({
    id: "terrain-ridge",
    category: "Backgrounds",
    label: "Terrain Ridge",
    tags: ["background", "mountains", "terrain", "landscape"],
    description: "Layered ridged-fbm mountain silhouettes in parallax drift — ridgelines recede into haze, each scrolling at its own speed, under a low sun that rims the nearest crest.",
    importName: "TerrainRidge",
    thumbnail: gradientThumbnail("#141a2e", "#1b2a4a", "#e8956b"),
    sourceCode: `import { TerrainRidge, TERRAIN_RIDGE_PRESETS } from "@vfx-ui/react";

export function RangeHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <TerrainRidge {...TERRAIN_RIDGE_PRESETS.dusk} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Range after range</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: parallax mountain-range backdrop; crests are sharpened ridged value noise (1-|2n-1|) and each layer carries its own scroll speed and parallax factor.",
      "Mount: full-bleed layer behind content; the sky gradient is opaque.",
      "Props: speed, intensity, layers (3-8), ruggedness (crest sharpness), from/to/accent (sky, sun, haze colors).",
      "Pointer: interactive is off by default; set it and the whole valley pans against the cursor.",
      "Guardrails: WebGPU required with fallback prop; reduced motion freezes the drift; place text in the sky band for contrast.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("intensity", "Intensity", 0, 2, 0.05, 1),
      range("layers", "Layers", 3, 8, 1, 5),
      range("ruggedness", "Ruggedness", 0.2, 1.6, 0.05, 0.8),
      color("from", "Sky", "#1b2a4a"),
      color("to", "Sun", "#e8956b"),
      color("accent", "Haze", "#141a2e"),
    ],
    variants: presetVariants(TERRAIN_RIDGE_PRESETS, {
      dusk: "Indigo dusk with a warm low sun.",
      dawn: "Pale rose sun over softer ridges.",
      alpine: "Six cold layers under a high haze.",
    }, paletteThumb),
  }),

  entry({
    id: "silk-veil",
    category: "Backgrounds",
    label: "Silk Veil",
    tags: ["background", "silk", "fabric", "sheen"],
    description: "A draped silk curtain with a sheen band sweeping across it — domain-warped folds shaded anisotropically like cloth-of-gold, with fine weave grain.",
    importName: "SilkVeil",
    thumbnail: gradientThumbnail("#1a0a20", "#7c2d64", "#ffd9a8"),
    sourceCode: `import { SilkVeil, SILK_VEIL_PRESETS } from "@vfx-ui/react";

export function AtelierHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <SilkVeil {...SILK_VEIL_PRESETS.rosewood} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Cut from light</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: luxury fabric backdrop — vertical folds brighten where the surface tilts toward the light while a diagonal luster band travels across the weave.",
      "Mount: full-bleed layer behind content; the weave is opaque.",
      "Props: speed, intensity, folds (4-16), sheen (luster strength), from/to/accent (deep, fold, sheen colors).",
      "Pointer: interactive is off by default; set it and the light tilts so the sheen follows the cursor.",
      "Guardrails: WebGPU required with fallback prop; reduced motion holds one draped frame; best under large serif type.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("intensity", "Intensity", 0, 2, 0.05, 1),
      range("folds", "Folds", 4, 16, 1, 9),
      range("sheen", "Sheen", 0, 2, 0.05, 1),
      color("from", "Deep", "#2a1030"),
      color("to", "Fold", "#7c2d64"),
      color("accent", "Sheen", "#ffd9a8"),
    ],
    variants: presetVariants(SILK_VEIL_PRESETS, {
      rosewood: "Rose silk with a golden sheen band.",
      midnight: "Deep blue folds, tighter pleats.",
      champagne: "Warm champagne weave, broader folds.",
    }, paletteThumb),
  }),

  entry({
    id: "plasma-sheet",
    category: "Backgrounds",
    label: "Plasma Sheet",
    tags: ["background", "plasma", "gradient", "flow"],
    description: "Molten color currents folding through each other — two chained domain warps advect and fold the field so colors stir like dense dye, with filament highlights on the fold edges.",
    importName: "PlasmaSheet",
    thumbnail: gradientThumbnail("#120b26", "#7b2ff7", "#22d3ee"),
    sourceCode: `import { PlasmaSheet, PLASMA_SHEET_PRESETS } from "@vfx-ui/react";

export function PlasmaHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <PlasmaSheet {...PLASMA_SHEET_PRESETS.nebula} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Stir the color</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: vivid flowing-gradient backdrop (value-noise fbm warped by fbm — the classic fluid technique); an electric rim picks out the fold edges.",
      "Mount: full-bleed layer behind content; the sheet is opaque.",
      "Props: speed, intensity, scale (blob size), warp (fold strength), from/to/accent (base, current, rim colors).",
      "Pointer: interactive is off by default; set it and the cursor injects a vortex-like swirl into the current.",
      "Guardrails: WebGPU required with fallback prop; reduced motion holds one stirred frame; keep one dark tone for text contrast.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("intensity", "Intensity", 0, 2, 0.05, 1),
      range("scale", "Scale", 0.5, 5, 0.05, 2.2),
      range("warp", "Warp", 0.5, 4, 0.05, 1.8),
      color("from", "Base", "#120b26"),
      color("to", "Current", "#7b2ff7"),
      color("accent", "Rim", "#22d3ee"),
    ],
    variants: presetVariants(PLASMA_SHEET_PRESETS, {
      nebula: "Violet current with a cyan rim.",
      magma: "Orange melt over charcoal.",
      anodized: "Blue-green anodized surface.",
    }, paletteThumb),
  }),

  entry({
    id: "star-tide",
    category: "Backgrounds",
    label: "Star Tide",
    tags: ["background", "stars", "waves", "space"],
    description: "A field of stars drifting on slow luminous waves — two hashed star grids ride a shared interference field so the whole sky visibly sloshes like a tide.",
    importName: "StarTide",
    thumbnail: gradientThumbnail("#050818", "#dbe7ff", "#5eead4"),
    sourceCode: `import { StarTide, STAR_TIDE_PRESETS } from "@vfx-ui/react";

export function TideHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <StarTide {...STAR_TIDE_PRESETS.midnight} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>The sky, at high tide</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: celestial-wave backdrop — stars brighten on wave crests, twinkle on their own phases, and a faint glow trace makes the wave readable between them.",
      "Mount: full-bleed layer behind content; the night base is opaque.",
      "Props: speed, intensity, density, waveAmp, waveFreq, twinkle, from/to/accent (sky, star, crest colors).",
      "Pointer: interactive is off by default; set it and the cursor stirs the wave phase.",
      "Guardrails: WebGPU required with fallback prop; reduced motion holds a settled sky; safe for several instances per page.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("intensity", "Intensity", 0, 2, 0.05, 1),
      range("density", "Density", 0.1, 2, 0.05, 1),
      range("waveAmp", "Wave height", 0, 2.5, 0.05, 1),
      range("twinkle", "Twinkle", 0, 1, 0.05, 0.5),
      color("to", "Stars", "#dbe7ff"),
      color("accent", "Crests", "#5eead4"),
    ],
    variants: presetVariants(STAR_TIDE_PRESETS, {
      midnight: "Cool stars on a long teal swell.",
      nebulaTide: "Pink-lavender tide, longer waves.",
      bioluminescent: "Bright teal crest glow, choppier.",
    }, paletteThumb),
  }),

  entry({
    id: "ink-bloom",
    category: "Backgrounds",
    label: "Ink Bloom",
    tags: ["background", "ink", "paper", "sumi-e"],
    description: "Ink drops blooming and feathering across wet paper — each front is an fbm-perturbed radius, denser at the core and ring-deposited at the edge, paling as it ages. Light paper base.",
    importName: "InkBloom",
    thumbnail: gradientThumbnail("#f4eee2", "#b9ac96", "#191621"),
    sourceCode: `import { InkBloom, INK_BLOOM_PRESETS } from "@vfx-ui/react";

export function SumiHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <InkBloom {...INK_BLOOM_PRESETS.sumi} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Written in water</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: sumi-e ink-wash backdrop on a warm fiber paper tone; drops respawn on staggered cycles so the page keeps breathing.",
      "Mount: full-bleed layer behind content; the paper is opaque and LIGHT — use dark type over it.",
      "Props: speed, intensity, drops (concurrent count), spread, feather, from/to/accent (paper, wash, ink colors).",
      "Pointer: interactive is off by default; set it and the freshest drop falls at the cursor.",
      "Guardrails: WebGPU required with fallback prop; reduced motion shows a settled page of blooms; one of the few light-background effects here.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("intensity", "Intensity", 0, 2, 0.05, 0.92),
      range("drops", "Drops", 1, 8, 1, 4),
      range("spread", "Spread", 0.1, 0.5, 0.01, 0.26),
      color("from", "Paper", "#f4eee2"),
      color("to", "Wash", "#b9ac96"),
      color("accent", "Ink", "#191621"),
    ],
    variants: presetVariants(INK_BLOOM_PRESETS, {
      sumi: "Classic black ink on warm paper.",
      indigo: "Blue ink, softer feathered edges.",
      cinnabar: "Red ink, fewer and sharper drops.",
    }, paletteThumb),
  }),

  entry({
    id: "solar-corona",
    category: "Backgrounds",
    label: "Solar Corona",
    tags: ["background", "sun", "corona", "space"],
    description: "A blazing sun disk crowned with streaming corona light — a limb-darkened photosphere with boiling granulation, red-shifted rim, fbm streamers and long polar plumes over a star field.",
    importName: "SolarCorona",
    thumbnail: gradientThumbnail("#160b06", "#ffb347", "#ff5470"),
    sourceCode: `import { SolarCorona, SOLAR_CORONA_PRESETS } from "@vfx-ui/react";

export function SunHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <SolarCorona {...SOLAR_CORONA_PRESETS.gold} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Do not look directly</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: solar-disc backdrop — granulation boils slowly while fbm-modulated streamers ray outward with radial falloff and an angular pattern of polar plumes.",
      "Mount: full-bleed layer behind content; the star field is opaque.",
      "Props: speed, intensity, rays (streamer count), corona (halo reach), granulation, from/to/accent (core, photosphere, chromosphere colors).",
      "Pointer: interactive is off by default; set it and the star backdrop parallaxes against the sun.",
      "Guardrails: WebGPU required with fallback prop; reduced motion holds one frame; keep copy off the disk itself.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("intensity", "Intensity", 0, 2, 0.05, 1),
      range("rays", "Rays", 6, 48, 1, 18),
      range("corona", "Corona reach", 0.2, 2, 0.05, 1),
      color("from", "Core", "#fff6d8"),
      color("to", "Photosphere", "#ffb347"),
      color("accent", "Rim", "#ff5470"),
    ],
    variants: presetVariants(SOLAR_CORONA_PRESETS, {
      gold: "White-gold sun with warm streamers.",
      sapphire: "Cool blue star, finer rays.",
      whiteDwarf: "Small hot white disc, fast boil.",
    }, paletteThumb),
  }),

  entry({
    id: "dust-motes",
    category: "Backgrounds",
    label: "Dust Motes",
    tags: ["background", "dust", "beams", "attic"],
    description: "Dust motes drifting through slanted Tyndall light beams — parallel volumetric shafts whose width and brightness breathe with fbm, over a shadowed room.",
    importName: "DustMotes",
    thumbnail: gradientThumbnail("#0c0b10", "#e8d9b5", "#fffbe8"),
    sourceCode: `import { DustMotes, DUST_MOTES_PRESETS } from "@vfx-ui/react";

export function AtticHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <DustMotes {...DUST_MOTES_PRESETS.attic} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Quiet air, bright motes</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: atmospheric room backdrop — two mote layers ride a lazy flow field, brighten inside the beams and all but vanish in the shadowed room beyond.",
      "Mount: full-bleed layer behind content; the room is opaque near-black.",
      "Props: speed, intensity, motes (count multiplier), beams (shaft count), beamWidth, drift, from/to/accent (room, shaft, mote colors).",
      "Pointer: interactive is off by default; set it and the cursor is a draft of air that carries the motes.",
      "Guardrails: WebGPU required with fallback prop; reduced motion stills the air; the whole shaft set slowly sweeps on its own.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("intensity", "Intensity", 0, 2, 0.05, 1),
      range("motes", "Motes", 0.2, 2.5, 0.05, 1),
      range("beams", "Beams", 1, 6, 1, 3),
      range("beamWidth", "Beam width", 0.04, 0.4, 0.01, 0.16),
      color("to", "Shafts", "#e8d9b5"),
      color("accent", "Motes", "#fffbe8"),
    ],
    variants: presetVariants(DUST_MOTES_PRESETS, {
      attic: "Warm afternoon light through slats.",
      cathedral: "Two tall cool shafts, slow air.",
      workshop: "Four busy shafts, dustier air.",
    }, paletteThumb),
  }),

  /* ---- 2026-09 batch C: glass, text and interactions ----
   * TODO(showcase): real /showcase/*.png stills are not captured for this
   * batch yet; these entries carry generated gradient placeholders. Swap
   * thumbnail to `/showcase/<id>.png` once stills exist. */
  entry({
    id: "glass-panel", category: "Glass", label: "Glass Panel", tags: ["glass", "optical", "panel", "refraction"],
    description: "An original ray-marched optical slab built to carry content: beveled edges split light while the solid tilts toward your pointer, and real DOM content rides above it.",
    importName: "GlassPanel", thumbnail: glassThumb({ tint: "#dfe9ec" }),
    sourceCode: `import { GlassPanel } from "@vfx-ui/react";

export function Panel() {
  return (
    <div style={{ height: 520 }}>
      <GlassPanel interactive>
        <div style={{ padding: 40, position: "relative", zIndex: 1 }}>
          <h2>Your content, on glass.</h2>
        </div>
      </GlassPanel>
    </div>
  );
}`,
    agentNotes: [
      "Original ray-marched rounded slab with entry/exit refraction, Fresnel edges and thickness-dependent absorption — sized as a wide panel rather than a card.",
      "children accepts real DOM content above the artwork. Provide a sized parent; the slab centers itself at panelScale.",
      "Pointer tilts the solid (interactive is on by default here). radius is the bevel, shine the dispersion, borderGlow the edge reflection, tint the absorption color, contentWidth the inner column (percent).",
      "The printed scene behind the glass is procedural; arbitrary DOM is not sampled. Reduced motion freezes time and pointer motion.",
    ],
    controls: [range("radius", "Bevel", 0.01, 0.06, 0.002, 0.022), range("shine", "Dispersion", 0, 2, 0.05, 0.62), range("panelScale", "Size", 0.6, 1.6, 0.02, 1.12), color("tint", "Glass tint", "#dfe9ec")],
    variants: presetVariants(GLASS_PANEL_PRESETS, { clear: "Clear cool glass, moderate bevel.", smoke: "Denser grey glass, wider bevel.", cobalt: "Cool bright slab, stronger dispersion." }, glassThumb),
  }),
  entry({
    id: "glass-tile", category: "Glass", label: "Glass Tile", tags: ["glass", "tile", "lens", "wall"],
    description: "A wall of glass bricks on the shared optical pipeline: one biconvex lens lives in a layer that travels to the hovered brick and bulges through it — a single renderer, however many bricks.",
    importName: "GlassTile", thumbnail: glassThumb({ tint: "#e0eef4" }),
    sourceCode: `import { GlassTile } from "@vfx-ui/react";

export function Wall() {
  return <div style={{ height: 520 }}><GlassTile interactive /></div>;
}`,
    agentNotes: [
      "A responsive grid of glass bricks; the travelling lens gives the hovered brick refraction, dispersion and rim bulge (pActive drives it), so hover feedback stays one draw call.",
      "tiles accepts your own brick labels/content; without it a neutral wall renders. Provide a sized parent.",
      "columns, gap and tileHeight shape the wall; refraction is the resting bend, dispersion the spectral split, rim the Fresnel edge, tint the glass color.",
      "Pointer-free layouts keep the resting bend only. Reduced motion stills the lens travel; keyboard focus moves it too.",
    ],
    controls: [range("columns", "Columns", 2, 8, 1, 4), range("refraction", "Refraction", 0, 1, 0.05, 0.55), range("dispersion", "Dispersion", 0, 1, 0.05, 0.45), color("tint", "Glass tint", "#e0eef4")],
    variants: [
      { id: "wall", label: "Wall", description: "The default four-column brick wall.", thumbnail: glassThumb({ tint: "#e0eef4" }), props: { columns: 4, gap: 10, tileHeight: 118, tint: "#e0eef4", refraction: 0.55, dispersion: 0.45, rim: 0.45 } },
      { id: "wide", label: "Wide", description: "Fewer, taller bricks for band layouts.", thumbnail: glassThumb({ tint: "#cfe0f2" }), props: { columns: 3, gap: 14, tileHeight: 150, tint: "#cfe0f2", refraction: 0.7, dispersion: 0.6, rim: 0.6 } },
      { id: "mosaic", label: "Mosaic", description: "A denser mosaic grid.", thumbnail: glassThumb({ tint: "#f2e8df" }), props: { columns: 6, gap: 8, tileHeight: 92, tint: "#f2e8df", refraction: 0.45, dispersion: 0.3, rim: 0.35 } },
    ],
  }),
  entry({
    id: "chromatic-text", category: "Text", label: "Chromatic Text", runtime: "dom",
    tags: ["text", "pointer", "chromatic", "prism"], importName: "ChromaticText",
    description: "The pointer is the prism: letters near the cursor split into red and blue fringes while the rainbow underneath slides with it.",
    thumbnail: gradientThumbnail("#0b0d12", "#5b8cff", "#ff5f6d"),
    sourceCode: `import { ChromaticText } from "@vfx-ui/react";

export function Headline() {
  return <h1><ChromaticText text="Split the light." separation={5} /></h1>;
}`,
    controls: [
      { kind: "text", key: "text", label: "Your words", default: "Split the light.", maxLength: 60 },
      { key: "separation", label: "Split", min: 0, max: 20, step: 0.5, digits: 1, default: 5 },
      { key: "spectrum", label: "Spectrum", min: 0, max: 360, step: 5, digits: 0, default: 280 },
    ], variants: [],
    agentNotes: ["Accepts text, separation, spread, spectrum, disabled, className and style. Wrap in a heading for heading semantics. The words stay plain, selectable text for assistive technology; reduced motion gets still text. No GPU dependency."],
  }),
  entry({
    id: "ripple-text", category: "Text", label: "Ripple Text", runtime: "dom",
    tags: ["text", "ripple", "pointer", "water"], importName: "RippleText",
    description: "Type you can touch: a click (or tap) drops a ripple that travels outward through the letters, and a resting pointer leaves a soft dimple.",
    thumbnail: gradientThumbnail("#0b0d12", "#7ae7c7", "#5b8cff"),
    sourceCode: `import { RippleText } from "@vfx-ui/react";

export function Headline() {
  return <h1><RippleText text="Drop a stone." amplitude={15} /></h1>;
}`,
    controls: [
      { kind: "text", key: "text", label: "Your words", default: "Drop a stone.", maxLength: 60 },
      { key: "amplitude", label: "Lift", min: 0, max: 40, step: 1, digits: 0, default: 15 },
      { key: "speed", label: "Wave speed", min: 0.2, max: 3, step: 0.05, digits: 2, default: 0.9 },
    ], variants: [],
    agentNotes: ["Accepts text, amplitude, speed, width, disabled, className and style. The words remain one accessible label; reduced-motion readers get still, plain text. No GPU dependency."],
  }),
  entry({
    id: "spectrum-text", category: "Text", label: "Spectrum Text", runtime: "dom",
    tags: ["text", "gradient", "spectrum", "pointer"], importName: "SpectrumText",
    description: "A ribbon of daylight sliding through the words: one spectral gradient flows continuously across the type and leans toward the pointer.",
    thumbnail: gradientThumbnail("#0b0d12", "#ffc371", "#5b8cff"),
    sourceCode: `import { SpectrumText } from "@vfx-ui/react";

export function Headline() {
  return <h1><SpectrumText text="Everything is light." speed={0.55} /></h1>;
}`,
    controls: [
      { kind: "text", key: "text", label: "Your words", default: "Everything is light.", maxLength: 60 },
      { key: "speed", label: "Flow", min: 0.1, max: 2, step: 0.05, digits: 2, default: 0.55 },
      { key: "bandWidth", label: "Band width", min: 60, max: 480, step: 10, digits: 0, default: 220 },
    ], variants: [],
    agentNotes: ["Accepts text, speed, bandWidth, colors (hex string array), disabled, className and style. The text stays a real, selectable label; under reduced motion it rests as a still spectrum. No GPU dependency."],
  }),
  entry({
    id: "tilt-card", category: "Interactions", label: "Tilt Card", runtime: "dom",
    tags: ["card", "tilt", "pointer", "glare"], importName: "TiltCard",
    description: "A porcelain card on a gimbal: the surface tilts in space while a specular highlight tracks the pointer across it.",
    thumbnail: gradientThumbnail("#0d1117", "#dfe7ee", "#9fb6c2"),
    sourceCode: `import { TiltCard } from "@vfx-ui/react";

export function Card() {
  return <TiltCard tilt={10} glare={0.55}><div style={{ padding: 32 }}>Your content rides here.</div></TiltCard>;
}`,
    controls: [
      { key: "tilt", label: "Tilt", min: 0, max: 24, step: 1, digits: 0, default: 10 },
      { key: "glare", label: "Highlight", min: 0, max: 1, step: 0.05, digits: 2, default: 0.55 },
      { key: "radius", label: "Radius", min: 0, max: 40, step: 1, digits: 0, default: 20 },
    ], variants: [],
    agentNotes: ["Accepts children, tilt, glare, radius, disabled, className and style. Real DOM content rides a raised layer for parallax; keyboard focus brings the highlight home, and reduced motion leaves a flat, fully readable card. Works without WebGPU."],
  }),
  entry({
    id: "pointer-glow", category: "Interactions", label: "Pointer Glow", runtime: "dom",
    tags: ["pointer", "glow", "light", "layout"], importName: "PointerGlow",
    description: "A handheld light for layouts: the region dims slightly and a warm source follows the pointer, brightening whatever it rests on.",
    thumbnail: gradientThumbnail("#0d1117", "#ffdfae", "#6b5b3e"),
    sourceCode: `import { PointerGlow } from "@vfx-ui/react";

export function Spotlight() {
  return (
    <PointerGlow radius={300} color="#ffdfae">
      <section>Any content — the light follows the pointer across all of it.</section>
    </PointerGlow>
  );
}`,
    previewProps: {
      children: (
        <div style={{ display: "grid", gap: 14, padding: "48px 40px", maxWidth: 560 }}>
          <strong style={{ fontSize: 20 }}>Move the light across this panel.</strong>
          <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.6 }}>
            The room dims a little; whatever the glow rests on comes forward. Keyboard focus carries the light to the focused control.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ padding: "8px 14px", border: "1px solid rgba(255,255,255,.2)", borderRadius: 999 }}>Controls</span>
            <span style={{ padding: "8px 14px", border: "1px solid rgba(255,255,255,.2)", borderRadius: 999 }}>Stay lit</span>
          </div>
        </div>
      ),
    },
    controls: [
      { key: "radius", label: "Light radius", min: 100, max: 600, step: 10, digits: 0, default: 300 },
      { key: "intensity", label: "Brightness", min: 0, max: 1, step: 0.05, digits: 2, default: 0.5 },
      { key: "dim", label: "Room dim", min: 0, max: 0.8, step: 0.02, digits: 2, default: 0.32 },
      color("color", "Light color", "#ffdfae"),
    ], variants: [],
    agentNotes: ["Accepts children (your layout), radius, intensity, dim, color, disabled, className and style. Keyboard focus carries the light to the focused control; reduced motion keeps the room fully lit. Works without WebGPU."],
  }),
  entry({
    id: "spotlight-card", category: "Interactions", label: "Spotlight Card", runtime: "dom",
    tags: ["card", "spotlight", "reveal", "pointer"], importName: "SpotlightCard",
    description: "A card played under a torch: a soft pool of light rests at the center, then follows the pointer to uncover what is written there.",
    thumbnail: gradientThumbnail("#08090c", "#e8d9b5", "#3a3f4a"),
    sourceCode: `import { SpotlightCard } from "@vfx-ui/react";

export function Card() {
  return <SpotlightCard radius={190}><div style={{ padding: 40 }}>Content revealed by the beam.</div></SpotlightCard>;
}`,
    controls: [
      { key: "radius", label: "Beam radius", min: 80, max: 400, step: 10, digits: 0, default: 190 },
      { key: "darkness", label: "Darkness", min: 0, max: 1, step: 0.02, digits: 2, default: 0.86 },
    ], variants: [],
    agentNotes: ["Accepts children, radius, darkness, disabled, className and style. Keyboard focus widens the beam around the focused element; reduced motion lifts the darkness entirely so content is always readable. Works without WebGPU."],
  }),
  entry({
    id: "elastic-hover", category: "Interactions", label: "Elastic Hover", runtime: "dom",
    tags: ["hover", "spring", "squash", "pointer"], importName: "ElasticHover",
    description: "Rubber around whatever you wrap: hovering swells it, pressing squashes it wide, and an under-damped spring snaps it back with a wobble.",
    thumbnail: gradientThumbnail("#0d1117", "#7ae7c7", "#4c5a61"),
    sourceCode: `import { ElasticHover } from "@vfx-ui/react";

export function Button() {
  return <ElasticHover grow={0.05} squash={0.12}><button type="button">Press me</button></ElasticHover>;
}`,
    controls: [
      { key: "grow", label: "Hover grow", min: 0, max: 0.25, step: 0.01, digits: 2, default: 0.05 },
      { key: "squash", label: "Press squash", min: 0, max: 0.3, step: 0.01, digits: 2, default: 0.12 },
    ], variants: [],
    agentNotes: ["Accepts children, grow, squash, stiffness, damping, disabled, className and style. The inner element keeps its own semantics — buttons stay buttons, links stay links — and reduced motion leaves the content perfectly still. Works without WebGPU."],
  }),
  entry({
    id: "magnetic-grid", category: "Interactions", label: "Magnetic Grid", runtime: "dom",
    tags: ["grid", "dots", "magnetic", "pointer"], importName: "MagneticGrid",
    description: "A lattice of iron filings for the cursor: each dot feels the pointer's field, slides and swells as it passes, and settles back when it leaves.",
    thumbnail: gradientThumbnail("#0b0e13", "#9fb6c2", "#d5ed9a"),
    sourceCode: `import { MagneticGrid } from "@vfx-ui/react";

export function Field() {
  return (
    <MagneticGrid columns={16} rows={9} strength={24}>
      <div style={{ padding: 64 }}>Your content floats above the dots.</div>
    </MagneticGrid>
  );
}`,
    previewProps: {
      children: (
        <div style={{ display: "grid", placeItems: "center", height: "100%", minHeight: 260 }}>
          <div style={{ textAlign: "center" }}>
            <strong style={{ fontSize: 20, display: "block", marginBottom: 6 }}>Sweep the cursor across the dots</strong>
            <span style={{ opacity: 0.7 }}>The lattice follows the field; your content stays interactive above it.</span>
          </div>
        </div>
      ),
    },
    controls: [
      { key: "columns", label: "Columns", min: 6, max: 32, step: 1, digits: 0, default: 16 },
      { key: "rows", label: "Rows", min: 4, max: 20, step: 1, digits: 0, default: 9 },
      { key: "strength", label: "Pull", min: 0, max: 80, step: 1, digits: 0, default: 24 },
      { kind: "choice", key: "mode", label: "Field", default: "attract", options: [{ value: "attract", label: "Attract" }, { value: "repel", label: "Repel" }] },
      color("color", "Dot color", "#9fb6c2"),
    ], variants: [],
    agentNotes: ["Accepts children, columns, rows, dotSize, strength, radius, mode (\"attract\" | \"repel\"), color, disabled, className and style. The dots are decorative only — your content sits above them, fully interactive — and reduced motion leaves a calm, static weave. Works without WebGPU."],
  }),

];

export const VISIBLE_READY_SHADERS = READY_SHADERS.filter((shader) => shader.visible);

export const READY_SHADER_COLLECTION_COUNT = VISIBLE_READY_SHADERS.length;

export function getReadyShader(id: string): ReadyShader {
  return READY_SHADERS.find((shader) => shader.id === id) ?? VISIBLE_READY_SHADERS[0]!;
}
