---
component: block-newsletter
title: "Block Newsletter"
category: Blocks
tags: [block, section, landing, newsletter, subscribe, form]
install: npx shadcn@latest add https://vfx-ui.com/r/block-newsletter.json
registry: https://vfx-ui.com/r/block-newsletter.json
docs: https://vfx-ui.com/components/block-newsletter.md
requiresWebGPU: false
---

# AI builder prompt — Block Newsletter

> Email signup with working client-side validation, announced inline errors and a confirmation panel; runs in an honestly-labeled demo mode until wired up.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Block Newsletter” component to this project and use it as a complete marketing page section.

## Context

Email signup with working client-side validation, announced inline errors and a confirmation panel; runs in an honestly-labeled demo mode until wired up — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-newsletter.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/BlockNewsletter.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { BlockNewsletter } from "@/components/BlockNewsletter";

export function BackdropSection() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <BlockNewsletter
        interactive
      />
      <div style={{ position: "relative", zIndex: 1, padding: "10rem 2rem", maxWidth: "72rem", margin: "0 auto" }}>
        <h1>An animated backdrop, no video file</h1>
        <p>Your own content renders on top of the effect.</p>
      </div>
    </section>
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
- Full prop-by-prop documentation: https://vfx-ui.com/components/block-newsletter.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/block-newsletter.md — prompt index: [prompts/index.md](index.md)
