import { lazy, type ComponentType } from "react";
import {
  FLUID_PRESETS,
  AURORA_PRESETS,
  STARFIELD_PRESETS,
  PARTICLE_PRESETS,
  GLASS_CARD_PRESETS,
  LIQUID_GLASS_PRESETS,
  MESH_GRADIENT_PRESETS,
  IRIDESCENT_PRESETS,
  VORTEX_PRESETS,
  WEB_GLOBE_PRESETS,
  ENERGY_ORB_PRESETS,
  RIBBON_FIELD_PRESETS,
  TIMELINE_ARC_PRESETS,
  LIVE_CHART_PRESETS,
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
export const READY_SHADER_CATEGORIES = ["Backgrounds", "Glass", "Data", "Globe"] as const;
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
  runtime: "webgpu";
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
  thumbnail?: (props: Record<string, number | string | number[]>) => string,
): ShaderVariant[] {
  return Object.entries(presets).map(([id, props]) => ({
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1),
    description: descriptions[id] ?? "",
    thumbnail: thumbnail ? thumbnail(props) : gradientThumbnail("#111318", "#1d2130", "#3b4252"),
    props,
  }));
}

const range = (key: string, label: string, min: number, max: number, step: number, default_: number): RangeControl => ({ key, label, min, max, step, digits: 2, default: default_ });
const color = (key: string, label: string, default_: `#${string}`): ColorControl => ({ kind: "color", key, label, default: default_ });

function paletteThumb(props: Record<string, number | string | number[]>): string {
  const from = (props.from as string) ?? "#111318";
  const to = (props.to as string) ?? (props.color as string) ?? "#1d2130";
  const accent = (props.accent as string) ?? (props.emission as string) ?? "#3b4252";
  return gradientThumbnail(from, to, accent);
}

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
    runtime: "webgpu",
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
      "Guardrails: WebGPU required with fallback prop; reduced-motion aware; avoid more than one instance per viewport.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 0.5),
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
      "Guardrails: designed for dark themes — on light themes lower intensity below 0.5; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 0.7),
      range("intensity", "Intensity", 0, 2, 0.05, 0.85),
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
    }, paletteThumb),
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
    }, paletteThumb),
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
    }, paletteThumb),
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
      "Guardrails: transparent background by design — place over a dark solid; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 0.5),
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
      "Guardrails: keep container near-square to avoid ellipse clipping; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 2, 0.05, 0.35),
      range("phi", "Phi", 0, 6.28, 0.05, 0),
      range("theta", "Theta", 0, 1.5, 0.05, 0.35),
      range("dotSize", "Dot size", 0.2, 0.9, 0.01, 0.62),
      range("backside", "Backside", 0, 1, 0.05, 0.5),
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
    }, paletteThumb),
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
    }, paletteThumb),
  }),

  entry({
    id: "timeline-arc",
    category: "Data",
    label: "Timeline Arc",
    tags: ["timeline", "milestone", "arc", "history"],
    description: "Milestone timeline on a sweeping elliptical arc — ruler ticks, milestone dot, dashed leader to an annotation (sealos.run/about-us style). Scroll inside the preview to advance years.",
    importName: "TimelineArcScrollDemo",
    thumbnail: paletteThumb({}),
    sourceCode: `import { TimelineArc } from "@vfx-ui/react";

export function Milestones() {
  return (
    <div style={{ position: "relative", width: "100%", height: 520 }}>
      <TimelineArc
        years={["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"]}
        activeIndex={4}
        annotation="2022 年 3 月，推出 v4.0 版本，引入集群镜像能力。"
      />
    </div>
  );
}`,
    agentNotes: [
      "Purpose: company/product milestone timeline — a huge elliptical arc with ruler ticks, year labels, a highlighted milestone dot and a dashed leader to an annotation.",
      "Mount: wide tall container (e.g. 100% x 520px); opaque near-white background — designed for light pages.",
      "Props: years (string[]), activeIndex, annotation (leader-line text), speed (dash march + node pulse), accent (hex color), scrollProgress (0..1 drives the active milestone from scroll).",
      "Interaction: use scrollProgress + useScrollProgress to scrub milestones with page scroll (sealos.run behavior), or TimelineArcScrollDemo for a self-contained scrollable preview; activeIndex is the static fallback.",
      "Guardrails: year labels are DOM spans positioned by the same arc math — do not CSS-transform-scale the wrapper or labels drift from the arc; text inherits page font; WebGPU required with fallback prop.",
    ],
    controls: [
      range("speed", "Speed", 0, 3, 0.05, 1),
      range("activeIndex", "Active index", 0, 7, 1, 4),
      color("accent", "Accent", "#2563eb"),
    ],
    variants: presetVariants(TIMELINE_ARC_PRESETS, {
      classic: "Sealos blue accent.",
      emerald: "Green milestones.",
      violet: "Violet milestones, faster march.",
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
