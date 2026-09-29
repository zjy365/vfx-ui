#!/usr/bin/env node
/**
 * AI builder prompt generator.
 *
 * Reads the built registry (registry/dist) and emits one paste-ready prompt
 * per component into apps/docs/public/prompts/:
 *
 *   - <name>.md   — a prompt users paste into Lovable / v0 / bolt.new so the
 *                   builder installs the component with the shadcn CLI and
 *                   wires it into the page with a correct usage example.
 *   - index.md    — table of every generated prompt.
 *   - README.md   — human-facing explainer (what these are, how to use them).
 *
 * Each <name>.md carries a YAML-style header, a short intro with paste
 * locations, and the prompt itself inside a four-backtick fence (the site's
 * copy button copies that block; routing is handled centrally).
 *
 * The script is idempotent: rerun it after the registry changes and every
 * file is regenerated deterministically, and prompts for removed components
 * are deleted. After writing, every generated ```tsx block is parsed with
 * esbuild so broken JSX fails the run.
 *
 * Usage: node scripts/generate-prompts.mjs [--out <dir>]
 */
import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registryDir = join(root, "registry", "dist");
const outDirArg = process.argv.includes("--out")
  ? resolve(root, process.argv[process.argv.indexOf("--out") + 1])
  : null;
const outDir = outDirArg ?? join(root, "apps", "docs", "public", "prompts");
const SITE = "https://vfx-ui.com";

if (!existsSync(join(registryDir, "index.json"))) {
  console.error("prompts: registry/dist/index.json missing — run `node registry/build.mjs` first.");
  process.exit(1);
}

const index = JSON.parse(readFileSync(join(registryDir, "index.json"), "utf8"));

/* ------------------------------------------------------------------ *
 * Lightweight source parsing (no TypeScript dependency)
 * ------------------------------------------------------------------ */

/**
 * Step through `text` with full mutual exclusion between strings and
 * comments, invoking `onChar(ch, index, inString)` for every character
 * except comment contents (string characters, including their quotes, are
 * emitted with `inString` so callers can preserve literals verbatim).
 * Doc comments are full of apostrophes ("each edge's color"), so quotes may
 * only be tracked outside comments and comments may only be tracked outside
 * strings.
 */
function scanCode(text, onChar) {
  let quote = null;
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];
    if (quote) {
      onChar(ch, i, true);
      if (ch === "\\") { i++; if (i < text.length) onChar(text[i], i, true); i++; continue; }
      if (ch === quote) quote = null;
      i++;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { quote = ch; onChar(ch, i, true); i++; continue; }
    if (ch === "/" && next === "/") { i = text.indexOf("\n", i); if (i === -1) return; continue; }
    if (ch === "/" && next === "*") { i = text.indexOf("*/", i + 2); if (i === -1) return; i += 2; continue; }
    onChar(ch, i, false);
    i++;
  }
}

/** Split `text` on `sep` occurring outside strings, comments and (), [], {} nesting. */
function splitTopLevel(text, sep) {
  const parts = [];
  let depth = 0;
  let current = "";
  let splitAt = -1;
  scanCode(text, (ch, index, inString) => {
    if (inString) { current += ch; return; }
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    else if (ch === "{") depth++;
    else if (ch === "}") depth--;
    if (ch === sep && depth === 0) {
      parts.push(current);
      current = "";
      splitAt = index;
      return;
    }
    current += ch;
  });
  if (current.trim() || splitAt === -1) parts.push(current);
  return parts;
}

/** Match the brace-delimited block starting at or after `from`. */
function readBraceBlock(text, from) {
  const start = text.indexOf("{", from);
  if (start === -1) return null;
  let depth = 0;
  let end = -1;
  scanCode(text, (ch, index, inString) => {
    if (inString || index < start) return;
    if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth === 0 && end === -1) end = index; }
  });
  if (end === -1) return null;
  return text.slice(start + 1, end);
}

