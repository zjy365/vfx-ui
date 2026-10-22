# VFX UI — agent guide

# VFX UI

> Shader-native visual effect components for React, rendered via WebGPU (vgpu).
> Expressive hero and footer sections, GPU backgrounds, and focused DOM interactions for your own content.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
```

## Component catalog

- [Hero Eclipse](https://vfx-ui.com/components/hero-eclipse.md): An astronomical instrument in warm copper. Move the pointer to shift the eclipse and rotate its engraved dial.
- [Hero Contour](https://vfx-ui.com/components/hero-contour.md): A sunlit topographic print. Seed your own landscape and let the paper ridges rise around your pointer.
- [Footer Vinyl](https://vfx-ui.com/components/footer-vinyl.md): A closing track for your website. A grooved record turns with your pointer, framed by a bold pink sleeve.
- [Astra Field](https://vfx-ui.com/components/astra-field.md): A spiral written in starlight. Cool stellar dust, warm distant suns and a luminous core, suspended in a deep blue field.
- [Radiant Dots](https://vfx-ui.com/components/radiant-dots.md): A constellation of light. Each dot emits and occludes, sending soft illumination through a real radiance-cascade field.
- [Footer Tidal](https://vfx-ui.com/components/footer-tidal.md): Copper tidal lines beneath monumental lettering. Move across the footer and reshape the current.
- [Footer Fold](https://vfx-ui.com/components/footer-fold.md): Your wordmark becomes a hinged paper screen. Each panel turns toward the passing pointer.
- [Footer Phosphor](https://vfx-ui.com/components/footer-phosphor.md): A wordmark made of light. Its cells scatter around your pointer and settle back into place.
- [Spectral Card](https://vfx-ui.com/components/spectral-card.md): A touch of iridescence. Real content, spatial tilt, and light that follows you.
- [Kinetic Text](https://vfx-ui.com/components/kinetic-text.md): Letters lift into a soft wave as your cursor passes through.
- [Magnetic](https://vfx-ui.com/components/magnetic.md): Give a button, link, or any small piece of content a gentle pull.
- [Wave Background](https://vfx-ui.com/components/wave-background.md): Three layered sine bands sweeping over a tri-color gradient, rendered fully on the GPU via WebGPU.
- [Fluid Gradient](https://vfx-ui.com/components/fluid-gradient.md): Domain-warped fBm noise flowing through a curated palette — organic liquid color, zero video.
- [Aurora](https://vfx-ui.com/components/aurora.md): Polar-light curtains: fBm-perturbed Gaussian bands drifting across a near-black GPU sky.
- [Starfield](https://vfx-ui.com/components/starfield.md): Hashed star grid with twinkle and slow parallax drift — deep-space depth from one fullscreen pass.
- [Particle Field](https://vfx-ui.com/components/particle-field.md): Procedural cell-hashed particles with drift and size breathing — a living texture, no sprite sheet.
- [Glass Card](https://vfx-ui.com/components/glass-card.md): Thick-cut glass over a printed studio scene. Beveled edges split light while the solid tilts toward your pointer.
- [Liquid Glass](https://vfx-ui.com/components/liquid-glass.md): A molten glass loop. Travelling waves reshape its silhouette and the image transmitted through it.
- [Glass Lens](https://vfx-ui.com/components/glass-lens.md): A biconvex lens: magnification through the center, inversion at the edges, and fine spectral fringes.
- [Black Hole](https://vfx-ui.com/components/black-hole.md): The vgpu optimized-black-hole example as a drop-in component: a baked null-geodesic G-buffer, 4×4 photon-ring AA, animated disk shading, and HDR bloom — a verbatim port of the official pipeline (MIT, Vercel).
- [Mesh Gradient](https://vfx-ui.com/components/mesh-gradient.md): Voronoi-cell color fields flowing through a curated palette — the classic mesh-gradient look, live on the GPU.
- [Iridescent](https://vfx-ui.com/components/iridescent.md): Thin-film interference colors drifting as silk — cosine-palette holography in a single pass.
- [Vortex](https://vfx-ui.com/components/vortex.md): Spiral galaxy with logarithmic arms, hashed starlight and a breathing core.
- [Ribbon Field](https://vfx-ui.com/components/ribbon-field.md): Three Gaussian light ribbons drifting over a dot-matrix grid with bloom cores and film grain — WGSL port of ThreeUI's RibbonField (MIT).
- [Fiber Flow](https://vfx-ui.com/components/fiber-flow.md): Luminous silk fibers streaming through the dark — a domain-warped fbm ridge field with strands that ebb and flow, pointer parallax and a soft cursor glow. Original vfx-ui design.
- [Light Prism](https://vfx-ui.com/components/light-prism.md): A solid optical prism with internal reflections, spectral caustics and a textured light field. Powered by Vercel’s complete MIT prism pipeline.
- [Hero Fluid](https://vfx-ui.com/components/hero-fluid.md): Drop-in hero: centered headline over a GPU liquid-gradient field with real selectable text and scrim-backed contrast.
- [Hero Aurora](https://vfx-ui.com/components/hero-aurora.md): Drop-in hero: bottom-left copy anchored under full-bleed aurora curtains rendered per-pixel on the GPU.
- [Hero Fiber](https://vfx-ui.com/components/hero-fiber.md): Drop-in hero: top-weighted headline over luminous silk fibers streaming through the dark.
- [Hero Globe](https://vfx-ui.com/components/hero-globe.md): Drop-in split hero: copy on the left, the dot-matrix cobe planet (the globe behind vercel.com) glowing on the right.
- [Hero Mesh](https://vfx-ui.com/components/hero-mesh.md): Drop-in hero: centered headline over a slow Voronoi mesh-gradient field — every frame a different poster.
- [Hero Iridescent](https://vfx-ui.com/components/hero-iridescent.md): Drop-in hero: left copy over a holographic thin-film sheen — the premium product-launch look.
- [Hero Vortex](https://vfx-ui.com/components/hero-vortex.md): Drop-in hero: centered headline at the eye of a spiral galaxy with star speckles and trailing arms.
- [Hero Ribbon](https://vfx-ui.com/components/hero-ribbon.md): Drop-in split hero: copy left, three Gaussian light ribbons sweeping the right over a dot-matrix grid.
- [Hero Particles](https://vfx-ui.com/components/hero-particles.md): Drop-in hero: top-weighted headline with a badge row over a drifting GPU particle field.
- [Hero Starfield](https://vfx-ui.com/components/hero-starfield.md): Drop-in hero: bottom-left copy under a twinkling hashed star grid with parallax drift.
- [Hero Black Hole](https://vfx-ui.com/components/hero-black-hole.md): Drop-in hero: left copy beside a ray-traced accretion disk with relativistic beaming and a lensed star field.
- [Chroma Flow](https://vfx-ui.com/components/chroma-flow.md): Four-edge liquid color field on a midnight base — the palette sloshes from the edges in whichever direction the cursor sweeps. Original vfx-ui design.
- [Hero Chroma](https://vfx-ui.com/components/hero-chroma.md): Drop-in hero section: bottom-left copy over a four-edge liquid color field that floods toward the cursor's sweep direction.
- [Block Nav](https://vfx-ui.com/components/block-nav.md): Complete navigation bar: brand, desktop links, actions, and an accessible mobile sheet. Sticky variant gains a scrim once the page scrolls.
- [Block Showcase](https://vfx-ui.com/components/block-showcase.md): Product showcase stage: browser-chrome frame with a replaceable screenshot or video (built-in CSS demo screen by default), headline and actions, with a gentle pointer tilt.
- [Block Feature Grid](https://vfx-ui.com/components/block-feature-grid.md): Feature grid with real hierarchy: one bento feature card with media plus supporting cells. Icons, media, links and copy all replaceable.
- [Block Feature Tabs](https://vfx-ui.com/components/block-feature-tabs.md): Feature tabs where the list, copy and illustration switch together. WAI-ARIA tabs pattern with arrow keys; a scrollable strip above the stage on touch layouts.
- [Block Scroll Story](https://vfx-ui.com/components/block-scroll-story.md): Scroll narrative: a sticky scene crossfades as story steps cross the viewport center; on small screens the scene docks above the steps so the story reads end to end.
- [Block Process Steps](https://vfx-ui.com/components/block-process-steps.md): Three-to-four step process with numbered badges and a connector line that draws itself in on scroll; vertical timeline on narrow screens, replaceable media per step.
- [Block Integrations](https://vfx-ui.com/components/block-integrations.md): Integrations hub: your product at the center of two connection rings of rebrandable tool tiles, with an always-available link grid below and on touch layouts.
- [Block Comparison](https://vfx-ui.com/components/block-comparison.md): Before/after comparison with a draggable reveal handle — keyboard (arrow keys, Home/End), touch and screen readers all work because the handle is a real range input.
- [Block Testimonials](https://vfx-ui.com/components/block-testimonials.md): Testimonials with a featured quote plus a field-note grid. The built-in quotes are fictional and visibly marked — swap in real customers via props and clear the marker.
- [Block Pricing](https://vfx-ui.com/components/block-pricing.md): Pricing plans with a working monthly/annual switch: amounts, billing basis and the savings pill all render from data, so the toggle can never lie. No payment backend.
- [Block FAQ](https://vfx-ui.com/components/block-faq.md): FAQ accordion with real disclosure semantics: buttons + aria-expanded/controls, arrow-key traversal, CSS grid-rows height animation, long answers with links and lists welcome.
- [Block CTA](https://vfx-ui.com/components/block-cta.md): Closing call to action: headline, supporting copy, primary and secondary actions and a replaceable brand visual layer — a concentric line artwork by default, any background component or media if you pass one.
- [Example — Product Launch](https://vfx-ui.com/components/example-launch.md): Complete fictional software launch page (“Orbit” by Lumen Labs): hero, showcase, feature grid, tabs, scroll story, integrations, pricing, testimonials, FAQ, CTA and footer. All copy is demo content.
- [Example — Design Studio](https://vfx-ui.com/components/example-studio.md): Complete fictional design-studio page (Atelier North): daylight editorial hero, engagement steps, portfolio showcase, before/after slider, services grid, fixed-fee engagements, testimonials, FAQ and a typographic footer.
- [Ember Drift](https://vfx-ui.com/components/ember-drift.md): Sparks rising from a bed of coals, cooling from gold to red through shimmering heat — two cell-hashed ember layers under an fbm thermal warp.
- [Caustics Field](https://vfx-ui.com/components/caustics-field.md): Sunlit pool-floor caustics dancing over deep water — a jittered-grid Voronoi net of focused light in three stacked octaves, with drifting silt motes.
- [Halo Rings](https://vfx-ui.com/components/halo-rings.md): Concentric light rings breathing outward from a luminous core, each sampled at three radii so the band edges split into spectral fringes like light through a prism.
- [Terrain Ridge](https://vfx-ui.com/components/terrain-ridge.md): Layered ridged-fbm mountain silhouettes in parallax drift — ridgelines recede into haze, each scrolling at its own speed, under a low sun that rims the nearest crest.
- [Silk Veil](https://vfx-ui.com/components/silk-veil.md): A draped silk curtain with a sheen band sweeping across it — domain-warped folds shaded anisotropically like cloth-of-gold, with fine weave grain.
- [Plasma Sheet](https://vfx-ui.com/components/plasma-sheet.md): Molten color currents folding through each other — two chained domain warps advect and fold the field so colors stir like dense dye, with filament highlights on the fold edges.
- [Star Tide](https://vfx-ui.com/components/star-tide.md): A field of stars drifting on slow luminous waves — two hashed star grids ride a shared interference field so the whole sky visibly sloshes like a tide.
- [Ink Bloom](https://vfx-ui.com/components/ink-bloom.md): Ink drops blooming and feathering across wet paper — each front is an fbm-perturbed radius, denser at the core and ring-deposited at the edge, paling as it ages. Light paper base.
- [Solar Corona](https://vfx-ui.com/components/solar-corona.md): A blazing sun disk crowned with streaming corona light — a limb-darkened photosphere with boiling granulation, red-shifted rim, fbm streamers and long polar plumes over a star field.
- [Dust Motes](https://vfx-ui.com/components/dust-motes.md): Dust motes drifting through slanted Tyndall light beams — parallel volumetric shafts whose width and brightness breathe with fbm, over a shadowed room.
- [Hero Aurora Editorial](https://vfx-ui.com/components/hero-aurora-editorial.md): Drop-in hero: a centered serif masthead — display title, two standfirst lines, dual CTAs — under full-bleed aurora curtains, with a radial scrim holding WCAG AA contrast.
- [Hero Starfield Split](https://vfx-ui.com/components/hero-starfield-split.md): Drop-in split hero: copy left, a badge wall in frosted chips right, so the twinkling star grid reads as the trust-panel backdrop.
- [Hero Vortex Centered](https://vfx-ui.com/components/hero-vortex-centered.md): Drop-in hero: the eye-of-the-storm cut — a tighter, slower spiral whose bright core lands exactly behind a short centered headline.
- [Hero Mesh Bold](https://vfx-ui.com/components/hero-mesh-bold.md): Drop-in hero: the poster cut — one oversized ultra-bold headline shouting over a vivid Voronoi mesh field. Keep the title short; the type is drawn to fill the frame.
- [Hero Fiber Top](https://vfx-ui.com/components/hero-fiber-top.md): Drop-in hero: a left-set masthead pressed against the top edge while the silk-fiber field streams beneath it — fibers carry the lower two-thirds, the scrim carries the type.
- [Hero Chroma Full](https://vfx-ui.com/components/hero-chroma-full.md): Drop-in hero: the full-bleed cut — the four-edge chroma field runs wall to wall with copy anchored bottom-left over the side scrim, a dusk palette by default.
- [Hero Black Hole Cinema](https://vfx-ui.com/components/hero-black-hole-cinema.md): Drop-in hero: the cinema cut — hard letterbox bars top and bottom, the accretion disk framed like a feature film, and your title card centered in the quiet band.
- [Hero Particles Badge](https://vfx-ui.com/components/hero-particles-badge.md): Drop-in hero: the badge-first cut — trust chips lead the stack at the very top on their own frosted backing, then a centered headline over the drifting particle field.
- [Hero Ribbon Left](https://vfx-ui.com/components/hero-ribbon-left.md): Drop-in hero: the mirrored cut — copy left with a vertical eyebrow rail along its edge, three Gaussian light ribbons sweeping the right over a dot-matrix grid.
- [Hero Fluid Minimal](https://vfx-ui.com/components/hero-fluid-minimal.md): Drop-in hero: the minimal cut — one line of copy, one CTA, one liquid gradient. The entire hero for products that can be named in a breath.
- [Glass Panel](https://vfx-ui.com/components/glass-panel.md): An original ray-marched optical slab built to carry content: beveled edges split light while the solid tilts toward your pointer, and real DOM content rides above it.
- [Glass Tile](https://vfx-ui.com/components/glass-tile.md): A wall of glass bricks on the shared optical pipeline: one biconvex lens lives in a layer that travels to the hovered brick and bulges through it — a single renderer, however many bricks.
- [Chromatic Text](https://vfx-ui.com/components/chromatic-text.md): The pointer is the prism: letters near the cursor split into red and blue fringes while the rainbow underneath slides with it.
- [Ripple Text](https://vfx-ui.com/components/ripple-text.md): Type you can touch: a click (or tap) drops a ripple that travels outward through the letters, and a resting pointer leaves a soft dimple.
- [Spectrum Text](https://vfx-ui.com/components/spectrum-text.md): A ribbon of daylight sliding through the words: one spectral gradient flows continuously across the type and leans toward the pointer.
- [Tilt Card](https://vfx-ui.com/components/tilt-card.md): A porcelain card on a gimbal: the surface tilts in space while a specular highlight tracks the pointer across it.
- [Pointer Glow](https://vfx-ui.com/components/pointer-glow.md): A handheld light for layouts: the region dims slightly and a warm source follows the pointer, brightening whatever it rests on.
- [Spotlight Card](https://vfx-ui.com/components/spotlight-card.md): A card played under a torch: a soft pool of light rests at the center, then follows the pointer to uncover what is written there.
- [Elastic Hover](https://vfx-ui.com/components/elastic-hover.md): Rubber around whatever you wrap: hovering swells it, pressing squashes it wide, and an under-damped spring snaps it back with a wobble.
- [Magnetic Grid](https://vfx-ui.com/components/magnetic-grid.md): A lattice of iron filings for the cursor: each dot feels the pointer's field, slides and swells as it passes, and settles back when it leaves.
- [Block Logos](https://vfx-ui.com/components/block-logos.md): Customer logo wall: a hairline grid of brand tiles that sit desaturated until hover. Real marks via logo (img or inline svg) or styled wordmarks — no assets required.
- [Block Stats](https://vfx-ui.com/components/block-stats.md): Stats band where every number counts up from zero on scroll-in, with a settled, screen-reader-friendly final value always present. Prefixes, suffixes and formatting are props.
- [Block Team](https://vfx-ui.com/components/block-team.md): Team grid: cards with an avatar (your image node or an auto-generated initials badge), name, role and profile links. Names can link out.
- [Block Gallery](https://vfx-ui.com/components/block-gallery.md): Work gallery: a responsive grid of tiles that lift on hover, with an optional lightbox — a real dialog (focus moves in, Escape closes, arrows navigate, Tab stays trapped, focus returns).
- [Block Timeline](https://vfx-ui.com/components/block-timeline.md): Company or product timeline: a vertical rail that draws itself in on scroll, alternating left/right on wide screens and collapsing to one rail on small ones.
- [Block Newsletter](https://vfx-ui.com/components/block-newsletter.md): Newsletter signup that is a working form, not a mockup: client-side validation with inline announced errors, and a confirmation panel on success. Wire onSubscribe; without it, demo mode says so on screen.
- [Block Contact](https://vfx-ui.com/components/block-contact.md): Contact section: a direct-channels list (email, phone, office — real links) beside a configurable form skeleton with labels wired to inputs and native validation intact.
- [Block Banner](https://vfx-ui.com/components/block-banner.md): Announcement banner: a slim accent-tinted strip for one important message with an optional action. Dismissible for real — labeled button, Escape works, onDismiss persists the choice.
- [Block Milestones](https://vfx-ui.com/components/block-milestones.md): Milestone progress: a roadmap strip whose completed steps light up in sequence on scroll-in, the current step breathes, and upcoming steps stay dimmed. Which steps are done is pure data.
- [Block Quote Wall](https://vfx-ui.com/components/block-quote-wall.md): Quote wall: many quotes as a masonry wall, or one at a time in a keyboard-friendly rotator (real prev/next controls, focus and hover pause, reduced motion disables auto-advance).

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

A spiral written in starlight. Cool stellar dust, warm distant suns and a luminous core, suspended in a deep blue field.

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

Polar-light curtains: fBm-perturbed Gaussian bands drifting across a near-black GPU sky.

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

The vgpu optimized-black-hole example as a drop-in component: a baked null-geodesic G-buffer, 4×4 photon-ring AA, animated disk shading, and HDR bloom — a verbatim port of the official pipeline (MIT, Vercel).

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

Announcement banner: a slim accent-tinted strip for one important message with an optional action. Dismissible for real — labeled button, Escape works, onDismiss persists the choice.

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

Before/after comparison with a draggable reveal handle — keyboard (arrow keys, Home/End), touch and screen readers all work because the handle is a real range input.

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

Contact section: a direct-channels list (email, phone, office — real links) beside a configurable form skeleton with labels wired to inputs and native validation intact.

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

Closing call to action: headline, supporting copy, primary and secondary actions and a replaceable brand visual layer — a concentric line artwork by default, any background component or media if you pass one.

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

FAQ accordion with real disclosure semantics: buttons + aria-expanded/controls, arrow-key traversal, CSS grid-rows height animation, long answers with links and lists welcome.

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

Feature grid with real hierarchy: one bento feature card with media plus supporting cells. Icons, media, links and copy all replaceable.

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

Feature tabs where the list, copy and illustration switch together. WAI-ARIA tabs pattern with arrow keys; a scrollable strip above the stage on touch layouts.

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

Work gallery: a responsive grid of tiles that lift on hover, with an optional lightbox — a real dialog (focus moves in, Escape closes, arrows navigate, Tab stays trapped, focus returns).

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

Integrations hub: your product at the center of two connection rings of rebrandable tool tiles, with an always-available link grid below and on touch layouts.

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

Customer logo wall: a hairline grid of brand tiles that sit desaturated until hover. Real marks via logo (img or inline svg) or styled wordmarks — no assets required.

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

Milestone progress: a roadmap strip whose completed steps light up in sequence on scroll-in, the current step breathes, and upcoming steps stay dimmed. Which steps are done is pure data.

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

Complete navigation bar: brand, desktop links, actions, and an accessible mobile sheet. Sticky variant gains a scrim once the page scrolls.

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

Newsletter signup that is a working form, not a mockup: client-side validation with inline announced errors, and a confirmation panel on success. Wire onSubscribe; without it, demo mode says so on screen.

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

Pricing plans with a working monthly/annual switch: amounts, billing basis and the savings pill all render from data, so the toggle can never lie. No payment backend.

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

Three-to-four step process with numbered badges and a connector line that draws itself in on scroll; vertical timeline on narrow screens, replaceable media per step.

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

Quote wall: many quotes as a masonry wall, or one at a time in a keyboard-friendly rotator (real prev/next controls, focus and hover pause, reduced motion disables auto-advance).

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

Scroll narrative: a sticky scene crossfades as story steps cross the viewport center; on small screens the scene docks above the steps so the story reads end to end.

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

Product showcase stage: browser-chrome frame with a replaceable screenshot or video (built-in CSS demo screen by default), headline and actions, with a gentle pointer tilt.

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

Stats band where every number counts up from zero on scroll-in, with a settled, screen-reader-friendly final value always present. Prefixes, suffixes and formatting are props.

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

Team grid: cards with an avatar (your image node or an auto-generated initials badge), name, role and profile links. Names can link out.

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

Testimonials with a featured quote plus a field-note grid. The built-in quotes are fictional and visibly marked — swap in real customers via props and clear the marker.

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

Company or product timeline: a vertical rail that draws itself in on scroll, alternating left/right on wide screens and collapsing to one rail on small ones.

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

Sunlit pool-floor caustics dancing over deep water — a jittered-grid Voronoi net of focused light in three stacked octaves, with drifting silt motes.

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

Four-edge liquid color field on a midnight base — the palette sloshes from the edges in whichever direction the cursor sweeps. Original vfx-ui design.

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

The pointer is the prism: letters near the cursor split into red and blue fringes while the rainbow underneath slides with it.

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

Dust motes drifting through slanted Tyndall light beams — parallel volumetric shafts whose width and brightness breathe with fbm, over a shadowed room.

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

Rubber around whatever you wrap: hovering swells it, pressing squashes it wide, and an under-damped spring snaps it back with a wobble.

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

Sparks rising from a bed of coals, cooling from gold to red through shimmering heat — two cell-hashed ember layers under an fbm thermal warp.

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

Complete fictional software launch page (“Orbit” by Lumen Labs): hero, showcase, feature grid, tabs, scroll story, integrations, pricing, testimonials, FAQ, CTA and footer. All copy is demo content.

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

Complete fictional design-studio page (Atelier North): daylight editorial hero, engagement steps, portfolio showcase, before/after slider, services grid, fixed-fee engagements, testimonials, FAQ and a typographic footer.

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

Luminous silk fibers streaming through the dark — a domain-warped fbm ridge field with strands that ebb and flow, pointer parallax and a soft cursor glow. Original vfx-ui design.

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

Domain-warped fBm noise flowing through a curated palette — organic liquid color, zero video.

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

Your wordmark becomes a hinged paper screen. Each panel turns toward the passing pointer.

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

A wordmark made of light. Its cells scatter around your pointer and settle back into place.

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

Copper tidal lines beneath monumental lettering. Move across the footer and reshape the current.

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

A closing track for your website. A grooved record turns with your pointer, framed by a bold pink sleeve.

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

Thick-cut glass over a printed studio scene. Beveled edges split light while the solid tilts toward your pointer.

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

A biconvex lens: magnification through the center, inversion at the edges, and fine spectral fringes.

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

An original ray-marched optical slab built to carry content: beveled edges split light while the solid tilts toward your pointer, and real DOM content rides above it.

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

A wall of glass bricks on the shared optical pipeline: one biconvex lens lives in a layer that travels to the hovered brick and bulges through it — a single renderer, however many bricks.

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

Concentric light rings breathing outward from a luminous core, each sampled at three radii so the band edges split into spectral fringes like light through a prism.

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

Drop-in hero: a centered serif masthead — display title, two standfirst lines, dual CTAs — under full-bleed aurora curtains, with a radial scrim holding WCAG AA contrast.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
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

Drop-in hero: bottom-left copy anchored under full-bleed aurora curtains rendered per-pixel on the GPU.

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

Drop-in hero: the cinema cut — hard letterbox bars top and bottom, the accretion disk framed like a feature film, and your title card centered in the quiet band.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
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

Drop-in hero: left copy beside a ray-traced accretion disk with relativistic beaming and a lensed star field.

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

Drop-in hero: the full-bleed cut — the four-edge chroma field runs wall to wall with copy anchored bottom-left over the side scrim, a dusk palette by default.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
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

A sunlit topographic print. Seed your own landscape and let the paper ridges rise around your pointer.

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

An astronomical instrument in warm copper. Move the pointer to shift the eclipse and rotate its engraved dial.

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

Drop-in hero: a left-set masthead pressed against the top edge while the silk-fiber field streams beneath it — fibers carry the lower two-thirds, the scrim carries the type.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
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

Drop-in hero: top-weighted headline over luminous silk fibers streaming through the dark.

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

Drop-in hero: the minimal cut — one line of copy, one CTA, one liquid gradient. The entire hero for products that can be named in a breath.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
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

Drop-in hero: centered headline over a GPU liquid-gradient field with real selectable text and scrim-backed contrast.

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

Drop-in hero: left copy over a holographic thin-film sheen — the premium product-launch look.

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

Drop-in hero: the poster cut — one oversized ultra-bold headline shouting over a vivid Voronoi mesh field. Keep the title short; the type is drawn to fill the frame.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
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

Drop-in hero: centered headline over a slow Voronoi mesh-gradient field — every frame a different poster.

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

Drop-in hero: the badge-first cut — trust chips lead the stack at the very top on their own frosted backing, then a centered headline over the drifting particle field.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
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

Drop-in hero: top-weighted headline with a badge row over a drifting GPU particle field.

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

Drop-in hero: the mirrored cut — copy left with a vertical eyebrow rail along its edge, three Gaussian light ribbons sweeping the right over a dot-matrix grid.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
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

Drop-in split hero: copy left, a badge wall in frosted chips right, so the twinkling star grid reads as the trust-panel backdrop.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
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

Drop-in hero: bottom-left copy under a twinkling hashed star grid with parallax drift.

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

Drop-in hero: the eye-of-the-storm cut — a tighter, slower spiral whose bright core lands exactly behind a short centered headline.

## Install

```bash
npm install @vfx-ui/react vgpu@0.3.1
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

