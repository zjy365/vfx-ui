import fs from "node:fs/promises";
import { createRequire } from "node:module";
const root = process.cwd();
const require = createRequire(root + "/package.json");
const esbuild = require("esbuild");
const reactRequire = createRequire(root + "/packages/react/package.json");
const vgpuRequire = createRequire(reactRequire.resolve("vgpu"));
const { transformWgsl } = await import(vgpuRequire.resolve("@vgpu/wgsl/loader-vite"));
const base =
  root +
  "/references/vgpu/apps/docs/app/[lang]/(home)/components/prism-background";
// Keep the local WebGPU compatibility fix reproducible without editing the
// upstream reference checkout or altering its WGSL. Fail if upstream drifts.
function compatibilityMipBake(source) {
  const patches = [
    ["const baked: BakedTexture[] = [];", "const baked: BakedTexture[] = [];\n  const mipScratch: Texture[] = [];"],
    ["encodeMipChain(gpu, encoder, downsamplePipeline, texture);", "encodeMipChain(gpu, encoder, downsamplePipeline, texture, mipScratch);"],
    ["    wallMask?.destroy();", "    for (const texture of mipScratch) texture.destroy();\n    wallMask?.destroy();"],
    ['usage: ["texture_binding", "storage_binding"],', 'usage: ["texture_binding", "storage_binding", ...gpu.device.isCompatibilityMode ? ["copy_dst" as const] : []],'],
    ["  texture: Texture\n): void {", "  texture: Texture,\n  scratchTextures: Texture[]\n): void {"],
    ['    const pass = encoder.beginComputePass({\n      label: `${texture.label}.mip${level}`,', `    const scratch = gpu.device.isCompatibilityMode ? gpu.device.createTexture({
      size: [width, height],
      format: texture.format,
      usage: ["storage_binding", "copy_src"],
      label: \`\${texture.label}.scratch-mip\${level}\`,
    }) : undefined;
    if (scratch) scratchTextures.push(scratch);
    const pass = encoder.beginComputePass({
      label: \`\${texture.label}.mip\${level}\`,`],
    ["resource: texture.gpu.createView({\n              baseMipLevel: level,", "resource: (scratch ?? texture).gpu.createView({\n              baseMipLevel: scratch ? 0 : level,"],
    ["    pass.end();\n  }\n}\n\nasync function createPipeline", `    pass.end();
    if (scratch) encoder.copyTextureToTexture(
      { texture: scratch.gpu },
      { texture: texture.gpu, mipLevel: level },
      [width, height],
    );
  }
}

async function createPipeline`],
  ];
  for (const [before, after] of patches) {
    if (source.split(before).length !== 2)
      throw new Error("Prism compatibility mip patch no longer matches upstream bake.ts; review before regenerating.");
    source = source.replace(before, after);
  }
  return source;
}
const result = await esbuild.build({
  stdin: {
    contents: `export * from '${base}/runtime/resources.ts';export * from '${base}/runtime/state.ts';export {createLightPipeline} from '${base}/pipelines/light/index.ts';export {DEFAULT_PRISM_CONTROLS} from '${base}/types.ts';`,
    resolveDir: root,
  },
  bundle: true,
  format: "esm",
  platform: "browser",
  external: ["vgpu", "vgpu/core"],
  write: false,
  plugins: [
    {
      name: "wgsl",
      setup(b) {
        b.onLoad({ filter: /assets\/light\/bake\.ts$/ }, async (a) => ({
          contents: compatibilityMipBake(await fs.readFile(a.path, "utf8")),
          loader: "ts",
        }));
        b.onLoad({ filter: /\.wgsl$/ }, async (a) => ({
          contents: (
            await transformWgsl(await fs.readFile(a.path, "utf8"), a.path, {
              minify: false,
            })
          ).code,
          loader: "js",
        }));
        b.onLoad({ filter: /assets\/light\/manifest\.ts$/ }, async (a) => ({
          contents: (await fs.readFile(a.path, "utf8")).replace(
            "/hero/prism-light/wall-global-light-mask.webp",
            "data:image/webp;base64," +
              (
                await fs.readFile(
                  root +
                    "/references/vgpu/apps/docs/public/hero/prism-light/wall-global-light-mask.webp",
                )
              ).toString("base64"),
          ),
          loader: "ts",
        }));
      },
    },
  ],
});
await fs.writeFile(
  process.argv[2] || root + "/packages/react/src/components/PrismEngine.tsx",
  "// @ts-nocheck\n/*! @license Vercel VGPU prism light pipeline.\n" +
    (await fs.readFile(root + "/references/vgpu/LICENSE", "utf8")) +
    "\n*/\n" +
    result.outputFiles[0].text.replace(
      "DEFAULT_PRISM_CONTROLS, radians",
      "DEFAULT_PRISM_CONTROLS: any, radians",
    ),
);
