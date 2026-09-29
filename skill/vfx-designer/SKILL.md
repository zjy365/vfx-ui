---
name: vfx-designer
description: >-
  Use when the user wants their page, landing page, or hero section to look
  better, asks for visual effects, animations, or "VFX", wants to make a site
  feel premium or cinematic, or explicitly asks to install or customize a VFX UI
  component (vfx-ui.com). Covers selecting the right hero/background/block/
  interaction by mood, installing via shadcn registry or MCP, and wiring the
  user's own copy through props. Not for general UI kits, dashboards, or
  non-React projects.
---

# VFX Designer — put VFX UI effects on the user's page

VFX UI (https://vfx-ui.com) is a shader-native React component library (93 registry
items) rendered via WebGPU (vgpu) plus pure-DOM interactions and full marketing-page
blocks. Your job: pick the right component for the user's intent, install it the
shortest way, and replace demo copy with the user's content — without ever editing
the installed library source.

Full catalog: [references/catalog.md](references/catalog.md) — all 93 items with
one-liners, WebGPU requirements, and install links.
Ready-made page recipes: [references/recipes.md](references/recipes.md) — 10 common
combos with copy-paste JSX using real default props.

## Step 1 — Decide what the user needs (decision tree)

```
User request
├─ "Give me a whole (landing) page" / "make a full site"
│   → Start from an Example page, then swap sections:
│     • example-launch  — dark, cinematic software/AI product launch page
│     • example-studio  — light, editorial design-studio service page
│     Both are pure DOM (no WebGPU). Replace ALL fictional copy before going live.
│
├─ "Make my hero / first screen better" (most common)
│   → Pick ONE hero by mood (table below). Do not stack two heroes.
│
├─ "Add/improve a page section" (features, pricing, FAQ, logos, team…)
│   → Blocks (block-*). Pure DOM, all content via props, compose freely.
│
├─ "Add juice / detail / micro-interaction"
│   → Interactions (cards, buttons), Text (headline effects), Glass (hero-grade
│     glass objects), or a Background behind existing content.
│
└─ "Footer" → Footers (footer-*). Pure DOM, brand artwork generated from text.
```

## Step 2 — Hero selection by mood

One hero, chosen by the page's atmosphere and the color scheme the user wants.

| Mood / vibe | Hero (drop-in section) | Background (bare layer) | WebGPU |
| --- | --- | --- | --- |
| **Cosmic / universe** | hero-vortex-centered (calm eye, short headline), hero-vortex, hero-starfield, hero-starfield-split (badge wall), hero-black-hole, hero-black-hole-cinema (film letterbox) | vortex, starfield, star-tide, black-hole, solar-corona, astra-field (WebGL, rotatable galaxy) | yes |
| **Tech / product** | hero-globe (cobe dot planet, split), hero-ribbon, hero-ribbon-left (eyebrow rail), hero-particles, hero-particles-badge (badge row) | ribbon-field, particle-field, radiant-dots, astra-field | mixed |
| **Nature** | hero-aurora, hero-aurora-editorial (serif masthead) | aurora, terrain-ridge, caustics-field, ember-drift, dust-motes, ink-bloom, silk-veil | yes |
| **Liquid color / poster** | hero-fluid, hero-fluid-minimal (one line + CTA), hero-mesh, hero-mesh-bold (ultra-bold poster), hero-chroma, hero-chroma-full, hero-iridescent (premium launch sheen) | fluid-gradient, mesh-gradient, chroma-flow, plasma-sheet, iridescent, wave-background, halo-rings | yes |
| **Dark silk / texture** | hero-fiber, hero-fiber-top | fiber-flow | yes |
| **Editorial / paper (NO WebGPU)** | hero-eclipse (engraved astronomical dial), hero-contour (topographic paper landscape) | — | no |

Selection hints:

- Light/editorial brand or WebGPU-averse environment → hero-eclipse / hero-contour,
  or hero-aurora-editorial / hero-starfield-split style variants whose copy layer
  stays intact when the GPU layer fails.
