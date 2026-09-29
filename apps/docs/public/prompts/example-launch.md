---
component: example-launch
title: "Example — Product Launch"
category: Blocks
tags: [example, landing, launch, product]
install: npx shadcn@latest add https://vfx-ui.com/r/example-launch.json
registry: https://vfx-ui.com/r/example-launch.json
docs: https://vfx-ui.com/components/example-launch.md
requiresWebGPU: false
---

# AI builder prompt — Example — Product Launch

> Complete fictional software launch page ("Orbit" by Lumen Labs): hero, showcase, feature grid, tabs, scroll story, integrations, pricing, testimonials, FAQ, CTA. All copy is demo content.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Example — Product Launch” component to this project and use it as a complete marketing page section.

## Context

Complete fictional software launch page ("Orbit" by Lumen Labs): hero, showcase, feature grid, tabs, scroll story, integrations, pricing, testimonials, FAQ, CTA. All copy is demo content — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/example-launch.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/ExampleLaunch.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { ExampleLaunch } from "@/components/ExampleLaunch";

export default function LaunchPage() {
  return <ExampleLaunch />;
}
```

## Step 3 — Make it yours

- Every word on this page is fictional demo copy — replace it with your product's real content before going live (each section is a VFX UI Block driven entirely by props).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- This is a complete demo page with fictional placeholder content — replace the copy before going live.
- Full prop-by-prop documentation: https://vfx-ui.com/components/example-launch.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/example-launch.md — prompt index: [prompts/index.md](index.md)
