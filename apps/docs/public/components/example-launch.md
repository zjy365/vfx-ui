# Example — Product Launch

Complete fictional software launch page (“Orbit” by Lumen Labs): hero, showcase, feature grid, tabs, scroll story, integrations, pricing, testimonials, FAQ, CTA and footer. All copy is demo content.

## Install

```bash
npx shadcn@latest add https://vfx-ui.com/r/example-launch.json
```

```tsx
import { ExampleLaunch } from "@/components/ExampleLaunch";

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
