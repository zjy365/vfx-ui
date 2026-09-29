---
component: glass-card
title: "Glass Card"
category: Glass
tags: [glass, card, sdf]
install: npx shadcn@latest add https://vfx-ui.com/r/glass-card.json
registry: https://vfx-ui.com/r/glass-card.json
docs: https://vfx-ui.com/components/glass-card.md
requiresWebGPU: true
---

# AI builder prompt — Glass Card

> Thick-cut optical glass with two-interface refraction and studio reflections.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Glass Card” component to this project and use it as a glass optics section.

## Context

Thick-cut optical glass with two-interface refraction and studio reflections — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/glass-card.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/GlassCard.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { GlassCard, GLASS_CARD_PRESETS } from "@/components/GlassCard";

export function Showcase() {
  return (
    <GlassCard {...GLASS_CARD_PRESETS.frosted} interactive>
      <h3>Optical glass, ray-marched live</h3>
      <p>Real content sits above the glass; the effect is rendered behind it.</p>
    </GlassCard>
  );
}
```

## Step 3 — Make it yours

- `children` replaces the default content entirely: pass your own JSX for full layout control.
- `interactive` lets the pointer drive the effect; drop it for a purely ambient render.
- Curated presets: spread one instead of hand-tuning, e.g. `{...GLASS_CARD_PRESETS.frosted}` (`frosted`, `champagne`, `rose`).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- The effect renders through WebGPU: give the component a sized parent, and pass the `fallback` prop (a ReactNode) for browsers without WebGPU support.
- Full prop-by-prop documentation: https://vfx-ui.com/components/glass-card.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/glass-card.md — prompt index: [prompts/index.md](index.md)
