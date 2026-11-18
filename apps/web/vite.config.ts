import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@markflow/markdown-core': path.resolve(__dirname, '../../packages/markdown-core/src'),
    },
  },
  server: {
    port: 3000,
  },
});
