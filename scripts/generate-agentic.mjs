#!/usr/bin/env node
/**
 * Agentic docs generator (M4 differentiator).
 *
 * Reads the built registry (registry/dist) and emits machine-consumable
 * documentation: llms.txt (index), agents.md, and one .md per component
 * with props, variants, usage, and pitfalls — so coding agents can pick
 * and integrate components without browsing a website.
 *
 * Usage: node scripts/generate-agentic.mjs [--out <dir>]
 */
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registryDir = join(root, "registry", "dist");
const outDir = process.argv.includes("--out")
  ? resolve(process.argv[process.argv.indexOf("--out") + 1])
  : join(root, "apps", "docs", "public");

if (!existsSync(join(registryDir, "index.json"))) {
  console.error("agentic: registry/dist/index.json missing — run `node registry/build.mjs` first.");
  process.exit(1);
}

const index = JSON.parse(readFileSync(join(registryDir, "index.json"), "utf8"));

function itemDoc(name) {
  const item = JSON.parse(readFileSync(join(registryDir, "r", `${name}.json`), "utf8"));
  // The item's own component lands at components/<Name>.tsx; every dependency
  // (shared runtime + base shaders) is namespaced under components/vfx/.
  const componentFile = item.files.find((f) => (f.target ?? f.path).endsWith(".tsx") && !(f.target ?? f.path).includes("vfx/"));
  const source = componentFile?.content ?? "";
  const propsMatch = source.match(/export interface (\w+Props)[^{]*\{([\s\S]*?)\n\}/);
  const presetsMatch = source.match(/export const (\w+_PRESETS)/);
  // Shader detection spans the whole bundle: heroes carry their base shader's
  // WGSL export inside the embedded vfx/ dependency file.
  const shaderMatch = source.match(/export const (\w+_SHADER)/)
    ?? item.files.map((f) => f.content.match(/export const (\w+_SHADER)/)).find(Boolean);
  const inheritedContent = /extends HeroContentProps/.test(source) ? [
    "title?: ReactNode", "subtitle?: ReactNode", "eyebrow?: string",
    "primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null",
    "secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null",
    "children?: ReactNode (replaces default content)", "interactive?: boolean (default false)",
    "className?: string", "style?: CSSProperties", ...(/StudioHeroFrame/.test(source) ? [] : ["fallback?: ReactNode"]),
  ] : [];
  const props = propsMatch
    ? propsMatch[2]
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("/") && !l.startsWith("*"))
        .map((l) => l.replace(/\s*;$/, ""))
    : [];
  props.push(...inheritedContent);
  if (/extends FooterContentProps/.test(source)) props.push(
    "brand?: string (artwork is generated from your text)", "title?: ReactNode", "description?: ReactNode",
    "cta?: { label: string; href: string } | null", "groups?: readonly { label: string; links: readonly { label: string; href: string }[] }[]",
    "legal?: readonly { label: string; href: string }[]", "copyright?: ReactNode",
    "children?: ReactNode (replaces introduction and navigation)", "interactive?: boolean (default true)",
    "className?: string", "style?: CSSProperties (--vfx-footer-display sets the brand font)",
  );
  const isOptical = ["glass-card", "glass-lens", "liquid-glass", "light-prism"].includes(name);
  const isRadiance = name === "radiant-dots";
  const deps = item.dependencies ?? [];
  const needsVgpu = deps.some((d) => d.startsWith("vgpu"));
  const extraDeps = deps.filter((d) => !d.startsWith("vgpu"));
  const lines = [
    `# ${item.title ?? name}`,
    "",
    item.description ?? "",
    "",
    "## Install",
    "",
    "```bash",
    `npm install @vfx-ui/react${needsVgpu ? " vgpu@0.3.1" : ""}${extraDeps.length ? ` ${extraDeps.join(" ")}` : ""}`,
    "```",
    "",
    ...(BLOCK_USAGE[name] ? [
      "```tsx",
      blockUsage(name),
      "```",
    ] : [
      "```tsx",
      `import { ${nameToComponent(name)} } from "@vfx-ui/react";`,
      "",
      `export function Demo() {`,
      ...(name.startsWith("hero-") ? [
        `  return <${nameToComponent(name)} title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;`,
      ] : name.startsWith("footer-") ? [
        `  return <${nameToComponent(name)} brand="YOUR BRAND" title="Let’s talk." cta={{ label: "Contact", href: "mailto:hello@example.com" }} groups={[{ label: "Explore", links: [{ label: "About", href: "/about" }] }]} copyright="© Your studio" />;`,
      ] : isOptical || isRadiance || name === "astra-field" ? [`  return <div style={{ height: 520 }}><${nameToComponent(name)} interactive /></div>;`] : [`  return <${nameToComponent(name)} />;`]),
      `}`,
      "```",
    ]),
    "",
    "## Props",
    "",
    ...(props.length ? props.map((p) => `- \`${p}\``) : ["(see source)"]),
    "",
  ];
  if (presetsMatch) {
    lines.push("## Variants", "", "Import the preset bag and spread it into props:", "", "```tsx", `import { ${presetsMatch[1]} } from "@vfx-ui/react";`, "```", "");
  }
  if (shaderMatch && name !== "light-prism") {
    lines.push("## Shader", "", `WGSL source is exported as \`${shaderMatch[1]}\` — read it to learn how the effect works.`, "");
  }
  lines.push(
    "## Notes for agents",
    "",
    ...(name === "astra-field" ? [
      "- Original WebGL spiral star field inspired by OpenAI Astra. No external assets or Three.js dependency.",
      "- Stars gather from a scattered 3D cloud on mount. intro defaults to true; introDuration defaults to 4.8 seconds, independent of ambient speed. Reduced motion skips assembly.",
      "- Drag or use arrow keys to orbit; Home resets. Place your own copy in a sibling DOM layer.",
      "- Offscreen and hidden tabs pause. Reduced motion freezes ambient movement. Provide a sized parent.",
    ] : name === "light-prism" ? [
      "- Complete Vercel VGPU MIT light pipeline, including beveled solid geometry, spectral optics, environment and wall baking, and multiple glass passes.",
      "- Source and license are bundled. No remote assets. Use a sized parent; pointer changes beam incidence and camera orbit.",
      "- LIGHT_PRISM_SHADER, to and accent are deprecated compatibility exports/props. The live component uses a multi-pass pipeline and optical spectral colors.",
    ] : isRadiance ? [
      "- Requires WebGPU. Render a sized parent and provide fallback for unsupported browsers.",
      "- SSR yields an inert decorative canvas; loading/status text belongs in your own DOM.",
      "- Real jump flood, distance field and radiance cascades adapted from Vercel's MIT example, with original orbit/grid arrangements.",
      "- Working field capped at 320px; animation capped at 30fps and suspended offscreen, in hidden tabs and under reduced motion.",
      "- animate=false or speed=0 freezes time; changes to other props still redraw the paused field.",
    ] : isOptical ? [
      "- Original ray-marched glass solids over procedural studio scenes; arbitrary DOM behind the canvas is not refracted.",
      "- Requires WebGPU. Provide a sized parent. Existing public prop names and preset IDs remain; visual output has changed.",
      "- Pointer tilts the object. Reduced motion freezes time and disables pointer movement. No demonstration text is baked into the shader.",
      "- Configure the documented component props. For raw uniforms, use the exported shader with VfxCanvas instead.",
    ] : shaderMatch
      ? [
          "- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).",
          "- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.",
          "- `prefers-reduced-motion` freezes animation automatically.",
          "- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.",
        ]
      : [
          needsVgpu || extraDeps.length ? "- Rendered with a third-party runtime (see Install dependencies)." : "- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.",
          "- SSR-safe: content and navigation render on the server; animation starts after mount.",
          "- `prefers-reduced-motion` skips animation automatically.",
        ]),
    "",
  );
  return lines.join("\n");
}

