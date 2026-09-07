# VFX UI design direction

## Intent

An interactive material exhibition for developers. Visitors should experience an effect, understand what responds to them, and reach working source with minimal friction. Preserve the existing cinematic Hero effects while broadening the library with a few expressive DOM components.

Direction seed: `9fe17e73`, candidate 7. The supplied design methodology informed the direction, fresh-context screenshot critiques, and subtraction pass; it is not a claim of an objective design score.

## Visual language

- Cinematic black opening with a live, selectable GPU artwork and warm white oversized typography.
- Mineral paper (`#eeefe9`), charcoal green (`#202520`), and cobalt (`#2349db`) for the interaction studio.
- Figtree Black for display headlines, the existing sans-serif for interfaces, and monospace for source. The local font includes its OFL license.
- Let actual components supply the spectacle. Use restrained borders, quiet labels, generous space, and a deliberate transition from exhibition to documentation.

## Interaction contracts

- Pointer motion is local to a component or its Hero surface. Content stays clickable while the decorative layer remains non-interactive.
- Magnetic controls retain a stationary hit region. Motion settles through an imperative animation loop instead of causing React renders on every pointer movement.
- Respect reduced motion, ignore touch hover emulation, clean up listeners and frames, and preserve native keyboard behavior.
- The homepage can pause its GPU exhibition and releases it offscreen. This is separate from freezing shader time inside the library renderer.
- Keep component defaults conservative; interactive demonstrations explicitly enable pointer response.

## Content and catalog

- Hero copy is example content. Accept React nodes, actionable CTA objects, or fully custom children; never require the demonstration wording.
- One component gets one catalog entry. Presets remain discoverable within components and through search.
- Scale a complete Hero composition inside the documentation preview rather than clipping its title or actions.
- Keep props, installation files, agent-readable documentation, and real thumbnails aligned with the exported implementation.

## Review evidence

Checked desktop and 390px mobile layouts, live pointer response, component controls, native CTA behavior, keyboard semantics, and reduced-motion lifecycle. Two independent screenshot reviews informed fixes to scrolling, preview framing, labels, and competing controls. Mobile screenshot artifacts were checked against the actual viewport before treating them as layout bugs.

Avoid expanding this direction into indiscriminate cursor effects, decorative dashboards, or additional slogan sections. Future components should introduce a distinct interaction or material behavior.

## Footer extension

Hero and Footer are the two primary collection categories. FooterTidal introduces copper engraved currents and opaque monumental type; FooterFold uses a connected lavender paper screen with violet ink; FooterPhosphor uses a full-width cell wordmark with navigation beneath. The homepage’s actual footer switches among these exported components. Footer gallery images preserve the entire composition and mobile previews retain their intrinsic height.

The external random seed, alternatives, material decisions and independent screenshot review are recorded in [the Footer design record](docs/design/footers.md). LiveChart, WebGlobe and EnergyOrb were removed at the user’s request; HeroGlobe remains.

## Optical Glass replacement

Glass now consists of four original optical studies: warm printed card, dark biconvex lens, cobalt molten loop, and a triangular glass frame. Each study uses a distinct scene to make its transmission legible. Preserve public names and preset routes while replacing the former blurred fields. RadiantDots extends the background collection with real multi-pass light transport and original dot arrangements. Material limits, reference attribution, compatibility and review evidence are recorded in [the Glass design record](docs/design/glass.md).
