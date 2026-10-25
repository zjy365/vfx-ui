---
name: VFX UI
description: Real React component specimens in a cool white exhibition and working source interface.
colors:
  canvas: "#f7f8fa"
  ink: "#17191c"
  muted: "#626873"
  line: "#e3e5e9"
  surface: "#fff"
  on-ink: "#fff"
  selection: "#e7edf8"
  dark-canvas: "#17191e"
  dark-ink: "#f1f3f7"
  dark-muted: "#aeb5c2"
  dark-line: "#353941"
  dark-surface: "#20232a"
  dark-on-ink: "#17191c"
  dark-selection: "#323e53"
typography:
  display:
    fontFamily: '"Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif'
    fontSize: "clamp(44px, 4.72vw, 68px)"
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  gallery-title:
    fontFamily: '"Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif'
    fontSize: "48px"
    fontWeight: 600
    lineHeight: 1.083
    letterSpacing: "-0.035em"
  detail-title:
    fontFamily: '"Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif'
    fontSize: "42px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  body:
    fontFamily: '"Manrope Variable", Manrope, sans-serif'
    fontSize: "15px"
    lineHeight: "25px"
  code:
    fontFamily: '"DM Mono", monospace'
    fontSize: "11px"
    lineHeight: "23px"
rounded:
  control: "6px"
  action: "9px"
  code: "12px"
  specimen: "14px"
  exhibition: "16px"
  chip: "24px"
spacing:
  control-gap: "8px"
  specimen-gap: "16px"
  gallery-gap: "20px"
  panel: "24px"
  page-desktop: "48px"
components:
  navigation-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.action}"
    padding: "11px 18px"
  search:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.action}"
    padding: "12px 14px"
  category-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.chip}"
    padding: "10px 14px"
  gallery-art:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.specimen}"
  usage:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.code}"
---

# Design System: VFX UI

## Overview

**Creative North Star: "Interactive type-foundry specimen"**

The current product site gives real React components room to show their character. Cool white framing, graphite controls and Bricolage display type organize the exhibition; shaders, Heroes, Footers and DOM interactions supply their own color and material. The practical sequence is to experience an effect, adjust its parameters, then take editable source.

This records the implemented homepage, free component gallery, detail workbench, documentation and public Pro storefront. `PRODUCT.md` remains the product record; product decisions stay in Space. The current Docs and Pro collection/detail pages extend the same site frame. The separate purchase/account service has its own design record in `vfx-ui-pro/apps/store/DESIGN.md`; the six private template applications remain outside this redesign.

**Key Characteristics:**

- Real rendered components and their actual posters; no substitute marketing shader illustration.
- Large specimen typography above a quiet, compact tool interface.
- Theme-aware site framing, with independent theme and content inside component previews.
- Free-library discovery first; installation and API details disclose progressively.

**Authority and provenance.** Current source wins over historical notes: `apps/site/src/app/exhibit.css`, `apps/site/src/components/catalog-gallery.module.css`, `detail-workbench.css`, `component-detail.tsx`, `live-exhibit.tsx`, `shell.tsx`, `header-navigation.tsx`, the homepage and `apps/preview/src/main.tsx`. `global.css` supplies body and code fonts; its older yellow accent and earlier page treatments are not the current homepage identity. `exhibit.css` loads afterward and owns the new frame.

Docs is governed by `apps/site/content/docs/` and `apps/site/src/app/docs/`. Public Pro pages are governed by `apps/site/src/app/templates/`, `pro-product-selector.tsx`, `pro-storefront.module.css`, `pro-storefront.ts`, `pro-offer.tsx`, `template-preview.tsx` and `catalog/templates.mjs`. These additions retain the current neutral palette and Bricolage/Manrope typography, with a scoped cobalt action color for the Pro purchase flow.

## Colors

### Primary

Graphite ink is the product frame's primary action color. Filled navigation actions and selected category chips use ink against on-ink. There is no shared saturated brand accent across all specimen artwork.

### Neutral

The frontmatter maps directly to `--exhibit-*` custom properties: canvas behind the page, surface on fields and panels, muted for secondary copy, line for separators, and selection for selected presets. The `dark-*` entries are the implemented `html.dark` overrides for those same roles, not a separate specimen palette.

