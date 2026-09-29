---
component: glass-panel
title: "Glass Panel"
category: Glass
tags: [glass, panel, refraction, sdf]
install: npx shadcn@latest add https://vfx-ui.com/r/glass-panel.json
registry: https://vfx-ui.com/r/glass-panel.json
docs: https://vfx-ui.com/components/glass-panel.md
requiresWebGPU: true
---

# AI builder prompt — Glass Panel

> A broad ray-marched optical slab that carries your own content across a full panel.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Glass Panel” component to this project and use it as a glass optics section.

## Context

A broad ray-marched optical slab that carries your own content across a full panel — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/glass-panel.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/GlassPanel.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { GlassPanel, GLASS_PANEL_PRESETS } from "@/components/GlassPanel";

export function BackdropSection() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <GlassPanel
        {...GLASS_PANEL_PRESETS.clear}
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

- `children` replaces the default content entirely: pass your own JSX for full layout control.
- `interactive` lets the pointer drive the effect; drop it for a purely ambient render.
- Curated presets: spread one instead of hand-tuning, e.g. `{...GLASS_PANEL_PRESETS.clear}` (`clear`, `smoke`, `cobalt`).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- The effect renders through WebGPU: give the component a sized parent, and pass the `fallback` prop (a ReactNode) for browsers without WebGPU support.
- Full prop-by-prop documentation: https://vfx-ui.com/components/glass-panel.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/glass-panel.md — prompt index: [prompts/index.md](index.md)
