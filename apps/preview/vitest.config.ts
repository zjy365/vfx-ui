import { defineConfig } from 'vitest/config';
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: { environment: 'jsdom', include: ['tests/**/*.spec.tsx'], environmentOptions: { jsdom: { url: 'http://localhost/?component=fluid-gradient&scheme=light' } } },
});
