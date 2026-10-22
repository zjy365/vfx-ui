import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/preview-runtime/',
  resolve: { dedupe: ['react', 'react-dom'] },
  build: { outDir: 'dist', emptyOutDir: true, target: 'es2022' },
});
