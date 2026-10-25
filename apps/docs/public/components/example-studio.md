# Example — Design Studio

Complete fictional design-studio page (Atelier North): daylight editorial hero, engagement steps, portfolio showcase, before/after slider, services grid, fixed-fee engagements, testimonials, FAQ and a typographic footer.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/example-studio.json
```

```tsx
import { ExampleStudio } from "@/components/ExampleStudio";

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
