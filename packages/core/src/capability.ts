/** True when this runtime can create a WebGPU device (browser only). */
export function isWebGPUAvailable(): boolean {
  return typeof navigator !== "undefined" && "gpu" in navigator && navigator.gpu !== null;
}

/** True when the user prefers reduced motion; safe on non-browser runtimes. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
