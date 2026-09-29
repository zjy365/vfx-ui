---
component: astra-field
title: "Astra Field"
category: Backgrounds
tags: [galaxy, stars]
install: npx shadcn@latest add https://vfx-ui.com/r/astra-field.json
registry: https://vfx-ui.com/r/astra-field.json
docs: https://vfx-ui.com/components/astra-field.md
requiresWebGPU: false
---

# AI builder prompt — Astra Field

> A rotatable spiral galaxy of glowing stars.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Astra Field” component to this project and use it as an animated, GPU-rendered background section.

## Context

A rotatable spiral galaxy of glowing stars — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/astra-field.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/AstraField.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { AstraField, ASTRA_FIELD_PRESETS } from "@/components/AstraField";

export function BackdropSection() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <AstraField
        {...ASTRA_FIELD_PRESETS.astra}
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

- Brand colors: pass color="#8cbeed" (hex strings) to match your palette.
- Effect knobs: `intensity`, `speed`, `seed`, `introDuration` are numbers — tune with small steps, the ranges are sensitive.
- `interactive` lets the pointer drive the effect; drop it for a purely ambient render.
- Curated presets: spread one instead of hand-tuning, e.g. `{...ASTRA_FIELD_PRESETS.astra}` (`astra`, `galaxy`, `ember`).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- Give the effect a sized parent container and keep page content layered above it (the wrapper section in the example shows both).
- Full prop-by-prop documentation: https://vfx-ui.com/components/astra-field.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/astra-field.md — prompt index: [prompts/index.md](index.md)
