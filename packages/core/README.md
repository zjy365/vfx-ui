# @vfx-ui/core

Renderer core for [vfx-ui](https://vfx-ui.com): the vgpu-backed WebGPU effect renderer with deterministic test support (`vgpu/mock` + Dawn pixel readback). You normally don't install this directly — use [`@vfx-ui/react`](https://www.npmjs.com/package/@vfx-ui/react), which depends on it.

## What's inside

- `renderer.ts` — effect lifecycle on top of [vgpu](https://github.com/vercel-labs/vgpu) (device acquire, pipeline setup, frame loop, cleanup)
- `capability.ts` — WebGPU feature/adapter probing and fallback signaling
- `report.ts` — deterministic frame report used by the pixel-readback tests
- `types.ts` — shared contract between core and the React components

## Install

```bash
npm install @vfx-ui/core
```

The package ships compiled ESM and TypeScript declarations. `animate: false` and `renderer.setAnimate(false)` stop the continuous frame loop. The renderer draws a single frame on attachment, uniform changes and element resizing; resuming resets the delta clock so time does not jump after a pause. Dispose the renderer when its canvas is removed.

## License

MIT — © vfx-ui contributors.
