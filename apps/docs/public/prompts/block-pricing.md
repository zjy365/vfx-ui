---
component: block-pricing
title: "Block Pricing"
category: Blocks
tags: [block, section, landing, pricing, plans, billing]
install: npx shadcn@latest add https://vfx-ui.com/r/block-pricing.json
registry: https://vfx-ui.com/r/block-pricing.json
docs: https://vfx-ui.com/components/block-pricing.md
requiresWebGPU: false
---

# AI builder prompt — Block Pricing

> Pricing plans with a working monthly/annual switch — amounts, basis lines and savings render from data.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Block Pricing” component to this project and use it as a complete marketing page section.

## Context

Pricing plans with a working monthly/annual switch — amounts, basis lines and savings render from data — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-pricing.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/BlockPricing.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { BlockPricing } from "@/components/BlockPricing";

export function Plans() {
  return (
    <BlockPricing
      eyebrow="Pricing"
      title="Start free. Scale when your team does."
      description="Every plan includes the release graph. Pay when your team grows."
      plans={[
        { name: "Solo", priceMonthly: 0, basis: "once", description: "For side projects.", features: ["1 release graph", "Community support"], cta: { label: "Start free", href: "/signup" } },
        { name: "Team", priceMonthly: 24, priceAnnual: 20, badge: "Most popular", featured: true, description: "Per seat, for teams shipping weekly.", features: ["Unlimited graphs", "Canary rollouts", "Slack + Linear sync"], cta: { label: "Start 14-day trial", href: "/trial" } },
      ]}
      annualNote="2 months free"
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
- Full prop-by-prop documentation: https://vfx-ui.com/components/block-pricing.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/block-pricing.md — prompt index: [prompts/index.md](index.md)
