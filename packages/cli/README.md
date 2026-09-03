# @vfx-ui/cli

Copy-paste [vfx-ui](https://vfx-ui.com) shader components into your project (shadcn registry format). Self-contained sources land in `components/` — you own the code.

## Usage

```bash
npx @vfx-ui/cli add wave-background
npx @vfx-ui/cli add wave-background fluid-gradient --overwrite
npx @vfx-ui/cli add hero-fluid --registry https://vfx-ui.com/r
```

The default registry is `https://vfx-ui.com/r`; pass `--registry <url|dir>` to point elsewhere (e.g. a locally built `registry/dist/r`).

After adding, install the runtime dependency:

```bash
npm install vgpu@0.3.1
```

Then import from `components/vfx/*`. See the [component gallery](https://vfx-ui.com/components) for the full catalog.

## License

MIT — © vfx-ui contributors.
