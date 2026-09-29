---
component: block-feature-grid
title: "Block Feature Grid"
category: Blocks
tags: [block, section, landing, features, bento, grid]
install: npx shadcn@latest add https://vfx-ui.com/r/block-feature-grid.json
registry: https://vfx-ui.com/r/block-feature-grid.json
docs: https://vfx-ui.com/components/block-feature-grid.md
requiresWebGPU: false
---

# AI builder prompt — Block Feature Grid

> Feature grid with real hierarchy: one bento feature card plus supporting cells, replaceable icons and media.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Block Feature Grid” component to this project and use it as a complete marketing page section.

## Context

Feature grid with real hierarchy: one bento feature card plus supporting cells, replaceable icons and media — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-feature-grid.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/BlockFeatureGrid.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { BlockFeatureGrid } from "@/components/BlockFeatureGrid";

export function Features() {
  return (
    <BlockFeatureGrid
      eyebrow="Why teams switch"
      title="Built for the way your team ships."
      description="Three reasons teams move their release process here."
      items={[
        { title: "A release graph", description: "Deploys, flags and rollbacks on one canvas.", featured: true },
        { title: "Explained flags", description: "Owner, rollout and expiry documented on every flag." },
        { title: "Instant replays", description: "Watch any release unfold again, step by step." },
      ]}
    />
  );
}
```

## Step 3 — Make it yours

- Replace the copy: `eyebrow`, `title`, `description` and any CTA labels/hrefs are plain props — point them at your real pages and wording.
- Brand colors: pass `accent="#8b5cf6"` (any hex) to recolor buttons and highlights.
- `children` replaces the default content entirely: pass your own JSX for full layout control.
- `scheme` switches the section between "dark" and "light".

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- Full prop-by-prop documentation: https://vfx-ui.com/components/block-feature-grid.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/block-feature-grid.md — prompt index: [prompts/index.md](index.md)
