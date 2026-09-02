import { lazy, type ComponentType } from "react";
import {
  FLUID_PRESETS,
  AURORA_PRESETS,
  STARFIELD_PRESETS,
  PARTICLE_PRESETS,
  GLASS_CARD_PRESETS,
  LIQUID_GLASS_PRESETS,
  GLASS_LENS_PRESETS,
  BLACK_HOLE_PRESETS,
  MESH_GRADIENT_PRESETS,
  IRIDESCENT_PRESETS,
  VORTEX_PRESETS,
  WEB_GLOBE_PRESETS,
  ENERGY_ORB_PRESETS,
  RIBBON_FIELD_PRESETS,
  FIBER_FLOW_PRESETS,
  CHROMA_FLOW_PRESETS,
  LIGHT_PRISM_PRESETS,
  LIVE_CHART_PRESETS,
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
export type ShaderControl = RangeControl | ChoiceControl | CheckpointControl | ColorControl | TextControl;
export type ShaderVariant = {
  id: string;
  label: string;
  description: string;
  thumbnail: string;
  preview?: string;
  props: Readonly<Record<string, boolean | number | string | number[]>>;
  controls?: readonly ShaderControl[];
};
export const READY_SHADER_CATEGORIES = ["Heroes", "Backgrounds", "Glass", "Data", "Globe"] as const;
export type ReadyShaderCategory = (typeof READY_SHADER_CATEGORIES)[number];
export type ReadyShader = {
  id: string;
  visible: boolean;
  category: ReadyShaderCategory;
  label: string;
  thumbnail: string;
  preview?: string;
  tags: readonly string[];
  description: string;
  runtime: "webgpu" | "webgl";
  component?: ComponentType<any>;
  importName: string;
  sourceCode?: string;
  agentNotes?: string;
  controls?: readonly ShaderControl[];
  variants?: readonly ShaderVariant[];
};

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

/**
 * Thumbnail for hue-graded shaders (EnergyOrb, Iridescent): rotates the base
 * cosine palette around the (1,1,1) axis with the same Rodrigues formula the
 * WGSL uses, so the swatch shows the variant's actual hue.
 */
function hueThumb(base: [number, number, number], hue: number, saturation = 1): string {
  const axis: [number, number, number] = [0.57735027, 0.57735027, 0.57735027];
  const sat: [number, number, number] = [
    axis[0] + (base[0] - axis[0]) * saturation,
    axis[1] + (base[1] - axis[1]) * saturation,
    axis[2] + (base[2] - axis[2]) * saturation,
  ];
  const ch = Math.cos(hue);
  const sh = Math.sin(hue);
  const cross: [number, number, number] = [
    sat[1] * axis[2] - sat[2] * axis[1],
    sat[2] * axis[0] - sat[0] * axis[2],
    sat[0] * axis[1] - sat[1] * axis[0],
  ];
  const dot = axis[0] * sat[0] + axis[1] * sat[1] + axis[2] * sat[2];
  const out = sat.map((s, i) => Math.max(0, s * ch + cross[i] * sh + axis[i] * dot * (1 - ch))) as [number, number, number];
  return rgb01ToHex(out);
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

const orbThumb = (props: Record<string, number | string | number[]>) =>
  gradientThumbnail("#0a0a12", hueThumb([0.55, 0.52, 1.0], (props.hue as number) ?? 0, (props.saturation as number) ?? 1), "#f5f3ff");

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
    runtime?: "webgpu" | "webgl";
  },
): ReadyShader {
  return {
    id: config.id,
    visible: true,
    category: config.category,
    label: config.label,
    thumbnail: config.thumbnail,
    tags: config.tags,
    description: config.description,
    runtime: config.runtime ?? "webgpu",
    importName: config.importName,
    component: lazy(() =>
      import("@vfx-ui/react").then((m) => ({ default: (m as unknown as Record<string, ComponentType<any>>)[config.importName] })),
    ),
    sourceCode: config.sourceCode,
    agentNotes: config.agentNotes.join("\n"),
    controls: config.controls,
    variants: config.variants,
  };
}

const heroUsage = (name: string) => `import { ${name} } from "@vfx-ui/react";

export function Landing() {
  return (
    <div style={{ height: "100dvh" }}>
      <${name} />
    </div>
  );
}`;