**The Component Color Rule.** Saturated color belongs to the demonstrated component. Ocean, Ember and Orchid are Fluid Gradient settings; copper Hero artwork and pink Footer artwork remain local to those components. They are not site-wide button or background tokens.

The public Pro flow scopes cobalt to purchase actions, selected template thumbnails and focus indicators: `--pro-action` is `#3158e9`, hover is `#2441b5`, and the selected-surface token is `#edf1ff`. Dark mode uses `#9fb3ff`, `#c1ceff` and `#2a3350` respectively. Keep this exception local to Pro; the free library frame remains graphite.

## Typography

**Display Font:** Bricolage Grotesque Variable, with Bricolage Grotesque and sans-serif fallbacks. Used for the wordmark and product headings.

**Body Font:** Manrope Variable, with Manrope and sans-serif fallbacks. Used for navigation, captions, descriptive copy and controls.

**Code Font:** DM Mono, with monospace fallback. Used for installation commands, source and compact runtime information.

The main display reaches approximately 68/72 at desktop widths. Gallery and detail headings step down through the frontmatter roles rather than repeating the homepage scale. Homepage section headings use 36px display type. Navigation and body copy remain compact (mostly 12–15px); source uses the code role. The homepage's mobile heading is 39px at widths up to 480px, gallery is 38px up to 700px, and detail is 34/39px up to 767px. Do not propagate the older all-Manrope or Figtree display identities into new product screens.

Docs uses Bricolage titles at 30–38px, 25px section headings and Manrope reading copy at 15px with 1.8 line height; descriptions use 17px with 1.65 line height and a 65ch cap. Public Pro intro type uses `clamp(38px, 3.75vw, 54px)` with 1.08 line height, 44px at 1200px and below, and 30/34px at 767px and below. The selector price uses 48/52px desktop and 34/40px mobile. Template names stay outside the artwork; detail titles use 52/56px desktop and 40/44px mobile.

## Layout

The outer container caps at 1440px with 48px desktop gutters. Homepage gutters step to 24px at 800px and 20px at 480px; gallery uses 32px at 1100px and 20px at 700px. Detail follows the shared page gutter. Navigation is 72px tall on desktop and 64px at 960px and below. The footer is a short utility closure with links and license information.

The homepage opens with a two-line introduction and visible library entry, followed by a 2:1 exhibition wall: the real Fluid Gradient stage (884 × 512 at the reference desktop size) beside complete HeroContour and FooterVinyl specimens. It is a grid that shrinks with the container, not a fixed screenshot. Below 800px the main stage stacks above the side specimens; below 480px every specimen occupies its own row. The mobile shader is 386px tall. Mobile Hero picks retain their own content ratio so text and artwork are not cut off by the generic image slot.

Gallery cards use three equal columns with 20px horizontal and 28px vertical gaps, two columns below 1100px and one below 700px. The artwork frame uses a 434:270 ratio. Full section compositions use containment; shaders may fill their frame. Captions stay outside the art. Category chips scroll horizontally on narrow screens and the search field moves above them.

The detail workbench uses a flexible preview plus a collapsible 280px parameter panel (250px below 1000px). Below 767px the controls fold underneath. Shader stages default to 470px desktop and 380px mobile; Hero and Footer previews report natural content height so the outer page scrolls through the complete composition. Do not force them into a fixed-height nested page viewport. Usage follows the stage; installation and reference content can expand below it. Fumadocs remains confined to documentation routes.

Docs retains Fumadocs navigation and table of contents, with the site palette applied inside the docs layout. Reading paragraphs have 14px vertical margins; section headings create a 36px upper pause. At 767px and below, page padding is 20px horizontally and 28px at the top, and section headings reduce to 23px with a 30px upper margin.

