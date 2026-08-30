import { isWebGPUAvailable, prefersReducedMotion } from "./capability.ts";

/** Client capability snapshot used by docs, tests, and the fallback story. */
export interface CapabilityReport {
  webgpu: boolean;
  reducedMotion: boolean;
  runtime: "browser" | "server" | "unknown";
}

export function capabilityReport(): CapabilityReport {
  if (typeof window === "undefined") {
    return { webgpu: false, reducedMotion: false, runtime: "server" };
  }
  return {
    webgpu: isWebGPUAvailable(),
    reducedMotion: prefersReducedMotion(),
    runtime: "browser",
  };
}
