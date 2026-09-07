# Optical glass studies

## Brief and scope

Replace the entire Glass collection's blurred, glow-heavy rendering. Use the material quality of Vercel VGPU's home-page prism as a reference, preserve public component names and preset URLs, and add one component inspired by Agent Radiance Cascades. Hero and Footer remain the library's primary page sections.

Mode: Experience inside the existing documentation system. This is a replacement of the four glass materials, not a replacement of the site's visual identity.

## Reference research

Read the local `references/vgpu` source, including the home prism's `glass.wgsl`, its light-material accent pass, and the Agent Radiance Cascades emitter, jump-flood, distance-field, cascade, presentation and simulation sources. Viewed both live references in the browser.

The important distinction is between a blurred colored rectangle and an optical object. The reference uses geometry, both glass interfaces, thickness-dependent absorption, reflections, and light that gives transmission a visible subject.

## Built direction

- GlassCard: thick, beveled glass over charcoal printed lines and a vermilion disk on warm paper. Optional DOM children stay above the optical artwork; no demonstration text is baked into the component.
- GlassLens: a biconvex lens over an ink-black optical bench with ivory and amber slits. The second ellipsoid intersection is solved analytically to avoid tangent-marching artifacts.
- LiquidGlass: a moving glass annulus over broad cobalt rules. Deformation changes geometry and transmission together. Its anisotropic distance estimate is scaled conservatively so primary rays cannot skip the solid.
- LightPrism: a rounded triangular glass frame, studio reflections, a soft offset shadow, and a procedural spectral beam.
- RadiantDots: thirteen orbital or nine square emitters; wave, chase and pulse sequences. Every emitter is also an occluder. Uses Vercel's MIT jump-flood and radiance-cascade pipeline with original arrangements and choreography. The complete upstream notice is retained in RadianceEngine and copied into standalone registry bundles.

Glass shaders are original. Their backgrounds are procedural; they do not capture or refract arbitrary DOM. The prism beam and contact shadow are authored approximations, not a full path-traced caustic solver. Glass renderers use two spatial samples at DPR 1.25 and a 30fps cap. Component time and pointer motion respect reduced motion through the existing renderer and pointer contracts.

RadiantDots caps its working field at 320px and its presentation loop at 30fps. It stops continuous rendering offscreen, in a hidden tab, with reduced motion, or when animation/speed is disabled. A paused field still redraws when its props change. GPU resources and observers are released on unmount, including when initialization resolves late.

## Compatibility

Existing four component exports and preset identifiers remain. Their visual output is intentionally different. Legacy `shine`, `borderGlow`, `blur`, and `scale` controls are retained but mapped to the new material parameters; the component docs describe their current meaning. No remote publication or version release is part of this change.

Preview capture now applies selected preset values after generic defaults. Optical capture supports the full portrait viewport. On narrow documentation pages, the preview is square and its grid column can shrink below min-content width; this prevents a 484px preview from being clipped in a 390px viewport.

## Validation

- Actual Dawn rendering: deterministic pixels, time changes, refractive-index changes, geometry size, beam dispersion, pointer influence and shadow controls.
- Radiance pipeline: deterministic output, time/layout/color changes and bounded scene dimensions.
- Lifecycle tests: offscreen pause/resume, dynamic reduced motion, paused prop updates, late device cleanup and user-supplied fallback.
- Browser: desktop studies, 390px portrait capture, actual mobile documentation bounds, working controls and pointer response.
- Standalone copy/install bundles resolve their local imports; package and documentation production builds pass.

Independent screenshot critiques are bounded to two rounds, following the supplied design methodology. The first rated the collection 5/10 overall and identified uncontrolled lens distortion, repeated staging, plastic-looking surfaces and black letterboxing in portrait captures. The next implementation pass addressed the first two directly, separated the studio scenes, introduced spatial antialiasing, corrected the capture framing and fixed the actual mobile grid overflow. Critic scores are evidence of remaining aesthetic gaps, not acceptance tests or proof of studio-level quality.

The second independent screenshot review rated the collection 6.7/10. It found Card the most complete and Lens the most atmospheric, but still identified fine dark silhouette edges, the prism's pale frame reading as plastic, repetitive centered compositions, and the dot field's resemblance to a loader. The latter is an intentional separate background/loading-style effect requested by the user, not a glass object. These are retained as honest aesthetic limitations; this delivery does not claim to match the reference's production art direction.

Final verification: 84 tests pass (3 core + 81 React); all five changed/new standalone bundles resolve; production build passes. Mobile optical preview bounds are 344 × 344 inside the 390px viewport, without clipping. Browser controls change Glass Card size and the RadiantDots grid arrangement, with no renderer errors observed.

## 2026-09-08 — Replace the prism approximation; add Astra Field

The user rejected the prism's remaining material gap and explicitly requested Vercel fidelity. The live LightPrism now adapts the actual VGPU light pipeline: beveled mesh, Cauchy spectral optics, HDR environment bake, wall material/light mask bake, cast shadow, back/front transmission and glass accent passes. The full upstream MIT license is embedded in PrismEngine.tsx. Reproduce with `node scripts/build-prism-vendor.mjs` using the local references/vgpu checkout; the runtime itself is self-contained. WGSL minification must remain disabled: the 0.3.1 runtime matches vertex attributes by name.

The paper preset uses Vercel's light wall color #d2ccc2. React owns GPU initialization, visibility, resizing and disposal. `LIGHT_PRISM_SHADER` remains a deprecated compatibility approximation; it is not used for the live component or thumbnail testing. Legacy to/accent props are deprecated because the new pipeline derives its spectrum optically.

AstraField is an independent WebGL point-sprite implementation inspired by the visible OpenAI Astra spiral field. Seeded 3D particles, extended six-shaped spiral or galaxy, additive star glow, blue ambient backdrop, vignette, drag/keyboard orbit and reduced-motion support. No OpenAI branding, text, remote assets or copied site implementation. Its visual is a recreation, not a claim of pixel-identical source parity.

Validation: real Dawn multi-pass dispersion test; deterministic finite star data; desktop 1280×800 and narrow viewport inspection; keyboard orbit; package build and registry generation. Resizing inspection caught and fixed a missing runtime camera-aspect update in the prism wrapper.
