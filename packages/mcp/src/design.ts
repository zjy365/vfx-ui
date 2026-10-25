/**
 * Design constants distilled from the repository's DESIGN.md so agents get
 * styling and interaction guidance without cloning the repo.
 * Keep these in sync with /DESIGN.md when the direction evolves.
 */

export const STYLES_MARKDOWN = `# VFX UI styles and visual language

Source: vfx-ui DESIGN.md. VFX UI provides free React components and complete Pro landing-page projects.

## Product-site palette

| Color | Hex | Use |
| --- | --- | --- |
| Canvas | \`#ffffff\` | Light product canvas |
| Ink | \`#17191c\` | Text and primary controls |
| Muted | \`#555b64\` | Secondary text |
| Surface | \`#f1f2f4\` | Preview controls and quiet surfaces |
| Line | \`#dde0e4\` | Borders |
| Yellow | \`#f5d547\` | Magnetic study and product accent |

The website uses Manrope for text and DM Mono for metadata. Desktop gutters are
64px, mobile gutters 24px. Main display is 80/84px; gallery display is 72/76px;
component titles are 44/50px. Mobile display is 48–52px.

## Composing consumer websites

- Use the consumer's own typography and palette through component props.
  Existing library artwork includes mineral paper, charcoal and cobalt presets;
  those are component choices, not a requirement to copy the product website.
- Let actual components supply the spectacle: restrained borders, quiet labels,
  generous space and one clear visual idea per section.
- Hero copy is example content. Replace it through React nodes, CTA objects or
  custom children before shipping a real product.
- Preserve the full composition at mobile sizes; place artwork below the copy
  rather than clipping headlines or actions.
- The public gallery is a product preview, with code and API disclosed on demand.
  Fumadocs is reserved for technical documentation.

## Free and Pro

All 93 existing registry entries remain free MIT components. Pro Collection 01
contains five complete editable landing-page projects: Agency, Marketing,
Playful, SaaS and Startup. Public previews contain compiled demonstrations;
paid project source is delivered privately. Content-creation skills are separate.
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
- Respect \`prefers-reduced-motion\` (GPU drawing pauses for reduced motion),
  ignore touch hover emulation, clean up listeners and frames, preserve
  native keyboard behavior.
- The current homepage uses an optical DOM/SVG study. Component canvases pause
  when offscreen, hidden or reduced motion is requested.
- Keep component defaults conservative; interactive demos explicitly enable
  pointer response.

## Runtime behavior to tell users about

- Check each component runtime. DOM/CSS components need no GPU; WebGPU effects
  require support and expose a \`fallback\` prop. A small number use WebGL.
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
