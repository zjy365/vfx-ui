import { catalogLabel } from "../catalogPresentation.js";
import type { ReadyShader } from "./registry";
import { READY_SHADERS as REGISTRY_READY_SHADERS } from "./registry";

export const READY_SHADERS: readonly ReadyShader[] = REGISTRY_READY_SHADERS.map((shader) => ({
  ...shader,
  label: catalogLabel(shader),
}));

export const VISIBLE_READY_SHADERS = READY_SHADERS.filter((shader) => shader.visible);

export const READY_SHADER_COLLECTION_COUNT = VISIBLE_READY_SHADERS.reduce(
  (total, shader) => total + (shader.variants?.length || 1),
  0,
);

export function getReadyShader(id: string): ReadyShader {
  return READY_SHADERS.find((shader) => shader.id === id) ?? READY_SHADERS[0];
}
