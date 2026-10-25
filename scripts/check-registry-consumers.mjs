/** Exercise generated copy-paste JSON in independent React 19 component trees. */
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, readdir, rm, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, extname, resolve, relative, posix } from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import { createServer } from 'node:http';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
const work = await mkdtemp(resolve(tmpdir(), 'vfx-registry-'));
const registry = resolve(work, 'registry');
const app = resolve(work, 'consumer');
const entries = { 'hero-contour': 'HeroContour', 'footer-vinyl': 'FooterVinyl', magnetic: 'Magnetic', 'fluid-gradient': 'FluidGradient', 'hero-fluid-minimal': 'HeroFluidMinimal', 'example-launch': 'ExampleLaunch' };
const run = (command, args, cwd = root) => execFileSync(command, args, { cwd, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
// Resolve the supported placeholder to a canonical virtual component tree.
// Real CLI fixtures below verify the actual filesystem/alias mapping as well.
const componentTarget = (file) => {
  const target = file.target ?? file.path;
  assert.ok(target.startsWith('@components/'), `Expected an alias-aware registry target: ${target}`);
  return 'components/' + target.slice('@components/'.length);
};
console.log(`Registry consumer fixture: ${work}`);
run('node', ['registry/build.mjs', '--out', registry]);
// Every item must be independently complete. Installing the entire collection
// together could conceal a missing helper supplied by an unrelated item.
const items = new Map();
for (const file of await readdir(resolve(registry, 'r'))) {
  if (!file.endsWith('.json')) continue;
  const item = JSON.parse(await readFile(resolve(registry, 'r', file), 'utf8'));
  items.set(item.name, item);
}
const metadata = JSON.parse(await readFile(resolve(root, 'catalog/metadata.json'), 'utf8'));
assert.equal(items.size, metadata.length);
const incomplete = [];
for (const [id, item] of items) {
  const visited = new Set();
  const files = new Map();
  const packages = new Set();
  const collect = (current) => {
    if (visited.has(current.name)) return;
    visited.add(current.name);
    for (const dependency of current.registryDependencies ?? []) {
      const name = new URL(dependency).pathname.split('/').at(-1).replace(/\.json$/, '');
      assert.ok(items.has(name), `${id}: unknown registry dependency ${name}`);
      collect(items.get(name));
    }
    for (const file of current.files) {
      if (/Copyright (?:\(c\) )?20\d{2} (?:Meng To|Vercel, Inc\.)/.test(file.content)) {
        assert.ok(file.content.includes('Permission is hereby granted') && file.content.includes('THE SOFTWARE IS PROVIDED "AS IS"'), `${id}: ${file.path} is missing the complete upstream MIT notice`);
      }
      const target = componentTarget(file);
      if (files.has(target)) assert.equal(files.get(target), file.content, `${id}: conflicting shared file ${target}`);
      files.set(target, file.content);
    }
    for (const dependency of current.dependencies ?? []) packages.add(dependency);
  };
  collect(item);
  for (const [path, content] of files) {
    const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    for (const statement of source.statements) {
      if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
      const specifier = statement.moduleSpecifier;
      if (!specifier || !ts.isStringLiteral(specifier) || !specifier.text.startsWith('.')) continue;
      const target = posix.normalize(posix.join(posix.dirname(path), specifier.text));
      if (![target, target + '.ts', target + '.tsx', target + '/index.ts', target + '/index.tsx'].some(candidate => files.has(candidate))) {
        incomplete.push(`${id}: ${path} cannot resolve ${specifier.text}`);
      }
    }
  }
  if (metadata.find(entry => entry.id === id)?.runtime === 'dom') {
    assert.ok(![...packages].some(name => /^vgpu(?:@|\/|$)/.test(name)), `${id}: DOM registry item installs GPU dependencies`);
    assert.ok(!files.has('components/vfx/VfxCanvas.tsx'), `${id}: DOM registry item contains the GPU canvas`);
  }
}
assert.deepEqual(incomplete, [], 'Some registry items are not independently complete');
console.log(`${items.size} registry entries passed recursive completeness and DOM/GPU boundary checks.`);
await mkdir(app);
const dependencies = { next: '16.4.2', react: '19.3.1', 'react-dom': '19.3.1' };
const allFiles = [];
const missing = [];
for (const [id, component] of Object.entries(entries)) {
  const installed = new Set();
  const files = new Map();
  const base = resolve(app, 'components', id);
  async function install(name) {
    if (installed.has(name)) return;
    installed.add(name);
    const item = JSON.parse(await readFile(resolve(registry, 'r', `${name}.json`), 'utf8'));
    for (const dependency of item.registryDependencies ?? []) {
      const url = new URL(dependency);
      await install(decodeURIComponent(url.pathname.split('/').at(-1)).replace(/\.json$/, ''));
    }
    for (const dependency of item.dependencies ?? []) {
      const at = dependency.lastIndexOf('@');
      const name = at > 0 ? dependency.slice(0, at) : dependency;
      const version = at > 0 ? dependency.slice(at + 1) : '*';
      assert.ok(!dependencies[name] || dependencies[name] === version, `Dependency conflict: ${name}`);
      dependencies[name] = version;
    }
    for (const file of item.files) {
      assert.equal(typeof file.content, 'string', `Missing content ${name}:${file.path}`);
      const target = componentTarget(file);
      assert.ok(target.startsWith('components/'), `Unexpected target ${target}`);
      const local = resolve(base, target.slice('components/'.length));
      assert.ok(local.startsWith(base + '/'), `Unsafe target ${target}`);
      if (files.has(local)) assert.equal(files.get(local), file.content, `Conflicting shared file ${target}`);
      else files.set(local, file.content);
    }
  }
  await install(id);
  for (const [path, content] of files) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
    allFiles.push(path);
  }
  await mkdir(resolve(app, 'app', id), { recursive: true });
  await writeFile(resolve(app, 'app', id, 'page.tsx'), `import { ${component} } from '../../components/${id}/${component}';\nexport default function Page() { return <main><${component}/></main>; }\n`);
  console.log(`${id}: ${installed.size} registry items; ${files.size} files`);
}
// Exercise the published CLI package too: shadcn's resolver cannot validate it.
const cliInstall = resolve(work, 'cli-install');
await mkdir(cliInstall);
await writeFile(resolve(cliInstall, 'package.json'), JSON.stringify({ private: true }));
run('pnpm', ['pack', '--pack-destination', cliInstall], resolve(root, 'packages/cli'));
const cliArchive = (await readdir(cliInstall)).find(name => name.endsWith('.tgz'));
assert.ok(cliArchive, 'CLI package archive was not created');
run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', resolve(cliInstall, cliArchive)], cliInstall);
run(resolve(cliInstall, 'node_modules/.bin/vfx-ui'), ['add', 'example-launch', 'aurora', 'hero-contour', '--registry', resolve(registry, 'r')], app);
for (const name of ['ExampleLaunch', 'BlockNav', 'Aurora', 'HeroContour']) {
  await access(resolve(app, 'components', name + '.tsx'));
}
await access(resolve(app, 'components/vfx/VfxCanvas.tsx'));
await assert.rejects(access(resolve(app, '@components')));
await mkdir(resolve(app, 'app/cli'));
await writeFile(resolve(app, 'app/cli/page.tsx'), 'import { ExampleLaunch } from "../../components/ExampleLaunch";\nimport { Aurora } from "../../components/Aurora";\nexport default function Page() { return <main><ExampleLaunch/><Aurora/></main>; }\n');
console.log('Installed CLI tarball resolved example dependencies and DOM/GPU files into components/.');
for (const path of allFiles) {
  const content = await readFile(path, 'utf8');
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true, extname(path) === '.tsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
    const specifier = statement.moduleSpecifier;
    if (!specifier || !ts.isStringLiteral(specifier)) continue;
    if (specifier.text.startsWith('@vfx-ui/')) missing.push(`${relative(app, path)} still imports ${specifier.text}`);
    if (!specifier.text.startsWith('.')) continue;
    const target = resolve(dirname(path), specifier.text);
    let found = false;
    for (const candidate of [target, target + '.ts', target + '.tsx', target + '/index.ts', target + '/index.tsx']) {
      try { await access(candidate); found = true; break; } catch {}
    }
    if (!found) missing.push(`${relative(app, path)} cannot resolve ${specifier.text}`);
  }
  if (path.endsWith('/VfxCanvas.tsx')) {
    assert.ok(ts.isExpressionStatement(source.statements[0]) && ts.isStringLiteral(source.statements[0].expression) && source.statements[0].expression.text === 'use client', `Missing first client directive: ${path}`);
  }
}
assert.deepEqual(missing, [], 'Registry files are not self-contained');
await writeFile(resolve(app, 'package.json'), JSON.stringify({ private: true, type: 'module', dependencies, devDependencies: { typescript: '5.7.3', '@types/node': '^22.0.0', '@types/react': '^19.0.0', '@types/react-dom': '^19.0.0', '@webgpu/types': '^0.1.69' } }, null, 2));
await writeFile(resolve(app, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', lib: ['dom', 'dom.iterable', 'ES2022'], module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: true, types: ['@webgpu/types', 'node'] }, include: ['app/**/*.tsx', 'components/**/*.ts', 'components/**/*.tsx'] }, null, 2));
await writeFile(resolve(app, 'next.config.mjs'), 'export default { output: "export", experimental: { cpus: 2 } };\n');
await writeFile(resolve(app, 'app', 'layout.tsx'), 'export default function Layout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }\n');
await writeFile(resolve(app, 'app', 'page.tsx'), 'export default function Page() { return <main>Registry consumer</main>; }\n');
run('npm', ['install', '--no-audit', '--no-fund', '--ignore-scripts'], app);
run('npx', ['tsc'], app);
run('npx', ['next', 'build', '--webpack'], app);
for (const id of Object.keys(entries)) assert.ok((await readFile(resolve(app, 'out', id + '.html'), 'utf8')).includes('<main>'));
console.log(`${Object.keys(entries).length} independent registry installs passed TypeScript and React 19 / Next 16 static export.`);
// Exercise shadcn itself. A virtual copy alone would not catch CLI target
// resolution ignoring components.json aliases or flattening the vfx subtree.
const runAsync = (command, args, cwd) => new Promise((resolveRun, reject) => {
  const child = spawn(command, args, { cwd, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
  child.on('error', reject);
  child.on('close', code => code === 0 ? resolveRun() : reject(new Error(`${command} exited ${code}`)));
});
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
  const filename = resolve(registry, '.' + decodeURIComponent(pathname));
  if (!filename.startsWith(registry + '/') || !filename.endsWith('.json')) {
    response.writeHead(404).end();
    return;
  }
  try {
    response.setHeader('content-type', 'application/json');
    response.end(await readFile(filename));
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolveListen, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolveListen);
});
const address = server.address();
const registryUrl = `http://127.0.0.1:${address.port}/r/`;
try {
  for (const fixture of [
    { name: 'root-alias', src: false, components: 'components' },
    { name: 'src-alias', src: true, components: 'components' },
    { name: 'custom-alias', src: false, components: 'shared/components' },
  ]) {
    const directory = resolve(work, 'cli-' + fixture.name);
    const sourceRoot = fixture.src ? 'src/' : '';
    const componentsAlias = '@/' + fixture.components;
    const componentsDirectory = resolve(directory, sourceRoot, fixture.components);
    await mkdir(resolve(directory, sourceRoot, 'app'), { recursive: true });
    await writeFile(resolve(directory, 'package.json'), JSON.stringify({
      name: 'vfx-registry-' + fixture.name,
      private: true,
      type: 'module',
      dependencies: { next: '16.4.2', react: '19.3.1', 'react-dom': '19.3.1', tailwindcss: '4.3.3' },
      devDependencies: { typescript: '5.7.3', '@types/react': '19.2.2', '@types/react-dom': '19.2.2', '@types/node': '22.19.0', '@webgpu/types': '0.1.69' },
    }, null, 2));
    await writeFile(resolve(directory, 'next.config.mjs'), 'export default {};\n');
    await writeFile(resolve(directory, sourceRoot, 'app/globals.css'), '@import "tailwindcss";\n');
    await writeFile(resolve(directory, 'components.json'), JSON.stringify({
      $schema: 'https://ui.shadcn.com/schema.json', style: 'new-york', rsc: true, tsx: true,
      tailwind: { config: '', css: sourceRoot + 'app/globals.css', baseColor: 'neutral', cssVariables: true },
      aliases: { components: componentsAlias, ui: componentsAlias + '/ui', utils: '@/lib/utils', lib: '@/lib', hooks: '@/hooks' },
    }, null, 2));
    await writeFile(resolve(directory, 'tsconfig.json'), JSON.stringify({
      compilerOptions: { target: 'ES2022', lib: ['DOM', 'ES2022'], module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, noEmit: true, baseUrl: '.', paths: { '@/*': [fixture.src ? './src/*' : './*'] }, types: ['node', '@webgpu/types'] },
      include: ['**/*.ts', '**/*.tsx'],
    }, null, 2));
    const cli = ['--yes', 'shadcn@4.22.1', 'add'];
    await runAsync('npx', [...cli, registryUrl + 'hero-contour.json', '--yes', '--overwrite', '--cwd', directory], directory);
    await access(resolve(componentsDirectory, 'HeroContour.tsx'));
    const domPackage = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8'));
    assert.ok(!domPackage.dependencies?.vgpu, `${fixture.name}: installing a DOM hero pulled in vgpu`);
    await assert.rejects(access(resolve(componentsDirectory, 'vfx/VfxCanvas.tsx')), `${fixture.name}: DOM hero installed the GPU canvas`);
    await runAsync('npx', [...cli, registryUrl + 'aurora.json', '--yes', '--overwrite', '--cwd', directory], directory);
    await access(resolve(componentsDirectory, 'Aurora.tsx'));
    await access(resolve(componentsDirectory, 'vfx/VfxCanvas.tsx'));
    const gpuPackage = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8'));
    // npm records a caret range even when the registry requests vgpu@0.3.1.
    // Verify the installed package, rather than npm's package.json notation.
    assert.ok(gpuPackage.dependencies.vgpu, `${fixture.name}: GPU item did not install vgpu`);
    const installedGpu = JSON.parse(await readFile(resolve(directory, 'node_modules/vgpu/package.json'), 'utf8'));
    assert.equal(installedGpu.version, '0.3.1');
    await writeFile(resolve(directory, sourceRoot, 'app/page.tsx'), `import { HeroContour } from '${componentsAlias}/HeroContour';\nimport { Aurora } from '${componentsAlias}/Aurora';\nexport default function Page() { return <main><HeroContour/><Aurora/></main>; }\n`);
    await runAsync('npx', ['--no-install', 'tsc', '--pretty', 'false'], directory);
    console.log(`Real shadcn 4.22.1 ${fixture.name}: HeroContour + Aurora installed into ${sourceRoot}${fixture.components}; alias imports typechecked.`);
  }
} finally {
  await new Promise(resolveClose => server.close(resolveClose));
}
if (process.env.VFX_KEEP_CONSUMER_FIXTURES !== '1') await rm(work, { recursive: true, force: true });
