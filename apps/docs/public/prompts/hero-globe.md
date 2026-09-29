---
component: hero-globe
title: "Hero Globe"
category: Heroes
tags: [hero, landing, globe, split]
install: npx shadcn@latest add https://vfx-ui.com/r/hero-globe.json
registry: https://vfx-ui.com/r/hero-globe.json
docs: https://vfx-ui.com/components/hero-globe.md
requiresWebGPU: false
---

# AI builder prompt — Hero Globe

> Drop-in split hero: copy on the left, the dot-matrix cobe planet (the globe behind vercel.com) glowing on the right.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Hero Globe” component to this project and use it as the hero section of your landing page.

## Context

Drop-in split hero: copy on the left, the dot-matrix cobe planet (the globe behind vercel.com) glowing on the right — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/hero-globe.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/HeroGlobe.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { HeroGlobe, HERO_GLOBE_PRESETS } from "@/components/HeroGlobe";

export function Hero() {
  return (
    <main>
      <HeroGlobe
        eyebrow="Introducing your product"
        title="Ship something people remember."
        subtitle="One sentence on what you build, one on who it is for."
        primaryCta={{ label: "Get started", href: "/signup" }}
        secondaryCta={{ label: "View the docs", href: "/docs" }}
        interactive
        {...HERO_GLOBE_PRESETS.azure}
      />
    </main>
  );
}
```

## Step 3 — Make it yours

- Replace the copy: `eyebrow`, `title` and `subtitle` are plain props; point `primaryCta`/`secondaryCta` at your real pages (or pass `null` to drop one).
- Brand colors: pass baseColor={[00.3, 00.3, 00.35]} (hex strings) to match your palette.
- `children` replaces the whole default content block if you need a custom layout inside the hero.
- Effect knobs: `spin`, `mapSamples` are numbers — tune with small steps, the ranges are sensitive.
- `scheme` switches the section between "dark" and "light".
- `interactive` lets the pointer drive the effect; drop it for a purely ambient render.
- Curated presets: spread one instead of hand-tuning, e.g. `{...HERO_GLOBE_PRESETS.azure}` (`azure`, `teal`, `ember`).

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- Full prop-by-prop documentation: https://vfx-ui.com/components/hero-globe.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/hero-globe.md — prompt index: [prompts/index.md](index.md)
