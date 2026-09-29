---
component: ripple-text
title: "Ripple Text"
category: Text
tags: [pointer, interactive]
install: npx shadcn@latest add https://vfx-ui.com/r/ripple-text.json
registry: https://vfx-ui.com/r/ripple-text.json
docs: https://vfx-ui.com/components/ripple-text.md
requiresWebGPU: false
---

# AI builder prompt — Ripple Text

> Clicks and taps drop ripples that travel outward through your words; a resting pointer leaves a dimple.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Ripple Text” component to this project and use it to animate a headline.

## Context

Clicks and taps drop ripples that travel outward through your words; a resting pointer leaves a dimple — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/ripple-text.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/RippleText.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { RippleText } from "@/components/RippleText";

export function Headline() {
  return (
    <h1>
      <RippleText
        text="Motion is the message"
        amplitude={15}
      />
    </h1>
  );
}
```

## Step 3 — Make it yours

- Effect knobs: `amplitude`, `speed`, `width` are numbers — tune with small steps, the ranges are sensitive.
- `disabled` turns the interaction off (e.g. on touch devices or inside modals).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- Full prop-by-prop documentation: https://vfx-ui.com/components/ripple-text.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/ripple-text.md — prompt index: [prompts/index.md](index.md)
