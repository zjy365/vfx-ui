import { frame, type Gpu, type Target } from "vgpu";
import {
  createPrismRuntime,
  destroyPrismRuntime,
  createLightPipeline,
  DEFAULT_PRISM_CONTROLS,
  setRuntimeControls,
  setRuntimeLampAim,
  setRuntimeOrbit,
} from "./PrismEngine";
export async function renderPrismThumbnail(
  gpu: Gpu,
  output: Target,
  opts: {
    time?: number;
    settings?: { dispersion?: number; orbit?: number; from?: string };
  } = {},
) {
  const runtime = createPrismRuntime(gpu, output.size, "prism-thumbnail");
  const pipeline = createLightPipeline(runtime);
  try {
    setRuntimeControls(runtime, {
      ...DEFAULT_PRISM_CONTROLS,
      wallColor: opts.settings?.from ?? "#d2ccc2",
      spectralDispersion: {
        base: 1.2,
        strength: opts.settings?.dispersion ?? 0.1,
      },
    });
    setRuntimeLampAim(runtime, 0.5, 0.5);
    setRuntimeOrbit(runtime, opts.settings?.orbit ?? 0, 0);
    await pipeline.prepare(output);
    pipeline.bind(opts.time ?? 0, { revealProgress: 1, beamWidthReveal: 1 });
    frame(gpu, (f) => pipeline.render(f, output, {}));
    await gpu.gpu.queue.onSubmittedWorkDone();
    await gpu.settled();
  } finally {
    pipeline.destroy();
    destroyPrismRuntime(runtime);
  }
}
