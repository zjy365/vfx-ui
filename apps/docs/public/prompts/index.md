---
count: 93
generatedBy: scripts/generate-prompts.mjs
install: npx shadcn@latest add https://vfx-ui.com/r/<name>.json
---

# VFX UI — AI builder prompt index

One paste-ready prompt per component (93 total). Each prompt tells an AI builder (Lovable, v0, bolt.new) to install the component with the shadcn CLI, render it correctly, and customize it through props. Start at [prompts/README.md](README.md) for how to use them.

| Prompt | Title | Category | What it does |
| --- | --- | --- | --- |
| [`hero-eclipse.md`](hero-eclipse.md) | Hero Eclipse | Heroes | An engraved astronomical dial with a pointer-controlled eclipse. |
| [`hero-contour.md`](hero-contour.md) | Hero Contour | Heroes | A seeded topographic paper landscape that lifts around the pointer. |
| [`footer-vinyl.md`](footer-vinyl.md) | Footer Vinyl | Footers | A record-sleeve footer with a pointer-rotated vinyl and your own label. |
| [`astra-field.md`](astra-field.md) | Astra Field | Backgrounds | A rotatable spiral galaxy of glowing stars. |
| [`radiant-dots.md`](radiant-dots.md) | Radiant Dots | Backgrounds | Orbital emitters with jump-flooded distance fields and radiance cascades. |
| [`footer-tidal.md`](footer-tidal.md) | Footer Tidal | Footers | Copper tidal lines beneath your brand, with pointer-driven currents. |
| [`footer-fold.md`](footer-fold.md) | Footer Fold | Footers | A wordmark printed across hinged paper panels that respond to the pointer. |
| [`footer-phosphor.md`](footer-phosphor.md) | Footer Phosphor | Footers | A luminous cell wordmark that disperses around your pointer and settles home. |
| [`spectral-card.md`](spectral-card.md) | Spectral Card | Interactions | Holographic light and spatial tilt around your own content. |
| [`kinetic-text.md`](kinetic-text.md) | Kinetic Text | Text | A pointer-driven force field lifts your words into a soft wave. |
| [`magnetic.md`](magnetic.md) | Magnetic | Interactions | A gentle magnetic pull for your own buttons, links, and content. |
| [`wave-background.md`](wave-background.md) | Wave Background | Backgrounds | Three layered sine bands sweeping over a tri-color gradient. GPU-rendered via WebGPU; DOM cannot reproduce it. |
| [`fluid-gradient.md`](fluid-gradient.md) | Fluid Gradient | Backgrounds | Domain-warped fBm noise flowing through a tri-color palette. |
| [`aurora.md`](aurora.md) | Aurora | Backgrounds | Vertical light curtains driven by fBm perturbation and gaussian bands. |
| [`starfield.md`](starfield.md) | Starfield | Backgrounds | Hashed star grid with twinkle and slow parallax drift. |
| [`particle-field.md`](particle-field.md) | Particle Field | Backgrounds | Procedural cell-hashed particles with drift and size breathing. |
| [`glass-card.md`](glass-card.md) | Glass Card | Glass | Thick-cut optical glass with two-interface refraction and studio reflections. |
| [`liquid-glass.md`](liquid-glass.md) | Liquid Glass | Glass | A molten glass annulus with a travelling silhouette and spectral transmission. |
| [`glass-lens.md`](glass-lens.md) | Glass Lens | Glass | A biconvex glass lens that magnifies and inverts a printed studio scene. |
| [`black-hole.md`](black-hole.md) | Black Hole | Backgrounds | The vgpu optimized-black-hole pipeline as a component: baked null-geodesic G-buffer, HDR bloom, prefiltered lensed star field, Doppler beaming — a verbatim port (MIT, Vercel). |
| [`mesh-gradient.md`](mesh-gradient.md) | Mesh Gradient | Backgrounds | Voronoi-cell color fields flowing through a curated palette. |
| [`iridescent.md`](iridescent.md) | Iridescent | Backgrounds | Silky thin-film interference colors drifting across the surface. |
| [`vortex.md`](vortex.md) | Vortex | Backgrounds | Spiral galaxy swirl with star speckles and trailing arms. |
| [`ribbon-field.md`](ribbon-field.md) | Ribbon Field | Backgrounds | Three Gaussian light ribbons over a dot-matrix grid with bloom and grain — WGSL port of ThreeUI's RibbonField (MIT, Copyright 2026 Meng To). |
| [`fiber-flow.md`](fiber-flow.md) | Fiber Flow | Backgrounds | Luminous silk fibers streaming through the dark — domain-warped fbm ridge field with pointer parallax (opt-in). |
| [`light-prism.md`](light-prism.md) | Light Prism | Glass | A solid beveled optical prism using Vercel’s complete MIT spectral optics and multi-pass glass pipeline. |
| [`hero-fluid.md`](hero-fluid.md) | Hero Fluid | Heroes | Drop-in hero section: centered headline over a GPU liquid-gradient field with real selectable DOM text, scrim-backed contrast, and a reduced-motion static fallback. |
| [`hero-aurora.md`](hero-aurora.md) | Hero Aurora | Heroes | Drop-in hero section: bottom-left copy anchored under full-bleed aurora curtains rendered per-pixel on the GPU. |
| [`hero-fiber.md`](hero-fiber.md) | Hero Fiber | Heroes | Drop-in hero section: top-weighted headline over luminous silk fibers streaming through the dark. |
| [`hero-globe.md`](hero-globe.md) | Hero Globe | Heroes | Drop-in split hero: copy on the left, the dot-matrix cobe planet (the globe behind vercel.com) glowing on the right. |
| [`hero-mesh.md`](hero-mesh.md) | Hero Mesh | Heroes | Drop-in hero section: centered headline over a slow Voronoi mesh-gradient field — every frame a different poster. |
| [`hero-iridescent.md`](hero-iridescent.md) | Hero Iridescent | Heroes | Drop-in hero section: left copy over a holographic thin-film sheen — the premium product-launch look, computed per-pixel. |
| [`hero-vortex.md`](hero-vortex.md) | Hero Vortex | Heroes | Drop-in hero section: centered headline at the eye of a spiral galaxy with star speckles and trailing arms. |
| [`hero-ribbon.md`](hero-ribbon.md) | Hero Ribbon | Heroes | Drop-in split hero: copy left, three Gaussian light ribbons sweeping the right over a dot-matrix grid. |
| [`hero-particles.md`](hero-particles.md) | Hero Particles | Heroes | Drop-in hero section: top-weighted headline with a badge row over a drifting GPU particle field. |
| [`hero-starfield.md`](hero-starfield.md) | Hero Starfield | Heroes | Drop-in hero section: bottom-left copy under a twinkling hashed star grid with parallax drift. |
| [`hero-black-hole.md`](hero-black-hole.md) | Hero Black Hole | Heroes | Drop-in hero section: left copy beside a ray-traced accretion disk with relativistic beaming and a lensed star field. |
| [`chroma-flow.md`](chroma-flow.md) | Chroma Flow | Backgrounds | Four-edge liquid color field that floods inward toward the direction the cursor sweeps — fbm-noise bleed boundaries driven by pointer velocity. |
| [`hero-chroma.md`](hero-chroma.md) | Hero Chroma | Heroes | Drop-in hero section: bottom-left copy over a four-edge liquid color field that floods toward the cursor's sweep direction. |
| [`block-nav.md`](block-nav.md) | Block Nav | Blocks | Complete navigation bar: brand, desktop links, actions, and an accessible mobile sheet with Escape handling. |
| [`block-showcase.md`](block-showcase.md) | Block Showcase | Blocks | Product showcase stage: browser-chrome frame with a replaceable screenshot or video (CSS demo UI by default), headline and actions. |
| [`block-feature-grid.md`](block-feature-grid.md) | Block Feature Grid | Blocks | Feature grid with real hierarchy: one bento feature card plus supporting cells, replaceable icons and media. |
| [`block-feature-tabs.md`](block-feature-tabs.md) | Block Feature Tabs | Blocks | Feature tabs where list, copy and illustration switch together; WAI-ARIA keyboard pattern, touch-friendly strip on mobile. |
| [`block-scroll-story.md`](block-scroll-story.md) | Block Scroll Story | Blocks | Scroll narrative: a sticky scene crossfades as story steps cross the viewport; docks above the steps on mobile. |
| [`block-process-steps.md`](block-process-steps.md) | Block Process Steps | Blocks | Three-to-four step process with a self-drawing connector line and replaceable media per step. |
| [`block-integrations.md`](block-integrations.md) | Block Integrations | Blocks | Integrations hub with static connection rings of rebrandable tool tiles and an always-available link grid fallback. |
| [`block-comparison.md`](block-comparison.md) | Block Comparison | Blocks | Before/after comparison with a draggable, keyboard- and touch-operable reveal handle (a real range input). |
| [`block-testimonials.md`](block-testimonials.md) | Block Testimonials | Blocks | Testimonials with a featured quote and field notes; fictional demo copy is visibly marked and fully replaceable. |
| [`block-pricing.md`](block-pricing.md) | Block Pricing | Blocks | Pricing plans with a working monthly/annual switch — amounts, basis lines and savings render from data. |
| [`block-faq.md`](block-faq.md) | Block FAQ | Blocks | FAQ accordion with real disclosure semantics, arrow-key traversal and CSS grid-rows animation; long answers welcome. |
| [`block-cta.md`](block-cta.md) | Block CTA | Blocks | Closing call to action with primary/secondary actions and a replaceable brand visual layer (concentric line artwork by default). |
| [`example-launch.md`](example-launch.md) | Example — Product Launch | Blocks | Complete fictional software launch page ("Orbit" by Lumen Labs): hero, showcase, feature grid, tabs, scroll story, integrations, pricing, testimonials, FAQ, CTA. All copy is demo content. |
| [`example-studio.md`](example-studio.md) | Example — Design Studio | Blocks | Complete fictional design-studio service page (Atelier North): daylight editorial hero, engagement steps, portfolio showcase, before/after slider, services grid, fixed-fee engagements, testimonials, FAQ and a typographic footer. |
| [`ember-drift.md`](ember-drift.md) | Ember Drift | Backgrounds | Sparks rising from a bed of coals, cooling from gold to red through shimmering heat. |
| [`caustics-field.md`](caustics-field.md) | Caustics Field | Backgrounds | Sunlit pool-floor caustics: a crawling net of focused light over deep water. |
| [`halo-rings.md`](halo-rings.md) | Halo Rings | Backgrounds | Concentric rings breathing outward from a luminous core, their edges split into spectral fringes. |
| [`terrain-ridge.md`](terrain-ridge.md) | Terrain Ridge | Backgrounds | Layered ridged-noise mountain silhouettes rolling in parallax under a low sun. |
| [`silk-veil.md`](silk-veil.md) | Silk Veil | Backgrounds | A draped silk curtain of warped folds with a luster band sweeping the weave. |
| [`plasma-sheet.md`](plasma-sheet.md) | Plasma Sheet | Backgrounds | Molten color currents folding through each other in a double domain-warped field. |
| [`star-tide.md`](star-tide.md) | Star Tide | Backgrounds | Stars carried on slow luminous waves, flaring as the tide crests. |
| [`ink-bloom.md`](ink-bloom.md) | Ink Bloom | Backgrounds | Ink drops blooming and feathering into warm paper on staggered cycles. |
| [`solar-corona.md`](solar-corona.md) | Solar Corona | Backgrounds | A boiling sun disk crowned with streaming corona light and polar plumes. |
| [`dust-motes.md`](dust-motes.md) | Dust Motes | Backgrounds | Dust motes drifting through slanted Tyndall beams in a dark room. |
| [`hero-aurora-editorial.md`](hero-aurora-editorial.md) | Hero Aurora Editorial | Heroes | Drop-in hero section: centered serif editorial masthead under aurora curtains — large display title, two standfirst lines, dual CTAs. |
| [`hero-starfield-split.md`](hero-starfield-split.md) | Hero Starfield Split | Heroes | Drop-in split hero: copy on the left, a frosted badge wall on the right, over a twinkling hashed star grid. |
| [`hero-vortex-centered.md`](hero-vortex-centered.md) | Hero Vortex Centered | Heroes | Drop-in hero section: a short centered headline resting in the calm eye of a tight, slow spiral galaxy. |
| [`hero-mesh-bold.md`](hero-mesh-bold.md) | Hero Mesh Bold | Heroes | Drop-in hero section: one oversized ultra-bold slogan over a vivid Voronoi mesh-gradient field — the poster hero. |
| [`hero-fiber-top.md`](hero-fiber-top.md) | Hero Fiber Top | Heroes | Drop-in hero section: a top-aligned left masthead pressing down on silk fibers streaming through the dark. |
| [`hero-chroma-full.md`](hero-chroma-full.md) | Hero Chroma Full | Heroes | Drop-in hero section: the four-edge chroma field run full-bleed with bottom-left copy in a dusk palette. |
| [`hero-black-hole-cinema.md`](hero-black-hole-cinema.md) | Hero Black Hole Cinema | Heroes | Drop-in hero section: the ray-traced accretion disk letterboxed like a feature film — hard bars top and bottom, title card centered. |
| [`hero-particles-badge.md`](hero-particles-badge.md) | Hero Particles Badge | Heroes | Drop-in hero section: a frosted badge row leads a centered headline over a drifting GPU particle field. |
| [`hero-ribbon-left.md`](hero-ribbon-left.md) | Hero Ribbon Left | Heroes | Drop-in hero section: copy in a left column with a vertical eyebrow rail while the light ribbons read as the right-hand visual. |
| [`hero-fluid-minimal.md`](hero-fluid-minimal.md) | Hero Fluid Minimal | Heroes | Drop-in hero section: one line of copy, one CTA, one liquid gradient — the entire hero for products that can be named in a breath. |
| [`glass-panel.md`](glass-panel.md) | Glass Panel | Glass | A broad ray-marched optical slab that carries your own content across a full panel. |
| [`glass-tile.md`](glass-tile.md) | Glass Tile | Glass | A wall of glass bricks where one shared biconvex lens travels to the hovered tile and bulges through it. |
| [`chromatic-text.md`](chromatic-text.md) | Chromatic Text | Text | The pointer is the prism: nearby letters split into red and blue fringes over a sliding rainbow. |
| [`ripple-text.md`](ripple-text.md) | Ripple Text | Text | Clicks and taps drop ripples that travel outward through your words; a resting pointer leaves a dimple. |
| [`spectrum-text.md`](spectrum-text.md) | Spectrum Text | Text | A spectral light band flows continuously through your words and leans toward the pointer. |
| [`tilt-card.md`](tilt-card.md) | Tilt Card | Interactions | A porcelain card that tilts in space while its specular highlight tracks the pointer across the surface. |
| [`pointer-glow.md`](pointer-glow.md) | Pointer Glow | Interactions | A handheld light for layouts: the room dims slightly and a warm source follows your pointer over your own content. |
| [`spotlight-card.md`](spotlight-card.md) | Spotlight Card | Interactions | A card under a torch: the beam follows the pointer to uncover your content from the dark. |
| [`elastic-hover.md`](elastic-hover.md) | Elastic Hover | Interactions | Rubber around anything you wrap: hover swells, press squashes, and an under-damped spring wobbles it home. |
| [`magnetic-grid.md`](magnetic-grid.md) | Magnetic Grid | Interactions | A lattice of dots that feel the pointer's field — sliding, swelling and settling like iron filings. |
| [`block-logos.md`](block-logos.md) | Block Logos | Blocks | Customer logo wall: brand tiles that sit desaturated and colorize on hover, as real links with styled wordmarks when no image assets exist. |
| [`block-stats.md`](block-stats.md) | Block Stats | Blocks | Stats band: numbers count up from zero on scroll-in with an always-present settled value for screen readers; formatting, prefixes and suffixes are props. |
| [`block-team.md`](block-team.md) | Block Team | Blocks | Team cards: avatar (image or auto-generated initials badge), name, role and profile links; the whole card is hoverable and linkable. |
| [`block-gallery.md`](block-gallery.md) | Block Gallery | Blocks | Work gallery grid with hover lift and an optional lightbox — a real dialog with Escape, arrow keys, focus trap and focus restore; generated CSS artwork by default. |
| [`block-timeline.md`](block-timeline.md) | Block Timeline | Blocks | Company or product timeline: a rail that draws itself in on scroll, dots lighting up in sequence, alternating sides on wide screens. |
| [`block-newsletter.md`](block-newsletter.md) | Block Newsletter | Blocks | Email signup with working client-side validation, announced inline errors and a confirmation panel; runs in an honestly-labeled demo mode until wired up. |
| [`block-contact.md`](block-contact.md) | Block Contact | Blocks | Contact section: a direct-channels list beside a configurable form skeleton — labeled fields, native validation, and a confirmation state on submit. |
| [`block-banner.md`](block-banner.md) | Block Banner | Blocks | Announcement banner: a slim accent strip with an optional action, a labeled dismiss control, Escape handling and sticky-top positioning. |
| [`block-milestones.md`](block-milestones.md) | Block Milestones | Blocks | Milestone progress: completed steps light up in sequence on scroll, the current step breathes, and upcoming steps stay dimmed — all driven by one index. |
| [`block-quote-wall.md`](block-quote-wall.md) | Block Quote Wall | Blocks | Quote wall: many quotes in masonry columns, or one at a time in a rotator with keyboard controls, hover/focus pause and reduced-motion respect. |
