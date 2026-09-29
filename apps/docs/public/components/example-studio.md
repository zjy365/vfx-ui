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
