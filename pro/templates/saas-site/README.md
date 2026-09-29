# Pro template — SaaS Site (`saas-site`)

A light, editorial marketing site for a fictional B2B SaaS — **"Cartogram"**, a
warehouse-native customer-journey analytics platform. Serif headlines, aurora masthead,
quiet teal accents on warm paper, closed by a copper-tide footer band. The composition suits
analytics tools, fintech, dev-platforms, or any product that wants to read like a magazine
rather than a landing-page factory.

![saas-site full page](TODO-screenshot-full.png)
<!-- TODO: capture a full-page screenshot and drop it here. -->

## Sections & components (9)

| Order | Component | Role |
|---|---|---|
| 0 | (page markup) | Screen-top `PRO TEMPLATE DEMO` label — remove when you ship |
| 1 | `BlockNav` | Brand + Platform / Proof / Stories / Contact |
| 2 | `HeroAuroraEditorial` | Serif masthead under a light aurora scrim |
| 3 | `BlockLogos` | Fictional customer wordmarks, 5 per row |
| 4 | `BlockFeatureGrid` | Four capabilities, even editorial grid |
| 5 | `BlockComparison` | Drag handle: aggregates vs. journeys |
| 6 | `BlockTestimonials` | Featured quote + three supporting (fictional) |
| 7 | `BlockNewsletter` | Demo-mode subscribe form with local validation |
| 8 | `BlockContact` | Channels + full form, demo mode |
| 9 | `FooterTidal` | Copper tide behind monumental wordmark |

All imported from `@vfx-ui/react` — no other dependencies.

## Install

The template itself is a Pro item:

```bash
npx shadcn add "https://vfx-ui.com/pro/r/saas-site.json?token=vfxp_YOUR_KEY"
```

The sections it composes are free (MIT) and installed individually if you don't have them:

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-nav.json https://vfx-ui.com/r/hero-aurora-editorial.json \
  https://vfx-ui.com/r/block-logos.json https://vfx-ui.com/r/block-feature-grid.json \
  https://vfx-ui.com/r/block-comparison.json https://vfx-ui.com/r/block-testimonials.json \
  https://vfx-ui.com/r/block-newsletter.json https://vfx-ui.com/r/block-contact.json \
  https://vfx-ui.com/r/footer-tidal.json
```

## Usage

```tsx
import SaasSite from "@/components/pro/saas-site";

export default function Page() {
  return <SaasSite />;
}
```

The component accepts `{ className, style }` on its root.

## Swapping in your content

- **Hero** — `eyebrow / title / subtitle / detail` and CTAs on `HeroAuroraEditorial`; the
  aurora palette is `primary` / `secondary` (here teal + indigo at reduced `intensity` for
  the light scheme).
- **Logos** — pass `logo={<img …/>}` per item, or keep the styled wordmarks and just edit
  names. `demoNote` marks them fictional; set it to `null` once real customers approve.
- **Comparison** — supply your own `before` / `after` nodes (two screenshots work best);
  the defaults are generated fictional panels.
- **Forms** — both `BlockNewsletter` and `BlockContact` run in demo mode (local validation,
  nothing sent) until you pass `onSubscribe` / `onSubmit`. Swap the demo notes for real ones
  when you wire handlers.
- **Type** — the serif headline override lives in the page `<style>` block
  (`.vfx-pro-saas .vfx-block-title`). Delete two lines to go back to sans.
- **Anchors** — ids use the `cartogram-*` prefix; rename with the nav links.
- **Remove the demo label** — delete the `vfx-saas-demo` paragraph and its CSS.

## Tone notes

- Every block is `scheme="light" accent="#0f766e"` — one accent to rebrand the whole page.
- The page background matches the blocks' light token (`#f7f7f2`) so sections read as one
  continuous sheet; `FooterTidal` intentionally breaks it as a closing dark band.
- Fictional customers, quotes, and form copy all carry visible demo markers. Replace or
  remove them — don't ship demo claims.