Public Pro uses the 1440px frame with 48px gutters, 32px below 1120px and 20px below 700px. The primary selector pairs a flexible preview panel with a 392px license panel and a six-thumbnail rail. At 767px and below, these flatten into one card ordered toolbar, cover, thumbnails, license heading, price, purchase action, account link, benefits and preparation note; the purchase action precedes the longer feature list. The selected cover uses a top-aligned crop, with a 2.1 aspect ratio on mobile. The directory below uses three columns, two at 1000px and below and one at 767px and below.

Pro detail places its title/category above an explicit `preview offer` grid, with a flexible cover and 360px purchase column; below 767px, the areas become `preview` then `offer`. Keep those named grid areas aligned with the preview/offer children so the cover remains visible. Detail covers retain their 1440:1000 composition. The lower pricing band presents one bundle; included/setup sections stack vertically on mobile.

## Elevation & Depth

The frame relies on tonal separation, thin borders and spacious composition. Artwork carries the material depth. Small floating preview controls, status messages and the mobile navigation popover have local shadows; the workbench and gallery do not gain decorative card shadows. On pointer-capable desktop screens, specimen images scale to 1.018 on hover over 240ms; reduced motion removes this transform and the preview fades. Keep those transitions subordinate to the actual effects.

## Shapes

Fields and primary actions use compact rounded corners; specimens use larger, soft rectangular frames. Filters and palette controls are pills. Borders define tools and panels, while the specimen canvas clips only its own artwork. Site radii must not overwrite the public components' own shapes, materials or consumer styles.

## Components

### Navigation and actions

The wordmark uses Bricolage with a four-square mark. Header styling is scoped in `apps/site/src/components/site-header.module.css`, replacing the legacy global header overrides. The solid, full-width header stays at the top during scrolling; its inner frame aligns with the 1440px page grid. Desktop height is 72px. Brand and Components / Docs / Templates sit on the left, with a quiet Pro badge on Templates; GitHub, theme and one filled Get started action sit on the right. Get started links to `/docs/installation/`; Components is the library entry. The active section uses `aria-current="page"` with an outlined surface. Account links appear only when the independent purchase service is configured.

At 960px and below, the header becomes 64px tall with a separate theme control and a labelled native `details` menu. Primary links include short descriptions; repository and account links form a separate group above the filled installation action. All header controls have at least 44px touch targets. The menu fits the available viewport and scrolls internally on short screens. Escape closes and restores focus; outside pointer input, focus leaving the menu and navigation close it. Styling follows the existing light/dark tokens without backdrop blur or decorative motion. The footer stays brief.

### Search and categories

Search is a white, bordered field with a visible focus-within outline. Category chips use muted text at rest, a quiet line-colored hover surface and graphite selection. Selected state is represented by `aria-pressed`; counts remain compact. Query and category live in the URL and restore with browser Back.

### Gallery specimens

Posters come from the exported components. `Try live` starts a single preview instance; it stays masked by the poster until the renderer is ready and safe to show. Touch users always see the play control. An error keeps useful artwork visible and offers a recovery path. Do not run a live GPU canvas for every card.

### Live homepage exhibit

Fluid Gradient is the real runtime, with three palettes and explicit pause/resume. Palette settings carry into its detail page through permitted props. Pause captures a still and removes the frame; leaving the viewport or hiding the document releases it as well. Reduced-motion freezing is implemented in the renderer core, separately from the site's mounting lifecycle. The surrounding text and controls remain usable over the component.

### Detail workbench and source

Preview tools expose theme, device width, pause, replay, fullscreen and customization without adding a documentation sidebar. Parameter changes update Usage while preserving example imports, complex children and registry dependencies. Registry and package source remain distinct. Installation expands on request and requires no account. This work preserves the 93-component free catalog and existing routes.

Iframe messages are scoped to the expected source window, origin and component id; the preview runtime restricts the homepage's transmitted props. Keep runtime failure and loading states explicit. Public component content and actions remain consumer-owned, including when the example is a complete Hero or Footer.

### Documentation

The sidebar groups Quick start and Installation & usage under Get started, compatibility/accessibility and agent guidance under Guides, and Free & Pro plus Licenses under Usage & licensing. Quick start leads from choosing a component to installing and customizing it; installation presents editable source and the package as two alternatives, followed by a complete React/Next.js usage example and troubleshooting. Guide links use separated text rows with short explanations. Keep public component browsing one link away and use the component detail page as the props reference.

