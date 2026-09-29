---
component: block-scroll-story
title: "Block Scroll Story"
category: Blocks
tags: [block, section, landing, scroll, story, sticky]
install: npx shadcn@latest add https://vfx-ui.com/r/block-scroll-story.json
registry: https://vfx-ui.com/r/block-scroll-story.json
docs: https://vfx-ui.com/components/block-scroll-story.md
requiresWebGPU: false
---

# AI builder prompt — Block Scroll Story

> Scroll narrative: a sticky scene crossfades as story steps cross the viewport; docks above the steps on mobile.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Block Scroll Story” component to this project and use it as a complete marketing page section.

## Context

Scroll narrative: a sticky scene crossfades as story steps cross the viewport; docks above the steps on mobile — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-scroll-story.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/BlockScrollStory.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { BlockScrollStory } from "@/components/BlockScrollStory";

export function Story() {
  return (
    <BlockScrollStory
      eyebrow="How it works"
      title="A launch week, told in three scenes."
      steps={[
        { eyebrow: "Monday", title: "Sketch the week.", text: "Drop deploys onto one canvas." },
        { eyebrow: "Wednesday", title: "Ship behind a canary.", text: "Staged rollouts pause when error budgets dip." },
        { eyebrow: "Friday", title: "Tell the story.", text: "The replay becomes your status update." },
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
- `interactive` lets the pointer drive the effect; drop it for a purely ambient render.

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- Full prop-by-prop documentation: https://vfx-ui.com/components/block-scroll-story.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/block-scroll-story.md — prompt index: [prompts/index.md](index.md)
