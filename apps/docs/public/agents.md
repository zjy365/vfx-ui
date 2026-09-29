# VFX UI — agent guide

# VFX UI

> Shader-native visual effect components for React, rendered via WebGPU (vgpu).
> Expressive hero and footer sections, GPU backgrounds, and focused DOM interactions for your own content.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

## Component catalog

- [Hero Eclipse](https://vfx-ui.com/components/hero-eclipse.md): An engraved astronomical dial with a pointer-controlled eclipse.
- [Hero Contour](https://vfx-ui.com/components/hero-contour.md): A seeded topographic paper landscape that lifts around the pointer.
- [Footer Vinyl](https://vfx-ui.com/components/footer-vinyl.md): A record-sleeve footer with a pointer-rotated vinyl and your own label.
- [Astra Field](https://vfx-ui.com/components/astra-field.md): A rotatable spiral galaxy of glowing stars.
- [Radiant Dots](https://vfx-ui.com/components/radiant-dots.md): Orbital emitters with jump-flooded distance fields and radiance cascades.
- [Footer Tidal](https://vfx-ui.com/components/footer-tidal.md): Copper tidal lines beneath your brand, with pointer-driven currents.
- [Footer Fold](https://vfx-ui.com/components/footer-fold.md): A wordmark printed across hinged paper panels that respond to the pointer.
- [Footer Phosphor](https://vfx-ui.com/components/footer-phosphor.md): A luminous cell wordmark that disperses around your pointer and settles home.
- [Spectral Card](https://vfx-ui.com/components/spectral-card.md): Holographic light and spatial tilt around your own content.
- [Kinetic Text](https://vfx-ui.com/components/kinetic-text.md): A pointer-driven force field lifts your words into a soft wave.
- [Magnetic](https://vfx-ui.com/components/magnetic.md): A gentle magnetic pull for your own buttons, links, and content.
- [Wave Background](https://vfx-ui.com/components/wave-background.md): Three layered sine bands sweeping over a tri-color gradient. GPU-rendered via WebGPU; DOM cannot reproduce it.
- [Fluid Gradient](https://vfx-ui.com/components/fluid-gradient.md): Domain-warped fBm noise flowing through a tri-color palette.
- [Aurora](https://vfx-ui.com/components/aurora.md): Vertical light curtains driven by fBm perturbation and gaussian bands.
- [Starfield](https://vfx-ui.com/components/starfield.md): Hashed star grid with twinkle and slow parallax drift.
- [Particle Field](https://vfx-ui.com/components/particle-field.md): Procedural cell-hashed particles with drift and size breathing.
- [Glass Card](https://vfx-ui.com/components/glass-card.md): Thick-cut optical glass with two-interface refraction and studio reflections.
- [Liquid Glass](https://vfx-ui.com/components/liquid-glass.md): A molten glass annulus with a travelling silhouette and spectral transmission.
- [Glass Lens](https://vfx-ui.com/components/glass-lens.md): A biconvex glass lens that magnifies and inverts a printed studio scene.
- [Black Hole](https://vfx-ui.com/components/black-hole.md): The vgpu optimized-black-hole pipeline as a component: baked null-geodesic G-buffer, HDR bloom, prefiltered lensed star field, Doppler beaming — a verbatim port (MIT, Vercel).
- [Mesh Gradient](https://vfx-ui.com/components/mesh-gradient.md): Voronoi-cell color fields flowing through a curated palette.
- [Iridescent](https://vfx-ui.com/components/iridescent.md): Silky thin-film interference colors drifting across the surface.
- [Vortex](https://vfx-ui.com/components/vortex.md): Spiral galaxy swirl with star speckles and trailing arms.
- [Ribbon Field](https://vfx-ui.com/components/ribbon-field.md): Three Gaussian light ribbons over a dot-matrix grid with bloom and grain — WGSL port of ThreeUI's RibbonField (MIT, Copyright 2026 Meng To).
- [Fiber Flow](https://vfx-ui.com/components/fiber-flow.md): Luminous silk fibers streaming through the dark — domain-warped fbm ridge field with pointer parallax (opt-in).
- [Light Prism](https://vfx-ui.com/components/light-prism.md): A solid beveled optical prism using Vercel’s complete MIT spectral optics and multi-pass glass pipeline.
- [Hero Fluid](https://vfx-ui.com/components/hero-fluid.md): Drop-in hero section: centered headline over a GPU liquid-gradient field with real selectable DOM text, scrim-backed contrast, and a reduced-motion static fallback.
- [Hero Aurora](https://vfx-ui.com/components/hero-aurora.md): Drop-in hero section: bottom-left copy anchored under full-bleed aurora curtains rendered per-pixel on the GPU.
- [Hero Fiber](https://vfx-ui.com/components/hero-fiber.md): Drop-in hero section: top-weighted headline over luminous silk fibers streaming through the dark.
- [Hero Globe](https://vfx-ui.com/components/hero-globe.md): Drop-in split hero: copy on the left, the dot-matrix cobe planet (the globe behind vercel.com) glowing on the right.
- [Hero Mesh](https://vfx-ui.com/components/hero-mesh.md): Drop-in hero section: centered headline over a slow Voronoi mesh-gradient field — every frame a different poster.
- [Hero Iridescent](https://vfx-ui.com/components/hero-iridescent.md): Drop-in hero section: left copy over a holographic thin-film sheen — the premium product-launch look, computed per-pixel.
- [Hero Vortex](https://vfx-ui.com/components/hero-vortex.md): Drop-in hero section: centered headline at the eye of a spiral galaxy with star speckles and trailing arms.
- [Hero Ribbon](https://vfx-ui.com/components/hero-ribbon.md): Drop-in split hero: copy left, three Gaussian light ribbons sweeping the right over a dot-matrix grid.
- [Hero Particles](https://vfx-ui.com/components/hero-particles.md): Drop-in hero section: top-weighted headline with a badge row over a drifting GPU particle field.
- [Hero Starfield](https://vfx-ui.com/components/hero-starfield.md): Drop-in hero section: bottom-left copy under a twinkling hashed star grid with parallax drift.
- [Hero Black Hole](https://vfx-ui.com/components/hero-black-hole.md): Drop-in hero section: left copy beside a ray-traced accretion disk with relativistic beaming and a lensed star field.
- [Chroma Flow](https://vfx-ui.com/components/chroma-flow.md): Four-edge liquid color field that floods inward toward the direction the cursor sweeps — fbm-noise bleed boundaries driven by pointer velocity.
- [Hero Chroma](https://vfx-ui.com/components/hero-chroma.md): Drop-in hero section: bottom-left copy over a four-edge liquid color field that floods toward the cursor's sweep direction.
- [Block Nav](https://vfx-ui.com/components/block-nav.md): Complete navigation bar: brand, desktop links, actions, and an accessible mobile sheet with Escape handling.
- [Block Showcase](https://vfx-ui.com/components/block-showcase.md): Product showcase stage: browser-chrome frame with a replaceable screenshot or video (CSS demo UI by default), headline and actions.
- [Block Feature Grid](https://vfx-ui.com/components/block-feature-grid.md): Feature grid with real hierarchy: one bento feature card plus supporting cells, replaceable icons and media.
- [Block Feature Tabs](https://vfx-ui.com/components/block-feature-tabs.md): Feature tabs where list, copy and illustration switch together; WAI-ARIA keyboard pattern, touch-friendly strip on mobile.
- [Block Scroll Story](https://vfx-ui.com/components/block-scroll-story.md): Scroll narrative: a sticky scene crossfades as story steps cross the viewport; docks above the steps on mobile.
- [Block Process Steps](https://vfx-ui.com/components/block-process-steps.md): Three-to-four step process with a self-drawing connector line and replaceable media per step.
- [Block Integrations](https://vfx-ui.com/components/block-integrations.md): Integrations hub with static connection rings of rebrandable tool tiles and an always-available link grid fallback.
- [Block Comparison](https://vfx-ui.com/components/block-comparison.md): Before/after comparison with a draggable, keyboard- and touch-operable reveal handle (a real range input).
- [Block Testimonials](https://vfx-ui.com/components/block-testimonials.md): Testimonials with a featured quote and field notes; fictional demo copy is visibly marked and fully replaceable.
- [Block Pricing](https://vfx-ui.com/components/block-pricing.md): Pricing plans with a working monthly/annual switch — amounts, basis lines and savings render from data.
- [Block FAQ](https://vfx-ui.com/components/block-faq.md): FAQ accordion with real disclosure semantics, arrow-key traversal and CSS grid-rows animation; long answers welcome.
- [Block CTA](https://vfx-ui.com/components/block-cta.md): Closing call to action with primary/secondary actions and a replaceable brand visual layer (concentric line artwork by default).
- [Example — Product Launch](https://vfx-ui.com/components/example-launch.md): Complete fictional software launch page ("Orbit" by Lumen Labs): hero, showcase, feature grid, tabs, scroll story, integrations, pricing, testimonials, FAQ, CTA. All copy is demo content.
- [Example — Design Studio](https://vfx-ui.com/components/example-studio.md): Complete fictional design-studio service page (Atelier North): daylight editorial hero, engagement steps, portfolio showcase, before/after slider, services grid, fixed-fee engagements, testimonials, FAQ and a typographic footer.
- [Ember Drift](https://vfx-ui.com/components/ember-drift.md): Sparks rising from a bed of coals, cooling from gold to red through shimmering heat.
- [Caustics Field](https://vfx-ui.com/components/caustics-field.md): Sunlit pool-floor caustics: a crawling net of focused light over deep water.
- [Halo Rings](https://vfx-ui.com/components/halo-rings.md): Concentric rings breathing outward from a luminous core, their edges split into spectral fringes.
- [Terrain Ridge](https://vfx-ui.com/components/terrain-ridge.md): Layered ridged-noise mountain silhouettes rolling in parallax under a low sun.
- [Silk Veil](https://vfx-ui.com/components/silk-veil.md): A draped silk curtain of warped folds with a luster band sweeping the weave.
- [Plasma Sheet](https://vfx-ui.com/components/plasma-sheet.md): Molten color currents folding through each other in a double domain-warped field.
- [Star Tide](https://vfx-ui.com/components/star-tide.md): Stars carried on slow luminous waves, flaring as the tide crests.
- [Ink Bloom](https://vfx-ui.com/components/ink-bloom.md): Ink drops blooming and feathering into warm paper on staggered cycles.
- [Solar Corona](https://vfx-ui.com/components/solar-corona.md): A boiling sun disk crowned with streaming corona light and polar plumes.
- [Dust Motes](https://vfx-ui.com/components/dust-motes.md): Dust motes drifting through slanted Tyndall beams in a dark room.
- [Hero Aurora Editorial](https://vfx-ui.com/components/hero-aurora-editorial.md): Drop-in hero section: centered serif editorial masthead under aurora curtains — large display title, two standfirst lines, dual CTAs.
- [Hero Starfield Split](https://vfx-ui.com/components/hero-starfield-split.md): Drop-in split hero: copy on the left, a frosted badge wall on the right, over a twinkling hashed star grid.
- [Hero Vortex Centered](https://vfx-ui.com/components/hero-vortex-centered.md): Drop-in hero section: a short centered headline resting in the calm eye of a tight, slow spiral galaxy.
- [Hero Mesh Bold](https://vfx-ui.com/components/hero-mesh-bold.md): Drop-in hero section: one oversized ultra-bold slogan over a vivid Voronoi mesh-gradient field — the poster hero.
- [Hero Fiber Top](https://vfx-ui.com/components/hero-fiber-top.md): Drop-in hero section: a top-aligned left masthead pressing down on silk fibers streaming through the dark.
- [Hero Chroma Full](https://vfx-ui.com/components/hero-chroma-full.md): Drop-in hero section: the four-edge chroma field run full-bleed with bottom-left copy in a dusk palette.
- [Hero Black Hole Cinema](https://vfx-ui.com/components/hero-black-hole-cinema.md): Drop-in hero section: the ray-traced accretion disk letterboxed like a feature film — hard bars top and bottom, title card centered.
- [Hero Particles Badge](https://vfx-ui.com/components/hero-particles-badge.md): Drop-in hero section: a frosted badge row leads a centered headline over a drifting GPU particle field.
- [Hero Ribbon Left](https://vfx-ui.com/components/hero-ribbon-left.md): Drop-in hero section: copy in a left column with a vertical eyebrow rail while the light ribbons read as the right-hand visual.
- [Hero Fluid Minimal](https://vfx-ui.com/components/hero-fluid-minimal.md): Drop-in hero section: one line of copy, one CTA, one liquid gradient — the entire hero for products that can be named in a breath.
- [Glass Panel](https://vfx-ui.com/components/glass-panel.md): A broad ray-marched optical slab that carries your own content across a full panel.
- [Glass Tile](https://vfx-ui.com/components/glass-tile.md): A wall of glass bricks where one shared biconvex lens travels to the hovered tile and bulges through it.
- [Chromatic Text](https://vfx-ui.com/components/chromatic-text.md): The pointer is the prism: nearby letters split into red and blue fringes over a sliding rainbow.
- [Ripple Text](https://vfx-ui.com/components/ripple-text.md): Clicks and taps drop ripples that travel outward through your words; a resting pointer leaves a dimple.
- [Spectrum Text](https://vfx-ui.com/components/spectrum-text.md): A spectral light band flows continuously through your words and leans toward the pointer.
- [Tilt Card](https://vfx-ui.com/components/tilt-card.md): A porcelain card that tilts in space while its specular highlight tracks the pointer across the surface.
- [Pointer Glow](https://vfx-ui.com/components/pointer-glow.md): A handheld light for layouts: the room dims slightly and a warm source follows your pointer over your own content.
- [Spotlight Card](https://vfx-ui.com/components/spotlight-card.md): A card under a torch: the beam follows the pointer to uncover your content from the dark.
- [Elastic Hover](https://vfx-ui.com/components/elastic-hover.md): Rubber around anything you wrap: hover swells, press squashes, and an under-damped spring wobbles it home.
- [Magnetic Grid](https://vfx-ui.com/components/magnetic-grid.md): A lattice of dots that feel the pointer's field — sliding, swelling and settling like iron filings.
- [Block Logos](https://vfx-ui.com/components/block-logos.md): Customer logo wall: brand tiles that sit desaturated and colorize on hover, as real links with styled wordmarks when no image assets exist.
- [Block Stats](https://vfx-ui.com/components/block-stats.md): Stats band: numbers count up from zero on scroll-in with an always-present settled value for screen readers; formatting, prefixes and suffixes are props.
- [Block Team](https://vfx-ui.com/components/block-team.md): Team cards: avatar (image or auto-generated initials badge), name, role and profile links; the whole card is hoverable and linkable.
- [Block Gallery](https://vfx-ui.com/components/block-gallery.md): Work gallery grid with hover lift and an optional lightbox — a real dialog with Escape, arrow keys, focus trap and focus restore; generated CSS artwork by default.
- [Block Timeline](https://vfx-ui.com/components/block-timeline.md): Company or product timeline: a rail that draws itself in on scroll, dots lighting up in sequence, alternating sides on wide screens.
- [Block Newsletter](https://vfx-ui.com/components/block-newsletter.md): Email signup with working client-side validation, announced inline errors and a confirmation panel; runs in an honestly-labeled demo mode until wired up.
- [Block Contact](https://vfx-ui.com/components/block-contact.md): Contact section: a direct-channels list beside a configurable form skeleton — labeled fields, native validation, and a confirmation state on submit.
- [Block Banner](https://vfx-ui.com/components/block-banner.md): Announcement banner: a slim accent strip with an optional action, a labeled dismiss control, Escape handling and sticky-top positioning.
- [Block Milestones](https://vfx-ui.com/components/block-milestones.md): Milestone progress: completed steps light up in sequence on scroll, the current step breathes, and upcoming steps stay dimmed — all driven by one index.
- [Block Quote Wall](https://vfx-ui.com/components/block-quote-wall.md): Quote wall: many quotes in masonry columns, or one at a time in a rotator with keyboard controls, hover/focus pause and reduced-motion respect.

## Per-component docs (machine-readable)

- https://vfx-ui.com/components/astra-field.md
- https://vfx-ui.com/components/aurora.md
- https://vfx-ui.com/components/black-hole.md
- https://vfx-ui.com/components/block-banner.md
- https://vfx-ui.com/components/block-comparison.md
- https://vfx-ui.com/components/block-contact.md
- https://vfx-ui.com/components/block-cta.md
- https://vfx-ui.com/components/block-faq.md
- https://vfx-ui.com/components/block-feature-grid.md
- https://vfx-ui.com/components/block-feature-tabs.md
- https://vfx-ui.com/components/block-gallery.md
- https://vfx-ui.com/components/block-integrations.md
- https://vfx-ui.com/components/block-logos.md
- https://vfx-ui.com/components/block-milestones.md
- https://vfx-ui.com/components/block-nav.md
- https://vfx-ui.com/components/block-newsletter.md
- https://vfx-ui.com/components/block-pricing.md
- https://vfx-ui.com/components/block-process-steps.md
- https://vfx-ui.com/components/block-quote-wall.md
- https://vfx-ui.com/components/block-scroll-story.md
- https://vfx-ui.com/components/block-showcase.md
- https://vfx-ui.com/components/block-stats.md
- https://vfx-ui.com/components/block-team.md
- https://vfx-ui.com/components/block-testimonials.md
- https://vfx-ui.com/components/block-timeline.md
- https://vfx-ui.com/components/caustics-field.md
- https://vfx-ui.com/components/chroma-flow.md
- https://vfx-ui.com/components/chromatic-text.md
- https://vfx-ui.com/components/dust-motes.md
- https://vfx-ui.com/components/elastic-hover.md
- https://vfx-ui.com/components/ember-drift.md
- https://vfx-ui.com/components/example-launch.md
- https://vfx-ui.com/components/example-studio.md
- https://vfx-ui.com/components/fiber-flow.md
- https://vfx-ui.com/components/fluid-gradient.md
- https://vfx-ui.com/components/footer-fold.md
- https://vfx-ui.com/components/footer-phosphor.md
- https://vfx-ui.com/components/footer-tidal.md
- https://vfx-ui.com/components/footer-vinyl.md
- https://vfx-ui.com/components/glass-card.md
- https://vfx-ui.com/components/glass-lens.md
- https://vfx-ui.com/components/glass-panel.md
- https://vfx-ui.com/components/glass-tile.md
- https://vfx-ui.com/components/halo-rings.md
- https://vfx-ui.com/components/hero-aurora-editorial.md
- https://vfx-ui.com/components/hero-aurora.md
- https://vfx-ui.com/components/hero-black-hole-cinema.md
- https://vfx-ui.com/components/hero-black-hole.md
- https://vfx-ui.com/components/hero-chroma-full.md
- https://vfx-ui.com/components/hero-chroma.md
- https://vfx-ui.com/components/hero-contour.md
- https://vfx-ui.com/components/hero-eclipse.md
- https://vfx-ui.com/components/hero-fiber-top.md
- https://vfx-ui.com/components/hero-fiber.md
- https://vfx-ui.com/components/hero-fluid-minimal.md
- https://vfx-ui.com/components/hero-fluid.md
- https://vfx-ui.com/components/hero-globe.md
- https://vfx-ui.com/components/hero-iridescent.md
- https://vfx-ui.com/components/hero-mesh-bold.md
- https://vfx-ui.com/components/hero-mesh.md
- https://vfx-ui.com/components/hero-particles-badge.md
- https://vfx-ui.com/components/hero-particles.md
- https://vfx-ui.com/components/hero-ribbon-left.md
- https://vfx-ui.com/components/hero-ribbon.md
- https://vfx-ui.com/components/hero-starfield-split.md
- https://vfx-ui.com/components/hero-starfield.md
- https://vfx-ui.com/components/hero-vortex-centered.md
- https://vfx-ui.com/components/hero-vortex.md
- https://vfx-ui.com/components/ink-bloom.md
- https://vfx-ui.com/components/iridescent.md
- https://vfx-ui.com/components/kinetic-text.md
- https://vfx-ui.com/components/light-prism.md
- https://vfx-ui.com/components/liquid-glass.md
- https://vfx-ui.com/components/magnetic-grid.md
- https://vfx-ui.com/components/magnetic.md
- https://vfx-ui.com/components/mesh-gradient.md
- https://vfx-ui.com/components/particle-field.md
- https://vfx-ui.com/components/plasma-sheet.md
- https://vfx-ui.com/components/pointer-glow.md
- https://vfx-ui.com/components/radiant-dots.md
- https://vfx-ui.com/components/ribbon-field.md
- https://vfx-ui.com/components/ripple-text.md
- https://vfx-ui.com/components/silk-veil.md
- https://vfx-ui.com/components/solar-corona.md
- https://vfx-ui.com/components/spectral-card.md
- https://vfx-ui.com/components/spectrum-text.md
- https://vfx-ui.com/components/spotlight-card.md
- https://vfx-ui.com/components/star-tide.md
- https://vfx-ui.com/components/starfield.md
- https://vfx-ui.com/components/terrain-ridge.md
- https://vfx-ui.com/components/tilt-card.md
- https://vfx-ui.com/components/vortex.md
- https://vfx-ui.com/components/wave-background.md

## Scope guard

This library provides customizable hero and footer sections, GPU visuals, focused interactions, and complete page Blocks for marketing sites.
Hero sample copy is replaceable. Pass title/subtitle or children and configure CTA href/onClick.
Footer sample copy is replaceable. Configure brand, title, CTA, groups, legal links and copyright. Supply children for your own introduction/navigation layout.
Blocks (block-*) are full page sections: all copy, links, colors and items arrive through props. They are pure DOM/CSS — no WebGPU required — and compose into complete pages; see example-launch and example-studio.
Example pages ship fictional demo content (marked on screen): replace it before going live.
DOM interaction components and blocks do not require WebGPU. This is not a general-purpose UI kit.

# Astra Field

A rotatable spiral galaxy of glowing stars.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { AstraField } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><AstraField interactive /></div>;
}
```

## Props

- `shape?: "six" | "galaxy"`
- `color?: string`
- `intensity?: number`
- `speed?: number`
- `seed?: number`
- `intro?: boolean`
- `introDuration?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { ASTRA_FIELD_PRESETS } from "@vfx-ui/react";
```

## Notes for agents

- Original WebGL spiral star field inspired by OpenAI Astra. No external assets or Three.js dependency.
- Stars gather from a scattered 3D cloud on mount. intro defaults to true; introDuration defaults to 4.8 seconds, independent of ambient speed. Reduced motion skips assembly.
- Drag or use arrow keys to orbit; Home resets. Place your own copy in a sibling DOM layer.
- Offscreen and hidden tabs pause. Reduced motion freezes ambient movement. Provide a sized parent.

# Aurora

Vertical light curtains driven by fBm perturbation and gaussian bands.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { Aurora } from "@vfx-ui/react";

export function Demo() {
  return <Aurora />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `bands?: number`
- `primary?: string`
- `secondary?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { AURORA_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `AURORA_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Black Hole

The vgpu optimized-black-hole pipeline as a component: baked null-geodesic G-buffer, HDR bloom, prefiltered lensed star field, Doppler beaming — a verbatim port (MIT, Vercel).

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { BlackHole } from "@vfx-ui/react";

export function Demo() {
  return <BlackHole />;
}
```

## Props

- `speed?: number`
- `brightness?: number`
- `distance?: number`
- `diskRadius?: number`
- `fov?: number`
- `tilt?: number`
- `centerX?: number`
- `centerY?: number`
- `roll?: number`
- `turbulence?: number`
- `density?: number`
- `doppler?: number`
- `stars?: number`
- `centerFade?: number`
- `bloom?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { BLACK_HOLE_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `BLACK_HOLE_BAKE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Block Banner

Announcement banner: a slim accent strip with an optional action, a labeled dismiss control, Escape handling and sticky-top positioning.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockBanner } from "@vfx-ui/react";

export function Demo() {
  return <BlockBanner />;
}
```

## Props

- `message?: ReactNode`
- `action?: BlockAction | null`
- `dismissible?: boolean`
- `dismissLabel?: string`
- `sticky?: boolean`
- `regionLabel?: string`
- `onDismiss?: () => void`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Comparison

Before/after comparison with a draggable, keyboard- and touch-operable reveal handle (a real range input).

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockComparison } from "@vfx-ui/react";

export function BeforeAfter() {
  return (
    <BlockComparison
      title="Drag to see the redesign."
      before={<img src="/before.png" alt="Before" />}
      after={<img src="/after.png" alt="After" />}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `before?: ReactNode`
- `after?: ReactNode`
- `beforeLabel?: string`
- `afterLabel?: string`
- `defaultPosition?: number`
- `caption?: string`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Contact

Contact section: a direct-channels list beside a configurable form skeleton — labeled fields, native validation, and a confirmation state on submit.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockContact } from "@vfx-ui/react";

export function Demo() {
  return <BlockContact />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `channels?: readonly ContactChannel[]`
- `fields?: readonly ContactField[]`
- `submitLabel?: string`
- `successNote?: ReactNode`
- `resetLabel?: string`
- `onSubmit?: (values: Record<string, string>) => void | Promise<void>`
- `demoNote?: ReactNode | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block CTA

Closing call to action with primary/secondary actions and a replaceable brand visual layer (concentric line artwork by default).

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockCta, WaveBackground } from "@vfx-ui/react";

export function Closing() {
  return (
    <BlockCta
      title="Your next release could feel like this."
      primaryCta={{ label: "Get started free", href: "/start" }}
      secondaryCta={{ label: "See the docs", href: "/docs" }}
      media={<WaveBackground speed={0.55} interactive={false} />}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `primaryCta?: BlockAction | null`
- `secondaryCta?: BlockAction | null`
- `media?: ReactNode`
- `note?: ReactNode`
- `layout?: "panel" | "banner"`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block FAQ

FAQ accordion with real disclosure semantics, arrow-key traversal and CSS grid-rows animation; long answers welcome.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockFaq } from "@vfx-ui/react";

export function Answers() {
  return (
    <BlockFaq
      title="Questions engineers actually ask."
      items={[{ question: "How long does setup take?", answer: "Most teams see their first graph within ten minutes." }]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `items?: readonly FaqItem[]`
- `multiple?: boolean`
- `contact?: { text: ReactNode; action: { label: string; href: string } } | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Feature Grid

Feature grid with real hierarchy: one bento feature card plus supporting cells, replaceable icons and media.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockFeatureGrid } from "@vfx-ui/react";

export function Features() {
  return (
    <BlockFeatureGrid
      title="Built for the way teams ship."
      items={[
        { title: "A release graph", description: "Deploys, flags and rollbacks on one canvas.", featured: true },
        { title: "Explained flags", description: "Owner, rollout and expiry on every flag." },
      ]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `items?: readonly FeatureGridItem[]`
- `layout?: "bento" | "even"`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Feature Tabs

Feature tabs where list, copy and illustration switch together; WAI-ARIA keyboard pattern, touch-friendly strip on mobile.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockFeatureTabs } from "@vfx-ui/react";

export function Surfaces() {
  return (
    <BlockFeatureTabs
      title="One graph. Three ways to look at it."
      tabs={[
        { label: "Plan", description: "Sketch the release as a graph." },
        { label: "Ship", description: "Flags with staged rollouts." },
      ]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `tabs?: readonly FeatureTab[]`
- `action?: BlockAction | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Gallery

Work gallery grid with hover lift and an optional lightbox — a real dialog with Escape, arrow keys, focus trap and focus restore; generated CSS artwork by default.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockGallery } from "@vfx-ui/react";

export function Demo() {
  return <BlockGallery />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `items?: readonly GalleryItem[]`
- `lightbox?: boolean`
- `closeLabel?: string`
- `previousLabel?: string`
- `nextLabel?: string`
- `demoNote?: ReactNode | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Integrations

Integrations hub with static connection rings of rebrandable tool tiles and an always-available link grid fallback.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockIntegrations } from "@vfx-ui/react";

export function Stack() {
  return (
    <BlockIntegrations
      brand="Orbit"
      title="Plugs into the tools you already trust."
      integrations={[{ name: "GitHub", href: "/integrations/github" }, { name: "Linear", href: "/integrations/linear" }]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `brand?: string`
- `logo?: ReactNode`
- `integrations?: readonly Integration[]`
- `action?: BlockAction | null`
- `layout?: "orbit" | "grid"`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Logos

Customer logo wall: brand tiles that sit desaturated and colorize on hover, as real links with styled wordmarks when no image assets exist.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockLogos } from "@vfx-ui/react";

export function Demo() {
  return <BlockLogos />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `logos?: readonly LogoItem[]`
- `columns?: 3 | 4 | 5 | 6`
- `demoNote?: ReactNode | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Milestones

Milestone progress: completed steps light up in sequence on scroll, the current step breathes, and upcoming steps stay dimmed — all driven by one index.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockMilestones } from "@vfx-ui/react";

export function Demo() {
  return <BlockMilestones />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `milestones?: readonly Milestone[]`
- `current?: number`
- `demoNote?: ReactNode | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Nav

Complete navigation bar: brand, desktop links, actions, and an accessible mobile sheet with Escape handling.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockNav } from "@vfx-ui/react";

export function SiteHeader() {
  return (
    <BlockNav
      brand="Northwind"
      links={[{ label: "Product", href: "#product" }, { label: "Pricing", href: "#pricing" }]}
      action={{ label: "Get started", href: "/start" }}
      sticky
    />
  );
}
```

## Props

- `brand?: string`
- `brandHref?: string`
- `links?: readonly NavLink[]`
- `action?: NavAction | null`
- `secondaryAction?: NavAction | null`
- `sticky?: boolean`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Newsletter

Email signup with working client-side validation, announced inline errors and a confirmation panel; runs in an honestly-labeled demo mode until wired up.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockNewsletter } from "@vfx-ui/react";

export function Demo() {
  return <BlockNewsletter />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `emailLabel?: string`
- `placeholder?: string`
- `submitLabel?: string`
- `invalidEmailMessage?: ReactNode`
- `successTitle?: ReactNode`
- `successNote?: ReactNode`
- `resetLabel?: string`
- `onSubscribe?: (email: string) => void | Promise<void>`
- `demoNote?: ReactNode | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Pricing

Pricing plans with a working monthly/annual switch — amounts, basis lines and savings render from data.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockPricing } from "@vfx-ui/react";

export function Plans() {
  return (
    <BlockPricing
      title="Start free. Scale when the graph does."
      plans={[
        { name: "Solo", priceMonthly: 0, basis: "month", features: ["1 release graph"], cta: { label: "Start free", href: "/start" } },
        { name: "Team", priceMonthly: 24, priceAnnual: 20, featured: true, cta: { label: "Start trial", href: "/trial" } },
      ]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `plans?: readonly PricingPlan[]`
- `periodToggle?: boolean`
- `defaultPeriod?: "monthly" | "annual"`
- `annualNote?: string`
- `footnote?: ReactNode`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Process Steps

Three-to-four step process with a self-drawing connector line and replaceable media per step.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockProcessSteps } from "@vfx-ui/react";

export function HowItWorks() {
  return (
    <BlockProcessSteps
      title="From install to insight in an afternoon."
      steps={[
        { title: "Connect your repos", text: "One OAuth flow, automatic indexing." },
        { title: "Describe a release", text: "The graph assembles itself." },
        { title: "Ship and watch", text: "Staged rollouts with auto-pause." },
      ]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `steps?: readonly ProcessStep[]`
- `action?: { label: string; href: string } | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Quote Wall

Quote wall: many quotes in masonry columns, or one at a time in a rotator with keyboard controls, hover/focus pause and reduced-motion respect.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockQuoteWall } from "@vfx-ui/react";

export function Demo() {
  return <BlockQuoteWall />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `quotes?: readonly WallQuote[]`
- `mode?: "wall" | "rotate"`
- `interval?: number`
- `pauseOnHover?: boolean`
- `previousLabel?: string`
- `nextLabel?: string`
- `carouselLabel?: string`
- `demoNote?: ReactNode | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Scroll Story

Scroll narrative: a sticky scene crossfades as story steps cross the viewport; docks above the steps on mobile.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockScrollStory } from "@vfx-ui/react";

export function Story() {
  return (
    <BlockScrollStory
      title="A release week, told in three scenes."
      steps={[
        { eyebrow: "Monday", title: "Sketch the week.", text: "Drop deploys onto one canvas." },
        { eyebrow: "Wednesday", title: "Ship behind a canary.", text: "Orbit pauses drift for you." },
      ]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `steps?: readonly StoryStep[]`
- `flip?: boolean`
- `interactive?: boolean`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Showcase

Product showcase stage: browser-chrome frame with a replaceable screenshot or video (CSS demo UI by default), headline and actions.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockShowcase } from "@vfx-ui/react";

export function Tour() {
  return (
    <BlockShowcase
      eyebrow="Product tour"
      title="Every launch, in one orbit."
      primaryCta={{ label: "Start free", href: "/start" }}
      media={<img src="/app-screenshot.png" alt="Orbit release dashboard" />}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `primaryCta?: BlockAction | null`
- `secondaryCta?: BlockAction | null`
- `media?: ReactNode`
- `mediaAlt?: string`
- `caption?: ReactNode`
- `interactive?: boolean`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Stats

Stats band: numbers count up from zero on scroll-in with an always-present settled value for screen readers; formatting, prefixes and suffixes are props.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockStats } from "@vfx-ui/react";

export function Demo() {
  return <BlockStats />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `stats?: readonly StatItem[]`
- `demoNote?: ReactNode | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Team

Team cards: avatar (image or auto-generated initials badge), name, role and profile links; the whole card is hoverable and linkable.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockTeam } from "@vfx-ui/react";

export function Demo() {
  return <BlockTeam />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `members?: readonly TeamMember[]`
- `demoNote?: ReactNode | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Testimonials

Testimonials with a featured quote and field notes; fictional demo copy is visibly marked and fully replaceable.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockTestimonials } from "@vfx-ui/react";

export function Voices() {
  return (
    <BlockTestimonials
      title="The teams who ship weekly, talk like this."
      testimonials={[{ quote: "The replay is the status update.", name: "Mara Ellison", role: "Head of Platform, Fieldnote", href: "/customers/fieldnote" }]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `testimonials?: readonly Testimonial[]`
- `demoNote?: ReactNode | null`
- `featured?: boolean`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Block Timeline

Company or product timeline: a rail that draws itself in on scroll, dots lighting up in sequence, alternating sides on wide screens.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockTimeline } from "@vfx-ui/react";

export function Demo() {
  return <BlockTimeline />;
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `events?: readonly TimelineEvent[]`
- `demoNote?: ReactNode | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Caustics Field

Sunlit pool-floor caustics: a crawling net of focused light over deep water.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { CausticsField } from "@vfx-ui/react";

export function Demo() {
  return <CausticsField />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `scale?: number`
- `sharpness?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { CAUSTICS_FIELD_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `CAUSTICS_FIELD_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Chroma Flow

Four-edge liquid color field that floods inward toward the direction the cursor sweeps — fbm-noise bleed boundaries driven by pointer velocity.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { ChromaFlow } from "@vfx-ui/react";

export function Demo() {
  return <ChromaFlow />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `radius?: number`
- `momentum?: number`
- `ambient?: number`
- `baseColor?: string`
- `upColor?: string`
- `downColor?: string`
- `leftColor?: string`
- `rightColor?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { CHROMA_FLOW_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `CHROMA_FLOW_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Chromatic Text

The pointer is the prism: nearby letters split into red and blue fringes over a sliding rainbow.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { ChromaticText } from "@vfx-ui/react";

export function Demo() {
  return <ChromaticText />;
}
```

## Props

- `text?: string`
- `separation?: number`
- `spread?: number`
- `spectrum?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Dust Motes

Dust motes drifting through slanted Tyndall beams in a dark room.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { DustMotes } from "@vfx-ui/react";

export function Demo() {
  return <DustMotes />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `motes?: number`
- `beams?: number`
- `beamWidth?: number`
- `drift?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { DUST_MOTES_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `DUST_MOTES_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Elastic Hover

Rubber around anything you wrap: hover swells, press squashes, and an under-damped spring wobbles it home.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { ElasticHover } from "@vfx-ui/react";

export function Demo() {
  return <ElasticHover />;
}
```

## Props

- `children?: ReactNode`
- `grow?: number`
- `squash?: number`
- `stiffness?: number`
- `damping?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Ember Drift

Sparks rising from a bed of coals, cooling from gold to red through shimmering heat.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { EmberDrift } from "@vfx-ui/react";

export function Demo() {
  return <EmberDrift />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `embers?: number`
- `rise?: number`
- `shimmer?: number`
- `from?: string`
- `to?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { EMBER_DRIFT_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `EMBER_DRIFT_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Example — Product Launch

Complete fictional software launch page ("Orbit" by Lumen Labs): hero, showcase, feature grid, tabs, scroll story, integrations, pricing, testimonials, FAQ, CTA. All copy is demo content.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { ExampleLaunch } from "@vfx-ui/react";

export default function LaunchPage() {
  return <ExampleLaunch />;
}
```

## Props

(see source)

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Example — Design Studio

Complete fictional design-studio service page (Atelier North): daylight editorial hero, engagement steps, portfolio showcase, before/after slider, services grid, fixed-fee engagements, testimonials, FAQ and a typographic footer.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { ExampleStudio } from "@vfx-ui/react";

export default function StudioPage() {
  return <ExampleStudio />;
}
```

## Props

(see source)

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Fiber Flow

Luminous silk fibers streaming through the dark — domain-warped fbm ridge field with pointer parallax (opt-in).

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { FiberFlow } from "@vfx-ui/react";

export function Demo() {
  return <FiberFlow />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `scale?: number`
- `strands?: number`
- `sharp?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { FIBER_FLOW_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `FIBER_FLOW_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Fluid Gradient

Domain-warped fBm noise flowing through a tri-color palette.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { FluidGradient } from "@vfx-ui/react";

export function Demo() {
  return <FluidGradient />;
}
```

## Props

- `speed?: number`
- `warp?: number`
- `scale?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { FLUID_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `FLUID_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Footer Fold

A wordmark printed across hinged paper panels that respond to the pointer.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { FooterFold } from "@vfx-ui/react";

export function Demo() {
  return <FooterFold brand="YOUR BRAND" title="Let’s talk." cta={{ label: "Contact", href: "mailto:hello@example.com" }} groups={[{ label: "Explore", links: [{ label: "About", href: "/about" }] }]} copyright="© Your studio" />;
}
```

## Props

- `color?: string`
- `background?: string`
- `depth?: number`
- `brand?: string (artwork is generated from your text)`
- `title?: ReactNode`
- `description?: ReactNode`
- `cta?: { label: string; href: string } | null`
- `groups?: readonly { label: string; links: readonly { label: string; href: string }[] }[]`
- `legal?: readonly { label: string; href: string }[]`
- `copyright?: ReactNode`
- `children?: ReactNode (replaces introduction and navigation)`
- `interactive?: boolean (default true)`
- `className?: string`
- `style?: CSSProperties (--vfx-footer-display sets the brand font)`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Footer Phosphor

A luminous cell wordmark that disperses around your pointer and settles home.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { FooterPhosphor } from "@vfx-ui/react";

export function Demo() {
  return <FooterPhosphor brand="YOUR BRAND" title="Let’s talk." cta={{ label: "Contact", href: "mailto:hello@example.com" }} groups={[{ label: "Explore", links: [{ label: "About", href: "/about" }] }]} copyright="© Your studio" />;
}
```

## Props

- `color?: string`
- `background?: string`
- `brand?: string (artwork is generated from your text)`
- `title?: ReactNode`
- `description?: ReactNode`
- `cta?: { label: string; href: string } | null`
- `groups?: readonly { label: string; links: readonly { label: string; href: string }[] }[]`
- `legal?: readonly { label: string; href: string }[]`
- `copyright?: ReactNode`
- `children?: ReactNode (replaces introduction and navigation)`
- `interactive?: boolean (default true)`
- `className?: string`
- `style?: CSSProperties (--vfx-footer-display sets the brand font)`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Footer Tidal

Copper tidal lines beneath your brand, with pointer-driven currents.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { FooterTidal } from "@vfx-ui/react";

export function Demo() {
  return <FooterTidal brand="YOUR BRAND" title="Let’s talk." cta={{ label: "Contact", href: "mailto:hello@example.com" }} groups={[{ label: "Explore", links: [{ label: "About", href: "/about" }] }]} copyright="© Your studio" />;
}
```

## Props

- `color?: string`
- `background?: string`
- `animate?: boolean`
- `brand?: string (artwork is generated from your text)`
- `title?: ReactNode`
- `description?: ReactNode`
- `cta?: { label: string; href: string } | null`
- `groups?: readonly { label: string; links: readonly { label: string; href: string }[] }[]`
- `legal?: readonly { label: string; href: string }[]`
- `copyright?: ReactNode`
- `children?: ReactNode (replaces introduction and navigation)`
- `interactive?: boolean (default true)`
- `className?: string`
- `style?: CSSProperties (--vfx-footer-display sets the brand font)`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Footer Vinyl

A record-sleeve footer with a pointer-rotated vinyl and your own label.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { FooterVinyl } from "@vfx-ui/react";

export function Demo() {
  return <FooterVinyl brand="YOUR BRAND" title="Let’s talk." cta={{ label: "Contact", href: "mailto:hello@example.com" }} groups={[{ label: "Explore", links: [{ label: "About", href: "/about" }] }]} copyright="© Your studio" />;
}
```

## Props

- `color?: string`
- `background?: string`
- `labelColor?: string`
- `brand?: string (artwork is generated from your text)`
- `title?: ReactNode`
- `description?: ReactNode`
- `cta?: { label: string; href: string } | null`
- `groups?: readonly { label: string; links: readonly { label: string; href: string }[] }[]`
- `legal?: readonly { label: string; href: string }[]`
- `copyright?: ReactNode`
- `children?: ReactNode (replaces introduction and navigation)`
- `interactive?: boolean (default true)`
- `className?: string`
- `style?: CSSProperties (--vfx-footer-display sets the brand font)`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Glass Card

Thick-cut optical glass with two-interface refraction and studio reflections.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { GlassCard } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><GlassCard interactive /></div>;
}
```

## Props

- `children?: ReactNode`
- `radius?: number`
- `borderGlow?: number`
- `shine?: number`
- `cardScale?: number`
- `tint?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { GLASS_CARD_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `GLASS_CARD_SHADER` — read it to learn how the effect works.

## Notes for agents

- Original ray-marched glass solids over procedural studio scenes; arbitrary DOM behind the canvas is not refracted.
- Requires WebGPU. Provide a sized parent. Existing public prop names and preset IDs remain; visual output has changed.
- Pointer tilts the object. Reduced motion freezes time and disables pointer movement. No demonstration text is baked into the shader.
- Configure the documented component props. For raw uniforms, use the exported shader with VfxCanvas instead.

# Glass Lens

A biconvex glass lens that magnifies and inverts a printed studio scene.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { GlassLens } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><GlassLens interactive /></div>;
}
```

## Props

- `speed?: number`
- `refraction?: number`
- `dispersion?: number`
- `blur?: number`
- `rim?: number`
- `tint?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { GLASS_LENS_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `GLASS_LENS_SHADER` — read it to learn how the effect works.

## Notes for agents

- Original ray-marched glass solids over procedural studio scenes; arbitrary DOM behind the canvas is not refracted.
- Requires WebGPU. Provide a sized parent. Existing public prop names and preset IDs remain; visual output has changed.
- Pointer tilts the object. Reduced motion freezes time and disables pointer movement. No demonstration text is baked into the shader.
- Configure the documented component props. For raw uniforms, use the exported shader with VfxCanvas instead.

# Glass Panel

A broad ray-marched optical slab that carries your own content across a full panel.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { GlassPanel } from "@vfx-ui/react";

export function Demo() {
  return <GlassPanel />;
}
```

## Props

- `children?: ReactNode`
- `radius?: number`
- `borderGlow?: number`
- `shine?: number`
- `panelScale?: number`
- `tint?: string`
- `contentWidth?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { GLASS_PANEL_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `GLASS_PANEL_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Glass Tile

A wall of glass bricks where one shared biconvex lens travels to the hovered tile and bulges through it.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { GlassTile } from "@vfx-ui/react";

export function Demo() {
  return <GlassTile />;
}
```

## Props

- `tiles?: readonly ReactNode[]`
- `columns?: number`
- `gap?: number`
- `tileHeight?: number`
- `tint?: string`
- `refraction?: number`
- `dispersion?: number`
- `rim?: number`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: VfxCanvasProps["fallback"]`

## Shader

WGSL source is exported as `GLASS_TILE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Halo Rings

Concentric rings breathing outward from a luminous core, their edges split into spectral fringes.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HaloRings } from "@vfx-ui/react";

export function Demo() {
  return <HaloRings />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `rings?: number`
- `dispersion?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HALO_RINGS_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `HALO_RINGS_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Aurora Editorial

Drop-in hero section: centered serif editorial masthead under aurora curtains — large display title, two standfirst lines, dual CTAs.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { HeroAuroraEditorial } from "@vfx-ui/react";

export function Demo() {
  return <HeroAuroraEditorial title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `detail?: ReactNode`
- `scheme?: "dark" | "light"`
- `speed?: number`
- `intensity?: number`
- `bands?: number`
- `primary?: string`
- `secondary?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_AURORA_EDITORIAL_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `AURORA_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Aurora

Drop-in hero section: bottom-left copy anchored under full-bleed aurora curtains rendered per-pixel on the GPU.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroAurora } from "@vfx-ui/react";

export function Demo() {
  return <HeroAurora title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `intensity?: number`
- `bands?: number`
- `primary?: string`
- `secondary?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_AURORA_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `AURORA_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Black Hole Cinema

Drop-in hero section: the ray-traced accretion disk letterboxed like a feature film — hard bars top and bottom, title card centered.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { HeroBlackHoleCinema } from "@vfx-ui/react";

export function Demo() {
  return <HeroBlackHoleCinema title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `bars?: string`
- `scheme?: "dark" | "light"`
- `speed?: number`
- `brightness?: number`
- `distance?: number`
- `diskRadius?: number`
- `tilt?: number`
- `doppler?: number`
- `stars?: number`
- `centerX?: number`
- `centerY?: number`
- `centerFade?: number`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_BLACK_HOLE_CINEMA_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `BLACK_HOLE_BAKE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Black Hole

Drop-in hero section: left copy beside a ray-traced accretion disk with relativistic beaming and a lensed star field.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroBlackHole } from "@vfx-ui/react";

export function Demo() {
  return <HeroBlackHole title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `badges?: readonly string[]`
- `scheme?: "dark" | "light"`
- `speed?: number`
- `distance?: number`
- `diskRadius?: number`
- `tilt?: number`
- `brightness?: number`
- `doppler?: number`
- `stars?: number`
- `centerX?: number`
- `centerY?: number`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_BLACK_HOLE_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `BLACK_HOLE_BAKE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Chroma Full

Drop-in hero section: the four-edge chroma field run full-bleed with bottom-left copy in a dusk palette.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { HeroChromaFull } from "@vfx-ui/react";

export function Demo() {
  return <HeroChromaFull title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `radius?: number`
- `momentum?: number`
- `ambient?: number`
- `baseColor?: string`
- `upColor?: string`
- `downColor?: string`
- `leftColor?: string`
- `rightColor?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_CHROMA_FULL_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `CHROMA_FLOW_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Chroma

Drop-in hero section: bottom-left copy over a four-edge liquid color field that floods toward the cursor's sweep direction.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroChroma } from "@vfx-ui/react";

export function Demo() {
  return <HeroChroma title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `radius?: number`
- `momentum?: number`
- `ambient?: number`
- `baseColor?: string`
- `upColor?: string`
- `downColor?: string`
- `leftColor?: string`
- `rightColor?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_CHROMA_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `CHROMA_FLOW_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Contour

A seeded topographic paper landscape that lifts around the pointer.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { HeroContour } from "@vfx-ui/react";

export function Demo() {
  return <HeroContour title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `color?: string`
- `background?: string`
- `seed?: number`
- `relief?: number`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Hero Eclipse

An engraved astronomical dial with a pointer-controlled eclipse.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { HeroEclipse } from "@vfx-ui/react";

export function Demo() {
  return <HeroEclipse title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `color?: string`
- `background?: string`
- `parallax?: number`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Hero Fiber Top

Drop-in hero section: a top-aligned left masthead pressing down on silk fibers streaming through the dark.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { HeroFiberTop } from "@vfx-ui/react";

export function Demo() {
  return <HeroFiberTop title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `intensity?: number`
- `scale?: number`
- `strands?: number`
- `sharp?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_FIBER_TOP_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `FIBER_FLOW_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Fiber

Drop-in hero section: top-weighted headline over luminous silk fibers streaming through the dark.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroFiber } from "@vfx-ui/react";

export function Demo() {
  return <HeroFiber title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `badges?: readonly string[]`
- `scheme?: "dark" | "light"`
- `speed?: number`
- `intensity?: number`
- `scale?: number`
- `strands?: number`
- `sharp?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_FIBER_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `FIBER_FLOW_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Fluid Minimal

Drop-in hero section: one line of copy, one CTA, one liquid gradient — the entire hero for products that can be named in a breath.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { HeroFluidMinimal } from "@vfx-ui/react";

export function Demo() {
  return <HeroFluidMinimal title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `warp?: number`
- `scale?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_FLUID_MINIMAL_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `FLUID_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Fluid

Drop-in hero section: centered headline over a GPU liquid-gradient field with real selectable DOM text, scrim-backed contrast, and a reduced-motion static fallback.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroFluid } from "@vfx-ui/react";

export function Demo() {
  return <HeroFluid title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `warp?: number`
- `scale?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_FLUID_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `FLUID_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Globe

Drop-in split hero: copy on the left, the dot-matrix cobe planet (the globe behind vercel.com) glowing on the right.

## Install

```bash
npm install @vfx-ui/react cobe@^2.0.1
```

```tsx
import { HeroGlobe } from "@vfx-ui/react";

export function Demo() {
  return <HeroGlobe title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `spin?: number`
- `mapSamples?: number`
- `baseColor?: [number, number, number]`
- `markerColor?: [number, number, number]`
- `glowColor?: [number, number, number]`
- `markers?: CobeMarker[]`
- `globeProps?: Record<string, unknown>`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_GLOBE_PRESETS } from "@vfx-ui/react";
```

## Notes for agents

- Rendered with a third-party runtime (see Install dependencies).
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Hero Iridescent

Drop-in hero section: left copy over a holographic thin-film sheen — the premium product-launch look, computed per-pixel.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroIridescent } from "@vfx-ui/react";

export function Demo() {
  return <HeroIridescent title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `scale?: number`
- `hueShift?: number`
- `saturation?: number`
- `brightness?: number`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_IRIDESCENT_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `IRIDESCENT_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Mesh Bold

Drop-in hero section: one oversized ultra-bold slogan over a vivid Voronoi mesh-gradient field — the poster hero.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { HeroMeshBold } from "@vfx-ui/react";

export function Demo() {
  return <HeroMeshBold title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `scale?: number`
- `softness?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `deep?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_MESH_BOLD_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `MESH_GRADIENT_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Mesh

Drop-in hero section: centered headline over a slow Voronoi mesh-gradient field — every frame a different poster.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroMesh } from "@vfx-ui/react";

export function Demo() {
  return <HeroMesh title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `scale?: number`
- `softness?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `deep?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_MESH_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `MESH_GRADIENT_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Particles Badge

Drop-in hero section: a frosted badge row leads a centered headline over a drifting GPU particle field.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { HeroParticlesBadge } from "@vfx-ui/react";

export function Demo() {
  return <HeroParticlesBadge title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `badges?: readonly string[]`
- `scheme?: "dark" | "light"`
- `density?: number`
- `speed?: number`
- `size?: number`
- `color?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_PARTICLES_BADGE_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `PARTICLE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Particles

Drop-in hero section: top-weighted headline with a badge row over a drifting GPU particle field.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroParticles } from "@vfx-ui/react";

export function Demo() {
  return <HeroParticles title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `badges?: readonly string[]`
- `scheme?: "dark" | "light"`
- `density?: number`
- `speed?: number`
- `size?: number`
- `color?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_PARTICLES_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `PARTICLE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Ribbon Left

Drop-in hero section: copy in a left column with a vertical eyebrow rail while the light ribbons read as the right-hand visual.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { HeroRibbonLeft } from "@vfx-ui/react";

export function Demo() {
  return <HeroRibbonLeft title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `intensity?: number`
- `drift?: number`
- `grain?: number`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_RIBBON_LEFT_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `RIBBON_FIELD_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Ribbon

Drop-in split hero: copy left, three Gaussian light ribbons sweeping the right over a dot-matrix grid.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroRibbon } from "@vfx-ui/react";

export function Demo() {
  return <HeroRibbon title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `intensity?: number`
- `drift?: number`
- `grain?: number`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_RIBBON_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `RIBBON_FIELD_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Starfield Split

Drop-in split hero: copy on the left, a frosted badge wall on the right, over a twinkling hashed star grid.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { HeroStarfieldSplit } from "@vfx-ui/react";

export function Demo() {
  return <HeroStarfieldSplit title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `badges?: readonly string[]`
- `scheme?: "dark" | "light"`
- `density?: number`
- `speed?: number`
- `twinkle?: number`
- `color?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_STARFIELD_SPLIT_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `STARFIELD_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Starfield

Drop-in hero section: bottom-left copy under a twinkling hashed star grid with parallax drift.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroStarfield } from "@vfx-ui/react";

export function Demo() {
  return <HeroStarfield title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `density?: number`
- `speed?: number`
- `twinkle?: number`
- `color?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_STARFIELD_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `STARFIELD_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Vortex Centered

Drop-in hero section: a short centered headline resting in the calm eye of a tight, slow spiral galaxy.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { HeroVortexCentered } from "@vfx-ui/react";

export function Demo() {
  return <HeroVortexCentered title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `swirl?: number`
- `arms?: number`
- `coreGlow?: number`
- `color?: string`
- `emission?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_VORTEX_CENTERED_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `VORTEX_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Hero Vortex

Drop-in hero section: centered headline at the eye of a spiral galaxy with star speckles and trailing arms.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { HeroVortex } from "@vfx-ui/react";

export function Demo() {
  return <HeroVortex title="Your next big idea." primaryCta={{ label: "Get started", href: "/start" }} secondaryCta={null} interactive />;
}
```

## Props

- `scheme?: "dark" | "light"`
- `speed?: number`
- `swirl?: number`
- `arms?: number`
- `coreGlow?: number`
- `color?: string`
- `emission?: string`
- `title?: ReactNode`
- `subtitle?: ReactNode`
- `eyebrow?: string`
- `primaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `secondaryCta?: string | { label: string; href?: string; onClick?: MouseEventHandler<HTMLButtonElement> } | null`
- `children?: ReactNode (replaces default content)`
- `interactive?: boolean (default false)`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { HERO_VORTEX_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `VORTEX_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Ink Bloom

Ink drops blooming and feathering into warm paper on staggered cycles.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { InkBloom } from "@vfx-ui/react";

export function Demo() {
  return <InkBloom />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `drops?: number`
- `spread?: number`
- `feather?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { INK_BLOOM_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `INK_BLOOM_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Iridescent

Silky thin-film interference colors drifting across the surface.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { Iridescent } from "@vfx-ui/react";

export function Demo() {
  return <Iridescent />;
}
```

## Props

- `speed?: number`
- `scale?: number`
- `hueShift?: number`
- `saturation?: number`
- `brightness?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { IRIDESCENT_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `IRIDESCENT_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Kinetic Text

A pointer-driven force field lifts your words into a soft wave.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { KineticText } from "@vfx-ui/react";

export function Demo() {
  return <KineticText />;
}
```

## Props

- `text?: string`
- `strength?: number`
- `spread?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Light Prism

A solid beveled optical prism using Vercel’s complete MIT spectral optics and multi-pass glass pipeline.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { LightPrism } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><LightPrism interactive /></div>;
}
```

## Props

- `speed?: number`
- `prismSize?: number`
- `beamWidth?: number`
- `refraction?: number`
- `dispersion?: number`
- `shadow?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { LIGHT_PRISM_PRESETS } from "@vfx-ui/react";
```

## Notes for agents

- Complete Vercel VGPU MIT light pipeline, including beveled solid geometry, spectral optics, environment and wall baking, and multiple glass passes.
- Source and license are bundled. No remote assets. Use a sized parent; pointer changes beam incidence and camera orbit.
- LIGHT_PRISM_SHADER, to and accent are deprecated compatibility exports/props. The live component uses a multi-pass pipeline and optical spectral colors.

# Liquid Glass

A molten glass annulus with a travelling silhouette and spectral transmission.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { LiquidGlass } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><LiquidGlass interactive /></div>;
}
```

## Props

- `speed?: number`
- `distortion?: number`
- `chromatic?: number`
- `scale?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { LIQUID_GLASS_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `LIQUID_GLASS_SHADER` — read it to learn how the effect works.

## Notes for agents

- Original ray-marched glass solids over procedural studio scenes; arbitrary DOM behind the canvas is not refracted.
- Requires WebGPU. Provide a sized parent. Existing public prop names and preset IDs remain; visual output has changed.
- Pointer tilts the object. Reduced motion freezes time and disables pointer movement. No demonstration text is baked into the shader.
- Configure the documented component props. For raw uniforms, use the exported shader with VfxCanvas instead.

# Magnetic Grid

A lattice of dots that feel the pointer's field — sliding, swelling and settling like iron filings.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { MagneticGrid } from "@vfx-ui/react";

export function Demo() {
  return <MagneticGrid />;
}
```

## Props

- `children?: ReactNode`
- `columns?: number`
- `rows?: number`
- `dotSize?: number`
- `strength?: number`
- `radius?: number`
- `mode?: "attract" | "repel"`
- `color?: string`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Magnetic

A gentle magnetic pull for your own buttons, links, and content.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { Magnetic } from "@vfx-ui/react";

export function Demo() {
  return <Magnetic />;
}
```

## Props

- `children?: ReactNode`
- `strength?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Mesh Gradient

Voronoi-cell color fields flowing through a curated palette.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { MeshGradient } from "@vfx-ui/react";

export function Demo() {
  return <MeshGradient />;
}
```

## Props

- `speed?: number`
- `scale?: number`
- `softness?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `deep?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { MESH_GRADIENT_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `MESH_GRADIENT_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Particle Field

Procedural cell-hashed particles with drift and size breathing.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { ParticleField } from "@vfx-ui/react";

export function Demo() {
  return <ParticleField />;
}
```

## Props

- `density?: number`
- `speed?: number`
- `size?: number`
- `color?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { PARTICLE_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `PARTICLE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Plasma Sheet

Molten color currents folding through each other in a double domain-warped field.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { PlasmaSheet } from "@vfx-ui/react";

export function Demo() {
  return <PlasmaSheet />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `scale?: number`
- `warp?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { PLASMA_SHEET_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `PLASMA_SHEET_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Pointer Glow

A handheld light for layouts: the room dims slightly and a warm source follows your pointer over your own content.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { PointerGlow } from "@vfx-ui/react";

export function Demo() {
  return <PointerGlow />;
}
```

## Props

- `children?: ReactNode`
- `radius?: number`
- `intensity?: number`
- `dim?: number`
- `color?: string`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Radiant Dots

Orbital emitters with jump-flooded distance fields and radiance cascades.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { RadiantDots } from "@vfx-ui/react";

export function Demo() {
  return <div style={{ height: 520 }}><RadiantDots interactive /></div>;
}
```

## Props

- `layout?: "orbit" | "grid"`
- `motion?: "wave" | "chase" | "pulse"`
- `color?: string`
- `intensity?: number`
- `speed?: number`
- `interactive?: boolean`
- `animate?: boolean`
- `className?: string`
- `style?: CSSProperties`
- `fallback?: ReactNode`

## Variants

Import the preset bag and spread it into props:

```tsx
import { RADIANT_DOTS_PRESETS } from "@vfx-ui/react";
```

## Notes for agents

- Requires WebGPU. Render a sized parent and provide fallback for unsupported browsers.
- SSR yields an inert decorative canvas; loading/status text belongs in your own DOM.
- Real jump flood, distance field and radiance cascades adapted from Vercel's MIT example, with original orbit/grid arrangements.
- Working field capped at 320px; animation capped at 30fps and suspended offscreen, in hidden tabs and under reduced motion.
- animate=false or speed=0 freezes time; changes to other props still redraw the paused field.

# Ribbon Field

Three Gaussian light ribbons over a dot-matrix grid with bloom and grain — WGSL port of ThreeUI's RibbonField (MIT, Copyright 2026 Meng To).

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { RibbonField } from "@vfx-ui/react";

export function Demo() {
  return <RibbonField />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `drift?: number`
- `grain?: number`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { RIBBON_FIELD_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `RIBBON_FIELD_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Ripple Text

Clicks and taps drop ripples that travel outward through your words; a resting pointer leaves a dimple.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { RippleText } from "@vfx-ui/react";

export function Demo() {
  return <RippleText />;
}
```

## Props

- `text?: string`
- `amplitude?: number`
- `speed?: number`
- `width?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Silk Veil

A draped silk curtain of warped folds with a luster band sweeping the weave.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { SilkVeil } from "@vfx-ui/react";

export function Demo() {
  return <SilkVeil />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `folds?: number`
- `sheen?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { SILK_VEIL_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `SILK_VEIL_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Solar Corona

A boiling sun disk crowned with streaming corona light and polar plumes.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { SolarCorona } from "@vfx-ui/react";

export function Demo() {
  return <SolarCorona />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `rays?: number`
- `corona?: number`
- `granulation?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { SOLAR_CORONA_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `SOLAR_CORONA_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Spectral Card

Holographic light and spatial tilt around your own content.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { SpectralCard } from "@vfx-ui/react";

export function Demo() {
  return <SpectralCard />;
}
```

## Props

- `children?: ReactNode`
- `tilt?: number`
- `glare?: number`
- `radius?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Spectrum Text

A spectral light band flows continuously through your words and leans toward the pointer.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { SpectrumText } from "@vfx-ui/react";

export function Demo() {
  return <SpectrumText />;
}
```

## Props

- `text?: string`
- `speed?: number`
- `bandWidth?: number`
- `colors?: readonly [string, string, string, string]`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Spotlight Card

A card under a torch: the beam follows the pointer to uncover your content from the dark.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { SpotlightCard } from "@vfx-ui/react";

export function Demo() {
  return <SpotlightCard />;
}
```

## Props

- `children?: ReactNode`
- `radius?: number`
- `darkness?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Star Tide

Stars carried on slow luminous waves, flaring as the tide crests.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { StarTide } from "@vfx-ui/react";

export function Demo() {
  return <StarTide />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `density?: number`
- `waveAmp?: number`
- `waveFreq?: number`
- `twinkle?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { STAR_TIDE_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `STAR_TIDE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Starfield

Hashed star grid with twinkle and slow parallax drift.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { Starfield } from "@vfx-ui/react";

export function Demo() {
  return <Starfield />;
}
```

## Props

- `density?: number`
- `speed?: number`
- `twinkle?: number`
- `color?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { STARFIELD_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `STARFIELD_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Terrain Ridge

Layered ridged-noise mountain silhouettes rolling in parallax under a low sun.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { TerrainRidge } from "@vfx-ui/react";

export function Demo() {
  return <TerrainRidge />;
}
```

## Props

- `speed?: number`
- `intensity?: number`
- `layers?: number`
- `ruggedness?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { TERRAIN_RIDGE_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `TERRAIN_RIDGE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Tilt Card

A porcelain card that tilts in space while its specular highlight tracks the pointer across the surface.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { TiltCard } from "@vfx-ui/react";

export function Demo() {
  return <TiltCard />;
}
```

## Props

- `children?: ReactNode`
- `tilt?: number`
- `glare?: number`
- `radius?: number`
- `disabled?: boolean`
- `className?: string`
- `style?: CSSProperties`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.

# Vortex

Spiral galaxy swirl with star speckles and trailing arms.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { Vortex } from "@vfx-ui/react";

export function Demo() {
  return <Vortex />;
}
```

## Props

- `speed?: number`
- `swirl?: number`
- `arms?: number`
- `coreGlow?: number`
- `color?: string`
- `emission?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Variants

Import the preset bag and spread it into props:

```tsx
import { VORTEX_PRESETS } from "@vfx-ui/react";
```

## Shader

WGSL source is exported as `VORTEX_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.

# Wave Background

Three layered sine bands sweeping over a tri-color gradient. GPU-rendered via WebGPU; DOM cannot reproduce it.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

```tsx
import { WaveBackground } from "@vfx-ui/react";

export function Demo() {
  return <WaveBackground />;
}
```

## Props

- `speed?: number`
- `amplitude?: number`
- `frequency?: number`
- `from?: string`
- `to?: string`
- `accent?: string`
- `interactive?: boolean`
- `className?: string`
- `style?: VfxCanvasProps["style"]`
- `fallback?: VfxCanvasProps["fallback"]`

## Shader

WGSL source is exported as `WAVE_SHADER` — read it to learn how the effect works.

## Notes for agents

- Requires a WebGPU-capable browser; the component degrades gracefully otherwise (use the `fallback` prop).
- SSR-safe: rendering on the server produces an inert canvas; init happens on mount.
- `prefers-reduced-motion` freezes animation automatically.
- Uniforms are plain f32 fields; pass them via `uniforms` — no shader edits needed.
