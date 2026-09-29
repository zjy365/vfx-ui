---
component: footer-phosphor
title: "Footer Phosphor"
category: Footers
tags: [footer, pointer, typography]
install: npx shadcn@latest add https://vfx-ui.com/r/footer-phosphor.json
registry: https://vfx-ui.com/r/footer-phosphor.json
docs: https://vfx-ui.com/components/footer-phosphor.md
requiresWebGPU: false
---

# AI builder prompt — Footer Phosphor

> A luminous cell wordmark that disperses around your pointer and settles home.

Copy the prompt below and paste it into your AI builder:

- **Lovable** — paste in **Chat**, or enable **Dev Mode** and use its terminal for the install command.
- **v0** — paste in the **chat**, or open the **code view** and run the install command in its terminal.
- **bolt.new** — paste in chat; the agent runs the install command in the built-in terminal.

## Prompt

````text
Add the VFX UI “Footer Phosphor” component to this project and use it as the site footer.

## Context

A luminous cell wordmark that disperses around your pointer and settles home — a React component from the VFX UI library (https://vfx-ui.com). Install it with its CLI command rather than retyping it, and customize it through props only.

## Step 1 — Install

Run this command in the project terminal (Lovable: enable Dev Mode and open the terminal; v0: run it from chat or the code view terminal; bolt.new: use the built-in terminal):

```bash
npx shadcn@latest add https://vfx-ui.com/r/footer-phosphor.json
```

If you cannot run shell commands, fetch that URL — it is a shadcn registry manifest — and create every listed file with its content at its path.

## Step 2 — Use

The component installs to `components/FooterPhosphor.tsx` (shared runtime under `components/vfx/`). Render it like this:

```tsx
import { FooterPhosphor } from "@/components/FooterPhosphor";

export function SiteFooter() {
  return (
    <FooterPhosphor
      brand="Acme Studio"
      title="Let’s build something rare."
      cta={{ label: "Get in touch", href: "mailto:hello@example.com" }}
      groups={[
        { label: "Product", links: [{ label: "Features", href: "/features" }, { label: "Pricing", href: "/pricing" }] },
        { label: "Company", links: [{ label: "About", href: "/about" }, { label: "Blog", href: "/blog" }] },
      ]}
      legal={[{ label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }]}
      copyright="© 2026 Acme Studio, Inc."
      color="#d2f8a2"
      background="#17201b"
    />
  );
}
```

## Step 3 — Make it yours

- Make it yours: set `brand` to your name, wire `groups` and `legal` to your real routes, and update `cta` and `copyright`.
- Brand colors: pass color="#d2f8a2", background="#17201b" (hex strings) to match your palette.
- `interactive` is on by default; pass `interactive={false}` for an inert footer.

## Constraints

- Treat the installed files under `components/` (including `components/vfx/`) as generated library code: never rewrite them, configure everything from props in your own page files.
- Full prop-by-prop documentation: https://vfx-ui.com/components/footer-phosphor.md

````


Machine-readable component docs for agents: https://vfx-ui.com/components/footer-phosphor.md — prompt index: [prompts/index.md](index.md)
