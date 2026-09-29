---
component: light-prism
title: "Light Prism"
category: Glass
tags: [glass, prism, refraction, hero, paper]
install: npx shadcn@latest add https://vfx-ui.com/r/light-prism.json
registry: https://vfx-ui.com/r/light-prism.json
docs: https://vfx-ui.com/components/light-prism.md
requiresWebGPU: true
---

# AI builder prompt — Light Prism

> A solid beveled optical prism using Vercel’s complete MIT spectral optics and multi-pass glass pipeline.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Light Prism” component to this project and use it as a glass optics section.

## Context

A solid beveled optical prism using Vercel’s complete MIT spectral optics and multi-pass glass pipeline — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/light-prism.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/LightPrism.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { LightPrism, LIGHT_PRISM_PRESETS } from "@/components/LightPrism";

export function BackdropSection() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <LightPrism
        {...LIGHT_PRISM_PRESETS.paper}
        interactive
      />
      <div style={{ position: "relative", zIndex: 1, padding: "10rem 2rem", maxWidth: "72rem", margin: "0 auto" }}>
        <h1>Glass, rendered as light</h1>
        <p>Your own content renders on top of the effect.</p>
      </div>
    </section>
  );
}
```

## Step 3 — Make it yours

- Brand colors: pass `accent="#8b5cf6"` (any hex) to recolor buttons and highlights.
- `interactive` lets the pointer drive the effect; drop it for a purely ambient render.
- Curated presets: spread one instead of hand-tuning, e.g. `{...LIGHT_PRISM_PRESETS.paper}` (`paper`, `moonstone`, `amber`).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- The effect renders through WebGPU: give the component a sized parent, and pass the `fallback` prop (a ReactNode) for browsers without WebGPU support.
- Full prop-by-prop documentation: https://vfx-ui.com/components/light-prism.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/light-prism.md — prompt index: [prompts/index.md](index.md)