Drop-in hero: centered headline at the eye of a spiral galaxy with star speckles and trailing arms.

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

Ink drops blooming and feathering across wet paper — each front is an fbm-perturbed radius, denser at the core and ring-deposited at the edge, paling as it ages. Light paper base.

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

Thin-film interference colors drifting as silk — cosine-palette holography in a single pass.

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

Letters lift into a soft wave as your cursor passes through.

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

A solid optical prism with internal reflections, spectral caustics and a textured light field. Powered by Vercel’s complete MIT prism pipeline.

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

A molten glass loop. Travelling waves reshape its silhouette and the image transmitted through it.

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

A lattice of iron filings for the cursor: each dot feels the pointer's field, slides and swells as it passes, and settles back when it leaves.

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

Give a button, link, or any small piece of content a gentle pull.

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

Voronoi-cell color fields flowing through a curated palette — the classic mesh-gradient look, live on the GPU.

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

Procedural cell-hashed particles with drift and size breathing — a living texture, no sprite sheet.

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

Molten color currents folding through each other — two chained domain warps advect and fold the field so colors stir like dense dye, with filament highlights on the fold edges.

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

A handheld light for layouts: the region dims slightly and a warm source follows the pointer, brightening whatever it rests on.

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

A constellation of light. Each dot emits and occludes, sending soft illumination through a real radiance-cascade field.

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

