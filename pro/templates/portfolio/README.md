# Pro template — Portfolio (`portfolio`)

A dark, colorful one-person portfolio for a fictional designer-developer — **"Juno Reyes"**,
interface artist. Chroma edges bleed around the masthead, selected work opens in an
accessible lightbox, a timeline and quote wall carry the personality, and the page folds
shut on a paper footer. For illustrators, creative developers, motion designers, studios of
one — anyone whose site should feel like their work.

![portfolio full page](TODO-screenshot-full.png)
<!-- TODO: capture a full-page screenshot and drop it here. -->

## Sections & components (9)

| Order | Component | Role |
|---|---|---|
| 0 | (page markup) | Screen-top `PRO TEMPLATE DEMO` label — remove when you ship |
| 1 | `BlockNav` | Name + Work / Path / About + availability action |
| 2 | `HeroChromaFull` | Full-bleed chroma bleed (dusk palette), sweep-reactive |
| 3 | `BlockGallery` | Six works, lightbox with keyboard + focus handling |
| 4 | `BlockStats` | Playful proof band (fictional figures, marked) |
| 5 | `BlockTimeline` | Career path with tag chips |
| 6 | `BlockQuoteWall` | Masonry wall of fictional voices |
| 7 | `BlockTeam` | Single-member "About" variant with social links |
| 8 | `BlockCta` | Availability + contact band |
| 9 | `FooterFold` | Hinged paper wordmark that reacts to the pointer |

All imported from `@vfx-ui/react` — no other dependencies.

## Install

The template itself is a Pro item:

```bash
npx shadcn add "https://vfx-ui.com/pro/r/portfolio.json?token=vfxp_YOUR_KEY"
```

The sections it composes are free (MIT) and installed individually if you don't have them:

```bash
npx shadcn@latest add https://vfx-ui.com/r/block-nav.json https://vfx-ui.com/r/hero-chroma-full.json \
  https://vfx-ui.com/r/block-gallery.json https://vfx-ui.com/r/block-stats.json \
  https://vfx-ui.com/r/block-timeline.json https://vfx-ui.com/r/block-quote-wall.json \
  https://vfx-ui.com/r/block-team.json https://vfx-ui.com/r/block-cta.json \
  https://vfx-ui.com/r/footer-fold.json
```

## Usage

```tsx
import Portfolio from "@/components/pro/portfolio";

export default function Page() {
  return <Portfolio />;
}
```

The component accepts `{ className, style }` on its root.

## Swapping in your content

- **Hero** — `eyebrow / title / subtitle` and CTAs on `HeroChromaFull`. The five edge
  colors (`upColor / downColor / leftColor / rightColor` over `baseColor`) are your palette;
  change them and the whole personality changes. It reacts to pointer sweeps.
- **Gallery** — pass `media={<img …/>}` (or `<video>`) per item and set `alt`; tiles flag
  `tall` for the masonry rhythm. The lightbox is on by default (`lightbox`); set it to
  `false` and give items `href` to link out instead.
- **Stats & timeline** — plain data props (`stats`, `events`). Keep the visible demo notes
  or replace the numbers with your own.
- **Quote wall** — `mode="wall"` pins everything; switch to `mode="rotate"` for one quote
  at a time on quiet pages.
- **About** — `BlockTeam` with a single member is the one-person studio variant. Add an
  `avatar` node for a portrait, or keep the generated initials badge.
- **Anchors** — ids use the `portfolio-*` prefix; rename with the nav links.
- **Remove the demo label** — delete the `vfx-portfolio-demo` paragraph and its CSS.

## Tone notes

- Dark violet ground (`#130e1e`) tinted across every block via the page `<style>` override,
  with three rotating accents: pink `#f472b6`, amber `#fbbf24`, violet `#a855f7` — a
  deliberate, slightly loud palette. Restrained variant: one accent everywhere.
- `FooterFold` ships in light paper tones on purpose — the page ends by "folding shut";
  pass `color` / `background` / `depth` to restyle it.
- Every fictional project, quote, and figure carries a visible demo marker. Replace with
  your real work before shipping.