- One-word product, single CTA → hero-fluid-minimal. Big slogan poster → hero-mesh-bold.
- AI/dev-tool launch, dark theme → hero-vortex-centered or hero-black-hole-cinema.
- "Like vercel.com" → hero-globe.
- Hero copy layer is always real selectable DOM on top of the effect; pointer stays
  decorative and never blocks CTAs.

## Step 3 — Install (three routes, prefer MCP when available)

**Route A — MCP (preferred if the `vfx-ui` MCP server is connected).** Look for the
MCP tools before touching the shell:

1. `vfx_search_components(query: "...")` — ranked keyword matches when unsure which
   component fits.
2. `vfx_get_component(name: "<item>")` — returns the exact install command,
   dependencies, and a props summary (`include_files: true` inlines full source).
3. `vfx_list_components(category:)`, `vfx_get_styles`, `vfx_design_notes` — category
   listing, palette (#eeefe9 paper / #202520 charcoal green / #2349db cobalt), and
   interaction contracts.

**Route B — URL direct install (works everywhere).**

```bash
npx shadcn@latest add https://vfx-ui.com/r/<name>.json
```

e.g. `npx shadcn@latest add https://vfx-ui.com/r/hero-vortex-centered.json`.
Requires a shadcn-style project (components.json). npm deps like `vgpu@0.3.1` are
installed by the CLI.

**Route C — user-level namespace (when adding several items).**

```bash
npx shadcn@latest registry add @vfx-ui=https://vfx-ui.com/r/{name}.json
# then, per item:
npx shadcn@latest add @vfx-ui/<name>
```

No shell access? Fetch `https://vfx-ui.com/r/<name>.json` yourself — it is a shadcn
registry manifest — and create every listed file at its path with its content.

## Step 4 — Usage rules (non-negotiable)

1. **Never edit installed source.** Files under `components/` (including
   `components/vfx/`) are generated library code. Configure EVERYTHING through
   props in your own page files. If something seems impossible via props, check
   the preset bag (`<NAME>_PRESETS` exports) before considering alternatives.
2. **WebGPU components degrade gracefully** — pass the `fallback` prop (a
   ReactNode) for browsers without WebGPU, and give the component a sized parent.
   Pure-DOM components (Blocks, Footers, Interactions, Text, hero-eclipse,
   hero-contour) work everywhere with no fallback needed.
3. **Reduced motion is automatic.** `prefers-reduced-motion` freezes/skips
   animation. Do not build workarounds; do not remove the behavior.
4. **Demo copy must be replaced.** Every hero ships example wording; every block
   and example page ships fictional demo content (visibly marked). Pass the user's
   own `title` / `subtitle` / `eyebrow` / `primaryCta` / `secondaryCta` / `children`,
   or the block's data props. Never launch with "Orbit" / "Atelier North" copy.
5. **Interaction defaults are conservative.** `interactive` defaults to `false`
   on heroes — opt in explicitly when the user wants pointer response. Blocks'
   `scheme` ("dark" | "light") and `accent` adapt theming without CSS edits.
6. **Aesthetic restraint.** One hero effect per page, one or two interaction
   accents. The library's look is Figtree-Black display type, hairline borders,
   quiet labels — favor one strong material over stacked decorations.

## Step 5 — Authoritative references

- Machine docs per component: `https://vfx-ui.com/components/<name>.md`
  (props, install, presets, agent notes — same content as the repo's
  `apps/docs/public/components/`).
- AI builder prompts (paste-ready, per component):
  `https://vfx-ui.com/prompts/<name>.md`.
- Full agent guide: `https://vfx-ui.com/agents.md`.
- Local copies in this skill: [references/catalog.md](references/catalog.md),
  [references/recipes.md](references/recipes.md).

## Workflow recap

1. Classify the request (whole page / hero / section / detail) via the decision tree.
2. Match mood → shortlist 1-3 items from the hero table or catalog.
3. Install via MCP → URL → namespace, in that order of preference.
4. Replace demo copy with the user's content via props; enable `interactive` only
   if asked; provide `fallback` for WebGPU heroes.
5. Verify: dev server renders, CTAs are real links, reduced-motion still works.