/** Props declared on the main component's exported Props interface. */
function parsePropsInterface(source) {
  const header = source.match(/export\s+(?:interface|type)\s+(\w+Props)(?:\s+extends\s+([\w.]+))?\s*(?:=\s*)?\{/);
  if (!header) return { ext: null, props: [] };
  const body = readBraceBlock(source, header.index + header[0].length - 1);
  if (!body) return { ext: header[2] ?? null, props: [] };
  const props = [];
  for (const field of splitTopLevel(body, ";")) {
    const docs = [...field.matchAll(/\/\*\*([\s\S]*?)\*\//g)]
      .map((m) => m[1].split("\n").map((l) => l.replace(/^\s*\*\s?/, "").trim()).filter(Boolean).join(" "));
    const clean = field.replace(/\/\*[\s\S]*?\*\//g, "").trim();
    const nameMatch = clean.match(/^(\?)?\s*(\w+)\s*(\?)?\s*:/);
    if (!nameMatch) continue;
    const type = clean.slice(nameMatch[0].length).trim();
    props.push({
      name: nameMatch[2],
      optional: Boolean(nameMatch[1] || nameMatch[3]),
      type,
      doc: docs[0] ?? null,
    });
  }
  return { ext: header[2] ?? null, props };
}

/** Default values from the component's destructured function parameters. */
function parseDefaults(source, componentName) {
  const signatureStart = source.indexOf(`export function ${componentName}({`);
  if (signatureStart === -1) return new Map();
  const open = signatureStart + `export function ${componentName}(`.length;
  // Walk to the `)` that closes the parameter list (top-level within the params).
  let depth = 0;
  let close = -1;
  scanCode(source, (ch, index, inString) => {
    if (index < open || inString) return;
    if (ch === "(" || ch === "[" || ch === "{") depth++;
    else if (ch === ")" || ch === "]" || ch === "}") {
      if (ch === ")" && depth === 0) { if (close === -1) close = index; return; }
      depth--;
    }
  });
  if (close === -1) return new Map();
  let inner = source.slice(open + 1, close).trim(); // drop the outer parens
  if (inner.startsWith("{") && inner.endsWith("}")) inner = inner.slice(1, -1); // destructuring braces
  const defaults = new Map();
  for (const entry of splitTopLevel(inner, ",")) {
    if (entry.trim().startsWith("...")) continue;
    const eq = splitTopLevel(entry, "=").map((s) => s.trim());
    if (eq.length === 2 && /^\w+$/.test(eq[0])) defaults.set(eq[0], eq[1]);
  }
  return defaults;
}

/** Detect a `*_PRESETS` export and its keys, if the main file ships one. */
function parsePresets(source) {
  const match = source.match(/export\s+const\s+(\w+_PRESETS)\s*(?:[^=]*=\s*)?\{/);
  if (!match) return null;
  const body = readBraceBlock(source, match.index + match[0].length - 1);
  if (!body) return null;
  const keys = splitTopLevel(body, ",")
    .map((entry) => entry.split(":")[0].trim())
    .filter((key) => /^\w+$/.test(key));
  return keys.length ? { constName: match[1], keys } : null;
}

/** Render a parsed default as a JSX attribute value (null = not representable). */
function jsxAttrValue(token) {
  if (token == null) return null;
  const t = token.trim();
  if (/^(["'])(?:[^\\]|\\.)*\1$/.test(t)) return t; // string literal, keep as-is
  if (/^-?\d*\.?\d+(e-?\d+)?$/i.test(t)) return `{${t.startsWith(".") ? `0${t}` : t}}`; // number
  if (/^[.\d\s,[\]]+$/.test(t)) return `{${t.replace(/\.(\d)/g, "0.$1")}}`; // numeric tuple
  if (t === "true" || t === "false") return `{${t}}`;
  return null;
}

const COLOR_NAMES = new Set([
  "color", "tint", "accent", "from", "to", "primary", "secondary", "emission",
  "background", "labelColor", "baseColor", "upColor", "downColor", "leftColor",
  "rightColor", "deep", "ink", "paper",
]);

const isHex = (token) => token != null && /^["'][#][0-9a-f]{3,8}["']$/i.test(token.trim());
const isColorProp = (prop, token) => COLOR_NAMES.has(prop.name) || isHex(token);
const isNumberDefault = (token) => token != null && /^-?[\d.]+$/.test(token.trim());

const nameToComponent = (name) => name.split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join("");

/* ------------------------------------------------------------------ *
 * Usage examples
 * ------------------------------------------------------------------ */

const HERO_COPY = {
  eyebrow: "Introducing your product",
  title: "Ship something people remember.",
  subtitle: "One sentence on what you build, one on who it is for.",
  primaryCta: `{ label: "Get started", href: "/signup" }`,
  secondaryCta: `{ label: "View the docs", href: "/docs" }`,
};

/** Visual props to showcase: colors first, then numbers, capped. */
function visualProps(props, defaults, { max = 3, skip = [] } = {}) {
  const skipSet = new Set([...skip, "className", "style", "children", "fallback",
    "interactive", "animate", "scheme", "uniforms", "globeProps", "markers", "badges"]);
  const colors = [];
  const numbers = [];
  for (const prop of props) {
    if (skipSet.has(prop.name) || !defaults.has(prop.name)) continue;
    const token = defaults.get(prop.name);
    if (jsxAttrValue(token) == null) continue;
    if (isColorProp(prop, token)) colors.push(`${prop.name}=${jsxAttrValue(token)}`);
    else if (isNumberDefault(token)) numbers.push(`${prop.name}=${jsxAttrValue(token)}`);
  }
  return [...colors, ...numbers].slice(0, max);
}

function heroExample(name, { props, defaults, presets }) {
  const Component = nameToComponent(name);
  const attrs = [
    `eyebrow="${HERO_COPY.eyebrow}"`,
    `title="${HERO_COPY.title}"`,
    `subtitle="${HERO_COPY.subtitle}"`,
    `primaryCta={${HERO_COPY.primaryCta}}`.replace("{ {", "{").replace("} }", "}}"),
    `secondaryCta={${HERO_COPY.secondaryCta}}`.replace("{ {", "{").replace("} }", "}}"),
    "interactive",
  ];
  if (presets) attrs.push(`{...${presets.constName}.${presets.keys[0]}}`);
  else attrs.push(...visualProps(props, defaults, { max: 3 }));
  return [
    `import { ${Component}${presets ? `, ${presets.constName}` : ""} } from "@/components/${Component}";`,
    "",
    "export function Hero() {",
    "  return (",
    "    <main>",
    `      <${Component}`,
    ...attrs.map((a) => `        ${a}`),
    "      />",
    "    </main>",
    "  );",
    "}",
  ].join("\n");
}

function footerExample(name, { props, defaults }) {
  const Component = nameToComponent(name);
  const attrs = [
    `brand="Acme Studio"`,
    `title="Let’s build something rare."`,
    `cta={{ label: "Get in touch", href: "mailto:hello@example.com" }}`,
    "groups={[",
    "  { label: \"Product\", links: [{ label: \"Features\", href: \"/features\" }, { label: \"Pricing\", href: \"/pricing\" }] },",
    "  { label: \"Company\", links: [{ label: \"About\", href: \"/about\" }, { label: \"Blog\", href: \"/blog\" }] },",
    "]}",
    "legal={[{ label: \"Privacy\", href: \"/privacy\" }, { label: \"Terms\", href: \"/terms\" }]}",
    `copyright="© 2026 Acme Studio, Inc."`,
    ...visualProps(props, defaults, { max: 2 }),
  ];
  return [
    `import { ${Component} } from "@/components/${Component}";`,
    "",
    "export function SiteFooter() {",
    "  return (",
    `    <${Component}`,
    ...attrs.map((a) => `      ${a}`),
    "    />",
    "  );",
    "}",
  ].join("\n");
}

function backgroundExample(name, { props, defaults, presets }, headline) {
  const Component = nameToComponent(name);
  const attrs = [];
  if (presets) attrs.push(`{...${presets.constName}.${presets.keys[0]}}`, "interactive");
  else attrs.push(...visualProps(props, defaults, { max: 3 }), "interactive");
  const importExtra = presets ? `, ${presets.constName}` : "";
  return [
    `import { ${Component}${importExtra} } from "@/components/${Component}";`,
    "",
    "export function BackdropSection() {",
    "  return (",
    "    <section style={{ position: \"relative\", minHeight: \"100dvh\" }}>",
    `      <${Component}`,
    ...attrs.map((a) => `        ${a}`),
    "      />",
    "      <div style={{ position: \"relative\", zIndex: 1, padding: \"10rem 2rem\", maxWidth: \"72rem\", margin: \"0 auto\" }}>",
    `        <h1>${headline}</h1>`,
    "        <p>Your own content renders on top of the effect.</p>",
    "      </div>",
    "    </section>",
    "  );",
    "}",
  ].join("\n");
}

function contentExample(name, inner, parsed, wrapperProps = []) {
  const Component = nameToComponent(name);
  const attrs = [];
  if (parsed?.presets) attrs.push(`{...${parsed.presets.constName}.${parsed.presets.keys[0]}}`);
  attrs.push(...wrapperProps, ...visualProps(parsed?.props ?? [], parsed?.defaults ?? new Map(), { max: 1 }));
  const attrText = attrs.length ? ` ${attrs.join(" ")}` : "";
  return [
    `import { ${Component}${parsed?.presets ? `, ${parsed.presets.constName}` : ""} } from "@/components/${Component}";`,
    "",
    "export function Showcase() {",
    "  return (",
    `    <${Component}${attrText}>`,
    ...inner.map((line) => `      ${line}`),
    `    </${Component}>`,
    "  );",
    "}",
  ].join("\n");
}

/** Hand-tuned examples for full-page Blocks and Examples (data-heavy props). */
const CURATED_EXAMPLES = {
  "block-nav": `import { BlockNav } from "@/components/BlockNav";

export function SiteHeader() {
  return (
    <BlockNav
      brand="Acme"
      links={[
        { label: "Product", href: "/product" },
        { label: "Pricing", href: "/pricing" },
        { label: "Docs", href: "/docs" },
      ]}
      action={{ label: "Get started", href: "/signup" }}
      sticky
    />
  );
}`,
  "block-showcase": `import { BlockShowcase } from "@/components/BlockShowcase";

export function ProductTour() {
  return (
    <BlockShowcase
      eyebrow="Product tour"
      title="Every release, on one canvas."
      description="A short walkthrough of the workspace your team sees every day."
      primaryCta={{ label: "Start free", href: "/signup" }}
      secondaryCta={{ label: "Watch the demo", href: "/demo" }}
      media={<img src="/product-shot.png" alt="The release canvas view" />}
      caption="Deploys, flags and rollbacks on a single board."
    />
  );
}`,
  "block-feature-grid": `import { BlockFeatureGrid } from "@/components/BlockFeatureGrid";

export function Features() {
  return (
    <BlockFeatureGrid
      eyebrow="Why teams switch"
      title="Built for the way your team ships."
      description="Three reasons teams move their release process here."
      items={[
        { title: "A release graph", description: "Deploys, flags and rollbacks on one canvas.", featured: true },
        { title: "Explained flags", description: "Owner, rollout and expiry documented on every flag." },
        { title: "Instant replays", description: "Watch any release unfold again, step by step." },
      ]}
    />
  );
}`,
  "block-feature-tabs": `import { BlockFeatureTabs } from "@/components/BlockFeatureTabs";

export function Surfaces() {
  return (
    <BlockFeatureTabs
      eyebrow="Surfaces"
      title="One graph. Three ways to look at it."
      tabs={[
        { label: "Plan", description: "Sketch the release as a graph." },
        { label: "Ship", description: "Flags with staged rollouts and auto-pause." },
        { label: "Learn", description: "Replays and metrics for every launch." },
      ]}
      action={{ label: "See it live", href: "/demo" }}
    />
  );
}`,
  "block-scroll-story": `import { BlockScrollStory } from "@/components/BlockScrollStory";

export function Story() {
  return (
    <BlockScrollStory
      eyebrow="How it works"
      title="A launch week, told in three scenes."
      steps={[
        { eyebrow: "Monday", title: "Sketch the week.", text: "Drop deploys onto one canvas." },
        { eyebrow: "Wednesday", title: "Ship behind a canary.", text: "Staged rollouts pause when error budgets dip." },
        { eyebrow: "Friday", title: "Tell the story.", text: "The replay becomes your status update." },
      ]}
    />
  );
}`,
  "block-process-steps": `import { BlockProcessSteps } from "@/components/BlockProcessSteps";

export function HowItWorks() {
  return (
    <BlockProcessSteps
      eyebrow="Setup"
      title="From install to insight in an afternoon."
      steps={[
        { title: "Connect your repos", text: "One OAuth flow, automatic indexing." },
        { title: "Describe a release", text: "The graph assembles itself." },
        { title: "Ship and watch", text: "Staged rollouts with auto-pause." },
      ]}
      action={{ label: "Start free", href: "/signup" }}
    />
  );
}`,
  "block-integrations": `import { BlockIntegrations } from "@/components/BlockIntegrations";

export function Stack() {
  return (
    <BlockIntegrations
      brand="Acme"
      title="Plugs into the tools you already trust."
      integrations={[
        { name: "GitHub", href: "/integrations/github" },
        { name: "Linear", href: "/integrations/linear" },
        { name: "Slack", href: "/integrations/slack" },
      ]}
      action={{ label: "Browse all", href: "/integrations" }}
    />
  );
}`,
  "block-comparison": `import { BlockComparison } from "@/components/BlockComparison";

export function BeforeAfter() {
  return (
    <BlockComparison
      eyebrow="Redesign"
      title="Drag to see the redesign."
      before={<img src="/before.png" alt="Interface before the redesign" />}
      after={<img src="/after.png" alt="Interface after the redesign" />}
      beforeLabel="Before"
      afterLabel="After"
    />
  );
}`,
  "block-testimonials": `import { BlockTestimonials } from "@/components/BlockTestimonials";

export function Voices() {
  return (
    <BlockTestimonials
      eyebrow="Customers"
      title="The teams who ship weekly talk like this."
      testimonials={[
        { quote: "The replay is the status update.", name: "Mara Ellison", role: "Head of Platform, Fieldnote", href: "/customers/fieldnote" },
        { quote: "Rollbacks stopped being scary.", name: "Ivan Costa", role: "Staff Engineer, Datum", href: "/customers/datum" },
      ]}
      demoNote={null}
    />
  );
}`,
  "block-pricing": `import { BlockPricing } from "@/components/BlockPricing";

export function Plans() {
  return (
    <BlockPricing
      eyebrow="Pricing"
      title="Start free. Scale when your team does."
      description="Every plan includes the release graph. Pay when your team grows."
      plans={[
        { name: "Solo", priceMonthly: 0, basis: "once", description: "For side projects.", features: ["1 release graph", "Community support"], cta: { label: "Start free", href: "/signup" } },
        { name: "Team", priceMonthly: 24, priceAnnual: 20, badge: "Most popular", featured: true, description: "Per seat, for teams shipping weekly.", features: ["Unlimited graphs", "Canary rollouts", "Slack + Linear sync"], cta: { label: "Start 14-day trial", href: "/trial" } },
      ]}
      annualNote="2 months free"
    />
  );
}`,
  "block-faq": `import { BlockFaq } from "@/components/BlockFaq";

export function Answers() {
  return (
    <BlockFaq
      eyebrow="FAQ"
      title="Questions engineers actually ask."
      items={[
        { question: "How long does setup take?", answer: "Most teams see their first release graph within ten minutes." },
        { question: "Do you support self-hosting?", answer: "Enterprise plans include a self-hosted runner for build steps." },
      ]}
      contact={{ text: "Still curious?", action: { label: "Talk to us", href: "mailto:hello@example.com" } }}
    />
  );
}`,
  "block-cta": `import { BlockCta } from "@/components/BlockCta";

export function Closing() {
  return (
    <BlockCta
      eyebrow="Get started"
      title="Your next release could feel like this."
      description="Set up in minutes; keep the graph forever."
      primaryCta={{ label: "Get started free", href: "/signup" }}
      secondaryCta={{ label: "Read the docs", href: "/docs" }}
    />
  );
}`,
  "example-launch": `import { ExampleLaunch } from "@/components/ExampleLaunch";

export default function LaunchPage() {
  return <ExampleLaunch />;
}`,
  "example-studio": `import { ExampleStudio } from "@/components/ExampleStudio";

export default function StudioPage() {
  return <ExampleStudio />;
}`,
};

const CONTENT_COMPONENTS = {
  "glass-card": {
    wrapperProps: ["interactive"],
    inner: [
      "<h3>Optical glass, ray-marched live</h3>",
      "<p>Real content sits above the glass; the effect is rendered behind it.</p>",
    ],
  },
  "spectral-card": {
    wrapperProps: [],
    inner: [
      "<h3>A card that answers the cursor</h3>",
      "<p>Wrap any content; the card tilts and glares as the pointer moves.</p>",
    ],
  },
  magnetic: {
    wrapperProps: [],
    inner: [
      "<button type=\"button\" style={{ padding: \"12px 24px\", borderRadius: 999 }}>",
      "  Pull me toward the cursor",
      "</button>",
    ],
  },
  "kinetic-text": null, // handled via props below
};

function usageExample(item, parsed) {
  const { name, categories } = item;
  const category = categories?.[0] ?? "Components";
  if (CURATED_EXAMPLES[name]) return CURATED_EXAMPLES[name];
  switch (category) {
    case "Heroes":
      return heroExample(name, parsed);
    case "Footers":
      return footerExample(name, parsed);
    case "Glass":
      if (CONTENT_COMPONENTS[name]) {
        const cfg = CONTENT_COMPONENTS[name];
        return contentExample(name, cfg.inner, parsed, cfg.wrapperProps);
      }
      return backgroundExample(name, parsed, "Glass, rendered as light");
    case "Interactions":
      if (CONTENT_COMPONENTS[name]) {
        const cfg = CONTENT_COMPONENTS[name];
        return contentExample(name, cfg.inner, parsed, cfg.wrapperProps);
      }
      return backgroundExample(name, parsed, "Interaction, rendered live");
    case "Text": {
      const Component = nameToComponent(name);
      const attrs = [`text="Motion is the message"`, ...visualProps(parsed.props, parsed.defaults, { max: 1 })];
      return [
        `import { ${Component} } from "@/components/${Component}";`,
        "",
        "export function Headline() {",
        "  return (",
        "    <h1>",
        `      <${Component}`,
        ...attrs.map((a) => `        ${a}`),
        "      />",
        "    </h1>",
        "  );",
        "}",
      ].join("\n");
    }
    default:
      return backgroundExample(name, parsed, "An animated backdrop, no video file");
  }
}

/* ------------------------------------------------------------------ *
 * Prompt assembly
 * ------------------------------------------------------------------ */

const USAGE_PHRASE = {
  Heroes: "as the hero section of your landing page",
  Footers: "as the site footer",
  Backgrounds: "as an animated, GPU-rendered background section",
  Glass: "as a glass optics section",
  Interactions: "as an interactive content element",
  Text: "to animate a headline",
  Blocks: "as a complete marketing page section",
};

function customizeBullets(item, parsed) {
  const { props, defaults, presets } = parsed;
  const byName = new Map(props.map((p) => [p.name, p]));
  const bullets = [];
  const category = item.categories?.[0];

  if (item.name.startsWith("example-")) {
    bullets.push("- Every word on this page is fictional demo copy — replace it with your product's real content before going live (each section is a VFX UI Block driven entirely by props).");
  } else if (category === "Heroes") {
    bullets.push("- Replace the copy: `eyebrow`, `title` and `subtitle` are plain props; point `primaryCta`/`secondaryCta` at your real pages (or pass `null` to drop one).");
  } else if (category === "Blocks") {
    const copyProps = ["eyebrow", "title", "description"].filter((n) => byName.has(n));
    if (copyProps.length) {
      bullets.push(`- Replace the copy: ${copyProps.map((n) => `\`${n}\``).join(", ")} and any CTA labels/hrefs are plain props — point them at your real pages and wording.`);
    } else if (byName.has("brand")) {
      bullets.push("- Data-driven: set `brand` and wire `links`/`action` to your real routes.");
    } else {
      bullets.push("- Every string shown arrives through props — replace the demo copy with your real content and links.");
    }
  }
  if (category === "Footers") {
    bullets.push("- Make it yours: set `brand` to your name, wire `groups` and `legal` to your real routes, and update `cta` and `copyright`.");
  }
  const colorProps = props.filter((p) => defaults.has(p.name) && isColorProp(p, defaults.get(p.name)) && jsxAttrValue(defaults.get(p.name)));
  if (colorProps.length) {
    const shown = colorProps.slice(0, 3).map((p) => `${p.name}=${jsxAttrValue(defaults.get(p.name))}`).join(", ");
    bullets.push(`- Brand colors: pass ${shown} (hex strings) to match your palette.`);
  } else if (byName.has("accent")) {
    bullets.push("- Brand colors: pass `accent=\"#8b5cf6\"` (any hex) to recolor buttons and highlights.");
  }
  if (byName.has("children")) {
    bullets.push("- `children` replaces the default content entirely: pass your own JSX for full layout control.");
  } else if (category === "Heroes") {
    bullets.push("- `children` replaces the whole default content block if you need a custom layout inside the hero.");
  }
  const numberProps = props.filter((p) => !COLOR_NAMES.has(p.name) && defaults.has(p.name) && isNumberDefault(defaults.get(p.name)));
  if (numberProps.length === 1) {
    bullets.push(`- Effect knob: \`${numberProps[0].name}\` is a number — tune with small steps, the range is sensitive.`);
  } else if (numberProps.length) {
    const shown = numberProps.slice(0, 4).map((p) => `\`${p.name}\``).join(", ");
    bullets.push(`- Effect knobs: ${shown} are numbers — tune with small steps, the ranges are sensitive.`);
  }
  if (byName.has("scheme")) {
    bullets.push("- `scheme` switches the section between \"dark\" and \"light\".");
  }
  if (byName.has("interactive") || category === "Heroes") {
    bullets.push("- `interactive` lets the pointer drive the effect; drop it for a purely ambient render.");
  } else if (category === "Footers") {
    bullets.push("- `interactive` is on by default; pass `interactive={false}` for an inert footer.");
  }
  if (byName.has("disabled")) {
    bullets.push("- `disabled` turns the interaction off (e.g. on touch devices or inside modals).");
  }
  if (presets) {
    bullets.push(`- Curated presets: spread one instead of hand-tuning, e.g. \`{...${presets.constName}.${presets.keys[0]}}\` (${presets.keys.map((k) => `\`${k}\``).join(", ")}).`);
  }
  return bullets;
}

function buildPrompt(item, parsed, example, needsWebGPU) {
  const { name, title, description } = item;
  const category = item.categories?.[0] ?? "Components";
  const registryUrl = `${SITE}/r/${name}.json`;
  const docsUrl = `${SITE}/components/${name}.md`;
  const lines = [];

  lines.push(`Add the VFX UI “${title}” component to this project and use it ${USAGE_PHRASE[category] ?? "on the page"}.`, "");
  lines.push("## Context", "");
  lines.push(`${description.replace(/\.\s*$/, "")} — a React component from the VFX UI library (${SITE}). Install it with its CLI command rather than retyping it, and customize it through props only.`, "");
  lines.push("## Step 1 — Install", "");
  lines.push("Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):", "");
  lines.push("```bash");
  lines.push(`npx shadcn@latest add ${registryUrl}`);
  lines.push("```", "");
  lines.push("If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.", "");
  lines.push("## Step 2 — Use", "");
  lines.push(`The component installs to \`components/${nameToComponent(name)}.tsx\` (shared runtime under \`components/vfx/\`). Render it like this:`, "");
  lines.push("```tsx");
  lines.push(example);
  lines.push("```", "");
  lines.push("## Step 3 — Make it yours", "");
  lines.push(...customizeBullets(item, parsed), "");
  lines.push("## Constraints", "");
  lines.push("- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.");
  if (needsWebGPU) {
    lines.push("- The effect renders through WebGPU: give the component a sized parent, and pass the `fallback` prop (a ReactNode) for browsers without WebGPU support.");
  } else if (category === "Backgrounds" || category === "Glass") {
    lines.push("- Give the effect a sized parent container and keep page content layered above it (the wrapper section in the example shows both).");
  }
  if (name.startsWith("example-")) {
    lines.push("- This is a complete demo page with fictional placeholder content — replace the copy before going live.");
  }
  lines.push(`- Full prop-by-prop documentation: ${docsUrl}`);
  lines.push("");
  return lines.join("\n");
}

function promptFile(item, parsed, prompt, needsWebGPU) {
  const { name, title, description, categories, tags } = item;
  const head = [
    "---",
    `component: ${name}`,
    `title: "${title}"`,
    `category: ${categories?.[0] ?? "Components"}`,
    `tags: [${(tags ?? []).join(", ")}]`,
    `install: npx shadcn@latest add ${SITE}/r/${name}.json`,
    `registry: ${SITE}/r/${name}.json`,
    `docs: ${SITE}/components/${name}.md`,
    `requiresWebGPU: ${needsWebGPU}`,
    "---",
    "",
    `# AI builder prompt — ${title}`,
    "",
    `> ${description}`,
    "",
    "Copy the prompt below and paste it into your AI builder:",
    "",
    "- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.",
    "- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.",
    "- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.",
    "",
    "## Prompt",
    "",
    "````text",
    prompt,
    "````",
    "",
    "",
    `Machine-readable component docs for agents: ${SITE}/components/${name}.md — prompt index: [prompts/index.md](index.md)`,
    "",
  ].join("\n");
  return head;
}

/* ------------------------------------------------------------------ *
 * Index and README
 * ------------------------------------------------------------------ */

function buildIndex(items) {
  const lines = [
    "---",
    `count: ${items.length}`,
    `generatedBy: scripts/generate-prompts.mjs`,
    `install: npx shadcn@latest add ${SITE}/r/<name>.json`,
    "---",
    "",
    "# VFX UI — AI builder prompt index",
    "",
    `One paste-ready prompt per component (${items.length} total). Each prompt tells an AI builder (Lovable, v0, bolt.new) to install the component with the shadcn CLI, render it correctly, and customize it through props. Start at [prompts/README.md](README.md) for how to use them.`,
    "",
    "| Prompt | Title | Category | What it does |",
    "| --- | --- | --- | --- |",
    ...items.map((it) =>
      `| [\`${it.name}.md\`](${it.name}.md) | ${it.title} | ${it.categories?.[0] ?? "Components"} | ${it.description} |`),
    "",
  ];
  return lines.join("\n");
}

function buildReadme(items) {
  const categories = [...new Set(items.map((it) => it.categories?.[0] ?? "Components"))];
  return [
    "---",
    `title: "VFX UI AI builder prompts"`,
    `count: ${items.length}`,
    "---",
    "",
    "# AI builder prompts",
    "",
    `These are paste-ready prompts for AI website builders — Lovable, v0, bolt.new and friends. Each one (${items.length} in total, one per component) tells the builder to install a VFX UI component with the shadcn CLI, drop it into your page with a correct usage example, and customize it through props instead of rewriting library code. It is the fastest way to get VFX UI into a project you are building with an AI tool.`,
    "",
    "## How to use one",
    "",
    "1. Pick a component in the [index](index.md) and open its `/<name>.md` file.",
    "2. Copy the block under **Prompt** (everything inside the fence). On the website, the copy button on a component page copies exactly that block.",
    "3. Paste it into your builder and send. The prompt already contains the install command, a usage example, customization hints and guardrails — the builder does the rest.",
    "",
    "## Where to paste",
    "",
    "| Builder | Paste the prompt | Run the install command |",
    "| --- | --- | --- |",
    "| Lovable | **Chat** (the agent acts on it) | **Dev Mode** → terminal |",
    "| v0 | **Chat** | chat, or the **code view** terminal |",
    "| bolt.new | chat | built-in terminal (the agent runs it) |",
    "",
    "If your builder cannot run shell commands, the prompt also tells it how to fetch the registry manifest (`https://vfx-ui.com/r/<name>.json`) and create the files by hand.",
    "",
    "## What is in a prompt",
    "",
    "- **Goal** — install and use one specific VFX UI component, in one specific place on the page.",
    "- **Install command** — `npx shadcn@latest add https://vfx-ui.com/r/<name>.json`, so you stay on the published, updatable component.",
    "- **Usage example** — real JSX with sensible props, generated from the component's actual prop interface.",
    "- **Customization hints** — which copy, colors, children and motion knobs to change.",
    "- **Guardrails** — treat installed files as library code; WebGPU/fallback notes where relevant.",
    "",
    "## Files",
    "",
    `- \`/prompts/<name>.md\` — one prompt per component (${items.length}).`,
    "- `/prompts/index.md` — the full index: name, title, category, one-line description.",
    "",
    `Categories covered: ${categories.join(", ")}.`,
    "",
    "These files are generated — rerun `node scripts/generate-prompts.mjs` after the registry changes. Routing and copy buttons for the website are wired centrally; these are the static sources of truth.",
    "",
  ].join("\n");
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

function loadItem(entry) {
  const item = JSON.parse(readFileSync(join(registryDir, "r", `${entry.name}.json`), "utf8"));
  const main = item.files.find(
    (f) => (f.path ?? f.target ?? "").startsWith("components/")
      && (f.path ?? f.target ?? "").endsWith(".tsx")
      && !(f.path ?? f.target ?? "").includes("/vfx/"),
  );
  const source = main?.content ?? "";
  const componentName = nameToComponent(entry.name);
  const { ext, props } = parsePropsInterface(source);
  const defaults = parseDefaults(source, componentName);
  const presets = parsePresets(source);
  const deps = item.dependencies ?? [];
  return { item, ext, props, defaults, presets, needsWebGPU: deps.some((d) => String(d).startsWith("vgpu")) };
}

async function validateTsxBlocks(files) {
  let esbuild;
  try {
    esbuild = await import("esbuild");
  } catch {
    console.warn("prompts: esbuild not found — skipped JSX validation of generated code blocks.");
    return;
  }
  let blocks = 0;
  const failures = [];
  for (const [file, content] of files) {
    const fence = /```tsx\n([\s\S]*?)```/g;
    for (const match of content.matchAll(fence)) {
      blocks++;
      try {
        await esbuild.transform(match[1], { loader: "tsx" });
      } catch (error) {
        failures.push(`${file}: ${String(error.errors?.[0]?.text ?? error).split("\n")[0]}`);
      }
    }
  }
  if (failures.length) {
    console.error(`prompts: ${failures.length} malformed JSX block(s):`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(`prompts: validated ${blocks} JSX code blocks with esbuild — all parse.`);
}

function main() {
  mkdirSync(outDir, { recursive: true });
  const written = [];
  let webgpuCount = 0;

  for (const entry of index.items) {
    const { item, ext, props, defaults, presets, needsWebGPU } = loadItem(entry);
    if (needsWebGPU) webgpuCount++;
    const parsed = { ext, props, defaults, presets };
    const example = usageExample(entry, parsed);
    const prompt = buildPrompt(entry, parsed, example, needsWebGPU);
    const file = `${entry.name}.md`;
    writeFileSync(join(outDir, file), promptFile(entry, parsed, prompt, needsWebGPU));
    written.push([file, prompt]);
    const knobs = props.length ? `${props.length} props` : "no props";
    console.log(`  prompts/${file} (${knobs}${presets ? `, presets: ${presets.keys.length}` : ""}${needsWebGPU ? ", WebGPU" : ""})`);
  }

  const indexFile = buildIndex(index.items);
  const readmeFile = buildReadme(index.items);
  writeFileSync(join(outDir, "index.md"), indexFile);
  writeFileSync(join(outDir, "README.md"), readmeFile);
  written.push(["index.md", indexFile], ["README.md", readmeFile]);

  // Drop prompts for components that no longer exist in the registry.
  const keep = new Set([...index.items.map((it) => `${it.name}.md`), "index.md", "README.md"]);
  for (const f of readdirSync(outDir)) {
    if (f.endsWith(".md") && !keep.has(f)) {
      rmSync(join(outDir, f));
      console.log(`  prompts/${f} removed (stale)`);
    }
  }

  console.log(`prompts: wrote ${index.items.length} prompts + index.md + README.md to ${outDir} (${webgpuCount} WebGPU)`);
  validateTsxBlocks(written);
}

main();
