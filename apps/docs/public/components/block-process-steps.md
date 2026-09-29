# Block Process Steps

Three-to-four step process with a self-drawing connector line and replaceable media per step.

## Install

```bash
npm install @vfx-ui/react
```

```tsx
import { BlockProcessSteps } from "@vfx-ui/react";

export function HowItWorks() {
  return (
    <BlockProcessSteps
      title="From install to insight in an afternoon."
      steps={[
        { title: "Connect your repos", text: "One OAuth flow, automatic indexing." },
        { title: "Describe a release", text: "The graph assembles itself." },
        { title: "Ship and watch", text: "Staged rollouts with auto-pause." },
      ]}
    />
  );
}
```

## Props

- `eyebrow?: string`
- `title?: ReactNode`
- `description?: ReactNode`
- `steps?: readonly ProcessStep[]`
- `action?: { label: string; href: string } | null`
- `scheme?: "dark" | "light"`
- `accent?: string`
- `className?: string`
- `style?: CSSProperties`
- `children?: ReactNode`

## Notes for agents

- DOM/CSS/Canvas interaction; works without WebGPU. Supply your own content through the documented props.
- SSR-safe: content and navigation render on the server; animation starts after mount.
- `prefers-reduced-motion` skips animation automatically.
