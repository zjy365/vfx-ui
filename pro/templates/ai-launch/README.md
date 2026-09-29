# Pro template — AI Launch (`ai-launch`)

A dark, technical launch page for a fictional AI product — **"Noema"** by Parallax Labs, a
reasoning engine that answers only with citations. Iris-violet accents on near-black, opened
by a GPU vortex hero and closed by a phosphor-grid footer. The same composition works for
developer tools, model startups, research products, or any launch that wants a cinematic,
slightly cosmic first screen.

![ai-launch full page](TODO-screenshot-full.png)
<!-- TODO: capture a full-page screenshot (light + dark viewport) and drop it here. -->

## Sections & components (10)

| Order | Component | Role |
|---|---|---|
| 0 | (page markup) | Screen-top `PRO TEMPLATE DEMO` label — remove when you ship |
| 1 | `BlockBanner` | 2.0 launch announcement, inline (not sticky) |
| 2 | `BlockNav` | Brand + Product / Model / Pricing / FAQ, sticky-friendly |
| 3 | `HeroVortexCentered` | Indigo vortex with a calm eye behind the headline |
| 4 | `BlockShowcase` | Fictional workspace UI in a tilt frame |
| 5 | `BlockFeatureTabs` | Citation graph / memory / guardrails / deployment |
| 6 | `BlockStats` | Count-up proof band (fictional figures, marked) |
| 7 | `BlockPricing` | Explorer / Researcher (featured) / Lab, annual toggle |
| 8 | `BlockFaq` | Five honest questions, native `<details>` |
| 9 | `BlockCta` | Closing conversion band |
| 10 | `FooterPhosphor` | Wordmark rendered as a field of lit cells |

All imported from `@vfx-ui/react` — no other dependencies.

## Install

The template itself is a Pro item:

```bash
npx shadcn add "https://vfx-ui.com/pro/r/ai-launch.json?token=vfxp_YOUR_KEY"
```

The sections it composes are free (MIT) and installed individually if you don't have them:

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-banner.json https://vfx-ui.com/r/block-nav.json \
  https://vfx-ui.com/r/hero-vortex-centered.json https://vfx-ui.com/r/block-showcase.json \
  https://vfx-ui.com/r/block-feature-tabs.json https://vfx-ui.com/r/block-stats.json \
  https://vfx-ui.com/r/block-pricing.json https://vfx-ui.com/r/block-faq.json \
  https://vfx-ui.com/r/block-cta.json https://vfx-ui.com/r/footer-phosphor.json
```

## Usage

```tsx
import AiLaunch from "@/components/pro/ai-launch";

export default function Page() {
  return <AiLaunch />;
}
```

The component accepts `{ className, style }` on its root, so a host page can wrap or scope it.

## Swapping in your content

Everything is inline JSX props — there is no config object to fight with:

- **Hero** — `eyebrow / title / subtitle` and the two CTAs on `HeroVortexCentered`; shader
  dials (`color`, `emission`, `coreGlow`, `speed`) re-tune the palette in one place.
- **Copy blocks** — each block receives its full content as props (`tabs`, `stats`, `plans`,
  `items`, …). Search the file for `fictional` — every demo marker tells you what to replace.
- **Showcase media** — pass `media={<img src="…"/>}` (plus `mediaAlt`) to `BlockShowcase` to
  replace the built-in fictional UI drawing.
- **Anchors** — section ids use the `noema-*` prefix; rename them together with the nav links.
- **Remove the demo label** — delete the `vfx-ai-demo` paragraph and its CSS at the top.

## Tone notes

- Dark scheme throughout; every block is passed `scheme="dark" accent="#9d8cff"`. The page
  tint (`--vb-bg` override in the page `<style>`) keeps block backgrounds seamless with the
  hero's near-black.
- The accent is the Pro iris violet (`#9d8cff` on dark, per DESIGN.md) — swap it in one
  place per block to rebrand.
- Fictional figures and plans carry visible demo notes (`demoNote`, footnotes). Keep the
  honesty or replace the numbers — don't ship the demo claims.
