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
