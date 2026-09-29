---
component: ember-drift
title: "Ember Drift"
category: Backgrounds
tags: [background, particles, fire, heat]
install: npx shadcn@latest add https://vfx-ui.com/r/ember-drift.json
registry: https://vfx-ui.com/r/ember-drift.json
docs: https://vfx-ui.com/components/ember-drift.md
requiresWebGPU: true
---

# AI builder prompt — Ember Drift

> Sparks rising from a bed of coals, cooling from gold to red through shimmering heat.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Ember Drift” component to this project and use it as an animated, GPU-rendered background section.

## Context

Sparks rising from a bed of coals, cooling from gold to red through shimmering heat — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/ember-drift.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/EmberDrift.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { EmberDrift, EMBER_DRIFT_PRESETS } from "@/components/EmberDrift";

export function BackdropSection() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <EmberDrift
        {...EMBER_DRIFT_PRESETS.campfire}
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
- Curated presets: spread one instead of hand-tuning, e.g. `{...EMBER_DRIFT_PRESETS.campfire}` (`campfire`, `furnace`, `blueFlame`).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- The effect renders through WebGPU: give the component a sized parent, and pass the `fallback` prop (a ReactNode) for browsers without WebGPU support.
- Full prop-by-prop documentation: https://vfx-ui.com/components/ember-drift.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/ember-drift.md — prompt index: [prompts/index.md](index.md)
