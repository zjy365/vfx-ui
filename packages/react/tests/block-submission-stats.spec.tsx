// @vitest-environment jsdom
import { act, StrictMode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { BlockStats } from '../src/components/BlockStats';
import { BlockContact } from '../src/components/BlockContact';
import { BlockNewsletter } from '../src/components/BlockNewsletter';

(globalThis as Record<string, unknown>).IS_REACT_ACT_ENVIRONMENT = true;
let container: HTMLDivElement, root: Root;
let frames: Map<number, FrameRequestCallback>, observers: ((entries: { isIntersecting: boolean }[]) => void)[];
beforeEach(() => {
  frames = new Map(); observers = []; let id = 0;
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => { frames.set(++id, callback); return id; });
  vi.stubGlobal('cancelAnimationFrame', (key: number) => frames.delete(key));
  vi.stubGlobal('matchMedia', () => ({ matches: false }));
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: (entries: { isIntersecting: boolean }[]) => void) { observers.push(callback); }
    observe() {} disconnect() {}
  });
  container = document.createElement('div'); document.body.append(container); root = createRoot(container);
});
afterEach(() => { act(() => root.unmount()); container.remove(); vi.unstubAllGlobals(); });
function finishFrames() {
  expect(frames.size).toBeGreaterThan(0);
  act(() => { for (const [id, callback] of [...frames]) { frames.delete(id); callback(performance.now() + 2000); } });
}
it('finishes counting after StrictMode effect cleanup', () => {
  act(() => root.render(<StrictMode><BlockStats stats={[{ value: 42, label: 'Count' }]} /></StrictMode>));
  finishFrames();
  expect(container.querySelector('.vfx-stat-value [aria-hidden]')?.textContent).toBe('42');
});
it('restarts an interrupted count when a below-fold section becomes visible', () => {
  act(() => root.render(<BlockStats stats={[{ value: 42, label: 'Count' }]} />));
  act(() => observers[0]!([{ isIntersecting: false }]));
  act(() => observers[0]!([{ isIntersecting: true }]));
  finishFrames();
  expect(container.querySelector('.vfx-stat-value [aria-hidden]')?.textContent).toBe('42');
});

function deferred() {
  let resolve!: () => void, reject!: (error: Error) => void;
  const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function submit() { act(() => { container.querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); }); }
function email() {
  const input = container.querySelector('input[type=email]')!;
  act(() => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'person@example.com');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}
for (const kind of ['contact', 'newsletter'] as const) {
  function render(handler: () => void | Promise<void>) {
    act(() => root.render(kind === 'contact' ? <BlockContact onSubmit={handler} /> : <BlockNewsletter onSubscribe={handler} />));
    if (kind === 'newsletter') email();
  }
  it(`${kind} awaits success and blocks repeated submissions while pending`, async () => {
    const request = deferred(), handler = vi.fn(() => request.promise);
    render(handler); submit(); submit();
    expect(handler).toHaveBeenCalledTimes(1);
    expect(container.querySelector('form')).not.toBeNull();
    expect(container.querySelector<HTMLButtonElement>('button[type=submit]')?.disabled).toBe(true);
    await act(async () => request.resolve());
    expect(container.querySelector('[role=status]')).not.toBeNull();
  });
  it(`${kind} retains inputs on rejection and allows a successful retry`, async () => {
    const request = deferred(), handler = vi.fn().mockImplementationOnce(() => request.promise).mockResolvedValue(undefined);
    render(handler); email(); submit();
    await act(async () => request.reject(new Error('offline')));
    expect(container.querySelector('[role=alert]')?.textContent).toMatch(/try again/i);
    expect(container.querySelector<HTMLInputElement>('input[type=email]')?.value).toBe('person@example.com');
    expect(container.querySelector('[role=status]')).toBeNull();
    await act(async () => submit());
    expect(container.querySelector('[role=status]')).not.toBeNull();
  });
  it(`${kind} handles synchronous errors without a success message`, async () => {
    render(() => { throw new Error('offline'); });
    await act(async () => submit());
    expect(container.querySelector('[role=alert]')?.textContent).toMatch(/try again/i);
    expect(container.querySelector('[role=status]')).toBeNull();
  });
}
