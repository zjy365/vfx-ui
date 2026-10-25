import { act } from 'react';
import type { Root } from 'react-dom/client';
import { afterAll, beforeAll, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ root: null as Root | null }));
vi.mock('react-dom/client', async importOriginal => {
  const actual = await importOriginal<typeof import('react-dom/client')>();
  return { ...actual, createRoot: (...args: Parameters<typeof actual.createRoot>) => (state.root = actual.createRoot(...args)) };
});
vi.mock('../../../packages/react/src/components/FluidGradient.tsx', () => ({
  FluidGradient: ({ warp = 2.4, scheme, fallback }: { warp?: number; scheme?: string; fallback?: React.ReactNode }) => <section data-warp={warp} data-component-scheme={scheme}>{fallback}</section>,
}));
(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
beforeAll(async () => {
  document.body.innerHTML = '<div id="root"></div>';
  await act(async () => { await import('../src/main'); });
  await vi.waitFor(() => expect(document.querySelector('[data-warp]')).not.toBeNull());
});
afterAll(() => { act(() => state.root?.unmount()); vi.restoreAllMocks(); });
function send(props: Record<string, unknown>, scheme = 'light') {
  act(() => window.dispatchEvent(new MessageEvent('message', { origin: location.origin, source: window, data: { type: 'vfx:preview', scheme, props } })));
}
it('replaces preset snapshots so omitted values return to their initial defaults', () => {
  send({ warp: 2.6 });
  expect(document.querySelector('[data-warp]')?.getAttribute('data-warp')).toBe('2.6');
  send({});
  expect(document.querySelector('[data-warp]')?.getAttribute('data-warp')).toBe('2.4');
});
it('uses the component scheme when supplied rather than shadowing it', () => {
  send({ scheme: 'dark' }, 'light');
  expect(document.querySelector('[data-component-scheme]')?.getAttribute('data-component-scheme')).toBe('dark');
});
it('hydrates serialized fallback elements received over postMessage', () => {
  send({ fallback: { type: 'img', props: { src: '/fallback.png', alt: 'Still preview' } } });
  expect(document.querySelector('img[alt="Still preview"]')?.getAttribute('src')).toBe('/fallback.png');
  expect(document.querySelector('[role=alert]')).toBeNull();
});
