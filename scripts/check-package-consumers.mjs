/** Packs the actual distributables and consumes them outside the workspace. */
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';

const root = resolve(import.meta.dirname, '..');
const work = await mkdtemp(resolve(tmpdir(), 'vfx-packages-'));
const run = (command, args, cwd = root) => execFileSync(command, args, { cwd, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } });
console.log(`Package consumer fixtures: ${work}`);
for (const name of ['core', 'react']) {
  run('pnpm', ['build'], resolve(root, 'packages', name));
  run('pnpm', ['pack', '--pack-destination', work], resolve(root, 'packages', name));
}
const tarballs = await readdir(work);
const core = resolve(work, tarballs.find(name => name.startsWith('vfx-ui-core-')));
const react = resolve(work, tarballs.find(name => name.startsWith('vfx-ui-react-')));
const catalog = JSON.parse(await readFile(resolve(root, 'catalog/generated.json'), 'utf8'));
const dom = await readFile(resolve(root, 'packages/react/dist/dom.js'), 'utf8');
assert.match(dom, /^"use client";/);
for (const name of await readdir(resolve(root, 'packages/react/src/components'))) {
  if (!name.endsWith('.tsx')) continue;
  const source = await readFile(resolve(root, 'packages/react/src/components', name), 'utf8');
  if (/^["']use client["'];/.test(source)) {
    assert.match(await readFile(resolve(root, 'packages/react/dist/components', name.replace(/\.tsx$/, '.js')), 'utf8'), /^["']use client["'];/, `Lost client boundary: ${name}`);
  }
}
for (const item of catalog.components.filter(item => item.runtime === 'dom')) assert.ok(dom.includes(`./components/${item.componentName}.js`), `Missing DOM export ${item.id}`);
const graph = await build({ entryPoints: [resolve(root, 'packages/react/dist/dom.js')], bundle: true, write: false, metafile: true, format: 'esm', platform: 'browser', external: ['react', 'react/jsx-runtime', 'react-dom'] });
assert.deepEqual(Object.keys(graph.metafile.inputs).filter(path => /node_modules.*vgpu|core\/dist|VfxCanvas/.test(path)), [], 'DOM entry imports the GPU runtime');

for (const [component, owner] of [['RibbonField', 'Meng To'], ['BlackHole', 'Vercel, Inc.'], ['PrismEngine', 'Vercel, Inc.'], ['RadianceEngine', 'Vercel, Inc.']]) {
  const distributed = await readFile(resolve(root, 'packages/react/dist/components', component + '.js'), 'utf8');
  assert.ok(distributed.includes(owner) && distributed.includes('Permission is hereby granted') && distributed.includes('THE SOFTWARE IS PROVIDED "AS IS"'), `${component}: built JavaScript lost its upstream MIT notice`);
}
console.log('Built JavaScript preserves complete upstream MIT notices without relying on source maps.');

for (const version of ['18.3.1', '19.3.1']) {
  const next = version.startsWith('19');
  const directory = resolve(work, next ? 'next-react19' : 'vite-react18');
  await mkdir(directory);
  await writeFile(resolve(directory, 'package.json'), JSON.stringify({ private: true, type: 'module', dependencies: {
    '@vfx-ui/core': `file:${core}`, '@vfx-ui/react': `file:${react}`, react: version, 'react-dom': version,
    ...(next ? { next: '16.4.2' } : { vite: '6.4.3' }),
  }, devDependencies: { typescript: '5.7.3', '@types/node': '^22.0.0', '@types/react': next ? '^19.0.0' : '^18.3.0', '@types/react-dom': next ? '^19.0.0' : '^18.3.0' } }, null, 2));
  run('npm', ['install', '--no-audit', '--no-fund', '--ignore-scripts'], directory);
  await writeFile(resolve(directory, 'ssr.mjs'), `import assert from 'node:assert/strict';\nimport React from 'react';\nimport { renderToString } from 'react-dom/server';\nimport { Magnetic, HeroContour } from '@vfx-ui/react/dom';\nimport { WaveBackground } from '@vfx-ui/react/components/WaveBackground';\nconst html = renderToString(React.createElement(React.Fragment, null, React.createElement(Magnetic, null, 'A real consumer'), React.createElement(HeroContour, { title: 'Original interfaces' }), React.createElement(WaveBackground)));\nassert.ok(html.includes('Original interfaces') && html.includes('<canvas'));\nconsole.log('SSR passed: React ${version}');\n`);
  run('node', ['ssr.mjs'], directory);
  if (next) {
    await mkdir(resolve(directory, 'app'));
    await writeFile(resolve(directory, 'next.config.mjs'), 'export default { output: "export", experimental: { cpus: 2 } };\n');
    await writeFile(resolve(directory, 'app/layout.tsx'), 'export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }\n');
    await writeFile(resolve(directory, 'app/page.tsx'), 'import { HeroContour } from "@vfx-ui/react/dom";\nimport { Magnetic } from "@vfx-ui/react/components/Magnetic";\nimport { WaveBackground } from "@vfx-ui/react/components/WaveBackground";\nexport default function Page() { return <main><HeroContour title="Original interfaces"/><Magnetic><a href="/">Open collection</a></Magnetic><section style={{height: 120}}><WaveBackground/></section></main>; }\n');
    run('npx', ['next', 'build', '--webpack'], directory);
    assert.ok((await readFile(resolve(directory, 'out/index.html'), 'utf8')).includes('Original interfaces'));
  } else {
    await writeFile(resolve(directory, 'index.html'), '<div id="root"></div><script type="module" src="/main.tsx"></script>');
    await writeFile(resolve(directory, 'main.tsx'), 'import React from "react";\nimport {createRoot} from "react-dom/client";\nimport {Magnetic} from "@vfx-ui/react/dom";\ncreateRoot(document.getElementById("root")!).render(<Magnetic><a href="/">Open collection</a></Magnetic>);\n');
    await writeFile(resolve(directory, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: true }, include: ['main.tsx'] }));
    run('npx', ['tsc'], directory);
    run('npx', ['vite', 'build'], directory);
  }
}
console.log('Actual npm tarballs passed React 18/Vite and React 19/Next static build; DOM graph contains no GPU modules.');
if (process.env.VFX_KEEP_CONSUMER_FIXTURES !== '1') await rm(work, { recursive: true, force: true });