Three Gaussian light ribbons drifting over a dot-matrix grid with bloom cores and film grain — WGSL port of ThreeUI's RibbonField (MIT).

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

Type you can touch: a click (or tap) drops a ripple that travels outward through the letters, and a resting pointer leaves a soft dimple.

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

A draped silk curtain with a sheen band sweeping across it — domain-warped folds shaded anisotropically like cloth-of-gold, with fine weave grain.

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

A blazing sun disk crowned with streaming corona light — a limb-darkened photosphere with boiling granulation, red-shifted rim, fbm streamers and long polar plumes over a star field.

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

A touch of iridescence. Real content, spatial tilt, and light that follows you.

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

A ribbon of daylight sliding through the words: one spectral gradient flows continuously across the type and leans toward the pointer.

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

A card played under a torch: a soft pool of light rests at the center, then follows the pointer to uncover what is written there.

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

A field of stars drifting on slow luminous waves — two hashed star grids ride a shared interference field so the whole sky visibly sloshes like a tide.

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

Hashed star grid with twinkle and slow parallax drift — deep-space depth from one fullscreen pass.

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

Layered ridged-fbm mountain silhouettes in parallax drift — ridgelines recede into haze, each scrolling at its own speed, under a low sun that rims the nearest crest.

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

A porcelain card on a gimbal: the surface tilts in space while a specular highlight tracks the pointer across it.

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

Spiral galaxy with logarithmic arms, hashed starlight and a breathing core.

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

Three layered sine bands sweeping over a tri-color gradient, rendered fully on the GPU via WebGPU.

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
