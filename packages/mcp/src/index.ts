#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import {
  listComponents,
  searchComponents,
  getComponent,
  getStyles,
  getDesignNotes,
} from "./tools.js";

const SERVER_NAME = "vfx-ui-mcp";
const SERVER_VERSION = "0.1.0";

const TOOLS: Tool[] = [
  {
    name: "vfx_list_components",
    title: "List VFX UI components",
    description:
      "List the VFX UI component catalog (name, title, description, categories per entry), grouped by category. Optionally filter with an exact category name: Heroes, Footers, Backgrounds, Interactions, Text, Glass, Blocks.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: 'Exact category name, case-insensitive (e.g. "Heroes"). Omit to list all.',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "vfx_search_components",
    title: "Search VFX UI components",
    description:
      "Keyword-search VFX UI components across name, title, description, tags and categories. Returns ranked matches. Use this to find a component by effect (e.g. \"aurora\", \"glass\", \"pricing\").",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search keyword(s), e.g. \"aurora\" or \"glass card\".",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "vfx_get_component",
    title: "Get VFX UI component details",
    description:
      "Full details for one VFX UI component: shadcn install command (npx shadcn@latest add <registry url>), dependencies, props summary, and the source file manifest with sizes. Set include_files=true to inline full source code (large payloads).",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: 'Registry name, e.g. "aurora" or "hero-eclipse".',
        },
        include_files: {
          type: "boolean",
          description:
            "Include the full source code of every file (default false: file paths, types and sizes only).",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "vfx_get_styles",
    title: "Get VFX UI styles and palette",
    description:
      "VFX UI visual language: core palette with hex values (mineral paper, charcoal green, cobalt), typography (Figtree Black display), and styling guidance for composing pages with VFX UI components.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "vfx_design_notes",
    title: "Get VFX UI design notes",
    description:
      "Interaction contracts and design principles from the VFX UI DESIGN.md: pointer locality, magnetic controls, reduced-motion behavior, SSR/WebGPU runtime notes, and direction boundaries for new components.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
];

async function callTool(name: string, args: unknown): Promise<string> {
  const raw = (args ?? {}) as Record<string, unknown>;
  switch (name) {
    case "vfx_list_components":
      return await listComponents(raw.category);
    case "vfx_search_components":
      return await searchComponents(raw.query);
    case "vfx_get_component":
      return await getComponent(raw.name, raw.include_files);
    case "vfx_get_styles":
      return getStyles();
    case "vfx_design_notes":
      return getDesignNotes();
    default:
      throw new Error(
        `Unknown tool "${name}". Available tools: ${TOOLS.map((tool) => tool.name).join(", ")}`,
      );
  }
}

async function main(): Promise<void> {
  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, () => ({ tools: TOOLS }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const text = await callTool(request.params.name, request.params.arguments);
      return {
        content: [{ type: "text", text }],
      };
    } catch (error) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Tool "${request.params.name}" failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(
    `[vfx-ui-mcp] ${SERVER_NAME} v${SERVER_VERSION} running on stdio (registry base: ${process.env.VFX_REGISTRY_BASE ?? "https://vfx-ui.com/r/"})\n`,
  );
}

main().catch((error: unknown) => {
  process.stderr.write(
    `[vfx-ui-mcp] fatal: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}\n`,
  );
  process.exit(1);
});