const BLOCK_USAGE = {
  "block-nav": `import { BlockNav } from "@vfx-ui/react";

export function SiteHeader() {
  return (
    <BlockNav
      brand="Northwind"
      links={[{ label: "Product", href: "#product" }, { label: "Pricing", href: "#pricing" }]}
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
      primaryCta={{ label: "Start free", href: "/start" }}
      media={<img src="/app-screenshot.png" alt="Orbit release dashboard" />}
    />
  );
}`,
  "block-feature-grid": `import { BlockFeatureGrid } from "@vfx-ui/react";

export function Features() {
  return (
    <BlockFeatureGrid
      title="Built for the way teams ship."
      items={[
        { title: "A release graph", description: "Deploys, flags and rollbacks on one canvas.", featured: true },
        { title: "Explained flags", description: "Owner, rollout and expiry on every flag." },
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
    />
  );
}`,
  "block-integrations": `import { BlockIntegrations } from "@vfx-ui/react";

export function Stack() {
  return (
    <BlockIntegrations
      brand="Orbit"
      title="Plugs into the tools you already trust."
      integrations={[{ name: "GitHub", href: "/integrations/github" }, { name: "Linear", href: "/integrations/linear" }]}
    />
  );
}`,
  "block-comparison": `import { BlockComparison } from "@vfx-ui/react";

export function BeforeAfter() {
  return (
    <BlockComparison
      title="Drag to see the redesign."
      before={<img src="/before.png" alt="Before" />}
      after={<img src="/after.png" alt="After" />}
    />
  );
}`,
  "block-testimonials": `import { BlockTestimonials } from "@vfx-ui/react";

export function Voices() {
  return (
    <BlockTestimonials
      title="The teams who ship weekly, talk like this."
      testimonials={[{ quote: "The replay is the status update.", name: "Mara Ellison", role: "Head of Platform, Fieldnote", href: "/customers/fieldnote" }]}
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
      items={[{ question: "How long does setup take?", answer: "Most teams see their first graph within ten minutes." }]}
    />
  );
}`,
  "block-cta": `import { BlockCta, WaveBackground } from "@vfx-ui/react";

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
  "example-launch": `import { ExampleLaunch } from "@vfx-ui/react";

export default function LaunchPage() {
  return <ExampleLaunch />;
}`,
  "example-studio": `import { ExampleStudio } from "@vfx-ui/react";

export default function StudioPage() {
  return <ExampleStudio />;
}`,
};

function blockUsage(name) {
  return BLOCK_USAGE[name] ?? `import { ${nameToComponent(name)} } from "@vfx-ui/react";`;
}

function nameToComponent(name) {
  return name.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join("");
}

function main() {
  mkdirSync(join(outDir, "components"), { recursive: true });
  const names = readdirSync(join(registryDir, "r")).map((f) => f.replace(/\.json$/, ""));

  const llms = [
    "# VFX UI",
    "",
    "> Shader-native visual effect components for React, rendered via WebGPU (vgpu).",
    "> Expressive hero and footer sections, GPU backgrounds, and focused DOM interactions for your own content.",
    "",
    "## Install",
    "",
    "```bash",
    "npm install @vfx-ui/react vgpu@0.3.1",
    "```",
    "",
    "## Component catalog",
    "",
    ...index.items.map((it) => `- [${it.title}](https://vfx-ui.com/components/${it.name}.md): ${it.description}`),
    "",
    "## Per-component docs (machine-readable)",
    "",
    ...names.map((n) => `- https://vfx-ui.com/components/${n}.md`),
    "",
    "## Scope guard",
    "",
    "This library provides customizable hero and footer sections, GPU visuals, focused interactions, and complete page Blocks for marketing sites.",
    "Hero sample copy is replaceable. Pass title/subtitle or children and configure CTA href/onClick.",
    "Footer sample copy is replaceable. Configure brand, title, CTA, groups, legal links and copyright. Supply children for your own introduction/navigation layout.",
    "Blocks (block-*) are full page sections: all copy, links, colors and items arrive through props. They are pure DOM/CSS — no WebGPU required — and compose into complete pages; see example-launch and example-studio.",
    "Example pages ship fictional demo content (marked on screen): replace it before going live.",
    "DOM interaction components and blocks do not require WebGPU. This is not a general-purpose UI kit.",
    "",
  ].join("\n");
  writeFileSync(join(outDir, "llms.txt"), llms);

  const agents = [
    "# VFX UI — agent guide",
    "",
    llms,
    ...names.map((n) => itemDoc(n)),
  ].join("\n");
  writeFileSync(join(outDir, "agents.md"), agents);

  for (const n of names) {
    writeFileSync(join(outDir, "components", `${n}.md`), itemDoc(n));
  }
  // Drop stale docs for components that no longer exist in the registry.
  const keep = new Set(names.map((n) => `${n}.md`));
  for (const f of readdirSync(join(outDir, "components"))) {
    if (f.endsWith(".md") && !keep.has(f)) rmSync(join(outDir, "components", f));
  }
  console.log(`agentic: wrote llms.txt, agents.md, and ${names.length} component docs to ${outDir}`);
}

main();
