# @vfx-ui/mcp

MCP (Model Context Protocol) server for [VFX UI](https://vfx-ui.com) — the shader-native React component library rendered via WebGPU. It lets Claude Code, Cursor, Codex (or any MCP client) search the VFX UI registry, read component docs, and hand users ready-to-run `shadcn` install commands.

- Transport: stdio (Node ≥ 18, no heavyweight runtime deps beyond the official SDK)
- Data: fetches `https://vfx-ui.com/r/registry.json` at runtime (5 min cache) and falls back to a registry snapshot bundled inside the package when offline
- Override the registry with `VFX_REGISTRY_BASE` (e.g. a local docs server: `http://127.0.0.1:4173/r/`)

## Tools

| Tool | Arguments | Returns |
| --- | --- | --- |
| `vfx_list_components` | `category?: string` | Catalog summary grouped by category (Heroes, Footers, Backgrounds, Interactions, Text, Glass, Blocks): `name / title / description / categories` |
| `vfx_search_components` | `query: string` | Keyword matches across name, title, description, tags, categories (ranked) |
| `vfx_get_component` | `name: string`, `include_files?: boolean` | Install command (`npx shadcn@latest add https://vfx-ui.com/r/<name>.json`), dependencies, props summary, file manifest with sizes; `include_files: true` inlines full source |
| `vfx_get_styles` | — | Visual language from the repo `DESIGN.md`: palette (`#eeefe9` mineral paper, `#202520` charcoal green, `#2349db` cobalt), typography, styling guidance |
| `vfx_design_notes` | — | Interaction contracts and design principles: pointer locality, reduced motion, SSR/WebGPU notes, direction boundaries |

All results are markdown text, so they work in every MCP client.

## Client configuration

### Claude Code

Command line (user scope):

```bash
claude mcp add vfx-ui -- npx -y @vfx-ui/mcp
```

Or project scope via `.mcp.json` in the repo root:

```json
{
  "mcpServers": {
    "vfx-ui": {
      "command": "npx",
      "args": ["-y", "@vfx-ui/mcp"]
    }
  }
}
```

### Cursor

`~/.cursor/mcp.json` (or a project-level `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "vfx-ui": {
      "command": "npx",
      "args": ["-y", "@vfx-ui/mcp"]
    }
  }
}
```

### Codex

`~/.codex/config.toml`:

```toml
[mcp_servers.vfx-ui]
command = "npx"
args = ["-y", "@vfx-ui/mcp"]

# optional: point at a local registry during development
# [mcp_servers.vfx-ui.env]
# VFX_REGISTRY_BASE = "http://127.0.0.1:4173/r/"
```

### Local development (unpublished package)

Until `@vfx-ui/mcp` is on npm, point any of the three clients at the built binary instead of `npx`:

```json
{ "command": "node", "args": ["/absolute/path/to/vfx-ui/packages/mcp/dist/index.js"] }
```

Build first: `pnpm --filter @vfx-ui/mcp build`. The bin name after publishing is `vfx-ui-mcp`.

## Environment variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `VFX_REGISTRY_BASE` | `https://vfx-ui.com/r/` | Base URL for `registry.json` and `<name>.json`. Component docs are derived from it (`/r/` → `/components/<name>.md`). |

## Example session

Ask your agent:

- "List VFX UI components in the Glass category" → `vfx_list_components(category: "Glass")`
- "Find an aurora-style background" → `vfx_search_components(query: "aurora")`
- "How do I install Aurora and what props does it take?" → `vfx_get_component(name: "aurora")`
  - Install: `npx shadcn@latest add https://vfx-ui.com/r/aurora.json`

## Development

```bash
pnpm --filter @vfx-ui/mcp build     # tsc -> dist/
pnpm --filter @vfx-ui/mcp typecheck
pnpm --filter @vfx-ui/mcp test      # stdio smoke test: initialize / tools/list / tools/call
```

The fallback snapshot lives at `src/data/registry.snapshot.json`. Refresh it with:

```bash
cp ../../apps/docs/public/r/registry.json src/data/registry.snapshot.json
```

(run from `packages/mcp/`; rebuild afterwards).

## License

MIT
