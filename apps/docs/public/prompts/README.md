---
title: "VFX UI AI builder prompts"
count: 93
---

# AI builder prompts

These are paste-ready prompts for AI website builders — Lovable, v0, bolt.new and friends. Each one (93 in total, one per component) tells the builder to install a VFX UI component with the shadcn CLI, drop it into your page with a correct usage example, and customize it through props instead of rewriting library code. It is the fastest way to get VFX UI into a project you are building with an AI tool.

## How to use one

1. Pick a component in the [index](index.md) and open its `/<name>.md` file.
2. Copy the block under **Prompt** (everything inside the fence). On the website, the copy button on a component page copies exactly that block.
3. Paste it into your builder and send. The prompt already contains the install command, a usage example, customization hints and guardrails — the builder does the rest.

## Where to paste

| Builder | Paste the prompt | Run the install command |
| --- | --- | --- |
| Lovable | **Chat** (the agent acts on it) | **Dev Mode** → terminal |
| v0 | **Chat** | chat, or the **code view** terminal |
| bolt.new | chat | built-in terminal (the agent runs it) |

If your builder cannot run shell commands, the prompt also tells it how to fetch the registry manifest (`https://vfx-ui.com/r/<name>.json`) and create the files by hand.

## What is in a prompt

- **Goal** — install and use one specific VFX UI component, in one specific place on the page.
- **Install command** — `npx shadcn@latest add https://vfx-ui.com/r/<name>.json`, so you stay on the published, updatable component.
- **Usage example** — real JSX with sensible props, generated from the component's actual prop interface.
- **Customization hints** — which copy, colors, children and motion knobs to change.
- **Guardrails** — treat installed files as library code; WebGPU/fallback notes where relevant.

## Files

- `/prompts/<name>.md` — one prompt per component (93).
- `/prompts/index.md` — the full index: name, title, category, one-line description.

Categories covered: Heroes, Footers, Backgrounds, Interactions, Text, Glass, Blocks.

These files are generated — rerun `node scripts/generate-prompts.mjs` after the registry changes. Routing and copy buttons for the website are wired centrally; these are the static sources of truth.
