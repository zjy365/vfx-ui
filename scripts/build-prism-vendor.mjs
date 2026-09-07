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
  root + "/packages/react/src/components/PrismEngine.tsx",
  "// @ts-nocheck\n/* Vercel VGPU prism light pipeline.\n" +
    (await fs.readFile(root + "/references/vgpu/LICENSE", "utf8")) +
    "\n*/\n" +
    result.outputFiles[0].text.replace(
      "DEFAULT_PRISM_CONTROLS, radians",
      "DEFAULT_PRISM_CONTROLS: any, radians",
    ),
);
