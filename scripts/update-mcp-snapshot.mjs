import {readFile,writeFile} from 'node:fs/promises';
const registry=JSON.parse(await readFile(new URL('../registry/dist/index.json',import.meta.url),'utf8'));
await writeFile(new URL('../packages/mcp/src/data/registry.snapshot.json',import.meta.url),JSON.stringify(registry,null,2)+'\n');
console.log('MCP snapshot synchronized with the public registry.');