### Public Pro storefront

The collection opens with a compact introduction, a real-template preview selector and one Pro Lifetime license panel. Each thumbnail is a button with a label and `aria-pressed`; selection updates the cover, name and detail link while preserving the bundle offer. The six-template directory remains available below. Detail pages show the homepage cover, bundle license, delivery status, included pages, setup requirements and two related templates. Native links lead to the account service; FAQ answers use native disclosures. All framing follows the existing light/dark site tokens with scoped Pro action color.

Pro Lifetime is the only current sales offer: $199 USD once for all six current and future Pro templates. Public purchase actions require a configured account service and lead to license review/sign-in; they do not imply checkout readiness. Catalog status remains `rebuilding`, with explicit source-delivery preparation copy, and final checkout is gated by the store's release/payment readiness. Preserve historical single-template SKU entitlements in the backend without presenting them as current sales choices. Public builds contain metadata and covers only; paid application source and private archives stay outside the public repository. Preserve the six private applications and their source.

## Do's and Don'ts

### Do

- **Do** let real component rendering and actual thumbnails supply the visual variety.
- **Do** preserve complete Hero and Footer compositions; inspect the mobile text and actions as well as the artwork.
- **Do** preserve native links, keyboard access, touch controls and reduced-motion behavior.
- **Do** use current exhibit tokens for product framing and keep consumer component styles isolated.
- **Do** preserve existing export, preset, route, registry and attribution compatibility when updating a specimen.

### Don't

- **Don't** revive the rejected yellow optical SVG homepage as current identity.
- **Don't** promote the old cinematic/Figtree, Pro violet or library-specific material palettes into current product-site defaults.
- **Don't** turn every gallery card into an automatically running preview or clip a complete section just to fill a thumbnail.
- **Don't** copy restricted Animate UI, React Bits or Panel UI source. Interaction mechanisms can inform an original implementation; source licensing and attribution remain binding.
- **Don't** treat delegated working comps, old review evidence or this recording pass as explicit user approval or final review sign-off.

### Historical records — compatibility and provenance only

Everything below is preserved from the earlier `DESIGN.md`. Its present-tense descriptions, old review statements and Pro restrictions describe prior implementations. They are historical evidence for library artwork, compatibility and attribution, **not current rules for the homepage, gallery, detail workbench, Docs or public Pro storefront**. The first record is the superseded yellow/Manrope product site that the user rejected. Keep the technical links and component history when editing this archive. The retained Pro record does not extend this redesign into the six private template applications; the account service follows its separate current design record.

#### Superseded product-site direction

The website is a component product, with direct interactive previews and prominent source access. It has no persistent documentation sidebar in the gallery or component playground. Code, installation and API content are progressively disclosed. Fumadocs is restricted to the technical documentation routes.

Use Manrope for product typography and DM Mono for compact metadata. The light canvas is white, ink #17191C, muted #555B64, surface #F1F2F4, line #DDE0E4, accent #F5D547. Desktop page padding is 64px, mobile 24px. Main display is 80/84px with -0.055em tracking; the gallery uses 72/76px, and component titles 44/50px. Mobile display is 48–52px. CSS tokens support light/dark without imposing website variables on consumer components.

The homepage optical study, yellow magnetic control, large hero/footer previews and separate Pro collection establish the brand. The actual components supply the visual variety. Preview runtimes are isolated and loaded on request in the gallery; a detail page runs one component at a time. GPU loops pause when hidden, offscreen or reduced motion is requested.

The records below describe prior library artwork. They remain relevant to component compatibility and attribution, and do not override the current product-site design.

#### Intent

An interactive material exhibition for developers. Visitors should experience an effect, understand what responds to them, and reach working source with minimal friction. Preserve the existing cinematic Hero effects while broadening the library with a few expressive DOM components.

Direction seed: `9fe17e73`, candidate 7. The supplied design methodology informed the direction, fresh-context screenshot critiques, and subtraction pass; it is not a claim of an objective design score.

#### Visual language

