---
component: magnetic
title: "Magnetic"
category: Interactions
tags: [pointer, interactive]
install: npx shadcn@latest add https://vfx-ui.com/r/magnetic.json
registry: https://vfx-ui.com/r/magnetic.json
docs: https://vfx-ui.com/components/magnetic.md
requiresWebGPU: false
---

# AI builder prompt — Magnetic

> A gentle magnetic pull for your own buttons, links, and content.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Magnetic” component to this project and use it as an interactive content element.

## Context

A gentle magnetic pull for your own buttons, links, and content — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/magnetic.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/Magnetic.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { Magnetic } from "@/components/Magnetic";

export function Showcase() {
  return (
    <Magnetic strength={18}>
      <button type="button" style={{ padding: "12px 24px", borderRadius: 999 }}>
        Pull me toward the cursor
      </button>
    </Magnetic>
  );
}
```

## Step 3 — Make it yours

- `children` replaces the default content entirely: pass your own JSX for full layout control.
- Effect knob: `strength` is a number — tune with small steps, the range is sensitive.
- `disabled` turns the interaction off (e.g. on touch devices or inside modals).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- Full prop-by-prop documentation: https://vfx-ui.com/components/magnetic.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/magnetic.md — prompt index: [prompts/index.md](index.md)
