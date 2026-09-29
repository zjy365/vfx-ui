---
component: block-process-steps
title: "Block Process Steps"
category: Blocks
tags: [block, section, landing, steps, process, timeline]
install: npx shadcn@latest add https://vfx-ui.com/r/block-process-steps.json
registry: https://vfx-ui.com/r/block-process-steps.json
docs: https://vfx-ui.com/components/block-process-steps.md
requiresWebGPU: false
---

# AI builder prompt — Block Process Steps

> Three-to-four step process with a self-drawing connector line and replaceable media per step.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Block Process Steps” component to this project and use it as a complete marketing page section.

## Context

Three-to-four step process with a self-drawing connector line and replaceable media per step — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-process-steps.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/BlockProcessSteps.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { BlockProcessSteps } from "@/components/BlockProcessSteps";

export function HowItWorks() {
  return (
    <BlockProcessSteps
      eyebrow="Setup"
      title="From install to insight in an afternoon."
      steps={[
        { title: "Connect your repos", text: "One OAuth flow, automatic indexing." },
        { title: "Describe a release", text: "The graph assembles itself." },
        { title: "Ship and watch", text: "Staged rollouts with auto-pause." },
      ]}
      action={{ label: "Start free", href: "/signup" }}
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
- Full prop-by-prop documentation: https://vfx-ui.com/components/block-process-steps.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/block-process-steps.md — prompt index: [prompts/index.md](index.md)
