---
component: block-showcase
title: "Block Showcase"
category: Blocks
tags: [block, section, landing, showcase, product, media]
install: npx shadcn@latest add https://vfx-ui.com/r/block-showcase.json
registry: https://vfx-ui.com/r/block-showcase.json
docs: https://vfx-ui.com/components/block-showcase.md
requiresWebGPU: false
---

# AI builder prompt — Block Showcase

> Product showcase stage: browser-chrome frame with a replaceable screenshot or video (CSS demo UI by default), headline and actions.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Block Showcase” component to this project and use it as a complete marketing page section.

## Context

Product showcase stage: browser-chrome frame with a replaceable screenshot or video (CSS demo UI by default), headline and actions — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-showcase.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/BlockShowcase.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { BlockShowcase } from "@/components/BlockShowcase";

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
}
```

## Step 3 — Make it yours

- Replace the copy: `eyebrow`, `title`, `description` and any CTA labels/hrefs are plain props — point them at your real pages and wording.
- Brand colors: pass `accent="#8b5cf6"` (any hex) to recolor buttons and highlights.
- `children` replaces the default content entirely: pass your own JSX for full layout control.
- `scheme` switches the section between "dark" and "light".
- `interactive` lets the pointer drive the effect; drop it for a purely ambient render.

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- Full prop-by-prop documentation: https://vfx-ui.com/components/block-showcase.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/block-showcase.md — prompt index: [prompts/index.md](index.md)
