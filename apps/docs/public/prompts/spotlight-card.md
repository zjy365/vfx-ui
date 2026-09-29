---
component: spotlight-card
title: "Spotlight Card"
category: Interactions
tags: [pointer, interactive]
install: npx shadcn@latest add https://vfx-ui.com/r/spotlight-card.json
registry: https://vfx-ui.com/r/spotlight-card.json
docs: https://vfx-ui.com/components/spotlight-card.md
requiresWebGPU: false
---

# AI builder prompt — Spotlight Card

> A card under a torch: the beam follows the pointer to uncover your content from the dark.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Spotlight Card” component to this project and use it as an interactive content element.

## Context

A card under a torch: the beam follows the pointer to uncover your content from the dark — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/spotlight-card.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/SpotlightCard.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { SpotlightCard } from "@/components/SpotlightCard";

export function BackdropSection() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <SpotlightCard
        radius={190}
        darkness={0.86}
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

- `children` replaces the default content entirely: pass your own JSX for full layout control.
- Effect knobs: `radius`, `darkness` are numbers — tune with small steps, the ranges are sensitive.
- `disabled` turns the interaction off (e.g. on touch devices or inside modals).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- Full prop-by-prop documentation: https://vfx-ui.com/components/spotlight-card.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/spotlight-card.md — prompt index: [prompts/index.md](index.md)
