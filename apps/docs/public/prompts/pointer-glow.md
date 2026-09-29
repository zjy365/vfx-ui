---
component: pointer-glow
title: "Pointer Glow"
category: Interactions
tags: [pointer, interactive]
install: npx shadcn@latest add https://vfx-ui.com/r/pointer-glow.json
registry: https://vfx-ui.com/r/pointer-glow.json
docs: https://vfx-ui.com/components/pointer-glow.md
requiresWebGPU: false
---

# AI builder prompt — Pointer Glow

> A handheld light for layouts: the room dims slightly and a warm source follows your pointer over your own content.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Pointer Glow” component to this project and use it as an interactive content element.

## Context

A handheld light for layouts: the room dims slightly and a warm source follows your pointer over your own content — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/pointer-glow.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/PointerGlow.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { PointerGlow } from "@/components/PointerGlow";

export function BackdropSection() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <PointerGlow
        color="#ffdfae"
        radius={300}
        intensity={0.5}
        interactive
      />
      <div style={{ position: "relative", zIndex: 1, padding: "10rem 2rem", maxWidth: "72rem", margin: "0 auto" }}>
        <h1>Interaction, rendered live</h1>
        <p>Your own content renders on top of the effect.</p>
      </div>
    </section>
  );
}
```

## Step 3 — Make it yours

- Brand colors: pass color="#ffdfae" (hex strings) to match your palette.
- `children` replaces the default content entirely: pass your own JSX for full layout control.
- Effect knobs: `radius`, `intensity`, `dim` are numbers — tune with small steps, the ranges are sensitive.
- `disabled` turns the interaction off (e.g. on touch devices or inside modals).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- Full prop-by-prop documentation: https://vfx-ui.com/components/pointer-glow.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/pointer-glow.md — prompt index: [prompts/index.md](index.md)
