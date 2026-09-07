# Footer collection — September 2026

Visitor mode: Experience in the gallery, Read on the component page.

## Brief

The user wants a memorable visual library focused on Heroes and Footers, and rejected LiveChart, WebGlobe and EnergyOrb. Remove those three; retain the Hero family. Build complete reusable Footers rather than isolated visual toys. Their navigation, CTA, copyright and brand lettering must come from consumer props.

## External randomness and selection

The supplied Anshu methodology was read before implementation. Python `secrets.choice` generated a 256-character seed from the operating system, not model sampling:

```
tCTHnAj1jHsKUoRry6PdIun9bWyCft5BaknWzrwLilyOIBcmFUP55kSHazumfBhj8mFC0BpVzkeAJmkcSyROga2tupFZH2MEPZTinKeux1htdHYd87ys0OYJAGvoQ2Pi33WEj9kux5VF91ogZtNNS582obOKh5rD3ssWhpFKYTFiTa28wwyCpr0xElFn4FmwmvwNykhHfZSXWuq9coKCbPzI6LbMsfw6NuD168PcIK8Gw59omGu0Z0w95uJXXRti
```

Subpatterns were associative prompts, not a mathematical claim: `Lily` suggested organic contours, doubled `55`/`33` and repeated W shapes suggested hinges, and the tightly repeated terminal capitals suggested illuminated cells. The seed never appears in the rendered product.

Breadth before depth: tidal engraving, folded print, phosphor lettering, basalt cuts, rolling end credits, print-registration offsets, and a gravity-drop brand. Choose the first three for distinct material behavior that remains usable around real footer links. Set aside the others: extra ornament or motion offered less value in this release.

## Built directions

- **FooterTidal:** dark slate, copper contour currents and opaque warm-white lettering. A spacious introduction/navigation pair gives way to the landscape. Pointer movement locally deforms the lines.
- **FooterFold:** pale lavender paper and violet ink. An eight-face printed screen precedes the content. Alternating perspective, width compensation and directional shading establish the folded structure; nearby faces turn toward the pointer.
- **FooterPhosphor:** pine-dark surface and phosphor-green cells. The introduction/CTA forms a horizontal top row, the wide wordmark owns the middle, and navigation follows below. Cells disperse locally and return to their home positions. A consistent brightness direction replaces mottled dim patches.

The homepage uses the real exported components as its own switchable footer. The dedicated category shows complete compositions with intrinsic thumbnail proportions.

## Refinement and review

An independent critic received only six desktop/mobile screenshots in a fresh context. First review: Tidal 7.8, Fold 7.5, Phosphor 6.7, overall 7.3. It called out the shared information layout, weak dot-matrix scale, low-contrast secondary copy and fold credibility. The revision separates Phosphor navigation, expands and brightens its wordmark, strengthens connected fold faces, and removes wave blending through Tidal’s lettering. Capture framing was corrected to each footer’s intrinsic height so screenshot padding is not mistaken for mobile layout spacing.

## Consumer and runtime contracts

All three export typed content props and semantic footers, with actual links and accessible navigation. Brand text generates the artwork; it is not an image asset. `children` replaces the intro/navigation, retaining the art and legal row. No fabricated action or dead `#` destination ships by default.

The canvas renderer caps device-pixel ratio, responds to resize/font readiness, sleeps offscreen, honors dynamic reduced-motion preferences, and disposes listeners/frames. Pointer-driven effects ignore touch. Static content survives an unavailable Canvas2D context. Standalone registry bundles include their local runtime dependencies and require no animation framework.

Final fresh-context review: Tidal **8.3**, Fold **7.6**, Phosphor **8.2**, overall **8.0/10**. The reviewer found the desktop and mobile layouts sound; remaining subjective gaps are fold material realism, mobile texture density, and the sample brands’ voices. This is an improvement over the first review, not a claimed 9/10 result. Two bounded screenshot passes were completed. Future art-direction work can target those specific gaps rather than piling on additional effects.

Validation: all 76 tests passed (including 10 new Footer contract cases), the full workspace build/typecheck passed, all 34 registry bundles resolved, and the final three Footer bundles also resolved with React as their only external import. Browser checks covered intrinsic mobile layouts, edited brand text, live fold response, and the homepage selector. The existing vgpu mixed static/dynamic import warning remains.
