---
component: black-hole
title: "Black Hole"
category: Backgrounds
tags: [background, space, black-hole, ray-tracing]
install: npx shadcn@latest add https://vfx-ui.com/r/black-hole.json
registry: https://vfx-ui.com/r/black-hole.json
docs: https://vfx-ui.com/components/black-hole.md
requiresWebGPU: true
---

# AI builder prompt — Black Hole

> The vgpu optimized-black-hole pipeline as a component: baked null-geodesic G-buffer, HDR bloom, prefiltered lensed star field, Doppler beaming — a verbatim port (MIT, Vercel).

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Black Hole” component to this project and use it as an animated, GPU-rendered background section.

## Context

The vgpu optimized-black-hole pipeline as a component: baked null-geodesic G-buffer, HDR bloom, prefiltered lensed star field, Doppler beaming — a verbatim port (MIT, Vercel) — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/black-hole.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/BlackHole.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { BlackHole, BLACK_HOLE_PRESETS } from "@/components/BlackHole";

export function BackdropSection() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <BlackHole
        {...BLACK_HOLE_PRESETS.interstellar}
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

- `interactive` lets the pointer drive the effect; drop it for a purely ambient render.
- Curated presets: spread one instead of hand-tuning, e.g. `{...BLACK_HOLE_PRESETS.interstellar}` (`interstellar`, `centered`, `gargantua`, `topDown`, `ember`).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- The effect renders through WebGPU: give the component a sized parent, and pass the `fallback` prop (a ReactNode) for browsers without WebGPU support.
- Full prop-by-prop documentation: https://vfx-ui.com/components/black-hole.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/black-hole.md — prompt index: [prompts/index.md](index.md)
