# VFX UI

**Shader-native visual effect components for React.** Rendered on the GPU via [WebGPU](https://www.w3.org/TR/webgpu/) ([vgpu](https://github.com/vercel-labs/vgpu)). Every effect here is something **DOM/CSS cannot reproduce** — that is the whole charter.

```bash
npm install @vfx-ui/react vgpu
```

```tsx
import { WaveBackground } from "@vfx-ui/react";

export function Hero() {
  return (
    <section style={{ position: "relative", minHeight: "100dvh" }}>
      <WaveBackground />
      <h1 style={{ position: "relative", zIndex: 1 }}>GPU effects, native React.</h1>
    </section>
  );
}
```

## The catalog

| Category | Components |
|---|---|
| Backgrounds | WaveBackground · FluidGradient · Aurora · Starfield · ParticleField · MeshGradient · Iridescent |
| Glass | GlassCard · LiquidGlass |
| Data | LiveChart — real-time GPU line chart (uniform-array pipeline) |
| Globe | WebGlobe — a WebGPU re-creation of [shuding/cobe](https://github.com/shuding/cobe) (MIT) |

Every component ships with ≥3 preset variants, typed props, SSR-safe rendering, `prefers-reduced-motion` handling, and a graceful fallback when WebGPU is unavailable.

## What it is not

By charter (see `PLAN.md` §0): **no DOM animation** (use [motion](https://motion.dev)), **no heavy 3D scenes** (use threeui/Orillusion), no UI primitives (use [base-ui](https://base-ui.com)). Shader-native effects only.

## Copy-paste instead of install

```bash
npx @vfx-ui/cli add wave-background liquid-glass
npm install vgpu
```

Self-contained sources land in `components/` — you own the code. Registry follows the [shadcn registry format](https://ui.shadcn.com/docs/registry); index at [`registry/dist/index.json`](registry/dist/index.json).

## For AI agents

Machine-readable docs: [`public/llms.txt`](apps/docs/public/llms.txt), [`public/agents.md`](apps/docs/public/agents.md), and one markdown doc per component (props, variants, guardrails). Deterministic GPU testing is built in — `vgpu/mock` + Dawn readback pixel tests run in CI without a GPU.

## Development

```bash
pnpm install
pnpm -r typecheck && pnpm -r test   # 25 deterministic tests incl. Dawn pixel readback
pnpm -r build
pnpm dev:docs                        # catalog at localhost:5173
node registry/build.mjs              # rebuild copy-paste registry from sources
node scripts/generate-agentic.mjs    # rebuild llms.txt / agents.md
```

Monorepo: `packages/core` (vgpu-backed renderer contract) · `packages/react` (components) · `packages/cli` · `apps/docs` (catalog site) · `registry` · `scripts`.

## License & credits

MIT. The docs shell is derived from [MengTo/threeui](https://github.com/MengTo/threeui) (MIT, © 2026 Meng To) — thank you for showing what a component catalog can be. Renderer core: [vercel-labs/vgpu](https://github.com/vercel-labs/vgpu) (MIT). WebGlobe re-creates [shuding/cobe](https://github.com/shuding/cobe) (MIT).
