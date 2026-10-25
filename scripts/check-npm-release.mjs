/** Verify the public registry, independently of workspace links/local tarballs. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const packages = await Promise.all(['core', 'react', 'cli'].map(async (name) =>
  JSON.parse(await readFile(resolve(root, 'packages', name, 'package.json'), 'utf8')),
));
let failures = 0;
for (const local of packages) {
  try {
    const published = JSON.parse(execFileSync('npm', ['view', local.name, '--json', '--registry=https://registry.npmjs.org/'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
    assert.equal(published.version, local.version, 'npm latest does not match this source version');
    if (local.exports) assert.deepEqual(published.exports, local.exports, 'npm export map does not match this source');
    assert.ok(published.dist?.integrity && published.dist?.tarball, 'npm package is missing its immutable distribution');
    console.log(`PASS ${local.name}@${local.version}: latest version, exports and distribution`);
  } catch (error) {
    failures++;
    console.error(`FAIL ${local.name}@${local.version}: ${error instanceof assert.AssertionError ? error.message : 'npm metadata could not be verified'}`);
  }
}
if (failures) process.exit(1);

const consumer = await mkdtemp(resolve(tmpdir(), 'vfx-public-npm-'));
try {
  await writeFile(resolve(consumer, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
  execFileSync('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org/', ...packages.map(p => `${p.name}@${p.version}`), 'react@18.3.1', 'react-dom@18.3.1'], { cwd: consumer, stdio: 'inherit' });
  await writeFile(resolve(consumer, 'verify.mjs'), `import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { HeroContour } from '@vfx-ui/react/dom';
import { Magnetic } from '@vfx-ui/react/components/Magnetic';
assert.ok(renderToString(React.createElement(HeroContour, { title: 'Published distribution' })).includes('Published distribution'));
assert.equal(typeof Magnetic, 'function');
console.log('Public npm consumer passed: /dom, component exports and SSR');
`);
  execFileSync(process.execPath, ['verify.mjs'], { cwd: consumer, stdio: 'inherit' });
} finally {
  await rm(consumer, { recursive: true, force: true });
}
