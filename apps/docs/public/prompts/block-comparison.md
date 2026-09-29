---
component: block-comparison
title: "Block Comparison"
category: Blocks
tags: [block, section, landing, comparison, before-after, slider]
install: npx shadcn@latest add https://vfx-ui.com/r/block-comparison.json
registry: https://vfx-ui.com/r/block-comparison.json
docs: https://vfx-ui.com/components/block-comparison.md
requiresWebGPU: false
---

# AI builder prompt — Block Comparison

> Before/after comparison with a draggable, keyboard- and touch-operable reveal handle (a real range input).

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Block Comparison” component to this project and use it as a complete marketing page section.

## Context

Before/after comparison with a draggable, keyboard- and touch-operable reveal handle (a real range input) — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-comparison.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/BlockComparison.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { BlockComparison } from "@/components/BlockComparison";

export function BeforeAfter() {
  return (
    <BlockComparison
      eyebrow="Redesign"
      title="Drag to see the redesign."
      before={<img src="/before.png" alt="Interface before the redesign" />}
      after={<img src="/after.png" alt="Interface after the redesign" />}
      beforeLabel="Before"
      afterLabel="After"
    />
  );
}
```

## Step 3 — Make it yours

- Replace the copy: `eyebrow`, `title`, `description` and any CTA labels/hrefs are plain props — point them at your real pages and wording.
- Brand colors: pass `accent="#8b5cf6"` (any hex) to recolor buttons and highlights.
- `children` replaces the default content entirely: pass your own JSX for full layout control.
- Effect knob: `defaultPosition` is a number — tune with small steps, the range is sensitive.
- `scheme` switches the section between "dark" and "light".

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- Full prop-by-prop documentation: https://vfx-ui.com/components/block-comparison.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/block-comparison.md — prompt index: [prompts/index.md](index.md)
