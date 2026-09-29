/**
 * Design constants distilled from the repository's DESIGN.md so agents get
 * styling and interaction guidance without cloning the repo.
 * Keep these in sync with /DESIGN.md when the direction evolves.
 */

export const STYLES_MARKDOWN = `# VFX UI styles and visual language

Source: vfx-ui DESIGN.md (shader-native React components rendered via WebGPU/vgpu).

## Core palette

| Color | Hex | Use |
| --- | --- | --- |
| Mineral paper | \`#eeefe9\` | Light studio surfaces, editorial pages |
| Charcoal green | \`#202520\` | Dark studio chrome, quiet panels |
| Cobalt | \`#2349db\` | Interaction accent, links, focus states |
| Exhibition black | near-black stage | Cinematic openings hosting a live GPU artwork |
| Warm white | soft off-white | Oversized display typography on black |

Suggested accent ramp for shader uniforms: pass \`primary\`/\`secondary\` props
(cobalt \`#2349db\` pairs well with mineral paper and warm white). Component
presets (e.g. \`AURORA_PRESETS\`) are the fastest way to stay on-palette.

## Typography

- Display: Figtree Black (local, OFL-licensed) for oversized headlines.
- Interface: the existing neutral sans-serif.
- Source/code: monospace.

## Styling guidance

- Let actual components supply the spectacle: restrained borders, quiet
  labels, generous space, deliberate transition from exhibition to docs.
- Content is consumer-owned: hero copy is example content; components accept
  React nodes, CTA objects, or fully custom children.
- Scale a full Hero composition inside a preview instead of clipping its
  title or actions; at 390px mobile the hero artwork flows below the copy.
- One component gets one catalog entry; presets stay discoverable inside
  components and through search.
`;

export const DESIGN_NOTES_MARKDOWN = `# VFX UI design notes

Source: vfx-ui DESIGN.md. Key interaction contracts and principles to honor
when composing pages or contributing components.

## Interaction contracts

- Pointer motion is local to a component or its Hero surface; content stays
  clickable while the decorative layer remains non-interactive.
- Magnetic controls keep a stationary hit region; motion settles through an
  imperative animation loop instead of causing React renders on every pointer
  movement.
- Respect \`prefers-reduced-motion\` (shader time freezes automatically),
  ignore touch hover emulation, clean up listeners and frames, preserve
  native keyboard behavior.
- The homepage can pause its GPU exhibition and releases it offscreen; that
  is separate from freezing shader time inside the library renderer.
- Keep component defaults conservative; interactive demos explicitly enable
  pointer response.

## Runtime behavior to tell users about

- WebGPU-capable browser required; components degrade gracefully otherwise
  via the \`fallback\` prop.
- SSR-safe: server rendering produces an inert canvas; init happens on mount.
- Uniforms are plain f32 fields passed via \`uniforms\`; no shader edits needed.
- WGSL source is exported per component (e.g. \`AURORA_SHADER\`) for learning.

## Direction boundaries

- Avoid expanding into indiscriminate cursor effects, decorative dashboards,
  or additional slogan sections.
- New components should introduce a distinct interaction or material behavior.
- Hero and Footer are the two primary collection categories; Glass is a set
  of four original optical studies; September editorial collection
  (HeroEclipse, HeroContour, FooterVinyl) works without WebGPU or remote
  artwork.
`;
