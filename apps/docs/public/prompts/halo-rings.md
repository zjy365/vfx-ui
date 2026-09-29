---
component: halo-rings
title: "Halo Rings"
category: Backgrounds
tags: [background, rings, dispersion, glow]
install: npx shadcn@latest add https://vfx-ui.com/r/halo-rings.json
registry: https://vfx-ui.com/r/halo-rings.json
docs: https://vfx-ui.com/components/halo-rings.md
requiresWebGPU: true
---

# AI builder prompt — Halo Rings

> Concentric rings breathing outward from a luminous core, their edges split into spectral fringes.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Halo Rings” component to this project and use it as an animated, GPU-rendered background section.

## Context

Concentric rings breathing outward from a luminous core, their edges split into spectral fringes — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/halo-rings.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/HaloRings.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { HaloRings, HALO_RINGS_PRESETS } from "@/components/HaloRings";

export function BackdropSection() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <HaloRings
        {...HALO_RINGS_PRESETS.dawn}
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
- Curated presets: spread one instead of hand-tuning, e.g. `{...HALO_RINGS_PRESETS.dawn}` (`dawn`, `prism`, `ember`).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- The effect renders through WebGPU: give the component a sized parent, and pass the `fallback` prop (a ReactNode) for browsers without WebGPU support.
- Full prop-by-prop documentation: https://vfx-ui.com/components/halo-rings.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/halo-rings.md — prompt index: [prompts/index.md](index.md)
