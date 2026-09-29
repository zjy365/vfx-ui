---
component: silk-veil
title: "Silk Veil"
category: Backgrounds
tags: [background, silk, fabric, sheen]
install: npx shadcn@latest add https://vfx-ui.com/r/silk-veil.json
registry: https://vfx-ui.com/r/silk-veil.json
docs: https://vfx-ui.com/components/silk-veil.md
requiresWebGPU: true
---

# AI builder prompt — Silk Veil

> A draped silk curtain of warped folds with a luster band sweeping the weave.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Silk Veil” component to this project and use it as an animated, GPU-rendered background section.

## Context

A draped silk curtain of warped folds with a luster band sweeping the weave — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/silk-veil.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/SilkVeil.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { SilkVeil, SILK_VEIL_PRESETS } from "@/components/SilkVeil";

export function BackdropSection() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <SilkVeil
        {...SILK_VEIL_PRESETS.rosewood}
        interactive
      />
      <div style={{ position: "relative", zIndex: 1, padding: "10rem 2rem", maxWidth: "72rem", margin: "0 auto" }}>
        <h1>An animated backdrop, no video file</h1>
        <p>Your own content renders on top of the effect.</p>
      </div>
    </section>
  );
}
```

## Step 3 — Make it yours

- Brand colors: pass `accent="#8b5cf6"` (any hex) to recolor buttons and highlights.
- `interactive` lets the pointer drive the effect; drop it for a purely ambient render.
- Curated presets: spread one instead of hand-tuning, e.g. `{...SILK_VEIL_PRESETS.rosewood}` (`rosewood`, `midnight`, `champagne`).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- The effect renders through WebGPU: give the component a sized parent, and pass the `fallback` prop (a ReactNode) for browsers without WebGPU support.
- Full prop-by-prop documentation: https://vfx-ui.com/components/silk-veil.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/silk-veil.md — prompt index: [prompts/index.md](index.md)