- Cinematic black opening with a live, selectable GPU artwork and warm white oversized typography.
- Mineral paper (`#eeefe9`), charcoal green (`#202520`), and cobalt (`#2349db`) for the interaction studio.
- Figtree Black for display headlines, the existing sans-serif for interfaces, and monospace for source. The local font includes its OFL license.
- Let actual components supply the spectacle. Use restrained borders, quiet labels, generous space, and a deliberate transition from exhibition to documentation.

#### Interaction contracts

- Pointer motion is local to a component or its Hero surface. Content stays clickable while the decorative layer remains non-interactive.
- Magnetic controls retain a stationary hit region. Motion settles through an imperative animation loop instead of causing React renders on every pointer movement.
- Respect reduced motion, ignore touch hover emulation, clean up listeners and frames, and preserve native keyboard behavior.
- The homepage can pause its GPU exhibition and releases it offscreen. This is separate from freezing shader time inside the library renderer.
- Keep component defaults conservative; interactive demonstrations explicitly enable pointer response.

#### Content and catalog

- Hero copy is example content. Accept React nodes, actionable CTA objects, or fully custom children; never require the demonstration wording.
- One component gets one catalog entry. Presets remain discoverable within components and through search.
- Scale a complete Hero composition inside the documentation preview rather than clipping its title or actions.
- Keep props, installation files, agent-readable documentation, and real thumbnails aligned with the exported implementation.

#### Review evidence

Checked desktop and 390px mobile layouts, live pointer response, component controls, native CTA behavior, keyboard semantics, and reduced-motion lifecycle. Two independent screenshot reviews informed fixes to scrolling, preview framing, labels, and competing controls. Mobile screenshot artifacts were checked against the actual viewport before treating them as layout bugs.

Avoid expanding this direction into indiscriminate cursor effects, decorative dashboards, or additional slogan sections. Future components should introduce a distinct interaction or material behavior.

#### Footer extension

Hero and Footer are the two primary collection categories. FooterTidal introduces copper engraved currents and opaque monumental type; FooterFold uses a connected lavender paper screen with violet ink; FooterPhosphor uses a full-width cell wordmark with navigation beneath. The homepage’s actual footer switches among these exported components. Footer gallery images preserve the entire composition and mobile previews retain their intrinsic height.

The external random seed, alternatives, material decisions and independent screenshot review are recorded in [the Footer design record](docs/design/footers.md). LiveChart, WebGlobe and EnergyOrb were removed at the user’s request; HeroGlobe remains.

#### Optical Glass replacement

Glass now consists of four original optical studies: warm printed card, dark biconvex lens, cobalt molten loop, and a triangular glass frame. Each study uses a distinct scene to make its transmission legible. Preserve public names and preset routes while replacing the former blurred fields. RadiantDots extends the background collection with real multi-pass light transport and original dot arrangements. Material limits, reference attribution, compatibility and review evidence are recorded in [the Glass design record](docs/design/glass.md).

#### September editorial collection

Three original DOM studies extend the material range: HeroEclipse pairs an engraved copper astronomical dial with an occulting disc; HeroContour renders a deterministic seeded landscape as layered contour paths; FooterVinyl turns the closing navigation into a pink record sleeve with a rotating grooved disc. Pointer movement changes each material in its own way and settles without a continuous animation loop. All three work without WebGPU or remote artwork.

Homepage collection links, newest ordering, the live footer selector, React exports, copy-paste registry, generated agent documentation, and actual rendered thumbnails include these additions. Content and actions are consumer-owned. At 390px the hero artwork flows below its copy and footer links remain native. Reduced motion and disabled interaction preserve a static composition.

#### Pro tier

The current public Pro surface is `/templates/` in `apps/site`, with product metadata in `catalog/templates.mjs` and public covers in `previews/thumbnails/`. It uses the current site frame and links to the independent purchase service when configured. The old `/pro` URL redirects to `/templates/`.

Editable paid applications and the purchase service live in the separate local `vfx-ui-pro` directory. The former single-file templates, legacy pricing page, placeholder checkout helper and static concept demonstrations have been removed. Public builds include metadata and thumbnails without paid application source.
