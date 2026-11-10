import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the built site works from any folder or a GitHub Pages sub-path.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2022' },
  test: { include: ['tests/**/*.test.ts'], environment: 'node' },
} as never);