const HERO_NOTES = (base: string, layout: string) => [
  `Purpose: drop-in hero section — a full first screen with real, selectable DOM text (${layout} layout) over a GPU ${base} background. Copy it, ship it.`,
  `Mount: give the parent an explicit height (e.g. height: 100dvh or a min-height); the shell fills it and clamps its own type with container queries.`,
  `Props: eyebrow, title, subtitle, primaryCta, secondaryCta, badges, scheme ("dark" | "light"), accent, plus the ${base} shader uniforms. All have opinionated defaults — zero props is production-grade.`,
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

export const READY_SHADERS: readonly ReadyShader[] = [
  entry({
    id: "hero-fluid",
    category: "Heroes",
    label: "Hero Fluid",
    tags: ["hero", "landing", "gradient", "fluid"],
    description: "Drop-in hero: centered headline over a GPU liquid-gradient field with real selectable text and scrim-backed contrast.",
    importName: "HeroFluid",
    thumbnail: paletteThumb({ from: "#0b1026", to: "#1d4ed8", accent: "#7dd3fc" }),
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
    thumbnail: paletteThumb({ from: "#010409", primary: "#2dd4bf", secondary: "#818cf8" }),
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
    thumbnail: paletteThumb({ from: "#1e1b4b", to: "#4f46e5", accent: "#a5b4fc" }),
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
    thumbnail: paletteThumb({ from: "#020617", color: "#9db4d8", accent: "#7da7fc" }),
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
    thumbnail: paletteThumb({ from: "#0b1120", to: "#134e4a", accent: "#7c3aed", deep: "#f472b6" }),
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
    thumbnail: paletteThumb({ from: "#111014", to: "#3b3150", accent: "#f0abfc" }),
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
    thumbnail: paletteThumb({ from: "#0a0a12", color: "#818cf8", emission: "#e0e7ff" }),
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
    thumbnail: paletteThumb({ from: "#05060a", to: "#0e2a47", accent: "#7dd3fc" }),
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
    thumbnail: paletteThumb({ from: "#060913", color: "#9ccaff" }),
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
    thumbnail: paletteThumb({ from: "#01030a", color: "#d0e4ff" }),
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
    thumbnail: paletteThumb({ from: "#020103", to: "#7c2d12", accent: "#fbbf24" }),
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
    thumbnail: gradientThumbnail("#071021", "#1d4ed8", "#f59e0b"),
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
    thumbnail: gradientThumbnail("#020617", "#1d4ed8", "#38bdf8"),
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
    thumbnail: paletteThumb(FLUID_PRESETS.sunset),
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
    thumbnail: paletteThumb({ from: "#010409", to: "#134e4a", accent: "#2dd4bf" }),
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
    thumbnail: paletteThumb({ from: "#020617", color: "#d6e4ff", accent: "#818cf8" }),
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
    thumbnail: paletteThumb({ from: "#0b1120", color: "#a8d8ff", accent: "#e2e8f0" }),
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
    id: "glass-card",
    category: "Glass",
    label: "Glass Card",
    tags: ["glass", "card", "sdf"],
    description: "Rounded-rect SDF glass card with a sweeping inner highlight and edge refraction — all in one fullscreen pass.",
    importName: "GlassCard",
    thumbnail: paletteThumb({ from: "#0f172a", color: "#a5c8ff", accent: "#f8fafc" }),
    sourceCode: `import { GlassCard, GLASS_CARD_PRESETS } from "@vfx-ui/react";

export function GlassPanel() {
  return (
    <div style={{ position: "relative", height: 480 }}>
      <GlassCard {...GLASS_CARD_PRESETS.frosted} />
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <h2 style={{ color: "#f8fafc" }}>Glass, not gradients</h2>
      </div>
    </div>
  );
}`,
    agentNotes: [
      "Purpose: decorative glass panel behind centered content; the shader draws card, border glow, and sheen.",
      "Mount: fills its container; overlay content with an absolutely-positioned sibling.",
      "Props: tint (glass color), radius (corner roundness), borderGlow, shine (sweep intensity), cardScale (card size relative to container).",
      "Pointer: a specular glare pool tracks the cursor across the pane and fades on leave; interactive={false} disables it.",
      "Guardrails: the card is centered by design — do not try to place it manually; WebGPU required with fallback prop.",
    ],
    controls: [
      range("radius", "Radius", 0, 0.2, 0.005, 0.05),
      range("borderGlow", "Border glow", 0, 2, 0.05, 0.7),
      range("shine", "Shine", 0, 2, 0.05, 0.8),
      range("cardScale", "Card scale", 0.2, 0.95, 0.01, 0.62),
      color("tint", "Tint", "#a5c8ff"),
    ],
    variants: presetVariants(GLASS_CARD_PRESETS, {
      frosted: "Cool blue frost, the default look.",
      champagne: "Warm champagne tint with a strong sheen.",
      rose: "Soft rose glass with a subtle glow.",
    }, glassThumb),
  }),

  entry({
    id: "liquid-glass",
    category: "Glass",
    label: "Liquid Glass",
    tags: ["glass", "refraction", "liquid"],
    description: "Fullscreen liquid refraction with approximate chromatic dispersion — the page breathes.",
    importName: "LiquidGlass",
    thumbnail: paletteThumb({ from: "#020617", color: "#7dd3fc", accent: "#c4b5fd" }),
    sourceCode: `import { LiquidGlass, LIQUID_GLASS_PRESETS } from "@vfx-ui/react";

export function LiquidHero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <LiquidGlass {...LIQUID_GLASS_PRESETS.calm} />
      <div style={{ position: "relative", zIndex: 1, padding: "8rem 2rem" }}>
        <h1>Bend the light</h1>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: fullscreen animated glass surface for hero sections; strongest effect in the library — use sparingly.",
      "Mount: full-bleed layer behind content.",
      "Props: speed, distortion (wave amplitude), chromatic (RGB separation), scale.",
      "Pointer: the cursor presses a refraction lens into the surface, released on leave; interactive={false} disables it.",
      "Guardrails: distortion above 1.2 makes overlaid text hard to read; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 0.6),
      range("distortion", "Distortion", 0, 2, 0.05, 0.3),
      range("chromatic", "Chromatic", 0, 2, 0.05, 0.4),
      range("scale", "Scale", 0.3, 3, 0.05, 1),
    ],
    variants: presetVariants(LIQUID_GLASS_PRESETS, {
      calm: "Gentle refraction, safe under text.",
      storm: "Aggressive waves with heavy dispersion.",
      velvet: "Slow, tight ripples in a muted field.",
    }, liquidThumb),
  }),

  entry({
    id: "glass-lens",
    category: "Glass",
    label: "Glass Lens",
    tags: ["glass", "refraction", "lens", "liquid-glass"],
    description: "A floating liquid-glass pill over a living color field — cylindrical rim refraction, RGB dispersion, and a rotating specular sweep, all computed as real lens optics.",
    importName: "GlassLens",
    thumbnail: paletteThumb({ from: "#05070f", color: "#38bdf8", accent: "#e9d5ff" }),
    sourceCode: `import { GlassLens, GLASS_LENS_PRESETS } from "@vfx-ui/react";

export function FeatureBand() {
  return (
    <section style={{ position: "relative", height: 520 }}>
      <GlassLens {...GLASS_LENS_PRESETS.aqua} />
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <h2 style={{ color: "#f8fafc" }}>Look through it</h2>
      </div>
    </section>
  );
}`,
    agentNotes: [
      "Purpose: single floating lens element (the Apple Liquid Glass pill look) over an animated color field — the bending is real cylindrical-lens math, thickest at the rim.",
      "Mount: fills its container; the pill is centered by design, so overlay copy above or below it, not on top.",
      "Props: speed, refraction (bending strength), dispersion (RGB split), blur (rim depth-of-field), rim (edge highlight), tint (glass color).",
      "Pointer: interactive={true} adds a specular glare pool inside the lens that tracks the cursor; off by default.",
      "Guardrails: refraction above ~1.6 stops reading as glass; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("refraction", "Refraction", 0, 2, 0.05, 0.45),
      range("dispersion", "Dispersion", 0, 2, 0.05, 0.7),
      range("blur", "Blur", 0, 2, 0.05, 0.8),
      range("rim", "Rim", 0, 2, 0.05, 0.9),
      color("tint", "Tint", "#cfe4ff"),
    ],
    variants: presetVariants(GLASS_LENS_PRESETS, {
      aqua: "Cool blue glass over the default field.",
      prism: "Strong bending with heavy spectral fringes.",
      honey: "Warm, slow, and soft-focus.",
    }, glassThumb),
  }),

  entry({
    id: "mesh-gradient",
    category: "Backgrounds",
    label: "Mesh Gradient",
    tags: ["background", "gradient", "voronoi"],
    description: "Voronoi-cell color fields flowing through a curated palette — the classic mesh-gradient look, live on the GPU.",
    importName: "MeshGradient",
    thumbnail: paletteThumb(MESH_GRADIENT_PRESETS.aurora),
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
    thumbnail: paletteThumb({ from: "#0f0c29", color: "#c3a3ff", accent: "#f5d0fe" }),
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
    thumbnail: paletteThumb(VORTEX_PRESETS.galaxy),
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
    thumbnail: paletteThumb({ from: "#020103", to: "#7c2d12", accent: "#fde68a" }),
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
    id: "web-globe",
    category: "Globe",
    label: "Web Globe",
    tags: ["globe", "map", "3d"],
    description: "WebGPU re-creation of shuding/cobe (MIT): a lat/lon dot-matrix globe with fresnel rim and far-side shading.",
    importName: "WebGlobe",
    thumbnail: paletteThumb(WEB_GLOBE_PRESETS.midnight),
    sourceCode: `import { WebGlobe, WEB_GLOBE_PRESETS } from "@vfx-ui/react";

export function GlobeCard() {
  return (
    <div style={{ position: "relative", width: 420, height: 420 }}>
      <WebGlobe {...WEB_GLOBE_PRESETS.midnight} />
    </div>
  );
}`,
    agentNotes: [
      "Purpose: rotating dot-matrix globe for global/infra dashboards and landing pages; analytic sphere, no mesh assets.",
      "Mount: square-ish container sized to the globe; transparent background — sits on any dark surface.",
      "Props: speed (spin), phi (start longitude), theta (tilt), dotSize (fraction of cell, 0-1), globeScale, backside (far-side visibility), color/emission.",
      "Pointer: cursor x rotates and y tilts the globe (drives the phi/theta uniforms); interactive={false} pins the authored orientation.",
      "Guardrails: keep container near-square to avoid ellipse clipping; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 2, 0.05, 0.35),
      range("phi", "Phi", 0, 6.28, 0.05, 0),
      range("theta", "Theta", 0, 1.5, 0.05, 0.35),
      range("dotSize", "Dot size", 0.2, 0.9, 0.01, 0.62),
      range("backside", "Backside", 0, 1, 0.05, 0.45),
      color("color", "Dots", "#94a3b8"),
      color("emission", "Rim", "#f8fafc"),
    ],
    variants: presetVariants(WEB_GLOBE_PRESETS, {
      midnight: "Indigo dots with a silver rim.",
      wire: "Green wireframe feel, faster spin.",
      ember: "Amber globe tilted toward the viewer.",
    }, paletteThumb),
  }),

  entry({
    id: "energy-orb",
    category: "Globe",
    label: "Energy Orb",
    tags: ["globe", "orb", "smoke", "glow"],
    description: "Volumetric smoke sphere with fresnel rim and outer glow — WGSL port of ThreeUI's EnergyOrb (MIT).",
    importName: "EnergyOrb",
    thumbnail: paletteThumb(ENERGY_ORB_PRESETS.amethyst),
    sourceCode: `import { EnergyOrb, ENERGY_ORB_PRESETS } from "@vfx-ui/react";

export function OrbHero() {
  return (
    <div style={{ position: "relative", width: 480, height: 480 }}>
      <EnergyOrb {...ENERGY_ORB_PRESETS.amethyst} />
    </div>
  );
}`,
    agentNotes: [
      "Purpose: mystical energy sphere for hero sections and empty states; rotating volumetric smoke (3D fBm) with fresnel rim and outer halo.",
      "Mount: near-square container; transparent background — sits on dark surfaces.",
      "Props: speed, smokeScale (pattern density), smokeStrength (veil brightness), smokeSpeed, hue (radians), saturation, glow.",
      "Guardrails: transparent design — place over dark solids; hue rotates around the luminance axis so any palette is reachable; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("smokeScale", "Smoke scale", 0.4, 2, 0.05, 1),
      range("smokeStrength", "Smoke strength", 0, 2, 0.05, 1),
      range("hue", "Hue", 0, 6.28, 0.05, 0),
      range("saturation", "Saturation", 0, 1.5, 0.05, 1),
      range("glow", "Glow", 0, 2, 0.05, 1),
    ],
    variants: presetVariants(ENERGY_ORB_PRESETS, {
      amethyst: "Original violet arcana.",
      cyan: "Cold cyan storm orb.",
      magma: "Warm ember sphere, denser smoke.",
    }, orbThumb),
  }),

  entry({
    id: "ribbon-field",
    category: "Backgrounds",
    label: "Ribbon Field",
    tags: ["background", "ribbon", "dots", "glow"],
    description: "Three Gaussian light ribbons drifting over a dot-matrix grid with bloom cores and film grain — WGSL port of ThreeUI's RibbonField (MIT).",
    importName: "RibbonField",
    thumbnail: paletteThumb({}),
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
    thumbnail: paletteThumb({}),
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
    thumbnail: gradientThumbnail("#071021", "#1d4ed8", "#f59e0b"),
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
    description: "A frosted glass prism floating on warm paper with a white light beam bending through it — SDF triangle glass, cast shadow, and RGB dispersion in one pass.",
    importName: "LightPrism",
    thumbnail: paletteThumb({ from: "#e9e6df", to: "#a8a49b", accent: "#ffffff" }),
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
      "Purpose: the minimal 'paper + glass prism + light beam' hero backdrop — bright, editorial, and text-safe by construction (the paper base is light).",
      "Mount: full-bleed layer behind content; opaque warm-paper base — no background needed behind it.",
      "Props: prismSize (triangle circumradius), beamWidth, refraction (how far the beam bends crossing the glass), dispersion (spectral fringe strength), shadow (cast-shadow opacity), from/to/accent (paper/glass/beam colors).",
      "Pointer: interactive is off by default (a calm pointer-free backdrop); set interactive to tilt the beam and drift the light pools toward the cursor.",
      "Guardrails: pair with dark text (the surface is light); refraction above 0.35 reads as a glitch, not glass; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("prismSize", "Prism size", 0.15, 0.45, 0.005, 0.3),
      range("beamWidth", "Beam width", 0.002, 0.012, 0.0005, 0.0045),
      range("refraction", "Refraction", 0, 0.4, 0.01, 0.16),
      range("dispersion", "Dispersion", 0, 3, 0.05, 0.22),
      range("shadow", "Shadow", 0, 1.5, 0.05, 1),
      color("from", "Paper", "#e9e6df"),
      color("to", "Glass", "#a8a49b"),
      color("accent", "Beam", "#ffffff"),
    ],
    variants: presetVariants(LIGHT_PRISM_PRESETS, {
      paper: "Warm paper, white beam — the default editorial look.",
      moonstone: "Cool blue-grey paper with strong spectral fringes.",
      amber: "Kraft paper under a warm amber beam.",
    }, paletteThumb),
  }),

  entry({
    id: "live-chart",
    category: "Data",
    label: "Live Chart",
    tags: ["data", "chart", "realtime"],
    description: "Real-time GPU line chart: analytic stroke + glow + area fill from a uniform array of points.",
    importName: "LiveChart",
    thumbnail: paletteThumb({ from: "#082f49", color: "#38bdf8", accent: "#7dd3fc" }),
    sourceCode: `import { useEffect, useState } from "react";
import { LiveChart } from "@vfx-ui/react";

export function LiveTelemetry() {
  const [data, setData] = useState(() => Array.from({ length: 64 }, () => 0.5));
  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => [...prev.slice(1), Math.random()]);
    }, 200);
    return () => clearInterval(id);
  }, []);
  return <LiveChart data={data} glow={0.5} fill={0.6} />;
}`,
    agentNotes: [
      "Purpose: streaming line chart rendered entirely on the GPU — feed it sensor/telemetry/price data at any tick rate.",
      "Mount: any sized container; data array is truncated to 64 points, values clamp to 0..1.",
      "Props: data (number[]), lineWidth, glow, fill, color/accent.",
      "Pointer: hovering shows a vertical scrub line at the cursor x position; interactive={false} disables it.",
      "Guardrails: data is required; normalize values to 0..1 yourself (out-of-range values clamp silently); WebGPU required with fallback prop.",
    ],
    controls: [
      range("lineWidth", "Line width", 0.002, 0.02, 0.001, 0.006),
      range("glow", "Glow", 0, 1, 0.01, 0.4),
      range("fill", "Fill", 0, 1, 0.01, 0.6),
      color("color", "Line", "#38bdf8"),
      color("accent", "Glow", "#7dd3fc"),
    ],
    variants: presetVariants(LIVE_CHART_PRESETS, {
      signal: "Green telemetry line with a soft fill.",
      plasma: "Magenta line with a hot glow.",
      minimal: "Quiet slate line for dense dashboards.",
    }, paletteThumb),
  }),
];

export const VISIBLE_READY_SHADERS = READY_SHADERS.filter((shader) => shader.visible);

export const READY_SHADER_COLLECTION_COUNT = VISIBLE_READY_SHADERS.reduce(
  (total, shader) => total + (shader.variants?.length || 1),
  0,
);

export function getReadyShader(id: string): ReadyShader {
  return READY_SHADERS.find((shader) => shader.id === id) ?? VISIBLE_READY_SHADERS[0]!;
}
