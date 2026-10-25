# @vfx-ui/cli

Copy-paste [vfx-ui](https://vfx-ui.com) shader components into your project (shadcn registry format). Self-contained sources land in `components/` — you own the code.

## Usage

This source tree targets the unreleased 0.1.1 CLI. For the current catalog, use `npx shadcn@latest add https://vfx-ui.com/r/<component>.json` until the new CLI is published and verified. Commands below document this source version.

```bash
npx @vfx-ui/cli add wave-background
npx @vfx-ui/cli add wave-background fluid-gradient --overwrite
npx @vfx-ui/cli add hero-fluid --registry https://vfx-ui.com/r
```

The default registry is `https://vfx-ui.com/r`; pass `--registry <url|dir>` to point elsewhere (e.g. a locally built `registry/dist/r`).

Components are installed into `components/`, with shared helpers in
`components/vfx/`. Registry dependencies are installed recursively from the
selected registry, including when it is a local mirror. The CLI uses this fixed
layout; use shadcn if you need `components.json` alias mapping.

Install the npm dependencies printed by the command. For GPU components:

```bash
npm install vgpu@0.3.1
```

Then import your component from `components/WaveBackground` (using your project's
relative path or alias). Existing files are preserved unless `--overwrite` is
passed. Invalid paths, symlink destinations, and missing dependencies fail with
a nonzero exit code before files are written. See the [component gallery](https://vfx-ui.com/components) for the full catalog.

## License

MIT — © vfx-ui contributors.
