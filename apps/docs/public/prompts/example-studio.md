---
component: example-studio
title: "Example — Design Studio"
category: Blocks
tags: [example, portfolio, studio, services]
install: npx shadcn@latest add https://vfx-ui.com/r/example-studio.json
registry: https://vfx-ui.com/r/example-studio.json
docs: https://vfx-ui.com/components/example-studio.md
requiresWebGPU: false
---

# AI builder prompt — Example — Design Studio

> Complete fictional design-studio service page (Atelier North): daylight editorial hero, engagement steps, portfolio showcase, before/after slider, services grid, fixed-fee engagements, testimonials, FAQ and a typographic footer.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Example — Design Studio” component to this project and use it as a complete marketing page section.

## Context

Complete fictional design-studio service page (Atelier North): daylight editorial hero, engagement steps, portfolio showcase, before/after slider, services grid, fixed-fee engagements, testimonials, FAQ and a typographic footer — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/example-studio.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/ExampleStudio.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { ExampleStudio } from "@/components/ExampleStudio";

export default function StudioPage() {
  return <ExampleStudio />;
}
```

## Step 3 — Make it yours

- Every word on this page is fictional demo copy — replace it with your product's real content before going live (each section is a VFX UI Block driven entirely by props).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- This is a complete demo page with fictional placeholder content — replace the copy before going live.
- Full prop-by-prop documentation: https://vfx-ui.com/components/example-studio.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/example-studio.md — prompt index: [prompts/index.md](index.md)
