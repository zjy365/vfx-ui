---
component: block-nav
title: "Block Nav"
category: Blocks
tags: [block, section, landing, navigation, menu, mobile]
install: npx shadcn@latest add https://vfx-ui.com/r/block-nav.json
registry: https://vfx-ui.com/r/block-nav.json
docs: https://vfx-ui.com/components/block-nav.md
requiresWebGPU: false
---

# AI builder prompt — Block Nav

> Complete navigation bar: brand, desktop links, actions, and an accessible mobile sheet with Escape handling.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Block Nav” component to this project and use it as a complete marketing page section.

## Context

Complete navigation bar: brand, desktop links, actions, and an accessible mobile sheet with Escape handling — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-nav.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/BlockNav.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { BlockNav } from "@/components/BlockNav";

export function SiteHeader() {
  return (
    <BlockNav
      brand="Acme"
      links={[
        { label: "Product", href: "/product" },
        { label: "Pricing", href: "/pricing" },
        { label: "Docs", href: "/docs" },
      ]}
      action={{ label: "Get started", href: "/signup" }}
      sticky
    />
  );
}
```

## Step 3 — Make it yours

- Data-driven: set `brand` and wire `links`/`action` to your real routes.
- Brand colors: pass `accent="#8b5cf6"` (any hex) to recolor buttons and highlights.
- `scheme` switches the section between "dark" and "light".

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- Full prop-by-prop documentation: https://vfx-ui.com/components/block-nav.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/block-nav.md — prompt index: [prompts/index.md](index.md)
