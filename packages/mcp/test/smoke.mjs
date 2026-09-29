#!/usr/bin/env node
/**
 * Smoke test: drives the MCP server over real stdio JSON-RPC.
 *
 * Usage:
 *   pnpm --filter @vfx-ui/mcp build && pnpm --filter @vfx-ui/mcp test
 *
 * Optional env:
 *   SMOKE_MCP_BIN   path to the built entry (default: dist/index.js)
 *   VFX_REGISTRY_BASE  forwarded to the server (default https://vfx-ui.com/r/)
 */
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const BIN = process.env.SMOKE_MCP_BIN ?? join(here, "..", "dist", "index.js");
const TIMEOUT_MS = 30_000;

/* Expected counts derive from the bundled snapshot so the smoke test never
   goes stale when the catalog grows. */
const snapshot = JSON.parse(readFileSync(join(here, "..", "src", "data", "registry.snapshot.json"), "utf8"));
const TOTAL_COMPONENTS = snapshot.items.length;
const GLASS_COUNT = snapshot.items.filter((i) => (i.categories ?? []).includes("Glass")).length;

const failures = [];
function check(label, ok, detail = "") {
  if (ok) {
    console.log(`  PASS ${label}`);
  } else {
    failures.push(label);
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

function snippet(text, max = 420) {
  const flat = text.replaceAll("\n", "\\n");
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

function startServer(extraEnv = {}) {
  const child = spawn(process.execPath, [BIN], {
    stdio: ["pipe", "pipe", "inherit"], // stderr visible, stdout is the protocol
    env: { ...process.env, ...extraEnv },
  });
  let buffer = "";
  const pending = new Map();
  child.stdout.on("data", (chunk) => {
    buffer += chunk.toString("utf8");
    let newline;
    while ((newline = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line) continue;
      let message;
      try {
        message = JSON.parse(line);
      } catch {
        continue;
      }
      if (message.id !== undefined && pending.has(message.id)) {
        pending.get(message.id)(message);
        pending.delete(message.id);
      }
    }
  });
  let nextId = 1;
  const request = (method, params) =>
    new Promise((resolve, reject) => {
      const id = nextId++;
      const timer = setTimeout(
        () => reject(new Error(`timeout waiting for ${method}`)),
        TIMEOUT_MS,
      );
      pending.set(id, (message) => {
        clearTimeout(timer);
        resolve(message);
      });
      child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
    });
  const notify = (method, params) => {
    child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method, params })}\n`);
  };
  const stop = () =>
    new Promise((resolve) => {
      child.on("exit", resolve);
      child.kill("SIGKILL");
    });
  return { request, notify, stop };
}

function toolText(response) {
  const result = response.result ?? {};
  return result.content?.map((part) => part.text ?? "").join("\n") ?? "";
}

async function main() {
  console.log(`SMOKE vfx-ui-mcp (${BIN})`);

  // --- Scenario 1: default configuration (live registry, snapshot fallback) ---
  console.log("\n[1] default base");
  const server = startServer();

  const init = await server.request("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "smoke", version: "0.0.0" },
  });
  check(
    "initialize returns serverInfo",
    init.result?.serverInfo?.name === "vfx-ui-mcp",
    JSON.stringify(init.result?.serverInfo),
  );
  server.notify("notifications/initialized");

  const toolsList = await server.request("tools/list", {});
  const toolNames = (toolsList.result?.tools ?? []).map((tool) => tool.name);
  check(
    "tools/list exposes 5 tools",
    JSON.stringify(toolNames) ===
      JSON.stringify([
        "vfx_list_components",
        "vfx_search_components",
        "vfx_get_component",
        "vfx_get_styles",
        "vfx_design_notes",
      ]),
    toolNames.join(","),
  );

  const listAll = await server.request("tools/call", {
    name: "vfx_list_components",
    arguments: {},
  });
  const listAllText = toolText(listAll);
  console.log(`  >> ${snippet(listAllText)}`);
  check(`list all mentions ${TOTAL_COMPONENTS} components`, listAllText.includes(`${TOTAL_COMPONENTS} components`));
  check("list all is not an error", listAll.result?.isError !== true);

  const listGlass = await server.request("tools/call", {
    name: "vfx_list_components",
    arguments: { category: "Glass" },
  });
  const glassText = toolText(listGlass);
  console.log(`  >> ${snippet(glassText)}`);
  check(`list Glass (${GLASS_COUNT}) includes glass-card`, glassText.includes(`## Glass (${GLASS_COUNT})`) && glassText.includes("glass-card"));

  const search = await server.request("tools/call", {
    name: "vfx_search_components",
    arguments: { query: "aurora" },
  });
  const searchText = toolText(search);
  console.log(`  >> ${snippet(searchText)}`);
  check(
    "search 'aurora' finds aurora + hero-aurora",
    searchText.includes("- aurora ") && searchText.includes("hero-aurora"),
  );

  const detail = await server.request("tools/call", {
    name: "vfx_get_component",
    arguments: { name: "aurora" },
  });
  const detailText = toolText(detail);
  console.log(`  >> ${snippet(detailText, 560)}`);
  check(
    "get aurora has install command",
    detailText.includes("npx shadcn@latest add https://vfx-ui.com/r/aurora.json"),
  );
  check(
    "get aurora lists files",
    detailText.includes("## Files") && detailText.includes("components/Aurora.tsx"),
  );
  check("get aurora props section present", detailText.includes("## Props"));

  const detailFull = await server.request("tools/call", {
    name: "vfx_get_component",
    arguments: { name: "aurora", include_files: true },
  });
  const fullText = toolText(detailFull);
  const hasSource = fullText.includes("### vfx/VfxCanvas.tsx") || fullText.includes("Full source unavailable");
  check(
    "get aurora include_files=true -> source or explicit unavailability",
    hasSource && fullText.includes("## Source"),
  );
  console.log(
    `  >> include_files payload: ${String(fullText.length)} chars; source inlined: ${fullText.includes("```tsx")}`,
  );

  const styles = await server.request("tools/call", {
    name: "vfx_get_styles",
    arguments: {},
  });
  const stylesText = toolText(styles);
  console.log(`  >> ${snippet(stylesText, 200)}`);
  check(
    "styles include palette hexes",
    stylesText.includes("#eeefe9") && stylesText.includes("#2349db") && stylesText.includes("#202520"),
  );

  const notes = await server.request("tools/call", {
    name: "vfx_design_notes",
    arguments: {},
  });
  const notesText = toolText(notes);
  check(
    "design notes cover interaction contracts",
    notesText.includes("prefers-reduced-motion") && notesText.includes("Interaction contracts"),
  );

  const missing = await server.request("tools/call", {
    name: "vfx_get_component",
    arguments: { name: "does-not-exist" },
  });
  check(
    "unknown component returns isError",
    missing.result?.isError === true || toolText(missing).includes("not found"),
  );

  const badTool = await server.request("tools/call", {
    name: "vfx_nope",
    arguments: {},
  });
  check("unknown tool returns isError", badTool.result?.isError === true);
  await server.stop();

  // --- Scenario 2: unreachable custom base -> bundled snapshot fallback ---
  console.log("\n[2] VFX_REGISTRY_BASE=http://127.0.0.1:9/r/ (unreachable -> snapshot fallback)");
  const offline = startServer({ VFX_REGISTRY_BASE: "http://127.0.0.1:9/r/" });
  const offlineInit = await offline.request("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "smoke", version: "0.0.0" },
  });
  check("offline initialize ok", offlineInit.result?.serverInfo?.name === "vfx-ui-mcp");
  const offlineList = await offline.request("tools/call", {
    name: "vfx_list_components",
    arguments: {},
  });
  const offlineText = toolText(offlineList);
  console.log(`  >> ${snippet(offlineText, 200)}`);
  check(
    "offline list falls back to bundled snapshot",
    offlineText.includes("bundled-snapshot") && offlineText.includes(`${TOTAL_COMPONENTS} components`),
  );
  const offlineDetail = await offline.request("tools/call", {
    name: "vfx_get_component",
    arguments: { name: "glass-lens" },
  });
  const offlineDetailText = toolText(offlineDetail);
  console.log(`  >> ${snippet(offlineDetailText, 200)}`);
  check(
    "offline detail still yields install command (local base)",
    offlineDetailText.includes("npx shadcn@latest add http://127.0.0.1:9/r/glass-lens.json"),
  );
  await offline.stop();

  console.log(
    failures.length === 0
      ? "\nSMOKE OK — all checks passed"
      : `\nSMOKE FAILED — ${String(failures.length)} check(s): ${failures.join("; ")}`,
  );
  process.exitCode = failures.length === 0 ? 0 : 1;
}

main().catch((error) => {
  console.error("SMOKE CRASHED", error);
  process.exitCode = 1;
});
