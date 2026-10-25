import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { afterEach, test } from 'node:test';
import { fileURLToPath } from 'node:url';

const cli = process.env.VFX_CLI_TEST_ENTRY || fileURLToPath(new URL('../bin/cli.mjs', import.meta.url));
const fixtures = [];
afterEach(() => { for (const path of fixtures.splice(0)) rmSync(path, { recursive: true, force: true }); });
function fixture() {
  const path = mkdtempSync(resolve(tmpdir(), 'vfx-cli-test-'));
  fixtures.push(path);
  const app = resolve(path, 'app'), registry = resolve(path, 'registry');
  mkdirSync(app); mkdirSync(registry);
  return {
    app, registry, path,
    item(name, files, extra = {}) {
      writeFileSync(resolve(registry, name + '.json'), JSON.stringify({ name, files, ...extra }));
    },
    run(...args) { return spawnSync(process.execPath, [cli, 'add', ...args, '--registry', registry], { cwd: app, encoding: 'utf8' }); },
  };
}
const file = (target, content = 'export const Test = 1;') => ({ target, content });

test('maps registry aliases to real components paths and preserves helper imports', () => {
  const f = fixture();
  f.item('test', [file('@components/Test.tsx', "import './vfx/helper';"), file('@components/vfx/helper.ts')]);
  const result = f.run('test');
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.ok(existsSync(resolve(f.app, 'components/Test.tsx')));
  assert.ok(existsSync(resolve(f.app, 'components/vfx/helper.ts')));
  assert.ok(!existsSync(resolve(f.app, '@components')));
});

test('installs recursive registry dependencies once and reports their npm requirements', () => {
  const f = fixture();
  f.item('shared', [file('@components/Shared.tsx')], { dependencies: ['cobe@2.0.1'] });
  f.item('child', [file('@components/Child.tsx')], { registryDependencies: ['https://vfx-ui.com/r/shared.json'] });
  f.item('parent', [file('@components/Parent.tsx', "import './Child'; import './Shared';")], { registryDependencies: ['child', 'shared'] });
  const result = f.run('parent');
  assert.equal(result.status, 0, result.stdout + result.stderr);
  for (const name of ['Parent', 'Child', 'Shared']) assert.ok(existsSync(resolve(f.app, `components/${name}.tsx`)), name);
  assert.match(result.stdout, /npm install cobe@2\.0\.1/);
});

test('rejects unsafe targets before writing any file', () => {
  for (const target of ['../outside.txt', '@components/../../outside.txt', '/tmp/outside.txt', 'C:\\outside.txt', '@components/..\\outside.txt']) {
    const f = fixture();
    f.item('test', [file('@components/Safe.tsx'), file(target)]);
    const result = f.run('test');
    assert.notEqual(result.status, 0, target);
    assert.ok(!existsSync(resolve(f.app, 'components/Safe.tsx')), target);
    assert.ok(!existsSync(resolve(f.path, 'outside.txt')));
  }
});

test('rejects symlinks in destination directories and files even with overwrite', () => {
  for (const leaf of [false, true]) {
    const f = fixture(), outside = resolve(f.path, 'outside');
    mkdirSync(outside);
    if (leaf) {
      mkdirSync(resolve(f.app, 'components'));
      writeFileSync(resolve(outside, 'sentinel'), 'keep');
      symlinkSync(resolve(outside, 'sentinel'), resolve(f.app, 'components/Test.tsx'));
    } else symlinkSync(outside, resolve(f.app, 'components'));
    f.item('test', [file('@components/Test.tsx')]);
    assert.notEqual(f.run('test', '--overwrite').status, 0);
    if (leaf) assert.equal(readFileSync(resolve(outside, 'sentinel'), 'utf8'), 'keep');
    else assert.ok(!existsSync(resolve(outside, 'Test.tsx')));
  }
});

test('missing items and missing transitive dependencies fail without partial writes', () => {
  const f = fixture();
  assert.notEqual(f.run('missing').status, 0);
  f.item('parent', [file('@components/Parent.tsx')], { registryDependencies: ['missing'] });
  assert.notEqual(f.run('parent').status, 0);
  assert.ok(!existsSync(resolve(f.app, 'components/Parent.tsx')));
});

test('preserves existing files unless overwrite is requested', () => {
  const f = fixture();
  mkdirSync(resolve(f.app, 'components'));
  writeFileSync(resolve(f.app, 'components/Test.tsx'), 'user work');
  f.item('test', [file('@components/Test.tsx', 'updated')]);
  assert.equal(f.run('test').status, 0);
  assert.equal(readFileSync(resolve(f.app, 'components/Test.tsx'), 'utf8'), 'user work');
  assert.equal(f.run('test', '--overwrite').status, 0);
  assert.equal(readFileSync(resolve(f.app, 'components/Test.tsx'), 'utf8'), 'updated');
});
